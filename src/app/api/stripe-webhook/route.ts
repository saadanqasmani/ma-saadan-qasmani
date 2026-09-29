import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { confirmOrder, linesFromRow, localeOf } from "@/lib/book/confirm";

/**
 * Stripe telling us the money arrived.
 *
 * Nothing here trusts the request until the signature checks out: anyone can
 * post to a public URL claiming an order is paid, so the body is verified
 * against the endpoint's signing secret before a single row is touched. The
 * timestamp is checked too, so a delivery captured off the wire cannot be
 * replayed a week later.
 */

/** How old a delivery may be before it is treated as a replay. */
const TOLERANCE_SECONDS = 300;

export const dynamic = "force-dynamic";

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function signatureIsGood(raw: string, header: string, secret: string): Promise<boolean> {
  const parts = Object.fromEntries(
    header.split(",").map((p) => {
      const i = p.indexOf("=");
      return [p.slice(0, i).trim(), p.slice(i + 1).trim()];
    })
  );
  const t = Number(parts.t);
  if (!Number.isFinite(t)) return false;
  if (Math.abs(Date.now() / 1000 - t) > TOLERANCE_SECONDS) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${t}.${raw}`));
  const mine = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Stripe may send several v1 signatures during a secret rotation.
  return header
    .split(",")
    .filter((p) => p.trim().startsWith("v1="))
    .some((p) => timingSafeEqual(p.trim().slice(3), mine));
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) {
    console.error("[pre-order] a webhook arrived but STRIPE_WEBHOOK_SECRET is not set.");
    return NextResponse.json({ error: "not configured" }, { status: 503 });
  }

  const raw = await request.text();
  const header = request.headers.get("stripe-signature");
  if (!header || !(await signatureIsGood(raw, header, secret))) {
    console.error("[pre-order] a webhook arrived with a signature that did not check out.");
    return NextResponse.json({ error: "bad signature" }, { status: 400 });
  }

  const event = JSON.parse(raw) as {
    type?: string;
    data?: { object?: { id?: string; metadata?: Record<string, string>; payment_status?: string } };
  };
  const session = event.data?.object;
  const orderId = session?.metadata?.order_id;

  const db = getAdminClient();
  if (!db) {
    console.error("[pre-order] a paid webhook arrived but the database is not connected.");
    return NextResponse.json({ error: "no database" }, { status: 503 });
  }

  const locale = localeOf(session?.metadata?.locale);

  if (event.type === "checkout.session.completed" && session?.payment_status === "paid" && orderId) {
    // Updated and read back in one call, so the receipt is built from the row
    // as it now stands rather than from what the webhook happened to carry.
    const { data, error } = await db
      .from("book_orders")
      .update({ payment_status: "paid", paid_at: new Date().toISOString(), status: "payment_received" })
      .eq("id", orderId)
      .select("*")
      .maybeSingle();

    if (error) console.error(`[pre-order] could not mark ${orderId} paid: ${error.message}`);
    else console.log(`[pre-order] ${orderId} paid.`);

    if (data) await sendConfirmation(data, "paid", locale);
  } else if (event.type === "checkout.session.expired" && orderId) {
    // The reader walked away from the payment page. The order stands as a
    // reservation; it is not deleted and it is not treated as paid — and
    // they are told that, rather than being left with a tab they closed and
    // no idea whether anything was recorded.
    const { data } = await db
      .from("book_orders")
      .update({ payment_status: "reserved" })
      .eq("id", orderId)
      .select("*")
      .maybeSingle();

    if (data) await sendConfirmation(data, "reserved", locale);
  }

  // Anything else is acknowledged and ignored, so Stripe stops retrying it.
  return NextResponse.json({ received: true });
}

/** One order row, turned into the letter its reader should get. */
async function sendConfirmation(
  row: Record<string, unknown>,
  kind: "paid" | "reserved",
  locale: ReturnType<typeof localeOf>
): Promise<void> {
  const email = String(row.email ?? "");
  if (!email) return;

  await confirmOrder({
    kind,
    locale,
    region: row.region === "tr" || row.region === "pk" ? row.region : null,
    id: String(row.id ?? ""),
    name: String(row.full_name ?? ""),
    email,
    country: String(row.country ?? ""),
    city: String(row.city ?? ""),
    address: String(row.shipping_address ?? ""),
    quantity: Number(row.quantity) || 1,
    lines: linesFromRow(row),
    phone: String(row.phone ?? ""),
    message: String(row.message ?? ""),
  });
}
