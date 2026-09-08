import { getAdminClient } from "@/lib/supabase/admin";
import { AdminHeading } from "@/components/admin/ui";
import { BookSettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function BookPage() {
  const db = getAdminClient();
  const { data } = db
    ? await db.from("book_settings").select("*").maybeSingle()
    : { data: null };

  return (
    <div className="mx-auto max-w-3xl">
      <AdminHeading eyebrow="Content" title="The novel" />
      <p className="mt-5 max-w-xl text-sm leading-relaxed text-ink-soft">
        Drives the homepage section, the novel page, and the publications card.
      </p>
      <BookSettingsForm book={data ?? {}} />
    </div>
  );
}
