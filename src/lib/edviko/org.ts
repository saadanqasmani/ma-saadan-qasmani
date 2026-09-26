/**
 * The institution around the student.
 *
 * Country → school → campus → advisor → student → family. Every level is
 * addressed by a prefix of the student's own code, which means a campus does
 * not need a foreign key to know which students are its own: PK-001-02 is
 * every code that starts with PK-001-02. That is the whole reason the code
 * is shaped the way it is.
 *
 * Nothing here reaches a database. It is the shape the database will have,
 * defined once, so that the day there is a server the screens do not change.
 */

import { advisorCode, campusCode, parseId, type EdvikoId } from "@/lib/edviko/id";
import type { CaseFacts, StageId } from "@/lib/edviko/pipeline";

export type School = {
  /** Two-letter country and three-digit school: PK-001. */
  code: string;
  name: string;
  country: string;
};

export type Campus = {
  /** PK-001-02. */
  code: string;
  school: string;
  name: string;
  city: string;
};

export type Advisor = {
  /** PK-001-02-03. */
  code: string;
  campus: string;
  name: string;
  email: string;
  /** Away, on leave, or carrying a caseload. */
  status: "active" | "leave";
};

/**
 * One student as the institution sees them.
 *
 * Times are days, not dates, everywhere. A dashboard that renders absolute
 * dates has to agree with itself about what time it is on the server and in
 * the browser, and "overdue by two days" is what a person reads anyway.
 */
export type StudentRecord = {
  /** Full Edviko code, relationship 0. */
  id: string;
  name: string;
  grade: "Grade 9" | "Grade 10" | "Grade 11" | "Grade 12" | "Finished";
  programme: "O Level" | "A Level" | "IB" | "FSc" | "High School";
  advisor: string;
  campus: string;
  stage: StageId;
  daysInStage: number;
  daysQuiet: number;
  profileCompletion: number;
  assessmentDone: boolean;
  assessmentReviewed: boolean;
  recommendationAwaitingApproval: boolean;
  careerTrack: string;
  shortlist: number;
  applications: number;
  offers: number;
  scholarships: number;
  documentsMissing: number;
  documentsExpired: number;
  tasksOverdue: number;
  parentMeetingDue: boolean;
  prerequisiteConflict: boolean;
  budgetUsd: number | null;
  estimatedCostUsd: number | null;
  nextDeadlineLabel: string | null;
  nextDeadlineInDays: number | null;
  /** What the student is waiting on right now, in one line. */
  nextAction: string;
};

export type Meeting = {
  id: string;
  at: string;
  with: string;
  kind: "student" | "parent" | "team" | "university";
  subject: string;
};

export type Communication = {
  id: string;
  from: string;
  subject: string;
  hoursAgo: number;
  kind: "university" | "student" | "parent" | "team";
};

/** Something a supervisor has to say yes or no to. */
export type Request = {
  id: string;
  kind: "advisor-change" | "transfer" | "independent" | "reallocation" | "meeting" | "special";
  label: string;
  from: string;
  student: string;
  daysWaiting: number;
  state: "pending" | "in-review" | "approved";
};

export function factsOf(s: StudentRecord): CaseFacts {
  return {
    stage: s.stage,
    daysInStage: s.daysInStage,
    daysQuiet: s.daysQuiet,
    nextDeadlineInDays: s.nextDeadlineInDays,
    nextDeadlineLabel: s.nextDeadlineLabel,
    profileCompletion: s.profileCompletion,
    assessmentDone: s.assessmentDone,
    assessmentReviewed: s.assessmentReviewed,
    documentsMissing: s.documentsMissing,
    documentsExpired: s.documentsExpired,
    tasksOverdue: s.tasksOverdue,
    recommendationAwaitingApproval: s.recommendationAwaitingApproval,
    parentMeetingDue: s.parentMeetingDue,
    fundingGapUsd:
      s.budgetUsd === null || s.estimatedCostUsd === null
        ? null
        : Math.max(0, s.estimatedCostUsd - s.budgetUsd),
    prerequisiteConflict: s.prerequisiteConflict,
  };
}

/** Every student under a code, whatever level that code addresses. */
export function under(students: StudentRecord[], code: string): StudentRecord[] {
  return students.filter((s) => s.id.startsWith(`${code}-`) || s.advisor === code || s.campus === code);
}

export function studentsOfAdvisor(students: StudentRecord[], advisor: string): StudentRecord[] {
  return students.filter((s) => s.advisor === advisor);
}

export function studentsOfCampus(students: StudentRecord[], campus: string): StudentRecord[] {
  return students.filter((s) => s.campus === campus);
}

/** The advisor a code belongs to, read out of the code itself. */
export function advisorOf(studentId: string): string | null {
  const id = parseId(studentId);
  return id ? advisorCode(id) : null;
}

export function campusOf(studentId: string): string | null {
  const id = parseId(studentId);
  return id ? campusCode(id) : null;
}

export function idOf(studentId: string): EdvikoId | null {
  return parseId(studentId);
}

/** First name only, for a greeting. Never for a record. */
export function firstName(name: string): string {
  return name.split(" ")[0];
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}
