/**
 * The wish list, in three tiers.
 *
 * A shortlist of eight universities a student has no chance at is not a
 * shortlist, it is a year of disappointment with a deadline attached. The
 * counsellor's oldest and best advice is to aim high, be realistic, and keep
 * one you will certainly get into. So the list has three shelves and the
 * page nags, gently, if the safe one is empty.
 *
 *   Dream   reach for it anyway
 *   Likely  your result is around what they ask
 *   Safe    you are comfortably above what they ask
 *
 * Placement is computed, not guessed. It compares the student's own
 * converted result against the minimum a university publishes. Where that
 * minimum is not in our data yet, the university lands in Unsorted and says
 * why, because a tier assigned without a number behind it is exactly the
 * false comfort this is meant to prevent.
 */

export type Tier = "dream" | "likely" | "safe" | "unsorted";

export const tierMeta: Record<Tier, { label: string; blurb: string; tone: string }> = {
  dream: {
    label: "Dream",
    blurb: "Above what your result suggests. Apply anyway, but not only here.",
    tone: "var(--paid)",
  },
  likely: {
    label: "Likely",
    blurb: "Your result is around what they ask for.",
    tone: "var(--accent)",
  },
  safe: {
    label: "Safe",
    blurb: "Comfortably above what they ask. Keep at least one.",
    tone: "var(--free)",
  },
  unsorted: {
    label: "Not sorted yet",
    blurb: "We do not hold this one's entry requirement, so we will not guess at your chances.",
    tone: "var(--text-faint)",
  },
};

/**
 * Where a university sits for this student.
 *
 * The margins are deliberately wide. A published minimum is a floor, not a
 * prediction, and calling something safe on a two-point gap would be the
 * kind of precision nobody has earned.
 */
export function placeTier(studentPercent: number | null, minimumPercent: number | null): Tier {
  if (studentPercent === null || minimumPercent === null) return "unsorted";
  const margin = studentPercent - minimumPercent;
  if (margin >= 10) return "safe";
  if (margin >= -5) return "likely";
  return "dream";
}

export const TIER_ORDER: Tier[] = ["dream", "likely", "safe", "unsorted"];
