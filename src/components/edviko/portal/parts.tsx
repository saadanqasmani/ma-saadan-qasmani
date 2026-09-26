import Link from "next/link";
import type { ReactNode } from "react";
import type { Tone } from "@/lib/edviko/pipeline";

/**
 * The pieces every portal screen is built from.
 *
 * No hooks and no state, so a page can be rendered on the server and stay
 * there. A dashboard whose numbers arrive after the paint is a dashboard
 * people learn to distrust.
 */

export function Tile({
  n,
  label,
  note,
  tone,
  href,
}: {
  n: ReactNode;
  label: string;
  note?: string;
  tone?: Tone;
  href?: string;
}) {
  const body = (
    <>
      <span className="ev-tile__n" data-tone={tone}>{n}</span>
      <p className="ev-small" style={{ marginTop: "0.4rem", color: "var(--text-soft)" }}>{label}</p>
      {note && <p className="ev-small" style={{ marginTop: "0.15rem", color: "var(--text-faint)" }}>{note}</p>}
    </>
  );
  return href ? (
    <Link href={href} className="ev-tile" style={{ display: "block" }}>{body}</Link>
  ) : (
    <div className="ev-tile">{body}</div>
  );
}

export function Panel({
  title,
  aside,
  children,
  flush,
}: {
  title: string;
  aside?: ReactNode;
  children: ReactNode;
  flush?: boolean;
}) {
  return (
    <section className="ev-panel">
      <header className="ev-panel__head">
        <h2 className="ev-h2" style={{ fontSize: "1.0625rem" }}>{title}</h2>
        {aside && <span className="ev-small" style={{ color: "var(--text-faint)" }}>{aside}</span>}
      </header>
      <div className="ev-panel__body" style={flush ? { padding: "0.35rem 1.15rem" } : undefined}>{children}</div>
    </section>
  );
}

export function Face({ name }: { name: string }) {
  const parts = name.trim().split(/\s+/);
  const initials = ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
  return <span className="ev-face" aria-hidden>{initials}</span>;
}

export function Dot({ tone }: { tone: Tone }) {
  return <span className="ev-dot" data-tone={tone} aria-hidden />;
}

export function Tag({ tone, children }: { tone?: Tone; children: ReactNode }) {
  return <span className="ev-tag" data-tone={tone}>{children}</span>;
}

export function Meter({ value, tone }: { value: number; tone?: Tone }) {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div className="ev-meter" role="img" aria-label={`${clamped} percent`}>
      <div className="ev-meter__fill" data-tone={tone} style={{ width: `${clamped}%` }} />
    </div>
  );
}

/** A row that reads left to right: who, what, and how urgent. */
export function Row({
  lead,
  title,
  sub,
  end,
}: {
  lead?: ReactNode;
  title: ReactNode;
  sub?: ReactNode;
  end?: ReactNode;
}) {
  return (
    <div className="ev-row">
      <span>{lead}</span>
      <span style={{ minWidth: 0 }}>
        <span style={{ display: "block", fontWeight: 600, fontSize: "0.9375rem" }}>{title}</span>
        {sub && (
          <span className="ev-small" style={{ display: "block", color: "var(--text-faint)", marginTop: "0.1rem" }}>
            {sub}
          </span>
        )}
      </span>
      <span style={{ textAlign: "end" }}>{end}</span>
    </div>
  );
}

/**
 * The pipeline, as a row of stages with the count that has reached each.
 *
 * Read as "at this stage or past it" rather than "sitting here", because a
 * student with an offer has also built a shortlist, and a funnel that says
 * otherwise makes every campus look like it is failing at step three.
 */
export function Pipeline({ steps }: { steps: { label: string; count: number; of: number }[] }) {
  return (
    <div className="ev-pipe">
      {steps.map((s) => (
        <div key={s.label} className="ev-pipe__step">
          <p className="ev-small" style={{ color: "var(--text-faint)" }}>{s.label}</p>
          <p style={{ fontWeight: 600, fontSize: "1.125rem", marginTop: "0.15rem" }}>{s.count}</p>
          <div className="ev-pipe__bar" style={{ width: `${s.of === 0 ? 0 : Math.round((s.count / s.of) * 100)}%` }} />
          <p className="ev-small" style={{ color: "var(--text-faint)", marginTop: "0.3rem" }}>
            {s.of === 0 ? "0%" : `${Math.round((s.count / s.of) * 100)}%`}
          </p>
        </div>
      ))}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="ev-small" style={{ color: "var(--text-faint)", padding: "1.25rem 0" }}>{children}</p>
  );
}
