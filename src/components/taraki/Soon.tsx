import { TarakiNav } from "@/components/taraki/TarakiNav";

/**
 * A tab that exists but is not built yet.
 *
 * It says what it will do and what it is waiting on, rather than showing a
 * half-working version. A student who tried a broken calculator would not
 * come back to try the working one.
 */
export function Soon({
  label,
  title,
  what,
  blocked,
}: {
  label: string;
  title: string;
  what: string[];
  blocked: string;
}) {
  return (
    <>
      <TarakiNav />
      <main className="tk-shell" style={{ paddingBlock: "clamp(3rem, 8vw, 6rem) 6rem" }}>
        <p className="tk-label tk-rise" style={{ color: "var(--accent)" }}>
          {label} · Not built yet
        </p>
        <h1 className="tk-h1 tk-rise" style={{ marginTop: "1.25rem", maxWidth: "20ch", animationDelay: "0.05s" }}>
          {title}
        </h1>

        <div className="tk-card tk-rise" style={{ marginTop: "2.5rem", padding: "clamp(1.4rem, 3vw, 2rem)", maxWidth: "46rem", animationDelay: "0.1s" }}>
          <span className="tk-label" style={{ color: "var(--text-faint)" }}>What it will do</span>
          <ul style={{ marginTop: "1rem", paddingLeft: "1.1rem", display: "grid", gap: "0.6rem" }}>
            {what.map((w) => (
              <li key={w} className="tk-body">{w}</li>
            ))}
          </ul>
          <p className="tk-small" style={{ marginTop: "1.6rem", paddingTop: "1.2rem", borderTop: "1px solid var(--line)" }}>
            <strong style={{ color: "var(--text-soft)" }}>Waiting on:</strong> {blocked}
          </p>
        </div>
      </main>
    </>
  );
}
