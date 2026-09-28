import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { quoteFor, storedCode } from "@/lib/book/pricing";
import { recordOrder } from "@/lib/book/store";
import { confirmOrder, linesOf, localeOf } from "@/lib/book/confirm";

const schema = z.object({
  full_name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().min(1).max(50),
  country: z.enum(["Türkiye", "Pakistan"]),
  region: z.enum(["pk", "tr"]),
  city: z.string().min(1).max(200),
  shipping_address: z.string().min(1).max(2000),
  quantity: z.coerce.number().int().min(1).max(50),
  message: z.string().max(2000).optional(),
  promo: z.string().max(64).optional(),
  /** The language the reader was reading in, so the confirmation matches it. */
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
      { error: "Pre-ordering isn't connected yet. Please check back soon." },
      { status: 503 }
    );
  }

  // A reservation: the copies are put aside and settled by hand. The price
  // is worked out here from the quantity and the code, never read off the
  // request, because a total that arrives from a browser is a suggestion.
  //
  // Deliberately no payment or banking information is collected or stored
  // here. Saadan reviews each order and sends payment instructions himself.
  const { promo, region, locale, ...order } = parsed.data;
  const quote = quoteFor(region, order.quantity, promo);

  const written = await recordOrder(supabase, order, {
    region,
    currency: quote.currency,
    unit_price_usd: quote.unit,
    shipping_amount: quote.shipping,
    quantity_priced: quote.quantity,
    promo_code: storedCode(quote),
    discount_usd: quote.discount,
    total_usd: quote.total,
    payment_status: "reserved",
  });

  if (!written.ok) {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  // The reader is told what they ordered before they close the tab and
  // forget what they typed. Awaited rather than left to float: a serverless
  // function that has returned can be frozen mid-request, and a confirmation
  // that only sometimes arrives is worse than one that never does.
  await confirmOrder({
    kind: "reserved",
    locale: localeOf(locale),
    id: written.id,
    name: order.full_name,
    email: order.email,
    country: order.country,
    city: order.city,
    address: order.shipping_address,
    quantity: order.quantity,
    lines: linesOf(quote),
    phone: order.phone,
    message: order.message,
    degraded: written.degraded,
  });

  return NextResponse.json({ ok: true });
}
