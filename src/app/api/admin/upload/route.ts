import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/supabase/auth";
import { getAdminClient } from "@/lib/supabase/admin";

const MAX_BYTES = 15 * 1024 * 1024;
const BUCKETS = new Set(["media", "papers"]);

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Not authorised." }, { status: 401 });

  const db = getAdminClient();
  if (!db) return NextResponse.json({ error: "Not configured." }, { status: 503 });

  const form = await request.formData();
  const file = form.get("file");
  const bucket = String(form.get("bucket") ?? "media");

  if (!BUCKETS.has(bucket)) {
    return NextResponse.json({ error: "Unknown bucket." }, { status: 400 });
  }
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Choose a file first." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "That file is larger than 15 MB." }, { status: 400 });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  const path = `${Date.now()}-${safeName}`;

  const { error } = await db.storage
    .from(bucket)
    .upload(path, file, { cacheControl: "31536000", upsert: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // `papers` is private on purpose: hand back the storage path only, so a
  // restricted PDF never gains a public URL.
  if (bucket === "papers") {
    return NextResponse.json({ value: path, path, bucket });
  }

  const { data } = db.storage.from(bucket).getPublicUrl(path);
  return NextResponse.json({ value: data.publicUrl, path, bucket });
}
