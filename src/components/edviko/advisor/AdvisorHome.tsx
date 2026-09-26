import Link from "next/link";
import { Dot, Empty, Meter, Panel, Pipeline, Row, Tag, Tile } from "@/components/edviko/portal/parts";
import { COMMUNICATIONS, MEETINGS, SIGNED_IN_ADVISOR, STUDENTS } from "@/content/edviko/demo";
import { factsOf, firstName, studentsOfAdvisor, type StudentRecord } from "@/lib/edviko/org";
import { atOrPast, flagsFor, worst, type Flag, type Thresholds, type Tone } from "@/lib/edviko/pipeline";

/**
 * The advisor's morning.
 *
 * One question, answered above the fold: which of these students needs me
 * today, and why. Everything else on the page is evidence for that answer.
 *
 * The Action Centre counts are not decoration and not stored anywhere. They
 * are the monitoring rules run across the whole caseload at render, which
 * means they cannot drift from what an individual case says about itself —
 * the failure mode of every counselling spreadsheet that has ever been kept
 * alongside the real records.
 */

type Case = { student: StudentRecord; flags: Flag[]; tone: Tone; rank: number };

function casesOf(students: StudentRecord[], t: Thresholds): Case[] {
  return students.map((student) => {
    const flags = flagsFor(factsOf(student), t);
    return {
      student,
      flags,
      tone: worst(flags.map((f) => f.tone)),
      rank: flags.reduce((n, f) => n + (f.tone === "red" ? 10 : 1), 0),
    };
  });
}

export function AdvisorHome({ thresholds }: { thresholds: Thresholds }) {
  const mine = studentsOfAdvisor(STUDENTS, SIGNED_IN_ADVISOR.code);
  const cases = casesOf(mine, thresholds);
  const total = mine.length;

  const has = (c: Case, id: string) => c.flags.some((f) => f.id === id);
  const urgent = cases.filter((c) => has(c, "deadline-now") || has(c, "deadline-missed"));
  const soon = cases.filter((c) => has(c, "deadline-soon"));
  const incomplete = cases.filter((c) => has(c, "profile"));
  const unreviewed = cases.filter((c) => has(c, "assessment-unreviewed"));
  const awaiting = cases.filter((c) => has(c, "recommendation"));
  const missingDocs = cases.filter((c) => has(c, "documents-missing") || has(c, "documents-expired"));
  const parents = cases.filter((c) => has(c, "parent"));
  const stalled = cases.filter((c) => has(c, "stalled"));
  const quiet = cases.filter((c) => has(c, "quiet"));

  const attention = [...cases].sort((a, b) => b.rank - a.rank).slice(0, 8);
  const red = cases.filter((c) => c.tone === "red").length;

  const stages = mine.map((s) => s.stage);
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

  const offers = mine.reduce((n, s) => n + s.offers, 0);
  const applications = mine.reduce((n, s) => n + s.applications, 0);
  const scholarships = mine.reduce((n, s) => n + s.scholarships, 0);
  const avgProfile = Math.round(mine.reduce((n, s) => n + s.profileCompletion, 0) / Math.max(1, total));

  const actions = [
    { n: urgent.length, label: "Deadlines now", note: "today or already passed", tone: "red" as Tone },
    { n: soon.length, label: "Deadlines within a fortnight", note: "time to act, not to panic", tone: "amber" as Tone },
    { n: incomplete.length, label: "Incomplete profiles", note: "advice built on guesses", tone: "amber" as Tone },
    { n: unreviewed.length, label: "Assessments awaiting review", note: "they answered; nobody replied", tone: "amber" as Tone },
    { n: awaiting.length, label: "Recommendations to approve", note: "not advice until signed", tone: "amber" as Tone },
    { n: missingDocs.length, label: "Missing or expired documents", note: "fails quietly, after sending", tone: "red" as Tone },
    { n: parents.length, label: "Parent meetings due", note: "the money lives here", tone: "amber" as Tone },
    { n: stalled.length, label: "Stalled cases", note: "past the campus standard", tone: "red" as Tone },
  ];

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <header>
        <h1 className="ev-h1" style={{ fontSize: "clamp(1.6rem, 3vw, 2.25rem)" }}>
          Good morning, {firstName(SIGNED_IN_ADVISOR.name)}
        </h1>
        <p className="ev-body" style={{ color: "var(--text-soft)", marginTop: "0.5rem" }}>
          {total} students assigned. {red === 0 ? "None of them is in trouble this morning." : `${red} need you before anything else.`}
        </p>
      </header>

      <div className="ev-tiles">
        <Tile n={total} label="Assigned students" href="/edviko/advisor/students" />
        <Tile n={quiet.length} label="No contact recently" note="quiet 14 days or more" tone={quiet.length ? "amber" : "green"} />
        <Tile n={`${avgProfile}%`} label="Average profile" note="across the caseload" />
        <Tile n={applications} label="Applications in progress" />
        <Tile n={offers} label="Offers received" tone={offers ? "green" : undefined} />
        <Tile n={scholarships} label="Scholarships" tone={scholarships ? "green" : undefined} />
        <Tile n={red} label="At risk" note="red on at least one rule" tone={red ? "red" : "green"} />
      </div>

      <Panel title="Action centre" aside="Rules run across every case, now">
        <div className="ev-tiles">
          {actions.map((a) => (
            <div key={a.label} className="ev-tile">
              <span className="ev-tile__n" data-tone={a.n === 0 ? "green" : a.tone}>{a.n}</span>
              <p className="ev-small" style={{ marginTop: "0.4rem", color: "var(--text-soft)" }}>{a.label}</p>
              <p className="ev-small" style={{ color: "var(--text-faint)" }}>{a.note}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Student journey" aside="At this stage or past it">
        <Pipeline steps={steps} />
      </Panel>

      <div className="ev-cols" data-cols="2">
        <Panel title="Students needing attention" aside={`${attention.length} of ${total}`} flush>
          {attention.length === 0 && <Empty>Nothing is flagged. That is unusual enough to be worth checking.</Empty>}
          {attention.map((c) => (
            <Row
              key={c.student.id}
              lead={<Dot tone={c.tone} />}
              title={
                <Link href={`/edviko/advisor/students/${c.student.id}`}>{c.student.name}</Link>
              }
              sub={
                <>
                  {c.student.grade} · {c.student.careerTrack} · {c.flags[0]?.title ?? "On track"}
                  {c.flags.length > 1 && ` · +${c.flags.length - 1} more`}
                </>
              }
              end={<Tag tone={c.tone}>{c.tone === "red" ? "Act today" : c.tone === "amber" ? "This week" : "On track"}</Tag>}
            />
          ))}
        </Panel>

        <div style={{ display: "grid", gap: "1rem", alignContent: "start" }}>
          <Panel title="Today" aside="Five things" flush>
            {MEETINGS.map((m) => (
              <Row
                key={m.id}
                lead={<span className="ev-small" style={{ fontVariantNumeric: "tabular-nums", color: "var(--text-faint)" }}>{m.at}</span>}
                title={m.with}
                sub={m.subject}
                end={<span className="ev-small" style={{ color: "var(--text-faint)" }}>{m.kind}</span>}
              />
            ))}
          </Panel>

          <Panel title="Recent messages" flush>
            {COMMUNICATIONS.map((c) => (
              <Row
                key={c.id}
                title={c.from}
                sub={c.subject}
                end={
                  <span className="ev-small" style={{ color: "var(--text-faint)" }}>
                    {c.hoursAgo < 24 ? `${c.hoursAgo}h` : `${Math.round(c.hoursAgo / 24)}d`}
                  </span>
                }
              />
            ))}
          </Panel>
        </div>
      </div>

      <Panel title="Caseload by stage" aside="Where the work actually sits">
        <div style={{ display: "grid", gap: "0.65rem" }}>
          {steps.map((s) => (
            <div key={s.label} style={{ display: "grid", gridTemplateColumns: "9rem 1fr 3rem", gap: "0.75rem", alignItems: "center" }}>
              <span className="ev-small" style={{ color: "var(--text-soft)" }}>{s.label}</span>
              <Meter value={s.of === 0 ? 0 : (s.count / s.of) * 100} />
              <span className="ev-small" style={{ textAlign: "end", fontVariantNumeric: "tabular-nums" }}>{s.count}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
