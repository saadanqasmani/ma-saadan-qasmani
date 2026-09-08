"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminClient } from "@/lib/supabase/admin";
import { getAdminUser, getSessionClient } from "@/lib/supabase/auth";
import { getResource, type Field } from "@/lib/admin/resources";

export type ActionResult = { ok: boolean; message?: string };

/**
 * Every mutation goes through this. Being signed in is not enough; the user
 * must be on the admins allowlist. Without it the service-role client below
 * would let any authenticated Supabase user write to the site.
 */
async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  const db = getAdminClient();
  if (!db) throw new Error("Supabase is not configured.");
  return { user, db };
}

function coerce(field: Field, raw: FormDataEntryValue | null): unknown {
  const value = typeof raw === "string" ? raw : "";

  switch (field.type) {
    case "boolean":
      return value === "on" || value === "true";
    case "number": {
      if (value.trim() === "") return null;
      const n = Number(value);
      return Number.isFinite(n) ? n : null;
    }
    case "tags":
      return value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    case "date":
      return value.trim() === "" ? null : value;
    default:
      return value.trim() === "" ? null : value;
  }
}

function buildPayload(fields: Field[], formData: FormData) {
  const payload: Record<string, unknown> = {};
  for (const field of fields) {
    // An unchecked checkbox sends nothing, which must still mean false.
    if (field.type === "boolean") {
      payload[field.name] = formData.get(field.name) !== null;
      continue;
    }
    if (!formData.has(field.name)) continue;
    payload[field.name] = coerce(field, formData.get(field.name));
  }
  return payload;
}

function refresh(paths: string[]) {
  for (const path of paths) revalidatePath(path);
}

// ────────────────────────────── auth ──────────────────────────────

export async function signIn(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = await getSessionClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured yet." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { ok: false, message: "Enter your email and password." };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { ok: false, message: "Those details were not accepted." };

  const user = await getAdminUser();
  if (!user) {
    await supabase.auth.signOut();
    return { ok: false, message: "That account is not on the admin list." };
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await getSessionClient();
  await supabase?.auth.signOut();
  redirect("/admin/login");
}

// ──────────────────────────── resources ────────────────────────────

export async function saveRecord(
  resourceKey: string,
  id: string | null,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const resource = getResource(resourceKey);
  if (!resource) return { ok: false, message: "Unknown section." };
  if (resource.mode !== "crud") return { ok: false, message: "This section is read-only." };

  const { db } = await requireAdmin();
  const payload = buildPayload(resource.fields, formData);

  for (const field of resource.fields) {
    if (field.required && !payload[field.name]) {
      return { ok: false, message: `${field.label} is required.` };
    }
  }

  const query = id
    ? db.from(resource.table).update(payload).eq("id", id)
    : db.from(resource.table).insert(payload);

  const { error } = await query;
  if (error) {
    return {
      ok: false,
      message: error.code === "23505" ? "That URL slug is already taken." : error.message,
    };
  }

  refresh(["/admin/" + resource.key, ...resource.revalidate]);
  redirect(`/admin/${resource.key}?saved=1`);
}

export async function deleteRecord(resourceKey: string, id: string): Promise<void> {
  const resource = getResource(resourceKey);
  if (!resource || resource.mode !== "crud") return;

  const { db } = await requireAdmin();
  await db.from(resource.table).delete().eq("id", id);

  refresh(["/admin/" + resource.key, ...resource.revalidate]);
  redirect(`/admin/${resource.key}?deleted=1`);
}

/** Inbox items: only the status and the private notes are ever writable. */
export async function updateInbox(
  resourceKey: string,
  id: string,
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const resource = getResource(resourceKey);
  if (!resource || resource.mode !== "inbox") return { ok: false, message: "Unknown section." };

  const { db } = await requireAdmin();
  const payload: Record<string, unknown> = {};

  if (resource.statusField) {
    const status = String(formData.get("status") ?? "");
    if (resource.statusOptions?.includes(status)) payload[resource.statusField] = status;
  }
  if (resource.notesField && formData.has("notes")) {
    payload[resource.notesField] = String(formData.get("notes") ?? "");
  }

  const { error } = await db.from(resource.table).update(payload).eq("id", id);
  if (error) return { ok: false, message: error.message };

  revalidatePath(`/admin/${resource.key}`);
  return { ok: true, message: "Saved." };
}

// ──────────────────────────── singletons ────────────────────────────

const SITE_FIELDS: Field[] = [
  { name: "name", label: "Name", type: "text" },
  { name: "positioning", label: "Positioning", type: "text" },
  { name: "location", label: "Location", type: "text" },
  { name: "bio", label: "Biography", type: "longtext" },
  { name: "practitioner_note", label: "Practice note", type: "longtext" },
  { name: "portrait_path", label: "Portrait", type: "image" },
];

export async function saveSiteSettings(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const payload = buildPayload(SITE_FIELDS, formData);

  // Repeating groups arrive as parallel arrays of inputs.
  const zip = (a: string, b: string, keyA: string, keyB: string) => {
    const first = formData.getAll(a).map(String);
    const second = formData.getAll(b).map(String);
    return first
      .map((v, i) => ({ [keyA]: v.trim(), [keyB]: (second[i] ?? "").trim() }))
      .filter((entry) => entry[keyA] || entry[keyB]);
  };

  payload.roles = zip("role_title", "role_org", "title", "org");
  payload.founded = zip("founded_name", "founded_org", "name", "org");
  payload.honors = zip("honor_title", "honor_year", "title", "year");

  const { error } = await db.from("site_settings").update(payload).eq("id", true);
  if (error) return { ok: false, message: error.message };

  refresh(["/", "/about"]);
  return { ok: true, message: "Saved. The live site is updated." };
}

const BOOK_FIELDS: Field[] = [
  { name: "title", label: "Title", type: "text" },
  { name: "genre", label: "Genre", type: "text" },
  { name: "subject", label: "Subject", type: "longtext" },
  { name: "synopsis", label: "Synopsis", type: "longtext" },
  { name: "status", label: "Status", type: "textarea" },
  { name: "word_count", label: "Word count", type: "number" },
  { name: "chapter_count", label: "Chapters", type: "number" },
  { name: "cover_image_path", label: "Cover", type: "image" },
  { name: "amazon_url", label: "Amazon link", type: "url" },
  { name: "direct_order_enabled", label: "Direct orders", type: "boolean" },
];

export async function saveBookSettings(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { db } = await requireAdmin();
  const payload = buildPayload(BOOK_FIELDS, formData);

  const { error } = await db.from("book_settings").update(payload).eq("id", true);
  if (error) return { ok: false, message: error.message };

  refresh(["/", "/the-highest-branch", "/publications"]);
  return { ok: true, message: "Saved. The live site is updated." };
}

// ────────────────────────────── media ──────────────────────────────

export async function uploadFile(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { db } = await requireAdmin();

  const file = formData.get("file");
  const bucket = String(formData.get("bucket") ?? "media");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Choose a file first." };
  }
  if (file.size > 15 * 1024 * 1024) {
    return { ok: false, message: "That file is larger than 15 MB." };
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
  const path = `${Date.now()}-${safeName}`;

  const { error } = await db.storage
    .from(bucket)
    .upload(path, file, { cacheControl: "31536000", upsert: false });

  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/media");
  return { ok: true, message: "Uploaded." };
}

export async function deleteFile(bucket: string, path: string): Promise<void> {
  const { db } = await requireAdmin();
  await db.storage.from(bucket).remove([path]);
  revalidatePath("/admin/media");
}
