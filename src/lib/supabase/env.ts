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

export const supabaseUrl = read("NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_URL");
export const supabaseAnonKey = read("NEXT_PUBLIC_SUPABASE_ANON_KEY", "SUPABASE_ANON_KEY");
export const supabaseServiceRoleKey = read("SUPABASE_SERVICE_ROLE_KEY");

/** Public reads and admin sign-in need the anon key. */
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/** Writes from server actions need the service role key. */
export const isAdminConfigured = Boolean(supabaseUrl && supabaseServiceRoleKey);
