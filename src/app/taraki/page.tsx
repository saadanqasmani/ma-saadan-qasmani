import Link from "next/link";
import { TarakiNav } from "@/components/taraki/TarakiNav";
import { TarakiMark } from "@/components/taraki/Logo";
import { countries, hasAnyCosts } from "@/content/taraki/countries";
import { totalUniversities } from "@/content/taraki/universities";

/**
 * A place to start, not a page to read.
 *
 * The old front page argued its case for a screen and a half before offering
 * anything to do. A sixteen-year-old on a phone does not read a case; they
 * look for the button. So the four things they came for are the first thing
 * on the page, numbered, and the argument comes after for whoever wants it.
 */

const START = [
  {
    href: "/taraki/equivalence",
    label: "Find out what my grades are worth",
    hint: "O Level, A Level, Matric, FSc, IB. About a minute.",
  },
  {
    href: "/taraki/match",
    label: "See where I could go",
    hint: `${totalUniversities} universities in twelve countries.`,
  },
  {
    href: "/taraki/plan",
    label: "Start my application list",
    hint: "Every document, and who has to produce it.",
  },
  {
    href: "/taraki/talk",
    label: "Talk to a real person",
    hint: "A counsellor, or a student already out there.",
  },
];

export default function TarakiHome() {
  const sourced = countries.filter(hasAnyCosts).length;

  return (
    <>
      <TarakiNav />

      <section style={{ position: "relative", overflow: "hidden", paddingBlock: "clamp(2.5rem, 6vw, 5rem) clamp(2rem, 4vw, 3rem)" }}>
        <div className="tk-aurora" aria-hidden />
        <div className="tk-shell" style={{ position: "relative" }}>
          <div className="tk-rise" style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
            <TarakiMark size={34} animate />
            <span className="tk-label" style={{ color: "var(--accent)" }}>
              Taraki · Free · Starting in Pakistan
            </span>
          </div>

          <h1 className="tk-display tk-rise" style={{ marginTop: "1.25rem", maxWidth: "15ch", animationDelay: "0.05s" }}>
            Applying abroad, without the agency fee.
          </h1>

          {/* The doing, before the arguing. */}
          <div className="tk-start tk-rise" style={{ marginTop: "2.25rem", animationDelay: "0.1s" }}>
            {START.map((s, i) => (
              <Link key={s.href} href={s.href} className="tk-start__card">
                <span className="tk-start__num" aria-hidden>{i + 1}</span>
                <span>
                  <span className="tk-h2" style={{ fontSize: "1.0625rem", display: "block" }}>
                    {s.label}
                  </span>
                  <span className="tk-small" style={{ display: "block", marginTop: "0.3rem" }}>
                    {s.hint}
                  </span>
                </span>
              </Link>
            ))}
          </div>

          <p className="tk-small tk-rise" style={{ marginTop: "1.25rem", animationDelay: "0.15s" }}>
            No account needed. Nothing to pay.
          </p>
        </div>
      </section>

      {/* The argument, for whoever wants it. */}
      <section className="tk-shell" style={{ paddingBlock: "clamp(2rem, 5vw, 3.5rem)" }}>
        <p className="tk-lead" style={{ maxWidth: "54ch" }}>
          Agencies charge families thousands to fill in forms a student can file themselves.
          Taraki gives you the same answers for nothing. You pay only if you want a person on a
          call.
        </p>
      </section>

      {/* Free and paid, said before anyone has to ask. */}
      <section className="tk-shell" style={{ paddingBlock: "clamp(1rem, 3vw, 2rem)" }}>
        <div style={{ display: "grid", gap: "0.7rem", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {[
            { tag: "Free", tone: "free", title: "Grade equivalence", body: "The number a foreign university actually reads, with the arithmetic shown." },
            { tag: "Free", tone: "free", title: "Universities and costs", body: "Where you can apply, and what a year really costs, with a source on every figure." },
            { tag: "Free", tone: "free", title: "The whole application", body: "Every document, every deadline, and who has to produce each one." },
            { tag: "$5", tone: "paid", title: "When you want a person", body: "Scholarships kept current, a document review, and a call with someone who has done it." },
          ].map((c, i) => (
            <article key={c.title} className="tk-card tk-rise" style={{ padding: "1.35rem", animationDelay: `${0.04 * i}s` }}>
              <span className="tk-label" style={{ color: c.tone === "free" ? "var(--free)" : "var(--paid)" }}>
                {c.tag}
              </span>
              <h2 className="tk-h2" style={{ marginTop: "0.8rem", fontSize: "1.0625rem" }}>{c.title}</h2>
              <p className="tk-body" style={{ marginTop: "0.5rem" }}>{c.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="tk-shell" style={{ paddingBlock: "clamp(2rem, 5vw, 3.5rem) 5rem" }}>
        <div className="tk-card" style={{ padding: "clamp(1.4rem, 4vw, 2.5rem)", borderColor: "var(--line-strong)" }}>
          <span className="tk-label" style={{ color: "var(--accent)" }}>How this stays honest</span>
          <h2 className="tk-h1" style={{ marginTop: "0.9rem", maxWidth: "20ch" }}>
            Every number here carries its source and its date.
          </h2>
          <p className="tk-body" style={{ marginTop: "1rem", maxWidth: "62ch" }}>
            A student may hand this to a parent and ask them to commit a decade of savings. So
            nothing here is an estimate dressed up as a fact. {sourced} of twelve countries have
            cost figures with a source attached; the rest say so rather than showing a number
            nobody checked.
          </p>
          <p className="tk-small" style={{ marginTop: "1.1rem" }}>
            Taraki does not predict admission. It shows you your profile against what a
            university publishes about the students it admits, and lets you draw your own
            conclusion.
          </p>
          <p className="tk-small" style={{ marginTop: "1.4rem", paddingTop: "1.2rem", borderTop: "1px solid var(--line)" }}>
            <strong style={{ color: "var(--text-soft)" }}>About the name.</strong> Taraqi (ترقی)
            means progress: moving up, getting on. Tara means star. Both readings are meant, and
            so is the mark, which is a star going up rather than falling.
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
