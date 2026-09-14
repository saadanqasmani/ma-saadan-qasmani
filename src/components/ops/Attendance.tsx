"use client";

import { useState } from "react";
import { STATUSES, hoursBetween, todayISO, weekStart, workDays, type Attendance as Att } from "@/lib/ops/model";
import { setAttendance, addXp, useOps } from "@/lib/ops/store";
import { Confirm, Seg, useCelebrate } from "./ui";

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function iso(d: Date) {
  return todayISO(d);
}

/**
 * Where you were and for how long, one tap per day.
 *
 * The day being edited is always visible at the top; the calendar below is
 * for picking a different one. Nothing is hidden behind a hover.
 */
export function AttendanceView() {
  const { state } = useOps();
  const today = todayISO();
  const [date, setDate] = useState(today);
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const rec = state.attendance[date];
  const { toast, burst } = useCelebrate();

  const [status, setStatus] = useState<Att["status"]>(rec?.status ?? "campus");
  const [hours, setHours] = useState<string>(rec ? String(rec.hours) : "8");
  const [note, setNote] = useState(rec?.note ?? "");

  function pick(d: string) {
    setDate(d);
    const r = state.attendance[d];
    setStatus(r?.status ?? "campus");
    setHours(r ? String(r.hours) : "8");
    setNote(r?.note ?? "");
  }

  function save(e?: React.FormEvent) {
    e?.preventDefault();
    const fresh = !rec;
    const att: Att = {
      status,
      hours: status === "campus" || status === "remote" ? Math.max(0, Math.min(16, Number(hours) || 0)) : 0,
      checkInAt: rec?.checkInAt ?? new Date().toISOString(),
      note: note.trim(),
    };
    setAttendance(date, att);
    if (fresh && (att.status === "campus" || att.status === "remote")) {
      addXp(10);
      burst();
      toast(date === today ? "Checked in. +10 XP" : "Logged. +10 XP", { tone: "gold" });
    } else toast("Saved");
  }

  const ws = weekStart(new Date());
  const we = new Date(ws);
  we.setDate(we.getDate() + 6);
  const weekHours = hoursBetween(state.attendance, iso(ws), iso(we));
  const weekDaysIn = Object.keys(state.attendance).filter((k) => k >= iso(ws) && k <= iso(we) && ["campus", "remote"].includes(state.attendance[k].status)).length;
  const mStart = new Date(month.getFullYear(), month.getMonth(), 1);
  const mEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0);
  const monthHours = hoursBetween(state.attendance, iso(mStart), iso(mEnd));

  // Calendar grid for the month, Monday first.
  const first = weekStart(mStart);
  const cells: Date[] = [];
  for (let i = 0; i < 42; i += 1) {
    const d = new Date(first);
    d.setDate(first.getDate() + i);
    cells.push(d);
  }
  while (cells.length > 35 && cells[35].getMonth() !== month.getMonth()) cells.splice(35);

  return (
    <div className="stack">
      <div className="grid grid--stats stagger">
        <div className="g stat">
          <div className="stat__n">{weekDaysIn}</div>
          <div className="stat__l">days this week</div>
        </div>
        <div className="g stat">
          <div className="stat__n">{weekHours}h</div>
          <div className="stat__l">hours this week</div>
        </div>
        <div className="g stat">
          <div className="stat__n">{monthHours}h</div>
          <div className="stat__l">{month.toLocaleDateString(undefined, { month: "long" })}</div>
        </div>
        <div className="g stat">
          <div className="stat__n">{workDays(state.attendance)}</div>
          <div className="stat__l">working days logged</div>
        </div>
      </div>

      <form onSubmit={save} className="g g--pop stack">
        <div className="row row--between">
          <h2 className="h2">{date === today ? "Today" : new Date(date + "T00:00:00").toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}</h2>
          {rec?.checkInAt && <span className="chip chip--ok">Checked in {new Date(rec.checkInAt).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}</span>}
        </div>
        <Seg<Att["status"]>
          ariaLabel="Where"
          value={status}
          onChange={setStatus}
          options={STATUSES.map((s) => ({ id: s.id, label: s.label, tone: s.id === "campus" ? "yellow" : s.id === "remote" ? "blue" : undefined }))}
        />
        <div className="row" style={{ gap: 14 }}>
          {(status === "campus" || status === "remote") && (
            <label className="fieldset">
              <span className="label">Hours</span>
              <input type="number" className="field" style={{ width: 110 }} min={0} max={16} step={0.5} value={hours} onChange={(e) => setHours(e.target.value)} />
            </label>
          )}
          <label className="fieldset grow">
            <span className="label">Note (optional)</span>
            <input className="field" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Where the day went" />
          </label>
        </div>
        <div className="row row--between">
          <button type="submit" className="btn btn--primary btn--big">
            {rec ? "Update" : date === today ? "Check in" : "Log this day"}
          </button>
          {rec && <Confirm label="Clear this day" question="Clear it?" onYes={() => { setAttendance(date, null); toast("Cleared"); }} />}
        </div>
      </form>

      <div className="g stack">
        <div className="row row--between">
          <button type="button" className="btn btn--sm btn--ghost" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}>
            ‹ Prev
          </button>
          <h3 className="h3">{month.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</h3>
          <button type="button" className="btn btn--sm btn--ghost" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}>
            Next ›
          </button>
        </div>
        <div className="cal">
          {DAY_NAMES.map((n) => (
            <span key={n} className="cal__h">
              {n}
            </span>
          ))}
          {cells.map((d) => {
            const k = iso(d);
            const r = state.attendance[k];
            return (
              <button key={k} type="button" className="cal__d" data-out={d.getMonth() !== month.getMonth()} data-today={k === today} data-on={k === date} data-status={r?.status} onClick={() => pick(k)} aria-label={k}>
                {d.getDate()}
                {r && r.hours > 0 && <small>{r.hours}h</small>}
              </button>
            );
          })}
        </div>
        <div className="legend">
          <span>
            <i style={{ background: "var(--yellow)" }} />
            Campus
          </span>
          <span>
            <i style={{ background: "var(--blue-soft)" }} />
            Remote
          </span>
          <span>
            <i style={{ background: "rgba(11,13,18,.12)" }} />
            Leave
          </span>
          <span>
            <i style={{ background: "rgba(11,13,18,.04)" }} />
            Off
          </span>
        </div>
        <p className="hint">Tap any day to log or change it. Past days count too.</p>
      </div>
    </div>
  );
}

/** The last seven days as a strip, for Osman's overview. */
export function WeekStrip() {
  const { state } = useOps();
  const days: Date[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d);
  }
  return (
    <div className="cal">
      {days.map((d) => {
        const k = iso(d);
        const r = state.attendance[k];
        return (
          <div key={k} className="cal__d" data-status={r?.status} data-today={k === todayISO()} style={{ cursor: "default" }} title={`${k}: ${r ? r.status : "no record"}`}>
            <span className="small" style={{ lineHeight: 1 }}>
              {DAY_NAMES[(d.getDay() + 6) % 7]}
            </span>
            {r && r.hours > 0 && <small>{r.hours}h</small>}
          </div>
        );
      })}
    </div>
  );
}
