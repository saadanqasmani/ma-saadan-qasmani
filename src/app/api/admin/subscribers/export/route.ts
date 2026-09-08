import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/supabase/auth";
import { getAdminClient } from "@/lib/supabase/admin";

/** Escape a value for CSV: quote it and double any inner quotes. */
function cell(value: unknown): string {
  const s = value === null || value === undefined ? "" : String(value);
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET() {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Not authorised." }, { status: 401 });
  }

  const db = getAdminClient();
  if (!db) {
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }

  const { data, error } = await db
    .from("subscribers")
    .select("email,status,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = [
    ["email", "status", "subscribed_at"].map(cell).join(","),
    ...(data ?? []).map((r) => [r.email, r.status, r.created_at].map(cell).join(",")),
  ].join("\n");

  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(rows, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="subscribers-${stamp}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
