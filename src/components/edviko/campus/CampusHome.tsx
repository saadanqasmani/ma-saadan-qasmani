import { Dot, Empty, Meter, Panel, Pipeline, Row, Tag, Tile } from "@/components/edviko/portal/parts";
import { Greeting } from "@/components/edviko/portal/Greeting";
import { ADVISORS, CAMPUS, REQUESTS, SCHOOL, STUDENTS, SUPERVISOR } from "@/content/edviko/demo";
import { factsOf, studentsOfAdvisor, type StudentRecord } from "@/lib/edviko/org";
import { atOrPast, flagsFor, worst, type Thresholds, type Tone } from "@/lib/edviko/pipeline";

/**
 * The campus, from above.
 *
 * Not a report. A report tells a supervisor what happened; this tells them
 * where the campus is losing people and which advisor needs help carrying
 * their load. Every number on the page drills to a person, because a campus
 * average that cannot be resolved into named students is a number nobody can
 * act on.
 *
 * The counsellor table deliberately shows workload beside outcomes. Judging
 * an advisor on admissions alone punishes whoever was given the hardest
 * cases, which is the fastest way to teach a team to avoid difficult
 * students.
 */

function toneOf(s: StudentRecord, t: Thresholds): Tone {
  return worst(flagsFor(factsOf(s), t).map((f) => f.tone));
}

export function CampusHome({ thresholds }: { thresholds: Thresholds }) {
  const students = STUDENTS;
  const total = students.length;
  const tones = new Map(students.map((s) => [s.id, toneOf(s, thresholds)]));
  const red = students.filter((s) => tones.get(s.id) === "red");
  const amber = students.filter((s) => tones.get(s.id) === "amber");

  const stages = students.map((s) => s.stage);
  const steps = [
    { label: "Registered", count: total, of: total },
    { label: "Profile", count: atOrPast(stages, "profile"), of: total },
    { label: "Assessment", count: atOrPast(stages, "assessment"), of: total },
    { label: "Career plan", count: atOrPast(stages, "career-recommendation"), of: total },
    { label: "Shortlist", count: atOrPast(stages, "university"), of: total },
    { label: "Applied", count: atOrPast(stages, "applied"), of: total },
    { label: "Offer", count: atOrPast(stages, "admission"), of: total },
    { label: "Enrolled", count: atOrPast(stages, "enrolled"), of: total },
  ];

  const rows = ADVISORS.map((a) => {
    const mine = studentsOfAdvisor(students, a.code);
    const reds = mine.filter((s) => tones.get(s.id) === "red").length;
    return {
      advisor: a,
      students: mine.length,
      assessments: mine.filter((s) => s.assessmentDone).length,
      reviewed: mine.filter((s) => s.assessmentReviewed).length,
      applications: mine.reduce((n, s) => n + s.applications, 0),
      offers: mine.reduce((n, s) => n + s.offers, 0),
      overdue: mine.reduce((n, s) => n + s.tasksOverdue, 0),
      profile: Math.round(mine.reduce((n, s) => n + s.profileCompletion, 0) / Math.max(1, mine.length)),
      reds,
    };
  });

  const byTrack = Object.entries(
    students.reduce<Record<string, number>>((acc, s) => {
      acc[s.careerTrack] = (acc[s.careerTrack] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const byProgramme = Object.entries(
    students.reduce<Record<string, number>>((acc, s) => {
      acc[s.programme] = (acc[s.programme] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  const gapped = students.filter((s) => {
    const f = factsOf(s);
    return f.fundingGapUsd !== null && f.fundingGapUsd > 0;
  });
  const avgGap = gapped.length
    ? Math.round(gapped.reduce((n, s) => n + Math.max(0, (s.estimatedCostUsd ?? 0) - (s.budgetUsd ?? 0)), 0) / gapped.length)
    : 0;

  const pending = REQUESTS.filter((r) => r.state !== "approved");
  const offers = students.reduce((n, s) => n + s.offers, 0);
  const applications = students.reduce((n, s) => n + s.applications, 0);
  const scholarships = students.reduce((n, s) => n + s.scholarships, 0);
  const active = ADVISORS.filter((a) => a.status === "active").length;

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <header>
        <h1 className="ev-h1" style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)" }}>
          <Greeting fallback={SUPERVISOR.name} role="campus" />
        </h1>
        <p className="ev-body" style={{ color: "var(--text-soft)", marginTop: "0.5rem" }}>
          {SCHOOL.name} · {CAMPUS.name} · {CAMPUS.code}
        </p>
      </header>

      <div className="ev-tiles">
        <Tile n={total} label="Students on campus" href="/edviko/campus/students" />
        <Tile n={`${active}/${ADVISORS.length}`} label="Counsellors active" note={`${ADVISORS.length - active} on leave`} href="/edviko/campus/counsellors" />
        <Tile n={applications} label="Applications submitted" />
        <Tile n={offers} label="Offers received" tone={offers ? "green" : undefined} />
        <Tile n={scholarships} label="Scholarships" tone={scholarships ? "green" : undefined} />
        <Tile n={pending.length} label="Requests waiting on you" tone={pending.length ? "amber" : "green"} href="/edviko/campus/requests" />
        <Tile n={red.length} label="Red cases" note={`${amber.length} amber`} tone={red.length ? "red" : "green"} />
      </div>

      <Panel title="Student pipeline" aside="At this stage or past it">
        <Pipeline steps={steps} />
      </Panel>

      <Panel title="Counsellor performance" aside="Workload beside outcomes, never outcomes alone" flush>
        {rows.map((r) => (
          <Row
            key={r.advisor.code}
            lead={<Dot tone={r.reds > 3 ? "red" : r.reds > 0 ? "amber" : "green"} />}
            title={
              <>
                {r.advisor.name}
                {r.advisor.status === "leave" && (
                  <span className="ev-small" style={{ color: "var(--text-faint)", marginInlineStart: "0.5rem" }}>on leave</span>
                )}
              </>
            }
            sub={
              <>
                {r.students} students · {r.reviewed}/{r.assessments} assessments reviewed · {r.applications} applications · {r.offers} offers
                {r.overdue > 0 && ` · ${r.overdue} overdue tasks`}
              </>
            }
            end={
              <span style={{ display: "inline-grid", gap: "0.3rem", width: "6rem", justifyItems: "end" }}>
                <span className="ev-small" style={{ fontVariantNumeric: "tabular-nums" }}>{r.profile}% profile</span>
                <Meter value={r.profile} tone={r.profile > 80 ? "green" : r.profile > 60 ? "amber" : "red"} />
              </span>
            }
          />
        ))}
      </Panel>

      <div className="ev-cols" data-cols="2">
        <Panel title="Requests for approval" aside={`${pending.length} waiting`} flush>
          {pending.length === 0 && <Empty>Nothing waiting.</Empty>}
          {REQUESTS.map((r) => (
            <Row
              key={r.id}
              title={r.label}
              sub={`${r.from} · ${r.student} · ${r.daysWaiting} day${r.daysWaiting === 1 ? "" : "s"} waiting`}
              end={
                <Tag tone={r.state === "approved" ? "green" : r.daysWaiting > 3 ? "red" : "amber"}>
                  {r.state === "in-review" ? "In review" : r.state === "approved" ? "Approved" : "Pending"}
                </Tag>
              }
            />
          ))}
        </Panel>

        <div style={{ display: "grid", gap: "1rem", alignContent: "start" }}>
          <Panel title="What they want to be">
            <div style={{ display: "grid", gap: "0.6rem" }}>
              {byTrack.map(([track, n]) => (
                <div key={track} style={{ display: "grid", gridTemplateColumns: "10rem 1fr 3rem", gap: "0.75rem", alignItems: "center" }}>
                  <span className="ev-small" style={{ color: "var(--text-soft)" }}>{track}</span>
                  <Meter value={(n / total) * 100} />
                  <span className="ev-small" style={{ textAlign: "end", fontVariantNumeric: "tabular-nums" }}>{n}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Qualification">
            <div style={{ display: "grid", gap: "0.6rem" }}>
              {byProgramme.map(([programme, n]) => (
                <div key={programme} style={{ display: "grid", gridTemplateColumns: "10rem 1fr 3rem", gap: "0.75rem", alignItems: "center" }}>
                  <span className="ev-small" style={{ color: "var(--text-soft)" }}>{programme}</span>
                  <Meter value={(n / total) * 100} />
                  <span className="ev-small" style={{ textAlign: "end", fontVariantNumeric: "tabular-nums" }}>{n}</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <Panel title="Affordability" aside="Where the plan and the money disagree">
        <div className="ev-tiles">
          <Tile n={gapped.length} label="Students with a funding gap" tone={gapped.length > total / 3 ? "amber" : undefined} />
          <Tile n={`$${avgGap.toLocaleString("en-US")}`} label="Average gap" note="a year, against stated budget" />
          <Tile n={students.filter((s) => s.budgetUsd === null).length} label="No budget recorded" note="a shortlist without one is a wish" tone="amber" />
          <Tile n={students.filter((s) => s.estimatedCostUsd === null).length} label="No cost calculated" tone="amber" />
        </div>
      </Panel>
    </div>
  );
}
