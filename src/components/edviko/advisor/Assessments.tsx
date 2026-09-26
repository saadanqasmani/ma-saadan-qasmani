import Link from "next/link";
import { Dot, Empty, Meter, Panel, Row, Tag, Tile } from "@/components/edviko/portal/parts";
import { SIGNED_IN_ADVISOR, STUDENTS } from "@/content/edviko/demo";
import { studentsOfAdvisor } from "@/lib/edviko/org";

/**
 * The review queue, which is the part that decides whether the assessment
 * was worth taking.
 *
 * A student answers thirty questions about themselves and then hears
 * nothing: that is the ordinary failure of every careers questionnaire ever
 * given out in a school hall. An assessment is finished when somebody has
 * read it back to the person who took it, so this screen counts unreviewed
 * assessments as work outstanding rather than as data collected.
 */
export function Assessments() {
  const mine = studentsOfAdvisor(STUDENTS, SIGNED_IN_ADVISOR.code);
  const done = mine.filter((s) => s.assessmentDone);
  const reviewed = done.filter((s) => s.assessmentReviewed);
  const queue = done.filter((s) => !s.assessmentReviewed);
  const notStarted = mine.filter((s) => !s.assessmentDone);
  const conflicts = mine.filter((s) => s.prerequisiteConflict);

  const tracks = Object.entries(
    mine.reduce<Record<string, number>>((acc, s) => {
      acc[s.careerTrack] = (acc[s.careerTrack] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <header>
        <h1 className="ev-h1" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>Assessments</h1>
        <p className="ev-body" style={{ color: "var(--text-soft)", marginTop: "0.5rem", maxWidth: "62ch" }}>
          An assessment is not finished when it is submitted. It is finished when somebody has read it
          back to the student who took it.
        </p>
      </header>

      <div className="ev-tiles">
        <Tile n={done.length} label="Completed" note={`of ${mine.length} students`} />
        <Tile n={queue.length} label="Waiting for you to read" tone={queue.length ? "amber" : "green"} />
        <Tile n={reviewed.length} label="Reviewed" tone="green" />
        <Tile n={notStarted.length} label="Not started" tone={notStarted.length ? "amber" : "green"} />
        <Tile n={conflicts.length} label="Career and subjects disagree" tone={conflicts.length ? "red" : "green"} />
      </div>

      <Panel title="Waiting to be read" aside={`${queue.length} students`} flush>
        {queue.length === 0 && <Empty>Nothing waiting. Every assessment on this caseload has been read back.</Empty>}
        {queue.slice(0, 25).map((s) => (
          <Row
            key={s.id}
            lead={<Dot tone="amber" />}
            title={<Link href={`/edviko/advisor/students/${s.id}`}>{s.name}</Link>}
            sub={`${s.grade} · points at ${s.careerTrack.toLowerCase()} · quiet ${s.daysQuiet} days`}
            end={<Tag tone="amber">Read it back</Tag>}
          />
        ))}
      </Panel>

      <Panel title="Where the plan and the timetable disagree" aside="The expensive kind of mistake" flush>
        {conflicts.length === 0 && <Empty>No prerequisite conflicts on this caseload.</Empty>}
        {conflicts.map((s) => (
          <Row
            key={s.id}
            lead={<Dot tone="red" />}
            title={<Link href={`/edviko/advisor/students/${s.id}`}>{s.name}</Link>}
            sub={`Wants ${s.careerTrack.toLowerCase()}, and is not taking a subject it requires. Easier to fix this year than next.`}
            end={<Tag tone="red">Act today</Tag>}
          />
        ))}
      </Panel>

      <Panel title="What this caseload wants to be" aside="Interest as stated, not as tested">
        <div style={{ display: "grid", gap: "0.6rem" }}>
          {tracks.map(([track, n]) => (
            <div key={track} style={{ display: "grid", gridTemplateColumns: "11rem 1fr 3rem", gap: "0.75rem", alignItems: "center" }}>
              <span className="ev-small" style={{ color: "var(--text-soft)" }}>{track}</span>
              <Meter value={(n / Math.max(1, mine.length)) * 100} />
              <span className="ev-small" style={{ textAlign: "end", fontVariantNumeric: "tabular-nums" }}>{n}</span>
            </div>
          ))}
        </div>
        <p className="ev-small" style={{ marginTop: "1.2rem", color: "var(--text-faint)" }}>
          This is what students say they want. What the twelve questions show sits on each student&rsquo;s
          own assessment, and the two are deliberately never averaged.
        </p>
      </Panel>
    </div>
  );
}
