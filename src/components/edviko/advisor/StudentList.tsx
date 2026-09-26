"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Dot, Row, Tag } from "@/components/edviko/portal/parts";
import { factsOf, type StudentRecord } from "@/lib/edviko/org";
import { flagsFor, STAGE_BY_ID, worst, type Tone } from "@/lib/edviko/pipeline";

/**
 * A caseload, sorted by who needs the advisor most.
 *
 * Alphabetical is the wrong default. An advisor opening this list at nine in
 * the morning wants the four students who are in trouble, not the four whose
 * surnames begin with A, and any list of two hundred sorted alphabetically
 * is read only as far as the first screen.
 */
export function StudentList({ students }: { students: StudentRecord[] }) {
  const [query, setQuery] = useState("");
  const [only, setOnly] = useState<"all" | Tone>("all");

  const rows = useMemo(() => {
    return students
      .map((student) => {
        const flags = flagsFor(factsOf(student));
        return {
          student,
          flags,
          tone: worst(flags.map((f) => f.tone)),
          rank: flags.reduce((n, f) => n + (f.tone === "red" ? 10 : 1), 0),
        };
      })
      .filter((r) => (only === "all" ? true : r.tone === only))
      .filter((r) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
          r.student.name.toLowerCase().includes(q) ||
          r.student.id.toLowerCase().includes(q) ||
          r.student.careerTrack.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.rank - a.rank || a.student.name.localeCompare(b.student.name));
  }, [students, query, only]);

  const counts = useMemo(() => {
    const t = { red: 0, amber: 0, green: 0 };
    for (const s of students) {
      t[worst(flagsFor(factsOf(s)).map((f) => f.tone))] += 1;
    }
    return t;
  }, [students]);

  const filters: { id: "all" | Tone; label: string }[] = [
    { id: "all", label: `Everyone ${students.length}` },
    { id: "red", label: `Act today ${counts.red}` },
    { id: "amber", label: `This week ${counts.amber}` },
    { id: "green", label: `On track ${counts.green}` },
  ];

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="A name, a code, a career"
          className="ev-field"
          style={{ flex: "1 1 16rem" }}
          aria-label="Search this caseload"
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              className="ev-chip"
              data-on={only === f.id}
              onClick={() => setOnly(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="ev-panel">
        <div className="ev-panel__body" style={{ padding: "0.35rem 1.15rem" }}>
          {rows.length === 0 && (
            <p className="ev-small" style={{ color: "var(--text-faint)", padding: "1.25rem 0" }}>
              Nobody matches that.
            </p>
          )}
          {rows.map((r) => (
            <Row
              key={r.student.id}
              lead={<Dot tone={r.tone} />}
              title={<Link href={`/edviko/advisor/students/${r.student.id}`}>{r.student.name}</Link>}
              sub={
                <>
                  {r.student.id} · {r.student.grade} · {STAGE_BY_ID[r.student.stage].label} ·{" "}
                  {r.flags[0]?.title ?? "Nothing flagged"}
                </>
              }
              end={<Tag tone={r.tone}>{r.tone === "red" ? "Act today" : r.tone === "amber" ? "This week" : "On track"}</Tag>}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
