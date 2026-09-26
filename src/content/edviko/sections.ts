/**
 * The sections that are named in the plan and not yet built.
 *
 * Each one says what it will do and what it is actually waiting on, which is
 * usually a server, a signed data source or a decision nobody has made yet
 * rather than a week of work. Keeping them honest here is what stops the
 * sidebar from becoming a list of promises.
 */

export type Section = { slug: string; title: string; what: string[]; waiting: string };

export const ADVISOR_SECTIONS: Section[] = [
  {
    slug: "career-intelligence",
    title: "Career intelligence",
    what: [
      "Aptitude, interest, personality and skills read against each other rather than one at a time.",
      "Where a stated ambition and the current subjects disagree, named early enough to change either.",
      "Primary and alternative pathways with the reasoning attached, ready to be filed as a recommendation.",
    ],
    waiting: "the full assessment instrument. The four-question version the students use is a start, not the thing itself.",
  },
  {
    slug: "assessments",
    title: "Assessments",
    what: [
      "Every assessment on the caseload, with what it shows and whether an advisor has read it.",
      "Cohort patterns: interest against aptitude, and the students whose results contradict their plan.",
      "Review queue, so nobody answers fifty questions and hears nothing back.",
    ],
    waiting: "the instrument above, and a decision about which parts a parent may see.",
  },
  {
    slug: "recommendations",
    title: "Recommendations",
    what: [
      "Every recommendation across the caseload, with its review date.",
      "What is due for review because results, money or requirements have changed since it was written.",
      "Approval queue for a supervisor where the campus asks for one.",
    ],
    waiting: "a server. Recommendations are filed on the case file today and live on the device.",
  },
  {
    slug: "universities",
    title: "Universities",
    what: [
      "The 141 universities the students can already search, with the advisor's own notes on each.",
      "Source, verification date and review date on every requirement, so nothing is advised from stale data.",
      "Shortlists built with the student rather than for them, with a reason recorded for each choice.",
    ],
    waiting: "the verification workflow. The data exists; the discipline around refreshing it does not yet.",
  },
  {
    slug: "applications",
    title: "Applications",
    what: [
      "Every application from planned to decided, with what is blocking each one.",
      "Deadlines pulled from the university record rather than typed in twice.",
      "Offers, conditions, deposits and the dates they expire.",
    ],
    waiting: "the deadline intelligence being loaded, and a server to hold application state.",
  },
  {
    slug: "documents",
    title: "Documents",
    what: [
      "A vault per student: transcripts, passports, language certificates, letters, statements.",
      "Expiry dates and version history, because an expired document fails an application quietly.",
      "Requests attached to tasks, so asking for a document and chasing it are the same object.",
    ],
    waiting: "storage that is legal for minors' identity documents. Not a browser, and not this domain.",
  },
  {
    slug: "tasks",
    title: "Tasks",
    what: [
      "Every task across the caseload with an owner and a due date.",
      "Reminders at 30, 14, 7, 3 and 1 day, cancelled automatically when the work is done.",
      "Overdue work escalating to the campus rather than sitting quietly.",
    ],
    waiting: "a messaging provider, sender registration and consent to message minors.",
  },
  {
    slug: "meetings",
    title: "Meetings and messages",
    what: [
      "Student and parent meetings with what was decided, not just that they happened.",
      "One thread per case instead of a WhatsApp history nobody else can read.",
      "Scheduling that knows the deadlines it is scheduling around.",
    ],
    waiting: "the same messaging work, plus a calendar the school already uses.",
  },
  {
    slug: "analytics",
    title: "Analytics",
    what: [
      "The KPI set: profile completion, assessment completion, days to recommendation, deadline compliance, submission rate, offer rate, scholarship rate, enrolment conversion.",
      "Drill-down from any number to the named students behind it.",
      "Trend against the same month last year, once there is a last year.",
    ],
    waiting: "real cases. Analytics on a demo campus is decoration.",
  },
  {
    slug: "reports",
    title: "Reports",
    what: [
      "A case summary another advisor could take over from, exported as a document.",
      "Parent-facing progress reports that say what was advised and why.",
      "Campus and school reporting packs on a schedule.",
    ],
    waiting: "the document pipeline, and a decision about what a parent sees by default.",
  },
];

export const CAMPUS_SECTIONS: Section[] = [
  {
    slug: "allocation",
    title: "Advisor allocation",
    what: [
      "Assign and reassign students, with the workload consequence shown before the change is made.",
      "Balance by case weight rather than headcount: twelve students at application stage is not twelve at registration.",
      "Every move recorded, because reassignment rewrites part of a student's code.",
    ],
    waiting: "a server. Moving a student between advisors changes their code and has to be transactional.",
  },
  {
    slug: "records",
    title: "Academic records",
    what: [
      "Grades and subjects per cohort, with the conversion into the systems universities read.",
      "Students whose results have moved far enough to reopen a recommendation.",
      "Data quality: missing grades, inconsistent subjects, results that never arrived.",
    ],
    waiting: "an import from whatever the school already keeps results in.",
  },
  {
    slug: "applications",
    title: "Applications and offers",
    what: [
      "The campus funnel from planned to enrolled, with the drop-off between each pair of stages.",
      "Offers by university and by country, and what was accepted against what was offered.",
      "Deposit and acceptance deadlines that the campus, not only the student, can see coming.",
    ],
    waiting: "application state on a server.",
  },
  {
    slug: "documents",
    title: "Documents",
    what: [
      "Campus-wide view of what is missing and what has expired.",
      "Which advisors are chasing and which are not.",
      "Retention and deletion, on a schedule somebody has signed.",
    ],
    waiting: "the same storage question as the advisor vault.",
  },
  {
    slug: "assessments",
    title: "Assessments",
    what: [
      "Completion by class and cohort.",
      "Interest against aptitude across the year group, and where the two diverge.",
      "Students whose ambition and prerequisites contradict each other, by grade.",
    ],
    waiting: "the full assessment instrument.",
  },
  {
    slug: "meetings",
    title: "Meetings and tasks",
    what: [
      "Every meeting on the campus, held and missed.",
      "Task compliance by advisor, without turning it into a stick.",
      "Parent engagement, which is the number that predicts the rest.",
    ],
    waiting: "the calendar and messaging work.",
  },
  {
    slug: "communications",
    title: "Communications",
    what: [
      "One record of what the campus has said to students, parents and universities.",
      "Templates for the things said forty times a year, in the languages they are said in.",
      "Consent and opt-out per channel, per guardian.",
    ],
    waiting: "a provider, sender registration and a lawful basis for messaging minors.",
  },
  {
    slug: "reports",
    title: "Reports and analytics",
    what: [
      "Campus pack: pipeline, workload, outcomes, risks, affordability.",
      "School and country rollups above this one, with access following the role.",
      "Export for a board meeting without anybody rebuilding it in a spreadsheet.",
    ],
    waiting: "real cases, and the reporting hierarchy above the campus.",
  },
  {
    slug: "settings",
    title: "Settings",
    what: [
      "The thresholds: how long is quiet, how close is a deadline, how long may a case sit at a stage.",
      "Service standards per stage, which are what the traffic lights read.",
      "Roles, permissions and what each of them may see.",
    ],
    waiting: "accounts. Thresholds without roles are a global variable with a nice screen.",
  },
];

export function findSection(list: Section[], slug: string): Section | null {
  return list.find((s) => s.slug === slug) ?? null;
}
