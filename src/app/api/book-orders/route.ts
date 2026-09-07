import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({
  full_name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().min(1).max(50),
  country: z.enum(["Türkiye", "Pakistan"]),
  city: z.string().min(1).max(200),
  shipping_address: z.string().min(1).max(2000),
  quantity: z.coerce.number().int().min(1).max(50),
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
      { error: "Direct ordering isn't connected yet. Please check back soon." },
      { status: 503 }
    );
  }

  // Deliberately no payment or banking information is collected or stored
  // here. Saadan reviews each order manually and sends payment instructions
  // himself once it is approved.
  const { error } = await supabase.from("book_orders").insert(parsed.data);

  if (error) {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
