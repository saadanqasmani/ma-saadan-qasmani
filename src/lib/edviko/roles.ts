/**
 * Who is looking.
 *
 * Three views of one record. This is not authentication and does not pretend
 * to be: there are no accounts yet, so the role is a choice made on the
 * device and every screen behind it says so. When there is a server, the
 * role arrives from the session and this module keeps its shape — which is
 * the point of writing it now rather than scattering `if (isAdvisor)` across
 * forty components later.
 */

export type Role = "student" | "advisor" | "campus" | "family";

export type RoleMeta = {
  id: Role;
  label: string;
  /** The question this person opens the system to answer. */
  question: string;
  home: string;
};

export const ROLES: RoleMeta[] = [
  {
    id: "student",
    label: "Student",
    question: "Where am I, and what do I do next?",
    home: "/edviko",
  },
  {
    id: "advisor",
    label: "Career advisor",
    question: "Which of my students needs me this morning?",
    home: "/edviko/advisor",
  },
  {
    id: "campus",
    label: "Campus supervisor",
    question: "Where is this campus losing people?",
    home: "/edviko/campus",
  },
  {
    id: "family",
    label: "Parent or guardian",
    question: "What is happening, what will it cost, and what do I have to do?",
    home: "/edviko/family",
  },
];

export const ROLE_KEY = "ev-role";

export function roleMeta(id: Role): RoleMeta {
  return ROLES.find((r) => r.id === id) ?? ROLES[0];
}

export function isRole(value: string | null): value is Role {
  return value === "student" || value === "advisor" || value === "campus" || value === "family";
}

/** One entry in a portal's sidebar. */
export type NavItem = {
  href: string;
  label: string;
  /** False while the section is a statement of intent rather than a screen. */
  built: boolean;
};

export const ADVISOR_NAV: NavItem[] = [
  { href: "/edviko/advisor", label: "Home", built: true },
  { href: "/edviko/advisor/students", label: "My students", built: true },
  { href: "/edviko/advisor/career-intelligence", label: "Career intelligence", built: false },
  { href: "/edviko/advisor/assessments", label: "Assessments", built: true },
  { href: "/edviko/advisor/recommendations", label: "Recommendations", built: false },
  { href: "/edviko/advisor/universities", label: "Universities", built: false },
  { href: "/edviko/advisor/deadlines", label: "US deadlines", built: true },
  { href: "/edviko/advisor/applications", label: "Applications", built: false },
  { href: "/edviko/advisor/documents", label: "Documents", built: false },
  { href: "/edviko/advisor/tasks", label: "Tasks", built: false },
  { href: "/edviko/advisor/meetings", label: "Meetings & messages", built: false },
  { href: "/edviko/advisor/analytics", label: "Analytics", built: true },
  { href: "/edviko/advisor/reports", label: "Reports", built: false },
];

export const CAMPUS_NAV: NavItem[] = [
  { href: "/edviko/campus", label: "Dashboard", built: true },
  { href: "/edviko/campus/counsellors", label: "Career counsellors", built: true },
  { href: "/edviko/campus/students", label: "Students", built: true },
  { href: "/edviko/campus/requests", label: "Student requests", built: true },
  { href: "/edviko/campus/allocation", label: "Advisor allocation", built: false },
  { href: "/edviko/campus/records", label: "Academic records", built: false },
  { href: "/edviko/campus/applications", label: "Applications & offers", built: false },
  { href: "/edviko/campus/documents", label: "Documents", built: false },
  { href: "/edviko/campus/assessments", label: "Assessments", built: false },
  { href: "/edviko/campus/meetings", label: "Meetings & tasks", built: false },
  { href: "/edviko/campus/communications", label: "Communications", built: false },
  { href: "/edviko/campus/reports", label: "Reports & analytics", built: true },
  { href: "/edviko/campus/settings", label: "Settings", built: true },
];

export const STUDENT_NAV: NavItem[] = [
  { href: "/edviko", label: "Dashboard", built: true },
  { href: "/edviko/career", label: "Career planner", built: true },
  { href: "/edviko/assessment", label: "Assessment", built: true },
  { href: "/edviko/equivalence", label: "Academic record", built: true },
  { href: "/edviko/match", label: "Universities", built: true },
  { href: "/edviko/plan", label: "My shortlist", built: true },
  { href: "/edviko/costs", label: "What it costs", built: true },
  { href: "/edviko/scholarships", label: "Scholarships", built: true },
  { href: "/edviko/apply", label: "Applications", built: true },
  { href: "/edviko/essay", label: "My essay", built: true },
  { href: "/edviko/profile", label: "My record", built: true },
  { href: "/edviko/talk", label: "My advisor", built: true },
];

export const FAMILY_NAV: NavItem[] = [
  { href: "/edviko/family", label: "Where they are", built: true },
  { href: "/edviko/family/costs", label: "What it costs", built: false },
  { href: "/edviko/family/documents", label: "What we need from you", built: false },
  { href: "/edviko/family/meetings", label: "Meetings", built: false },
  { href: "/edviko/family/messages", label: "Messages", built: false },
];

export function navFor(role: Role): NavItem[] {
  if (role === "family") return FAMILY_NAV;
  if (role === "advisor") return ADVISOR_NAV;
  if (role === "campus") return CAMPUS_NAV;
  return STUDENT_NAV;
}
