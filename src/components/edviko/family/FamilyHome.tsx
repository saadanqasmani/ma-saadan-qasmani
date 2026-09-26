import { Panel, Row, Tag, Tile } from "@/components/edviko/portal/parts";
import { ADVISORS, CAMPUS, SCHOOL, STUDENTS } from "@/content/edviko/demo";
import { familyMember, formatId, parseId, relationshipLabel } from "@/lib/edviko/id";
import { actionsFor, viewFor, WITHHELD } from "@/lib/edviko/family";
import { PHASES, STAGE_BY_ID, stageOrder } from "@/lib/edviko/pipeline";

/**
 * What a parent opens, and the one question they actually have.
 *
 * Not "how is my child doing", which no dashboard can answer. What is
 * happening, what will it cost, and what do I have to do. Everything on this
 * page answers one of those three, and the things a parent cannot see are
 * named on the page with the reason, rather than left out and hoped about.
 */
export function FamilyHome({ studentId }: { studentId: string }) {
  const student = STUDENTS.find((s) => s.id === studentId) ?? STUDENTS[0];
  const v = viewFor(student);
  const actions = actionsFor(v);
  const advisor = ADVISORS.find((a) => a.code === v.advisorCode);
  const id = parseId(v.code);
  const mothersCode = id ? formatId(familyMember(id, 1)) : v.code;

  const reached = stageOrder(v.stage);
  const phases = PHASES.map((p) => ({
    ...p,
    done: p.stages.filter((s) => stageOrder(s) <= reached).length,
    of: p.stages.length,
  }));

  const now = actions.filter((a) => a.urgency === "now");

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <header>
        <h1 className="ev-h1" style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}>{v.studentName}</h1>
        <p className="ev-body" style={{ color: "var(--text-soft)", marginTop: "0.5rem" }}>
          {v.grade} · {v.programme} · {SCHOOL.name}, {CAMPUS.name}
        </p>
        <p className="ev-small" style={{ color: "var(--text-faint)", marginTop: "0.5rem", fontVariantNumeric: "tabular-nums" }}>
          {v.code} · your own code {mothersCode} · {relationshipLabel(1).toLowerCase()}
        </p>
      </header>

      {now.length > 0 && (
        <Panel title="This week" aside={`${now.length} thing${now.length === 1 ? "" : "s"}`} flush>
          {now.map((a) => (
            <Row key={a.id} title={a.title} sub={a.detail} end={<Tag tone="red">Now</Tag>} />
          ))}
        </Panel>
      )}

      <div className="ev-tiles">
        <Tile n={STAGE_BY_ID[v.stage].label} label="Where the case is" />
        <Tile n={v.shortlist} label="Universities on the list" />
        <Tile n={v.applications} label="Applications" />
        <Tile n={v.offers} label="Offers" tone={v.offers ? "green" : undefined} />
        <Tile n={v.scholarships} label="Scholarships" tone={v.scholarships ? "green" : undefined} />
        <Tile
          n={v.estimatedCostUsd === null ? "—" : `$${v.estimatedCostUsd.toLocaleString("en-US")}`}
          label="Estimated, a year"
          note="every line, not tuition"
        />
        <Tile
          n={v.fundingGapUsd === null ? "—" : v.fundingGapUsd > 0 ? `$${v.fundingGapUsd.toLocaleString("en-US")}` : "Covered"}
          label="Gap against your budget"
          tone={v.fundingGapUsd === null ? undefined : v.fundingGapUsd > 0 ? "amber" : "green"}
        />
      </div>

      <Panel title="Where they are" aside="The whole road">
        <div style={{ display: "grid", gap: "0.7rem" }}>
          {phases.map((p) => (
            <div key={p.id}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", alignItems: "baseline" }}>
                <span className="ev-body" style={{ fontWeight: 600, color: p.done === p.of ? "var(--free)" : p.done > 0 ? "var(--accent)" : "var(--text-soft)" }}>
                  {p.label}
                </span>
                <span className="ev-small" style={{ color: "var(--text-faint)", fontVariantNumeric: "tabular-nums" }}>
                  {p.done} of {p.of}
                </span>
              </div>
              <p className="ev-small" style={{ color: "var(--text-faint)" }}>{p.means}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="What is being asked of you" aside={actions.length === 0 ? "Nothing right now" : `${actions.length} in total`} flush>
        {actions.length === 0 && (
          <p className="ev-small" style={{ color: "var(--text-faint)", padding: "1.25rem 0" }}>
            Nothing outstanding. The next thing will appear here before it becomes urgent rather than
            after.
          </p>
        )}
        {actions.map((a) => (
          <Row
            key={a.id}
            title={a.title}
            sub={a.detail}
            end={
              <Tag tone={a.urgency === "now" ? "red" : a.urgency === "soon" ? "amber" : undefined}>
                {a.urgency === "now" ? "Now" : a.urgency === "soon" ? "Soon" : "When you can"}
              </Tag>
            }
          />
        ))}
      </Panel>

      <Panel title="Their advisor">
        <p className="ev-body" style={{ fontWeight: 600 }}>{advisor?.name ?? "Not assigned"}</p>
        <p className="ev-small" style={{ color: "var(--text-faint)", marginTop: "0.2rem" }}>
          {v.advisorCode}{advisor?.email ? ` · ${advisor.email}` : ""}
        </p>
        <p className="ev-small" style={{ color: "var(--text-soft)", marginTop: "0.8rem" }}>
          One person owns this case. If something on this page does not make sense, they are the one
          to ask, and a meeting that includes you is the one that changes anything — the money and
          the permission both sit with you.
        </p>
      </Panel>

      <Panel title="What you cannot see here, and why">
        <div style={{ display: "grid", gap: "0.9rem" }}>
          {WITHHELD.map((w) => (
            <div key={w.what}>
              <p className="ev-body" style={{ fontWeight: 600 }}>{w.what}</p>
              <p className="ev-small" style={{ color: "var(--text-soft)", marginTop: "0.2rem" }}>{w.why}</p>
            </div>
          ))}
        </div>
        <p className="ev-small" style={{ color: "var(--text-faint)", marginTop: "1.2rem" }}>
          This is a stated policy rather than a gap. You are shown the position, the money and the
          obligations, which are the things you are actually carrying.
        </p>
      </Panel>
    </div>
  );
}
