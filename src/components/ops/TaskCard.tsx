"use client";

import { useEffect, useRef, useState } from "react";
import {
  DEFAULT_MOVES,
  MOVES,
  PRIORITIES,
  dueLabel,
  fmtDate,
  newId,
  pct,
  xpOf,
  type Attachment,
  type Comment,
  type Persona,
  type Segment,
  type Status,
  type Task,
} from "@/lib/ops/model";
import { addXp, patchTask, removeTask, upsertTask } from "@/lib/ops/store";
import { taskPrompt } from "@/lib/ops/brief";
import { Direction, NudgeNote } from "./NowWorking";
import { Avatar, Chevron, Confirm, CopyForClaude, FileRow, Inline, Seg, Tick, Upload, nameOf, useCelebrate, whenLabel } from "./ui";

/**
 * One task, and everything you can do to it, on the card itself.
 *
 * Every word on it is editable by clicking it. Every action is a button
 * you can see. The card opens in place; nothing hides behind a menu. When
 * the last box is ticked it pops, because that is what finishing should
 * feel like.
 */
export function TaskCard({
  task,
  who,
  open: forceOpen,
  simple = false,
}: {
  task: Task;
  who: Persona;
  open?: boolean;
  simple?: boolean;
}) {
  const [open, setOpen] = useState(!!forceOpen);
  const [seenForce, setSeenForce] = useState(!!forceOpen);
  const ref = useRef<HTMLDivElement>(null);
  const { toast, burst } = useCelebrate();
  const done = pct(task) === 100;
  const due = dueLabel(task);
  const moves = MOVES[task.id] ?? DEFAULT_MOVES;

  // Asked to open from elsewhere (a notice, the agenda): open, once per ask.
  if (!!forceOpen !== seenForce) {
    setSeenForce(!!forceOpen);
    if (forceOpen) setOpen(true);
  }

  useEffect(() => {
    if (forceOpen) ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [forceOpen]);

  function celebrate(next: Task) {
    if (pct(task) < 100 && pct(next) === 100) {
      const r = ref.current?.getBoundingClientRect();
      burst(r ? r.left + r.width / 2 : undefined, r ? r.top + 40 : undefined);
      addXp(xpOf(task));
      toast(`Done. +${xpOf(task)} XP`, { tone: "gold" });
    }
  }

  function save(patch: Partial<Task>) {
    const next = { ...task, ...patch };
    celebrate(next);
    upsertTask(next);
  }

  function setStatus(status: Status) {
    if (status === "done") {
      save({
        status,
        percent: 100,
        checklist: task.checklist.map((c) => ({ ...c, done: true })),
      });
      return;
    }
    const patch: Partial<Task> = { status };
    if (task.status === "done") {
      patch.percent = task.checklist.length ? task.percent : Math.min(task.percent, 90);
      patch.checklist = task.checklist.map((c) => ({ ...c, done: false }));
    }
    if (status === "not_started" && !task.checklist.length) patch.percent = 0;
    save(patch);
  }

  function tick(i: number) {
    const checklist = task.checklist.map((c, k) => (k === i ? { ...c, done: !c.done } : c));
    const wasDone = task.checklist[i].done;
    const next: Task = { ...task, checklist };
    const allDone = checklist.every((c) => c.done);
    next.status = allDone ? "done" : next.status === "not_started" || next.status === "done" ? "in_progress" : next.status;
    if (!wasDone && !allDone) addXp(Math.max(3, Math.round(xpOf(task) / Math.max(1, checklist.length))));
    celebrate(next);
    upsertTask(next);
  }

  function addItem(text: string) {
    const t = text.trim();
    if (!t) return;
    save({ checklist: [...task.checklist, { text: t, done: false }], status: task.status === "done" ? "in_progress" : task.status });
  }

  function comment(text: string) {
    const c: Comment = { by: who, at: new Date().toISOString(), text };
    patchTask(task.id, (t) => ({ comments: [...(t.comments ?? []), c] }));
  }

  function handIn(file: { path: string; name: string; type: string }, note: string) {
    const a: Attachment = { id: newId("sub"), name: file.name, path: file.path, type: file.type, by: who, at: new Date().toISOString(), note, comments: [] };
    patchTask(task.id, (t) => ({ submissions: [...(t.submissions ?? []), a], approval: "requested" }));
    toast("Handed in. Osman will see it under Approvals.", { tone: "blue" });
  }

  function decide(verdict: "approved" | "changes", note: string) {
    const c: Comment | null = note.trim() ? { by: who, at: new Date().toISOString(), text: note.trim() } : null;
    patchTask(task.id, (t) => ({ approval: verdict, comments: c ? [...(t.comments ?? []), c] : t.comments }));
    if (verdict === "approved") {
      const r = ref.current?.getBoundingClientRect();
      burst(r ? r.left + r.width / 2 : undefined, r ? r.top + 40 : undefined);
      toast("Approved. Saadan will see it next time he opens the desk.", { tone: "gold" });
    } else toast("Sent back with your note.");
  }

  function del() {
    const copy = task;
    removeTask(task.id);
    toast(`Deleted "${task.title}"`, { action: { label: "Undo", run: () => upsertTask(copy) } });
  }

  return (
    <div ref={ref} className="g card g--lift" data-done={done} id={`task-${task.id}`}>
      <div className="card__head">
        <div className="grow">
          <Inline value={task.title} ariaLabel="Task title" title onSave={(v) => v && save({ title: v })} placeholder="Untitled task" />
          <div className="card__meta">
            <span className={`chip chip--${task.segment === "academic" ? "academic" : "admin"}`}>
              {task.segment === "academic" ? "Academic" : "Admin"}
            </span>
            {due.txt && <span className={`chip${due.cls ? ` chip--${due.cls}` : ""}`}>{due.txt}</span>}
            {task.recurring && <span className="chip">Daily</span>}
            {task.priority && task.priority !== "normal" && (
              <span
                className="chip"
                style={{ background: PRIORITIES.find((p) => p.id === task.priority)?.tone, color: task.priority === "later" ? undefined : "#fff" }}
              >
                {PRIORITIES.find((p) => p.id === task.priority)?.label}
              </span>
            )}
            {task.nudge && <span className="chip chip--soon">{task.nudge.kind === "faster" ? "Push on" : "Start next"}</span>}
            {task.createdBy === "osman" && <span className="chip chip--osman">From Osman</span>}
            {task.approval === "requested" && <span className="chip chip--soon">Awaiting Osman</span>}
            {task.approval === "approved" && <span className="chip chip--ok">Approved</span>}
            {task.approval === "changes" && <span className="chip chip--due">Changes asked</span>}
            {(task.comments?.length ?? 0) > 0 && <span className="chip">{task.comments!.length} comment{task.comments!.length === 1 ? "" : "s"}</span>}
          </div>
        </div>
        <span className="card__pct num">{pct(task)}%</span>
        <button type="button" className="expand" data-open={open} onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Collapse" : "Expand"}>
          <Chevron />
        </button>
      </div>

      <div className="bar" style={{ marginTop: 10 }}>
        <div className="bar__fill" data-done={done} style={{ width: `${pct(task)}%` }} />
      </div>

      {open && (
        <div className="card__body">
          <Inline value={task.desc} ariaLabel="Description" multiline onSave={(v) => save({ desc: v })} placeholder="What is this, in a line or two" />

          {who === "saadan" && <NudgeNote task={task} who="saadan" />}
          {who === "osman" && (
            <div className="card__section">
              <Direction task={task} />
            </div>
          )}

          {!simple && (
            <div className="row row--between">
              <Seg<Status>
                ariaLabel="Status"
                value={task.status}
                onChange={setStatus}
                options={[
                  { id: "not_started", label: "Not started" },
                  { id: "in_progress", label: "In progress", tone: "blue" },
                  { id: "blocked", label: "Blocked", tone: "coral" },
                  { id: "done", label: "Done", tone: "yellow" },
                ]}
              />
              <span className="small muted">Worth {xpOf(task)} XP</span>
            </div>
          )}

          {!simple && task.checklist.length === 0 && (
            <label className="fieldset">
              <span className="label">Progress {task.percent}%</span>
              <input type="range" className="range" min={0} max={100} step={5} value={task.percent} onChange={(e) => save({ percent: Number(e.target.value), status: Number(e.target.value) === 100 ? "done" : Number(e.target.value) > 0 ? "in_progress" : task.status })} />
            </label>
          )}

          <Checklist task={task} onTick={tick} onAdd={addItem} onEdit={(i, text) => save({ checklist: task.checklist.map((c, k) => (k === i ? { ...c, text } : c)) })} onRemove={(i) => save({ checklist: task.checklist.filter((_, k) => k !== i) })} readOnly={simple} />

          {!simple && who === "saadan" && (
            <div className="card__section stack stack--tight">
              <span className="label">Next moves</span>
              {moves.map((m, i) => (
                <div key={i} className="move">
                  <span className="move__i">{i + 1}</span>
                  <span className="grow">{m.t}</span>
                  {m.p && (
                    <button
                      type="button"
                      className="btn btn--sm btn--ghost"
                      onClick={() => {
                        void navigator.clipboard?.writeText(m.p!);
                        toast("Prompt copied");
                      }}
                    >
                      Copy prompt
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {!simple && (
            <div className="card__section stack stack--tight">
              <span className="label">Notes</span>
              <Inline value={task.notes ?? ""} ariaLabel="Notes" multiline onSave={(v) => save({ notes: v })} placeholder="Anything worth remembering. Saved as you go." />
            </div>
          )}

          {!simple && (
            <div className="card__section row" style={{ gap: 14 }}>
              <label className="fieldset">
                <span className="label">Due</span>
                <input type="date" className="field field--date" value={task.due ?? ""} onChange={(e) => save({ due: e.target.value || null, when: e.target.value ? `Due ${fmtDate(e.target.value)}` : task.when })} />
              </label>
              <label className="fieldset">
                <span className="label">Segment</span>
                <select className="field" value={task.segment} onChange={(e) => save({ segment: e.target.value as Segment })}>
                  <option value="academic">Academic</option>
                  <option value="administrative">Administrative</option>
                </select>
              </label>
              <label className="fieldset">
                <span className="label">Repeats daily</span>
                <button type="button" className={`btn btn--sm ${task.recurring ? "btn--yellow" : "btn--ghost"}`} onClick={() => save({ recurring: !task.recurring })} aria-pressed={!!task.recurring}>
                  {task.recurring ? "Yes, resets each day" : "No"}
                </button>
              </label>
            </div>
          )}

          <HandIn task={task} who={who} onHandIn={handIn} onDecide={decide} />

          <Thread comments={task.comments ?? []} who={who} onPost={comment} />

          <div className="card__section row row--between">
            <CopyForClaude text={() => taskPrompt(task)} label="Work on this with Claude" />
            {!simple && <Confirm label="Delete" question="Delete this task?" onYes={del} />}
          </div>

          <div className="row row--between">
            <span className="small muted">
              {task.createdBy ? `Added by ${nameOf(task.createdBy)}` : "On the term board"}
              {task.fromMeeting ? " · from a meeting" : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function Checklist({
  task,
  onTick,
  onAdd,
  onEdit,
  onRemove,
  readOnly,
}: {
  task: Task;
  onTick: (i: number) => void;
  onAdd: (text: string) => void;
  onEdit: (i: number, text: string) => void;
  onRemove: (i: number) => void;
  readOnly: boolean;
}) {
  const [draft, setDraft] = useState("");
  if (readOnly && task.checklist.length === 0) return null;
  return (
    <div className="card__section stack stack--tight">
      <span className="label">
        Checklist{task.checklist.length ? ` · ${task.checklist.filter((c) => c.done).length} of ${task.checklist.length}` : ""}
      </span>
      {task.checklist.map((c, i) => (
        <div key={i} className="check" data-on={c.done}>
          <button type="button" className="check__box" data-on={c.done} onClick={() => onTick(i)} aria-pressed={c.done} aria-label={c.done ? "Untick" : "Tick"}>
            {c.done && <Tick />}
          </button>
          <div className="check__text">
            {readOnly ? <span className="small">{c.text}</span> : <Inline value={c.text} ariaLabel="Checklist item" onSave={(v) => (v ? onEdit(i, v) : onRemove(i))} />}
          </div>
          {!readOnly && (
            <button type="button" className="btn btn--sm btn--quiet check__x" onClick={() => onRemove(i)} aria-label="Remove item">
              ×
            </button>
          )}
        </div>
      ))}
      {!readOnly && (
        <form
          className="row row--nowrap"
          onSubmit={(e) => {
            e.preventDefault();
            onAdd(draft);
            setDraft("");
          }}
        >
          <input className="field grow" placeholder="Add a step and press Enter" value={draft} onChange={(e) => setDraft(e.target.value)} aria-label="New checklist item" />
          <button type="submit" className="btn btn--sm btn--primary" disabled={!draft.trim()}>
            Add
          </button>
        </form>
      )}
    </div>
  );
}

function HandIn({
  task,
  who,
  onHandIn,
  onDecide,
}: {
  task: Task;
  who: Persona;
  onHandIn: (file: { path: string; name: string; type: string }, note: string) => void;
  onDecide: (verdict: "approved" | "changes", note: string) => void;
}) {
  const [note, setNote] = useState("");
  const [verdictNote, setVerdictNote] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const subs = task.submissions ?? [];

  return (
    <div className="card__section stack stack--tight">
      <span className="label">Finished work</span>
      {task.approval && (
        <div className="approval" data-state={task.approval}>
          {task.approval === "requested" && (who === "osman" ? "Saadan is waiting for your call on this." : "Waiting for Osman to look at it.")}
          {task.approval === "approved" && "Osman signed this off."}
          {task.approval === "changes" && (who === "osman" ? "You asked for changes." : "Osman asked for changes. See the comments below.")}
        </div>
      )}
      {subs.length === 0 && <p className="small muted">{who === "saadan" ? "Nothing handed in yet." : "Nothing handed in yet."}</p>}
      {subs.map((s) => (
        <FileRow key={s.id} name={s.name} path={s.path} type={s.type ?? ""} note={`${nameOf(s.by)} · ${whenLabel(s.at)}${s.note ? ` · ${s.note}` : ""}`} />
      ))}

      {who === "saadan" && !showUpload && (
        <div className="row">
          <button type="button" className="btn btn--sm btn--primary" onClick={() => setShowUpload(true)}>
            Hand in work
          </button>
          {subs.length > 0 && task.approval !== "requested" && task.approval !== "approved" && (
            <button type="button" className="btn btn--sm btn--yellow" onClick={() => patchTask(task.id, { approval: "requested" })}>
              Ask Osman to approve
            </button>
          )}
        </div>
      )}
      {who === "saadan" && showUpload && (
        <div className="stack stack--tight g g--strong" style={{ padding: 14 }}>
          <input className="field" placeholder="A line for Osman: what this is, what to look at" value={note} onChange={(e) => setNote(e.target.value)} />
          <Upload
            onDone={(u) => {
              onHandIn(u, note);
              setNote("");
              setShowUpload(false);
            }}
          />
          <button type="button" className="btn btn--sm btn--quiet" onClick={() => setShowUpload(false)}>
            Cancel
          </button>
        </div>
      )}

      {who === "osman" && task.approval === "requested" && (
        <div className="stack stack--tight g g--yellow" style={{ padding: 14 }}>
          <input className="field" placeholder="A note for Saadan (optional)" value={verdictNote} onChange={(e) => setVerdictNote(e.target.value)} />
          <div className="row">
            <button type="button" className="btn btn--primary" onClick={() => onDecide("approved", verdictNote)}>
              Approve
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => onDecide("changes", verdictNote)}>
              Ask for changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function Thread({ comments, who, onPost, label = "Comments" }: { comments: Comment[]; who: Persona; onPost: (text: string) => void; label?: string }) {
  const [draft, setDraft] = useState("");
  return (
    <div className="card__section stack stack--tight">
      <span className="label">{label}</span>
      {comments.length === 0 && <p className="small muted">No comments yet.</p>}
      {comments.map((c, i) => (
        <div key={i} className="comment" data-by={c.by}>
          <Avatar who={c.by} />
          <div className="comment__bubble">
            <p className="comment__meta">
              {nameOf(c.by)} · {whenLabel(c.at)}
            </p>
            <p style={{ whiteSpace: "pre-wrap" }}>{c.text}</p>
          </div>
        </div>
      ))}
      <form
        className="row row--nowrap"
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.trim()) return;
          onPost(draft.trim());
          setDraft("");
        }}
      >
        <Avatar who={who} />
        <input className="field grow" placeholder={`Write as ${nameOf(who)}`} value={draft} onChange={(e) => setDraft(e.target.value)} aria-label="New comment" />
        <button type="submit" className="btn btn--sm btn--primary" disabled={!draft.trim()}>
          Post
        </button>
      </form>
    </div>
  );
}
