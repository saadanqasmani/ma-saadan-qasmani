"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminClient } from "@/lib/supabase/admin";
import { getAdminUser, getSessionClient } from "@/lib/supabase/auth";
import { isAllowlistedEmail } from "@/lib/supabase/env";
import { getResource, type Field } from "@/lib/admin/resources";
import { getBlogPost } from "@/lib/data";
import { letterEmail } from "@/lib/email/letter";
import { sendMail, sendMany, mailIsConfigured, checkResend, fromAddress, keyShape, type Mail } from "@/lib/email/send";

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

/** Does an account already exist for this email? */
async function accountExists(email: string): Promise<boolean> {
  const db = getAdminClient();
  if (!db) return true; // Can't tell: assume yes and never create one.
  try {
    const { data } = await db.auth.admin.listUsers({ page: 1, perPage: 1000 });
    return (data?.users ?? []).some(
      (u) => u.email?.trim().toLowerCase() === email.trim().toLowerCase()
    );
  } catch {
    return true;
  }
}

export async function signIn(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const supabase = await getSessionClient();
  if (!supabase) {
    return { ok: false, message: "Supabase is not configured yet." };
  }

  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { ok: false, message: "Enter your email and password." };

  let { error } = await supabase.auth.signInWithPassword({ email, password });

  // First run: an allowlisted email with no account yet sets its password
  // here, so the dashboard can be opened without visiting Supabase. Only
  // ever creates an account when none exists, and only for an allowlisted
  // address, so this cannot overwrite or guess at an existing password.
  if (error && isAllowlistedEmail(email) && !(await accountExists(email))) {
    if (password.length < 8) {
      return { ok: false, message: "Choose a password of at least 8 characters." };
    }
    const db = getAdminClient();
    const { error: createError } = (await db?.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })) ?? { error: new Error("Not configured") };

    if (!createError) {
      ({ error } = await supabase.auth.signInWithPassword({ email, password }));
    }
  }

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

/* ---- letters to the list --------------------------------------------- */

export type LetterResult = { ok: boolean; message?: string };

async function buildLetter(formData: FormData, to: string) {
  const subject = String(formData.get("subject") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const slug = String(formData.get("post_slug") ?? "").trim();
  const post = slug ? await getBlogPost(slug) : null;
  if (slug && !post) return { error: "That note is not published, so it cannot be sent." } as const;
  if (!subject) return { error: "Give it a subject." } as const;
  if (!body && !post) return { error: "Write something, or pick a note." } as const;
  return { letter: await letterEmail({ subject, body, post }, to), subject, body, slug: post?.slug ?? null } as const;
}

/** The letter as one reader will see it. Returns markup, sends nothing. */
export async function previewLetter(formData: FormData): Promise<{ html?: string; message?: string }> {
  const { user } = await requireAdmin();
  const built = await buildLetter(formData, user.email);
  if ("error" in built) return { message: built.error };
  return { html: built.letter.html };
}

/**
 * Sends the letter: to the signed-in admin alone when mode is "test", to
 * every active address when mode is "all". Each recipient gets their own
 * unsubscribe link, and the send is written to the letters table with the
 * counts that actually went out.
 */
export async function sendLetter(_prev: LetterResult, formData: FormData): Promise<LetterResult> {
  const { user, db } = await requireAdmin();
  if (!mailIsConfigured()) return { ok: false, message: "RESEND_API_KEY is not set, so nothing can go out." };

  const mode = String(formData.get("mode") ?? "test");

  if (mode === "test") {
    const built = await buildLetter(formData, user.email);
    if ("error" in built) return { ok: false, message: built.error };
    const sent = await sendMail({ to: user.email, ...built.letter });
    return sent.ok
      ? { ok: true, message: `A copy is on its way to ${user.email}.` }
      : { ok: false, message: `Resend refused it: ${sent.reason}` };
  }

  const { data: rows, error } = await db.from("subscribers").select("email").eq("status", "active");
  if (error) return { ok: false, message: `Could not read the list: ${error.message}` };
  const addresses = (rows ?? []).map((r) => String(r.email).trim().toLowerCase()).filter(Boolean);
  if (addresses.length === 0) return { ok: false, message: "Nobody is on the list yet." };

  // The template is built once per address because the unsubscribe link is
  // the one thing that differs; everything else is identical.
  const first = await buildLetter(formData, addresses[0]);
  if ("error" in first) return { ok: false, message: first.error };
  const mails: Mail[] = [];
  for (const to of addresses) {
    const built = to === addresses[0] ? first : await buildLetter(formData, to);
    if ("error" in built) continue;
    mails.push({ to, ...built.letter });
  }

  const result = await sendMany(mails);

  const record = await db.from("letters").insert({
    subject: first.subject,
    body: first.body,
    html: first.letter.html,
    post_slug: first.slug,
    recipients: result.sent,
    failed: result.failed,
    sent_by: user.email,
  });
  revalidatePath("/admin/letters");

  const kept = record.error ? " (not recorded: the letters table is missing)" : "";
  if (result.sent === 0) return { ok: false, message: `Nothing went out: ${result.reasons[0] ?? "unknown"}${kept}` };
  if (result.failed > 0) return { ok: true, message: `Sent to ${result.sent}; ${result.failed} failed (${result.reasons[0]})${kept}.` };
  return { ok: true, message: `Sent to ${result.sent} ${result.sent === 1 ? "person" : "people"}${kept}.` };
}

/* ---- is the list actually working? ------------------------------------ */

export type Check = { label: string; state: "ok" | "bad" | "unknown"; detail: string };

/**
 * Reproduces, exactly, what happens when a visitor leaves their address.
 *
 * The subscribe form can only ever tell a reader that something went wrong;
 * it must not tell them what. This runs the same read and the same write
 * against a reserved address, removes it again, and reports whatever
 * Postgres actually said, so a blank failure becomes a named one.
 */
export async function checkTheList(): Promise<Check[]> {
  const { db } = await requireAdmin();
  const checks: Check[] = [];
  const probe = `probe-${Date.now().toString(36)}@saadanqasmani.invalid`;

  // Which build is answering. Without it there is no way to tell a fix that
  // did not work from a fix that was never deployed.
  const sha = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7);
  checks.push({
    label: "This deployment",
    state: "unknown",
    detail: `${sha ? `commit ${sha}` : "no commit recorded (not a Vercel build)"} · mail key ${keyShape()}`,
  });

  const mail = await checkResend();
  checks.push({
    label: `Sending letters (as ${fromAddress()})`,
    state: mail.state,
    detail: mail.detail,
  });
  checks.push({
    label: "Reply address (MAIL_REPLY_TO)",
    state: process.env.MAIL_REPLY_TO?.trim() ? "ok" : "bad",
    detail: process.env.MAIL_REPLY_TO?.trim()
      ? "Set. Replies reach a real mailbox."
      : "Not set: a reader who replies reaches nobody.",
  });

  const read = await db.from("subscribers").select("email").limit(1);
  checks.push({
    label: "Reading the list",
    state: read.error ? "bad" : "ok",
    detail: read.error ? `${read.error.code ?? "?"}: ${read.error.message}` : "The subscribers table answers.",
  });

  const column = await db.from("subscribers").select("welcomed_at").limit(1);
  checks.push({
    label: "Remembering who was written to",
    state: column.error ? "bad" : "ok",
    detail: column.error
      ? `${column.error.code ?? "?"}: ${column.error.message}. Run supabase/migrations/0006_welcomed_at.sql, or a reader who subscribes twice gets no second letter.`
      : "The welcomed_at column is there.",
  });

  const write = await db.from("subscribers").upsert({ email: probe, status: "active" }, { onConflict: "email" });
  checks.push({
    label: "Adding an address",
    state: write.error ? "bad" : "ok",
    detail: write.error ? `${write.error.code ?? "?"}: ${write.error.message}` : "A new address can be written.",
  });

  // The second write is the one a returning reader causes, and the one that
  // fails on its own if the email column has no unique constraint.
  if (!write.error) {
    const again = await db.from("subscribers").upsert({ email: probe, status: "active" }, { onConflict: "email" });
    checks.push({
      label: "Adding the same address twice",
      state: again.error ? "bad" : "ok",
      detail: again.error ? `${again.error.code ?? "?"}: ${again.error.message}` : "An address already on the list is updated, not duplicated.",
    });
    await db.from("subscribers").delete().eq("email", probe);
  }

  return checks;
}
