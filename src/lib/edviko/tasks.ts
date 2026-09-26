/**
 * The work, derived rather than kept.
 *
 * Every counselling office that has ever tried this has kept a task list,
 * and every one of them has watched it rot: tasks are entered in a burst
 * during training, nobody closes them, and within a term the list describes
 * a month that has already happened. An advisor who has been burned by one
 * goes back to a notebook.
 *
 * So these are not stored. They are read out of the case every time the
 * screen is drawn — a document that is missing is a task until it is there,
 * an assessment that has been answered and not read back is a task until
 * somebody reads it, a deadline is a task until it passes. Nothing to close,
 * nothing to tidy, and no way for the list and the truth to drift apart.
 *
 * The cost of that choice is that a task nobody can express as a fact about
 * the record cannot exist here. That is a real limitation and the right
 * trade: a list that is always true and slightly incomplete beats a list
 * that is complete and quietly wrong.
 */

import type { Application } from "@/lib/edviko/applications";
import { outstanding } from "@/lib/edviko/applications";
import { factsOf, type StudentRecord } from "@/lib/edviko/org";
import { flagsFor, STANDARD, type Thresholds, type Tone } from "@/lib/edviko/pipeline";

export type Owner = "student" | "advisor" | "school" | "family";

export const OWNER_LABEL: Record<Owner, string> = {
  student: "The student",
  advisor: "You",
  school: "The school",
  family: "The family",
};

/**
 * The same four, as a clause that can sit in a sentence.
 *
 * A label map used mid-sentence produces "You has to produce it", which is
 * the sort of small wrongness that makes a reader distrust the numbers
 * beside it.
 */
export const OWNER_DOES: Record<Owner, string> = {
  student: "the student's to do",
  advisor: "yours to do",
  school: "the school office's to do",
  family: "the family's to do",
};

export type Source =
  | "deadline"
  | "document"
  | "assessment"
  | "recommendation"
  | "profile"
  | "money"
  | "meeting"
  | "application";

export type Task = {
  id: string;
  student: string;
  studentName: string;
  title: string;
  detail: string;
  owner: Owner;
  /** Days until it is late. Negative is late. Null means no date attached. */
  dueInDays: number | null;
  source: Source;
  tone: Tone;
};

/**
 * When a reminder would go out, once there is anything to send one with.
 *
 * Thirty, fourteen, seven, three and one. The schedule is here rather than
 * in whatever eventually sends them, so the screen can already say "the next
 * reminder is seven days before" and the sending is the only part missing.
 */
export const REMINDERS = [30, 14, 7, 3, 1];

export function nextReminder(dueInDays: number | null): number | null {
  if (dueInDays === null || dueInDays < 0) return null;
  const upcoming = REMINDERS.filter((r) => r <= dueInDays);
  return upcoming.length > 0 ? Math.max(...upcoming) : null;
}

function toneOf(dueInDays: number | null, fallback: Tone = "amber"): Tone {
  if (dueInDays === null) return fallback;
  if (dueInDays < 0) return "red";
  if (dueInDays <= 3) return "red";
  if (dueInDays <= 14) return "amber";
  return "green";
}

/** Everything outstanding on one case, as work with an owner and a date. */
export function tasksFor(
  student: StudentRecord,
  applications: Application[] = [],
  t: Thresholds = STANDARD
): Task[] {
  const out: Task[] = [];
  const facts = factsOf(student);
  const flags = flagsFor(facts, t);
  const has = (id: string) => flags.some((f) => f.id === id);
  const add = (task: Omit<Task, "student" | "studentName">) =>
    out.push({ ...task, student: student.id, studentName: student.name });

  if (student.nextDeadlineLabel && student.nextDeadlineInDays !== null) {
    add({
      id: `${student.id}-deadline`,
      title: student.nextDeadlineLabel,
      detail:
        student.nextDeadlineInDays < 0
          ? `Passed ${Math.abs(student.nextDeadlineInDays)} days ago. Find out whether there is a later round before telling them.`
          : "The date the rest of this is measured against.",
      owner: "student",
      dueInDays: student.nextDeadlineInDays,
      source: "deadline",
      tone: toneOf(student.nextDeadlineInDays),
    });
  }

  if (student.documentsExpired > 0) {
    add({
      id: `${student.id}-expired`,
      title: `Replace ${student.documentsExpired} expired document${student.documentsExpired === 1 ? "" : "s"}`,
      detail: "An expired document fails an application quietly, after it has been sent. Renewals take weeks.",
      owner: "family",
      dueInDays: null,
      source: "document",
      tone: "red",
    });
  }

  if (student.documentsMissing > 0) {
    add({
      id: `${student.id}-documents`,
      title: `Collect ${student.documentsMissing} missing document${student.documentsMissing === 1 ? "" : "s"}`,
      detail: "Most of these are things only a parent can find: certificates, bank letters, identity papers.",
      owner: "family",
      dueInDays: student.nextDeadlineInDays,
      source: "document",
      tone: student.documentsMissing > 3 ? "red" : "amber",
    });
  }

  if (!student.assessmentDone) {
    add({
      id: `${student.id}-assessment`,
      title: "Take the assessment",
      detail: "Nothing downstream can be advised properly until this exists.",
      owner: "student",
      dueInDays: null,
      source: "assessment",
      tone: "amber",
    });
  } else if (!student.assessmentReviewed) {
    add({
      id: `${student.id}-review`,
      title: "Read the assessment back to them",
      detail: "They answered. An assessment nobody discusses with the student is a questionnaire.",
      owner: "advisor",
      dueInDays: null,
      source: "assessment",
      tone: "amber",
    });
  }

  if (student.recommendationAwaitingApproval) {
    add({
      id: `${student.id}-recommendation`,
      title: "Approve the recommendation",
      detail: "Advice is not advice until a person has signed it.",
      owner: "advisor",
      dueInDays: null,
      source: "recommendation",
      tone: "amber",
    });
  }

  if (has("profile")) {
    add({
      id: `${student.id}-profile`,
      title: `Finish the profile, at ${student.profileCompletion}%`,
      detail: "Advice built on a half-filled profile is a guess with a logo on it.",
      owner: "student",
      dueInDays: null,
      source: "profile",
      tone: "amber",
    });
  }

  if (student.budgetUsd === null) {
    add({
      id: `${student.id}-budget`,
      title: "Ask the family what they can afford",
      detail: "One question, asked once. Without it every shortlist is a wish.",
      owner: "advisor",
      dueInDays: null,
      source: "money",
      tone: "amber",
    });
  } else if (facts.fundingGapUsd !== null && facts.fundingGapUsd > 0) {
    add({
      id: `${student.id}-gap`,
      title: `Close a funding gap of $${facts.fundingGapUsd.toLocaleString("en-US")}`,
      detail: "A scholarship, a cheaper country, or a larger contribution. Deciding now is cheaper than deciding after an offer.",
      owner: "advisor",
      dueInDays: null,
      source: "money",
      tone: facts.fundingGapUsd > 8000 ? "red" : "amber",
    });
  }

  if (student.parentMeetingDue) {
    add({
      id: `${student.id}-meeting`,
      title: "Hold the parent meeting",
      detail: "The money and the permission both sit with them, so these are the meetings that change anything.",
      owner: "advisor",
      dueInDays: null,
      source: "meeting",
      tone: "amber",
    });
  }

  for (const app of applications) {
    const left = outstanding(app);
    if (left.length === 0) continue;
    for (const requirement of left) {
      add({
        id: `${app.id}-${requirement.id}`,
        title: `${requirement.label} for ${app.university}`,
        detail: `${app.country} · ${app.round}`,
        owner: requirement.owner,
        dueInDays: app.deadlineInDays,
        source: "application",
        tone: toneOf(app.deadlineInDays),
      });
    }
  }

  return out;
}

/** When it has to happen, in the language somebody plans a week in. */
export type When = "overdue" | "now" | "week" | "fortnight" | "later" | "undated";

export const WHEN_LABEL: Record<When, string> = {
  overdue: "Already late",
  now: "Today or tomorrow",
  week: "This week",
  fortnight: "This fortnight",
  later: "Later",
  undated: "No date on it",
};

export function whenOf(task: Task): When {
  if (task.dueInDays === null) return "undated";
  if (task.dueInDays < 0) return "overdue";
  if (task.dueInDays <= 1) return "now";
  if (task.dueInDays <= 7) return "week";
  if (task.dueInDays <= 14) return "fortnight";
  return "later";
}

const ORDER: When[] = ["overdue", "now", "week", "fortnight", "later", "undated"];

export function byWhen(tasks: Task[]): { when: When; label: string; tasks: Task[] }[] {
  return ORDER.map((when) => ({
    when,
    label: WHEN_LABEL[when],
    tasks: tasks
      .filter((t) => whenOf(t) === when)
      .sort((a, b) => (a.dueInDays ?? 9999) - (b.dueInDays ?? 9999)),
  })).filter((g) => g.tasks.length > 0);
}

export function byOwner(tasks: Task[], owner: Owner): Task[] {
  return tasks.filter((t) => t.owner === owner);
}
