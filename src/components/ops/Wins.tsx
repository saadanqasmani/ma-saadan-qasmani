"use client";

import { BADGES, LEVELS, isFreshAward, levelFor, pct, streakOf, totalXp, workDays } from "@/lib/ops/model";
import { useOps } from "@/lib/ops/store";
import { whenLabel } from "./ui";

/** Everything earned, and everything Osman handed over by choice. */
export function WinsView() {
  const { state } = useOps();
  const xp = totalXp(state);
  const lvl = levelFor(xp);
  const next = LEVELS[lvl + 1];
  const into = xp - LEVELS[lvl].at;
  const span = next ? next.at - LEVELS[lvl].at : 1;
  const done = state.tasks.filter((t) => pct(t) === 100).length;
  const earned = new Set(state.meta.badges);

  return (
    <div className="stack">
      <div className="g g--yellow g--pop g--pad-lg stack">
        <div className="row row--between">
          <div>
            <span className="label">Level {lvl + 1}</span>
            <h2 className="h1">{LEVELS[lvl].name}</h2>
          </div>
          <div style={{ textAlign: "right" }}>
            <span className="stat__n">{xp}</span>
            <div className="stat__l">XP</div>
          </div>
        </div>
        <div className="xp">
          <div className="xp__bar" style={{ height: 16 }}>
            <div className="xp__fill" style={{ width: `${next ? Math.min(100, (into / span) * 100) : 100}%` }} />
          </div>
          <span className="xp__txt">{next ? `${next.at - xp} XP to ${next.name}` : "Top of the ladder"}</span>
        </div>
      </div>

      <div className="grid grid--stats stagger">
        <div className="g stat">
          <div className="stat__n">{streakOf(state.meta)}</div>
          <div className="stat__l">day streak</div>
        </div>
        <div className="g stat">
          <div className="stat__n">{done}</div>
          <div className="stat__l">tasks finished</div>
        </div>
        <div className="g stat">
          <div className="stat__n">{workDays(state.attendance)}</div>
          <div className="stat__l">days at work</div>
        </div>
        <div className="g stat">
          <div className="stat__n">{state.meetings.length}</div>
          <div className="stat__l">meetings</div>
        </div>
      </div>

      <div className="stack stack--tight">
        <h2 className="h2">From Osman</h2>
        {state.meta.awarded.length === 0 ? (
          <p className="hint">Nothing yet. Osman can hand these out from his side.</p>
        ) : (
          <div className="grid grid--badges stagger">
            {[...state.meta.awarded].reverse().map((a) => (
              <div key={a.id} className="g badge">
                <span className="badge__g">{a.glyph}</span>
                <span className="badge__n">{a.name}</span>
                {a.note && <span className="badge__d">“{a.note}”</span>}
                <span className="badge__d">{whenLabel(a.at)}</span>
                {isFreshAward(a) && <span className="chip chip--new">New</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="stack stack--tight">
        <h2 className="h2">Earned</h2>
        <div className="grid grid--badges stagger">
          {BADGES.map((b) => (
            <div key={b.id} className="g badge" data-locked={!earned.has(b.id)}>
              <span className="badge__g">{b.g}</span>
              <span className="badge__n">{b.name}</span>
              <span className="badge__d">{b.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
