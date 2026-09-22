import { NextResponse } from "next/server";
import { OPS_COOKIE, opsTokenIsValid } from "@/lib/ops/gate";
import { getSupabaseServerClient } from "@/lib/supabase/server";

/**
 * A pass that lets the browser put a file straight into the bucket.
 *
 * The old route carried the file itself: browser to this server, this
 * server to Supabase. That works for a slide or a memo and cannot work for
 * a book, because the host caps the body of a serverless request at a few
 * megabytes and a scanned book is tens. The file was never going to arrive
 * however patient anyone was.
 *
 * So this hands back a short-lived signed URL and gets out of the way. The
 * file goes from the reader's machine to the bucket without passing through
 * here at all, which removes the ceiling and the wait in one go. What is
 * signed is one path, for one upload, and it expires by itself.
 */

/** The app's own ceiling. The bucket has its own, and it is the stricter. */
const MAX_BYTES = 200 * 1024 * 1024;

const NOT_CONNECTED =
  "Storage is not connected yet. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to the host's environment and redeploy, then files will upload. A link works in the meantime.";

async function allowed(request: Request): Promise<boolean> {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${OPS_COOKIE}=([^;]+)`));
  return opsTokenIsValid(match?.[1]);
}

export async function POST(request: Request) {
  if (!(await allowed(request))) return new NextResponse(null, { status: 404 });

  const db = getSupabaseServerClient();
  if (!db) return NextResponse.json({ error: NOT_CONNECTED }, { status: 503 });

  const body = (await request.json().catch(() => null)) as { name?: string; size?: number } | null;
  const name = (body?.name ?? "").trim();
  const size = Number(body?.size ?? 0);
  if (!name) return NextResponse.json({ error: "Choose a file first." }, { status: 400 });
  if (size > MAX_BYTES) {
    return NextResponse.json({ error: "That file is larger than 200 MB." }, { status: 400 });
  }

  const safe = name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase().slice(-120);
  const path = `${Date.now()}-${safe}`;

  const { data, error } = await db.storage.from("ops").createSignedUploadUrl(path);
  if (error || !data) {
    console.error(`[ops] could not sign an upload: ${error?.message ?? "no url came back"}`);
    return NextResponse.json(
      { error: error?.message ?? "The bucket would not open. Try again." },
      { status: 500 }
    );
  }

  return NextResponse.json({ signedUrl: data.signedUrl, token: data.token, path });
}
