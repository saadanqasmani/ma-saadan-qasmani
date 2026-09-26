/**
 * The campus service standard, kept where a campus can change it.
 *
 * The pipeline has always said these numbers should be configurable rather
 * than buried in a component, and until now that was a comment rather than a
 * fact. A school that answers a student in three days and one that answers
 * in ten are both defensible; a threshold that can only be changed by a
 * deploy is a decision taken by whoever wrote the code, on behalf of people
 * they have never met.
 *
 * Kept in a cookie rather than in local storage, for one reason that
 * decides it: the advisor and campus screens are rendered on the server, and
 * a value in local storage is not there when they are. A cookie is sent with
 * the request, so the thresholds are applied when the page is built rather
 * than corrected afterwards in the browser, which would mean an advisor
 * watching the count of urgent cases change a beat after it appeared.
 *
 * Nothing here is personal data. It is a school's own definition of late.
 */

import { STANDARD, type Thresholds } from "@/lib/edviko/pipeline";

export const THRESHOLD_COOKIE = "ev_thresholds";

/** A month. Long enough to outlive a term's worth of visits. */
export const THRESHOLD_MAX_AGE = 60 * 60 * 24 * 30;

export type Field = {
  key: keyof Thresholds;
  label: string;
  unit: string;
  min: number;
  max: number;
  why: string;
};

export const FIELDS: Field[] = [
  {
    key: "quietAmber",
    label: "Quiet before it is worth a message",
    unit: "days",
    min: 3,
    max: 60,
    why: "No meeting, task, document or message in this long. Below about a week this will flag half the campus during exam season.",
  },
  {
    key: "quietRed",
    label: "Quiet before it is a problem",
    unit: "days",
    min: 7,
    max: 120,
    why: "The point at which silence stops being a lull. This is how students are lost, and almost nobody notices in time.",
  },
  {
    key: "deadlineAmber",
    label: "A deadline is approaching at",
    unit: "days",
    min: 3,
    max: 60,
    why: "Far enough out that there is still time to do the work rather than to panic about it.",
  },
  {
    key: "deadlineRed",
    label: "A deadline is urgent at",
    unit: "days",
    min: 0,
    max: 14,
    why: "Inside this, it is today's work. Setting it to zero means nothing is urgent until it has passed.",
  },
  {
    key: "stalledAmber",
    label: "Slow at a stage after",
    unit: "× the standard",
    min: 0,
    max: 3,
    why: "Each stage carries how long it should take. One means a case that has taken twice as long as it should is slow.",
  },
  {
    key: "stalledRed",
    label: "Stalled at a stage after",
    unit: "× the standard",
    min: 1,
    max: 6,
    why: "Two means three times the standard. This is the rule that finds the cases nobody has looked at in a term.",
  },
  {
    key: "profileFloor",
    label: "A profile is incomplete below",
    unit: "%",
    min: 40,
    max: 100,
    why: "Advice built on a half-filled profile is a guess with a logo on it. Set too high and every student is flagged, which is the same as none.",
  },
];

/**
 * Read a stored standard, keeping anything unreadable out of the dashboards.
 *
 * Every value is bounded by the field it belongs to, so a hand-edited cookie
 * cannot put a campus into a state where nothing is ever flagged or
 * everything always is.
 */
export function parseThresholds(raw: string | undefined): Thresholds {
  if (!raw) return STANDARD;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as Partial<Thresholds>;
    const out: Thresholds = { ...STANDARD };
    for (const field of FIELDS) {
      const value = parsed[field.key];
      if (typeof value !== "number" || !Number.isFinite(value)) continue;
      out[field.key] = Math.min(field.max, Math.max(field.min, value));
    }
    // A red that fires before amber would mean a case turns red and then
    // recovers to amber as it gets worse.
    if (out.quietRed < out.quietAmber) out.quietRed = out.quietAmber;
    if (out.deadlineRed > out.deadlineAmber) out.deadlineRed = out.deadlineAmber;
    if (out.stalledRed < out.stalledAmber) out.stalledRed = out.stalledAmber;
    return out;
  } catch {
    return STANDARD;
  }
}

export function isDefault(t: Thresholds): boolean {
  return FIELDS.every((f) => t[f.key] === STANDARD[f.key]);
}

export { STANDARD };
export type { Thresholds };
