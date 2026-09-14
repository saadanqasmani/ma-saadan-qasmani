"use client";

import { useState } from "react";
import { daysUntil, pct, type Persona, type Task } from "@/lib/ops/model";
import { useOps } from "@/lib/ops/store";
import { TaskCard } from "./TaskCard";
import { Empty, Seg } from "./ui";

type Filter = "open" | "academic" | "administrative" | "done" | "all";

/**
 * Open tasks first, nearest due first, done ones at the bottom.
 * The default filter is everything, so a task you just finished slides to
 * the bottom of the board rather than vanishing from under your hands.
 */
export function sortForBoard(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    const da = pct(a) === 100 ? 1 : 0;
    const db = pct(b) === 100 ? 1 : 0;
    if (da !== db) return da - db;
    const na = daysUntil(a.due);
    const nb = daysUntil(b.due);
    if (na === null && nb === null) return (a.order || 0) - (b.order || 0);
    if (na === null) return 1;
    if (nb === null) return -1;
    return na - nb;
  });
}

export function Board({ who, simple = false, focusId, onNew }: { who: Persona; simple?: boolean; focusId?: string | null; onNew: () => void }) {
  const { state } = useOps();
  const [filter, setFilter] = useState<Filter>("all");
  const tasks = sortForBoard(state.tasks).filter((t) => {
    if (filter === "all") return true;
    if (filter === "open") return pct(t) < 100;
    if (filter === "done") return pct(t) === 100;
    return t.segment === filter;
  });
  const open = state.tasks.filter((t) => pct(t) < 100).length;
  const done = state.tasks.length - open;

  return (
    <div className="stack">
      <div className="row row--between">
        <Seg<Filter>
          ariaLabel="Filter"
          value={filter}
          onChange={setFilter}
          options={[
            { id: "all", label: `All · ${state.tasks.length}` },
            { id: "academic", label: "Academic", tone: "blue" },
            { id: "administrative", label: "Admin", tone: "yellow" },
            { id: "open", label: `Open · ${open}` },
            { id: "done", label: `Done · ${done}` },
          ]}
        />
        <button type="button" className="btn btn--primary" onClick={onNew}>
          + {who === "osman" ? "Task for Saadan" : "New task"}
        </button>
      </div>
      {tasks.length === 0 ? (
        <Empty title={filter === "done" ? "Nothing finished yet" : "Nothing here"} body={filter === "open" ? "Every task is done. Add the next one." : undefined}>
          <button type="button" className="btn btn--yellow" onClick={onNew}>
            Add a task
          </button>
        </Empty>
      ) : (
        <div className="grid grid--2 stagger">
          {tasks.map((t) => (
            <TaskCard key={t.id} task={t} who={who} simple={simple} open={focusId === t.id} />
          ))}
        </div>
      )}
    </div>
  );
}
