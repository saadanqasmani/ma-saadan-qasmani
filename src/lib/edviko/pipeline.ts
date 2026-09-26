/**
 * Where a case actually is, and whether anybody should be worried about it.
 *
 * Twenty stages, in the order they happen, each with a definition of done
 * that a person can be finished with. "Application preparation" is not a
 * status. "Every document on the checklist collected for at least one
 * university" is.
 *
 * On top of the stages sit the monitoring rules, and they are the reason
 * this file exists. A pipeline that only records where a student is, is a
 * report. A pipeline that says which of four hundred students needs an
 * advisor this morning is a system. The difference is entirely in the
 * thresholds, so the thresholds are data here rather than numbers buried in
 * a component: a school that answers in three days and a school that answers
 * in ten are both right, and neither should need a deploy to say so.
 */

export type StageId =
  | "registered"
  | "profile"
  | "assessment"
  | "assessment-reviewed"
  | "career-analysis"
  | "career-recommendation"
  | "degree"
  | "country"
  | "university"
  | "financial"
  | "scholarship"
  | "application-prep"
  | "applied"
  | "admission"
  | "visa"
  | "pre-departure"
  | "enrolled"
  | "internship"
  | "graduation"
  | "outcome";

/** Who has to move it. The advisor's list is the one the Action Centre reads. */
export type Owner = "student" | "advisor" | "world";

export type Stage = {
  id: StageId;
  order: number;
  label: string;
  /** What being finished with this stage means. */
  means: string;
  owner: Owner;
  /** Days a case may sit here before the campus should look at it. */
  standard: number;
};

export const STAGES: Stage[] = [
  { id: "registered", order: 1, label: "Registered", means: "The student exists in the system with a permanent code.", owner: "advisor", standard: 7 },
  { id: "profile", order: 2, label: "Profile complete", means: "Nothing important is still missing from the record.", owner: "student", standard: 14 },
  { id: "assessment", order: 3, label: "Assessment done", means: "Academic, aptitude, interest, personality and skills answered.", owner: "student", standard: 21 },
  { id: "assessment-reviewed", order: 4, label: "Assessment reviewed", means: "An advisor has read it and recorded what it shows.", owner: "advisor", standard: 7 },
  { id: "career-analysis", order: 5, label: "Career analysis", means: "Strengths, gaps and contradictions written down with evidence.", owner: "advisor", standard: 10 },
  { id: "career-recommendation", order: 6, label: "Career recommended", means: "A primary pathway and at least one alternative, with reasons.", owner: "advisor", standard: 10 },
  { id: "degree", order: 7, label: "Degree chosen", means: "A programme and its prerequisites, not just a field.", owner: "advisor", standard: 14 },
  { id: "country", order: 8, label: "Country chosen", means: "Countries compared on recognition, cost and admission odds.", owner: "advisor", standard: 14 },
  { id: "university", order: 9, label: "Shortlist built", means: "Reach, match and safe, each with a reason to be on the list.", owner: "advisor", standard: 21 },
  { id: "financial", order: 10, label: "Money counted", means: "Total cost of education and the funding gap, not just tuition.", owner: "advisor", standard: 14 },
  { id: "scholarship", order: 11, label: "Scholarships planned", means: "Every scholarship the student can actually win, with its deadline.", owner: "advisor", standard: 21 },
  { id: "application-prep", order: 12, label: "Applications prepared", means: "Documents, essays and referees ready for at least one university.", owner: "student", standard: 30 },
  { id: "applied", order: 13, label: "Applied", means: "At least one application actually submitted.", owner: "student", standard: 30 },
  { id: "admission", order: 14, label: "Offer received", means: "A university has said yes, conditionally or otherwise.", owner: "world", standard: 60 },
  { id: "visa", order: 15, label: "Visa ready", means: "Every document the consulate asks for is in hand.", owner: "student", standard: 45 },
  { id: "pre-departure", order: 16, label: "Pre-departure", means: "Travel, accommodation, money and briefing settled.", owner: "student", standard: 30 },
  { id: "enrolled", order: 17, label: "Enrolled", means: "Registered as a student. This is the one that counts.", owner: "world", standard: 30 },
  { id: "internship", order: 18, label: "Internship", means: "Working or building skills alongside the degree.", owner: "student", standard: 365 },
  { id: "graduation", order: 19, label: "Graduated", means: "The degree is finished.", owner: "world", standard: 365 },
  { id: "outcome", order: 20, label: "Outcome", means: "Employment or postgraduate study, recorded.", owner: "world", standard: 365 },
];

export const STAGE_BY_ID: Record<StageId, Stage> = Object.fromEntries(
  STAGES.map((s) => [s.id, s])
) as Record<StageId, Stage>;

export function stageOrder(id: StageId): number {
  return STAGE_BY_ID[id]?.order ?? 0;
}

/**
 * The thresholds, in one place, because they are a service standard rather
 * than a fact about the world. A campus that answers in three days and one
 * that answers in ten are both defensible; neither should need a deploy.
 */
export type Thresholds = {
  /** No meaningful activity for this many days: amber, then red. */
  quietAmber: number;
  quietRed: number;
  /** A deadline this close: amber, then red. */
  deadlineAmber: number;
  deadlineRed: number;
  /** Sitting in one stage past its standard by this factor: amber, then red. */
  stalledAmber: number;
  stalledRed: number;
  /** A profile below this is treated as incomplete. */
  profileFloor: number;
};

export const STANDARD: Thresholds = {
  quietAmber: 14,
  quietRed: 30,
  deadlineAmber: 14,
  deadlineRed: 3,
  stalledAmber: 1,
  stalledRed: 2,
  profileFloor: 80,
};

export type Tone = "green" | "amber" | "red";

/** Red beats amber beats green, whatever order they were raised in. */
export function worst(tones: Tone[]): Tone {
  if (tones.includes("red")) return "red";
  if (tones.includes("amber")) return "amber";
  return "green";
}

/**
 * What the system knows about one case, expressed in days rather than dates.
 *
 * Days, deliberately. A dashboard that renders absolute dates has to agree
 * with itself about what time it is on the server and in the browser, and
 * "overdue by two days" is what an advisor reads anyway.
 */
export type CaseFacts = {
  stage: StageId;
  /** Days the case has been sitting in its current stage. */
  daysInStage: number;
  /** Days since anything happened on it at all. */
  daysQuiet: number;
  /** Days until the nearest deadline. Negative means it has passed. */
  nextDeadlineInDays: number | null;
  nextDeadlineLabel: string | null;
  profileCompletion: number;
  assessmentDone: boolean;
  assessmentReviewed: boolean;
  documentsMissing: number;
  documentsExpired: number;
  tasksOverdue: number;
  recommendationAwaitingApproval: boolean;
  parentMeetingDue: boolean;
  /** Cost against budget, where both are known. */
  fundingGapUsd: number | null;
  /** A career recommendation whose required subjects the student is not taking. */
  prerequisiteConflict: boolean;
};

export type Flag = {
  id: string;
  tone: Exclude<Tone, "green">;
  title: string;
  detail: string;
  /** Whose move it is. */
  owner: Owner;
};

/**
 * Every rule in section 22.2 of the concept, in the order an advisor would
 * want to see them: things that have already gone wrong, then things about
 * to.
 */
export function flagsFor(f: CaseFacts, t: Thresholds = STANDARD): Flag[] {
  const out: Flag[] = [];
  const stage = STAGE_BY_ID[f.stage];

  if (f.nextDeadlineInDays !== null && f.nextDeadlineInDays < 0) {
    out.push({
      id: "deadline-missed",
      tone: "red",
      title: "Deadline missed",
      detail: `${f.nextDeadlineLabel ?? "A deadline"} passed ${Math.abs(f.nextDeadlineInDays)} day${Math.abs(f.nextDeadlineInDays) === 1 ? "" : "s"} ago.`,
      owner: "advisor",
    });
  } else if (f.nextDeadlineInDays !== null && f.nextDeadlineInDays <= t.deadlineRed) {
    out.push({
      id: "deadline-now",
      tone: "red",
      title: "Deadline within days",
      detail: `${f.nextDeadlineLabel ?? "A deadline"} is ${f.nextDeadlineInDays === 0 ? "today" : `in ${f.nextDeadlineInDays} days`}.`,
      owner: "student",
    });
  } else if (f.nextDeadlineInDays !== null && f.nextDeadlineInDays <= t.deadlineAmber) {
    out.push({
      id: "deadline-soon",
      tone: "amber",
      title: "Deadline approaching",
      detail: `${f.nextDeadlineLabel ?? "A deadline"} is in ${f.nextDeadlineInDays} days.`,
      owner: "student",
    });
  }

  if (f.tasksOverdue > 0) {
    out.push({
      id: "tasks-overdue",
      tone: f.tasksOverdue > 2 ? "red" : "amber",
      title: `${f.tasksOverdue} overdue task${f.tasksOverdue === 1 ? "" : "s"}`,
      detail: "Work that was agreed and has not been done.",
      owner: "student",
    });
  }

  if (f.documentsExpired > 0) {
    out.push({
      id: "documents-expired",
      tone: "red",
      title: `${f.documentsExpired} expired document${f.documentsExpired === 1 ? "" : "s"}`,
      detail: "An expired document fails an application quietly, after it is sent.",
      owner: "student",
    });
  }

  if (f.documentsMissing > 0) {
    out.push({
      id: "documents-missing",
      tone: f.documentsMissing > 3 ? "red" : "amber",
      title: `${f.documentsMissing} document${f.documentsMissing === 1 ? "" : "s"} missing`,
      detail: "The application cannot be completed without them.",
      owner: "student",
    });
  }

  if (f.prerequisiteConflict) {
    out.push({
      id: "prerequisites",
      tone: "red",
      title: "Career needs subjects they are not taking",
      detail: "The recommendation and the timetable disagree. One of them has to change, and it is easier this year than next.",
      owner: "advisor",
    });
  }

  if (f.recommendationAwaitingApproval) {
    out.push({
      id: "recommendation",
      tone: "amber",
      title: "Recommendation awaiting review",
      detail: "Advice is not advice until a person has signed it.",
      owner: "advisor",
    });
  }

  if (f.assessmentDone && !f.assessmentReviewed) {
    out.push({
      id: "assessment-unreviewed",
      tone: "amber",
      title: "Assessment not reviewed",
      detail: "The student answered. Nobody has read it back to them.",
      owner: "advisor",
    });
  }

  if (f.profileCompletion < t.profileFloor) {
    out.push({
      id: "profile",
      tone: f.profileCompletion < 50 ? "amber" : "amber",
      title: `Profile ${f.profileCompletion}% complete`,
      detail: "Advice built on a half-filled profile is a guess with a logo on it.",
      owner: "student",
    });
  }

  if (f.daysQuiet >= t.quietRed) {
    out.push({
      id: "quiet",
      tone: "red",
      title: `Nothing for ${f.daysQuiet} days`,
      detail: "No meeting, no task, no document, no message. This is how students are lost.",
      owner: "advisor",
    });
  } else if (f.daysQuiet >= t.quietAmber) {
    out.push({
      id: "quiet",
      tone: "amber",
      title: `Quiet for ${f.daysQuiet} days`,
      detail: "Worth a message before it becomes a month.",
      owner: "advisor",
    });
  }

  if (stage) {
    const over = f.daysInStage / stage.standard;
    if (over >= 1 + t.stalledRed) {
      out.push({
        id: "stalled",
        tone: "red",
        title: `Stalled at ${stage.label.toLowerCase()}`,
        detail: `${f.daysInStage} days in a stage the campus allows ${stage.standard} for.`,
        owner: stage.owner,
      });
    } else if (over >= 1 + t.stalledAmber) {
      out.push({
        id: "stalled",
        tone: "amber",
        title: `Slow at ${stage.label.toLowerCase()}`,
        detail: `${f.daysInStage} days against a standard of ${stage.standard}.`,
        owner: stage.owner,
      });
    }
  }

  if (f.parentMeetingDue) {
    out.push({
      id: "parent",
      tone: "amber",
      title: "Parent meeting due",
      detail: "The money and the permission both live with the parents.",
      owner: "advisor",
    });
  }

  if (f.fundingGapUsd !== null && f.fundingGapUsd > 0) {
    out.push({
      id: "funding",
      tone: f.fundingGapUsd > 8000 ? "red" : "amber",
      title: `Funding gap of $${f.fundingGapUsd.toLocaleString("en-US")}`,
      detail: "The shortlist costs more than the family said they have. One of the two has to move.",
      owner: "advisor",
    });
  }

  return out;
}

export function toneFor(f: CaseFacts, t: Thresholds = STANDARD): Tone {
  return worst(flagsFor(f, t).map((x) => x.tone));
}

/** How many cases sit at each stage, for the funnel across a campus. */
export function funnel(stages: StageId[]): { stage: Stage; count: number }[] {
  const counts = new Map<StageId, number>();
  for (const s of stages) counts.set(s, (counts.get(s) ?? 0) + 1);
  return STAGES.map((stage) => ({ stage, count: counts.get(stage.id) ?? 0 }));
}

/**
 * Cases at this stage or past it.
 *
 * The honest way to read a pipeline: a student who has an offer has also
 * completed their profile, whatever the profile flag says about the last
 * field nobody filled in.
 */
export function atOrPast(stages: StageId[], id: StageId): number {
  const floor = stageOrder(id);
  return stages.filter((s) => stageOrder(s) >= floor).length;
}
