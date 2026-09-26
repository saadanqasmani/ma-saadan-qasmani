/**
 * A campus that does not exist, built so the ones that will can be seen.
 *
 * Every advisor and campus screen needs a caseload before it can be judged:
 * eight students prove nothing, because the whole argument for this system
 * is what happens when one advisor holds two hundred. So the campus is
 * generated rather than typed, from a fixed seed, which means it is the same
 * campus on every render and in every browser while staying large enough to
 * be honest about crowding, sorting and exception handling.
 *
 * Every person here is invented. The school, the students, the advisors and
 * the parents are fictional, and the only real names in the file are the
 * countries and the universities, which are facts.
 *
 * Times are days rather than dates on purpose. A demo pinned to real dates
 * is stale by the following week and renders differently on the server than
 * in the browser; "overdue by two days" is both stable and what an advisor
 * actually reads.
 */

import { formatId } from "@/lib/edviko/id";
import type { CaseEntry } from "@/lib/edviko/cases";
import type { Advisor, Campus, Communication, Meeting, Request, School, StudentRecord } from "@/lib/edviko/org";
import type { StageId } from "@/lib/edviko/pipeline";

export const SCHOOL: School = {
  code: "PK-001",
  name: "ABC International School",
  country: "PK",
};

export const CAMPUS: Campus = {
  code: "PK-001-02",
  school: "PK-001",
  name: "Islamabad Campus",
  city: "Islamabad",
};

export const ADVISORS: Advisor[] = [
  { code: "PK-001-02-01", campus: CAMPUS.code, name: "Ayesha Malik", email: "ayesha.malik@example.edu", status: "active" },
  { code: "PK-001-02-02", campus: CAMPUS.code, name: "Bilal Ahmed", email: "bilal.ahmed@example.edu", status: "active" },
  { code: "PK-001-02-03", campus: CAMPUS.code, name: "Zara Khan", email: "zara.khan@example.edu", status: "active" },
  { code: "PK-001-02-04", campus: CAMPUS.code, name: "Hassan Raza", email: "hassan.raza@example.edu", status: "active" },
  { code: "PK-001-02-05", campus: CAMPUS.code, name: "Laiba Fatima", email: "laiba.fatima@example.edu", status: "active" },
  { code: "PK-001-02-06", campus: CAMPUS.code, name: "Omar Farooq", email: "omar.farooq@example.edu", status: "active" },
  { code: "PK-001-02-07", campus: CAMPUS.code, name: "Nida Aslam", email: "nida.aslam@example.edu", status: "leave" },
  { code: "PK-001-02-08", campus: CAMPUS.code, name: "Ali Raza", email: "ali.raza@example.edu", status: "active" },
];

/** The supervisor the campus screens are drawn for. */
export const SUPERVISOR = { name: "Sara Khan", code: "PK-001-02-00", title: "Campus Supervisor" };

/** Who the advisor screens are drawn for. */
export const SIGNED_IN_ADVISOR = ADVISORS[0];

const FIRST = [
  "Ahmed", "Ayesha", "Bilal", "Fatima", "Hassan", "Zainab", "Omar", "Laiba", "Usman", "Maryam",
  "Hamza", "Sana", "Ali", "Noor", "Saad", "Hira", "Danish", "Amna", "Faisal", "Rabia",
  "Taimur", "Iqra", "Shahzeb", "Mehwish", "Junaid", "Areeba", "Kashif", "Zoya", "Adnan", "Sadia",
];

const LAST = [
  "Malik", "Khan", "Ahmed", "Hussain", "Raza", "Farooq", "Iqbal", "Siddiqui", "Qureshi", "Sheikh",
  "Butt", "Chaudhry", "Abbasi", "Mirza", "Shah", "Baig", "Ansari", "Rehman", "Javed", "Tariq",
];

const TRACKS = [
  "Engineering", "Medicine & health", "Computing & AI", "Business & finance", "Law",
  "Architecture & design", "Social sciences", "Natural sciences", "Arts & media",
];

const GRADES: StudentRecord["grade"][] = ["Grade 10", "Grade 11", "Grade 12", "Grade 12", "Grade 11"];
const PROGRAMMES: StudentRecord["programme"][] = ["O Level", "A Level", "A Level", "IB", "FSc"];

const STAGE_SPREAD: StageId[] = [
  "registered", "profile", "profile", "assessment", "assessment", "assessment-reviewed",
  "career-analysis", "career-recommendation", "career-recommendation", "degree", "country",
  "university", "university", "financial", "scholarship", "application-prep", "application-prep",
  "applied", "applied", "admission", "visa", "pre-departure", "enrolled",
];

const DEADLINES = [
  "IELTS booking", "Common App essay", "Transcript upload", "Scholarship application",
  "Early Action deadline", "SAT registration", "Recommendation letter", "Financial aid form",
  "Visa appointment", "Deposit payment",
];

const ACTIONS = [
  "Submit IELTS score", "Complete career assessment", "Upload transcript", "Finalise university shortlist",
  "Review career report", "Complete academic history", "Book parent meeting", "Send recommendation request",
  "Pay application fee", "Prepare visa file",
];

/** Deterministic, so the campus is the same campus everywhere it is drawn. */
function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a += 0x6d2b79f5;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Caseloads are uneven, because real ones are.
 *
 * A campus where every advisor holds exactly the same number of students is
 * a campus where the allocation screen has nothing to say. These add to the
 * whole intake, heaviest first.
 */
const LOAD = [26, 24, 22, 21, 20, 19, 18, 18];

/**
 * Most students are fine.
 *
 * This is the number that decides whether the traffic lights are worth
 * anything. An earlier version of this file drew every field independently
 * at random and produced a campus where three quarters of the students were
 * red, which is not a busy campus, it is a broken alarm: an advisor who
 * opens a list of a hundred and thirty emergencies learns to close it.
 *
 * So each student is drawn as a whole case instead. Seven in ten are on
 * track, two in ten need something this month, and one in twelve is in real
 * trouble — which is roughly what a well-run campus looks like, and is the
 * distribution the triage has to prove itself against.
 */
type Health = "fine" | "watch" | "trouble";

function build(): StudentRecord[] {
  const rand = seeded(20260926);
  const out: StudentRecord[] = [];

  const assignment: number[] = [];
  LOAD.forEach((n, advisorIndex) => {
    for (let i = 0; i < n; i += 1) assignment.push(advisorIndex);
  });

  assignment.forEach((advisorIndex, i) => {
    const advisor = ADVISORS[advisorIndex];
    const serial = String(1 + i).padStart(6, "0");
    const id = formatId({
      country: "PK",
      school: "001",
      campus: "02",
      advisor: advisor.code.slice(-2),
      serial,
      relationship: 0,
    });

    const draw = rand();
    const health: Health = draw < 0.7 ? "fine" : draw < 0.92 ? "watch" : "trouble";

    const name = `${FIRST[Math.floor(rand() * FIRST.length)]} ${LAST[Math.floor(rand() * LAST.length)]}`;
    const stage = STAGE_SPREAD[Math.floor(rand() * STAGE_SPREAD.length)];
    const grade = GRADES[Math.floor(rand() * GRADES.length)];
    const programme = PROGRAMMES[Math.floor(rand() * PROGRAMMES.length)];
    const track = TRACKS[Math.floor(rand() * TRACKS.length)];

    const assessmentDone = health === "trouble" ? rand() > 0.55 : rand() > 0.12;
    const assessmentReviewed = assessmentDone && (health === "fine" ? rand() > 0.15 : rand() > 0.6);

    const daysQuiet =
      health === "fine" ? Math.floor(rand() * 11)
      : health === "watch" ? 11 + Math.floor(rand() * 14)
      : 26 + Math.floor(rand() * 20);

    const profileCompletion =
      health === "fine" ? 82 + Math.floor(rand() * 19)
      : health === "watch" ? 62 + Math.floor(rand() * 22)
      : 38 + Math.floor(rand() * 30);

    const documentsMissing =
      health === "fine" ? (rand() > 0.75 ? 1 : 0)
      : health === "watch" ? 1 + Math.floor(rand() * 2)
      : 3 + Math.floor(rand() * 3);

    const tasksOverdue =
      health === "fine" ? 0
      : health === "watch" ? (rand() > 0.5 ? 1 : 0)
      : 2 + Math.floor(rand() * 3);

    // A deadline is only a deadline if there is one. Roughly half the
    // caseload is between rounds at any moment.
    const hasDeadline = rand() > 0.45;
    const nextDeadlineInDays = !hasDeadline
      ? null
      : health === "fine" ? 20 + Math.floor(rand() * 60)
      : health === "watch" ? 5 + Math.floor(rand() * 16)
      : Math.floor(rand() * 9) - 5;

    // Stage standards are generous; only the struggling cases run past them.
    const daysInStage =
      health === "fine" ? 1 + Math.floor(rand() * 14)
      : health === "watch" ? 8 + Math.floor(rand() * 20)
      : 25 + Math.floor(rand() * 45);

    const budgetUsd = rand() > 0.14 ? 9000 + Math.floor(rand() * 20000) : null;
    const estimatedCostUsd =
      budgetUsd === null
        ? (rand() > 0.3 ? 12000 + Math.floor(rand() * 20000) : null)
        : health === "fine"
          ? Math.round(budgetUsd * (0.7 + rand() * 0.3))
          : health === "watch"
            ? Math.round(budgetUsd * (1 + rand() * 0.25))
            : Math.round(budgetUsd * (1.3 + rand() * 0.8));

    out.push({
      id,
      name,
      grade,
      programme,
      advisor: advisor.code,
      campus: CAMPUS.code,
      stage,
      daysInStage,
      daysQuiet,
      profileCompletion,
      assessmentDone,
      assessmentReviewed,
      recommendationAwaitingApproval: assessmentReviewed && rand() > 0.88,
      careerTrack: track,
      shortlist: Math.floor(rand() * 12),
      applications: Math.floor(rand() * 7),
      offers: rand() > 0.72 ? 1 + Math.floor(rand() * 3) : 0,
      scholarships: rand() > 0.85 ? 1 : 0,
      documentsMissing,
      documentsExpired: health === "trouble" && rand() > 0.6 ? 1 : 0,
      tasksOverdue,
      parentMeetingDue: rand() > (health === "fine" ? 0.93 : 0.75),
      prerequisiteConflict: health === "trouble" && rand() > 0.72,
      budgetUsd,
      estimatedCostUsd,
      nextDeadlineLabel: hasDeadline ? DEADLINES[Math.floor(rand() * DEADLINES.length)] : null,
      nextDeadlineInDays,
      nextAction: ACTIONS[Math.floor(rand() * ACTIONS.length)],
    });
  });

  return out;
}

export const STUDENTS: StudentRecord[] = build();

export const MEETINGS: Meeting[] = [
  { id: "m1", at: "09:30", with: "Muhammad Ali", kind: "student", subject: "University shortlisting" },
  { id: "m2", at: "10:30", with: "Sara Faisal and parents", kind: "parent", subject: "Discussing application progress" },
  { id: "m3", at: "13:00", with: "Counsellor team", kind: "team", subject: "Weekly progress review" },
  { id: "m4", at: "14:00", with: "Istanbul Technical University", kind: "university", subject: "Scholarship information update" },
  { id: "m5", at: "16:00", with: "Hassan Khan", kind: "student", subject: "Career assessment feedback" },
];

export const COMMUNICATIONS: Communication[] = [
  { id: "c1", from: "University of Toronto", subject: "Application received — Zara Khan", hoursAgo: 2, kind: "university" },
  { id: "c2", from: "Ayesha Malik", subject: "Re: IELTS preparation", hoursAgo: 4, kind: "student" },
  { id: "c3", from: "Parent — Hamza Ali", subject: "Thank you for the guidance", hoursAgo: 5, kind: "parent" },
  { id: "c4", from: "Istanbul Technical University", subject: "Scholarship information updated", hoursAgo: 6, kind: "university" },
  { id: "c5", from: "Team update", subject: "New university partnerships", hoursAgo: 26, kind: "team" },
];

export const REQUESTS: Request[] = [
  { id: "r1", kind: "advisor-change", label: "Change of career advisor", from: "Bilal Ahmed", student: "Zara Khan", daysWaiting: 2, state: "pending" },
  { id: "r2", kind: "independent", label: "Attach independent student", from: "Laiba Fatima", student: "Ahmed Shah", daysWaiting: 4, state: "pending" },
  { id: "r3", kind: "transfer", label: "Transfer from another campus", from: "Hassan Khan", student: "Hassan Khan", daysWaiting: 1, state: "in-review" },
  { id: "r4", kind: "reallocation", label: "Re-allocation of students", from: "Omar Farooq", student: "Zara Ali", daysWaiting: 1, state: "pending" },
  { id: "r5", kind: "meeting", label: "Advisor meeting request", from: "Rehan Ahmed", student: "Rehan Ahmed", daysWaiting: 3, state: "approved" },
  { id: "r6", kind: "special", label: "Special guidance request", from: "Nida Aslam", student: "Sana Iqbal", daysWaiting: 6, state: "pending" },
];

/**
 * A case history, generated from the student's own code.
 *
 * Deterministic, so opening the same case twice shows the same history, and
 * derived from the serial rather than stored, so a hundred and sixty-eight
 * histories do not have to be written by hand to see whether the screen
 * holds them.
 */
export function historyFor(studentId: string): CaseEntry[] {
  const serial = Number(studentId.split("-")[4] ?? "0");
  const rand = seeded(serial * 7919 + 17);
  const advisor = ADVISORS[(serial - 1) % ADVISORS.length] ?? ADVISORS[0];

  const pool: Omit<CaseEntry, "id" | "daysAgo" | "by">[] = [
    { kind: "status", title: "Case opened", body: "Registered at the campus and assigned an advisor.", source: "advisor" },
    { kind: "assessment", title: "Career assessment completed", body: "Aptitude, interests, personality and skills answered in full.", source: "student" },
    { kind: "assessment", title: "Assessment reviewed", body: "Read against the academic record. Interest in medicine, aptitude stronger in analytical reasoning than in biology.", source: "advisor" },
    { kind: "meeting", title: "Counselling session", body: "Forty minutes on career direction. Family present for the last ten.", source: "advisor" },
    { kind: "recommendation", title: "Career pathway recommended", body: "Primary: computing and AI. Alternative: electrical engineering. Reasons and alternatives recorded on the recommendation.", source: "advisor" },
    { kind: "document", title: "Transcript uploaded", body: "Two years of results, verified against the school record.", source: "verified" },
    { kind: "meeting", title: "Parent meeting", body: "Budget discussed honestly. Family can fund about two thirds of a year abroad.", source: "student" },
    { kind: "application", title: "Shortlist agreed", body: "Two reach, three match, two safe. Each with a reason to be on the list.", source: "advisor" },
    { kind: "note", title: "Cost analysis prepared", body: "Total cost of education, not tuition. Funding gap identified and scholarships matched against it.", source: "advisor" },
    { kind: "application", title: "Application submitted", body: "First application filed, documents attached and checked.", source: "advisor" },
  ];

  const count = 3 + Math.floor(rand() * (pool.length - 3));
  let days = 2 + Math.floor(rand() * 8);
  const out: CaseEntry[] = [];
  for (let i = count - 1; i >= 0; i -= 1) {
    out.push({ ...pool[i], id: `${studentId}-h${i}`, daysAgo: days, by: advisor.name });
    days += 3 + Math.floor(rand() * 20);
  }
  return out;
}
