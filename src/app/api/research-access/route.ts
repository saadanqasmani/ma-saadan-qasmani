import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const schema = z.object({
  research_slug: z.string().min(1),
  full_name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().max(50).optional(),
  institution: z.string().min(1).max(200),
  position: z.string().max(200).optional(),
  country: z.string().min(1).max(100),
  reason: z.string().min(1).max(3000),
  message: z.string().max(3000).optional(),
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
      { error: "Access requests aren't connected yet. Please check back soon." },
      { status: 503 }
    );
  }

  const { research_slug, ...rest } = parsed.data;

  const { data: item } = await supabase
    .from("research_items")
    .select("id")
    .eq("slug", research_slug)
    .maybeSingle();

  const { error } = await supabase.from("research_access_requests").insert({
    ...rest,
    research_item_id: item?.id ?? null,
  });

  if (error) {
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
