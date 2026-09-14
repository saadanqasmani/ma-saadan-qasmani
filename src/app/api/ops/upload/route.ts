import { NextResponse } from "next/server";
import { OPS_COOKIE, opsTokenIsValid } from "@/lib/ops/gate";
import { getSupabaseServerClient } from "@/lib/supabase/server";

const MAX_BYTES = 25 * 1024 * 1024;

async function allowed(request: Request): Promise<boolean> {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${OPS_COOKIE}=([^;]+)`));
  return opsTokenIsValid(match?.[1]);
}

/** A file into the private ops bucket. Returns its path, never a URL. */
export async function POST(request: Request) {
  if (!(await allowed(request))) return new NextResponse(null, { status: 404 });

  const db = getSupabaseServerClient();
  if (!db) return NextResponse.json({ error: "Storage is not connected on this deployment." }, { status: 503 });

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Choose a file first." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "That file is larger than 25 MB." }, { status: 400 });
  }

  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  const path = `${Date.now()}-${safe}`;
  const { error } = await db.storage.from("ops").upload(path, file, { upsert: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ path, name: file.name, size: file.size, type: file.type });
}
