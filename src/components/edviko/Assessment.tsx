"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { useAccount } from "@/components/edviko/Account";
import { EdvikoNav } from "@/components/edviko/EdvikoNav";
import { ITEMS } from "@/content/edviko/aptitude";
import { APTITUDES } from "@/content/edviko/careers";
import { SKILLS, type Skill } from "@/content/edviko/skills";
import { serverSnapshot, snapshot, subscribe, write } from "@/lib/edviko/browserStore";
import { isAnswered, recommend } from "@/lib/edviko/careerFit";
import {
  answeredCount,
  divergences,
  INDICATOR_KEY,
  isRight,
  progressOf,
  readAnswers,
  readSkills,
  scoreIndicator,
  skillGaps,
  SKILLS_KEY,
} from "@/lib/edviko/intelligence";

/**
 * The rest of the assessment: the part with right answers, and the part
 * about what you have actually practised.
 *
 * Every question is explained the moment it is answered, right or wrong,
 * because a test that only scores is a test nobody learns anything from. The
 * explanation is the point; the score is the excuse for reading it.
 *
 * Nothing on this page is averaged with anything else on it. What a student
 * believes about themselves and what twelve questions show are two different
 * kinds of fact, and where they disagree that disagreement is the finding.
 */
export function AssessmentPage() {
  const account = useAccount();
  const rawAnswers = useSyncExternalStore(subscribe(INDICATOR_KEY), snapshot(INDICATOR_KEY), serverSnapshot);
  const rawSkills = useSyncExternalStore(subscribe(SKILLS_KEY), snapshot(SKILLS_KEY), serverSnapshot);

  const answers = readAnswers(rawAnswers);
  const skills = readSkills(rawSkills);
  const [shown, setShown] = useState<Record<string, boolean>>({});

  const career = account?.assessment;
  const careerDone = Boolean(career && isAnswered(career));
  const progress = progressOf(answers, skills, careerDone);
  const scores = scoreIndicator(answers);
  const done = answeredCount(answers);
  // The family the student's own answers point at hardest. Falls back to
  // nothing rather than guessing: an untaken assessment has no direction, and
  // inventing one here would be the horoscope the rest of this avoids.
  const pointing = career && careerDone ? recommend(career).primary[0]?.career.family ?? null : null;
  const gaps = pointing ? skillGaps(skills, pointing) : [];
  const diverge = career ? divergences(answers, career.aptitudes) : [];
  const disagreements = diverge.filter((d) => d.kind === "underrates" || d.kind === "overrates");

  function answer(itemId: string, index: number) {
    write(INDICATOR_KEY, JSON.stringify({ ...answers, [itemId]: index }));
    setShown((s) => ({ ...s, [itemId]: true }));
  }

  function rate(skill: Skill, value: number) {
    write(SKILLS_KEY, JSON.stringify({ ...skills, [skill]: value }));
  }

  return (
    <>
      <EdvikoNav />
      <main className="ev-shell" style={{ maxWidth: "52rem", paddingBlock: "clamp(2.5rem, 6vw, 4rem) 6rem", display: "grid", gap: "1.75rem" }}>
        <header>
          <p className="ev-label" style={{ color: "var(--accent)" }}>Assessment</p>
          <h1 className="ev-h1" style={{ marginTop: "0.8rem", maxWidth: "22ch" }}>
            What you believe about yourself, and what the answers show.
          </h1>
          <p className="ev-body" style={{ color: "var(--text-soft)", marginTop: "0.9rem", maxWidth: "62ch" }}>
            Twelve questions with right answers, and eight things you can say you have practised.
            Nothing here is averaged with anything else. Two questions cannot measure an aptitude and
            this page will never pretend otherwise. What they can do is disagree with what you
            believe, and that is the part worth twenty minutes.
          </p>
        </header>

        <section className="ev-card" style={{ padding: "clamp(1.2rem, 3vw, 1.8rem)" }}>
          <span className="ev-label" style={{ color: "var(--text-faint)" }}>Where you are</span>
          <div style={{ display: "grid", gap: "0.7rem", marginTop: "0.9rem" }}>
            {progress.map((p) => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "baseline" }}>
                <span className="ev-body" style={{ color: p.done ? "var(--text)" : "var(--text-soft)" }}>
                  {p.done ? "✓ " : "○ "}
                  {p.label}
                </span>
                <span className="ev-small" style={{ color: "var(--text-faint)", whiteSpace: "nowrap" }}>{p.note}</span>
              </div>
            ))}
          </div>
          {!careerDone && (
            <Link href="/edviko/career" className="ev-btn ev-btn--ghost" style={{ marginTop: "1.2rem" }}>
              Start with the four career questions
            </Link>
          )}
        </section>

        <section style={{ display: "grid", gap: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <h2 className="ev-h2">Twelve questions</h2>
            <span className="ev-small" style={{ color: "var(--text-faint)" }}>{done} of {ITEMS.length} answered</span>
          </div>

          {ITEMS.map((item, n) => {
            const chosen = answers[item.id];
            const answered = typeof chosen === "number";
            const reveal = answered || shown[item.id];
            return (
              <div key={item.id} className="ev-card" style={{ padding: "clamp(1.1rem, 2.5vw, 1.5rem)" }}>
                <span className="ev-label" style={{ color: "var(--text-faint)" }}>
                  {n + 1} · {APTITUDES.find((a) => a.id === item.of)?.label}
                </span>
                <p className="ev-body" style={{ marginTop: "0.6rem", fontWeight: 600 }}>{item.ask}</p>
                <div style={{ display: "grid", gap: "0.45rem", marginTop: "0.9rem" }}>
                  {item.options.map((option, i) => {
                    const picked = chosen === i;
                    const correct = i === item.answer;
                    const tone = !reveal
                      ? undefined
                      : correct
                        ? "var(--free)"
                        : picked
                          ? "var(--red)"
                          : undefined;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => answer(item.id, i)}
                        className="ev-card"
                        style={{
                          textAlign: "start",
                          padding: "0.6rem 0.9rem",
                          cursor: "pointer",
                          background: picked ? "var(--surface-2)" : "transparent",
                          borderColor: tone ?? (picked ? "var(--accent)" : "var(--line)"),
                          color: tone ?? "inherit",
                        }}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
                {reveal && (
                  <p className="ev-small" style={{ marginTop: "0.9rem", color: "var(--text-soft)" }}>
                    <strong style={{ color: isRight(item, chosen) ? "var(--free)" : "var(--paid)" }}>
                      {isRight(item, chosen) ? "Right. " : `The answer is ${item.options[item.answer]}. `}
                    </strong>
                    {item.why}
                  </p>
                )}
              </div>
            );
          })}
        </section>

        {done > 0 && (
          <section className="ev-card" style={{ padding: "clamp(1.2rem, 3vw, 1.8rem)" }}>
            <span className="ev-label" style={{ color: "var(--text-faint)" }}>What the twelve showed</span>
            <div style={{ display: "grid", gap: "0.55rem", marginTop: "1rem" }}>
              {scores.map((s) => (
                <div key={s.of} style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                  <span className="ev-body">{s.label}</span>
                  <span className="ev-small" style={{ color: "var(--text-faint)", fontVariantNumeric: "tabular-nums" }}>
                    {s.answered === 0 ? "not answered" : `${s.right} of ${s.asked}`}
                  </span>
                </div>
              ))}
            </div>
            <p className="ev-small" style={{ marginTop: "1.2rem", color: "var(--text-faint)" }}>
              Six lines of two. This is a sighting shot, not a measurement, and no part of this
              product will treat it as one.
            </p>
          </section>
        )}

        {disagreements.length > 0 && (
          <section className="ev-card" style={{ padding: "clamp(1.2rem, 3vw, 1.8rem)", borderColor: "var(--accent)" }}>
            <span className="ev-label" style={{ color: "var(--accent)" }}>Where this disagrees with you</span>
            <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
              {disagreements.map((d) => (
                <div key={d.of}>
                  <p className="ev-body" style={{ fontWeight: 600 }}>
                    {d.label}: {d.kind === "underrates" ? "you may be harder on yourself than the answers are" : "worth a second look"}
                  </p>
                  <p className="ev-small" style={{ marginTop: "0.3rem", color: "var(--text-soft)" }}>{d.sentence}</p>
                </div>
              ))}
            </div>
            <p className="ev-small" style={{ marginTop: "1.2rem", color: "var(--text-faint)" }}>
              Bring this to your advisor rather than acting on it alone. It is a question, not a
              finding.
            </p>
          </section>
        )}

        <section style={{ display: "grid", gap: "1rem" }}>
          <h2 className="ev-h2">What you have practised</h2>
          <p className="ev-body" style={{ color: "var(--text-soft)", maxWidth: "62ch" }}>
            An aptitude is what you find easy. A skill is what you have done. Only the second one can
            be changed this year, and half of what makes an application competitive sits here rather
            than in the grades.
          </p>
          {SKILLS.map((s) => (
            <div key={s.id} className="ev-card" style={{ padding: "clamp(1.1rem, 2.5vw, 1.4rem)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                <span className="ev-body" style={{ fontWeight: 600 }}>{s.label}</span>
                <div style={{ display: "flex", gap: "0.3rem" }}>
                  {[1, 2, 3, 4, 5].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => rate(s.id, v)}
                      className="ev-chip"
                      data-on={skills[s.id] === v}
                      aria-label={`${s.label}: ${v} out of 5`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <p className="ev-small" style={{ marginTop: "0.6rem", color: "var(--text-soft)" }}>{s.means}</p>
              <p className="ev-small" style={{ marginTop: "0.35rem", color: "var(--text-faint)" }}>
                <strong>The smallest real thing:</strong> {s.build}
              </p>
            </div>
          ))}
        </section>

        {gaps.length > 0 && (
          <section className="ev-card" style={{ padding: "clamp(1.2rem, 3vw, 1.8rem)", borderColor: "var(--paid)" }}>
            <span className="ev-label" style={{ color: "var(--paid)" }}>What to build this year</span>
            <p className="ev-small" style={{ marginTop: "0.6rem", color: "var(--text-soft)" }}>
              For the direction your answers point at. Four things you could actually do, not eight
              you will not.
            </p>
            <div style={{ display: "grid", gap: "0.9rem", marginTop: "1rem" }}>
              {gaps.map((g) => (
                <div key={g.skill}>
                  <p className="ev-body" style={{ fontWeight: 600 }}>
                    {g.label}
                    <span className="ev-small" style={{ color: "var(--text-faint)", fontWeight: 400 }}>
                      {g.rated === null ? " · not rated yet" : ` · you said ${g.rated} of 5`}
                    </span>
                  </p>
                  <p className="ev-small" style={{ marginTop: "0.25rem", color: "var(--text-soft)" }}>{g.build}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <p className="ev-small" style={{ color: "var(--text-faint)", maxWidth: "62ch" }}>
          Your answers stay in this browser. Nothing is sent anywhere, and no score is kept about you
          that you cannot see on this page.
        </p>
      </main>
    </>
  );
}
