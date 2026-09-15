"use client";

import { LEVELS, daysUntil, levelFor, notifications, pct, streakOf, todayISO, totalXp } from "@/lib/ops/model";
import { useOps } from "@/lib/ops/store";
import { sortForBoard } from "./Board";
import { nextUp } from "./Diary";
import { WorkingNow, nudged } from "./NowWorking";
import { PresenceOf } from "./Presence";
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

      <WorkingNow onGo={onGo} />

      {nudged(state.tasks).length > 0 && (
        <section className="g g--yellow stack stack--tight">
          <span className="label" style={{ color: "#7a5c00" }}>Osman has asked for something</span>
          {nudged(state.tasks).map((t) => (
            <button
              key={t.id}
              type="button"
              className="notice"
              onClick={() => onGo("board", t.id)}
              style={{ textAlign: "left" }}
            >
              <span className="grow" style={{ minWidth: 0 }}>
                <span className="notice__t" style={{ display: "block" }}>{t.title}</span>
                <span className="notice__b">
                  {t.nudge?.kind === "faster" ? "Push on with this" : "Start this next"}
                  {t.nudge?.note ? `: ${t.nudge.note}` : ""}
                </span>
              </span>
            </button>
          ))}
        </section>
      )}

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

      <div className="grid grid--2">
        <PresenceOf who="osman" />
        <NextMeeting onGo={onGo} />
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

function NextMeeting({ onGo }: { onGo: (tab: string) => void }) {
  const { state } = useOps();
  const next = nextUp(state.appointments);
  if (!next) {
    return (
      <div className="g stack stack--tight">
        <span className="label">Next meeting</span>
        <p className="hint">Nothing in the diary.</p>
        <button type="button" className="btn btn--sm btn--ghost" onClick={() => onGo("diary")}>
          Schedule one
        </button>
      </div>
    );
  }
  return (
    <button
      type="button"
      className="g stack stack--tight"
      onClick={() => onGo("diary")}
      style={{ textAlign: "left", cursor: "pointer", border: 0 }}
    >
      <span className="label">Next meeting</span>
      <p style={{ fontWeight: 600 }}>{next.title}</p>
      <p className="small muted">
        {new Date(next.at).toLocaleString(undefined, { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
        {next.where ? ` · ${next.where}` : ""}
        {next.status === "proposed" ? " · not confirmed" : ""}
      </p>
    </button>
  );
}
