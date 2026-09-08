import { getAdminClient } from "@/lib/supabase/admin";
import { AdminHeading } from "@/components/admin/ui";
import { SiteSettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const db = getAdminClient();
  const { data } = db
    ? await db.from("site_settings").select("*").maybeSingle()
    : { data: null };

  return (
    <div className="mx-auto max-w-3xl">
      <AdminHeading
        eyebrow="Content"
        title="Site text"
      />
      <p className="mt-5 max-w-xl text-sm leading-relaxed text-ink-soft">
        Everything here appears on the homepage and the About page. Leave a field empty and the
        site falls back to the original wording rather than showing a blank.
      </p>
      <SiteSettingsForm settings={data ?? {}} />
    </div>
  );
}
