/**
 * Where a student actually is, from first thought to first term.
 *
 * The stages are the ones a student can see themselves in. Several of them
 * this site can work out on its own: whether the assessment is done, whether
 * a shortlist exists, whether the money has been counted. The rest are
 * things that happen in the world, and the student ticks those, because a
 * system that claims to know an offer arrived when nobody told it is worse
 * than one that asks.
 *
 * Each stage says what finishing it means. "Application preparation" is not
 * a status; "every document on the checklist collected for at least one
 * university" is something a person can be finished with.
 */

import type { Profile } from "@/lib/taraki/account";

export type StageId =
  | "registered"
  | "profile"
  | "assessment"
  | "career"
  | "grades"
  | "shortlist"
  | "money"
  | "documents"
  | "applied"
  | "offer"
  | "funding"
  | "visa"
  | "enrolled";

export type Stage = {
  id: StageId;
  label: string;
  /** What being finished with this stage actually means. */
  means: string;
  /** True when the site can tell on its own. False means the student says. */
  automatic: boolean;
};

export const STAGES: Stage[] = [
  { id: "registered", label: "Started", means: "You made an account, so there is somewhere for all this to live.", automatic: true },
  { id: "assessment", label: "Assessment", means: "You answered the four career questions.", automatic: true },
  { id: "career", label: "Career chosen", means: "You have settled on a direction, even a provisional one.", automatic: false },
  { id: "grades", label: "Grades converted", means: "Your result is in a form universities abroad can read.", automatic: true },
  { id: "profile", label: "Profile complete", means: "Nothing important is still missing from your record.", automatic: true },
  { id: "shortlist", label: "Shortlist built", means: "At least one dream, one likely and one safe university.", automatic: true },
  { id: "money", label: "Money counted", means: "You know the total cost and the gap, not just the tuition.", automatic: true },
  { id: "documents", label: "Documents ready", means: "Every document collected for at least one university.", automatic: true },
  { id: "applied", label: "Applied", means: "At least one application actually submitted.", automatic: false },
  { id: "offer", label: "Offer received", means: "A university has said yes.", automatic: false },
  { id: "funding", label: "Funding settled", means: "The gap is closed, by scholarship, savings or a loan.", automatic: false },
  { id: "visa", label: "Visa granted", means: "The permit is in your passport.", automatic: false },
  { id: "enrolled", label: "Enrolled", means: "You are registered as a student. This is the one that counts.", automatic: false },
];

export type Facts = {
  profile: Profile | null;
  /** How many universities are on the wish list, by tier. */
  tiers: { dream: number; likely: number; safe: number };
  /** True when at least one target has every document ticked. */
  anyDocsComplete: boolean;
  /** Stages the student ticked themselves. */
  claimed: StageId[];
};

/**
 * Which stages are finished.
 *
 * Automatic stages are derived and cannot be ticked by hand, so the record
 * cannot drift away from the thing it describes. Everything else is the
 * student's own word, which is the only source there is for it.
 */
export function doneStages(f: Facts): Set<StageId> {
  const done = new Set<StageId>();
  const p = f.profile;

  if (p) done.add("registered");
  if (p?.assessment.takenAt) done.add("assessment");
  if (p?.percentage !== null && p?.percentage !== undefined) done.add("grades");
  if (p && completeEnough(p)) done.add("profile");
  if (f.tiers.dream > 0 && f.tiers.likely > 0 && f.tiers.safe > 0) done.add("shortlist");
  if (p?.budgetUsd !== null && p?.budgetUsd !== undefined) done.add("money");
  if (f.anyDocsComplete) done.add("documents");

  for (const id of f.claimed) {
    const stage = STAGES.find((s) => s.id === id);
    if (stage && !stage.automatic) done.add(id);
  }
  return done;
}

function completeEnough(p: Profile): boolean {
  return Boolean(p.name && p.year && p.percentage !== null && p.englishTest && p.activities.length >= 3);
}

/** The first unfinished stage: what to do next, in one word. */
export function currentStage(done: Set<StageId>): Stage {
  return STAGES.find((s) => !done.has(s.id)) ?? STAGES[STAGES.length - 1];
}
