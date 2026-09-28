import Link from "next/link";
import { AdminHeading } from "@/components/admin/ui";
import { checkPreorders, type Level } from "@/lib/book/readiness";
import { formatDate } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

/**
 * Whether the shop is open, asked of the deployment it is running on.
 *
 * Everything the pre-order path depends on lives somewhere a laptop cannot
 * see: a migration that may not have been run, a key that may not be set, a
 * promo code that lives in an environment variable. This page asks from the
 * inside and says what it found, so the answer to "are we ready" is a screen
 * rather than somebody's memory.
 */

const TONE: Record<Level, { dot: string; word: string }> = {
  ready: { dot: "bg-verdant", word: "Ready" },
  degraded: { dot: "bg-ember", word: "Works, but" },
  blocked: { dot: "bg-ember", word: "Blocked" },
  off: { dot: "bg-ink-faint", word: "Off, by choice" },
};

const HEADLINE: Record<Level, string> = {
  ready: "Pre-orders are ready.",
  degraded: "Pre-orders work, with something worth fixing.",
  blocked: "Pre-orders cannot be taken properly.",
  off: "Pre-orders are ready.",
};

export default async function PreordersPage() {
  const report = await checkPreorders();

  return (
    <div className="mx-auto max-w-3xl">
      <AdminHeading eyebrow="The book" title="Pre-order readiness" />

      <p className="mt-5 max-w-2xl font-serif text-xl leading-snug">{HEADLINE[report.overall]}</p>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
        Checked on this deployment, just now. Everything below is what the running site can see for
        itself rather than what anybody remembers setting.
      </p>

      <ul className="mt-9 border-t border-line">
        {report.checks.map((check) => (
          <li key={check.id} className="border-b border-line py-5">
            <div className="flex items-baseline gap-3">
              <span className={`mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full ${TONE[check.level].dot}`} aria-hidden />
              <div className="min-w-0">
                <p className="font-medium">
                  {check.label}
                  <span className="t-label ms-3 text-ink-faint">{TONE[check.level].word}</span>
                </p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{check.says}</p>
                {check.fix && (
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-faint">
                    <strong className="font-medium text-ink-soft">To change it:</strong> {check.fix}
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      {report.counts && (
        <div className="mt-10 border border-line p-6">
          <span className="t-label text-ink-faint">Orders so far</span>
          {report.counts.total === 0 ? (
            <p className="mt-3 text-sm text-ink-soft">None yet.</p>
          ) : (
            <>
              <p className="mt-3 font-serif text-3xl">{report.counts.total}</p>
              <p className="mt-2 text-sm text-ink-soft">
                {Object.entries(report.counts.byPayment)
                  .map(([state, n]) => `${n} ${state.replace(/-/g, " ")}`)
                  .join(" · ")}
              </p>
              {report.counts.latest && (
                <p className="mt-1 text-sm text-ink-faint">Most recent: {formatDate(report.counts.latest)}</p>
              )}
            </>
          )}
          <Link href="/admin/orders" className="t-label mt-5 inline-block text-azure underline-offset-4 hover:underline">
            Open the orders →
          </Link>
        </div>
      )}

      <div className="mt-10 border border-line p-6">
        <span className="t-label text-ink-faint">What a reader goes through</span>
        <ol className="mt-4 grid gap-2 text-sm leading-relaxed text-ink-soft">
          <li>1. They choose Pakistan or Türkiye, pick how many copies, and may type the code.</li>
          <li>2. The price is worked out on the server, never in their browser. Postage in Türkiye appears only at the total.</li>
          <li>3. They leave a name, email, phone, city and address, and the order is written down.</li>
          <li>4. They are sent a confirmation in their own language with the figures and the address they gave.</li>
          <li>5. You are sent the same order, with everything needed to send payment instructions. Replying to it replies to them.</li>
          <li>6. You mark it here as it moves: instructions sent, payment received, shipped.</li>
        </ol>
      </div>
    </div>
  );
}
