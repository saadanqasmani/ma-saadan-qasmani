import { getAdminClient } from "@/lib/supabase/admin";
import { getBlogPosts } from "@/lib/data";
import { mailIsConfigured } from "@/lib/email/send";
import { AdminHeading, EmptyState, formatDate } from "@/components/admin/ui";
import { LetterForm } from "@/components/admin/LetterForm";

export const dynamic = "force-dynamic";

/**
 * Writing to everyone who left an address.
 *
 * Compose a letter, or pick a journal note and say a line above it. See it
 * as the reader will, send one copy to yourself, then send it to the list.
 * Every letter that goes out is listed below, with the count it reached.
 */
export default async function LettersPage() {
  const db = getAdminClient();
  const [posts, active, past] = await Promise.all([
    getBlogPosts(),
    db ? db.from("subscribers").select("id", { count: "exact", head: true }).eq("status", "active") : null,
    db ? db.from("letters").select("id,subject,post_slug,recipients,failed,sent_at").order("sent_at", { ascending: false }).limit(20) : null,
  ]);
  const count = active?.count ?? 0;
  const letters = past?.data ?? [];
  const tableMissing = Boolean(past?.error);

  return (
    <div className="mx-auto max-w-3xl">
      <AdminHeading eyebrow="Subscribers" title="Letters" />
      <p className="mt-5 max-w-xl text-sm leading-relaxed text-ink-soft">
        {count === 1 ? "One person has" : `${count} people have`} left an address. Write below, look at it the way they
        will, send yourself a copy, and then send it to everyone. Each letter carries its own one-click unsubscribe.
      </p>

      {!mailIsConfigured() && (
        <p className="mt-6 border border-ember/40 bg-ember/5 px-4 py-3 text-sm text-ink-soft">
          RESEND_API_KEY is not set on this deployment, so nothing can go out. Previews still work.
        </p>
      )}
      {tableMissing && (
        <p className="mt-6 border border-ember/40 bg-ember/5 px-4 py-3 text-sm text-ink-soft">
          The <code>letters</code> table is missing. Run <code>supabase/migrations/0005_letters.sql</code> in the Supabase SQL
          editor so each send is kept on record.
        </p>
      )}

      <LetterForm posts={posts.map((p) => ({ slug: p.slug, title: p.title, date: p.date }))} recipients={count} canSend={mailIsConfigured()} />

      <section className="mt-16">
        <p className="eyebrow">Sent</p>
        {letters.length === 0 ? (
          <div className="mt-5">
            <EmptyState>Nothing sent yet.</EmptyState>
          </div>
        ) : (
          <ul className="mt-5 border-t border-line">
            {letters.map((l) => (
              <li key={l.id} className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line py-4">
                <div>
                  <p className="font-serif text-lg">{l.subject}</p>
                  <p className="mt-0.5 text-xs text-ink-faint">
                    {formatDate(l.sent_at)}
                    {l.post_slug ? ` · note: ${l.post_slug}` : ""}
                  </p>
                </div>
                <p className="text-sm text-ink-soft">
                  {l.recipients} sent{l.failed ? `, ${l.failed} failed` : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
