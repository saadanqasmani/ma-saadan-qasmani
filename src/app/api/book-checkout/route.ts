import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { quoteFor, storedCode } from "@/lib/book/pricing";
import { createCheckout } from "@/lib/book/checkout";

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

  const { promo, ...order } = parsed.data;
  const quote = quoteFor(order.quantity, promo);

  const { data: row, error } = await supabase
    .from("book_orders")
    .insert({
      ...order,
      unit_price_usd: quote.unit,
      quantity_priced: quote.quantity,
      promo_code: storedCode(quote),
      discount_usd: quote.discount,
      total_usd: quote.total,
      payment_status: "awaiting",
    })
    .select("id")
    .single();

  if (error || !row) {
    console.error(`[pre-order] could not write the order: ${error?.message ?? "no row came back"}`);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  const session = await createCheckout(
    {
      id: row.id as string,
      email: order.email,
      fullName: order.full_name,
      country: order.country,
      city: order.city,
      address: order.shipping_address,
      phone: order.phone,
    },
    quote
  );

  if (!session.ok) {
    console.error(`[pre-order] checkout unavailable (${session.reason}): ${session.detail}`);
    // The order is real whatever Stripe said, so it is kept and marked back
    // to a reservation rather than left pretending to be mid-payment.
    await supabase.from("book_orders").update({ payment_status: "reserved" }).eq("id", row.id);
    return NextResponse.json(
      {
        error:
          session.reason === "not-configured"
            ? "Card payment isn't switched on yet. Your pre-order has been recorded and you will be sent payment instructions."
            : "The payment page could not be opened. Your pre-order has been recorded and you will be sent payment instructions.",
        recorded: true,
      },
      { status: 503 }
    );
  }

  await supabase
    .from("book_orders")
    .update({ stripe_session_id: session.sessionId })
    .eq("id", row.id);

  return NextResponse.json({ ok: true, url: session.url });
}
