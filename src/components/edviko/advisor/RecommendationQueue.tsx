"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { Dot, Empty, Panel, Row, Tag, Tile } from "@/components/edviko/portal/parts";
import { SIGNED_IN_ADVISOR, STUDENTS } from "@/content/edviko/demo";
import { serverSnapshot, snapshot, subscribe } from "@/lib/edviko/browserStore";
import { readRecommendations, RECOMMENDATIONS_KEY, SOURCES } from "@/lib/edviko/cases";
import { studentsOfAdvisor } from "@/lib/edviko/org";

/**
 * Everything advised, and everything that should have been.
 *
 * Two halves, and the second is the one that matters. A list of what has
 * been recommended is a filing cabinet; the students who have been assessed,
 * discussed, and never actually given a recommendation in writing are the
 * ones this exists to surface. In every counselling office that work is
 * real, has happened, and lives only in the advisor's memory — which is
 * fine until they leave, or until a parent asks why.
 *
 * Review dates are the other half of the same idea. A recommendation made
 * before a set of results, a currency move or a change in a country's rules
 * is not wrong, it is old, and nobody notices unless something says so.
 */
export function RecommendationQueue() {
  const raw = useSyncExternalStore(
    subscribe(RECOMMENDATIONS_KEY),
    snapshot(RECOMMENDATIONS_KEY),
    serverSnapshot
  );
  const all = readRecommendations(raw);
  const mine = studentsOfAdvisor(STUDENTS, SIGNED_IN_ADVISOR.code);
  const names = new Map(mine.map((s) => [s.id, s.name]));

  const ours = all.filter((r) => names.has(r.student));
  const advised = new Set(ours.map((r) => r.student));

  // Assessed, reviewed, and still nothing written down.
  const owing = mine.filter((s) => s.assessmentReviewed && !advised.has(s.id));
  const waiting = mine.filter((s) => s.recommendationAwaitingApproval);

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <header>
        <h1 className="ev-h1" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>Recommendations</h1>
        <p className="ev-body" style={{ color: "var(--text-soft)", marginTop: "0.5rem", maxWidth: "62ch" }}>
          A conversation that was not written down did not happen, as far as the next advisor is
          concerned. This is what has been advised, and who is owed advice that has been discussed
          and never recorded.
        </p>
      </header>

      <div className="ev-tiles">
        <Tile n={ours.length} label="Filed" />
        <Tile n={owing.length} label="Assessed, never advised in writing" tone={owing.length ? "amber" : "green"} />
        <Tile n={waiting.length} label="Awaiting approval" tone={waiting.length ? "amber" : "green"} />
        <Tile n={mine.length} label="Students on the caseload" />
      </div>

      <Panel title="Owed a recommendation" aside={`${owing.length} students`} flush>
        {owing.length === 0 && (
          <Empty>Everyone whose assessment has been read back has something in writing.</Empty>
        )}
        {owing.slice(0, 30).map((s) => (
          <Row
            key={s.id}
            lead={<Dot tone="amber" />}
            title={<Link href={`/edviko/advisor/students/${s.id}`}>{s.name}</Link>}
            sub={`${s.grade} · points at ${s.careerTrack.toLowerCase()} · assessment read back, nothing filed`}
            end={<Tag tone="amber">Write it</Tag>}
          />
        ))}
      </Panel>

      <Panel title="On record" aside={ours.length === 0 ? "Nothing filed yet" : `${ours.length} filed`} flush>
        {ours.length === 0 && (
          <Empty>
            Nothing has been filed on this device. Recommendations are written on a student&rsquo;s case
            file, and until there is a server they stay in the browser they were written in.
          </Empty>
        )}
        {ours.map((r) => (
          <Row
            key={r.id}
            title={
              <>
                {r.what}
                <span style={{ color: "var(--text-soft)", fontWeight: 400 }}>
                  {" · "}
                  <Link href={`/edviko/advisor/students/${r.student}`}>{names.get(r.student) ?? r.student}</Link>
                </span>
              </>
            }
            sub={
              <>
                {r.why} Alternatives considered: {r.alternatives || "none recorded"}.{" "}
                {SOURCES.find((s) => s.id === r.source)?.label}.
              </>
            }
            end={
              <span className="ev-small" style={{ color: "var(--text-faint)", whiteSpace: "nowrap" }}>
                review in {r.reviewInDays}d
              </span>
            }
          />
        ))}
      </Panel>

      <p className="ev-small" style={{ color: "var(--text-faint)", maxWidth: "62ch" }}>
        A recommendation made before this year&rsquo;s results, a currency move or a change in a
        country&rsquo;s rules is not wrong, it is old. The review date is the only thing that catches
        that, which is why the form insists on one.
      </p>
    </div>
  );
}
