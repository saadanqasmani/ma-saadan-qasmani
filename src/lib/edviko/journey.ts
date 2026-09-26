/**
 * The student's own view of the same pipeline the advisor works in.
 *
 * There used to be two lists of stages in this product: thirteen on the
 * student's dashboard and twenty in the advisor's. Two pipelines in one
 * system is how a student comes to a meeting believing they are further on
 * than their record says, so there is now one spine, read two ways. The
 * stages, their order and their definitions of done live in pipeline.ts.
 * What lives here is which of them this site can work out on its own.
 *
 * That distinction is the load-bearing one. A stage the site derives cannot
 * be ticked by hand, so the record cannot drift away from the thing it
 * describes. A stage that happens out in the world — an offer arriving, a
 * visa granted — is the student's own word, because a system that claims to
 * know an offer arrived when nobody told it is worse than one that asks.
 */

import type { Profile } from "@/lib/edviko/account";
import { STAGES, STAGE_BY_ID, type Stage, type StageId } from "@/lib/edviko/pipeline";

export type { Stage, StageId };
export { STAGES, STAGE_BY_ID };

/** The stages this site can see for itself. Everything else, the student says. */
export const DERIVED: StageId[] = [
  "registered",
  "profile",
  "assessment",
  "university",
  "financial",
  "application-prep",
];

export function isDerived(id: StageId): boolean {
  return DERIVED.includes(id);
}

export type Facts = {
  profile: Profile | null;
  /** How many universities are on the wish list, by tier. */
  tiers: { dream: number; likely: number; safe: number };
  /** True when at least one target has every document ticked. */
  anyDocsComplete: boolean;
  /** Stages the student ticked themselves. */
  claimed: StageId[];
};

export function doneStages(f: Facts): Set<StageId> {
  const done = new Set<StageId>();
  const p = f.profile;

  if (p) done.add("registered");
  if (p?.assessment.takenAt) done.add("assessment");
  if (p && completeEnough(p)) done.add("profile");
  if (f.tiers.dream > 0 && f.tiers.likely > 0 && f.tiers.safe > 0) done.add("university");
  if (p?.budgetUsd !== null && p?.budgetUsd !== undefined) done.add("financial");
  if (f.anyDocsComplete) done.add("application-prep");

  for (const raw of f.claimed) {
    const id = RENAMED[raw as string] ?? raw;
    if (id && !isDerived(id) && STAGE_BY_ID[id]) done.add(id);
  }
  return done;
}

/**
 * What the thirteen-stage version called these.
 *
 * A student who ticked "offer received" last month should not find it
 * unticked because the pipeline behind it was rewritten. Two of the old
 * stages became derived and are simply dropped, because the site can now see
 * them for itself.
 */
const RENAMED: Record<string, StageId | null> = {
  career: "career-recommendation",
  shortlist: "university",
  money: "financial",
  documents: "application-prep",
  offer: "admission",
  funding: "scholarship",
  grades: null,
};

/**
 * Enough of a profile to advise on.
 *
 * Deliberately a list of specific things rather than a percentage. "Your
 * profile is 60% complete" tells a student nothing; "you have no English
 * test result and four of your universities ask for one" tells them what to
 * do this week.
 */
function completeEnough(p: Profile): boolean {
  return Boolean(p.name && p.year && p.percentage !== null && p.englishTest && p.activities.length >= 3);
}

/** The first unfinished stage: what to do next, in one line. */
export function currentStage(done: Set<StageId>): Stage {
  return STAGES.find((s) => !done.has(s.id)) ?? STAGES[STAGES.length - 1];
}

/** How far through a phase somebody is, for the student's own view. */
export function phaseProgress(done: Set<StageId>, stages: StageId[]): { done: number; of: number } {
  return { done: stages.filter((s) => done.has(s)).length, of: stages.length };
}
