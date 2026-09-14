/**
 * Which careers fit, and why.
 *
 * THE RULE THIS FOLLOWS. Interest, aptitude, preference and eligibility are
 * four different things, and collapsing them into one number is how careers
 * software becomes a horoscope. A student who loves biology, is strong at
 * it, and dropped chemistry last year is not a "68% match for medicine".
 * They are someone whose door is currently shut, for one nameable reason,
 * which they can still do something about. So this returns the four
 * judgements separately, each with the sentence that explains it, and the
 * interface shows all four.
 *
 * There is a ranking number in here, because something has to decide what
 * appears first. It is never shown, never described as a match, and never
 * turned into a percentage.
 *
 * Everything is computed from the student's own answers. Nothing is
 * predicted, and no outcome is promised.
 */

import {
  CAREERS,
  type Aptitude,
  type Career,
  type Family,
  type Pref,
  type Subject,
} from "@/content/taraki/careers";

export type Assessment = {
  /** The fields they said interest them. */
  interests: Family[];
  /** Their own rating of themselves, 1 to 5. Absent means not answered. */
  aptitudes: Partial<Record<Aptitude, number>>;
  /** The working day they want. */
  prefs: Pref[];
  /** What they are taking or have taken at school. */
  subjects: Subject[];
  takenAt: string;
};

export const EMPTY_ASSESSMENT: Assessment = {
  interests: [],
  aptitudes: {},
  prefs: [],
  subjects: [],
  takenAt: "",
};

/** "A", "A and B", "A, B and C". Three subjects joined with two "and"s reads
 *  like a fault in the page rather than a list. */
export function listOf(items: readonly string[]): string {
  if (items.length <= 1) return items[0] ?? "";
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export function isAnswered(a: Assessment): boolean {
  return a.interests.length > 0 || Object.keys(a.aptitudes).length > 0 || a.subjects.length > 0;
}

export type Verdict = "strong" | "partial" | "weak" | "blocked" | "unknown";

export type Signal = {
  id: "interest" | "aptitude" | "preference" | "eligibility";
  label: string;
  verdict: Verdict;
  /** The sentence under the verdict. Always says what it is based on. */
  because: string;
};

export type Fit = {
  career: Career;
  signals: Signal[];
  /** Required subjects the student is not taking. A closed door, for now. */
  missing: Subject[];
  /** What to do next, derived from the signals rather than written by hand. */
  steps: string[];
  /** Ordering only. Never shown, never called a match. */
  rank: number;
};

function verdictOfInterest(career: Career, a: Assessment): Signal {
  if (a.interests.length === 0) {
    return {
      id: "interest",
      label: "Interest",
      verdict: "unknown",
      because: "You have not told us which fields interest you yet.",
    };
  }
  const named = a.interests.includes(career.family);
  return {
    id: "interest",
    label: "Interest",
    verdict: named ? "strong" : "weak",
    because: named
      ? "You named this field as one that interests you."
      : "You did not name this field. It is here because the rest of your answers point at it.",
  };
}

function verdictOfAptitude(career: Career, a: Assessment): Signal {
  const rated = career.strengths.map((s) => a.aptitudes[s]).filter((n): n is number => typeof n === "number");
  const names = career.strengths.map(labelOfAptitude).join(", ");

  if (rated.length === 0) {
    return {
      id: "aptitude",
      label: "Strengths",
      verdict: "unknown",
      because: `This work leans on ${names}. You have not rated those yet.`,
    };
  }

  const mean = rated.reduce((n, v) => n + v, 0) / rated.length;
  const verdict: Verdict = mean >= 4 ? "strong" : mean >= 3 ? "partial" : "weak";
  const said =
    verdict === "strong"
      ? "and you rated yourself strongly on those"
      : verdict === "partial"
        ? "and you rated yourself in the middle on those"
        : "and those are not the ones you rated yourself highest on";
  return {
    id: "aptitude",
    label: "Strengths",
    verdict,
    because: `This work leans on ${names}, ${said}. This is your own rating of yourself, not a test.`,
  };
}

function verdictOfPreference(career: Career, a: Assessment): Signal {
  if (a.prefs.length === 0) {
    return {
      id: "preference",
      label: "The working day",
      verdict: "unknown",
      because: "You have not said how you want to spend a working day.",
    };
  }
  const shared = career.prefs.filter((p) => a.prefs.includes(p));
  const verdict: Verdict = shared.length >= 2 ? "strong" : shared.length === 1 ? "partial" : "weak";
  return {
    id: "preference",
    label: "The working day",
    verdict,
    because:
      shared.length > 0
        ? `Matches what you asked for: ${shared.map(labelOfPref).join(", ").toLowerCase()}.`
        : "This job's day looks different from the one you described. Worth reading what the work actually is before dismissing it.",
  };
}

function verdictOfEligibility(career: Career, a: Assessment, missing: Subject[]): Signal {
  if (career.required.length === 0) {
    return {
      id: "eligibility",
      label: "Subjects",
      verdict: "strong",
      because: "No specific school subject is required for this route.",
    };
  }
  if (a.subjects.length === 0) {
    return {
      id: "eligibility",
      label: "Subjects",
      verdict: "unknown",
      because: `Needs ${listOf(career.required)}. Tell us your subjects and we can say whether the door is open.`,
    };
  }
  if (missing.length === 0) {
    return {
      id: "eligibility",
      label: "Subjects",
      verdict: "strong",
      because: `You are taking ${listOf(career.required)}, which is what this route requires.`,
    };
  }
  return {
    id: "eligibility",
    label: "Subjects",
    verdict: "blocked",
    because: `This route requires ${listOf(career.required)}, and you have not listed ${missing.join(" or ")}. That is a closed door until it is fixed, not a preference.`,
  };
}

const WEIGHT: Record<Verdict, number> = {
  strong: 3,
  partial: 2,
  unknown: 1,
  weak: 0,
  blocked: 0,
};

/**
 * Ordering, and nothing else.
 *
 * Eligibility counts double because a subject requirement is a fact about
 * the world, while the other three are a student's opinion of themselves on
 * a given afternoon.
 */
function rankOf(signals: Signal[]): number {
  return signals.reduce((n, s) => n + WEIGHT[s.verdict] * (s.id === "eligibility" ? 2 : 1), 0);
}

function stepsFor(career: Career, signals: Signal[], missing: Subject[]): string[] {
  const steps: string[] = [];
  if (missing.length > 0) {
    steps.push(
      `Find out this week whether you can still add ${listOf(missing)}. In some systems you can, and the answer changes everything that follows.`,
    );
  }
  if (career.licence) {
    steps.push("Check that a degree from the country you are considering is recognised where you intend to work.");
  }
  if (signals.find((s) => s.id === "aptitude")?.verdict === "unknown") {
    steps.push("Rate your own strengths in the assessment so this can say something more useful.");
  }
  steps.push(`Read what the work is actually like day to day before you commit ${career.years.split(",")[0]} to it.`);
  steps.push("Talk to one person who does this job now. One conversation beats a term of guessing.");
  return steps;
}

export function fitFor(career: Career, a: Assessment): Fit {
  const missing =
    a.subjects.length === 0 ? [] : career.required.filter((r) => !a.subjects.includes(r));

  const signals: Signal[] = [
    verdictOfInterest(career, a),
    verdictOfAptitude(career, a),
    verdictOfPreference(career, a),
    verdictOfEligibility(career, a, missing),
  ];

  return { career, signals, missing, steps: stepsFor(career, signals, missing), rank: rankOf(signals) };
}

export type Recommendation = {
  /** The strongest fits whose subject requirements are met. */
  primary: Fit[];
  /** Worth a look, in the same order. */
  alternatives: Fit[];
  /**
   * The ones that fit the person but not their subjects.
   *
   * This is the most useful list on the page and the reason the whole thing
   * exists: a student who wants medicine and dropped chemistry needs to know
   * today, not in the term they apply.
   */
  shut: Fit[];
};

export function recommend(a: Assessment): Recommendation {
  const all = CAREERS.map((c) => fitFor(c, a)).sort((x, y) => y.rank - x.rank || x.career.name.localeCompare(y.career.name));

  const open = all.filter((f) => f.missing.length === 0);
  const shut = all
    .filter((f) => f.missing.length > 0)
    // Only where the student genuinely points at it. A closed door is an
    // alarming thing to be told, and four of them raised on a self-rating
    // alone would bury the one that is actually about their own plan. So
    // either they named the field, or two independent signals agree.
    .filter((f) => {
      const verdict = (id: Signal["id"]) => f.signals.find((s) => s.id === id)?.verdict;
      return verdict("interest") === "strong" || (verdict("aptitude") === "strong" && verdict("preference") === "strong");
    })
    .slice(0, 3);

  return { primary: open.slice(0, 3), alternatives: open.slice(3, 8), shut };
}

/* ---- labels ------------------------------------------------------------- */

const APTITUDE_LABEL: Record<Aptitude, string> = {
  numerical: "numbers",
  verbal: "words",
  logical: "logic",
  analytical: "analysis",
  spatial: "space and shape",
  abstract: "abstraction",
  practical: "hands-on work",
};

export function labelOfAptitude(a: Aptitude): string {
  return APTITUDE_LABEL[a];
}

const PREF_LABEL: Record<Pref, string> = {
  people: "Working with people",
  independent: "Working alone",
  research: "Long research",
  creative: "Making things",
  leadership: "Leading",
  "hands-on": "Hands on",
  structured: "Structure",
  outdoors: "Away from a desk",
};

export function labelOfPref(p: Pref): string {
  return PREF_LABEL[p];
}

export const VERDICT_META: Record<Verdict, { label: string; tone: string }> = {
  strong: { label: "Strong", tone: "var(--free)" },
  partial: { label: "Partly", tone: "var(--accent)" },
  weak: { label: "Not really", tone: "var(--text-faint)" },
  blocked: { label: "Blocked", tone: "var(--paid)" },
  unknown: { label: "Not answered", tone: "var(--text-faint)" },
};
