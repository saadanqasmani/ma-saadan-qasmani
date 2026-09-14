"use client";

import { useMemo, useState } from "react";
import {
  band,
  convertGpa,
  convertGrades,
  convertIb,
  convertMarks,
  ibccGradeMarks,
  systems,
  type Conversion,
  type SystemId,
} from "@/content/gcb/qualifications";

const GRADES = ["A*", "A", "B", "C", "D", "E", "U"];

const OLEVEL_SUBJECTS = [
  "English",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology / Computer",
  "Urdu",
  "Islamiat",
  "Pakistan Studies",
];

/**
 * The equivalence calculator.
 *
 * Three moves: pick your system, tap your grades, see the number. No typing
 * where a tap will do, a running total that changes as you go so the thing
 * is alive in your hands, and the arithmetic available but folded away.
 *
 * The points are honest about what they are: a nudge to finish, and they say
 * so on the screen. They are kept in the browser, so a student who has not
 * made an account still gets them.
 */
export function Equivalence() {
  const [system, setSystem] = useState<SystemId | null>(null);
  const [grades, setGrades] = useState<Record<number, string>>({});
  const [marks, setMarks] = useState("");
  const [showWorkings, setShowWorkings] = useState(false);
  const [xp, setXp] = useState(0);
  const [flash, setFlash] = useState<{ id: number; amount: number } | null>(null);

  const chosen = systems.find((s) => s.id === system) ?? null;

  function award(amount: number) {
    setXp((x) => Math.min(100, x + amount));
    // A counter rather than a clock: all the key has to do is differ from
    // the last one so the animation replays.
    setFlash((f) => ({ id: (f?.id ?? 0) + 1, amount }));
  }

  function pickSystem(id: SystemId) {
    setSystem(id);
    setGrades({});
    setMarks("");
    setShowWorkings(false);
    if (xp === 0) award(15);
  }

  function pickGrade(index: number, grade: string) {
    const first = grades[index] === undefined;
    setGrades((g) => ({ ...g, [index]: grade }));
    if (first) award(5);
  }

  const subjectList = useMemo(
    () =>
      system === "olevel"
        ? OLEVEL_SUBJECTS
        : system === "alevel"
          ? ["Subject 1", "Subject 2", "Subject 3"]
          : [],
    [system]
  );

  const result: Conversion | null = useMemo(() => {
    if (!chosen) return null;

    if (chosen.input === "grades") {
      const entered = subjectList.map((_, i) => grades[i]).filter(Boolean) as string[];
      if (entered.length < subjectList.length) return null;
      return convertGrades(chosen.id as "olevel" | "alevel", entered);
    }

    const n = Number(marks);
    if (!marks.trim() || Number.isNaN(n) || n < 0) return null;

    if (chosen.input === "points") return n > 45 ? null : convertIb(n);
    if (chosen.input === "gpa") return n > 4 ? null : convertGpa(n);
    const outOf = chosen.outOf ?? 1100;
    return n > outOf ? null : convertMarks(n, outOf);
  }, [chosen, grades, marks, subjectList]);

  const filled = subjectList.length
    ? subjectList.filter((_, i) => grades[i]).length
    : marks.trim()
      ? 1
      : 0;
  const total = subjectList.length || 1;
  const progress = chosen ? Math.round((filled / total) * 100) : 0;

  return (
    <div>
      {/* Progress, always visible, never shouting. */}
      <div style={{ position: "relative", marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.6rem" }}>
          <span className="gcb-label" style={{ color: "var(--text-faint)" }}>
            {xp === 0 ? "Start anywhere" : `${xp} points`}
          </span>
          <span className="gcb-label" style={{ color: "var(--text-faint)" }}>
            {chosen ? `${filled} of ${total}` : "Step 1 of 2"}
          </span>
        </div>
        <div className="gcb-xp">
          <div className="gcb-xp__fill" style={{ width: `${Math.max(xp, progress)}%` }} />
        </div>
        {flash && (
          <span key={flash.id} className="gcb-points">
            +{flash.amount}
          </span>
        )}
      </div>

      {/* Step 1 */}
      <h2 className="gcb-h2">What are you studying?</h2>
      <div
        style={{
          marginTop: "1.25rem",
          display: "grid",
          gap: "0.75rem",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        }}
      >
        {systems.map((s) => (
          <button
            key={s.id}
            type="button"
            className="gcb-pick"
            data-on={system === s.id}
            onClick={() => pickSystem(s.id)}
          >
            <span className="gcb-h2" style={{ fontSize: "1.0625rem" }}>{s.short}</span>
            <p className="gcb-small" style={{ marginTop: "0.4rem" }}>{s.name}</p>
          </button>
        ))}
      </div>

      {/* Step 2 */}
      {chosen && (
        <div className="gcb-land" style={{ marginTop: "3rem" }}>
          <h2 className="gcb-h2">
            {chosen.input === "grades" ? "Tap your grades" : "Enter your result"}
          </h2>
          <p className="gcb-body" style={{ marginTop: "0.6rem", maxWidth: "52ch" }}>
            {chosen.blurb}
          </p>

          {chosen.input === "grades" ? (
            <div style={{ marginTop: "1.75rem", display: "grid", gap: "0.6rem" }}>
              {subjectList.map((subject, i) => (
                <div
                  key={subject}
                  className="gcb-card"
                  style={{
                    padding: "0.85rem 1rem",
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "0.75rem",
                  }}
                >
                  <span className="gcb-body" style={{ color: "var(--text)", minWidth: "9rem" }}>
                    {subject}
                  </span>
                  <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                    {GRADES.map((g) => (
                      <button
                        key={g}
                        type="button"
                        className="gcb-chip"
                        data-on={grades[i] === g}
                        onClick={() => pickGrade(i, g)}
                        aria-label={`${subject}: ${g}`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ marginTop: "1.75rem", maxWidth: "22rem" }}>
              <input
                type="number"
                inputMode="decimal"
                step={chosen.input === "gpa" ? "0.01" : "1"}
                value={marks}
                onChange={(e) => {
                  if (!marks && e.target.value) award(10);
                  setMarks(e.target.value);
                }}
                placeholder={
                  chosen.input === "points" ? "e.g. 38" : chosen.input === "gpa" ? "e.g. 3.60" : "e.g. 940"
                }
                className="gcb-h2"
                style={{
                  width: "100%",
                  padding: "0.9rem 1rem",
                  background: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "12px",
                  color: "var(--text)",
                  outline: "none",
                }}
              />
              <p className="gcb-small" style={{ marginTop: "0.6rem" }}>
                Out of {chosen.input === "gpa" ? "4.00" : chosen.outOf}
              </p>
            </div>
          )}
        </div>
      )}

      {/* The answer */}
      {result && chosen && <Result result={result} label={chosen.equivalentTo} onOpen={() => {
        if (!showWorkings) award(20);
        setShowWorkings((v) => !v);
      }} open={showWorkings} />}
    </div>
  );
}

function Result({
  result,
  label,
  open,
  onOpen,
}: {
  result: Conversion;
  label: string;
  open: boolean;
  onOpen: () => void;
}) {
  const b = band(result.percentage);
  const tone = b.tone === "high" ? "var(--free)" : b.tone === "mid" ? "var(--accent)" : "var(--paid)";

  return (
    <div
      className="gcb-card gcb-land"
      style={{ marginTop: "2.5rem", padding: "clamp(1.5rem, 4vw, 2.5rem)", borderColor: "var(--line-strong)" }}
    >
      <span className="gcb-label" style={{ color: tone }}>{b.label}</span>

      <div style={{ marginTop: "1rem", display: "flex", alignItems: "baseline", gap: "0.75rem", flexWrap: "wrap" }}>
        <span
          style={{
            fontFamily: "var(--gcb-display), system-ui, sans-serif",
            fontSize: "clamp(2.75rem, 8vw, 4.5rem)",
            fontWeight: 700,
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          {result.percentage.toFixed(1)}%
        </span>
        <span className="gcb-body">
          {result.score} out of {result.outOf}
        </span>
      </div>

      <p className="gcb-body" style={{ marginTop: "1.1rem", maxWidth: "58ch" }}>{b.note}</p>

      <p className="gcb-small" style={{ marginTop: "1.25rem" }}>
        Counts as: <strong style={{ color: "var(--text-soft)" }}>{label}</strong>
      </p>

      <button
        type="button"
        onClick={onOpen}
        className="gcb-btn gcb-btn--ghost"
        style={{ marginTop: "1.75rem" }}
      >
        {open ? "Hide the arithmetic" : "Show me the arithmetic"}
      </button>

      <div className="gcb-reveal" data-open={open} style={{ marginTop: open ? "1.5rem" : 0 }}>
        <div>
          <ol style={{ paddingLeft: "1.1rem", display: "grid", gap: "0.5rem" }}>
            {result.workings.map((w) => (
              <li key={w} className="gcb-body">{w}</li>
            ))}
          </ol>

          <div style={{ marginTop: "1.5rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            {ibccGradeMarks.map((g) => (
              <span
                key={g.grade}
                className="gcb-small"
                style={{
                  padding: "0.3rem 0.6rem",
                  border: "1px solid var(--line)",
                  borderRadius: "7px",
                }}
              >
                {g.grade} = {g.marks}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Never folded away. */}
      <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--line)" }}>
        {result.caveats.map((c) => (
          <p key={c} className="gcb-small" style={{ marginTop: "0.5rem" }}>
            {c}
          </p>
        ))}
      </div>
    </div>
  );
}
