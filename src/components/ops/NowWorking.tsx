"use client";

import { useState } from "react";
import { PRIORITIES, dueLabel, pct, type Persona, type Priority, type Task } from "@/lib/ops/model";
import { patchMeta, patchTask, useOps } from "@/lib/ops/store";
import { sortForBoard } from "./Board";
import { Empty, Seg, nameOf, useCelebrate } from "./ui";

/**
 * What is being worked on this minute, and what Osman thinks of that.
 *
 * A board says what exists. It does not say which one of them a person has
 * open right now, which is the only thing a manager actually wants to know
 * and the only thing a worker resents being asked for every hour. Saying it
 * once, on the page, answers it for good.
 *
 * Osman's side of this is deliberately narrow: he can order the work, lean
 * on one thing, or name what comes next. All three are written down and
 * dated, because direction given in passing is direction nobody can check.
 */

function sinceLabel(since: string): string {
  const mins = Math.round((Date.now() - new Date(since).getTime()) / 60000);
  if (!Number.isFinite(mins) || mins < 1) return "just started";
  if (mins < 60) return `${mins} min so far`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m so far`;
}

/** Saadan's control: pick the one thing, or clear it. */
export function WorkingNow({ onGo }: { onGo: (tab: string, focus?: string) => void }) {
  const { state } = useOps();
  const [picking, setPicking] = useState(false);
  const { toast } = useCelebrate();

  const working = state.meta.working;
  const task = working ? state.tasks.find((t) => t.id === working.taskId) : null;
  const open = sortForBoard(state.tasks.filter((t) => pct(t) < 100));

  function start(id: string) {
    patchMeta(() => ({ working: { taskId: id, since: new Date().toISOString() } }));
    setPicking(false);
    toast("Osman can see what you are on.", { tone: "blue" });
  }

  function stop() {
    patchMeta(() => ({ working: null }));
    toast("Cleared.");
  }

  if (!task || picking) {
    return (
      <section className="g g--blue stack">
        <span className="label">What are you on right now?</span>
        {open.length === 0 ? (
          <p className="hint">Nothing open to pick.</p>
        ) : (
          <div className="stack stack--tight">
            {open.slice(0, 6).map((t) => (
              <button key={t.id} type="button" className="notice" onClick={() => start(t.id)}>
                <span className="notice__dot" style={{ background: "var(--blue)" }} />
                <span className="grow" style={{ minWidth: 0 }}>
                  <span className="notice__t" style={{ display: "block" }}>{t.title}</span>
                  <span className="notice__b">{dueLabel(t).txt || "no date"} · {pct(t)}%</span>
                </span>
              </button>
            ))}
          </div>
        )}
        {picking && (
          <button type="button" className="btn btn--sm btn--quiet" onClick={() => setPicking(false)}>
            Never mind
          </button>
        )}
      </section>
    );
  }

  return (
    <section className="g g--blue stack">
      <div className="row row--between">
        <span className="label">On it now</span>
        <span className="small muted">{sinceLabel(working!.since)}</span>
      </div>
      <button
        type="button"
        onClick={() => onGo("board", task.id)}
        style={{ background: "none", border: 0, padding: 0, textAlign: "left", cursor: "pointer", color: "inherit" }}
      >
        <p className="h2">{task.title}</p>
        <p className="small muted">{dueLabel(task).txt || "no date"} · {pct(task)}%</p>
      </button>
      <NudgeNote task={task} who="saadan" />
      <div className="row">
        <button type="button" className="btn btn--sm btn--ghost" onClick={() => setPicking(true)}>
          Switch
        </button>
        <button type="button" className="btn btn--sm btn--quiet" onClick={stop}>
          Stopped for now
        </button>
      </div>
    </section>
  );
}

/** Osman's read-only view of the same thing, with his three levers. */
export function WhatHeIsOn({ onGo }: { onGo: (tab: string, focus?: string) => void }) {
  const { state } = useOps();
  const working = state.meta.working;
  const task = working ? state.tasks.find((t) => t.id === working.taskId) : null;

  if (!task) {
    return (
      <section className="g stack stack--tight">
        <span className="label">What Saadan is on</span>
        <p className="hint">He has not said what he is working on right now.</p>
      </section>
    );
  }

  return (
    <section className="g g--blue stack">
      <div className="row row--between">
        <span className="label">Saadan is on</span>
        <span className="small muted">{sinceLabel(working!.since)}</span>
      </div>
      <button
        type="button"
        onClick={() => onGo("board", task.id)}
        style={{ background: "none", border: 0, padding: 0, textAlign: "left", cursor: "pointer", color: "inherit" }}
      >
        <p className="h2">{task.title}</p>
        <p className="small muted">{dueLabel(task).txt || "no date"} · {pct(task)}%</p>
      </button>
      <Direction task={task} />
    </section>
  );
}

/**
 * Osman's three levers, on any task.
 *
 * Priority orders the board. "Push on" and "start this next" are messages,
 * written down and dated, so neither of them has to remember who said what
 * on a Tuesday.
 */
export function Direction({ task }: { task: Task }) {
  const [note, setNote] = useState("");
  const { toast } = useCelebrate();

  function setPriority(priority: Priority) {
    patchTask(task.id, { priority });
    toast(`Marked ${priority}.`, { tone: priority === "urgent" ? "gold" : "blue" });
  }

  function nudge(kind: "faster" | "start-next") {
    patchTask(task.id, {
      nudge: { kind, by: "osman", at: new Date().toISOString(), note: note.trim() },
    });
    setNote("");
    toast(kind === "faster" ? "Asked him to push on." : "Told him to start this next.", { tone: "gold" });
  }

  return (
    <div className="stack stack--tight">
      <span className="label">Your call</span>
      <Seg<Priority>
        ariaLabel="Priority"
        value={task.priority ?? "normal"}
        onChange={setPriority}
        options={PRIORITIES.map((p) => ({
          id: p.id,
          label: p.label,
          tone: p.id === "urgent" ? ("coral" as const) : p.id === "high" ? ("yellow" as const) : undefined,
        }))}
      />
      <input
        className="field"
        placeholder="A line to go with it (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <div className="row">
        <button type="button" className="btn btn--sm btn--yellow" onClick={() => nudge("faster")}>
          Push on with this
        </button>
        <button type="button" className="btn btn--sm btn--primary" onClick={() => nudge("start-next")}>
          Start this next
        </button>
        {task.nudge && (
          <button type="button" className="btn btn--sm btn--quiet" onClick={() => patchTask(task.id, { nudge: null })}>
            Clear
          </button>
        )}
      </div>
      <NudgeNote task={task} who="osman" />
    </div>
  );
}

/** What Osman said about this task, shown on both sides. */
export function NudgeNote({ task, who }: { task: Task; who: Persona }) {
  const n = task.nudge;
  if (!n) return null;
  const said =
    n.kind === "faster"
      ? who === "osman"
        ? "You asked him to push on with this"
        : `${nameOf(n.by)} asked you to push on with this`
      : who === "osman"
        ? "You told him to start this next"
        : `${nameOf(n.by)} wants this started next`;

  return (
    <div className="approval" data-state="requested">
      <span>
        {said}
        {n.note ? `: ${n.note}` : "."}
      </span>
    </div>
  );
}

/** Anything Osman has leaned on that is not finished. For Saadan's list. */
export function nudged(tasks: Task[]): Task[] {
  return tasks.filter((t) => t.nudge && pct(t) < 100);
}

export function EmptyDirection() {
  return <Empty title="Nothing to direct" body="Add a task and it can be prioritised." />;
}
