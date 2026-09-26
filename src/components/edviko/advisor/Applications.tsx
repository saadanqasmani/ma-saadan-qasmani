import Link from "next/link";
import { Dot, Empty, Panel, Row, Tag, Tile } from "@/components/edviko/portal/parts";
import { allApplications, SIGNED_IN_ADVISOR, STUDENTS } from "@/content/edviko/demo";
import {
  CLOSED,
  outstanding,
  STATE_LABEL,
  summarise,
  verdictOf,
  type Application,
} from "@/lib/edviko/applications";
import { studentsOfAdvisor } from "@/lib/edviko/org";

/**
 * Every application on the caseload, sorted by which will be missed.
 *
 * An application is not a status; it is a set of requirements and a date. So
 * a row says which two things are missing and how long is left, rather than
 * "in progress", which is what a system says when it has stopped being
 * useful. Sorted so the three that are actually in danger are at the top,
 * because a list of forty in alphabetical order is read as far as the first
 * screen and no further.
 */
export function Applications() {
  const mine = studentsOfAdvisor(STUDENTS, SIGNED_IN_ADVISOR.code);
  const names = new Map(mine.map((s) => [s.id, s.name]));
  const apps = allApplications(mine);
  const sum = summarise(apps);

  const rank = (a: Application) => {
    const v = verdictOf(a);
    const days = a.deadlineInDays ?? 999;
    return (v.tone === "red" ? 0 : v.tone === "amber" ? 1000 : 2000) + Math.max(0, days);
  };

  const open = apps.filter((a) => !CLOSED.includes(a.state)).sort((a, b) => rank(a) - rank(b));
  const offers = apps.filter((a) => a.state === "offer" || a.state === "conditional");

  const byCountry = Object.entries(
    apps.reduce<Record<string, number>>((acc, a) => {
      acc[a.country] = (acc[a.country] ?? 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1]);

  return (
    <div style={{ display: "grid", gap: "1.25rem" }}>
      <header>
        <h1 className="ev-h1" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}>Applications</h1>
        <p className="ev-body" style={{ color: "var(--text-soft)", marginTop: "0.5rem", maxWidth: "62ch" }}>
          {sum.total} across {mine.length} students. What matters is not how many are open but which
          of them will be missed, so that is what this is sorted by.
        </p>
      </header>

      <div className="ev-tiles">
        <Tile n={sum.open} label="Open" />
        <Tile n={sum.readyToSend} label="Ready to send" note="nothing missing" tone={sum.readyToSend ? "green" : undefined} />
        <Tile n={sum.blocked} label="Blocked on something" tone={sum.blocked ? "amber" : "green"} />
        <Tile n={sum.awaiting} label="With the university" />
        <Tile n={sum.offers} label="Offers to answer" tone={sum.offers ? "amber" : undefined} />
        <Tile n={sum.missed} label="Deadline passed, never sent" tone={sum.missed ? "red" : "green"} />
        <Tile n={`$${sum.fees.toLocaleString("en-US")}`} label="Fees committed" note="across the caseload" />
      </div>

      {offers.length > 0 && (
        <Panel title="Offers waiting on an answer" aside="Deposits expire" flush>
          {offers.map((a) => (
            <Row
              key={a.id}
              lead={<Dot tone="amber" />}
              title={
                <Link href={`/edviko/advisor/students/${a.student}`}>{names.get(a.student) ?? a.student}</Link>
              }
              sub={`${a.university}, ${a.country} · ${STATE_LABEL[a.state]}${a.condition ? ` on ${a.condition}` : ""}`}
              end={<Tag tone="amber">Decide</Tag>}
            />
          ))}
        </Panel>
      )}

      <Panel title="Open applications" aside="Most at risk first" flush>
        {open.length === 0 && <Empty>Nothing open on this caseload.</Empty>}
        {open.slice(0, 40).map((a) => {
          const v = verdictOf(a);
          const left = outstanding(a);
          return (
            <Row
              key={a.id}
              lead={<Dot tone={v.tone} />}
              title={
                <>
                  <Link href={`/edviko/advisor/students/${a.student}`}>{names.get(a.student) ?? a.student}</Link>
                  <span style={{ color: "var(--text-soft)", fontWeight: 400 }}> · {a.university}</span>
                </>
              }
              sub={
                <>
                  {a.country} · {a.round} · {v.says}
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

      <Panel title="Where they are applying">
        <div style={{ display: "grid", gap: "0.5rem" }}>
          {byCountry.map(([country, n]) => (
            <div key={country} style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
              <span className="ev-body">{country}</span>
              <span className="ev-small" style={{ color: "var(--text-faint)", fontVariantNumeric: "tabular-nums" }}>{n}</span>
            </div>
          ))}
        </div>
        <p className="ev-small" style={{ color: "var(--text-faint)", marginTop: "1.2rem" }}>
          Dates here are the ones recorded against each application. Once the published American grid
          is loaded under US deadlines, the institutions in it carry their own, and the two stop
          being typed in twice.
        </p>
      </Panel>
    </div>
  );
}
