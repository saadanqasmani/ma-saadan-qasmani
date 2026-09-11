import Link from "next/link";
import { getAdminClient } from "@/lib/supabase/admin";
import { RESOURCES } from "@/lib/admin/resources";
import { AdminHeading } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

async function counts() {
  const db = getAdminClient();
  if (!db) return {};

  const inbox = RESOURCES.filter((r) => r.mode === "inbox");
  const entries = await Promise.all(
    inbox.map(async (r) => {
      const total = await db.from(r.table).select("id", { count: "exact", head: true });
      const fresh = r.statusField
        ? await db
            .from(r.table)
            .select("id", { count: "exact", head: true })
            .eq(r.statusField, r.key === "subscribers" ? "active" : "new")
        : null;
      return [r.key, { total: total.count ?? 0, fresh: fresh?.count ?? 0 }] as const;
    })
  );

  return Object.fromEntries(entries);
}

export default async function AdminOverview() {
  const stats = await counts();
  const inbox = RESOURCES.filter((r) => r.mode === "inbox");
  const authored = RESOURCES.filter((r) => r.mode === "crud");

  return (
    <div className="mx-auto max-w-5xl">
      <AdminHeading eyebrow="Overview" title="Today" />

      <section className="mt-10">
        <p className="eyebrow">Waiting for you</p>
        <div className="mt-5 grid gap-px overflow-hidden border border-line sm:grid-cols-2 lg:grid-cols-4">
          {inbox.map((r) => {
            const stat = stats[r.key] ?? { total: 0, fresh: 0 };
            return (
              <Link
                key={r.key}
                href={`/admin/${r.key}`}
                className="group bg-canvas p-6 transition-colors hover:bg-canvas-deep"
              >
                <p className="font-display text-5xl">
                  {r.key === "subscribers" ? stat.total : stat.fresh}
                </p>
                <p className="t-label mt-2 text-ink-faint">
                  {r.key === "subscribers" ? r.label : `New ${r.label.toLowerCase()}`}
                </p>
                {r.key !== "subscribers" && stat.total > 0 && (
                  <p className="mt-1 text-xs text-ink-faint/70">{stat.total} in total</p>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-14">
        <p className="eyebrow">Write something</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {authored.map((r) => (
            <Link
              key={r.key}
              href={`/admin/${r.key}/new`}
              className="group flex items-center justify-between border border-line p-5 transition-colors hover:border-ink"
            >
              <span className="font-serif text-lg">Add a {r.singular.toLowerCase()}</span>
              <span className="text-ink-faint transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-14 border-t border-line pt-8">
        <p className="text-sm leading-relaxed text-ink-soft">
          Anything you publish here appears on the live site within a few seconds. Nothing is sent
          to anyone automatically: book orders and access requests wait for you to act on them.
        </p>
      </section>
    </div>
  );
}
