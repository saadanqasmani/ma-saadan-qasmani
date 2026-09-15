"use client";

import { useState } from "react";
import { AWARDABLE, LEVELS, awaitingOsman, daysUntil, dueLabel, hoursBetween, levelFor, newId, pct, streakOf, todayISO, totalXp, weekStart, xpOf, type Awarded } from "@/lib/ops/model";
import { patchMeta, useOps } from "@/lib/ops/store";
import { asksFor } from "./Asks";
import { WeekStrip } from "./Attendance";
import { nextUp, proposalsFor } from "./Diary";
import { WhatHeIsOn } from "./NowWorking";
import { PresenceOf } from "./Presence";
import { sortForBoard } from "./Board";
import { TaskCard } from "./TaskCard";
import { Confirm, Empty, useCelebrate, whenLabel } from "./ui";

/**
 * Osman's side of the desk: results, not mechanics.
 *
 * What is on the agenda, how far along each thing is, whether Saadan has
 * been in, and what is waiting on him. Three taps deep at most.
 */
export function Overview({ onGo, onNew }: { onGo: (tab: string, focus?: string) => void; onNew: () => void }) {
  const { state } = useOps();
  const open = state.tasks.filter((t) => pct(t) < 100);
  const overall = state.tasks.length ? Math.round(state.tasks.reduce((n, t) => n + pct(t), 0) / state.tasks.length) : 0;
  const ws = weekStart(new Date());
  const we = new Date(ws);
  we.setDate(we.getDate() + 6);
  const weekHours = hoursBetween(state.attendance, todayISO(ws), todayISO(we));
  const weekDays = Object.keys(state.attendance).filter((k) => k >= todayISO(ws) && k <= todayISO(we) && ["campus", "remote"].includes(state.attendance[k].status)).length;
  const today = state.attendance[todayISO()];
  const waiting = awaitingOsman(state);
  const late = open.filter((t) => (daysUntil(t.due) ?? 1) < 0);
  const agenda = sortForBoard(open).slice(0, 6);
  const xp = totalXp(state);
  const recent = state.tasks
    .flatMap((t) => (t.submissions ?? []).map((s) => ({ ...s, task: t })))
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 4);

  return (
    <div className="stack">
      {waiting.length > 0 && (
        <button type="button" className="g g--yellow g--pop row row--between" style={{ width: "100%", textAlign: "left", cursor: "pointer", border: 0 }} onClick={() => onGo("approvals")}>
          <div>
            <span className="label" style={{ color: "#7a5c00" }}>
              Waiting on you
            </span>
            <p className="h2">
              {waiting.length} piece{waiting.length === 1 ? "" : "s"} of work to look at
            </p>
          </div>
          <span className="btn btn--sm" style={{ pointerEvents: "none" }}>
            Open
          </span>
        </button>
      )}

      <div className="grid grid--2">
        <WhatHeIsOn onGo={onGo} />
        <div className="stack">
          <PresenceOf who="saadan" />
          <NextInDiary onGo={onGo} />
        </div>
      </div>

      <WaitingOnYou onGo={onGo} />

      <div className="grid grid--stats stagger">
        <div className="g stat">
          <div className="stat__n">{overall}%</div>
          <div className="stat__l">of the term board done</div>
        </div>
        <div className="g stat">
          <div className="stat__n">{open.length}</div>
          <div className="stat__l">open · {late.length} late</div>
        </div>
        <div className="g stat">
          <div className="stat__n">{weekDays}</div>
          <div className="stat__l">days in this week · {weekHours}h</div>
        </div>
        <div className="g stat">
          <div className="stat__n">{streakOf(state.meta)}</div>
          <div className="stat__l">day streak · level {levelFor(xp) + 1}</div>
        </div>
      </div>

      <div className="grid grid--2">
        <div className="g stack">
          <div className="row row--between">
            <h2 className="h2">Agenda</h2>
            <button type="button" className="btn btn--sm btn--ghost" onClick={() => onGo("board")}>
              Whole board
            </button>
          </div>
          {agenda.length === 0 && <p className="hint">Nothing open. Give Saadan something to do.</p>}
          <ul className="stack stack--tight">
            {agenda.map((t) => {
              const d = dueLabel(t);
              return (
                <li key={t.id}>
                  <button type="button" className="notice" onClick={() => onGo("board", t.id)}>
                    <span className="notice__dot" style={{ background: t.segment === "academic" ? "var(--blue)" : "var(--yellow)" }} />
                    <span className="grow" style={{ minWidth: 0 }}>
                      <span className="notice__t" style={{ display: "block" }}>
                        {t.title}
                      </span>
                      <span className="notice__b">
                        {d.txt ? `${d.txt} · ` : ""}
                        {pct(t)}%{t.approval === "requested" ? " · waiting on you" : ""}
                      </span>
                    </span>
                    <span className={`chip${d.cls ? ` chip--${d.cls}` : ""}`}>{pct(t)}%</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <button type="button" className="btn btn--primary" onClick={onNew}>
            + Give Saadan a task
          </button>
        </div>

        <div className="stack">
          <div className="g stack">
            <div className="row row--between">
              <h2 className="h2">Attendance</h2>
              <span className={`chip ${today?.checkInAt ? "chip--ok" : ""}`}>{today?.checkInAt ? `In today · ${today.status}` : "Not in yet today"}</span>
            </div>
            <WeekStrip />
            <button type="button" className="btn btn--sm btn--ghost" onClick={() => onGo("attendance")}>
              Full record
            </button>
          </div>
          <div className="g stack">
            <h2 className="h2">Recently handed in</h2>
            {recent.length === 0 && <p className="hint">Nothing yet.</p>}
            <ul className="stack stack--tight">
              {recent.map((s) => (
                <li key={s.id}>
                  <button type="button" className="notice" onClick={() => onGo(s.task.approval === "requested" ? "approvals" : "board", s.task.id)}>
                    <span className="notice__dot" style={{ background: s.task.approval === "approved" ? "#28c76f" : s.task.approval === "requested" ? "var(--yellow)" : "var(--coral)" }} />
                    <span className="grow" style={{ minWidth: 0 }}>
                      <span className="notice__t" style={{ display: "block" }}>
                        {s.name}
                      </span>
                      <span className="notice__b">
                        {s.task.title} · {whenLabel(s.at)}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <ProgressReport />
    </div>
  );
}

function ProgressReport() {
  const { state } = useOps();
  const groups: { label: string; tasks: typeof state.tasks }[] = [
    { label: "Academic", tasks: state.tasks.filter((t) => t.segment === "academic") },
    { label: "Admin", tasks: state.tasks.filter((t) => t.segment === "administrative") },
  ];
  return (
    <div className="g stack">
      <h2 className="h2">Progress report</h2>
      {groups.map((g) => (
        <div key={g.label} className="stack stack--tight">
          <span className="label">
            {g.label} · {g.tasks.filter((t) => pct(t) === 100).length} of {g.tasks.length} done
          </span>
          {g.tasks.map((t) => {
            const d = dueLabel(t);
            return (
              <div key={t.id} className="row" style={{ gap: 12 }}>
                <span className="grow small" style={{ minWidth: 160, textDecoration: pct(t) === 100 ? "line-through" : undefined, color: pct(t) === 100 ? "var(--ink-faint)" : undefined }}>
                  {t.title}
                </span>
                <span className={`chip${d.cls ? ` chip--${d.cls}` : ""}`} style={{ minWidth: 80, justifyContent: "center" }}>
                  {d.txt || "No date"}
                </span>
                <div className="bar" style={{ width: 140 }}>
                  <div className="bar__fill" data-done={pct(t) === 100} style={{ width: `${pct(t)}%` }} />
                </div>
                <span className="num small" style={{ width: 40, textAlign: "right" }}>
                  {pct(t)}%
                </span>
              </div>
            );
          })}
          {g.tasks.length === 0 && <p className="hint">Nothing in this segment.</p>}
        </div>
      ))}
      <p className="hint">
        Level: {LEVELS[levelFor(totalXp(state))].name}. Each task is worth its XP times how far along it is.
      </p>
    </div>
  );
}

export function Approvals({ focusId }: { focusId?: string | null }) {
  const { state } = useOps();
  const waiting = awaitingOsman(state);
  const decided = state.tasks.filter((t) => t.approval === "approved" || t.approval === "changes");
  return (
    <div className="stack">
      {waiting.length === 0 ? (
        <Empty title="Nothing waiting on you" body="When Saadan hands work in, it shows up here with Approve and Ask for changes right on it." />
      ) : (
        <div className="stack stagger">
          {waiting.map((t) => (
            <TaskCard key={t.id} task={t} who="osman" simple open={focusId === t.id || waiting.length === 1} />
          ))}
        </div>
      )}
      {decided.length > 0 && (
        <div className="stack stack--tight">
          <h2 className="h2">Already looked at</h2>
          <div className="grid grid--2">
            {decided.map((t) => (
              <TaskCard key={t.id} task={t} who="osman" simple open={focusId === t.id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function AwardBadges() {
  const { state } = useOps();
  const [pick, setPick] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const { toast, burst } = useCelebrate();

  function award() {
    const def = AWARDABLE.find((a) => a.id === pick);
    if (!def) return;
    const a: Awarded = { id: newId("aw"), name: def.name, glyph: def.glyph, note: note.trim(), at: new Date().toISOString() };
    patchMeta((m) => ({ awarded: [...m.awarded, a] }));
    burst();
    toast(`${def.name} given. Saadan sees it under Wins.`, { tone: "gold" });
    setPick(null);
    setNote("");
  }

  return (
    <div className="stack">
      <div className="g g--pop stack">
        <div>
          <h2 className="h2">Give a badge</h2>
          <p className="hint">Pick one, add a line if you like, and it lands on Saadan&apos;s desk with confetti.</p>
        </div>
        <div className="grid grid--badges">
          {AWARDABLE.map((a) => (
            <button key={a.id} type="button" className="g badge" data-pick="true" data-chosen={pick === a.id} onClick={() => setPick(a.id)} style={{ cursor: "pointer" }}>
              <span className="badge__g">{a.glyph}</span>
              <span className="badge__n">{a.name}</span>
            </button>
          ))}
        </div>
        <div className="row">
          <input className="field grow" placeholder="For what? (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
          <button type="button" className="btn btn--yellow btn--big" disabled={!pick} onClick={award}>
            Award it
          </button>
        </div>
      </div>

      <div className="stack stack--tight">
        <h2 className="h2">Given so far</h2>
        {state.meta.awarded.length === 0 && <p className="hint">None yet.</p>}
        <div className="grid grid--badges stagger">
          {[...state.meta.awarded].reverse().map((a) => (
            <div key={a.id} className="g badge">
              <span className="badge__g">{a.glyph}</span>
              <span className="badge__n">{a.name}</span>
              {a.note && <span className="badge__d">“{a.note}”</span>}
              <span className="badge__d">{whenLabel(a.at)}</span>
              <Confirm label="Take back" question="Take it back?" onYes={() => patchMeta((m) => ({ awarded: m.awarded.filter((x) => x.id !== a.id) }))} className="btn btn--sm btn--quiet" />
            </div>
          ))}
        </div>
      </div>

      <div className="g stack stack--tight">
        <h2 className="h2">Earned on his own</h2>
        <p className="hint">
          {state.meta.badges.length} of the automatic badges so far. Total XP {totalXp(state)}; the biggest single task is worth {Math.max(0, ...state.tasks.map((t) => xpOf(t)))}.
        </p>
      </div>
    </div>
  );
}

/** Questions and meeting proposals sitting on Osman. */
function WaitingOnYou({ onGo }: { onGo: (tab: string) => void }) {
  const { state } = useOps();
  const questions = asksFor(state.asks, "osman");
  const proposals = proposalsFor(state.appointments, "osman");
  if (questions === 0 && proposals === 0) return null;

  return (
    <div className="row" style={{ gap: 10 }}>
      {questions > 0 && (
        <button type="button" className="btn btn--yellow" onClick={() => onGo("asks")}>
          {questions} question{questions === 1 ? "" : "s"} for you
        </button>
      )}
      {proposals > 0 && (
        <button type="button" className="btn btn--primary" onClick={() => onGo("diary")}>
          {proposals} meeting{proposals === 1 ? "" : "s"} to confirm
        </button>
      )}
    </div>
  );
}

function NextInDiary({ onGo }: { onGo: (tab: string) => void }) {
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
        {next.status === "proposed" ? " · not confirmed" : ""}
      </p>
    </button>
  );
}
