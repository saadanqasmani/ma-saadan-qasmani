/**
 * The workroom's model: what a task is, what it is worth, and the rules of
 * the game. Ported from the original tracker, so the numbers and the badges
 * carry over, and extended with what two people need to hand each other.
 */

export type Persona = "saadan" | "osman";
export type Segment = "academic" | "administrative";
export type Status = "not_started" | "in_progress" | "blocked" | "done";

export type Comment = { by: Persona; at: string; text: string };

export type Attachment = {
  id: string;
  name: string;
  path: string;
  type?: string;
  by: Persona;
  at: string;
  note: string;
  comments: Comment[];
};

export type Task = {
  id: string;
  segment: Segment;
  title: string;
  desc: string;
  when: string;
  due: string | null;
  status: Status;
  percent: number;
  order: number;
  recurring?: boolean;
  checklist: { text: string; done: boolean }[];
  notes?: string;
  lastReset?: string;
  fromMeeting?: string;
  /** Who put it on the board. Osman's assignments are marked. */
  createdBy?: Persona;
  comments?: Comment[];
  /** Finished work handed over for review. */
  submissions?: Attachment[];
  /** Saadan asks, Osman answers. */
  approval?: "requested" | "approved" | "changes" | null;
  /** Osman's call on where this sits. Absent means ordinary. */
  priority?: Priority;
  /**
   * Osman leaning on something, in writing.
   *
   * Said out loud and dated rather than mentioned in passing, so "I told
   * you this was urgent" is a thing the board can settle.
   */
  nudge?: Nudge | null;
};

export type Priority = "urgent" | "high" | "normal" | "later";

export const PRIORITIES: { id: Priority; label: string; tone: string }[] = [
  { id: "urgent", label: "Urgent", tone: "var(--coral)" },
  { id: "high", label: "High", tone: "var(--yellow-deep)" },
  { id: "normal", label: "Normal", tone: "var(--ink-soft)" },
  { id: "later", label: "Later", tone: "var(--ink-faint)" },
];

export type Nudge = {
  kind: "faster" | "start-next";
  by: Persona;
  at: string;
  note: string;
};

export type MeetingItem = {
  text: string;
  segment: Segment;
  due: string | null;
  confirmed: boolean;
  taskId: string | null;
};

export type Meeting = {
  id: string;
  date: string;
  with: string;
  title: string;
  notes: string;
  items: MeetingItem[];
};

export type Attendance = {
  status: "campus" | "remote" | "leave" | "off";
  hours: number;
  checkInAt: string | null;
  note: string;
};

export type Awarded = { id: string; name: string; note: string; at: string; glyph: string };

export type Meta = {
  days: string[];
  xpByDay: Record<string, number>;
  badges: string[];
  /** Given by Osman, by hand. */
  awarded: Awarded[];
  /** The one task actually being worked on, and since when. */
  working?: { taskId: string; since: string } | null;
};

export type Material = Attachment;

/**
 * A small question, answerable without a conversation.
 *
 * The thing that actually eats a day is waiting on a yes. So this is a
 * question with two buttons on it, and a third door for when two buttons
 * are not enough.
 */
export type Ask = {
  id: string;
  by: Persona;
  at: string;
  text: string;
  /** Null until answered. */
  answer: "yes" | "no" | null;
  answeredAt: string | null;
  /** Said instead of, or as well as, the button. */
  reply: string;
};

/** Where someone is, right now. */
export type PresenceState = "desk" | "smoke" | "break" | "lunch" | "meeting" | "out" | "home";

export type Presence = {
  state: PresenceState;
  /** When they went into this state, so the page can say how long. */
  since: string;
  note: string;
};

export const PRESENCE: { id: PresenceState; label: string; short: string; glyph: string; here: boolean }[] = [
  { id: "desk", label: "At my desk", short: "Desk", glyph: "●", here: true },
  { id: "smoke", label: "Out for a smoke", short: "Smoke", glyph: "◦", here: false },
  { id: "break", label: "On a break", short: "Break", glyph: "◦", here: false },
  { id: "lunch", label: "At lunch", short: "Lunch", glyph: "◦", here: false },
  { id: "meeting", label: "In a meeting", short: "Meeting", glyph: "◑", here: false },
  { id: "out", label: "Out of the office", short: "Out", glyph: "○", here: false },
  { id: "home", label: "Gone for the day", short: "Home", glyph: "○", here: false },
];

export function presenceMeta(state: PresenceState) {
  return PRESENCE.find((p) => p.id === state) ?? PRESENCE[0];
}

export const EMPTY_PRESENCE: Presence = { state: "out", since: "", note: "" };

/**
 * A meeting that has not happened yet.
 *
 * Deliberately separate from the Meeting record, which is a log of one that
 * did. Mixing the two means the thing you have to prepare for and the thing
 * you have to remember sit in the same list, and neither gets read.
 */
export type Appointment = {
  id: string;
  title: string;
  /** Local date and time, as the browser's datetime-local gives it. */
  at: string;
  minutes: number;
  /** Anyone outside the two of them. Free text on purpose. */
  guests: string;
  /** Which of the two are in it. */
  who: Persona[];
  where: string;
  by: Persona;
  note: string;
  status: "proposed" | "confirmed" | "declined";
};

export type OpsState = {
  tasks: Task[];
  meetings: Meeting[];
  attendance: Record<string, Attendance>;
  meta: Meta;
  materials: Material[];
  asks: Ask[];
  appointments: Appointment[];
  presence: Record<string, Presence>;
};

export const XP: Record<string, number> = {
  "peace-diplomacy-course": 300,
  "diplomatic-history-course": 300,
  "political-ideologies-course": 200,
  "comparative-politics-course": 200,
  "research-methods-course": 200,
  "ir-intro-course": 200,
  "ir-theories-foreign-policy-course": 200,
  "public-diplomacy-nation-building-course": 200,
  "academia-edu-profile": 80,
  "orcid-profile": 80,
  "nadia-ayub-chapter": 150,
  "nadia-ayub-journal": 150,
  "alyson-benjamin-paper": 250,
  "iau-conference-brief": 200,
  "ilhas-meeting": 50,
  "ricky-nag": 40,
  "bangladesh-consul": 60,
};
export const DEFAULT_XP = 60;
export const DAY_XP = 10;
export const MEET_XP = 15;

export type Move = { c?: boolean; t: string; p?: string };

export const MOVES: Record<string, Move[]> = {
  "peace-diplomacy-course": [
    { c: true, t: "Upload the course form and Osman's source list, then have Claude teach you the sources book by book before a single slide gets built.", p: "Here is the Peace & Diplomacy course form and Osman's source list. Teach me these sources properly, book by book, as if I were your student. Once I understand them, build the 14-week syllabus and the 20-25 slides per week." },
    { c: true, t: "Get the 14-week arc agreed before the slides: themes and questions per week, one page.", p: "Before we build slides for Peace & Diplomacy, draft the 14-week arc: the theme, the driving question and the core reading for each week. Keep it to one page so I can check the shape with Osman." },
    { c: true, t: "The field is thin, so scout beyond Osman's list for recent titles worth adding.", p: "Search for the strongest recent books and article-length work on peace studies and diplomacy pedagogy from the last 8 years. I need material beyond the standard list, with a note on what each one would add to a 14-week course." },
    { t: "Confirm with Osman what the course form actually requires (learning outcomes, assessment weighting, ECTS credits) before you fill it in." },
  ],
  "diplomatic-history-course": [
    { c: true, t: "Upload the Woodruff soft copy and ask for a chapter-to-week mapping across all 14 weeks.", p: "Here is Woodruff's A Concise History of the Modern World. Map its chapters across a 14-week Diplomatic History syllabus, and show me where Lowe and McWilliams & Piotrowski should fill the gaps." },
    { c: true, t: "For the two hard copies, photograph just the contents pages. That is enough to map the weeks.", p: "Here are photos of the contents pages of Norman Lowe's Modern World History and McWilliams & Piotrowski's The World Since 1945. Use them to slot chapters into the 14-week plan alongside Woodruff." },
    { c: true, t: "Get annotation help as you read the physical books, chapter by chapter.", p: "I have just read a chapter of Lowe. Here are my notes. Help me annotate it: what matters for a diplomatic history course, what to cut, and which week it belongs in." },
    { t: "Russell stays out of the syllabus. Osman gave it to you as your own reading, not as course material." },
  ],
  "political-ideologies-course": [{ t: "Ask Osman for the reading list and whether he wants this book-led or theme-led before you start." }, { c: true, t: "Reuse the structure once the first two courses are signed off.", p: "Now that the Peace & Diplomacy and Diplomatic History syllabi are approved, build the Political Ideologies course on the same 14-week template." }],
  "comparative-politics-course": [{ t: "Ask Osman for the reading list and the level this is pitched at." }, { c: true, t: "Reuse the approved template once the Friday courses are signed off.", p: "Build the Comparative Politics 14-week syllabus on the same template as the approved courses." }],
  "research-methods-course": [{ t: "Ask Osman whether this is qualitative, quantitative or mixed. It changes the whole shape." }, { c: true, t: "Your own methods work is the best source here.", p: "Build a 14-week Research Methods syllabus. Draw on the methods I have actually used in my own papers so the examples are ones I can teach with confidence." }],
  "ir-intro-course": [{ t: "Ask Osman for the reading list and whether this feeds into the IR Theories course." }, { c: true, t: "Sequence it against the theories course so they do not overlap.", p: "Build the Introduction to International Relations 14-week syllabus, and make sure it sets up rather than duplicates the IR Theories / Foreign Policy course." }],
  "ir-theories-foreign-policy-course": [{ t: "Ask Osman for the reading list and whether foreign policy analysis gets its own weeks." }, { c: true, t: "Build it after the intro course so the progression holds.", p: "Build the IR Theories / Foreign Policy 14-week syllabus, picking up where the Introduction to IR course leaves off." }],
  "public-diplomacy-nation-building-course": [{ t: "Ask Osman for the reading list. Your internationalization practice is directly relevant here." }, { c: true, t: "This one is closest to your own field work; lean on it.", p: "Build the Public Diplomacy / Nation Building 14-week syllabus, drawing on my internationalization and intercultural competence practice for the applied weeks." }],
  "academia-edu-profile": [{ c: true, t: "Get the bio, research interests and keyword tags drafted, then paste them in.", p: "Draft my Academia.edu profile: short bio, research interests, and the keyword tags that will actually surface my work on internationalization and higher education corruption." }, { t: "Upload the published papers themselves. An empty profile does nothing for discoverability." }],
  "orcid-profile": [{ t: "Register at orcid.org first. It takes about five minutes and needs only an email." }, { c: true, t: "Then get the works list drafted so you can bulk-add rather than typing each entry.", p: "Draft my ORCID works list from my publications, formatted so I can add them to ORCID quickly." }, { t: "Put the ORCID iD on the Bologna and MoU papers before they go out. Most journals now ask for it." }],
  "nadia-ayub-chapter": [{ t: "Settle the angle with Osman and Dr. Ayub first: whose edited volume is this aimed at?" }, { c: true, t: "Then get a one-page proposal drafted.", p: "Draft a one-page chapter proposal for the collaboration with Dr. Nadia Ayub: working title, abstract, contribution, and method." }],
  "nadia-ayub-journal": [{ c: true, t: "A concept note is what STAR will actually respond to: scope, board, first issue.", p: "Draft a journal concept note for STAR Scholars Network: scope and aims, why the gap exists, editorial board shape, review model, and a realistic first-issue plan." }, { t: "Check with STAR what already exists in their portfolio before proposing. Overlap kills these fast." }],
  "alyson-benjamin-paper": [{ t: "Message Alyson and Benjamin now to lock an October kickoff. Diaries fill early in term." }, { c: true, t: "Start October with everything already in one place.", p: "Pull together everything we have on the papers with Alyson King and Benjamin Kutsyuruba into a single work plan with deadlines, so October starts from a clear position." }],
  "iau-conference-brief": [
    { c: true, t: "Turn the sixteen questions into a Google Form and send Prof. Plamen the link. Far better than a wall of text on WhatsApp.", p: "Build a Google Form from the sixteen conference questions on the Term Board and give me the link to send Prof. Plamen." },
    { c: true, t: "When the answers land, have them compiled straight into the General Secretary request for Osman.", p: "Here are Prof. Plamen's answers to the conference questions. Compile them into a clean brief Osman can use to fill the General Secretary request form." },
    { t: "Chase the answers by early October. Rooms, catering and accommodation all need lead time at the university." },
    { t: "Flag the Erasmus invitation question early; if it goes that route, the paperwork starts sooner than the rest." },
  ],
  "ilhas-meeting": [{ c: true, t: "Get a short agenda drafted so the meeting has a shape.", p: "Draft a short agenda for my meeting with Ilhas." }, { t: "Confirm the room and whether it is in person or online, and put it in your actual calendar." }],
  "ricky-nag": [{ c: true, t: "Have today's follow-up drafted. Varied wording reads as persistence, not copy-paste.", p: "Draft today's follow-up email to Ricky chasing the STAR proceedings and abstract book revisions. Keep it short and friendly, and word it differently from yesterday's." }, { t: "If three days pass with no reply, escalate to whoever owns the proceedings at STAR rather than sending a fourth email." }],
  "bangladesh-consul": [{ t: "Confirm the arrival time and which gate, and let the faculty office know he is coming." }, { c: true, t: "A short follow-up afterwards is what turns a visit into a partnership.", p: "Draft a short thank-you follow-up to the Bangladesh Consul General after the campus visit, leaving the door open to a formal partnership conversation." }],
};
export const DEFAULT_MOVES: Move[] = [{ c: true, t: "Not sure where this starts? Ask Claude to break it into steps.", p: "Break this task down into concrete steps I can work through." }];

export const LEVELS = [
  { at: 0, name: "Teaching Assistant" },
  { at: 250, name: "Course Drafter" },
  { at: 600, name: "Syllabus Architect" },
  { at: 1000, name: "Panel Convener" },
  { at: 1500, name: "Programme Director" },
  { at: 2100, name: "Dean's Shortlist" },
];

export const STATUSES: { id: Attendance["status"]; label: string }[] = [
  { id: "campus", label: "Campus" },
  { id: "remote", label: "Remote" },
  { id: "leave", label: "Leave" },
  { id: "off", label: "Off" },
];

export type BadgeDef = { id: string; g: string; name: string; desc: string; test: (s: OpsState) => boolean };

export const BADGES: BadgeDef[] = [
  { id: "off-mark", g: "◆", name: "Off the Mark", desc: "Move anything past zero", test: (s) => s.tasks.some((t) => pct(t) > 0) },
  { id: "clocked", g: "◐", name: "Clocked In", desc: "Five working days logged", test: (s) => workDays(s.attendance) >= 5 },
  { id: "minuted", g: "◇", name: "Minuted", desc: "Three meetings logged", test: (s) => s.meetings.length >= 3 },
  { id: "actioned", g: "»", name: "Straight to Work", desc: "Five meeting items sent to the board", test: (s) => confirmedCount(s.meetings) >= 5 },
  { id: "friday", g: "◎", name: "Friday Fighter", desc: "Both Friday courses finished", test: (s) => ["peace-diplomacy-course", "diplomatic-history-course"].every((id) => { const t = byId(s.tasks, id); return !!t && pct(t) === 100; }) },
  { id: "sixteen", g: "✦", name: "Sixteen Questions", desc: "Every conference question answered", test: (s) => { const t = byId(s.tasks, "iau-conference-brief"); return !!t && pct(t) === 100; } },
  { id: "indexed", g: "❖", name: "Indexed", desc: "Academia and ORCID both live", test: (s) => ["academia-edu-profile", "orcid-profile"].every((id) => { const t = byId(s.tasks, id); return !!t && pct(t) === 100; }) },
  { id: "streak5", g: "▲", name: "Persistent", desc: "Five days in a row", test: (s) => streakOf(s.meta) >= 5 },
  { id: "clean-desk", g: "■", name: "Clean Desk", desc: "Every admin task cleared", test: (s) => { const a = s.tasks.filter((t) => t.segment === "administrative"); return a.length > 0 && a.every((t) => pct(t) === 100); } },
  { id: "handed-in", g: "✓", name: "Handed In", desc: "First piece of finished work submitted", test: (s) => s.tasks.some((t) => (t.submissions ?? []).length > 0) },
  { id: "signed-off", g: "★", name: "Signed Off", desc: "Something approved by Osman", test: (s) => s.tasks.some((t) => t.approval === "approved") },
];

/** Badges Osman can hand out by choice, over and above the earned ones. */
export const AWARDABLE = [
  { id: "gold-star", glyph: "★", name: "Gold Star" },
  { id: "lightning", glyph: "⚡", name: "Fast Turnaround" },
  { id: "quill", glyph: "✎", name: "Beautifully Written" },
  { id: "compass", glyph: "◎", name: "Right First Time" },
  { id: "hands", glyph: "❋", name: "Above and Beyond" },
  { id: "diamond", glyph: "◆", name: "Rare Find" },
];

export const SEED: Task[] = [
  { id: "peace-diplomacy-course", segment: "academic", title: "Peace & Diplomacy: course design", desc: "Fill out the course form. 14-week plan, 20–25 slides/week.", when: "Due Friday, 18 Sep", due: "2026-09-18", status: "not_started", percent: 0, order: 1, checklist: [] },
  { id: "diplomatic-history-course", segment: "academic", title: "Diplomatic History: course design", desc: "14-week syllabus, 20–25 slides/week.", when: "Due Friday, 18 Sep", due: "2026-09-18", status: "not_started", percent: 0, order: 2, checklist: [] },
  { id: "iau-conference-brief", segment: "administrative", title: "IAU conference (26 Oct): info from Osman", desc: "Sixteen questions for Prof. Plamen.", when: "Event: 26 Oct 2026", due: null, status: "not_started", percent: 0, order: 1, checklist: [] },
  { id: "ricky-nag", segment: "administrative", title: "Chase Ricky: STAR proceedings & abstract book", desc: "Twice daily by email.", when: "Daily · AM & PM", due: null, status: "in_progress", percent: 0, order: 3, recurring: true, checklist: [{ text: "Morning follow-up sent", done: false }, { text: "Afternoon follow-up sent", done: false }] },
];

export const EMPTY_META: Meta = { days: [], xpByDay: {}, badges: [], awarded: [], working: null };

/* ---- helpers, ported as-is ---- */

export function todayISO(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
export function byId<T extends { id: string }>(a: T[], id: string): T | null {
  return a.find((x) => x.id === id) ?? null;
}
export function pct(t: Task): number {
  if (t.checklist && t.checklist.length) {
    const d = t.checklist.filter((c) => c.done).length;
    return Math.round((d / t.checklist.length) * 100);
  }
  return Math.max(0, Math.min(100, Math.round(t.percent || 0)));
}
export function xpOf(t: Task): number {
  return XP[t.id] || DEFAULT_XP;
}
export function workDays(att: Record<string, Attendance>): number {
  return Object.values(att).filter((a) => a && (a.status === "campus" || a.status === "remote")).length;
}
export function confirmedCount(ms: Meeting[]): number {
  return ms.reduce((n, m) => n + (m.items || []).filter((i) => i.confirmed).length, 0);
}
export function totalXp(s: OpsState): number {
  const task = s.tasks.reduce((n, t) => n + (xpOf(t) * pct(t)) / 100, 0);
  return Math.round(task + workDays(s.attendance) * DAY_XP + s.meetings.length * MEET_XP);
}
export function levelFor(xp: number): number {
  let i = 0;
  LEVELS.forEach((l, k) => { if (xp >= l.at) i = k; });
  return i;
}
export function streakOf(meta: Meta): number {
  const set = new Set(meta.days || []);
  const d = new Date();
  if (!set.has(todayISO(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(todayISO(d))) { n++; d.setDate(d.getDate() - 1); }
  return n;
}
export function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  const a = new Date(todayISO() + "T00:00:00").getTime();
  const b = new Date(iso + "T00:00:00").getTime();
  return Math.round((b - a) / 86400000);
}
export function dueLabel(t: Task): { txt: string; cls: "" | "due" | "soon" | "ok" } {
  const n = daysUntil(t.due);
  if (n === null) return { txt: t.when || "", cls: "" };
  if (pct(t) === 100) return { txt: "Done", cls: "ok" };
  if (n < 0) return { txt: Math.abs(n) === 1 ? "1 day late" : `${Math.abs(n)} days late`, cls: "due" };
  if (n === 0) return { txt: "Today", cls: "due" };
  if (n === 1) return { txt: "Tomorrow", cls: "soon" };
  if (n <= 6) return { txt: `In ${n} days`, cls: "soon" };
  return { txt: new Date(t.due + "T00:00:00").toLocaleDateString(undefined, { day: "numeric", month: "short" }), cls: "" };
}
export function fmtDate(iso: string): string {
  if (!iso) return "";
  return new Date(iso + "T00:00:00").toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" });
}
export function weekStart(d: Date): Date {
  const x = new Date(d);
  const g = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - g);
  x.setHours(0, 0, 0, 0);
  return x;
}
export function hoursBetween(att: Record<string, Attendance>, from: string, to: string): number {
  let n = 0;
  for (const k of Object.keys(att)) if (k >= from && k <= to) n += Number(att[k].hours) || 0;
  return n;
}
export function scanNotes(notes: string): string[] {
  const lines = (notes || "").split("\n").map((l) => l.trim()).filter((l) => l.length > 1);
  const bullets = lines.filter((l) => /^[-*•▪>]/.test(l) || /^\[\s*\]/.test(l));
  const src = bullets.length ? bullets : lines;
  return src.map((l) => l.replace(/^[-*•▪>[\]\s]+/, "").trim()).filter((l) => l.length > 2);
}
export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
}

/** Notifications for Saadan's view. */
export type Notice = { id?: string; go?: string; tone: "coral" | "gold" | "brand"; title: string; body: string };

export function notifications(s: OpsState): Notice[] {
  const out: Notice[] = [];
  const att = s.attendance[todayISO()];
  if (!att || !att.checkInAt) out.push({ go: "attendance", tone: "brand", title: "Not checked in today", body: "Mark your attendance and log your hours" });
  s.tasks.forEach((t) => {
    if (pct(t) === 100) return;
    if (t.recurring) {
      const left = (t.checklist || []).filter((c) => !c.done);
      if (left.length) out.push({ id: t.id, tone: "coral", title: t.title, body: `${left.length} of ${t.checklist.length} still to send today` });
      return;
    }
    if (t.approval === "changes") out.push({ id: t.id, tone: "coral", title: t.title, body: "Osman asked for changes" });
    if (t.createdBy === "osman" && t.status === "not_started") out.push({ id: t.id, tone: "gold", title: t.title, body: "New from Osman. Open it to start." });
    const n = daysUntil(t.due);
    if (n === null) return;
    if (n < 0) out.push({ id: t.id, tone: "coral", title: t.title, body: `${Math.abs(n)} day${Math.abs(n) === 1 ? "" : "s"} past due at ${pct(t)}%` });
    else if (n === 0) out.push({ id: t.id, tone: "coral", title: t.title, body: `Due today, sitting at ${pct(t)}%` });
    else if (n <= 3) out.push({ id: t.id, tone: "gold", title: t.title, body: `Due in ${n} day${n === 1 ? "" : "s"}, ${pct(t)}% done` });
  });
  const pend = s.meetings.reduce((n, m) => n + (m.items || []).filter((i) => !i.confirmed).length, 0);
  if (pend) out.push({ go: "meetings", tone: "gold", title: "Action items waiting", body: `${pend} item${pend === 1 ? "" : "s"} from meetings not yet on the board` });
  const fresh = s.meta.awarded.filter(isFreshAward).length;
  if (fresh) out.push({ go: "wins", tone: "gold", title: "Osman gave you a badge", body: `${fresh} new under Wins` });
  const unread = s.materials.filter((m) => m.by === "osman").length;
  if (unread) out.push({ go: "materials", tone: "brand", title: "Reading from Osman", body: `${unread} item${unread === 1 ? "" : "s"} in Materials` });
  if (!(s.meta.xpByDay[todayISO()] > 0)) out.push({ go: "today", tone: "brand", title: "Nothing ticked today", body: streakOf(s.meta) > 0 ? `Your ${streakOf(s.meta)}-day streak needs one completed item` : "Tick anything to start a streak" });
  return out;
}

/** Given in the last three days: still news. */
export function isFreshAward(a: Awarded): boolean {
  return Date.now() - new Date(a.at).getTime() < 1000 * 60 * 60 * 24 * 3;
}

/** What is waiting on Osman. */
export function awaitingOsman(s: OpsState): Task[] {
  return s.tasks.filter((t) => t.approval === "requested");
}
