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

/**
 * One entry in a portal's sidebar.
 *
 * Grouped, because twelve equal items in a column is an inventory rather
 * than a navigation: a person reading one has to check every line to find
 * the thing they came for. Four headings turn the same twelve into three or
 * four quick decisions.
 */
export type NavItem = {
  href: string;
  label: string;
  /** False while the section is a statement of intent rather than a screen. */
  built: boolean;
  /** The heading it sits under. */
  group: string;
};

/** The order the headings appear in, which is the order the work happens. */
export const GROUP_ORDER = ["Today", "The work", "Reference", "Looking back", "The campus", "Records", "Running it", "Your child"];

export function grouped(items: NavItem[]): { group: string; items: NavItem[] }[] {
  const out: { group: string; items: NavItem[] }[] = [];
  for (const item of items) {
    const found = out.find((g) => g.group === item.group);
    if (found) found.items.push(item);
    else out.push({ group: item.group, items: [item] });
  }
  return out.sort((a, b) => {
    const ai = GROUP_ORDER.indexOf(a.group);
    const bi = GROUP_ORDER.indexOf(b.group);
    return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
  });
}

export const ADVISOR_NAV: NavItem[] = [
  { href: "/edviko/advisor", label: "Today", built: true, group: "Today" },
  { href: "/edviko/advisor/students", label: "My students", built: true, group: "Today" },
  { href: "/edviko/advisor/assessments", label: "Assessments", built: true, group: "The work" },
  { href: "/edviko/advisor/applications", label: "Applications", built: true, group: "The work" },
  { href: "/edviko/advisor/recommendations", label: "Recommendations", built: false, group: "The work" },
  { href: "/edviko/advisor/documents", label: "Documents", built: true, group: "The work" },
  { href: "/edviko/advisor/tasks", label: "Tasks", built: true, group: "The work" },
  { href: "/edviko/advisor/meetings", label: "Meetings & messages", built: false, group: "The work" },
  { href: "/edviko/advisor/deadlines", label: "US deadlines", built: true, group: "Reference" },
  { href: "/edviko/advisor/universities", label: "Universities", built: false, group: "Reference" },
  { href: "/edviko/advisor/career-intelligence", label: "Career intelligence", built: false, group: "Reference" },
  { href: "/edviko/advisor/analytics", label: "Analytics", built: true, group: "Looking back" },
  { href: "/edviko/advisor/reports", label: "Reports", built: false, group: "Looking back" },
];

export const CAMPUS_NAV: NavItem[] = [
  { href: "/edviko/campus", label: "Today", built: true, group: "The campus" },
  { href: "/edviko/campus/counsellors", label: "Career counsellors", built: true, group: "The campus" },
  { href: "/edviko/campus/students", label: "Students", built: true, group: "The campus" },
  { href: "/edviko/campus/requests", label: "Requests", built: true, group: "The campus" },
  { href: "/edviko/campus/records", label: "Academic records", built: false, group: "Records" },
  { href: "/edviko/campus/applications", label: "Applications & offers", built: false, group: "Records" },
  { href: "/edviko/campus/assessments", label: "Assessments", built: false, group: "Records" },
  { href: "/edviko/campus/documents", label: "Documents", built: false, group: "Records" },
  { href: "/edviko/campus/allocation", label: "Advisor allocation", built: false, group: "Running it" },
  { href: "/edviko/campus/meetings", label: "Meetings & tasks", built: false, group: "Running it" },
  { href: "/edviko/campus/communications", label: "Communications", built: false, group: "Running it" },
  { href: "/edviko/campus/settings", label: "Settings", built: true, group: "Running it" },
  { href: "/edviko/campus/reports", label: "Reports & analytics", built: true, group: "Looking back" },
];

export const STUDENT_NAV: NavItem[] = [
  { href: "/edviko", label: "Dashboard", built: true, group: "Today" },
  { href: "/edviko/career", label: "Career planner", built: true, group: "The work" },
  { href: "/edviko/assessment", label: "Assessment", built: true, group: "The work" },
  { href: "/edviko/equivalence", label: "Academic record", built: true, group: "The work" },
  { href: "/edviko/match", label: "Universities", built: true, group: "The work" },
  { href: "/edviko/plan", label: "My shortlist", built: true, group: "The work" },
  { href: "/edviko/costs", label: "What it costs", built: true, group: "The work" },
  { href: "/edviko/scholarships", label: "Scholarships", built: true, group: "The work" },
  { href: "/edviko/apply", label: "Applications", built: true, group: "The work" },
  { href: "/edviko/essay", label: "My essay", built: true, group: "The work" },
  { href: "/edviko/profile", label: "My record", built: true, group: "Reference" },
  { href: "/edviko/talk", label: "My advisor", built: true, group: "Reference" },
];

export const FAMILY_NAV: NavItem[] = [
  { href: "/edviko/family", label: "Where they are", built: true, group: "Your child" },
  { href: "/edviko/family/costs", label: "What it costs", built: false, group: "Your child" },
  { href: "/edviko/family/documents", label: "What we need from you", built: false, group: "Your child" },
  { href: "/edviko/family/meetings", label: "Meetings", built: false, group: "Your child" },
  { href: "/edviko/family/messages", label: "Messages", built: false, group: "Your child" },
];

export function navFor(role: Role): NavItem[] {
  if (role === "family") return FAMILY_NAV;
  if (role === "advisor") return ADVISOR_NAV;
  if (role === "campus") return CAMPUS_NAV;
  return STUDENT_NAV;
}
