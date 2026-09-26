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

function build(): StudentRecord[] {
  const rand = seeded(20260926);
  const out: StudentRecord[] = [];
  const count = 168;

  for (let i = 0; i < count; i += 1) {
    const advisor = ADVISORS[i % ADVISORS.length];
    const serial = String(1 + i).padStart(6, "0");
    const id = formatId({
      country: "PK",
      school: "001",
      campus: "02",
      advisor: advisor.code.slice(-2),
      serial,
      relationship: 0,
    });

    const name = `${FIRST[Math.floor(rand() * FIRST.length)]} ${LAST[Math.floor(rand() * LAST.length)]}`;
    const stage = STAGE_SPREAD[Math.floor(rand() * STAGE_SPREAD.length)];
    const grade = GRADES[Math.floor(rand() * GRADES.length)];
    const programme = PROGRAMMES[Math.floor(rand() * PROGRAMMES.length)];
    const track = TRACKS[Math.floor(rand() * TRACKS.length)];

    const assessmentDone = rand() > 0.22;
    const assessmentReviewed = assessmentDone && rand() > 0.3;
    const hasDeadline = rand() > 0.35;
    const budget = rand() > 0.25 ? 8000 + Math.floor(rand() * 22000) : null;
    const cost = rand() > 0.2 ? 11000 + Math.floor(rand() * 26000) : null;

    out.push({
      id,
      name,
      grade,
      programme,
      advisor: advisor.code,
      campus: CAMPUS.code,
      stage,
      daysInStage: 1 + Math.floor(rand() * 70),
      daysQuiet: Math.floor(rand() * 44),
      profileCompletion: 40 + Math.floor(rand() * 61),
      assessmentDone,
      assessmentReviewed,
      recommendationAwaitingApproval: assessmentReviewed && rand() > 0.82,
      careerTrack: track,
      shortlist: Math.floor(rand() * 12),
      applications: Math.floor(rand() * 7),
      offers: rand() > 0.72 ? 1 + Math.floor(rand() * 3) : 0,
      scholarships: rand() > 0.85 ? 1 : 0,
      documentsMissing: Math.floor(rand() * 5),
      documentsExpired: rand() > 0.9 ? 1 : 0,
      tasksOverdue: rand() > 0.62 ? 1 + Math.floor(rand() * 3) : 0,
      parentMeetingDue: rand() > 0.85,
      prerequisiteConflict: rand() > 0.93,
      budgetUsd: budget,
      estimatedCostUsd: cost,
      nextDeadlineLabel: hasDeadline ? DEADLINES[Math.floor(rand() * DEADLINES.length)] : null,
      nextDeadlineInDays: hasDeadline ? Math.floor(rand() * 40) - 4 : null,
      nextAction: ACTIONS[Math.floor(rand() * ACTIONS.length)],
    });
  }

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
