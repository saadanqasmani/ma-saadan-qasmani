/**
 * What a parent may see, and what they may not.
 *
 * The coding structure has carried a relationship digit from the beginning —
 * 0 the student, 1 mother, 2 father, 3 and up guardians — which means the
 * system has always known that a family is several people with different
 * rights rather than one account shared between them. This is the module
 * that decides what those rights are.
 *
 * The rule is narrower than most schools would write and is deliberate.
 * Parents see everything about position, money and obligation: where their
 * child is in the process, what it will cost, what has to be paid, signed or
 * provided, and by when. They do not see the assessment's raw answers, the
 * advisor's case notes, or the essay.
 *
 * That last part is not an oversight and should not be quietly relaxed. A
 * seventeen year old who knows their parents are reading their answers about
 * what frightens them will answer differently, and the assessment stops
 * being worth taking. The advice built on it, and every recommendation
 * downstream, is only as honest as the answers underneath. So the system
 * gives parents the position and the bill, which is what they are actually
 * carrying, and keeps the interior life of the case between the student and
 * their advisor — and says so on the screen rather than by omission.
 */

import { relationshipLabel, parseId } from "@/lib/edviko/id";
import type { StudentRecord } from "@/lib/edviko/org";
import { STAGE_BY_ID, type StageId } from "@/lib/edviko/pipeline";

/** Everything a parent is shown, and nothing else. */
export type FamilyView = {
  studentName: string;
  code: string;
  grade: string;
  programme: string;
  stage: StageId;
  stageLabel: string;
  stageMeans: string;
  /** Position, as parts of the whole rather than a percentage of a person. */
  profileCompletion: number;
  assessmentDone: boolean;
  assessmentReviewed: boolean;
  shortlist: number;
  applications: number;
  offers: number;
  scholarships: number;
  budgetUsd: number | null;
  estimatedCostUsd: number | null;
  fundingGapUsd: number | null;
  documentsMissing: number;
  documentsExpired: number;
  nextDeadlineLabel: string | null;
  nextDeadlineInDays: number | null;
  parentMeetingDue: boolean;
  advisorCode: string;
};

export function viewFor(student: StudentRecord): FamilyView {
  const gap =
    student.budgetUsd === null || student.estimatedCostUsd === null
      ? null
      : Math.max(0, student.estimatedCostUsd - student.budgetUsd);
  const stage = STAGE_BY_ID[student.stage];

  return {
    studentName: student.name,
    code: student.id,
    grade: student.grade,
    programme: student.programme,
    stage: student.stage,
    stageLabel: stage.label,
    stageMeans: stage.means,
    profileCompletion: student.profileCompletion,
    assessmentDone: student.assessmentDone,
    assessmentReviewed: student.assessmentReviewed,
    shortlist: student.shortlist,
    applications: student.applications,
    offers: student.offers,
    scholarships: student.scholarships,
    budgetUsd: student.budgetUsd,
    estimatedCostUsd: student.estimatedCostUsd,
    fundingGapUsd: gap,
    documentsMissing: student.documentsMissing,
    documentsExpired: student.documentsExpired,
    nextDeadlineLabel: student.nextDeadlineLabel,
    nextDeadlineInDays: student.nextDeadlineInDays,
    parentMeetingDue: student.parentMeetingDue,
    advisorCode: student.advisor,
  };
}

/** Named on the screen, so the limit is a stated policy rather than a gap. */
export const WITHHELD: { what: string; why: string }[] = [
  {
    what: "The assessment answers themselves",
    why: "A student who knows their answers are being read at home answers differently, and then the advice underneath is built on something that is not true.",
  },
  {
    what: "The advisor's case notes",
    why: "A professional record is written to be read by the next professional. Knowing a parent will read it changes what gets written down, which is how records stop being useful.",
  },
  {
    what: "The personal essay and its drafts",
    why: "It is the one part of the application that has to sound like the person writing it.",
  },
];

/** What the family themselves have to do, in the order it bites. */
export type FamilyAction = {
  id: string;
  urgency: "now" | "soon" | "whenever";
  title: string;
  detail: string;
};

export function actionsFor(v: FamilyView): FamilyAction[] {
  const out: FamilyAction[] = [];

  if (v.nextDeadlineInDays !== null && v.nextDeadlineInDays < 0) {
    out.push({
      id: "deadline-missed",
      urgency: "now",
      title: `${v.nextDeadlineLabel ?? "A deadline"} has passed`,
      detail: `It was due ${Math.abs(v.nextDeadlineInDays)} days ago. Ask the advisor what it costs and whether there is a later round.`,
    });
  } else if (v.nextDeadlineInDays !== null && v.nextDeadlineInDays <= 14) {
    out.push({
      id: "deadline",
      urgency: "now",
      title: `${v.nextDeadlineLabel ?? "A deadline"} in ${v.nextDeadlineInDays} days`,
      detail: "Most deadlines that are missed are missed by a family that thought somebody else was handling it.",
    });
  }

  if (v.documentsExpired > 0) {
    out.push({
      id: "expired",
      urgency: "now",
      title: `${v.documentsExpired} document has expired`,
      detail: "An expired passport or certificate fails an application quietly, after it has been sent. Renewals take weeks.",
    });
  }

  if (v.documentsMissing > 0) {
    out.push({
      id: "documents",
      urgency: v.documentsMissing > 2 ? "now" : "soon",
      title: `${v.documentsMissing} document${v.documentsMissing === 1 ? "" : "s"} still needed`,
      detail: "Most of these are things only a parent can find: certificates, bank letters, identity papers.",
    });
  }

  if (v.budgetUsd === null) {
    out.push({
      id: "budget",
      urgency: "now",
      title: "Nobody has said what the family can afford",
      detail: "Until there is a number, every shortlist is a wish. It is the single most useful thing a parent can add, and it can be a range.",
    });
  } else if (v.fundingGapUsd !== null && v.fundingGapUsd > 0) {
    out.push({
      id: "gap",
      urgency: "soon",
      title: `The plan costs $${v.fundingGapUsd.toLocaleString("en-US")} a year more than the budget`,
      detail: "One of the two has to move: a scholarship, a cheaper country, or a larger contribution. Deciding now is cheaper than deciding after an offer.",
    });
  }

  if (v.parentMeetingDue) {
    out.push({
      id: "meeting",
      urgency: "soon",
      title: "A meeting with the advisor is due",
      detail: "The money and the permission both sit with you, so the meetings that include you are the ones that change anything.",
    });
  }

  if (v.assessmentDone && !v.assessmentReviewed) {
    out.push({
      id: "assessment",
      urgency: "whenever",
      title: "The assessment is done and has not been read back yet",
      detail: "Worth asking about at the next meeting. An assessment nobody discusses with the student is a questionnaire.",
    });
  }

  return out;
}

/** "Mother", "Father", "Guardian 1" — read out of the code itself. */
export function relationshipOf(code: string): string | null {
  const id = parseId(code);
  return id ? relationshipLabel(id.relationship) : null;
}
