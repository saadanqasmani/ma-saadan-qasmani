import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { isAllowlistedEmail, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";
import { getAdminClient } from "@/lib/supabase/admin";

/**
 * Cookie-backed Supabase client for server components and server actions.
 * Carries the signed-in admin's session.
 */
export async function getSessionClient() {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a server component, where cookies are read-only.
          // Session refresh happens in middleware instead.
        }
      },
    },
  });
}

export type AdminUser = { id: string; email: string };

/**
 * The signed-in admin, or null.
 *
 * Being authenticated is not sufficient. The account must also be allowed:
 * either its email is listed in ADMIN_EMAILS, or its id appears in the
 * `admins` table. Anyone else who reaches Supabase is treated as a stranger.
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await getSessionClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  if (isAllowlistedEmail(user.email)) {
    return { id: user.id, email: user.email ?? "" };
  }

  const admin = getAdminClient();
  if (!admin) return null;

  const { data: row } = await admin
    .from("admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!row) return null;
  return { id: user.id, email: user.email ?? "" };
}
