import Link from "next/link";
import { Dot, Empty, Panel, Row, Tag, Tile } from "@/components/edviko/portal/parts";
import { applicationsFor, SIGNED_IN_ADVISOR, STUDENTS } from "@/content/edviko/demo";
import { outstanding } from "@/lib/edviko/applications";
import type { Owner } from "@/lib/edviko/tasks";
import { studentsOfAdvisor } from "@/lib/edviko/org";

/**
 * What is missing, by document rather than by student.
 *
 * An advisor chasing documents one case at a time writes eleven messages
 * asking eleven families for a transcript. Turned the other way up — every
 * student missing a transcript, together — it is one message, and the
 * pattern is visible: when nine of a class are missing the same attested
 * copy, the problem is the school office, not the students.
 *
 * Owners are on every line because that is where the misses are. Three of
 * the eight things an application needs belong to the student everybody
 * chases; the rest belong to the family, the school, or the advisor.
 */
/** Said as a sentence, because "You has to produce it" is what a lookup gives. */
const PRODUCES: Record<Owner, string> = {
  advisor: "Yours to do.",
  student: "The student has to produce it.",
  family: "The family has to produce it.",
  school: "The school office has to produce it.",
};

export function Documents() {
  const mine = studentsOfAdvisor(STUDENTS, SIGNED_IN_ADVISOR.code);
  const names = new Map(mine.map((s) => [s.id, s.name]));

  type Want = { label: string; owner: Owner; students: { id: string; university: string; days: number | null }[] };
  const wants = new Map<string, Want>();

  for (const student of mine) {
    for (const app of applicationsFor(student.id)) {
      for (const requirement of outstanding(app)) {
        const found = wants.get(requirement.id) ?? {
          label: requirement.label,
          owner: requirement.owner as Owner,
          students: [],
        };
        found.students.push({ id: student.id, university: app.university, days: app.deadlineInDays });
        wants.set(requirement.id, found);
      }
    }
  }

  // A student applying to four universities that each want a transcript is
  // one person to ask, not four. Counting the rows made every line read
  // "Iqra Abbasi, Iqra Abbasi, Iqra Abbasi".
  const people = (w: Want) => [...new Set(w.students.map((s) => s.id))];
  const rows = [...wants.values()].sort((a, b) => people(b).length - people(a).length);
  const expired = mine.filter((s) => s.documentsExpired > 0);
  const soonest = (w: Want) => Math.min(...w.students.map((s) => s.days ?? 9999));

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <header>
        <h1 className="ev-h1" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>Documents</h1>
        <p className="ev-body" style={{ color: "var(--text-soft)", marginTop: "0.5rem", maxWidth: "62ch" }}>
          Turned by document rather than by student. Eleven families asked for a transcript one at a
          time is eleven messages; asked together it is one, and if nine of them are waiting on the
          same office then that is the problem rather than the families.
        </p>
      </header>

      <div className="ev-tiles">
        <Tile n={rows.reduce((n, r) => n + r.students.length, 0)} label="Requests outstanding" note="one per application" />
        <Tile n={rows.length} label="Kinds of document" />
        <Tile n={expired.length} label="Students with an expired one" tone={expired.length ? "red" : "green"} />
        <Tile
          n={new Set(rows.filter((r) => r.owner === "family").flatMap(people)).size}
          label="Families to ask"
        />
        <Tile
          n={new Set(rows.filter((r) => r.owner === "school").flatMap(people)).size}
          label="Students waiting on the office"
        />
      </div>

      {expired.length > 0 && (
        <Panel title="Expired, which is worse than missing" aside="Fails after sending" flush>
          {expired.map((s) => (
            <Row
              key={s.id}
              lead={<Dot tone="red" />}
              title={<Link href={`/edviko/advisor/students/${s.id}`}>{s.name}</Link>}
              sub={`${s.documentsExpired} expired. A renewal takes weeks, and an expired document fails an application quietly, after it has gone.`}
              end={<Tag tone="red">Now</Tag>}
            />
          ))}
        </Panel>
      )}

      <Panel title="What is outstanding" aside="Most-wanted first" flush>
        {rows.length === 0 && <Empty>Nothing outstanding on this caseload.</Empty>}
        {rows.map((r) => {
          const days = soonest(r);
          return (
            <Row
              key={r.label}
              lead={<Dot tone={days < 7 ? "red" : days < 21 ? "amber" : "green"} />}
              title={`${r.label} · ${people(r).length} student${people(r).length === 1 ? "" : "s"}`}
              sub={
                <>
                  {PRODUCES[r.owner]}{" "}
                  {people(r)
                    .slice(0, 6)
                    .map((id) => names.get(id) ?? id)
                    .join(", ")}
                  {people(r).length > 6 && ` and ${people(r).length - 6} more`}.
                </>
              }
              end={
                <span className="ev-small" style={{ color: "var(--text-faint)", whiteSpace: "nowrap" }}>
                  {days === 9999 ? "no date" : days < 0 ? `${Math.abs(days)}d late` : `${days}d`}
                </span>
              }
            />
          );
        })}
      </Panel>

      <p className="ev-small" style={{ color: "var(--text-faint)", maxWidth: "62ch" }}>
        The documents themselves are not held here. Storing a sixteen year old&rsquo;s passport needs a
        place that is legal to keep it in, which is not a browser and not this domain.
      </p>
    </div>
  );
}
