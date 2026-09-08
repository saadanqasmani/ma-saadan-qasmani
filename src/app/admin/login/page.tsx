import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/supabase/auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { NotConnected } from "@/components/admin/ui";
import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (!isSupabaseConfigured) return <NotConnected />;

  const user = await getAdminUser();
  if (user) redirect("/admin");

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="w-full max-w-sm">
        <p className="eyebrow">Saadan Qasmani</p>
        <h1 className="mt-3 font-display text-4xl">The desk</h1>
        <p className="mt-3 text-sm text-ink-soft">Sign in to edit the site.</p>
        <div className="mt-10">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
