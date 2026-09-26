import { EdvikoNav } from "@/components/edviko/EdvikoNav";

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
      <EdvikoNav />
      <main className="ev-shell" style={{ paddingBlock: "clamp(3rem, 8vw, 6rem) 6rem" }}>
        <p className="ev-label ev-rise" style={{ color: "var(--accent)" }}>
          {label} · Not built yet
        </p>
        <h1 className="ev-h1 ev-rise" style={{ marginTop: "1.25rem", maxWidth: "20ch", animationDelay: "0.05s" }}>
          {title}
        </h1>

        <div className="ev-card ev-rise" style={{ marginTop: "2.5rem", padding: "clamp(1.4rem, 3vw, 2rem)", maxWidth: "46rem", animationDelay: "0.1s" }}>
          <span className="ev-label" style={{ color: "var(--text-faint)" }}>What it will do</span>
          <ul style={{ marginTop: "1rem", paddingLeft: "1.1rem", display: "grid", gap: "0.6rem" }}>
            {what.map((w) => (
              <li key={w} className="ev-body">{w}</li>
            ))}
          </ul>
          <p className="ev-small" style={{ marginTop: "1.6rem", paddingTop: "1.2rem", borderTop: "1px solid var(--line)" }}>
            <strong style={{ color: "var(--text-soft)" }}>Waiting on:</strong> {blocked}
          </p>
        </div>
      </main>
    </>
  );
}
