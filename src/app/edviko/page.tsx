import Link from "next/link";
import { EdvikoNav } from "@/components/edviko/EdvikoNav";
import { EdvikoMark } from "@/components/edviko/Logo";
import { totalUniversities } from "@/content/edviko/universities";
import { totalCareers } from "@/content/edviko/careers";

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
    href: "/edviko/career",
    label: "Work out what I actually want to do",
    hint: "Four questions. Do this before you look at a single university.",
  },
  {
    href: "/edviko/assessment",
    label: "Answer twelve questions with right answers",
    hint: "Then see where they disagree with what you believe about yourself.",
  },
  {
    href: "/edviko/equivalence",
    label: "Find out what my grades are worth",
    hint: "O Level, A Level, Matric, FSc, IB. About a minute.",
  },
  {
    href: "/edviko/match",
    label: "See where I could go",
    hint: `${totalUniversities} universities in twelve countries.`,
  },
  {
    href: "/edviko/plan",
    label: "Build my wish list",
    hint: "Dream, likely and safe. Keep them straight.",
  },
  {
    href: "/edviko/costs",
    label: "Add up what it really costs",
    hint: "Eleven lines, all the years, and the gap at the end.",
  },
];

export default function EdvikoHome() {
  return (
    <>
      <EdvikoNav />

      <section style={{ position: "relative", overflow: "hidden", paddingBlock: "clamp(2.5rem, 6vw, 5rem) clamp(2rem, 4vw, 3rem)" }}>
        <div className="ev-aurora" aria-hidden />
        <div className="ev-shell" style={{ position: "relative" }}>
          <div className="ev-rise" style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
            <EdvikoMark size={34} animate />
            <span className="ev-label" style={{ color: "var(--accent)" }}>
              Edviko · Free
            </span>
          </div>

          <h1 className="ev-display ev-rise" style={{ marginTop: "1.25rem", maxWidth: "15ch", animationDelay: "0.05s" }}>
            Applying abroad should not cost a kidney.
          </h1>

          {/* The doing, before the arguing. */}
          <div className="ev-start ev-rise" style={{ marginTop: "2.25rem", animationDelay: "0.1s" }}>
            {START.map((s, i) => (
              <Link key={s.href} href={s.href} className="ev-start__card">
                <span className="ev-start__num" aria-hidden>{i + 1}</span>
                <span>
                  <span className="ev-h2" style={{ fontSize: "1.0625rem", display: "block" }}>
                    {s.label}
                  </span>
                  <span className="ev-small" style={{ display: "block", marginTop: "0.3rem" }}>
                    {s.hint}
                  </span>
                </span>
              </Link>
            ))}
          </div>

          <p className="ev-small ev-rise" style={{ marginTop: "1.25rem", animationDelay: "0.15s" }}>
            No account needed to start. <Link href="/edviko/join" style={{ color: "var(--accent)" }}>Make one</Link>{" "}
            when you want it kept, or <Link href="/edviko/signin" style={{ color: "var(--accent)" }}>sign in</Link>.
          </p>
        </div>
      </section>

      {/*
        The other three people who open this.
        The front page assumed a student, which left a parent, an advisor and
        a head of campus with no door of their own and a student's menu to
        guess from.
      */}
      <section className="ev-shell" style={{ paddingBlock: "clamp(1.5rem, 4vw, 2.5rem)" }}>
        <p className="ev-label" style={{ color: "var(--text-faint)" }}>Not a student?</p>
        <div style={{ display: "grid", gap: "0.7rem", marginTop: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          {[
            {
              href: "/edviko/family",
              label: "I am a parent or guardian",
              hint: "Where they are, what it will cost, and what is being asked of you.",
            },
            {
              href: "/edviko/advisor",
              label: "I am a career advisor",
              hint: "A caseload sorted by who needs you this morning, not by surname.",
            },
            {
              href: "/edviko/campus",
              label: "I run a campus",
              hint: "Workload beside outcomes, and where the campus is losing people.",
            },
          ].map((d) => (
            <Link key={d.href} href={d.href} className="ev-card" style={{ padding: "1.2rem", display: "block" }}>
              <span className="ev-h2" style={{ fontSize: "1.0625rem", display: "block" }}>{d.label}</span>
              <span className="ev-small" style={{ display: "block", marginTop: "0.35rem" }}>{d.hint}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* The argument, for whoever wants it. */}
      <section className="ev-shell" style={{ paddingBlock: "clamp(2rem, 5vw, 3.5rem)" }}>
        <p className="ev-lead" style={{ maxWidth: "50ch" }}>
          Agencies charge lakhs to fill in forms you could file yourself. We do the same work for
          free. You pay only if you want a human on a call.
        </p>
        <p className="ev-lead" style={{ maxWidth: "50ch", marginTop: "1.2rem" }}>
          And we start one step earlier than they do. Choosing a university before you have any idea
          what the work is like is how people end up with a degree they never use, and it is the
          most expensive mistake on this whole list.
        </p>
      </section>

      {/* Free and paid, said before anyone has to ask. */}
      <section className="ev-shell" style={{ paddingBlock: "clamp(1rem, 3vw, 2rem)" }}>
        <div style={{ display: "grid", gap: "0.7rem", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          {[
            { tag: "Free", tone: "free", title: "The career, first", body: `${totalCareers} careers read against your own answers, including the ones your subjects have already closed.` },
            { tag: "Free", tone: "free", title: "Grade equivalence", body: "The number a foreign university actually reads, with the arithmetic shown." },
            { tag: "Free", tone: "free", title: "Universities and costs", body: "Where you can apply, and what a year really costs, with a source on every figure." },
            { tag: "Free", tone: "free", title: "The whole application", body: "Every document and every deadline, in one list that ticks off." },
            { tag: "$5", tone: "paid", title: "When you want a person", body: "Scholarships kept current, a document review, and a call with someone who has done it." },
          ].map((c, i) => (
            <article key={c.title} className="ev-card ev-rise" style={{ padding: "1.35rem", animationDelay: `${0.04 * i}s` }}>
              <span className="ev-label" style={{ color: c.tone === "free" ? "var(--free)" : "var(--paid)" }}>
                {c.tag}
              </span>
              <h2 className="ev-h2" style={{ marginTop: "0.8rem", fontSize: "1.0625rem" }}>{c.title}</h2>
              <p className="ev-body" style={{ marginTop: "0.5rem" }}>{c.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ev-shell" style={{ paddingBlock: "clamp(2rem, 5vw, 3.5rem) 5rem" }}>
        <div className="ev-card" style={{ padding: "clamp(1.4rem, 4vw, 2.5rem)", borderColor: "var(--line-strong)" }}>
          <span className="ev-label" style={{ color: "var(--accent)" }}>No vibes, only receipts</span>
          <h2 className="ev-h1" style={{ marginTop: "0.9rem", maxWidth: "20ch" }}>
            Every number here links to where it came from.
          </h2>
          <p className="ev-body" style={{ marginTop: "1rem", maxWidth: "56ch" }}>
            Fees, deadlines, entry requirements. Tap the source on any of them and you land on
            the university&apos;s own page. Show your parents. We would rather you checked.
          </p>
        </div>
      </section>

      <footer style={{ borderTop: "1px solid var(--line)" }}>
        <div className="ev-shell" style={{ paddingBlock: "2rem", display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "space-between" }}>
          <span className="ev-small">Edviko · Internal build, not public</span>
          <span className="ev-small">Nothing here is final</span>
        </div>
      </footer>
    </>
  );
}
