import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { quoteFor, storedCode } from "@/lib/book/pricing";
import { recordAsMessage, recordOrder, REFUSAL_MEANS, type Recorded } from "@/lib/book/store";
import { createCheckout } from "@/lib/book/checkout";
import { confirmOrder, linesOf, localeOf } from "@/lib/book/confirm";

/**
 * Take a pre-order and send the reader to Stripe to pay for it.
 *
 * The order is written down first, as 'awaiting', so that a payment which
 * completes always has a row to land on. If the reader closes the tab the
 * row stays awaiting and is as good as a reservation; nothing is lost and
 * nothing is claimed.
 *
 * The price is worked out here from the quantity and the code, never taken
 * from the request. A total that arrives from a browser is a suggestion.
 */

const schema = z.object({
  full_name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().min(1).max(50),
  country: z.enum(["Türkiye", "Pakistan"]),
  // Only Türkiye settles online; Pakistan is arranged by hand afterwards.
  region: z.literal("tr"),
  city: z.string().min(1).max(200),
  shipping_address: z.string().min(1).max(2000),
  quantity: z.coerce.number().int().min(1).max(50),
  message: z.string().max(2000).optional(),
  promo: z.string().max(64).optional(),
  /** Carried into Stripe's metadata so the receipt comes back in this language. */
  locale: z.string().max(5).optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  const { promo, region, locale, ...order } = parsed.data;
  const quote = quoteFor(region, order.quantity, promo);

  const written: Recorded = supabase
    ? await recordOrder(supabase, order, {
        region,
        currency: quote.currency,
        unit_price_usd: quote.unit,
        shipping_amount: quote.shipping,
        quantity_priced: quote.quantity,
        promo_code: storedCode(quote),
        discount_usd: quote.discount,
        total_usd: quote.total,
        payment_status: "awaiting",
      })
    : { ok: false, reason: "other", detail: "no database is configured" };

  // No row means no card: the webhook would have nowhere to record that the
  // money arrived. The order itself is not lost — it becomes a reservation,
  // kept the same way the reserve path keeps one, and the reader is told
  // that instructions are coming rather than that something went wrong.
  if (!written.ok || !written.id) {
    const why = written.ok ? "" : REFUSAL_MEANS[written.reason];

    const filed =
      supabase && !written.ok
        ? await recordAsMessage(supabase, {
            name: order.full_name,
            email: order.email,
            subject: `PRE-ORDER not recorded — ${order.quantity} to ${order.city}, ${order.country}`,
            body: [
              `${order.quantity} cop${order.quantity === 1 ? "y" : "ies"} of The Highest Branch, card attempt.`,
              `Quoted: ${quote.currency} ${quote.total}${quote.promoApplied ? " (code applied)" : ""}.`,
              `Phone: ${order.phone}`,
              `Address: ${order.shipping_address}, ${order.city}, ${order.country}`,
              "",
              `The orders table refused this row: ${why}`,
            ].join("\n"),
          })
        : false;

    const sent = await confirmOrder({
      kind: "reserved",
      locale: localeOf(locale),
      id: null,
      name: order.full_name,
      email: order.email,
      country: order.country,
      city: order.city,
      address: order.shipping_address,
      quantity: order.quantity,
      lines: linesOf(quote),
      phone: order.phone,
      message: order.message,
      recorded: false,
      refusal: why,
    });

    if (filed || sent.alerted) {
      console.error(`[pre-order] card path kept outside book_orders. Message: ${filed}. Alert: ${sent.alerted}. ${why}`);
      return NextResponse.json({ ok: true, reserved: true });
    }

    console.error(`[pre-order] LOST a card order. ${why}`);
    return NextResponse.json({ code: "not-recorded" }, { status: 500 });
  }
  const orderId = written.id;
  // A row was written, so there is a database. Stated once for the compiler,
  // which cannot see that through the branch above.
  const db = supabase!;

  // A table without the money columns cannot hold a payment either: the
  // webhook would have nowhere to mark it paid. Better to take the order
  // and settle it by hand than to take a card against a row that cannot
  // record the result.
  if (written.degraded) {
    await confirmOrder({
      kind: "reserved",
      locale: localeOf(locale),
      id: orderId,
      name: order.full_name,
      email: order.email,
      country: order.country,
      city: order.city,
      address: order.shipping_address,
      quantity: order.quantity,
      lines: linesOf(quote),
      phone: order.phone,
      message: order.message,
      degraded: true,
    });
    return NextResponse.json({ ok: true, reserved: true });
  }

  const session = await createCheckout(
    {
      id: orderId,
      email: order.email,
      fullName: order.full_name,
      country: order.country,
      city: order.city,
      address: order.shipping_address,
      phone: order.phone,
      locale: localeOf(locale),
    },
    quote
  );

  if (!session.ok) {
    console.error(`[pre-order] checkout unavailable (${session.reason}): ${session.detail}`);
    // The order is real whatever Stripe said, so it is kept and marked back
    // to a reservation rather than left pretending to be mid-payment.
    await db.from("book_orders").update({ payment_status: "reserved" }).eq("id", orderId);

    // The card could not be taken, but the order stands, so the reader gets
    // the same letter a reservation gets rather than silence and a red box.
    await confirmOrder({
      kind: "reserved",
      locale: localeOf(locale),
      id: orderId,
      name: order.full_name,
      email: order.email,
      country: order.country,
      city: order.city,
      address: order.shipping_address,
      quantity: order.quantity,
      lines: linesOf(quote),
      phone: order.phone,
      message: order.message,
    });

    // A reservation is a real outcome, so it is a success rather than an
    // error with a consolation attached. The page already has the reserved
    // wording, in the reader's own language.
    return NextResponse.json({ ok: true, reserved: true });
  }

  await db
    .from("book_orders")
    .update({ stripe_session_id: session.sessionId })
    .eq("id", orderId);

  return NextResponse.json({ ok: true, url: session.url });
}
