import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminClient } from "@/lib/supabase/admin";
import { getResource } from "@/lib/admin/resources";
import {
  AdminHeading,
  EmptyState,
  StatusBadge,
  buttonClass,
  formatDate,
} from "@/components/admin/ui";
import { InboxRow } from "@/components/admin/InboxRow";

export const dynamic = "force-dynamic";

export default async function ResourceListPage({
  params,
}: {
  params: Promise<{ resource: string }>;
}) {
  const { resource: key } = await params;
  const resource = getResource(key);
  if (!resource) notFound();

  const db = getAdminClient();
  const { data } = db
    ? await db
        .from(resource.table)
        .select("*")
        .order(resource.defaultSort.column, { ascending: resource.defaultSort.ascending })
    : { data: [] as Record<string, unknown>[] };

  const rows = (data ?? []) as Record<string, unknown>[];

  return (
    <div className="mx-auto max-w-5xl">
      <AdminHeading
        eyebrow={resource.mode === "inbox" ? "Inbox" : "Content"}
        title={resource.label}
        action={
          resource.mode === "crud" ? (
            <Link href={`/admin/${resource.key}/new`} className={buttonClass}>
              Add {resource.singular.toLowerCase()}
            </Link>
          ) : resource.key === "subscribers" ? (
            <a href="/api/admin/subscribers/export" className={buttonClass} download>
              Export CSV
            </a>
          ) : undefined
        }
      />

      {rows.length === 0 ? (
        <div className="mt-10">
          <EmptyState>
            {resource.mode === "crud"
              ? `Nothing here yet. Add your first ${resource.singular.toLowerCase()}.`
              : "Nothing has come in yet."}
          </EmptyState>
        </div>
      ) : resource.mode === "crud" ? (
        <table className="mt-10 w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-line">
              {resource.listColumns.map((c) => (
                <th
                  key={c.name}
                  className="t-label pb-3 font-medium text-ink-faint"
                >
                  {c.label}
                </th>
              ))}
              <th className="pb-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={String(row.id)} className="border-b border-line align-top">
                {resource.listColumns.map((c) => (
                  <td key={c.name} className="py-4 pr-4 text-sm">
                    {c.name === "published" ? (
                      row.published ? (
                        <StatusBadge value="active" />
                      ) : (
                        <span className="text-xs text-ink-faint">Draft</span>
                      )
                    ) : c.name.includes("_at") ? (
                      formatDate(row[c.name] as string)
                    ) : (
                      <span className={c.name === resource.titleField ? "font-serif text-base" : ""}>
                        {String(row[c.name] ?? "")}
                      </span>
                    )}
                  </td>
                ))}
                <td className="py-4 text-right">
                  <Link
                    href={`/admin/${resource.key}/${row.id}`}
                    className="t-label text-ink-soft underline-offset-4 hover:text-ink hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <ul className="mt-10 space-y-3">
          {rows.map((row) => (
            <InboxRow key={String(row.id)} resourceKey={resource.key} row={row} />
          ))}
        </ul>
      )}
    </div>
  );
}
