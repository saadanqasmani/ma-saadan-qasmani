"use client";

import { useState } from "react";
import { newId, type Appointment, type Persona } from "@/lib/ops/model";
import { removeAppointment, upsertAppointment, useOps } from "@/lib/ops/store";
import { Avatar, Confirm, Empty, nameOf, useCelebrate } from "./ui";

/**
 * Meetings that have not happened yet.
 *
 * Separate from the meeting log, which is a record of what was said. This
 * is the diary: who, when, where, and whether the other one has agreed to
 * it. A meeting one person put in the calendar and the other never accepted
 * is the most reliable way to waste an afternoon, so proposing and
 * confirming are two different things here.
 */

function whenLabel(at: string): string {
  if (!at) return "";
  const d = new Date(at);
  if (Number.isNaN(d.getTime())) return at;
  return d.toLocaleString(undefined, { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}

function isPast(at: string): boolean {
  const d = new Date(at).getTime();
  return Number.isFinite(d) && d < Date.now();
}

export function Diary({ who }: { who: Persona }) {
  const { state } = useOps();
  const other: Persona = who === "saadan" ? "osman" : "saadan";
  const [open, setOpen] = useState(false);
  const { toast } = useCelebrate();

  const [title, setTitle] = useState("");
  const [at, setAt] = useState("");
  const [minutes, setMinutes] = useState(30);
  const [guests, setGuests] = useState("");
  const [where, setWhere] = useState("");
  const [withOther, setWithOther] = useState(true);
  const [note, setNote] = useState("");

  const upcoming = state.appointments.filter((a) => !isPast(a.at) && a.status !== "declined");
  const past = state.appointments.filter((a) => isPast(a.at) || a.status === "declined").slice(-6).reverse();

  function schedule(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !at) return;
    const appt: Appointment = {
      id: newId("appt"),
      title: title.trim(),
      at,
      minutes,
      guests: guests.trim(),
      who: withOther ? [who, other] : [who],
      where: where.trim(),
      by: who,
      note: note.trim(),
      // Nobody needs to confirm a meeting they put in themselves alone.
      status: withOther ? "proposed" : "confirmed",
    };
    upsertAppointment(appt);
    setTitle("");
    setAt("");
    setGuests("");
    setWhere("");
    setNote("");
    setOpen(false);
    toast(withOther ? `Proposed to ${nameOf(other)}.` : "In your diary.", { tone: "blue" });
  }

  return (
    <div className="stack">
      <div className="row row--between">
        <p className="muted small">
          {upcoming.length} coming up
        </p>
        {!open && (
          <button type="button" className="btn btn--primary" onClick={() => setOpen(true)}>
            + Schedule a meeting
          </button>
        )}
      </div>

      {open && (
        <form onSubmit={schedule} className="g g--pop stack">
          <h2 className="h2">New meeting</h2>
          <label className="fieldset">
            <span className="label">What is it about</span>
            <input className="field" autoFocus value={title} onChange={(e) => setTitle(e.target.value)} required />
          </label>
          <div className="row" style={{ gap: 14 }}>
            <label className="fieldset">
              <span className="label">When</span>
              <input type="datetime-local" className="field field--date" value={at} onChange={(e) => setAt(e.target.value)} required />
            </label>
            <label className="fieldset">
              <span className="label">Minutes</span>
              <input
                type="number"
                className="field"
                style={{ width: 110 }}
                min={5}
                max={480}
                step={5}
                value={minutes}
                onChange={(e) => setMinutes(Math.max(5, Number(e.target.value) || 30))}
              />
            </label>
          </div>
          <label className="fieldset">
            <span className="label">Where</span>
            <input className="field" placeholder="Your office, the meeting room, a link" value={where} onChange={(e) => setWhere(e.target.value)} />
          </label>
          <label className="fieldset">
            <span className="label">Anyone else</span>
            <input className="field" placeholder="Names of people outside the two of you" value={guests} onChange={(e) => setGuests(e.target.value)} />
          </label>
          <label className="check" style={{ cursor: "pointer" }}>
            <button
              type="button"
              className="check__box"
              data-on={withOther}
              onClick={() => setWithOther(!withOther)}
              aria-pressed={withOther}
              aria-label={`Include ${nameOf(other)}`}
            >
              {withOther && "✓"}
            </button>
            <span className="check__text">{nameOf(other)} is in this one</span>
          </label>
          <label className="fieldset">
            <span className="label">Anything to prepare</span>
            <input className="field" value={note} onChange={(e) => setNote(e.target.value)} />
          </label>
          <div className="row row--end">
            <button type="button" className="btn btn--quiet" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={!title.trim() || !at}>
              {withOther ? `Propose to ${nameOf(other)}` : "Put it in"}
            </button>
          </div>
        </form>
      )}

      {upcoming.length === 0 && !open && (
        <Empty title="Nothing in the diary" body="Schedule one and it appears on both sides.">
          <button type="button" className="btn btn--yellow" onClick={() => setOpen(true)}>
            Schedule a meeting
          </button>
        </Empty>
      )}

      <div className="stack stack--tight stagger">
        {upcoming.map((a) => (
          <AppointmentRow key={a.id} appt={a} who={who} />
        ))}
      </div>

      {past.length > 0 && (
        <section className="stack stack--tight">
          <span className="label">Been and gone</span>
          {past.map((a) => (
            <AppointmentRow key={a.id} appt={a} who={who} past />
          ))}
        </section>
      )}
    </div>
  );
}

function AppointmentRow({ appt, who, past }: { appt: Appointment; who: Persona; past?: boolean }) {
  const { toast } = useCelebrate();
  // Waiting on me when somebody else proposed it and I am in it.
  const mineToAnswer = appt.status === "proposed" && appt.by !== who && appt.who.includes(who);

  function answer(status: Appointment["status"]) {
    upsertAppointment({ ...appt, status });
    toast(status === "confirmed" ? "Confirmed." : "Declined.", { tone: status === "confirmed" ? "gold" : undefined });
  }

  return (
    <div className="g stack stack--tight" style={{ opacity: past ? 0.65 : 1 }}>
      <div className="row" style={{ gap: 10, alignItems: "flex-start" }}>
        <div className="grow" style={{ minWidth: 0 }}>
          <p style={{ fontWeight: 600 }}>{appt.title}</p>
          <p className="small muted">
            {whenLabel(appt.at)} · {appt.minutes} min
            {appt.where ? ` · ${appt.where}` : ""}
          </p>
          <div className="row" style={{ gap: 6, marginTop: 6 }}>
            {appt.who.map((p) => (
              <Avatar key={p} who={p} />
            ))}
            {appt.guests && <span className="chip">{appt.guests}</span>}
            <span
              className={`chip ${appt.status === "confirmed" ? "chip--ok" : appt.status === "declined" ? "chip--due" : "chip--soon"}`}
            >
              {appt.status === "confirmed" ? "Confirmed" : appt.status === "declined" ? "Declined" : "Proposed"}
            </span>
          </div>
          {appt.note && <p className="small muted" style={{ marginTop: 6 }}>To prepare: {appt.note}</p>}
        </div>
      </div>

      {mineToAnswer && !past && (
        <div className="row">
          <button type="button" className="btn btn--sm btn--primary" onClick={() => answer("confirmed")}>
            I can make it
          </button>
          <button type="button" className="btn btn--sm btn--ghost" onClick={() => answer("declined")}>
            I cannot
          </button>
        </div>
      )}

      {!past && !mineToAnswer && (
        <div className="row row--end">
          <Confirm label="Cancel it" question="Cancel this meeting?" onYes={() => removeAppointment(appt.id)} />
        </div>
      )}
    </div>
  );
}

/** Meetings proposed to this person and not yet answered. For the badge. */
export function proposalsFor(appointments: Appointment[], who: Persona): number {
  return appointments.filter(
    (a) => a.status === "proposed" && a.by !== who && a.who.includes(who) && !isPast(a.at),
  ).length;
}

/** The next thing in the diary, for whoever is looking. */
export function nextUp(appointments: Appointment[]): Appointment | null {
  return appointments.find((a) => !isPast(a.at) && a.status !== "declined") ?? null;
}
