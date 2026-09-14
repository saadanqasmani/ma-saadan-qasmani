/**
 * A value kept in the browser, read the way React wants it read.
 *
 * Reading localStorage in an effect and calling setState is the obvious way
 * and the wrong one: the server renders one thing, the client immediately
 * renders another, and React has to throw the first render away. This is the
 * shape useSyncExternalStore exists for — a snapshot the server can answer
 * with, a snapshot the client can answer with, and a subscription for when
 * it changes.
 *
 * Module-level, so every component reading the same key sees the same value
 * and one write updates all of them.
 */

type Listener = () => void;

const listeners = new Map<string, Set<Listener>>();
const cache = new Map<string, string | null>();

function read(key: string): string | null {
  if (typeof window === "undefined") return null;
  if (cache.has(key)) return cache.get(key) ?? null;
  let value: string | null = null;
  try {
    value = window.localStorage.getItem(key);
  } catch {
    // Storage blocked. Treated as empty, which every caller handles.
  }
  cache.set(key, value);
  return value;
}

export function subscribe(key: string) {
  return (listener: Listener) => {
    const set = listeners.get(key) ?? new Set<Listener>();
    set.add(listener);
    listeners.set(key, set);
    return () => set.delete(listener);
  };
}

export function snapshot(key: string) {
  return () => read(key);
}

/** The server has no browser to read, and says so rather than guessing. */
export function serverSnapshot() {
  return null;
}

export function write(key: string, value: string) {
  cache.set(key, value);
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Nothing to remember it with; the value still lives in the cache for
    // this page, so the session behaves normally.
  }
  listeners.get(key)?.forEach((l) => l());
}

/**
 * An id derived from the name rather than the clock.
 *
 * Deterministic, so adding the same university twice is impossible by
 * construction rather than by a check somebody forgets to write.
 */
export function targetId(name: string, country: string): string {
  return `${name}|${country}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
