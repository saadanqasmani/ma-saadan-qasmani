import { NextResponse } from "next/server";
import { OPS_COOKIE, opsTokenIsValid } from "@/lib/ops/gate";
import { getSupabaseServerClient } from "@/lib/supabase/server";

async function allowed(request: Request): Promise<boolean> {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${OPS_COOKIE}=([^;]+)`));
  return opsTokenIsValid(match?.[1]);
}

/** Opens a private file for someone who is already through the gate. */
export async function GET(request: Request) {
  if (!(await allowed(request))) return new NextResponse(null, { status: 404 });

  const path = new URL(request.url).searchParams.get("path") ?? "";
  if (!path || path.includes("..")) return new NextResponse(null, { status: 400 });

  const db = getSupabaseServerClient();
  if (!db) return new NextResponse("Storage is not connected.", { status: 503 });

  const { data, error } = await db.storage.from("ops").createSignedUrl(path, 60 * 10);
  if (error || !data) return new NextResponse(null, { status: 404 });
  return NextResponse.redirect(data.signedUrl);
}
