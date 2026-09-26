import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";

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

  const { error } = await supabase.from("book_orders").insert({
    ...parsed.data,
    quantity: parsed.data.quantity ?? 1,
    // Not a country the shop covers, so it goes in as a request rather than
    // an order: no currency, no total, nothing owed until it is worked out.
    region: "world",
    city: "—",
    payment_status: "quote-requested",
  });

  if (error) {
    console.error(`[print request] could not write it down: ${error.message}`);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
