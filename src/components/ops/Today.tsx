"use client";

import { LEVELS, daysUntil, levelFor, notifications, pct, streakOf, todayISO, totalXp } from "@/lib/ops/model";
import { useOps } from "@/lib/ops/store";
import { sortForBoard } from "./Board";
import { TaskCard } from "./TaskCard";
import { Empty } from "./ui";

/**
 * Saadan's desk on arrival: what needs him, then what is due, then the
 * ones he can knock over today. Everything on it is a link to the place
 * where it gets done.
 */
export function Today({ onGo, onNew }: { onGo: (tab: string, focus?: string) => void; onNew: () => void }) {
  const { state } = useOps();
  const notes = notifications(state);
  const open = sortForBoard(state.tasks.filter((t) => pct(t) < 100));
  const week = open.filter((t) => {
    const n = daysUntil(t.due);
    return t.recurring || (n !== null && n <= 7);
  });
  const xp = totalXp(state);
  const todayXp = state.meta.xpByDay[todayISO()] || 0;

  return (
    <div className="stack">
      <div className="grid grid--stats stagger">
        <div className="g stat">
          <div className="stat__n">{streakOf(state.meta)}</div>
          <div className="stat__l">day streak</div>
        </div>
        <div className="g stat">
          <div className="stat__n">+{todayXp}</div>
          <div className="stat__l">XP today</div>
        </div>
        <div className="g stat">
          <div className="stat__n">{open.length}</div>
          <div className="stat__l">open tasks</div>
        </div>
        <div className="g stat">
          <div className="stat__n">{levelFor(xp) + 1}</div>
          <div className="stat__l">{LEVELS[levelFor(xp)].name}</div>
        </div>
      </div>

      <div className="grid grid--2">
        <div className="g stack">
          <h2 className="h2">Needs you</h2>
          {notes.length === 0 && <p className="hint">Nothing. Enjoy it.</p>}
          <ul className="stack stack--tight stagger">
            {notes.map((n, i) => (
              <li key={i}>
                <button type="button" className="notice" data-tone={n.tone} onClick={() => (n.id ? onGo("board", n.id) : onGo(n.go ?? "board"))}>
                  <span className="notice__dot" />
                  <span className="grow" style={{ minWidth: 0 }}>
                    <span className="notice__t" style={{ display: "block" }}>
                      {n.title}
                    </span>
                    <span className="notice__b">{n.body}</span>
                  </span>
                  <span className="chip">Go</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="g g--blue stack">
          <h2 className="h2">Quick</h2>
          <div className="row">
            <button type="button" className="btn btn--yellow" onClick={() => onGo("attendance")}>
              Check in
            </button>
            <button type="button" className="btn" onClick={onNew}>
              + New task
            </button>
            <button type="button" className="btn" onClick={() => onGo("meetings")}>
              Log a meeting
            </button>
          </div>
          <p className="hint">
            Tick a step anywhere and it counts toward the streak. Finish a task for its full XP. Osman sees all of it on his side.
          </p>
        </div>
      </div>

      <div className="stack stack--tight">
        <div className="row row--between">
          <h2 className="h2">This week</h2>
          <button type="button" className="btn btn--sm btn--ghost" onClick={() => onGo("board")}>
            Whole board
          </button>
        </div>
        {week.length === 0 ? (
          <Empty title="Nothing due this week" body="The board has the rest." />
        ) : (
          <div className="grid grid--2 stagger">
            {week.map((t) => (
              <TaskCard key={t.id} task={t} who="saadan" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
