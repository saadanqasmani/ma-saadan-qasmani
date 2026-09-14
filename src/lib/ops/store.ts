"use client";

import { useSyncExternalStore } from "react";
import {
  EMPTY_META,
  SEED,
  todayISO,
  type Attendance,
  type Material,
  type Meeting,
  type Meta,
  type OpsState,
  type Persona,
  type Task,
} from "./model";

/**
 * The workroom's state, held once for the whole page.
 *
 * Reads come from /api/ops on first paint. Every edit lands in memory at
 * once, so the screen never waits on the network, and is written back one
 * document at a time a moment later. Two people editing two different tasks
 * never touch each other's rows.
 *
 * When there is no database behind the API (a preview, a laptop without the
 * keys) everything still works, on this device only, and the page says so.
 */

type Collection = "tasks" | "meetings" | "attendance" | "meta" | "materials";

export type Shell = {
  ready: boolean;
  live: boolean;
  /** Writes in flight. Zero means everything on screen is on the server. */
  saving: number;
  error: string | null;
  state: OpsState;
};

const LOCAL_KEY = "ops-local-v1";
const PERSONA_KEY = "ops-persona";

function empty(): OpsState {
  return { tasks: [], meetings: [], attendance: {}, meta: { ...EMPTY_META }, materials: [] };
}

const SERVER_SHELL: Shell = { ready: false, live: false, saving: 0, error: null, state: empty() };
let shell: Shell = { ...SERVER_SHELL, state: empty() };

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}
function set(patch: Partial<Shell>) {
  shell = { ...shell, ...patch };
  emit();
}
function setState(state: OpsState) {
  set({ state });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useOps(): Shell {
  return useSyncExternalStore(subscribe, () => shell, () => SERVER_SHELL);
}

/* ---- loading ---------------------------------------------------------- */

function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => (a.order || 0) - (b.order || 0) || a.title.localeCompare(b.title));
}

function fromDocs(docs: Record<string, Record<string, unknown>>): OpsState {
  const meta = (docs.meta?.main as Meta | undefined) ?? { ...EMPTY_META };
  return {
    tasks: sortTasks(Object.values(docs.tasks ?? {}) as Task[]),
    meetings: (Object.values(docs.meetings ?? {}) as Meeting[]).sort((a, b) => b.date.localeCompare(a.date)),
    attendance: (docs.attendance ?? {}) as Record<string, Attendance>,
    meta: { ...EMPTY_META, ...meta, awarded: meta.awarded ?? [] },
    materials: (Object.values(docs.materials ?? {}) as Material[]).sort((a, b) => b.at.localeCompare(a.at)),
  };
}

function readLocal(): OpsState | null {
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<OpsState>;
    return {
      ...empty(),
      ...parsed,
      meta: { ...EMPTY_META, ...(parsed.meta ?? {}) },
      materials: parsed.materials ?? [],
    };
  } catch {
    return null;
  }
}

function writeLocal(state: OpsState) {
  try {
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
  } catch {
    // Nothing to remember it with. The page still works for this visit.
  }
}

let loading: Promise<void> | null = null;

/** Called once from the page. Safe to call again; it does nothing. */
export function ensureLoaded(): Promise<void> {
  if (!loading) loading = load();
  return loading;
}

async function load() {
  try {
    const res = await fetch("/api/ops", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = (await res.json()) as { live: boolean; docs: Record<string, Record<string, unknown>> };
    if (!json.live) throw new Error("no database");
    const state = fromDocs(json.docs);
    set({ ready: true, live: true, state });
    // A fresh database: put the term's board on it so the first visit is
    // not an empty room.
    if (state.tasks.length === 0 && !json.docs.meta) {
      SEED.forEach((t) => upsertTask({ ...t }));
    }
  } catch {
    const local = readLocal();
    const state = local ?? { ...empty(), tasks: SEED.map((t) => ({ ...t })) };
    set({ ready: true, live: false, state });
    if (!local) writeLocal(state);
  }
}

/* ---- writing ----------------------------------------------------------- */

const timers = new Map<string, ReturnType<typeof setTimeout>>();
const queued = new Map<string, { collection: Collection; id: string; data: unknown | null }>();

function persist(collection: Collection, id: string, data: unknown | null) {
  writeLocal(shell.state);
  if (!shell.live) return;
  const key = `${collection}/${id}`;
  queued.set(key, { collection, id, data });
  const existing = timers.get(key);
  if (existing) clearTimeout(existing);
  timers.set(
    key,
    setTimeout(() => {
      timers.delete(key);
      void push(key);
    }, 450),
  );
}

async function push(key: string, keepalive = false) {
  const job = queued.get(key);
  if (!job) return;
  queued.delete(key);
  set({ saving: shell.saving + 1 });
  try {
    const res = await fetch("/api/ops", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(job),
      keepalive,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    set({ saving: shell.saving - 1, error: null });
  } catch {
    set({ saving: shell.saving - 1, error: "Could not save. Check the connection and try again." });
    // Put it back so the next edit, or the next flush, carries it.
    if (!queued.has(key)) queued.set(key, job);
  }
}

/** Send everything waiting right now. Called when the tab goes away. */
export function flush() {
  for (const [key, timer] of timers) {
    clearTimeout(timer);
    timers.delete(key);
    void push(key, true);
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });
  window.addEventListener("pagehide", flush);
}

/* ---- mutations ----------------------------------------------------------- */

export function upsertTask(task: Task) {
  const has = shell.state.tasks.some((t) => t.id === task.id);
  const tasks = has ? shell.state.tasks.map((t) => (t.id === task.id ? task : t)) : [...shell.state.tasks, task];
  setState({ ...shell.state, tasks: sortTasks(tasks) });
  persist("tasks", task.id, task);
}

export function patchTask(id: string, patch: Partial<Task> | ((t: Task) => Partial<Task>)) {
  const current = shell.state.tasks.find((t) => t.id === id);
  if (!current) return;
  const next = { ...current, ...(typeof patch === "function" ? patch(current) : patch) };
  upsertTask(next);
}

export function removeTask(id: string) {
  setState({ ...shell.state, tasks: shell.state.tasks.filter((t) => t.id !== id) });
  persist("tasks", id, null);
}

export function upsertMeeting(meeting: Meeting) {
  const has = shell.state.meetings.some((m) => m.id === meeting.id);
  const meetings = has
    ? shell.state.meetings.map((m) => (m.id === meeting.id ? meeting : m))
    : [meeting, ...shell.state.meetings];
  setState({ ...shell.state, meetings: meetings.sort((a, b) => b.date.localeCompare(a.date)) });
  persist("meetings", meeting.id, meeting);
}

export function removeMeeting(id: string) {
  setState({ ...shell.state, meetings: shell.state.meetings.filter((m) => m.id !== id) });
  persist("meetings", id, null);
}

export function setAttendance(date: string, att: Attendance | null) {
  const attendance = { ...shell.state.attendance };
  if (att) attendance[date] = att;
  else delete attendance[date];
  setState({ ...shell.state, attendance });
  persist("attendance", date, att);
}

export function patchMeta(patch: Partial<Meta> | ((m: Meta) => Partial<Meta>)) {
  const meta = { ...shell.state.meta, ...(typeof patch === "function" ? patch(shell.state.meta) : patch) };
  setState({ ...shell.state, meta });
  persist("meta", "main", meta);
}

/** Something got done today. Counts toward the streak and the day's XP. */
export function addXp(amount: number) {
  const day = todayISO();
  patchMeta((m) => ({
    days: m.days.includes(day) ? m.days : [...m.days, day],
    xpByDay: { ...m.xpByDay, [day]: (m.xpByDay[day] || 0) + amount },
  }));
}

export function upsertMaterial(material: Material) {
  const has = shell.state.materials.some((m) => m.id === material.id);
  const materials = has
    ? shell.state.materials.map((m) => (m.id === material.id ? material : m))
    : [material, ...shell.state.materials];
  setState({ ...shell.state, materials });
  persist("materials", material.id, material);
}

export function removeMaterial(id: string) {
  setState({ ...shell.state, materials: shell.state.materials.filter((m) => m.id !== id) });
  persist("materials", id, null);
}

/* ---- who is at the desk ---------------------------------------------- */

const personaListeners = new Set<() => void>();
let personaCache: Persona | null | undefined;

function readPersona(): Persona | null {
  if (typeof window === "undefined") return null;
  if (personaCache !== undefined) return personaCache;
  try {
    const v = window.localStorage.getItem(PERSONA_KEY);
    personaCache = v === "saadan" || v === "osman" ? v : null;
  } catch {
    personaCache = null;
  }
  return personaCache;
}

export function setPersona(p: Persona | null) {
  personaCache = p;
  try {
    if (p) window.localStorage.setItem(PERSONA_KEY, p);
    else window.localStorage.removeItem(PERSONA_KEY);
  } catch {
    // Kept for this visit only.
  }
  personaListeners.forEach((l) => l());
}

export function usePersona(): Persona | null {
  return useSyncExternalStore(
    (l) => {
      personaListeners.add(l);
      return () => {
        personaListeners.delete(l);
      };
    },
    readPersona,
    () => null,
  );
}
