import Link from "next/link";
import { Dot, Panel, Row, Tag, Tile } from "@/components/edviko/portal/parts";
import { Recommendations } from "@/components/edviko/advisor/Recommendations";
import { applicationsFor, historyFor } from "@/content/edviko/demo";
import { outstanding, STATE_LABEL, verdictOf } from "@/lib/edviko/applications";
import { ENTRY_KINDS, SOURCES } from "@/lib/edviko/cases";
import { advisorCode, campusCode, parseId, relationshipLabel } from "@/lib/edviko/id";
import { factsOf, type StudentRecord } from "@/lib/edviko/org";
import { flagsFor, STAGE_BY_ID, worst, type Thresholds } from "@/lib/edviko/pipeline";

/**
 * One student, whole.
 *
 * The order is the argument: what needs doing, then who they are, then what
 * was already decided and on what basis. An advisor covering somebody else's
 * case should be able to read this page and take over, which is the test the
 * concept sets and the one a WhatsApp thread fails.
 */
export function CaseFile({ student, thresholds }: { student: StudentRecord; thresholds: Thresholds }) {
  const id = parseId(student.id);
  const facts = factsOf(student);
  const flags = flagsFor(facts, thresholds);
  const tone = worst(flags.map((f) => f.tone));
  const stage = STAGE_BY_ID[student.stage];
  const history = historyFor(student.id);
  const applications = applicationsFor(student.id);
  const gap = facts.fundingGapUsd;

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <header>
        <p className="ev-small" style={{ color: "var(--text-faint)" }}>
          <Link href="/edviko/advisor/students">My students</Link> · case file
        </p>
        <h1 className="ev-h1" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", marginTop: "0.4rem" }}>{student.name}</h1>
        <p className="ev-body" style={{ color: "var(--text-soft)", marginTop: "0.4rem" }}>
          {student.grade} · {student.programme} · {student.careerTrack}
        </p>
        <p className="ev-small" style={{ color: "var(--text-faint)", marginTop: "0.5rem", fontVariantNumeric: "tabular-nums" }}>
          {student.id}
          {id && ` · campus ${campusCode(id)} · advisor ${advisorCode(id)} · ${relationshipLabel(id.relationship).toLowerCase()}`}
        </p>
        <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.9rem", flexWrap: "wrap" }}>
          <Tag tone={tone}>{tone === "red" ? "Act today" : tone === "amber" ? "This week" : "On track"}</Tag>
          <Tag>{stage.label}</Tag>
          <Tag>{student.daysInStage} days at this stage, standard {stage.standard}</Tag>
        </div>
      </header>

      <Panel title="What needs doing" aside={`${flags.length} rule${flags.length === 1 ? "" : "s"} triggered`} flush>
        {flags.length === 0 && (
          <p className="ev-small" style={{ color: "var(--text-faint)", padding: "1.25rem 0" }}>
            Nothing is flagged. The next move is the one the plan says: {student.nextAction.toLowerCase()}.
          </p>
        )}
        {flags.map((f) => (
          <Row
            key={f.id}
            title={f.title}
            sub={f.detail}
            end={<Tag tone={f.tone}>{f.owner === "advisor" ? "Yours" : f.owner === "student" ? "Theirs" : "Waiting"}</Tag>}
          />
        ))}
      </Panel>

      <div className="ev-tiles">
        <Tile n={`${student.profileCompletion}%`} label="Profile" tone={student.profileCompletion >= 80 ? "green" : "amber"} />
        <Tile n={student.assessmentReviewed ? "Reviewed" : student.assessmentDone ? "Done" : "Not done"} label="Assessment" tone={student.assessmentReviewed ? "green" : "amber"} />
        <Tile n={student.shortlist} label="On the shortlist" />
        <Tile n={student.applications} label="Applications" />
        <Tile n={student.offers} label="Offers" tone={student.offers ? "green" : undefined} />
        <Tile n={student.documentsMissing} label="Documents missing" tone={student.documentsMissing ? "amber" : "green"} />
        <Tile
          n={gap === null ? "—" : gap > 0 ? `$${gap.toLocaleString("en-US")}` : "Covered"}
          label="Funding gap"
          note={student.budgetUsd === null ? "no budget recorded" : `budget $${student.budgetUsd.toLocaleString("en-US")}`}
          tone={gap === null ? undefined : gap > 0 ? "amber" : "green"}
        />
        <Tile
          n={student.nextDeadlineInDays === null ? "—" : student.nextDeadlineInDays < 0 ? `${Math.abs(student.nextDeadlineInDays)}d late` : `${student.nextDeadlineInDays}d`}
          label={student.nextDeadlineLabel ?? "No deadline recorded"}
          tone={student.nextDeadlineInDays === null ? undefined : student.nextDeadlineInDays < 3 ? "red" : "amber"}
        />
      </div>

      {applications.length > 0 && (
        <Panel title="Applications" aside={`${applications.length} on record`} flush>
          {applications.map((a) => {
            const v = verdictOf(a);
            const left = outstanding(a);
            return (
              <Row
                key={a.id}
                lead={<Dot tone={v.tone} />}
                title={a.university}
                sub={
                  <>
                    {a.country} · {a.round} · {STATE_LABEL[a.state]} · {v.says}
                    {left.length > 0 && ` Missing: ${left.map((r) => r.label.toLowerCase()).join(", ")}.`}
                  </>
                }
                end={
                  <span className="ev-small" style={{ color: "var(--text-faint)", whiteSpace: "nowrap" }}>
                    {a.deadlineInDays === null
                      ? "no date"
                      : a.deadlineInDays < 0
                        ? `${Math.abs(a.deadlineInDays)}d late`
                        : `${a.deadlineInDays}d`}
                  </span>
                }
              />
            );
          })}
        </Panel>
      )}

      <Recommendations student={student.id} advisor={student.advisor} />

      <Panel title="Case history" aside="Oldest last" flush>
        {history.map((h) => (
          <Row
            key={h.id}
            title={h.title}
            sub={
              <>
                {h.body}
                <br />
                {h.by} · {ENTRY_KINDS.find((k) => k.id === h.kind)?.label} ·{" "}
                {SOURCES.find((s) => s.id === h.source)?.label}
              </>
            }
            end={
              <span className="ev-small" style={{ color: "var(--text-faint)", whiteSpace: "nowrap" }}>
                {h.daysAgo}d ago
              </span>
            }
          />
        ))}
      </Panel>
    </div>
  );
}
