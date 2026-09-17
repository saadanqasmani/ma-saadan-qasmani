import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { quoteFor, storedCode } from "@/lib/book/pricing";

const schema = z.object({
  full_name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().min(1).max(50),
  country: z.enum(["Türkiye", "Pakistan"]),
  city: z.string().min(1).max(200),
  shipping_address: z.string().min(1).max(2000),
  quantity: z.coerce.number().int().min(1).max(50),
  message: z.string().max(2000).optional(),
  promo: z.string().max(64).optional(),
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
  const { promo, ...order } = parsed.data;
  const quote = quoteFor(order.quantity, promo);
  const { error } = await supabase.from("book_orders").insert({
    ...order,
    unit_price_usd: quote.unit,
    quantity_priced: quote.quantity,
    promo_code: storedCode(quote),
    discount_usd: quote.discount,
    total_usd: quote.total,
    payment_status: "reserved",
  });

  if (error) {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
