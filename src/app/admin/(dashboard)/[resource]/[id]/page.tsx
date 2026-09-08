import { notFound, redirect } from "next/navigation";
import { getAdminClient } from "@/lib/supabase/admin";
import { getResource } from "@/lib/admin/resources";
import { AdminHeading } from "@/components/admin/ui";
import { RecordForm } from "@/components/admin/RecordForm";

export const dynamic = "force-dynamic";

export default async function RecordPage({
  params,
}: {
  params: Promise<{ resource: string; id: string }>;
}) {
  const { resource: key, id } = await params;
  const resource = getResource(key);
  if (!resource) notFound();

  // Inbox items are handled inline in the list, not on their own page.
  if (resource.mode !== "crud") redirect(`/admin/${resource.key}`);

  const isNew = id === "new";
  let record: Record<string, unknown> | null = null;

  if (!isNew) {
    const db = getAdminClient();
    if (!db) notFound();
    const { data } = await db.from(resource.table).select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    record = data;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <AdminHeading
        eyebrow={resource.label}
        title={
          isNew
            ? `New ${resource.singular.toLowerCase()}`
            : String(record?.[resource.titleField] ?? resource.singular)
        }
      />
      <RecordForm resource={resource} record={record} />
    </div>
  );
}
