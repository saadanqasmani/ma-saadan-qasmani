/**
 * The measures a campus is actually run on.
 *
 * Two rules, and the second is the one that matters.
 *
 * Every number is computed from the cases, at the moment it is read. None of
 * them is stored, so none of them can drift away from what the individual
 * records say — which is how a management report and the people it describes
 * end up disagreeing, and why anybody who has worked under one distrusts it.
 *
 * And a measure that cannot be computed honestly says so, with the reason,
 * instead of being quietly dropped from the page or filled with a plausible
 * number. Half the indicators the concept asks for need data this system
 * does not capture yet: how long a case took from registration to its first
 * recommendation needs timestamps on the stages, and satisfaction needs
 * somebody to have asked. Showing them as "not measured yet, and here is
 * what it would take" is the difference between a roadmap and a fiction.
 */

import type { StudentRecord } from "@/lib/edviko/org";
import { factsOf } from "@/lib/edviko/org";
import { atOrPast, flagsFor, STANDARD, type Thresholds } from "@/lib/edviko/pipeline";

export type Kpi = {
  id: string;
  label: string;
  /** Null when it cannot be computed from what is recorded. */
  value: number | null;
  unit: "%" | "days" | "count";
  /** What the number is of, for the ones that are a share. */
  of?: string;
  /** What it means, and what a bad number would be telling you. */
  means: string;
  /** Why it cannot be computed, when it cannot. */
  missing?: string;
  /** Higher is better, unless this says otherwise. */
  lowerIsBetter?: boolean;
};

export type Group = { id: string; label: string; note: string; kpis: Kpi[] };

function share(n: number, d: number): number | null {
  return d === 0 ? null : Math.round((n / d) * 100);
}

export function kpisFor(students: StudentRecord[], t: Thresholds = STANDARD): Group[] {
  const total = students.length;
  const stages = students.map((s) => s.stage);
  const flagged = students.map((s) => flagsFor(factsOf(s), t));
  const anyFlag = (i: number, id: string) => flagged[i].some((f) => f.id === id);

  const assessed = students.filter((s) => s.assessmentDone);
  const applied = students.filter((s) => s.applications > 0);
  const withOffers = students.filter((s) => s.offers > 0);
  const withDeadline = students.filter((s) => s.nextDeadlineInDays !== null);
  const passed = withDeadline.filter((s) => (s.nextDeadlineInDays ?? 0) < 0);

  return [
    {
      id: "coverage",
      label: "Coverage",
      note: "How much of the campus has actually been advised, as opposed to registered.",
      kpis: [
        {
          id: "profile",
          label: "Average profile completion",
          value: total === 0 ? null : Math.round(students.reduce((n, s) => n + s.profileCompletion, 0) / total),
          unit: "%",
          means: "Advice built on a half-filled profile is a guess with a logo on it. Below about 70 across a campus means the intake process is not finishing.",
        },
        {
          id: "assessment",
          label: "Assessment completed",
          value: share(assessed.length, total),
          unit: "%",
          of: "all students",
          means: "The first thing that has to happen. A campus that cannot get this above 80 has a scheduling problem, not a software problem.",
        },
        {
          id: "reviewed",
          label: "Assessments read back",
          value: share(assessed.filter((s) => s.assessmentReviewed).length, assessed.length),
          unit: "%",
          of: "completed assessments",
          means: "The measure nobody keeps. An assessment nobody discusses with the student is a questionnaire, and this is the number that says whether the campus is doing the work or collecting the data.",
        },
        {
          id: "career-plan",
          label: "Career plan agreed",
          value: share(atOrPast(stages, "career-recommendation"), total),
          unit: "%",
          of: "all students",
          means: "A recommendation with reasons attached, not a preference. Everything downstream depends on it.",
        },
        {
          id: "shortlist",
          label: "Shortlist built",
          value: share(atOrPast(stages, "university"), total),
          unit: "%",
          of: "all students",
          means: "Reach, match and safe, each with a reason to be on the list.",
        },
        {
          id: "financial",
          label: "Money counted",
          value: share(students.filter((s) => s.budgetUsd !== null && s.estimatedCostUsd !== null).length, total),
          unit: "%",
          of: "all students",
          means: "Both halves: what it costs and what the family has. One without the other decides nothing.",
        },
      ],
    },
    {
      id: "service",
      label: "Service",
      note: "Whether the campus is keeping its own promises to the students in it.",
      kpis: [
        {
          id: "overdue",
          label: "Students with overdue work",
          value: share(students.filter((s) => s.tasksOverdue > 0).length, total),
          unit: "%",
          of: "all students",
          lowerIsBetter: true,
          means: "Work that was agreed and has not been done. A rising number here is usually a caseload problem rather than a student problem.",
        },
        {
          id: "deadline",
          label: "Deadlines still met",
          value: share(withDeadline.length - passed.length, withDeadline.length),
          unit: "%",
          of: "students with a deadline",
          means: "Of the students with a deadline on record, those who have not already passed it. This is the number that ends a year badly.",
        },
        {
          id: "quiet",
          label: "Students nobody has contacted",
          value: share(flagged.filter((f) => f.some((x) => x.id === "quiet")).length, total),
          unit: "%",
          of: "all students",
          lowerIsBetter: true,
          means: `Beyond the campus standard of ${t.quietAmber} days. This is how students are lost, and it is always visible before it happens.`,
        },
        {
          id: "stalled",
          label: "Cases stalled at a stage",
          value: share(students.filter((_, i) => anyFlag(i, "stalled")).length, total),
          unit: "%",
          of: "all students",
          lowerIsBetter: true,
          means: "Past the time this campus allows for the stage they are sitting in.",
        },
        {
          id: "days-to-recommendation",
          label: "Days from registration to first recommendation",
          value: null,
          unit: "days",
          means: "The single best measure of whether a campus is advising or processing.",
          missing: "Stages are recorded as where a case is, not when it got there. This needs a timestamp on every stage change, which needs a server.",
        },
        {
          id: "satisfaction",
          label: "Student and parent satisfaction",
          value: null,
          unit: "%",
          means: "The one number that catches what the others miss.",
          missing: "Nobody has been asked. It needs a short survey after each meeting, and a decision about who sees the answers.",
        },
      ],
    },
    {
      id: "outcomes",
      label: "Outcomes",
      note: "What came of it, counted honestly rather than in the way that flatters.",
      kpis: [
        {
          id: "submission",
          label: "Applications submitted",
          value: share(atOrPast(stages, "applied"), total),
          unit: "%",
          of: "all students",
          means: "Of everyone on the campus, not of everyone who reached the end. Measuring it the other way is how consultancies report 95% success.",
        },
        {
          id: "offer",
          label: "Received an offer",
          value: share(withOffers.length, applied.length),
          unit: "%",
          of: "students who applied",
          means: "Offers per applicant. A very high number usually means the shortlists are too safe.",
        },
        {
          id: "scholarship",
          label: "Won a scholarship",
          value: share(students.filter((s) => s.scholarships > 0).length, total),
          unit: "%",
          of: "all students",
          means: "Against the whole campus, because the students who need one most are the ones least likely to have applied.",
        },
        {
          id: "enrolment",
          label: "Enrolled after an offer",
          value: share(atOrPast(stages, "enrolled"), withOffers.length),
          unit: "%",
          of: "students with an offer",
          means: "Where a year's work is quietly lost: money, visas and cold feet all land between the offer and the first term.",
        },
        {
          id: "graduate-outcome",
          label: "Employment or postgraduate study",
          value: null,
          unit: "%",
          means: "The reason for all of it, and the only measure a parent really cares about.",
          missing: "Nobody has graduated through this system yet. It needs alumni records and the years to fill them.",
        },
      ],
    },
    {
      id: "quality",
      label: "Data quality",
      note: "Whether the numbers above can be trusted, which has to be measured too.",
      kpis: [
        {
          id: "complete-records",
          label: "Records complete enough to advise on",
          value: share(students.filter((s) => s.profileCompletion >= t.profileFloor && s.budgetUsd !== null).length, total),
          unit: "%",
          of: "all students",
          means: "A profile above the campus floor with a budget on it. Everything else on this page is only as good as this number.",
        },
        {
          id: "no-budget",
          label: "No budget recorded",
          value: share(students.filter((s) => s.budgetUsd === null).length, total),
          unit: "%",
          of: "all students",
          lowerIsBetter: true,
          means: "Without it a shortlist is a wish. It is also the single easiest gap to close: one question, asked once.",
        },
        {
          id: "no-cost",
          label: "No cost calculated",
          value: share(students.filter((s) => s.estimatedCostUsd === null).length, total),
          unit: "%",
          of: "all students",
          lowerIsBetter: true,
          means: "A shortlist nobody has priced. Usually means the advisor has not got to the money conversation yet.",
        },
        {
          id: "university-verification",
          label: "University data within its review date",
          value: null,
          unit: "%",
          means: "Requirements and deadlines go stale every year, and advising from stale data is worse than advising from none.",
          missing: "Universities carry a source but not yet a review date and a responsible reviewer. That is a schema change and a workflow, not a screen.",
        },
      ],
    },
  ];
}
