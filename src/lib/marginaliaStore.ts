/**
 * The found-marks set, kept in localStorage.
 *
 * Implemented as an external store rather than state-read-in-an-effect so
 * that React can subscribe to it directly: hydration stays correct (the
 * server snapshot is always empty), and two open tabs stay in sync via the
 * `storage` event.
 */

const KEY = "sq.marginalia.v1";
const EMPTY: string[] = [];

let cache: string[] = EMPTY;
let cachedRaw: string | null = null;
const listeners = new Set<() => void>();

function parse(raw: string | null): string[] {
  if (!raw) return EMPTY;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    return parsed.filter((v): v is string => typeof v === "string");
  } catch {
    return EMPTY;
  }
}

/** Must return a stable reference when nothing changed, or React will loop. */
export function getSnapshot(): string[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    // Storage blocked (private mode). Behave as if nothing was saved.
    return cache;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cache = parse(raw);
  }
  return cache;
}

export function getServerSnapshot(): string[] {
  return EMPTY;
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function write(next: string[]) {
  cache = next;
  cachedRaw = JSON.stringify(next);
  try {
    window.localStorage.setItem(KEY, cachedRaw);
  } catch {
    // Non-fatal: the set still holds for this session.
  }
  listeners.forEach((l) => l());
}

export function collectMark(id: string) {
  const current = getSnapshot();
  if (current.includes(id)) return;
  write([...current, id]);
}

export function resetMarks() {
  write([]);
}
