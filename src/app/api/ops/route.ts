import { NextResponse } from "next/server";
import { z } from "zod";
import { OPS_COOKIE, opsTokenIsValid } from "@/lib/ops/gate";
import { getSupabaseServerClient } from "@/lib/supabase/server";

/**
 * The workroom's documents, in and out.
 *
 * GET returns every document, grouped by collection. PUT writes one document
 * or deletes it. Each write is one row, so the two people using this never
 * overwrite each other's edits to different things.
 *
 * Every request is checked against the same cookie the pages are behind. A
 * route that trusted the page to have done that would be a route anyone
 * could call.
 */

async function allowed(request: Request): Promise<boolean> {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${OPS_COOKIE}=([^;]+)`));
  return opsTokenIsValid(match?.[1]);
}

export async function GET(request: Request) {
  if (!(await allowed(request))) return new NextResponse(null, { status: 404 });

  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ live: false, docs: {} });

  const { data, error } = await supabase.from("ops_docs").select("collection,id,data");
  if (error) return NextResponse.json({ live: false, docs: {}, error: error.message });

  const docs: Record<string, Record<string, unknown>> = {};
  for (const row of data ?? []) {
    (docs[row.collection] ??= {})[row.id] = row.data;
  }
  return NextResponse.json({ live: true, docs });
}

const writeSchema = z.object({
  collection: z.enum(["tasks", "meetings", "attendance", "meta", "materials"]),
  id: z.string().min(1).max(120),
  data: z.record(z.string(), z.unknown()).nullable(),
});

export async function PUT(request: Request) {
  if (!(await allowed(request))) return new NextResponse(null, { status: 404 });

  const body = await request.json().catch(() => null);
  const parsed = writeSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "bad write" }, { status: 400 });

  const supabase = getSupabaseServerClient();
  if (!supabase) return NextResponse.json({ live: false });

  const { collection, id, data } = parsed.data;
  const result = data
    ? await supabase.from("ops_docs").upsert({ collection, id, data, updated_at: new Date().toISOString() })
    : await supabase.from("ops_docs").delete().match({ collection, id });

  if (result.error) return NextResponse.json({ error: result.error.message }, { status: 500 });
  return NextResponse.json({ live: true });
}
