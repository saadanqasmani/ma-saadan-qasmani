import { TarakiNav } from "@/components/taraki/TarakiNav";
import { Plan } from "@/components/taraki/Plan";
import { stages } from "@/content/taraki/documents";

export default function Page() {
  return (
    <>
      <TarakiNav />
      <main className="tk-shell" style={{ paddingBlock: "clamp(3rem, 7vw, 5rem) 6rem" }}>
        <p className="tk-label tk-rise" style={{ color: "var(--accent)" }}>
          Free · Stays on your device
        </p>
        <h1 className="tk-h1 tk-rise" style={{ marginTop: "1.25rem", maxWidth: "18ch", animationDelay: "0.05s" }}>
          Your applications, one list at a time.
        </h1>
        <p className="tk-lead tk-rise" style={{ marginTop: "1.25rem", maxWidth: "60ch", animationDelay: "0.1s" }}>
          An application is about forty small tasks owned by five different people. What makes
          students give up is not difficulty, it is not being able to see where they are.
        </p>

        <div className="tk-rise" style={{ marginTop: "2.5rem", display: "flex", flexWrap: "wrap", gap: "0.5rem", animationDelay: "0.12s" }}>
          {stages.map((s, i) => (
            <span
              key={s.id}
              className="tk-small"
              style={{
                padding: "0.45rem 0.85rem",
                borderRadius: "99px",
                border: "1px solid var(--line)",
                color: "var(--text-soft)",
              }}
            >
              {i + 1}. {s.name}
            </span>
          ))}
        </div>

        <div className="tk-rise" style={{ marginTop: "2.5rem", animationDelay: "0.15s" }}>
          <Plan />
        </div>

        <p className="tk-small" style={{ marginTop: "2.5rem", maxWidth: "60ch" }}>
          Nothing on this page is sent anywhere. Your list lives in this browser only, which is
          why it works without an account and why clearing your browser data clears it.
        </p>
      </main>
    </>
  );
}
