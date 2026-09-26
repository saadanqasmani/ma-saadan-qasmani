import Link from "next/link";
import { Dot, Empty, Panel, Row, Tag, Tile } from "@/components/edviko/portal/parts";
import { applicationsFor, SIGNED_IN_ADVISOR, STUDENTS } from "@/content/edviko/demo";
import { studentsOfAdvisor } from "@/lib/edviko/org";
import type { Thresholds } from "@/lib/edviko/pipeline";
import { byWhen, nextReminder, OWNER_DOES, REMINDERS, tasksFor, type Task } from "@/lib/edviko/tasks";

/**
 * Everything outstanding, in the order a week is planned.
 *
 * Nothing here is stored, which is the whole design. Every counselling
 * office that has kept a task list has watched it rot: entered in a burst
 * during training, never closed, describing a month that has already
 * happened within a term. These are read out of the cases each time the page
 * is drawn, so there is nothing to tidy and no way for the list and the
 * truth to drift apart.
 *
 * Grouped by when rather than by student, because an advisor at nine on a
 * Monday is deciding what today is for, not reading a caseload.
 */
export function Tasks({ thresholds }: { thresholds: Thresholds }) {
  const mine = studentsOfAdvisor(STUDENTS, SIGNED_IN_ADVISOR.code);
  const tasks: Task[] = mine.flatMap((s) => tasksFor(s, applicationsFor(s.id), thresholds));
  const groups = byWhen(tasks);

  const yours = tasks.filter((t) => t.owner === "advisor");
  const overdue = tasks.filter((t) => (t.dueInDays ?? 0) < 0);
  const chasing = tasks.filter((t) => t.owner !== "advisor");

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <header>
        <h1 className="ev-h1" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>Tasks</h1>
        <p className="ev-body" style={{ color: "var(--text-soft)", marginTop: "0.5rem", maxWidth: "62ch" }}>
          {tasks.length} across {mine.length} students, worked out from the records rather than kept
          in a list. Nothing to close: a task is here because something is true, and it goes when that
          stops being true.
        </p>
      </header>

      <div className="ev-tiles">
        <Tile n={tasks.length} label="Outstanding" />
        <Tile n={overdue.length} label="Already late" tone={overdue.length ? "red" : "green"} />
        <Tile n={yours.length} label="Yours to do" tone={yours.length ? "amber" : "green"} />
        <Tile n={chasing.length} label="To chase" note="students, families, the school" />
        <Tile n={REMINDERS.length} label="Reminder points" note="30, 14, 7, 3 and 1 day" />
      </div>

      {groups.map((g) => (
        <Panel key={g.when} title={g.label} aside={`${g.tasks.length}`} flush>
          {g.tasks.slice(0, 30).map((t) => {
            const remind = nextReminder(t.dueInDays);
            return (
              <Row
                key={t.id}
                lead={<Dot tone={t.tone} />}
                title={
                  <>
                    {t.title}
                    <span style={{ color: "var(--text-soft)", fontWeight: 400 }}>
                      {" · "}
                      <Link href={`/edviko/advisor/students/${t.student}`}>{t.studentName}</Link>
                    </span>
                  </>
                }
                sub={
                  <>
                    {t.detail} · {OWNER_DOES[t.owner]}.
                    {remind !== null && ` A reminder would go out ${remind} days before.`}
                  </>
                }
                end={
                  <Tag tone={t.tone}>
                    {t.dueInDays === null
                      ? "no date"
                      : t.dueInDays < 0
                        ? `${Math.abs(t.dueInDays)}d late`
                        : `${t.dueInDays}d`}
                  </Tag>
                }
              />
            );
          })}
          {g.tasks.length > 30 && (
            <Empty>and {g.tasks.length - 30} more in this group.</Empty>
          )}
        </Panel>
      ))}

      {tasks.length === 0 && <Empty>Nothing outstanding on this caseload, which is worth checking rather than celebrating.</Empty>}

      <p className="ev-small" style={{ color: "var(--text-faint)", maxWidth: "62ch" }}>
        Reminders are calculated and not yet sent. Sending them needs a provider, a registered
        sender, and a lawful basis for messaging people under eighteen, which is a decision rather
        than a feature.
      </p>
    </div>
  );
}
