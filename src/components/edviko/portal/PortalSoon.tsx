import { Panel } from "@/components/edviko/portal/parts";

/**
 * A section that exists in the plan and not yet in the product.
 *
 * Shown rather than hidden, because somebody deciding whether to buy this
 * should see the shape of the whole thing, and somebody using it should
 * never be dropped into a half-working screen. It says what it will do and
 * what it is waiting on.
 */
export function PortalSoon({
  title,
  what,
  waiting,
}: {
  title: string;
  what: string[];
  waiting: string;
}) {
  return (
    <div style={{ display: "grid", gap: "1.25rem", maxWidth: "46rem" }}>
      <header>
        <p className="ev-label" style={{ color: "var(--accent)" }}>Not built yet</p>
        <h1 className="ev-h1" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", marginTop: "0.6rem" }}>{title}</h1>
      </header>
      <Panel title="What it will do">
        <ul style={{ display: "grid", gap: "0.6rem", paddingLeft: "1.1rem" }}>
          {what.map((w) => (
            <li key={w} className="ev-body" style={{ color: "var(--text-soft)" }}>{w}</li>
          ))}
        </ul>
        <p className="ev-small" style={{ marginTop: "1.4rem", paddingTop: "1.1rem", borderTop: "1px solid var(--line)" }}>
          <strong style={{ color: "var(--text-soft)" }}>Waiting on:</strong> {waiting}
        </p>
      </Panel>
    </div>
  );
}
