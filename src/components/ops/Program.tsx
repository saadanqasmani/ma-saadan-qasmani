"use client";

import { useEffect, useMemo, useState } from "react";
import { todayISO, type Persona } from "@/lib/ops/model";
import type { Program, ProgramItem } from "@/lib/ops/programs/ajsrc";
import { addXp, toggleProgramItem, useOps } from "@/lib/ops/store";
import { Chevron, Seg, Tick, useCelebrate, whenLabel } from "./ui";

/**
 * A programme with a date on every move.
 *
 * Saadan gets the work cut three ways (today, this week, this month) and
 * ticks it off. Osman gets the same list read the other way round: how far
 * along it is, whether it is keeping pace with the calendar, and what has
 * just been finished. Same document underneath, two different rooms.
 */

const XP_PER_ITEM = 5;
const KIND: Record<ProgramItem["kind"], { label: string; cls: string }> = {
  task: { label: "Task", cls: "chip--saadan" },
  post: { label: "Post", cls: "chip--admin" },
  email: { label: "Email", cls: "chip--ok" },
};

function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T12:00:00`);
  d.setDate(d.getDate() + n);
  return todayISO(d);
}
function mondayOf(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  const back = (d.getDay() + 6) % 7;
  return addDays(iso, -back);
}
function dayLabel(iso: string, opts: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short" }): string {
  return new Date(`${iso}T12:00:00`).toLocaleDateString("en-GB", opts);
}

/** Ticks once a second, for the clock; only while it is on screen. */
function useNow(): number {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function useProgramProgress(program: Program) {
  const { state } = useOps();
  const done = state.programs[program.id]?.done ?? {};
  const today = todayISO();
  const total = program.items.length;
  const doneCount = program.items.filter((i) => done[i.id]).length;
  const dueSoFar = program.items.filter((i) => i.date <= today);
  const dueDone = dueSoFar.filter((i) => done[i.id]).length;
  const behind = dueSoFar.filter((i) => !done[i.id] && i.date < today);
  const percent = total ? Math.round((doneCount / total) * 100) : 0;
  const expected = total ? Math.round((dueSoFar.length / total) * 100) : 0;
  return { done, today, total, doneCount, dueSoFar, dueDone, behind, percent, expected };
}

function Countdown({ program, compact }: { program: Program; compact?: boolean }) {
  const now = useNow();
  const left = Math.max(0, Date.parse(program.startsAt) - now);
  const deadline = Date.parse(program.deadlineAt) - now;
  const parts = [
    { n: Math.floor(left / 86_400_000), l: "days" },
    { n: Math.floor((left % 86_400_000) / 3_600_000), l: "hours" },
    { n: Math.floor((left % 3_600_000) / 60_000), l: "min" },
    { n: Math.floor((left % 60_000) / 1000), l: "sec" },
  ];
  return (
    <div className="prog-clock" data-compact={compact}>
      <div className="prog-clock__row" role="timer" aria-label={`${parts[0].n} days to the conference`}>
        {parts.map((p) => (
          <div key={p.l} className="prog-clock__cell">
            <span className="prog-clock__n">{String(p.n).padStart(p.l === "days" ? 1 : 2, "0")}</span>
            <span className="prog-clock__l">{p.l}</span>
          </div>
        ))}
      </div>
      <p className="small muted">
        {left > 0 ? "until the conference opens" : "The conference is on"}
        {deadline > 0 ? ` · submissions close in ${Math.ceil(deadline / 86_400_000)} days` : left > 0 ? " · submissions closed" : ""}
      </p>
    </div>
  );
}

function Pace({ percent, expected, behind }: { percent: number; expected: number; behind: number }) {
  const tone = behind === 0 ? "ok" : behind <= 3 ? "soon" : "due";
  const text = behind === 0 ? "On track" : `Behind by ${behind} item${behind === 1 ? "" : "s"}`;
  return (
    <div className="stack--tight">
      <div className="row row--between">
        <span className="label">Done</span>
        <span className={`chip chip--${tone}`}>{text}</span>
      </div>
      <div className="prog-bar" aria-label={`${percent}% done; the calendar is at ${expected}%`}>
        <div className="prog-bar__fill" style={{ width: `${percent}%` }} />
        <div className="prog-bar__mark" style={{ left: `${expected}%` }} title={`Where the calendar is: ${expected}%`} />
      </div>
      <p className="small muted">
        <b>{percent}%</b> of the plan done · the calendar says {expected}% should be by today
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Saadan's side: the work, cut into days, weeks and months
 * ------------------------------------------------------------------------- */

type View = "today" | "week" | "month" | "plan";

export function ProgramDesk({ program, who }: { program: Program; who: Persona }) {
  const p = useProgramProgress(program);
  const [view, setView] = useState<View>("today");
  const { toast, burst } = useCelebrate();

  function tick(item: ProgramItem, e?: React.MouseEvent) {
    const nowDone = toggleProgramItem(program.id, item.id, who);
    addXp(nowDone ? XP_PER_ITEM : -XP_PER_ITEM);
    if (!nowDone) return;
    const sameDay = program.items.filter((i) => i.date === item.date);
    const dayClear = sameDay.every((i) => i.id === item.id || p.done[i.id]);
    if (dayClear) {
      burst(e?.clientX, e?.clientY);
      toast(`Everything for ${dayLabel(item.date)} is done`, { tone: "gold" });
    } else {
      toast(`+${XP_PER_ITEM} XP · ${item.title}`, { tone: "blue" });
    }
  }

  return (
    <div className="stack">
      <Hero program={program} />
      <div className="g" style={{ padding: 18 }}>
        <Pace percent={p.percent} expected={p.expected} behind={p.behind.length} />
      </div>
      <Seg<View>
        value={view}
        onChange={setView}
        tone="blue"
        ariaLabel="Plan view"
        options={[
          { id: "today", label: "Today" },
          { id: "week", label: "This week" },
          { id: "month", label: "This month" },
          { id: "plan", label: "Whole plan" },
        ]}
      />
      {view === "today" && <TodayList program={program} done={p.done} today={p.today} behind={p.behind} onTick={tick} />}
      {view === "week" && <WeekList program={program} done={p.done} today={p.today} onTick={tick} />}
      {view === "month" && <MonthList program={program} done={p.done} today={p.today} onTick={tick} />}
      {view === "plan" && <WholePlan program={program} done={p.done} today={p.today} onTick={tick} />}
    </div>
  );
}

function Hero({ program }: { program: Program }) {
  return (
    <div className="g g--pop prog-hero">
      <div>
        <span className="label">{program.short} 2027 · programme</span>
        <h2 className="h1" style={{ marginTop: 6 }}>
          {program.name}
        </h2>
        <p className="small muted" style={{ marginTop: 4 }}>
          27–28 March 2027 · {program.venue}
        </p>
      </div>
      <Countdown program={program} />
    </div>
  );
}

type ListProps = {
  program: Program;
  done: Record<string, { at: string; by: Persona }>;
  today: string;
  onTick?: (i: ProgramItem, e?: React.MouseEvent) => void;
};

function Row({ item, done, today, onTick, showDate }: { item: ProgramItem; done: boolean; today: string; onTick?: ListProps["onTick"]; showDate?: boolean }) {
  const late = !done && item.date < today;
  return (
    <li className="check prog-row" data-on={done}>
      {onTick ? (
        <button type="button" className="check__box" data-on={done} aria-pressed={done} aria-label={done ? `Untick ${item.title}` : `Tick ${item.title}`} onClick={(e) => onTick(item, e)}>
          {done && <Tick />}
        </button>
      ) : (
        <span className="check__box" data-on={done} aria-hidden style={{ cursor: "default" }}>
          {done && <Tick />}
        </span>
      )}
      <div className="check__text">
        <div className="row" style={{ gap: 6 }}>
          <span className={`chip ${KIND[item.kind].cls}`}>{KIND[item.kind].label}</span>
          {showDate && <span className="chip">{dayLabel(item.date)}</span>}
          {item.time && <span className="chip">{item.time}</span>}
          {item.owner !== "Saadan" && <span className="chip chip--osman">{item.owner}</span>}
          {late && <span className="chip chip--due">Late</span>}
        </div>
        <p className="prog-row__t">{item.title}</p>
        <p className="small muted">{item.detail}</p>
      </div>
    </li>
  );
}

function TodayList({ program, done, today, behind, onTick }: ListProps & { behind: ProgramItem[] }) {
  const todays = program.items.filter((i) => i.date === today);
  const next = program.items.filter((i) => i.date > today && !done[i.id]).slice(0, 4);
  return (
    <div className="stack">
      {behind.length > 0 && (
        <div className="g" style={{ padding: 18 }}>
          <span className="label" style={{ color: "#c4162a" }}>
            Catch up first · {behind.length}
          </span>
          <ul className="stack--tight" style={{ marginTop: 8 }}>
            {behind.map((i) => (
              <Row key={i.id} item={i} done={false} today={today} onTick={onTick} showDate />
            ))}
          </ul>
        </div>
      )}
      <div className="g" style={{ padding: 18 }}>
        <span className="label">Today · {dayLabel(today, { weekday: "long", day: "numeric", month: "long" })}</span>
        {todays.length ? (
          <ul className="stack--tight" style={{ marginTop: 8 }}>
            {todays.map((i) => (
              <Row key={i.id} item={i} done={!!done[i.id]} today={today} onTick={onTick} />
            ))}
          </ul>
        ) : (
          <p className="small muted" style={{ marginTop: 8 }}>
            Nothing is scheduled for today. Answer new submissions, then get ahead on what is next.
          </p>
        )}
      </div>
      {next.length > 0 && (
        <div className="g" style={{ padding: 18 }}>
          <span className="label">Coming up</span>
          <ul className="stack--tight" style={{ marginTop: 8 }}>
            {next.map((i) => (
              <Row key={i.id} item={i} done={false} today={today} onTick={onTick} showDate />
            ))}
          </ul>
        </div>
      )}
      <div className="g" style={{ padding: 18 }}>
        <span className="label">Every day, all season</span>
        <ul className="stack--tight small" style={{ marginTop: 8 }}>
          {program.ongoing.map((o) => (
            <li key={o}>• {o}</li>
          ))}
        </ul>
        <p className="small muted" style={{ marginTop: 6 }}>
          Every abstract gets an answer within 7 days, and every payment a receipt within 2 working days.
        </p>
      </div>
    </div>
  );
}

function WeekList({ program, done, today, onTick }: ListProps) {
  const [offset, setOffset] = useState(0);
  const start = addDays(mondayOf(today), offset * 7);
  const days = Array.from({ length: 7 }, (_, k) => addDays(start, k));
  const items = program.items.filter((i) => i.date >= days[0] && i.date <= days[6]);
  const n = items.filter((i) => done[i.id]).length;
  return (
    <div className="g" style={{ padding: 18 }}>
      <div className="row row--between">
        <button type="button" className="btn btn--sm btn--ghost" onClick={() => setOffset((o) => o - 1)} aria-label="Previous week">
          ←
        </button>
        <div style={{ textAlign: "center" }}>
          <span className="label">{offset === 0 ? "This week" : offset === 1 ? "Next week" : offset === -1 ? "Last week" : "Week of"}</span>
          <p className="h2">
            {dayLabel(days[0], { day: "numeric", month: "short" })} – {dayLabel(days[6], { day: "numeric", month: "short" })}
          </p>
          <p className="small muted">
            {n} of {items.length} done
          </p>
        </div>
        <button type="button" className="btn btn--sm btn--ghost" onClick={() => setOffset((o) => o + 1)} aria-label="Next week">
          →
        </button>
      </div>
      <div className="stack" style={{ marginTop: 12 }}>
        {days.map((d) => {
          const di = items.filter((i) => i.date === d);
          if (!di.length) return null;
          return (
            <div key={d}>
              <p className="label" data-today={d === today} style={d === today ? { color: "var(--blue-deep)" } : undefined}>
                {dayLabel(d, { weekday: "long", day: "numeric", month: "short" })}
                {d === today ? " · today" : ""}
              </p>
              <ul className="stack--tight">
                {di.map((i) => (
                  <Row key={i.id} item={i} done={!!done[i.id]} today={today} onTick={onTick} />
                ))}
              </ul>
            </div>
          );
        })}
        {!items.length && <p className="small muted">Nothing scheduled this week.</p>}
      </div>
    </div>
  );
}

function monthIndexFor(program: Program, today: string): number {
  const key = today.slice(0, 7);
  const i = program.months.findIndex((m) => m.key === key);
  if (i >= 0) return i;
  return key < program.months[0].key ? 0 : program.months.length - 1;
}

function MonthList({ program, done, today, onTick }: ListProps) {
  const [idx, setIdx] = useState(() => monthIndexFor(program, today));
  const m = program.months[idx];
  const items = program.items.filter((i) => i.date.startsWith(m.key));
  const n = items.filter((i) => done[i.id]).length;
  const weeks = useMemo(() => {
    const out: { start: string; items: ProgramItem[] }[] = [];
    items.forEach((i) => {
      const w = mondayOf(i.date);
      const last = out[out.length - 1];
      if (last && last.start === w) last.items.push(i);
      else out.push({ start: w, items: [i] });
    });
    return out;
  }, [items]);
  return (
    <div className="g" style={{ padding: 18 }}>
      <div className="row row--between">
        <button type="button" className="btn btn--sm btn--ghost" disabled={idx === 0} onClick={() => setIdx((v) => Math.max(0, v - 1))} aria-label="Previous month">
          ←
        </button>
        <div style={{ textAlign: "center" }}>
          <span className="label">{m.theme}</span>
          <p className="h2">{m.name}</p>
        </div>
        <button type="button" className="btn btn--sm btn--ghost" disabled={idx === program.months.length - 1} onClick={() => setIdx((v) => Math.min(program.months.length - 1, v + 1))} aria-label="Next month">
          →
        </button>
      </div>
      <p className="small" style={{ marginTop: 10 }}>
        {m.goal}
      </p>
      <div className="bar" style={{ marginTop: 10 }}>
        <div className="bar__fill" data-done={n === items.length && n > 0} style={{ width: `${items.length ? (n / items.length) * 100 : 0}%` }} />
      </div>
      <p className="small muted" style={{ marginTop: 4 }}>
        {n} of {items.length} done this month
      </p>
      <div className="stack" style={{ marginTop: 14 }}>
        {weeks.map((w) => (
          <div key={w.start}>
            <p className="label">Week of {dayLabel(w.start, { day: "numeric", month: "short" })}</p>
            <ul className="stack--tight">
              {w.items.map((i) => (
                <Row key={i.id} item={i} done={!!done[i.id]} today={today} onTick={onTick} showDate />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function WholePlan({ program, done, today, onTick }: ListProps) {
  const [open, setOpen] = useState<string | null>(() => program.months[monthIndexFor(program, today)].key);
  return (
    <div className="stack--tight">
      {program.months.map((m) => {
        const items = program.items.filter((i) => i.date.startsWith(m.key));
        const n = items.filter((i) => done[i.id]).length;
        const isOpen = open === m.key;
        return (
          <div key={m.key} className="g" style={{ padding: 0, overflow: "hidden" }}>
            <button type="button" className="prog-month" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : m.key)}>
              <div style={{ flex: 1, textAlign: "left" }}>
                <p className="h2">{m.name}</p>
                <p className="small muted">{m.theme}</p>
                <div className="bar" style={{ marginTop: 8 }}>
                  <div className="bar__fill" data-done={n === items.length && n > 0} style={{ width: `${items.length ? (n / items.length) * 100 : 0}%` }} />
                </div>
              </div>
              <span className="small" style={{ fontWeight: 600, minWidth: 54, textAlign: "right" }}>
                {n}/{items.length}
              </span>
              <span className="prog-month__chev" data-open={isOpen}>
                <Chevron />
              </span>
            </button>
            {isOpen && (
              <ul className="stack--tight" style={{ padding: "0 18px 16px" }}>
                {items.map((i) => (
                  <Row key={i.id} item={i} done={!!done[i.id]} today={today} onTick={onTick} showDate />
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Osman's side: progress only
 * ------------------------------------------------------------------------- */

export function ProgramOverview({ program }: { program: Program }) {
  const p = useProgramProgress(program);
  const recent = Object.entries(p.done)
    .map(([id, d]) => ({ item: program.items.find((i) => i.id === id), ...d }))
    .filter((r): r is { item: ProgramItem; at: string; by: Persona } => !!r.item)
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 8);
  const ring = 2 * Math.PI * 52;
  return (
    <div className="stack">
      <Hero program={program} />
      <div className="grid prog-2">
        <div className="g prog-ring-card">
          <svg viewBox="0 0 120 120" className="prog-ring" aria-hidden>
            <circle cx="60" cy="60" r="52" className="prog-ring__bg" />
            <circle cx="60" cy="60" r="52" className="prog-ring__fg" strokeDasharray={ring} strokeDashoffset={ring * (1 - p.percent / 100)} />
          </svg>
          <div className="prog-ring__txt">
            <span className="stat__n">{p.percent}%</span>
            <span className="small muted">of the plan done</span>
          </div>
          <div style={{ width: "100%" }}>
            <Pace percent={p.percent} expected={p.expected} behind={p.behind.length} />
          </div>
        </div>
        <div className="g" style={{ padding: 18 }}>
          <span className="label">By month</span>
          <ul className="stack--tight" style={{ marginTop: 10 }}>
            {program.months.map((m) => {
              const items = program.items.filter((i) => i.date.startsWith(m.key));
              const n = items.filter((i) => p.done[i.id]).length;
              const current = p.today.startsWith(m.key);
              return (
                <li key={m.key}>
                  <div className="row row--between small">
                    <span style={{ fontWeight: current ? 700 : 500 }}>
                      {m.name}
                      {current ? " · now" : ""}
                    </span>
                    <span className="muted">
                      {n}/{items.length}
                    </span>
                  </div>
                  <div className="bar" style={{ marginTop: 4 }}>
                    <div className="bar__fill" data-done={n === items.length && n > 0} style={{ width: `${items.length ? (n / items.length) * 100 : 0}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="g" style={{ padding: 18 }}>
        <span className="label">Milestones</span>
        <ol className="prog-steps" style={{ marginTop: 12 }}>
          {program.milestones.map((ms) => {
            const passed = ms.date < p.today;
            const isToday = ms.date === p.today;
            return (
              <li key={ms.date + ms.label} className="prog-steps__i" data-state={passed ? "past" : isToday ? "now" : "next"}>
                <span className="prog-steps__dot" />
                <span className="small" style={{ fontWeight: 600 }}>
                  {ms.label}
                </span>
                <span className="small muted">{dayLabel(ms.date, { day: "numeric", month: "short", year: "numeric" })}</span>
              </li>
            );
          })}
        </ol>
      </div>
      <div className="grid prog-2">
        <div className="g" style={{ padding: 18 }}>
          <span className="label">Just finished</span>
          {recent.length ? (
            <ul className="stack--tight" style={{ marginTop: 8 }}>
              {recent.map((r) => (
                <li key={r.item.id} className="row row--between small" style={{ gap: 10 }}>
                  <span>
                    <span className={`chip ${KIND[r.item.kind].cls}`} style={{ marginRight: 6 }}>
                      {KIND[r.item.kind].label}
                    </span>
                    {r.item.title}
                  </span>
                  <span className="muted" style={{ whiteSpace: "nowrap" }}>
                    {whenLabel(r.at)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="small muted" style={{ marginTop: 8 }}>
              Nothing ticked off yet. The campaign launches on {dayLabel(program.launch, { day: "numeric", month: "long" })}.
            </p>
          )}
        </div>
        <div className="g" style={{ padding: 18 }}>
          <span className="label">{p.behind.length ? `Late · ${p.behind.length}` : "Late"}</span>
          {p.behind.length ? (
            <ul className="stack--tight" style={{ marginTop: 8 }}>
              {p.behind.slice(0, 6).map((i) => (
                <li key={i.id} className="small">
                  <span className="chip chip--due" style={{ marginRight: 6 }}>
                    {dayLabel(i.date, { day: "numeric", month: "short" })}
                  </span>
                  {i.title}
                </li>
              ))}
              {p.behind.length > 6 && <li className="small muted">and {p.behind.length - 6} more</li>}
            </ul>
          ) : (
            <p className="small muted" style={{ marginTop: 8 }}>
              Nothing is late.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
