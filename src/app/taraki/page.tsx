import Link from "next/link";
import { TarakiNav } from "@/components/taraki/TarakiNav";
import { TarakiMark } from "@/components/taraki/Logo";
import { countries, hasAnyCosts } from "@/content/taraki/countries";
import { totalUniversities } from "@/content/taraki/universities";

export default function TarakiHome() {
  const sourced = countries.filter(hasAnyCosts).length;

  return (
    <>
      <TarakiNav />

      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", paddingBlock: "clamp(4rem, 10vw, 8rem) clamp(3rem, 7vw, 6rem)" }}>
        <div className="tk-aurora" aria-hidden />
        <div className="tk-shell" style={{ position: "relative" }}>
          <div className="tk-rise" style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <TarakiMark size={40} animate />
            <span className="tk-label" style={{ color: "var(--accent)" }}>
              Taraki · Starting in Pakistan
            </span>
          </div>

          <h1 className="tk-display tk-rise" style={{ marginTop: "1.5rem", maxWidth: "18ch", animationDelay: "0.06s" }}>
            Applying abroad should not cost a year&apos;s salary.
          </h1>

          <p className="tk-lead tk-rise" style={{ marginTop: "1.75rem", maxWidth: "56ch", animationDelay: "0.12s" }}>
            Agencies charge families thousands to fill in forms a student can file themselves.
            Taraki gives you the same answers for nothing: where you can get in, what it will
            actually cost, and exactly what to send. You pay only if you want a human on a call.
          </p>

          <div className="tk-rise" style={{ marginTop: "2.5rem", display: "flex", flexWrap: "wrap", gap: "0.9rem", animationDelay: "0.18s" }}>
            <Link href="/taraki/equivalence" className="tk-btn tk-btn--primary">
              Convert my grades
            </Link>
            <Link href="/taraki/pricing" className="tk-btn tk-btn--ghost">
              See what it costs
            </Link>
          </div>
        </div>
      </section>

      {/* What is free and what is not, said before anyone asks. */}
      <section className="tk-shell" style={{ paddingBlock: "clamp(2rem, 5vw, 4rem)" }}>
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {[
            { tag: "Free", tone: "free", title: "What your grades are worth", body: "O Level, A Level, Matric, FSc, IB. Tap what you got and see the number a foreign university actually reads." },
            { tag: "Free", tone: "free", title: "Where you can get in", body: "Your grades and profile against what universities actually publish about who they admit." },
            { tag: "Free", tone: "free", title: "What it costs", body: "Tuition, the living costs a visa requires you to prove, and what that comes to in your currency." },
            { tag: "Free", tone: "free", title: "How to apply", body: "Every document, every deadline, every fee. The part agencies charge the most for." },
            { tag: "$5", tone: "paid", title: "Scholarships", body: "A searchable list of what you can actually apply for, kept current. One subscription." },
            { tag: "Paid", tone: "paid", title: "Talk to a counsellor", body: "A real call with someone who has done this. Only if you want it." },
            { tag: "Paid", tone: "paid", title: "Talk to a student there", body: "Someone living in the country you are aiming at, telling you what it is really like." },
          ].map((c, i) => (
            <article
              key={c.title}
              className="tk-card tk-rise"
              style={{ padding: "1.5rem", animationDelay: `${0.04 * i}s` }}
            >
              <span
                className="tk-label"
                style={{ color: c.tone === "free" ? "var(--free)" : "var(--paid)" }}
              >
                {c.tag}
              </span>
              <h2 className="tk-h2" style={{ marginTop: "0.9rem" }}>{c.title}</h2>
              <p className="tk-body" style={{ marginTop: "0.6rem" }}>{c.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Destinations */}
      <section className="tk-shell" style={{ paddingBlock: "clamp(2rem, 5vw, 4rem)" }}>
        <h2 className="tk-h1">Where you can go</h2>
        <p className="tk-body" style={{ marginTop: "0.9rem", maxWidth: "60ch" }}>
          {totalUniversities} universities across twelve destinations. {sourced} countries have
          cost figures with a source attached so far; the rest say so rather than showing you a
          number nobody checked.
        </p>

        <div
          style={{
            marginTop: "2rem",
            display: "grid",
            gap: "0.75rem",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          }}
        >
          {countries.map((c, i) => {
            const ready = hasAnyCosts(c);
            return (
              <div
                key={c.code}
                className="tk-card tk-rise"
                style={{ padding: "1.1rem 1.2rem", animationDelay: `${0.03 * i}s`, opacity: ready ? 1 : 0.55 }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
                  <span className="tk-h2" style={{ fontSize: "1.0625rem" }}>{c.name}</span>
                  <span
                    className="tk-label"
                    style={{ color: ready ? "var(--free)" : "var(--text-faint)", fontSize: "0.625rem" }}
                  >
                    {ready ? "Sourced" : "Pending"}
                  </span>
                </div>
                {c.summary && (
                  <p className="tk-small" style={{ marginTop: "0.6rem" }}>{c.summary}</p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* The promise that makes the free part credible. */}
      <section className="tk-shell" style={{ paddingBlock: "clamp(2.5rem, 6vw, 5rem) 6rem" }}>
        <div className="tk-card" style={{ padding: "clamp(1.5rem, 4vw, 2.75rem)", borderColor: "var(--line-strong)" }}>
          <span className="tk-label" style={{ color: "var(--accent)" }}>How this stays honest</span>
          <h2 className="tk-h1" style={{ marginTop: "1rem", maxWidth: "22ch" }}>
            Every number here carries its source and its date.
          </h2>
          <p className="tk-body" style={{ marginTop: "1.1rem", maxWidth: "62ch" }}>
            A student may hand this to a parent and ask them to commit a decade of savings.
            So nothing on this site is an estimate dressed up as a fact. Where a figure comes
            from a government, it says so. Where it comes from an aggregator and has not been
            checked against the issuing body, it says that too. Where there is no figure yet,
            it stays blank.
          </p>
          <p className="tk-small" style={{ marginTop: "1.25rem" }}>
            Taraki does not predict admission. It shows you your profile against what a
            university publishes about the students it admits, and lets you draw your own
            conclusion.
          </p>

          <p className="tk-small" style={{ marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid var(--line)" }}>
            <strong style={{ color: "var(--text-soft)" }}>About the name.</strong> Taraqi
            (ترقی) means progress: moving up, getting on. Tara means star. Both readings are
            meant, and so is the mark, which is a star going up rather than falling.
          </p>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid var(--line)" }}>
        <div className="tk-shell" style={{ paddingBlock: "2rem", display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "space-between" }}>
          <span className="tk-small">Taraki · Internal build, not public</span>
          <span className="tk-small">Nothing here is final</span>
        </div>
      </footer>
    </>
  );
}
