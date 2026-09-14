"use client";

import Link from "next/link";
import { useState } from "react";
import { useAccount } from "@/components/taraki/Account";
import {
  APTITUDES,
  FAMILIES,
  PREFS,
  SUBJECTS,
  type Aptitude,
  type Family,
  type Pref,
  type Subject,
} from "@/content/taraki/careers";
import { saveProfile, type Profile } from "@/lib/taraki/account";
import {
  VERDICT_META,
  isAnswered,
  listOf,
  recommend,
  type Assessment,
  type Fit,
} from "@/lib/taraki/careerFit";

/**
 * The career assessment, and what it concludes.
 *
 * Four short questions rather than a personality test, because a student
 * will finish four and abandon forty. What it produces is deliberately not a
 * score: four separate judgements, each with the sentence behind it, and
 * a list of the routes their current subjects have already closed.
 *
 * Nothing here is stored anywhere but this device, and the page says so.
 */

const STEPS = ["Fields", "Strengths", "Your day", "Subjects", "Result"] as const;

export function CareerAssessment() {
  const account = useAccount();
  const saved = account?.assessment;
  const [step, setStep] = useState(0);
  const [interests, setInterests] = useState<Family[]>(saved?.interests ?? []);
  const [aptitudes, setAptitudes] = useState<Partial<Record<Aptitude, number>>>(saved?.aptitudes ?? {});
  const [prefs, setPrefs] = useState<Pref[]>(saved?.prefs ?? []);
  const [subjects, setSubjects] = useState<Subject[]>(saved?.subjects ?? []);

  const assessment: Assessment = { interests, aptitudes, prefs, subjects, takenAt: saved?.takenAt ?? "" };

  function toggle<T>(list: T[], value: T, set: (next: T[]) => void) {
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  function finish() {
    if (account) {
      const next: Profile = {
        ...account,
        assessment: { interests, aptitudes, prefs, subjects, takenAt: new Date().toISOString() },
      };
      saveProfile(next);
    }
    setStep(4);
  }

  return (
    <div>
      <ol className="tk-steps" aria-label="Progress">
        {STEPS.map((s, i) => (
          <li key={s} data-on={i === step} data-done={i < step}>
            <button type="button" onClick={() => i <= step && setStep(i)} disabled={i > step}>
              {s}
            </button>
          </li>
        ))}
      </ol>

      {step === 0 && (
        <Question
          title="Which of these actually interest you?"
          hint="Pick as many as are true. Picking none is also an answer, and the rest of the assessment still works."
          onNext={() => setStep(1)}
        >
          <div className="tk-choices">
            {FAMILIES.map((f) => (
              <Choice key={f.id} on={interests.includes(f.id)} onClick={() => toggle(interests, f.id, setInterests)}>
                {f.label}
              </Choice>
            ))}
          </div>
        </Question>
      )}

      {step === 1 && (
        <Question
          title="How would you rate yourself on each of these?"
          hint="Your own honest reading, not a test. One is weak, five is strong. Leave any you are unsure about."
          onNext={() => setStep(2)}
          onBack={() => setStep(0)}
        >
          <div style={{ display: "grid", gap: "1.1rem" }}>
            {APTITUDES.map((a) => (
              <div key={a.id}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                  <span className="tk-body" style={{ fontWeight: 600 }}>{a.label}</span>
                  <span className="tk-small" style={{ color: "var(--text-faint)" }}>{a.asked}</span>
                </div>
                <div className="tk-scale" role="radiogroup" aria-label={a.label}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      role="radio"
                      aria-checked={aptitudes[a.id] === n}
                      data-on={aptitudes[a.id] === n}
                      onClick={() =>
                        setAptitudes((prev) => {
                          const next = { ...prev };
                          if (next[a.id] === n) delete next[a.id];
                          else next[a.id] = n;
                          return next;
                        })
                      }
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Question>
      )}

      {step === 2 && (
        <Question
          title="What should a working day look like?"
          hint="Pick the ones that sound like you at your best."
          onNext={() => setStep(3)}
          onBack={() => setStep(1)}
        >
          <div className="tk-choices">
            {PREFS.map((p) => (
              <Choice key={p.id} on={prefs.includes(p.id)} onClick={() => toggle(prefs, p.id, setPrefs)}>
                {p.label}
              </Choice>
            ))}
          </div>
        </Question>
      )}

      {step === 3 && (
        <Question
          title="What are you taking at school?"
          hint="Include subjects you are still studying and ones you have already finished. This is the part that decides which doors are open."
          onNext={finish}
          onBack={() => setStep(2)}
          nextLabel="See the result"
        >
          <div className="tk-choices">
            {SUBJECTS.map((s) => (
              <Choice key={s} on={subjects.includes(s)} onClick={() => toggle(subjects, s, setSubjects)}>
                {s}
              </Choice>
            ))}
          </div>
        </Question>
      )}

      {step === 4 && <Result assessment={assessment} signedIn={Boolean(account)} onRedo={() => setStep(0)} />}
    </div>
  );
}

function Question({
  title,
  hint,
  children,
  onNext,
  onBack,
  nextLabel = "Next",
}: {
  title: string;
  hint: string;
  children: React.ReactNode;
  onNext: () => void;
  onBack?: () => void;
  nextLabel?: string;
}) {
  return (
    <div className="tk-card tk-rise" style={{ padding: "clamp(1.4rem, 3vw, 2rem)", marginTop: "1.5rem" }}>
      <h2 className="tk-h2">{title}</h2>
      <p className="tk-small" style={{ marginTop: "0.6rem", color: "var(--text-soft)", maxWidth: "48ch" }}>{hint}</p>
      <div style={{ marginTop: "1.6rem" }}>{children}</div>
      <div style={{ marginTop: "2rem", display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
        <button type="button" className="tk-btn tk-btn--primary" onClick={onNext}>
          {nextLabel}
        </button>
        {onBack && (
          <button type="button" className="tk-btn tk-btn--ghost" onClick={onBack}>
            Back
          </button>
        )}
      </div>
    </div>
  );
}

function Choice({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" className="tk-choice" data-on={on} aria-pressed={on} onClick={onClick}>
      {children}
    </button>
  );
}

function Result({ assessment, signedIn, onRedo }: { assessment: Assessment; signedIn: boolean; onRedo: () => void }) {
  const { primary, alternatives, shut } = recommend(assessment);

  if (!isAnswered(assessment)) {
    return (
      <div className="tk-card" style={{ padding: "2rem", marginTop: "1.5rem" }}>
        <h2 className="tk-h2">Nothing to work with yet.</h2>
        <p className="tk-body" style={{ marginTop: "0.8rem", color: "var(--text-soft)" }}>
          Answer at least one question and this will have something to say.
        </p>
        <button type="button" className="tk-btn tk-btn--primary" style={{ marginTop: "1.5rem" }} onClick={onRedo}>
          Start again
        </button>
      </div>
    );
  }

  return (
    <div style={{ marginTop: "1.5rem", display: "grid", gap: "1.5rem" }}>
      {!signedIn && (
        <p className="tk-card tk-small" style={{ padding: "1rem 1.2rem", color: "var(--text-soft)" }}>
          You are not signed in, so this result lives on this device only and will not follow you to your phone.
        </p>
      )}

      {shut.length > 0 && (
        <section className="tk-card" style={{ padding: "clamp(1.4rem, 3vw, 2rem)", borderColor: "var(--paid)" }}>
          <span className="tk-label" style={{ color: "var(--paid)" }}>Read this first</span>
          <h2 className="tk-h2" style={{ marginTop: "0.8rem" }}>
            {shut.length === 1 ? "One route" : `${shut.length} routes`} you point at, that your subjects have closed.
          </h2>
          <p className="tk-small" style={{ marginTop: "0.7rem", color: "var(--text-soft)", maxWidth: "52ch" }}>
            Not a judgement on you. A requirement, which in some school systems can still be changed this year, and
            cannot be changed at all once you have left.
          </p>
          <div style={{ marginTop: "1.4rem", display: "grid", gap: "0.9rem" }}>
            {shut.map((f) => (
              <div key={f.career.id} style={{ borderTop: "1px solid var(--line)", paddingTop: "0.9rem" }}>
                <p className="tk-body" style={{ fontWeight: 600 }}>{f.career.name}</p>
                <p className="tk-small" style={{ marginTop: "0.3rem", color: "var(--paid)" }}>
                  Needs {listOf(f.career.required)}. You have not listed {f.missing.join(" or ")}.
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <span className="tk-label" style={{ color: "var(--accent)" }}>Where your answers point</span>
        <div style={{ marginTop: "1rem", display: "grid", gap: "1rem" }}>
          {primary.map((f) => (
            <FitCard key={f.career.id} fit={f} open />
          ))}
        </div>
      </section>

      {alternatives.length > 0 && (
        <section>
          <span className="tk-label" style={{ color: "var(--text-faint)" }}>Also worth reading</span>
          <div style={{ marginTop: "1rem", display: "grid", gap: "1rem" }}>
            {alternatives.map((f) => (
              <FitCard key={f.career.id} fit={f} />
            ))}
          </div>
        </section>
      )}

      <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
        <Link href="/taraki/match" className="tk-btn tk-btn--primary">
          See universities for these
        </Link>
        <button type="button" className="tk-btn tk-btn--ghost" onClick={onRedo}>
          Answer again
        </button>
      </div>

      <p className="tk-small" style={{ color: "var(--text-faint)", maxWidth: "56ch" }}>
        This is your own answers, sorted and explained. It is not a test, not a prediction, and not advice from a
        person. It is a place to start an argument with yourself, and then with someone who does the job.
      </p>
    </div>
  );
}

export function FitCard({ fit, open = false }: { fit: Fit; open?: boolean }) {
  const [show, setShow] = useState(open);
  const c = fit.career;

  return (
    <article className="tk-card" style={{ padding: "clamp(1.2rem, 2.5vw, 1.7rem)" }}>
      <button
        type="button"
        onClick={() => setShow(!show)}
        aria-expanded={show}
        style={{ display: "flex", width: "100%", gap: "1rem", alignItems: "flex-start", justifyContent: "space-between", background: "none", border: 0, padding: 0, cursor: "pointer", textAlign: "left", color: "inherit" }}
      >
        <span>
          <span className="tk-h2" style={{ display: "block" }}>{c.name}</span>
          <span className="tk-small" style={{ display: "block", marginTop: "0.4rem", color: "var(--text-soft)" }}>
            {c.work}
          </span>
        </span>
        <span className="tk-small" style={{ color: "var(--text-faint)", flex: "none" }}>{show ? "Hide" : "Open"}</span>
      </button>

      <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {fit.signals.map((s) => (
          <span key={s.id} className="tk-chip" style={{ color: VERDICT_META[s.verdict].tone }}>
            {s.label}: {VERDICT_META[s.verdict].label}
          </span>
        ))}
      </div>

      {show && (
        <div style={{ marginTop: "1.4rem", display: "grid", gap: "1.2rem" }}>
          <div style={{ display: "grid", gap: "0.7rem" }}>
            {fit.signals.map((s) => (
              <div key={s.id} style={{ borderLeft: `2px solid ${VERDICT_META[s.verdict].tone}`, paddingLeft: "0.8rem" }}>
                <p className="tk-small" style={{ fontWeight: 600 }}>{s.label}</p>
                <p className="tk-small" style={{ color: "var(--text-soft)" }}>{s.because}</p>
              </div>
            ))}
          </div>

          <Facts label="What you would study" value={c.degrees.join(" · ")} />
          <Facts label="How long" value={c.years} />
          <Facts label="After the first degree" value={c.after} />
          {c.licence && <Facts label="Licensing" value={c.licence} tone="var(--paid)" />}
          <Facts label="What people find out late" value={c.reality} />

          <div>
            <span className="tk-label" style={{ color: "var(--text-faint)" }}>What to do next</span>
            <ol style={{ marginTop: "0.6rem", paddingLeft: "1.1rem", display: "grid", gap: "0.4rem" }}>
              {fit.steps.map((s) => (
                <li key={s} className="tk-small" style={{ color: "var(--text-soft)" }}>{s}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </article>
  );
}

function Facts({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div>
      <span className="tk-label" style={{ color: "var(--text-faint)" }}>{label}</span>
      <p className="tk-small" style={{ marginTop: "0.3rem", color: tone ?? "var(--text-soft)" }}>{value}</p>
    </div>
  );
}
