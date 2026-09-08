import { cn } from "@/lib/utils";
import { humanizeStatus } from "@/lib/admin/resources";

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
  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <p className="eyebrow">Backend</p>
      <h1 className="mt-3 font-display text-4xl">Supabase is not connected yet</h1>
      <p className="mt-5 text-base leading-relaxed text-ink-soft">
        The dashboard is built and waiting. To switch it on, create a Supabase project, run the
        two files in <code className="text-ink">supabase/migrations</code>, then set{" "}
        <code className="text-ink">NEXT_PUBLIC_SUPABASE_URL</code>,{" "}
        <code className="text-ink">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> and{" "}
        <code className="text-ink">SUPABASE_SERVICE_ROLE_KEY</code> in your hosting environment.
      </p>
      <p className="mt-4 text-sm text-ink-faint">
        Until then the public site keeps rendering from the content file, exactly as it does now.
      </p>
    </div>
  );
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}
