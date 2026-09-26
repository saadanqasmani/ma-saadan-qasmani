import Link from "next/link";
import { Dot, Empty, Meter, Panel, Row, Tag, Tile } from "@/components/edviko/portal/parts";
import { ADVISORS, REQUESTS, STUDENTS } from "@/content/edviko/demo";
import { factsOf, studentsOfAdvisor, type StudentRecord } from "@/lib/edviko/org";
import { flagsFor, STAGE_BY_ID, worst, type Thresholds, type Tone } from "@/lib/edviko/pipeline";

function toneOf(s: StudentRecord, t: Thresholds): Tone {
  return worst(flagsFor(factsOf(s), t).map((f) => f.tone));
}

/**
 * The counsellors, with their load and their outcomes side by side.
 *
 * Never outcomes alone. An advisor measured only on offers is an advisor who
 * learns to avoid the students who need them most, and a campus that ranks
 * them that way will not notice until the difficult cases stop being taken.
 */
export function Counsellors({ thresholds }: { thresholds: Thresholds }) {
  const rows = ADVISORS.map((a) => {
    const mine = studentsOfAdvisor(STUDENTS, a.code);
    const reds = mine.filter((s) => toneOf(s, thresholds) === "red").length;
    const quiet = mine.filter((s) => s.daysQuiet >= 14).length;
    return {
      a,
      count: mine.length,
      reds,
      quiet,
      reviewed: mine.filter((s) => s.assessmentReviewed).length,
      assessed: mine.filter((s) => s.assessmentDone).length,
      offers: mine.reduce((n, s) => n + s.offers, 0),
      applications: mine.reduce((n, s) => n + s.applications, 0),
      profile: Math.round(mine.reduce((n, s) => n + s.profileCompletion, 0) / Math.max(1, mine.length)),
    };
  });

  const biggest = Math.max(...rows.map((r) => r.count));
  const smallest = Math.min(...rows.map((r) => r.count));

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <header>
        <h1 className="ev-h1" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>Career counsellors</h1>
        <p className="ev-body" style={{ color: "var(--text-soft)", marginTop: "0.5rem" }}>
          {rows.length} on this campus. The heaviest caseload is {biggest}, the lightest {smallest}
          {biggest - smallest > 6 ? ", which is a gap worth closing." : "."}
        </p>
      </header>

      <Panel title="Caseload and outcomes" flush>
        {rows.map((r) => (
          <Row
            key={r.a.code}
            lead={<Dot tone={r.reds > 3 ? "red" : r.reds > 0 ? "amber" : "green"} />}
            title={r.a.name}
            sub={
              <>
                {r.a.code} · {r.count} students · {r.reviewed}/{r.assessed} assessments reviewed ·{" "}
                {r.applications} applications · {r.offers} offers · {r.quiet} quiet · {r.reds} red
              </>
            }
            end={
              <span style={{ display: "inline-grid", gap: "0.3rem", width: "7rem", justifyItems: "end" }}>
                <span className="ev-small" style={{ fontVariantNumeric: "tabular-nums" }}>{r.count} cases</span>
                <Meter value={(r.count / biggest) * 100} tone={r.count > biggest * 0.9 ? "amber" : undefined} />
              </span>
            }
          />
        ))}
      </Panel>
    </div>
  );
}

/** Every student on the campus, worst first. */
export function CampusStudents({ thresholds }: { thresholds: Thresholds }) {
  const rows = STUDENTS.map((s) => {
    const flags = flagsFor(factsOf(s), thresholds);
    return {
      s,
      flags,
      tone: worst(flags.map((f) => f.tone)),
      rank: flags.reduce((n, f) => n + (f.tone === "red" ? 10 : 1), 0),
    };
  }).sort((a, b) => b.rank - a.rank);

  const advisorName = new Map(ADVISORS.map((a) => [a.code, a.name]));

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <header>
        <h1 className="ev-h1" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>Students</h1>
        <p className="ev-body" style={{ color: "var(--text-soft)", marginTop: "0.5rem" }}>
          {STUDENTS.length} on this campus, hardest cases first. The first forty are shown; the rest
          are reachable through their advisor.
        </p>
      </header>

      <Panel title="Needing attention first" flush>
        {rows.slice(0, 40).map((r) => (
          <Row
            key={r.s.id}
            lead={<Dot tone={r.tone} />}
            title={<Link href={`/edviko/advisor/students/${r.s.id}`}>{r.s.name}</Link>}
            sub={
              <>
                {r.s.id} · {advisorName.get(r.s.advisor) ?? r.s.advisor} · {STAGE_BY_ID[r.s.stage].label} ·{" "}
                {r.flags[0]?.title ?? "Nothing flagged"}
              </>
            }
            end={<Tag tone={r.tone}>{r.tone === "red" ? "Act today" : r.tone === "amber" ? "This week" : "On track"}</Tag>}
          />
        ))}
      </Panel>
    </div>
  );
}

/** Things a supervisor has to answer before anyone else can move. */
export function Requests() {
  const waiting = REQUESTS.filter((r) => r.state !== "approved");
  const oldest = Math.max(0, ...waiting.map((r) => r.daysWaiting));

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <header>
        <h1 className="ev-h1" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>Student requests</h1>
        <p className="ev-body" style={{ color: "var(--text-soft)", marginTop: "0.5rem" }}>
          {waiting.length} waiting. The oldest has been waiting {oldest} days, and every one of them
          is a person who cannot move until it is answered.
        </p>
      </header>

      <div className="ev-tiles">
        <Tile n={waiting.length} label="Waiting" tone={waiting.length ? "amber" : "green"} />
        <Tile n={REQUESTS.filter((r) => r.state === "in-review").length} label="In review" />
        <Tile n={REQUESTS.filter((r) => r.state === "approved").length} label="Approved" tone="green" />
        <Tile n={oldest} label="Longest wait, days" tone={oldest > 3 ? "red" : undefined} />
      </div>

      <Panel title="Every request" flush>
        {REQUESTS.length === 0 && <Empty>Nothing waiting.</Empty>}
        {REQUESTS.map((r) => (
          <Row
            key={r.id}
            title={r.label}
            sub={`Raised by ${r.from} · about ${r.student} · waiting ${r.daysWaiting} day${r.daysWaiting === 1 ? "" : "s"}`}
            end={
              <Tag tone={r.state === "approved" ? "green" : r.daysWaiting > 3 ? "red" : "amber"}>
                {r.state === "in-review" ? "In review" : r.state === "approved" ? "Approved" : "Pending"}
              </Tag>
            }
          />
        ))}
      </Panel>

      <p className="ev-small" style={{ color: "var(--text-faint)" }}>
        Approving does nothing yet. Approval moves a student between advisors and campuses, which
        rewrites part of their code, and that is not a thing to build against a browser tab.
      </p>
    </div>
  );
}
