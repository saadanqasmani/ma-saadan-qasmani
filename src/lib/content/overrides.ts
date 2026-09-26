import "server-only";
import { getAdminClient } from "@/lib/supabase/admin";
import { sharedLocale } from "@/lib/i18n/config";

/**
 * The words the site is showing, where they differ from the words in the
 * repository.
 *
 * Everything the site says lives in src/content, which is the right home:
 * versioned, reviewed, deployed. The cost is that changing a line means a
 * deploy, and the person whose words they are cannot change his own. So the
 * files stay exactly as they are and this is merged on top of them.
 *
 * An empty table changes nothing. Deleting a row restores what the file
 * says. Nothing here is load-bearing, which is the point: if the database
 * is unreachable the site still reads correctly, in English and in every
 * translation, because the files were always the floor.
 */

export type Flat = Record<string, string>;

/** The locale of a value that is the same in every language: an image. */
export const SHARED = sharedLocale;

/**
 * One row per string. A path is its way through the dictionary.
 *
 * Two layers come back merged: the rows filed under `*`, which are the
 * things that do not change between languages — a photograph is a
 * photograph in Urdu — and the rows written for this language, which win.
 */
export async function overridesFor(locale: string): Promise<Flat> {
  const db = getAdminClient();
  if (!db) return {};
  const { data, error } = await db
    .from("site_text")
    .select("path, value, locale")
    .in("locale", [SHARED, locale]);
  if (error) {
    // A missing table is the ordinary state before the migration is run, and
    // the site is meant to work without it, so this is a note not a failure.
    console.error(`[site text] no overrides for ${locale}: ${error.message}`);
    return {};
  }
  const shared: Flat = {};
  const own: Flat = {};
  for (const row of data ?? []) {
    const into = row.locale === SHARED ? shared : own;
    into[row.path as string] = row.value as string;
  }
  return { ...shared, ...own };
}

/**
 * Put the edited strings into a copy of the tree they came from.
 *
 * It walks only into keys that already exist, so an edit can change a
 * string the site has and cannot invent one it does not. That is the safety
 * property worth having: a stale path left behind by a rename is ignored
 * rather than growing a dead branch on the record.
 *
 * Array indices work without a special case, because walking into `2` on an
 * array is the same operation as walking into a key on an object, which is
 * how one paragraph of the synopsis is edited without touching the rest.
 */
export function applyFlat<T>(base: T, flat: Flat): T {
  const paths = Object.entries(flat).filter(([, v]) => v);
  if (paths.length === 0) return base;

  const out = structuredClone(base) as unknown as Record<string, unknown>;
  for (const [path, value] of paths) {
    const parts = path.split(".");
    let at: unknown = out;
    for (let i = 0; i < parts.length - 1; i++) {
      if (at === null || typeof at !== "object") { at = undefined; break; }
      at = (at as Record<string, unknown>)[parts[i]];
    }
    if (at === null || typeof at !== "object") continue;
    const last = parts[parts.length - 1];
    const holder = at as Record<string, unknown>;
    // Strings and empty slots only. A path that happens to name a number — a
    // price, a word count — would otherwise be replaced by text, and the
    // arithmetic downstream would quietly turn into string concatenation. A
    // null is a slot the files declare and leave empty, which is exactly the
    // thing a photograph or a missing link is waiting to be dropped into.
    const held = holder[last];
    if (typeof held !== "string" && held !== null) continue;
    holder[last] = value;
  }
  return out as unknown as T;
}

/** Split a flat set by its first segment: "book.x" from everything else. */
export function under(flat: Flat, prefix: string): Flat {
  const out: Flat = {};
  const head = `${prefix}.`;
  for (const [k, v] of Object.entries(flat)) {
    if (k.startsWith(head)) out[k.slice(head.length)] = v;
  }
  return out;
}

/** Everything not under any of those prefixes. */
export function outside(flat: Flat, prefixes: string[]): Flat {
  const out: Flat = {};
  for (const [k, v] of Object.entries(flat)) {
    if (!prefixes.some((p) => k.startsWith(`${p}.`))) out[k] = v;
  }
  return out;
}

/** Turn "a.b.c" keys back into the shape the dictionary has. */
export function nest(flat: Flat): Record<string, unknown> {
  const root: Record<string, unknown> = {};
  for (const [path, value] of Object.entries(flat)) {
    if (!value) continue;
    const parts = path.split(".");
    let at = root;
    for (let i = 0; i < parts.length - 1; i++) {
      const key = parts[i];
      if (typeof at[key] !== "object" || at[key] === null) at[key] = {};
      at = at[key] as Record<string, unknown>;
    }
    at[parts[parts.length - 1]] = value;
  }
  return root;
}

/**
 * Every string in a tree, by its path. Arrays are addressed by index, so one
 * paragraph of the synopsis is `synopsisParagraphs.2` and can be edited on
 * its own without rewriting the rest.
 *
 * With `blanks`, a declared-but-empty slot comes through as an empty string
 * rather than being skipped, which is how the dashboard can show a picture
 * frame that has no picture in it yet.
 */
export function flatten(value: unknown, prefix = "", out: Flat = {}, blanks = false): Flat {
  if (typeof value === "string") {
    out[prefix] = value;
    return out;
  }
  if (value === null) {
    if (blanks) out[prefix] = "";
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach((v, i) => flatten(v, prefix ? `${prefix}.${i}` : String(i), out, blanks));
    return out;
  }
  if (typeof value === "object") {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      flatten(v, prefix ? `${prefix}.${k}` : k, out, blanks);
    }
  }
  return out;
}
