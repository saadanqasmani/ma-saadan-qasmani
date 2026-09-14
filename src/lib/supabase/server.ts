import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseServiceRoleKey, supabaseUrl } from "@/lib/supabase/env";

let cached: SupabaseClient | null = null;

/**
 * Server-side Supabase client using the service role key.
 *
 * Reads its configuration through the shared env module rather than
 * process.env directly. That module accepts the NEXT_PUBLIC_ spellings a
 * hosting integration creates, and a prefixed variable ending in the right
 * suffix. Reading process.env by hand here meant the dashboard could be
 * connected while every public form on the site quietly was not.
 *
 * Returns null when the project isn't configured yet — callers must handle
 * that case (the site works fully without a backend attached; only form
 * submissions need it).
 */
export function getSupabaseServerClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseServiceRoleKey) return null;

  if (!cached) {
    cached = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false },
    });
  }

  return cached;
}
