import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseServiceRoleKey, supabaseUrl } from "@/lib/supabase/env";

let cached: SupabaseClient | null = null;

/**
 * Service-role client. Bypasses row level security, so it must only ever be
 * called from server code that has already established the caller is an
 * admin (see requireAdmin) or from a route that deliberately accepts public
 * submissions.
 *
 * Returns null when the project isn't configured, so callers degrade to a
 * clear message instead of throwing.
 */
export function getAdminClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseServiceRoleKey) return null;
  if (!cached) {
    cached = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false },
    });
  }
  return cached;
}
