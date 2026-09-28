import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { recordAsMessage, recordOrder } from "@/lib/book/store";
import { confirmOrder, localeOf } from "@/lib/book/confirm";

/**
 * A reader Amazon will not reach, asking to be sent one anyway.
 *
 * No price is quoted and nothing is taken: postage to somewhere Amazon does
 * not go cannot be guessed from here, so this only records who and where,
 * and Saadan works it out and writes back. Quoting a figure now and
 * correcting it later would be worse than saying nothing.
 */

const schema = z.object({
  full_name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().min(1).max(50),
  country: z.string().min(1).max(120),
  shipping_address: z.string().min(1).max(2000),
  quantity: z.coerce.number().int().min(1).max(50).optional(),
  message: z.string().max(2000).optional(),
  locale: z.string().max(5).optional(),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "This isn't connected yet. Please check back soon." },
      { status: 503 }
    );
  }

  const { quantity, locale, ...who } = parsed.data;
  const written = await recordOrder(
    supabase,
    { ...who, quantity: quantity ?? 1, city: "—" },
    // Not a country the shop covers, so it goes in as a request rather than
    // an order: no currency, no total, nothing owed until it is worked out.
    { region: "world", payment_status: "quote-requested" }
  );

  if (!written.ok) {
    // The order table has only ever accepted two countries, and this reader
    // is in a third. Rather than lose them, the request arrives as a
    // message, which the same inbox shows.
    const filed = await recordAsMessage(supabase, {
      name: who.full_name,
      email: who.email,
      subject: `Print to order — ${who.country}`,
      body: [
        `Wants ${quantity ?? 1} copy or copies of The Highest Branch, shipped to ${who.country}.`,
        `Phone: ${who.phone}`,
        `Address: ${who.shipping_address}`,
        who.message ? `Said: ${who.message}` : "",
        "Amazon does not reach them. Work out the postage and write back with a price.",
      ]
        .filter(Boolean)
        .join("\n"),
    });
    if (!filed) {
      return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
    }
  }

  // Sent whichever way it was filed. The reader asked; what the database
  // happened to accept is not their concern. No price in it, because there
  // is not one yet.
  await confirmOrder({
    kind: "quote",
    locale: localeOf(locale),
    id: written.ok ? written.id : null,
    name: who.full_name,
    email: who.email,
    country: who.country,
    address: who.shipping_address,
    quantity: quantity ?? 1,
    lines: null,
  });

  return NextResponse.json({ ok: true });
}
