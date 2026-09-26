import Link from "next/link";
import { Dot, Empty, Panel, Row, Tag, Tile } from "@/components/edviko/portal/parts";
import { Kpis } from "@/components/edviko/portal/Kpis";
import { ADVISORS, applicationsFor, STUDENTS } from "@/content/edviko/demo";
import { summarise } from "@/lib/edviko/applications";
import { kpisFor } from "@/lib/edviko/kpi";
import { factsOf, studentsOfAdvisor } from "@/lib/edviko/org";
import { flagsFor, STAGE_BY_ID, worst, type Thresholds } from "@/lib/edviko/pipeline";
import { tasksFor } from "@/lib/edviko/tasks";

/**
 * One counsellor, all the way down.
 *
 * The concept promises a drill from a number to a cohort to an advisor to a
 * student, and a management screen that stops at the first of those is a
 * report. A supervisor looking at a caseload of twenty-six has one question —
 * is this person carrying too much, or carrying it badly — and those look
 * identical from a summary row. Workload, outcomes and the named students
 * behind both, on one page, is what tells them apart.
 */
export function CounsellorCase({ code, thresholds }: { code: string; thresholds: Thresholds }) {
  const advisor = ADVISORS.find((a) => a.code === code);
  const mine = studentsOfAdvisor(STUDENTS, code);

  if (!advisor) {
    return <Empty>No counsellor with that code on this campus.</Empty>;
  }

  const cases = mine.map((s) => {
    const flags = flagsFor(factsOf(s), thresholds);
    return { s, flags, tone: worst(flags.map((f) => f.tone)), rank: flags.reduce((n, f) => n + (f.tone === "red" ? 10 : 1), 0) };
  });
  const apps = summarise(mine.flatMap((s) => applicationsFor(s.id)));
  const tasks = mine.flatMap((s) => tasksFor(s, applicationsFor(s.id), thresholds));
  const theirs = tasks.filter((t) => t.owner === "advisor");
  const reds = cases.filter((c) => c.tone === "red");

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <header>
        <p className="ev-small" style={{ color: "var(--text-faint)" }}>
          <Link href="/edviko/campus/counsellors">Career counsellors</Link> · caseload
        </p>
        <h1 className="ev-h1" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", marginTop: "0.4rem" }}>{advisor.name}</h1>
        <p className="ev-body" style={{ color: "var(--text-soft)", marginTop: "0.4rem" }}>
          {advisor.code} · {advisor.email}
          {advisor.status === "leave" && " · on leave"}
        </p>
      </header>

      <div className="ev-tiles">
        <Tile n={mine.length} label="Students" />
        <Tile n={reds.length} label="Red cases" tone={reds.length ? "red" : "green"} />
        <Tile n={theirs.length} label="Tasks that are theirs" tone={theirs.length > 25 ? "amber" : undefined} />
        <Tile n={apps.open} label="Open applications" />
        <Tile n={apps.offers} label="Offers to answer" tone={apps.offers ? "amber" : undefined} />
        <Tile n={mine.filter((s) => s.assessmentDone && !s.assessmentReviewed).length} label="Assessments unread" tone="amber" />
      </div>

      <Panel title="Their students" aside="Hardest first" flush>
        {cases
          .sort((a, b) => b.rank - a.rank)
          .map((c) => (
            <Row
              key={c.s.id}
              lead={<Dot tone={c.tone} />}
              title={<Link href={`/edviko/advisor/students/${c.s.id}`}>{c.s.name}</Link>}
              sub={`${c.s.id} · ${c.s.grade} · ${STAGE_BY_ID[c.s.stage].label} · ${c.flags[0]?.title ?? "Nothing flagged"}`}
              end={<Tag tone={c.tone}>{c.tone === "red" ? "Act today" : c.tone === "amber" ? "This week" : "On track"}</Tag>}
            />
          ))}
      </Panel>

      <Kpis groups={kpisFor(mine, thresholds)} />

      <p className="ev-small" style={{ color: "var(--text-faint)", maxWidth: "62ch" }}>
        Read the workload beside the outcomes. A counsellor with the heaviest caseload and the most
        red cases is not the same thing as one who is not doing the work, and a campus that measures
        only the second teaches its team to avoid difficult students.
      </p>
    </div>
  );
}
