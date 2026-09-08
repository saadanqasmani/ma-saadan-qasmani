import { cn } from "@/lib/utils";
import { humanizeStatus } from "@/lib/admin/resources";
import {
  adminEmails,
  supabaseAnonKey,
  supabaseServiceRoleKey,
  supabaseUrl,
} from "@/lib/supabase/env";

export function AdminHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="mt-2 font-display text-4xl leading-none">{title}</h1>
      </div>
      {action}
    </div>
  );
}

export const buttonClass =
  "inline-flex items-center justify-center gap-2 border border-ink bg-ink px-5 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-canvas-light transition-opacity hover:opacity-85 disabled:opacity-50";

export const ghostButtonClass =
  "inline-flex items-center justify-center gap-2 border border-line px-5 py-2.5 text-xs font-medium uppercase tracking-[0.14em] text-ink-soft transition-colors hover:border-ink hover:text-ink";

export function StatusBadge({ value }: { value: string }) {
  const tone =
    value === "new"
      ? "border-ember text-ember"
      : ["completed", "sent", "approved", "shipped", "payment_received", "active", "replied"].includes(
            value
          )
        ? "border-verdant text-verdant"
        : ["cancelled", "declined", "archived", "unsubscribed"].includes(value)
          ? "border-line text-ink-faint"
          : "border-azure text-azure";

  return (
    <span
      className={cn(
        "inline-block whitespace-nowrap border px-2 py-1 text-[10px] uppercase tracking-[0.1em]",
        tone
      )}
    >
      {humanizeStatus(value)}
    </span>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="border border-dashed border-line px-6 py-16 text-center text-sm text-ink-faint">
      {children}
    </p>
  );
}

export function NotConnected() {
  // Names only, never values: this page is reachable before sign-in.
  const checks = [
    {
      label: "NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL",
      ok: Boolean(supabaseUrl),
      why: "The address of your Supabase project.",
    },
    {
      label: "NEXT_PUBLIC_SUPABASE_ANON_KEY or SUPABASE_ANON_KEY",
      ok: Boolean(supabaseAnonKey),
      why: "Lets the site read published content and sign you in.",
    },
    {
      label: "SUPABASE_SERVICE_ROLE_KEY",
      ok: Boolean(supabaseServiceRoleKey),
      why: "Lets the dashboard save changes. Server-side only.",
    },
    {
      label: "ADMIN_EMAILS",
      ok: adminEmails.length > 0,
      why: "Comma-separated list of addresses allowed in here.",
    },
  ];

  const missing = checks.filter((c) => !c.ok);

  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <p className="eyebrow">Backend</p>
      <h1 className="mt-3 font-display text-4xl">
        {missing.length === 0
          ? "Almost there"
          : "Supabase is not connected yet"}
      </h1>

      <p className="mt-5 text-base leading-relaxed text-ink-soft">
        {missing.length === 0
          ? "Every variable is set. If you are still seeing this page, redeploy so the latest build picks them up."
          : "The dashboard is built and waiting. Here is exactly what it can and cannot see right now."}
      </p>

      <ul className="mt-8 border-t border-line">
        {checks.map((c) => (
          <li key={c.label} className="grid gap-1 border-b border-line py-4 sm:grid-cols-[1.5rem_1fr]">
            <span className={c.ok ? "text-verdant" : "text-ember"}>{c.ok ? "\u2713" : "\u00d7"}</span>
            <div>
              <p className="break-all font-mono text-sm text-ink">{c.label}</p>
              <p className="mt-0.5 text-sm text-ink-soft">
                {c.ok ? "Found." : c.why}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 space-y-3 text-sm leading-relaxed text-ink-soft">
        <p>
          Set anything marked in red in your hosting provider&rsquo;s environment variables, then
          <strong className="text-ink"> redeploy</strong>. Variables only reach the site on a new
          build, which is the step most often missed.
        </p>
        <p>
          You also need the tables: run every file in{" "}
          <code className="text-ink">supabase/migrations</code> in the Supabase SQL editor. They
          are safe to run more than once.
        </p>
        <p className="text-ink-faint">
          Until this is finished the public site keeps working, rendering from the content file.
        </p>
      </div>
    </div>
  );
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
