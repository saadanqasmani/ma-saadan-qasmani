/**
 * Your chances at a university, as a comparison rather than a prophecy.
 *
 * There is no percentage here and there never will be. Nobody can compute
 * the probability that a particular seventeen year old is admitted to a
 * particular university, and a number like "73%" would be believed, planned
 * around, and wrong.
 *
 * What can be done honestly is arithmetic a student could do themselves if
 * they had the page open beside them: here is what this university publishes
 * that it wants, here is what you have, here is each line where you are
 * above or below, and here is what would close the gap. That is what a
 * counsellor does in the room, and it is checkable, which a percentage is
 * not.
 */

import type { Profile } from "@/lib/taraki/account";
import type { University } from "@/content/taraki/universities";
import { type Tier } from "@/lib/taraki/wishlist";

export type Check = {
  label: string;
  /** What they ask for, as they state it. */
  asked: string;
  /** What the student has. */
  yours: string;
  status: "over" | "meets" | "under" | "unknown";
  /** What to do about it, when there is something to do. */
  todo?: string;
  source?: { url: string; asOf: string };
};

export type Assessment = {
  checks: Check[];
  tier: Tier;
  /** True when the university has published nothing we can measure against. */
  nothingToCompare: boolean;
  headline: string;
};

export function assess(uni: University, p: Profile | null): Assessment {
  const checks: Check[] = [];

  if (uni.satMin) {
    const asked = `${uni.satMin.value} of 1600`;
    if (p?.satTotal == null) {
      checks.push({
        label: "SAT",
        asked,
        yours: "not recorded",
        status: "unknown",
        todo: `Sit the SAT, or add your score. They ask for ${uni.satMin.value}.`,
        source: { url: uni.satMin.url, asOf: uni.satMin.asOf },
      });
    } else {
      const over = p.satTotal - uni.satMin.value;
      checks.push({
        label: "SAT",
        asked,
        yours: `${p.satTotal}`,
        status: over >= 100 ? "over" : over >= 0 ? "meets" : "under",
        todo: over < 0 ? `You are ${Math.abs(over)} points short. A retake is the fastest fix here.` : undefined,
        source: { url: uni.satMin.url, asOf: uni.satMin.asOf },
      });
    }
  }

  if (uni.minimumPercent) {
    const asked = `${uni.minimumPercent.value}%`;
    if (p?.percentage == null) {
      checks.push({
        label: "Grades",
        asked,
        yours: "not converted yet",
        status: "unknown",
        todo: "Run the grade calculator. It takes a minute.",
        source: { url: uni.minimumPercent.url, asOf: uni.minimumPercent.asOf },
      });
    } else {
      const over = p.percentage - uni.minimumPercent.value;
      checks.push({
        label: "Grades",
        asked,
        yours: `${p.percentage.toFixed(1)}%`,
        status: over >= 10 ? "over" : over >= -5 ? "meets" : "under",
        todo: over < -5 ? "This one is a stretch on grades. Keep it, but not as your only plan." : undefined,
        source: { url: uni.minimumPercent.url, asOf: uni.minimumPercent.asOf },
      });
    }
  }

  // English is asked for almost everywhere, so it is checked even where the
  // university's exact threshold is not in our data yet.
  if (uni.requirements?.value.some((r) => /english/i.test(r))) {
    const has = p?.englishTest && p.englishTest !== "none";
    checks.push({
      label: "English",
      asked: "proof of English",
      yours: has ? `${p!.englishTest.toUpperCase()} ${p!.englishScore}`.trim() : "nothing yet",
      status: has ? "meets" : "unknown",
      todo: has ? undefined : "Book IELTS, TOEFL or Duolingo. Allow about six weeks from booking to score.",
      source: uni.requirements ? { url: uni.requirements.url, asOf: uni.requirements.asOf } : undefined,
    });
  }

  const nothingToCompare = checks.length === 0;
  const under = checks.filter((c) => c.status === "under").length;
  const unknown = checks.filter((c) => c.status === "unknown").length;
  const over = checks.filter((c) => c.status === "over").length;

  let tier: Tier = "unsorted";
  if (!nothingToCompare && unknown === 0) {
    if (under > 0) tier = "dream";
    else if (over === checks.length) tier = "safe";
    else tier = "likely";
  }

  const headline = nothingToCompare
    ? "This university has not published anything we can measure you against yet."
    : unknown > 0
      ? `${unknown} thing${unknown > 1 ? "s" : ""} missing from your profile before this can be answered.`
      : under > 0
        ? "You are below what they publish on at least one thing."
        : over === checks.length
          ? "You are clear of everything they publish."
          : "You meet what they publish.";

  return { checks, tier, nothingToCompare, headline };
}
