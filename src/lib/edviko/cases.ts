/**
 * The advisory record: what was advised, by whom, on what evidence.
 *
 * This is the part consultancies never build, and it is the part that makes
 * the difference between a counsellor and a professional. A recommendation
 * without its reasoning is an opinion that cannot be reviewed, defended, or
 * handed to the advisor who covers the case next year. So every material
 * recommendation carries the same nine things, and the form refuses to be
 * short: date, advisor, what was advised, why, what evidence was considered,
 * what alternatives were weighed, what the risks are, what the student and
 * parents said, what happens next, and when it should be looked at again.
 *
 * The second reason for it is subtler. The system will soon have AI in it,
 * and AI writes fluent advice that is wrong in ways nobody notices. Marking
 * where each fact came from — the advisor, the student, a verified external
 * source, or a model — is what keeps that readable a year later.
 */

export type Source = "advisor" | "student" | "verified" | "ai";

export const SOURCES: { id: Source; label: string; note: string }[] = [
  { id: "advisor", label: "Advisor", note: "Written by the professional handling the case." },
  { id: "student", label: "Student", note: "As told by the student or their family." },
  { id: "verified", label: "Verified source", note: "From a university, ministry or exam board, with a date." },
  { id: "ai", label: "AI assistance", note: "Drafted by a model and reviewed by a person." },
];

export type EntryKind =
  | "recommendation"
  | "meeting"
  | "assessment"
  | "document"
  | "application"
  | "status"
  | "note";

export const ENTRY_KINDS: { id: EntryKind; label: string }[] = [
  { id: "recommendation", label: "Recommendation" },
  { id: "meeting", label: "Meeting" },
  { id: "assessment", label: "Assessment" },
  { id: "document", label: "Document" },
  { id: "application", label: "Application" },
  { id: "status", label: "Status change" },
  { id: "note", label: "Note" },
];

/** One line in a case history. Everything is written, nothing is inferred. */
export type CaseEntry = {
  id: string;
  kind: EntryKind;
  /** Days ago, so a demo does not go stale and a server can send real dates later. */
  daysAgo: number;
  by: string;
  title: string;
  body: string;
  source: Source;
};

/**
 * A recommendation, in full.
 *
 * Nine fields, and the ones people are tempted to skip are the ones that
 * matter: alternatives considered, and the review date. An advisor who
 * cannot name what else they weighed has not advised, they have preferred.
 */
export type Recommendation = {
  id: string;
  student: string;
  advisor: string;
  /** ISO date string, written at the moment it is recorded. */
  at: string;
  what: string;
  why: string;
  evidence: string;
  alternatives: string;
  risks: string;
  response: string;
  nextAction: string;
  /** Days from now that this should be looked at again. */
  reviewInDays: number;
  source: Source;
};

export const RECOMMENDATIONS_KEY = "ev-recommendations";

export function readRecommendations(raw: string | null): Recommendation[] {
  if (!raw) return [];
  try {
    const all = JSON.parse(raw) as Recommendation[];
    return Array.isArray(all) ? all : [];
  } catch {
    return [];
  }
}

export function forStudent(all: Recommendation[], student: string): Recommendation[] {
  return all.filter((r) => r.student === student).sort((a, b) => b.at.localeCompare(a.at));
}

/** Everything a recommendation must say before it can be filed. */
export const REQUIRED: { field: keyof Recommendation; label: string; hint: string }[] = [
  { field: "what", label: "What you are advising", hint: "The pathway, not the paperwork. 'Civil engineering in Türkiye, with architecture as the alternative.'" },
  { field: "why", label: "Why", hint: "The reasoning a colleague could follow without asking you." },
  { field: "evidence", label: "Evidence considered", hint: "Grades, assessment results, budget, university requirements, the conversation with the parents." },
  { field: "alternatives", label: "Alternatives considered", hint: "What else was on the table and why it was set aside. An advisor who cannot name one has preferred, not advised." },
  { field: "risks", label: "Risks and limits", hint: "What would make this the wrong advice. Say it now, not after the deposit." },
  { field: "nextAction", label: "Next action", hint: "One thing, with an owner." },
];

export function missingFields(r: Partial<Recommendation>): string[] {
  return REQUIRED.filter((f) => !String(r[f.field] ?? "").trim()).map((f) => f.label);
}

/**
 * Stamp a draft into a filed recommendation.
 *
 * The clock lives here rather than in the component. A component that reads
 * the time while rendering produces a different answer every time React
 * happens to re-run it, and React is entitled to re-run it whenever it
 * likes.
 */
export function fileRecommendation(
  draft: Partial<Recommendation>,
  student: string,
  advisor: string
): Recommendation {
  const now = new Date();
  return {
    id: `${student}-${now.getTime()}`,
    student,
    advisor,
    at: now.toISOString(),
    what: draft.what ?? "",
    why: draft.why ?? "",
    evidence: draft.evidence ?? "",
    alternatives: draft.alternatives ?? "",
    risks: draft.risks ?? "",
    response: draft.response ?? "",
    nextAction: draft.nextAction ?? "",
    reviewInDays: Number(draft.reviewInDays ?? 30),
    source: (draft.source as Source) ?? "advisor",
  };
}
