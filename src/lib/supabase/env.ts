/**
 * Supabase configuration, resolved defensively.
 *
 * Every value is trimmed and blank-checked before use. An environment
 * variable that exists but is empty is treated as absent, which is exactly
 * the failure that took the first deployment down.
 */

function read(...names: string[]): string | null {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return null;
}

export type EnvStatus = "ok" | "empty" | "missing";

/**
 * Distinguishes "never set" from "set but blank". They look identical to the
 * app and are fixed differently: one needs adding, the other needs its value
 * filled in. A blank variable that exists is the more confusing of the two,
 * because the hosting dashboard shows a row and looks correct.
 */
export function statusOf(...names: string[]): EnvStatus {
  let sawBlank = false;
  for (const name of names) {
    const raw = process.env[name];
    if (raw === undefined) continue;
    if (raw.trim() === "") {
      sawBlank = true;
      continue;
    }
    return "ok";
  }
  return sawBlank ? "empty" : "missing";
}

export const supabaseUrl = read("NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL");
export const supabaseAnonKey = read("NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_ANON_KEY");
export const supabaseServiceRoleKey = read("SUPABASE_SERVICE_ROLE_KEY");

/** Public reads and admin sign-in need the anon key. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/** Writes from server actions need the service role key. */
export const isAdminConfigured = Boolean(supabaseUrl && supabaseServiceRoleKey);

/**
 * Emails allowed into the dashboard, set as a comma-separated list in
 * ADMIN_EMAILS. This exists so the site can be set up entirely from the
 * hosting provider's environment screen, without hand-writing SQL. The
 * `admins` table remains supported and is checked as well.
 */
export const adminEmails: string[] = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export function isAllowlistedEmail(email: string | null | undefined): boolean {
  const normalized = email?.trim().toLowerCase();
  return Boolean(normalized && adminEmails.includes(normalized));
}
