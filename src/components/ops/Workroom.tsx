"use client";

import { useEffect, useState } from "react";
import { BADGES, LEVELS, awaitingOsman, levelFor, notifications, todayISO, totalXp, type Persona } from "@/lib/ops/model";
import { ensureLoaded, patchMeta, setPersona, upsertTask, useOps, usePersona } from "@/lib/ops/store";
import { Asks, asksFor } from "./Asks";
import { AttendanceView } from "./Attendance";
import { Board } from "./Board";
import { Diary, proposalsFor } from "./Diary";
import { MaterialsView } from "./Materials";
import { MeetingsView } from "./Meetings";
import { Approvals, AwardBadges, Overview } from "./OsmanViews";
import { TaskForm } from "./TaskForm";
import { Today } from "./Today";
import { PresenceChip } from "./Presence";
import { Avatar, CelebrateProvider, nameOf, useCelebrate } from "./ui";
import { WinsView } from "./Wins";

/**
 * The desk the two of them share.
 *
 * One page, one switch at the top for who is sitting at it. Saadan's side
 * has every control; Osman's side has the results and the three things he
 * does: assign, approve, award.
 */
export function Workroom() {
  return (
    <CelebrateProvider>
      <Desk />
    </CelebrateProvider>
  );
}

const SAADAN_TABS = [
  { id: "today", label: "Today" },
  { id: "board", label: "Board" },
  { id: "asks", label: "Asks" },
  { id: "diary", label: "Diary" },
  { id: "meetings", label: "Meetings" },
  { id: "attendance", label: "Attendance" },
  { id: "materials", label: "Reading" },
  { id: "wins", label: "Wins" },
];
const OSMAN_TABS = [
  { id: "overview", label: "Overview" },
  { id: "approvals", label: "Approvals" },
  { id: "asks", label: "Asks" },
  { id: "diary", label: "Diary" },
  { id: "board", label: "Board" },
  { id: "materials", label: "Reading" },
  { id: "badges", label: "Badges" },
];

function Desk() {
  const shell = useOps();
  const persona = usePersona();
  const [tab, setTab] = useState<string>("");
  const [focus, setFocus] = useState<string | null>(null);
  const [newOpen, setNewOpen] = useState(false);
  const { toast, burst } = useCelebrate();
  const { state, ready, live, saving, error, offline } = shell;

  useEffect(() => {
    void ensureLoaded();
  }, []);

  // Daily reset for the recurring ones, once the board is in.
  useEffect(() => {
    if (!ready) return;
    const day = todayISO();
    state.tasks.forEach((t) => {
      if (t.recurring && t.lastReset !== day && t.checklist.some((c) => c.done)) {
        upsertTask({ ...t, lastReset: day, checklist: t.checklist.map((c) => ({ ...c, done: false })), status: "in_progress" });
      } else if (t.recurring && t.lastReset !== day) {
        upsertTask({ ...t, lastReset: day });
      }
    });
    // Only on arrival; edits during the day must not re-run this.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  // Badges earned by the numbers, noticed the moment they are.
  useEffect(() => {
    if (!ready) return;
    const fresh = BADGES.filter((b) => !state.meta.badges.includes(b.id) && b.test(state));
    if (!fresh.length) return;
    patchMeta((m) => ({ badges: [...m.badges, ...fresh.map((b) => b.id)] }));
    if (persona === "saadan") {
      burst();
      fresh.forEach((b) => toast(`Badge: ${b.name}`, { tone: "gold" }));
    }
  }, [ready, state, persona, burst, toast]);

  useEffect(() => {
    if (error) toast(error);
  }, [error, toast]);

  if (!ready) {
    return (
      <main className="splash">
        <div className="ops-bg" aria-hidden>
          <i />
          <i />
          <i />
        </div>
        <div className="g g--pop" style={{ padding: 32 }}>
          <span className="spin" style={{ margin: "0 auto 12px" }} />
          <p className="h2">Opening the desk</p>
        </div>
      </main>
    );
  }

  if (!persona) return <Picker onPick={setPersona} />;

  const tabs = persona === "saadan" ? SAADAN_TABS : OSMAN_TABS;
  const current = tabs.some((t) => t.id === tab) ? tab : tabs[0].id;
  const xp = totalXp(state);
  const lvl = levelFor(xp);
  const next = LEVELS[lvl + 1];
  const into = xp - LEVELS[lvl].at;
  const span = next ? next.at - LEVELS[lvl].at : 1;
  const needs = persona === "saadan" ? notifications(state).length : awaitingOsman(state).length;

  function go(t: string, id?: string) {
    setTab(t);
    setFocus(id ?? null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function switchTo(p: Persona) {
    setPersona(p);
    setTab("");
    setFocus(null);
  }

  return (
    <>
      <div className="ops-bg" aria-hidden>
        <i />
        <i />
        <i />
      </div>
      <div className="ops-shell">
        <header className="g ops-top">
          <div className="ops-top__brand">
            <span className="mark">✓</span>
            <span>Consider It Done</span>
          </div>
          <div className="ops-top__mid">
            <div className="xp" title={`${xp} XP`}>
              <span className="xp__txt">Lv {lvl + 1}</span>
              <div className="xp__bar">
                <div className="xp__fill" style={{ width: `${next ? Math.min(100, (into / span) * 100) : 100}%` }} />
              </div>
              <span className="xp__txt">{LEVELS[lvl].name}</span>
            </div>
            <PresenceChip who={persona} />
            <span className="dot" data-busy={saving > 0} data-bad={!!error} title={error ?? (saving > 0 ? "Saving" : live ? "Saved" : "On this device only")} />
          </div>
          <div className="ops-top__end">
            <div className="persona" role="radiogroup" aria-label="Who is here">
              {(["saadan", "osman"] as Persona[]).map((p) => (
                <button key={p} type="button" role="radio" aria-checked={persona === p} className="persona__opt" data-on={persona === p} data-who={p} onClick={() => switchTo(p)}>
                  <Avatar who={p} />
                  <span className="persona__name">{nameOf(p)}</span>
                </button>
              ))}
            </div>
            <button type="button" className="bell" data-n={needs} onClick={() => go(persona === "saadan" ? "today" : "approvals")} aria-label={`${needs} things need you`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.7 21a2 2 0 0 1-3.4 0" />
              </svg>
            </button>
          </div>
        </header>

        {!live && (
          <p className="banner" style={{ marginBottom: 14 }}>
            <span>Saved on this device only. {offline}</span>
          </p>
        )}

        <nav className="g tabs" aria-label="Sections">
          {tabs.map((t) => {
            const n =
              t.id === "approvals"
                ? awaitingOsman(state).length
                : t.id === "today"
                  ? notifications(state).length
                  : t.id === "asks"
                    ? asksFor(state.asks, persona)
                    : t.id === "diary"
                      ? proposalsFor(state.appointments, persona)
                      : 0;
            return (
              <button key={t.id} type="button" className="tab" data-on={current === t.id} onClick={() => go(t.id)}>
                {t.label}
                {n > 0 && <span className="tab__n">{n}</span>}
              </button>
            );
          })}
        </nav>

        <section key={`${persona}-${current}`} className="stack" style={{ animation: "rise 0.4s var(--ease) both" }}>
          {persona === "saadan" && current === "today" && <Today onGo={go} onNew={() => setNewOpen(true)} />}
          {current === "board" && <Board who={persona} simple={persona === "osman"} focusId={focus} onNew={() => setNewOpen(true)} />}
          {persona === "saadan" && current === "meetings" && <MeetingsView />}
          {current === "attendance" && <AttendanceView />}
          {current === "materials" && <MaterialsView who={persona} />}
          {current === "asks" && <Asks who={persona} />}
          {current === "diary" && <Diary who={persona} />}
          {persona === "saadan" && current === "wins" && <WinsView />}
          {persona === "osman" && current === "overview" && <Overview onGo={go} onNew={() => setNewOpen(true)} />}
          {persona === "osman" && current === "approvals" && <Approvals focusId={focus} />}
          {persona === "osman" && current === "badges" && <AwardBadges />}
        </section>
      </div>

      <button type="button" className="btn btn--primary fab" onClick={() => setNewOpen(true)}>
        + {persona === "osman" ? "Task for Saadan" : "New task"}
      </button>

      <TaskForm open={newOpen} onClose={() => setNewOpen(false)} who={persona} />
    </>
  );
}

function Picker({ onPick }: { onPick: (p: Persona) => void }) {
  return (
    <main className="splash">
      <div className="ops-bg" aria-hidden>
        <i />
        <i />
        <i />
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <span className="label">Consider It Done</span>
        <h1 className="h1" style={{ marginTop: 8 }}>
          Who is at the desk?
        </h1>
        <p className="hint" style={{ marginTop: 8 }}>
          You can switch at the top any time.
        </p>
        <div className="pick">
          <button type="button" className="g g--blue g--pop pick__opt" onClick={() => onPick("saadan")}>
            <Avatar who="saadan" size="lg" />
            <span className="h2">Saadan</span>
            <span className="small muted">Tasks, meetings, attendance, hand-ins</span>
          </button>
          <button type="button" className="g g--yellow g--pop pick__opt" onClick={() => onPick("osman")} style={{ animationDelay: "0.08s" }}>
            <Avatar who="osman" size="lg" />
            <span className="h2">Osman</span>
            <span className="small muted">Progress, approvals, badges</span>
          </button>
        </div>
      </div>
    </main>
  );
}
