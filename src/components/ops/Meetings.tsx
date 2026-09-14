"use client";

import { useState } from "react";
import { MEET_XP, fmtDate, newId, scanNotes, todayISO, type Meeting, type MeetingItem, type Segment, type Task } from "@/lib/ops/model";
import { addXp, removeMeeting, upsertMeeting, upsertTask, useOps } from "@/lib/ops/store";
import { AutoArea, Confirm, Empty, Inline, Seg, useCelebrate } from "./ui";

/**
 * Meetings, and the work that comes out of them.
 *
 * Paste the notes, press Scan, and every bullet becomes an action item
 * with a segment and a date you can change. Confirm sends it to the board
 * as a task. Nothing lands on the board without a person saying so.
 */
export function MeetingsView() {
  const { state } = useOps();
  const [adding, setAdding] = useState(false);
  const [date, setDate] = useState(todayISO());
  const [withWho, setWith] = useState("Osman");
  const [title, setTitle] = useState("");
  const { toast } = useCelebrate();

  function add(e: React.FormEvent) {
    e.preventDefault();
    const m: Meeting = { id: newId("m"), date, with: withWho.trim() || "Osman", title: title.trim() || "Meeting", notes: "", items: [] };
    upsertMeeting(m);
    addXp(MEET_XP);
    toast(`Logged. +${MEET_XP} XP`, { tone: "gold" });
    setTitle("");
    setAdding(false);
  }

  return (
    <div className="stack">
      <div className="row row--between">
        <p className="muted small">
          {state.meetings.length} meeting{state.meetings.length === 1 ? "" : "s"} logged
        </p>
        {!adding && (
          <button type="button" className="btn btn--primary" onClick={() => setAdding(true)}>
            + Log a meeting
          </button>
        )}
      </div>

      {adding && (
        <form onSubmit={add} className="g g--pop stack">
          <h2 className="h2">New meeting</h2>
          <div className="row" style={{ gap: 14 }}>
            <label className="fieldset">
              <span className="label">Date</span>
              <input type="date" className="field field--date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </label>
            <label className="fieldset">
              <span className="label">With</span>
              <input className="field" value={withWho} onChange={(e) => setWith(e.target.value)} />
            </label>
            <label className="fieldset grow">
              <span className="label">About</span>
              <input className="field" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Friday courses, IAU, anything" autoFocus />
            </label>
          </div>
          <div className="row row--end">
            <button type="button" className="btn btn--quiet" onClick={() => setAdding(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary">
              Log it
            </button>
          </div>
        </form>
      )}

      {state.meetings.length === 0 && !adding && (
        <Empty title="No meetings yet" body="Log one, paste the notes, and turn the bullets into tasks.">
          <button type="button" className="btn btn--yellow" onClick={() => setAdding(true)}>
            Log the first one
          </button>
        </Empty>
      )}

      <div className="stack stagger">
        {state.meetings.map((m) => (
          <MeetingCard key={m.id} meeting={m} tasks={state.tasks} />
        ))}
      </div>
    </div>
  );
}

function MeetingCard({ meeting, tasks }: { meeting: Meeting; tasks: Task[] }) {
  const [open, setOpen] = useState(meeting.items.length === 0 && !meeting.notes);
  const [notes, setNotes] = useState(meeting.notes);
  const { toast } = useCelebrate();
  const pending = meeting.items.filter((i) => !i.confirmed).length;

  function save(patch: Partial<Meeting>) {
    upsertMeeting({ ...meeting, ...patch });
  }

  function scan() {
    const found = scanNotes(notes);
    if (!found.length) {
      toast("No lines to pull out. Bullets work best.");
      return;
    }
    const existing = new Set(meeting.items.map((i) => i.text));
    const items: MeetingItem[] = [...meeting.items, ...found.filter((t) => !existing.has(t)).map((text) => ({ text, segment: "academic" as Segment, due: null, confirmed: false, taskId: null }))];
    save({ notes, items });
    toast(`${items.length - meeting.items.length} item${items.length - meeting.items.length === 1 ? "" : "s"} found. Check each and confirm.`, { tone: "blue" });
  }

  function setItem(i: number, patch: Partial<MeetingItem>) {
    save({ items: meeting.items.map((it, k) => (k === i ? { ...it, ...patch } : it)) });
  }

  function confirm(i: number) {
    const it = meeting.items[i];
    const id = newId("t");
    const task: Task = {
      id,
      segment: it.segment,
      title: it.text,
      desc: `From the meeting with ${meeting.with} on ${fmtDate(meeting.date)}.`,
      when: it.due ? `Due ${fmtDate(it.due)}` : "",
      due: it.due,
      status: "not_started",
      percent: 0,
      order: tasks.filter((t) => t.segment === it.segment).length + 1,
      checklist: [],
      fromMeeting: meeting.id,
      createdBy: "saadan",
      comments: [],
      submissions: [],
      approval: null,
    };
    upsertTask(task);
    setItem(i, { confirmed: true, taskId: id });
    toast("On the board.", { tone: "blue" });
  }

  return (
    <div className="g stack">
      <div className="row row--between">
        <div className="grow">
          <Inline value={meeting.title} title ariaLabel="Meeting title" onSave={(v) => v && save({ title: v })} />
          <div className="row" style={{ gap: 12 }}>
            <input type="date" className="field field--inline field--date" value={meeting.date} onChange={(e) => e.target.value && save({ date: e.target.value })} aria-label="Meeting date" />
            <span className="small muted">with</span>
            <Inline value={meeting.with} ariaLabel="With whom" onSave={(v) => v && save({ with: v })} />
          </div>
        </div>
        <div className="row">
          {pending > 0 && <span className="chip chip--soon">{pending} to confirm</span>}
          {meeting.items.filter((i) => i.confirmed).length > 0 && <span className="chip chip--ok">{meeting.items.filter((i) => i.confirmed).length} on board</span>}
          <button type="button" className="btn btn--sm btn--ghost" onClick={() => setOpen(!open)}>
            {open ? "Close" : "Open"}
          </button>
        </div>
      </div>

      {open && (
        <>
          <div className="fieldset">
            <span className="label">Notes</span>
            <AutoArea value={notes} onChange={setNotes} onBlur={() => notes !== meeting.notes && save({ notes })} placeholder={"- One bullet per thing agreed\n- Scan pulls them out below"} rows={4} />
          </div>
          <div className="row">
            <button type="button" className="btn btn--yellow" onClick={scan}>
              Scan for action items
            </button>
            <span className="hint">Bullets become items you can send to the board.</span>
          </div>

          {meeting.items.length > 0 && (
            <div className="stack stack--tight">
              <span className="label">Action items</span>
              {meeting.items.map((it, i) => (
                <div key={i} className="move" style={{ flexWrap: "wrap", alignItems: "center" }}>
                  <div className="grow" style={{ minWidth: 200 }}>
                    {it.confirmed ? (
                      <span>
                        <span className="chip chip--ok" style={{ marginRight: 8 }}>
                          On board
                        </span>
                        {it.text}
                      </span>
                    ) : (
                      <Inline value={it.text} ariaLabel="Action item" onSave={(v) => v && setItem(i, { text: v })} />
                    )}
                  </div>
                  {!it.confirmed && (
                    <>
                      <Seg<Segment>
                        ariaLabel="Segment"
                        value={it.segment}
                        onChange={(v) => setItem(i, { segment: v })}
                        options={[
                          { id: "academic", label: "Academic", tone: "blue" },
                          { id: "administrative", label: "Admin", tone: "yellow" },
                        ]}
                      />
                      <input type="date" className="field field--date" value={it.due ?? ""} onChange={(e) => setItem(i, { due: e.target.value || null })} aria-label="Due" />
                      <button type="button" className="btn btn--sm btn--primary" onClick={() => confirm(i)}>
                        Send to board
                      </button>
                      <button type="button" className="btn btn--sm btn--quiet" onClick={() => save({ items: meeting.items.filter((_, k) => k !== i) })} aria-label="Remove item">
                        ×
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="row row--end">
            <Confirm label="Delete meeting" question="Delete it? Tasks already on the board stay." onYes={() => removeMeeting(meeting.id)} />
          </div>
        </>
      )}
    </div>
  );
}
