/**
 * AJSRC 2027, as a programme the desk can run.
 *
 * Generated from the full plan (the zip with a folder per month). Every
 * task, post and email has a date, so the day, the week and the month
 * views are just filters over one list. Progress lives in the store as a
 * single document; this file never changes while the campaign runs.
 */

export type ProgramItemKind = "task" | "post" | "email";

export type ProgramItem = {
  id: string;
  kind: ProgramItemKind;
  /** Local date, YYYY-MM-DD. */
  date: string;
  time?: string;
  title: string;
  detail: string;
  owner: string;
};

export type ProgramMonth = { key: string; name: string; theme: string; goal: string };

export type ProgramMilestone = { date: string; label: string };

export type Program = {
  id: string;
  short: string;
  name: string;
  /** Local date and time in Istanbul. */
  startsAt: string;
  deadlineAt: string;
  launch: string;
  venue: string;
  months: ProgramMonth[];
  milestones: ProgramMilestone[];
  ongoing: string[];
  items: ProgramItem[];
};

export const AJSRC: Program = {
  id: "ajsrc-2027",
  short: "AJSRC",
  name: "2nd American Junior Scientific Research Conference",
  startsAt: "2027-03-27T09:30:00+03:00",
  deadlineAt: "2027-03-20T23:59:00+03:00",
  launch: "2026-11-17",
  venue: "Istanbul Aydın University, Florya Campus",
  months: [
  {
    "key": "2026-11",
    "name": "November 2026",
    "theme": "Foundations and launch",
    "goal": "Get every decision made, build the tools, and launch the call for papers on Tuesday 17 November with a strong first week."
  },
  {
    "key": "2026-12",
    "name": "December 2026",
    "theme": "First outreach wave and teacher engagement",
    "goal": "Reach international and IB schools, win over teachers with the online info session, and turn early interest into the first submissions."
  },
  {
    "key": "2027-01",
    "name": "January 2027",
    "theme": "Semester-break push and first acceptances",
    "goal": "Use the Turkish semester break to push abstracts over the line, follow up every school, and process the first acceptances and payments."
  },
  {
    "key": "2027-02",
    "name": "February 2027",
    "theme": "School visits, international letters and logistics start",
    "goal": "Visit schools in person, lock in the jury and volunteers, send invitation letters in time for visas, and start event logistics."
  },
  {
    "key": "2027-03",
    "name": "March 2027",
    "theme": "Final deadline, programme and the conference",
    "goal": "Close submissions on 20 March, publish the programme on 23 March, deliver a smooth two-day conference on 27–28 March, and capture it well."
  },
  {
    "key": "2027-04",
    "name": "April 2027",
    "theme": "Certificates, recap and report",
    "goal": "Deliver certificates fast, thank everyone, collect feedback, publish the recap and abstract book, and report results with lessons for 2028."
  }
],
  milestones: [
    { date: "2026-11-17", label: "Call for papers opens" },
    { date: "2026-12-16", label: "Teacher info session" },
    { date: "2027-01-15", label: "Mid-campaign review" },
    { date: "2027-02-28", label: "Last visa letter requests" },
    { date: "2027-03-20", label: "Submissions close" },
    { date: "2027-03-23", label: "Programme published" },
    { date: "2027-03-27", label: "Conference day 1" },
    { date: "2027-03-28", label: "Conference day 2 and awards" },
    { date: "2027-04-20", label: "Final report" },
  ],
  ongoing: ["E10: Submission received (automatic or same-day)", "E11: Acceptance + payment instructions", "E12: Revision request", "E13: Payment confirmation + invoice", "E14: Parental consent request / reminder"],
  items: [
  {
    "id": "T01",
    "kind": "task",
    "date": "2026-11-09",
    "title": "Send plan and kick-off email (E01)",
    "detail": "Share this zip with Osman and Hasan; ask for the 5 launch decisions.",
    "owner": "Saadan"
  },
  {
    "id": "E01",
    "kind": "email",
    "date": "2026-11-09",
    "title": "Send E01: Team kick-off",
    "detail": "To: Osman Gültekin, Hasan Karacan, Pen Research team (internal)",
    "owner": "Saadan"
  },
  {
    "id": "T02",
    "kind": "task",
    "date": "2026-11-11",
    "title": "Approve plan, fee, awards and roles",
    "detail": "Decisions: registration link, form, payment method + TL amount, contact email, award categories.",
    "owner": "Osman"
  },
  {
    "id": "T03",
    "kind": "task",
    "date": "2026-11-11",
    "title": "Request logos, campus photos and comms support (E02)",
    "detail": "Get IAU, UNESCO Chair, Pen Research and PAIU logos in high resolution; brief Corporate Comms.",
    "owner": "Saadan"
  },
  {
    "id": "E02",
    "kind": "email",
    "date": "2026-11-11",
    "title": "Send E02: IAU Corporate Communications request",
    "detail": "To: IAU Kurumsal İletişim / Corporate Communications Office",
    "owner": "Saadan"
  },
  {
    "id": "T04",
    "kind": "task",
    "date": "2026-11-12",
    "title": "Confirm registration page and submission form",
    "detail": "Verify the link (ajsrtc2027 vs ajsrc2027). Form fields: see 'Form fields' sheet in the Operations workbook.",
    "owner": "Pen Research"
  },
  {
    "id": "T05",
    "kind": "task",
    "date": "2026-11-13",
    "title": "Set up the Operations workbook (shared Google Sheet)",
    "detail": "Upload 'AJSRC_2027_Operations.xlsx' to Drive, share with Osman and Pen, lock header rows.",
    "owner": "Saadan"
  },
  {
    "id": "T06",
    "kind": "task",
    "date": "2026-11-13",
    "title": "Prepare abstract template and parental consent forms",
    "detail": "Templates in 07_Templates_and_Tools; upload abstract template to the website and form.",
    "owner": "Saadan"
  },
  {
    "id": "T07",
    "kind": "task",
    "date": "2026-11-16",
    "title": "Update the AJSRC page on the IAU website",
    "detail": "Add fee, tracks, how to submit, consent info and contact email to ieces.aydin.edu.tr/ajsrc-2027.",
    "owner": "Saadan"
  },
  {
    "id": "T08",
    "kind": "task",
    "date": "2026-11-16",
    "title": "Schedule November posts in Meta Business Suite and LinkedIn",
    "detail": "P01–P06; prepare P04–P06 visuals in Canva.",
    "owner": "Saadan"
  },
  {
    "id": "T09",
    "kind": "task",
    "date": "2026-11-17",
    "title": "LAUNCH: call for papers opens",
    "detail": "Post P01, send WhatsApp announcement to teacher/student groups, share on personal LinkedIn accounts.",
    "owner": "Team"
  },
  {
    "id": "P01",
    "kind": "post",
    "date": "2026-11-17",
    "time": "19:00",
    "title": "Launch: Call for Papers is open",
    "detail": "Instagram, LinkedIn, Facebook, WhatsApp channel/groups · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T10",
    "kind": "task",
    "date": "2026-11-19",
    "title": "Email IAU faculties and clubs (E03)",
    "detail": "Ask deans' offices to forward to students; contact club presidents directly.",
    "owner": "Saadan"
  },
  {
    "id": "E03",
    "kind": "email",
    "date": "2026-11-19",
    "title": "Send E03: IAU internal: faculties and student clubs",
    "detail": "To: IAU deans' offices, department heads, student club presidents (IAU MUN, Spotlight, science and engineering clubs)",
    "owner": "Saadan"
  },
  {
    "id": "P02",
    "kind": "post",
    "date": "2026-11-19",
    "time": "19:00",
    "title": "Who can participate?",
    "detail": "Instagram, Facebook · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T11",
    "kind": "task",
    "date": "2026-11-20",
    "title": "Build the outreach list: wave 1 (100 Istanbul schools)",
    "detail": "Fill 'Outreach Targets' with school emails from school websites and MEB school pages.",
    "owner": "Saadan"
  },
  {
    "id": "P03",
    "kind": "post",
    "date": "2026-11-21",
    "time": "12:00",
    "title": "Why join?",
    "detail": "Instagram, LinkedIn · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T12",
    "kind": "task",
    "date": "2026-11-24",
    "title": "Email ECLSS / IECES partners (E04)",
    "detail": "Use the IECES Partners page and committee lists.",
    "owner": "Saadan"
  },
  {
    "id": "T13",
    "kind": "task",
    "date": "2026-11-24",
    "title": "Start Turkish high school wave 1 (E05)",
    "detail": "20–30 personalised emails per day until 4 Dec; log each in Outreach Targets.",
    "owner": "Saadan"
  },
  {
    "id": "E04",
    "kind": "email",
    "date": "2026-11-24",
    "title": "Send E04: ECLSS / IECES partner universities",
    "detail": "To: Contact persons at ECLSS partner universities (Partners page) and IECES 2026 organising/scientific committee members",
    "owner": "Saadan"
  },
  {
    "id": "E05",
    "kind": "email",
    "date": "2026-11-24",
    "title": "Send E05: Turkish high schools: wave 1 (Istanbul)",
    "detail": "To: School principals (okul müdürü), deputy principals, guidance counsellors (rehber öğretmen) and science/biology/chemistry/physics teachers at Istanbul high schools. See Outreach Targets.",
    "owner": "Saadan"
  },
  {
    "id": "P04",
    "kind": "post",
    "date": "2026-11-24",
    "time": "19:00",
    "title": "Meet the organisers",
    "detail": "Instagram, LinkedIn · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "P05",
    "kind": "post",
    "date": "2026-11-26",
    "time": "19:00",
    "title": "What can you research? (Tracks)",
    "detail": "Instagram, Facebook · Carousel (7 slides)",
    "owner": "Saadan"
  },
  {
    "id": "T14",
    "kind": "task",
    "date": "2026-11-27",
    "title": "Check with İl/İlçe Milli Eğitim Müdürlüğü",
    "detail": "Ask whether official MEB notice/approval helps schools share the call; if yes, prepare the official letter (resmî yazı).",
    "owner": "Osman"
  },
  {
    "id": "P06",
    "kind": "post",
    "date": "2026-11-28",
    "time": "12:00",
    "title": "Your first conference? 5 things to know",
    "detail": "Instagram, Instagram Story · Carousel (6 slides)",
    "owner": "Saadan"
  },
  {
    "id": "T15",
    "kind": "task",
    "date": "2026-11-30",
    "title": "November review",
    "detail": "Count submissions, reach and replies; update KPIs sheet; send a 5-line update to Osman.",
    "owner": "Saadan"
  },
  {
    "id": "T16",
    "kind": "task",
    "date": "2026-12-01",
    "title": "Start international/IB schools wave 1 (E06)",
    "detail": "25 per day until 11 Dec.",
    "owner": "Saadan"
  },
  {
    "id": "E06",
    "kind": "email",
    "date": "2026-12-01",
    "title": "Send E06: International and IB schools",
    "detail": "To: Heads of school, IB/DP coordinators, university counsellors and science heads at international schools (Türkiye, Balkans, Caucasus, Central Asia, Middle East, South Asia). See Outreach Targets.",
    "owner": "Saadan"
  },
  {
    "id": "P07",
    "kind": "post",
    "date": "2026-12-01",
    "time": "19:00",
    "title": "Key dates",
    "detail": "Instagram, LinkedIn, Facebook · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T17",
    "kind": "task",
    "date": "2026-12-02",
    "title": "Produce Video 1 (Teaser) in Canva",
    "detail": "Script V1; IECES footage + stock; EN and TR captions.",
    "owner": "Saadan"
  },
  {
    "id": "P08",
    "kind": "post",
    "date": "2026-12-03",
    "time": "19:00",
    "title": "VIDEO 1: Teaser",
    "detail": "Instagram Reel, TikTok, YouTube Shorts, LinkedIn · Video (30s, 9:16)",
    "owner": "Saadan"
  },
  {
    "id": "T18",
    "kind": "task",
    "date": "2026-12-04",
    "title": "Set up the teacher info session",
    "detail": "Zoom/Teams link, registration form, 10-slide deck (what AJSRC is, how to guide research, consent).",
    "owner": "Saadan"
  },
  {
    "id": "P09",
    "kind": "post",
    "date": "2026-12-05",
    "time": "12:00",
    "title": "From Idea to Abstract 1/4: What is an abstract?",
    "detail": "Instagram, Facebook · Carousel (5 slides)",
    "owner": "Saadan"
  },
  {
    "id": "T19",
    "kind": "task",
    "date": "2026-12-08",
    "title": "Invite teachers to the info session (E07)",
    "detail": "Send to all teachers contacted so far; reminder on 15 Dec.",
    "owner": "Saadan"
  },
  {
    "id": "E07",
    "kind": "email",
    "date": "2026-12-08",
    "title": "Send E07: Teacher info session invitation",
    "detail": "To: All teachers and counsellors already contacted (E05, E06) + any teacher who replied",
    "owner": "Saadan"
  },
  {
    "id": "P10",
    "kind": "post",
    "date": "2026-12-08",
    "time": "19:00",
    "title": "Teachers: online info session",
    "detail": "LinkedIn, Facebook, Instagram · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T20",
    "kind": "task",
    "date": "2026-12-10",
    "title": "Start rolling review",
    "detail": "Each submission reviewed within 7 days: accept (E11), revise (E12) or decline. Log in Submissions sheet.",
    "owner": "Team"
  },
  {
    "id": "P11",
    "kind": "post",
    "date": "2026-12-12",
    "time": "12:00",
    "title": "From Idea to Abstract 2/4: Your research question",
    "detail": "Instagram, Facebook · Carousel (5 slides)",
    "owner": "Saadan"
  },
  {
    "id": "T21",
    "kind": "task",
    "date": "2026-12-15",
    "title": "Email universities and clubs outside IAU (E08)",
    "detail": "Istanbul universities + partner universities.",
    "owner": "Saadan"
  },
  {
    "id": "E07b",
    "kind": "email",
    "date": "2026-12-15",
    "title": "Send E07: Teacher info session invitation (reminder / wave 2)",
    "detail": "To: All teachers and counsellors already contacted (E05, E06) + any teacher who replied",
    "owner": "Saadan"
  },
  {
    "id": "E08",
    "kind": "email",
    "date": "2026-12-15",
    "title": "Send E08: Universities and student clubs (outside IAU)",
    "detail": "To: Undergraduate programme coordinators, research offices and student science/engineering clubs at Istanbul universities and partner universities",
    "owner": "Saadan"
  },
  {
    "id": "P12",
    "kind": "post",
    "date": "2026-12-15",
    "time": "19:00",
    "title": "Reminder: teacher session tomorrow",
    "detail": "Instagram Story, LinkedIn · Story + short post",
    "owner": "Saadan"
  },
  {
    "id": "T22",
    "kind": "task",
    "date": "2026-12-16",
    "title": "Run the teacher info session (18:00)",
    "detail": "Record it; send the recording and slides afterwards; issue attendance certificates.",
    "owner": "Saadan"
  },
  {
    "id": "T23",
    "kind": "task",
    "date": "2026-12-18",
    "title": "Confirm venue booking at IAU",
    "detail": "Halls for opening + 2–3 parallel oral sessions + poster area + registration desk, 27–28 March.",
    "owner": "Osman"
  },
  {
    "id": "P13",
    "kind": "post",
    "date": "2026-12-19",
    "time": "12:00",
    "title": "From Idea to Abstract 3/4: Your method",
    "detail": "Instagram, Facebook · Carousel (5 slides)",
    "owner": "Saadan"
  },
  {
    "id": "P14",
    "kind": "post",
    "date": "2026-12-22",
    "time": "19:00",
    "title": "Look back: IECES 2026 at IAU",
    "detail": "Instagram, LinkedIn · Carousel (photos)",
    "owner": "Saadan"
  },
  {
    "id": "P15",
    "kind": "post",
    "date": "2026-12-26",
    "time": "12:00",
    "title": "From Idea to Abstract 4/4: Results and template",
    "detail": "Instagram, Facebook · Carousel (5 slides)",
    "owner": "Saadan"
  },
  {
    "id": "T24",
    "kind": "task",
    "date": "2026-12-31",
    "title": "December review",
    "detail": "KPIs, submissions, top posts; adjust January plan.",
    "owner": "Saadan"
  },
  {
    "id": "P16",
    "kind": "post",
    "date": "2026-12-31",
    "time": "12:00",
    "title": "New year, new research",
    "detail": "Instagram, LinkedIn, Facebook · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T25",
    "kind": "task",
    "date": "2027-01-05",
    "title": "Follow-up emails to schools (E09) + Turkish wave 2",
    "detail": "Schools without replies; add 50 new schools (outside Istanbul, science high schools, TÜBİTAK 2204 advisors).",
    "owner": "Saadan"
  },
  {
    "id": "E05b",
    "kind": "email",
    "date": "2027-01-05",
    "title": "Send E05: Turkish high schools: wave 1 (Istanbul) (reminder / wave 2)",
    "detail": "To: School principals (okul müdürü), deputy principals, guidance counsellors (rehber öğretmen) and science/biology/chemistry/physics teachers at Istanbul high schools. See Outreach Targets.",
    "owner": "Saadan"
  },
  {
    "id": "E09",
    "kind": "email",
    "date": "2027-01-05",
    "title": "Send E09: Follow-up to schools that haven't replied",
    "detail": "To: Schools from waves 1 (E05, E06) with no reply or no submission yet",
    "owner": "Saadan"
  },
  {
    "id": "P17",
    "kind": "post",
    "date": "2027-01-05",
    "time": "19:00",
    "title": "First acceptances",
    "detail": "Instagram, LinkedIn, Facebook · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "P18",
    "kind": "post",
    "date": "2027-01-07",
    "time": "19:00",
    "title": "Oral or poster?",
    "detail": "Instagram, Facebook · Carousel (5 slides)",
    "owner": "Saadan"
  },
  {
    "id": "T26",
    "kind": "task",
    "date": "2027-01-08",
    "title": "Produce Video 2 (How to submit)",
    "detail": "Film with a volunteer; screen-record the form.",
    "owner": "Saadan"
  },
  {
    "id": "P19",
    "kind": "post",
    "date": "2027-01-09",
    "time": "12:00",
    "title": "Track spotlight: Environment & Sustainability",
    "detail": "Instagram, Facebook · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T27",
    "kind": "task",
    "date": "2027-01-11",
    "title": "Collect IAU campus photos for P25",
    "detail": "From Corporate Comms or the IECES photo folder.",
    "owner": "Saadan"
  },
  {
    "id": "P20",
    "kind": "post",
    "date": "2027-01-12",
    "time": "19:00",
    "title": "VIDEO 2: How to submit in 3 steps",
    "detail": "Instagram Reel, TikTok, YouTube Shorts · Video (45s, 9:16)",
    "owner": "Saadan"
  },
  {
    "id": "T28",
    "kind": "task",
    "date": "2027-01-15",
    "title": "Mid-campaign review meeting",
    "detail": "Compare against KPI targets; decide extra push (school visits, partner newsletters).",
    "owner": "Osman"
  },
  {
    "id": "P21",
    "kind": "post",
    "date": "2027-01-16",
    "time": "12:00",
    "title": "Track spotlight: Engineering & Technology",
    "detail": "Instagram, Facebook · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T29",
    "kind": "task",
    "date": "2027-01-18",
    "title": "International/IB schools wave 2 (E06)",
    "detail": "New regions; follow up wave 1.",
    "owner": "Saadan"
  },
  {
    "id": "E06b",
    "kind": "email",
    "date": "2027-01-18",
    "title": "Send E06: International and IB schools (reminder / wave 2)",
    "detail": "To: Heads of school, IB/DP coordinators, university counsellors and science heads at international schools (Türkiye, Balkans, Caucasus, Central Asia, Middle East, South Asia). See Outreach Targets.",
    "owner": "Saadan"
  },
  {
    "id": "P22",
    "kind": "post",
    "date": "2027-01-19",
    "time": "19:00",
    "title": "Semester break push (Türkiye)",
    "detail": "Instagram, Instagram Story, WhatsApp channel/groups · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T30",
    "kind": "task",
    "date": "2027-01-22",
    "title": "Set up invoicing and receipts",
    "detail": "Invoice numbering AJSRC2027-xxx; TL amount; who issues invoices for schools paying in bulk.",
    "owner": "IAU Finance"
  },
  {
    "id": "P23",
    "kind": "post",
    "date": "2027-01-23",
    "time": "12:00",
    "title": "Track spotlight: Health & Life Sciences",
    "detail": "Instagram, Facebook · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T31",
    "kind": "task",
    "date": "2027-01-26",
    "title": "Repeat universities/clubs email (E08)",
    "detail": "Ahead of the spring semester.",
    "owner": "Saadan"
  },
  {
    "id": "E08b",
    "kind": "email",
    "date": "2027-01-26",
    "title": "Send E08: Universities and student clubs (outside IAU) (reminder / wave 2)",
    "detail": "To: Undergraduate programme coordinators, research offices and student science/engineering clubs at Istanbul universities and partner universities",
    "owner": "Saadan"
  },
  {
    "id": "P24",
    "kind": "post",
    "date": "2027-01-26",
    "time": "09:30",
    "title": "For universities and student clubs",
    "detail": "LinkedIn, Facebook · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T32",
    "kind": "task",
    "date": "2027-01-29",
    "title": "Plan February school visits",
    "detail": "Book 6–10 visits (15-minute talks) at Istanbul schools that replied.",
    "owner": "Saadan"
  },
  {
    "id": "P25",
    "kind": "post",
    "date": "2027-01-30",
    "time": "12:00",
    "title": "Meet the venue: IAU Florya Campus",
    "detail": "Instagram, Facebook · Carousel (photos)",
    "owner": "Saadan"
  },
  {
    "id": "T33",
    "kind": "task",
    "date": "2027-02-01",
    "title": "Invite jury and session chairs (E16)",
    "detail": "Target 8–12 academics; deadline for replies 20 Feb.",
    "owner": "Saadan"
  },
  {
    "id": "E16",
    "kind": "email",
    "date": "2027-02-01",
    "title": "Send E16: Jury and session chair invitation",
    "detail": "To: IAU faculty, ECLSS partner academics, Pen Research scholars (target: 8–12 people)",
    "owner": "Saadan"
  },
  {
    "id": "T34",
    "kind": "task",
    "date": "2027-02-02",
    "title": "School visits (Feb 2 – Feb 26)",
    "detail": "Short talk + flyer QR; collect teacher contacts.",
    "owner": "Saadan"
  },
  {
    "id": "P26",
    "kind": "post",
    "date": "2027-02-02",
    "time": "19:00",
    "title": "Back to school: 46 days left",
    "detail": "Instagram, Instagram Story, WhatsApp channel/groups · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "P27",
    "kind": "post",
    "date": "2027-02-04",
    "time": "19:00",
    "title": "Awards (if approved)",
    "detail": "Instagram, LinkedIn, Facebook · Carousel (4 slides)",
    "owner": "Saadan"
  },
  {
    "id": "T35",
    "kind": "task",
    "date": "2027-02-05",
    "title": "Confirm award categories and prizes",
    "detail": "Plaques/certificates, jury rubric; then publish P27.",
    "owner": "Osman"
  },
  {
    "id": "P28",
    "kind": "post",
    "date": "2027-02-06",
    "time": "12:00",
    "title": "For parents: what happens at AJSRC?",
    "detail": "Instagram, Facebook · Carousel (5 slides)",
    "owner": "Saadan"
  },
  {
    "id": "P29",
    "kind": "post",
    "date": "2027-02-08",
    "time": "18:30",
    "title": "Ramadan greeting",
    "detail": "Instagram, Facebook · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T36",
    "kind": "task",
    "date": "2027-02-10",
    "title": "Get quotes: lunch, coffee breaks, printing",
    "detail": "Badge printing, certificates (paper), banner/roll-up, signage, plaques.",
    "owner": "Saadan"
  },
  {
    "id": "P30",
    "kind": "post",
    "date": "2027-02-11",
    "time": "21:30",
    "title": "Track spotlight: Social Sciences & Education",
    "detail": "Instagram, Facebook · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T37",
    "kind": "task",
    "date": "2027-02-15",
    "title": "Issue invitation letters on request (E15)",
    "detail": "Last requests 28 Feb; log in Invitation Letters column.",
    "owner": "Saadan"
  },
  {
    "id": "E15",
    "kind": "email",
    "date": "2027-02-15",
    "title": "Send E15: Invitation letter for visa",
    "detail": "To: International participants who request it (accepted and paid)",
    "owner": "Saadan"
  },
  {
    "id": "P31",
    "kind": "post",
    "date": "2027-02-16",
    "time": "21:30",
    "title": "International participants: invitation letters",
    "detail": "Instagram, LinkedIn · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T38",
    "kind": "task",
    "date": "2027-02-20",
    "title": "Draft programme structure",
    "detail": "Halls × time slots; capacity per session = 5 presentations of 15 minutes.",
    "owner": "Saadan"
  },
  {
    "id": "P32",
    "kind": "post",
    "date": "2027-02-20",
    "time": "21:30",
    "title": "One month left",
    "detail": "Instagram, Instagram Story, WhatsApp channel/groups · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T39",
    "kind": "task",
    "date": "2027-02-25",
    "title": "Volunteer call (E17)",
    "detail": "Target 12–15 volunteers; deadline 8 March.",
    "owner": "Saadan"
  },
  {
    "id": "E17",
    "kind": "email",
    "date": "2027-02-25",
    "title": "Send E17: Volunteer call (IAU students)",
    "detail": "To: IAU student clubs, IAU international office mailing list, Osman Hoca's and colleagues' classes",
    "owner": "Saadan"
  },
  {
    "id": "P33",
    "kind": "post",
    "date": "2027-02-25",
    "time": "21:30",
    "title": "Volunteers wanted (IAU students)",
    "detail": "Instagram, Instagram Story · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T40",
    "kind": "task",
    "date": "2027-02-26",
    "title": "February review",
    "detail": "KPIs; parental consent forms collected vs. accepted minors.",
    "owner": "Saadan"
  },
  {
    "id": "T41",
    "kind": "task",
    "date": "2027-03-01",
    "title": "Consent form reminder (E14)",
    "detail": "Everyone under 18 without a signed form.",
    "owner": "Saadan"
  },
  {
    "id": "P34",
    "kind": "post",
    "date": "2027-03-02",
    "time": "21:30",
    "title": "18 days left + checklist",
    "detail": "Instagram, Facebook · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T42",
    "kind": "task",
    "date": "2027-03-05",
    "title": "Approve budget and final orders",
    "detail": "Lunch numbers (estimate +10%), printing, plaques.",
    "owner": "Osman"
  },
  {
    "id": "P35",
    "kind": "post",
    "date": "2027-03-06",
    "time": "12:00",
    "title": "How to make a great poster",
    "detail": "Instagram, Facebook · Carousel (6 slides)",
    "owner": "Saadan"
  },
  {
    "id": "T43",
    "kind": "task",
    "date": "2027-03-08",
    "title": "Confirm volunteer roster",
    "detail": "Roles and shifts in the Volunteers sheet.",
    "owner": "Volunteers"
  },
  {
    "id": "P36",
    "kind": "post",
    "date": "2027-03-10",
    "time": "12:00",
    "title": "Eid greeting",
    "detail": "Instagram, Facebook · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T44",
    "kind": "task",
    "date": "2027-03-13",
    "title": "Final deadline reminders (E18)",
    "detail": "13, 18 and 20 March.",
    "owner": "Saadan"
  },
  {
    "id": "E18",
    "kind": "email",
    "date": "2027-03-13",
    "title": "Send E18: Final deadline reminders (1 week)",
    "detail": "To: All registered-interest contacts, schools, teachers, partner universities, students with incomplete submissions",
    "owner": "Saadan"
  },
  {
    "id": "P37",
    "kind": "post",
    "date": "2027-03-13",
    "time": "19:00",
    "title": "One week left",
    "detail": "Instagram, LinkedIn, Facebook, WhatsApp channel/groups · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "E18b",
    "kind": "email",
    "date": "2027-03-18",
    "title": "Send E18: Final deadline reminders (2 days)",
    "detail": "To: All registered-interest contacts, schools, teachers, partner universities, students with incomplete submissions",
    "owner": "Saadan"
  },
  {
    "id": "P38",
    "kind": "post",
    "date": "2027-03-18",
    "time": "19:00",
    "title": "2 days left",
    "detail": "Instagram, Instagram Story, WhatsApp channel/groups · Story + single image",
    "owner": "Saadan"
  },
  {
    "id": "T45",
    "kind": "task",
    "date": "2027-03-20",
    "title": "SUBMISSIONS CLOSE (23:59 Istanbul)",
    "detail": "Review all remaining submissions over the weekend.",
    "owner": "Team"
  },
  {
    "id": "E18c",
    "kind": "email",
    "date": "2027-03-20",
    "title": "Send E18: Final deadline reminders (last day)",
    "detail": "To: All registered-interest contacts, schools, teachers, partner universities, students with incomplete submissions",
    "owner": "Saadan"
  },
  {
    "id": "P39",
    "kind": "post",
    "date": "2027-03-20",
    "time": "10:00",
    "title": "Last day",
    "detail": "Instagram, Instagram Story, LinkedIn, WhatsApp channel/groups · Story + single image",
    "owner": "Saadan"
  },
  {
    "id": "T46",
    "kind": "task",
    "date": "2027-03-22",
    "title": "Final decisions + programme build",
    "detail": "Programme sheet → PDF programme; send to Osman for approval by 17:00.",
    "owner": "Saadan"
  },
  {
    "id": "T47",
    "kind": "task",
    "date": "2027-03-23",
    "title": "Send programme (E19) + publish P40",
    "detail": "Ask participants to check names by 24 March 17:00.",
    "owner": "Saadan"
  },
  {
    "id": "E19",
    "kind": "email",
    "date": "2027-03-23",
    "title": "Send E19: Programme and practical information",
    "detail": "To: All accepted, paid presenters + supervisor teachers + jury + session chairs",
    "owner": "Saadan"
  },
  {
    "id": "P40",
    "kind": "post",
    "date": "2027-03-23",
    "time": "19:00",
    "title": "The programme is out",
    "detail": "Instagram, LinkedIn, Facebook, WhatsApp channel/groups · Single image + PDF",
    "owner": "Saadan"
  },
  {
    "id": "T48",
    "kind": "task",
    "date": "2027-03-24",
    "title": "Freeze lists; print badges and certificates",
    "detail": "Badges (Badge List sheet), certificate PDFs, signage, poster numbers; security entry list to IAU security; lunch numbers to catering. Volunteer briefing.",
    "owner": "Saadan"
  },
  {
    "id": "T49",
    "kind": "task",
    "date": "2027-03-25",
    "title": "Prepare registration kits",
    "detail": "Badges alphabetically, programme printouts, consent-form folder, lanyards, pens.",
    "owner": "Saadan"
  },
  {
    "id": "P41",
    "kind": "post",
    "date": "2027-03-25",
    "time": "19:00",
    "title": "What to bring",
    "detail": "Instagram, Instagram Story · Carousel (4 slides)",
    "owner": "Saadan"
  },
  {
    "id": "T50",
    "kind": "task",
    "date": "2027-03-26",
    "title": "Day-before reminder (E20) + venue set-up",
    "detail": "Test projectors, laptops, clickers, Wi-Fi; put up signage; P42 post.",
    "owner": "Team"
  },
  {
    "id": "E20",
    "kind": "email",
    "date": "2027-03-26",
    "title": "Send E20: Day-before reminder",
    "detail": "To: All participants, supervisors, jury, volunteers",
    "owner": "Saadan"
  },
  {
    "id": "P42",
    "kind": "post",
    "date": "2027-03-26",
    "time": "19:00",
    "title": "See you tomorrow + directions",
    "detail": "Instagram, Instagram Story, WhatsApp channel/groups · Single image + Story",
    "owner": "Saadan"
  },
  {
    "id": "T51",
    "kind": "task",
    "date": "2027-03-27",
    "title": "CONFERENCE DAY 1",
    "detail": "Run of Show in 07_Templates_and_Tools/Event_Day. Live stories (P43).",
    "owner": "Team"
  },
  {
    "id": "P43",
    "kind": "post",
    "date": "2027-03-27",
    "time": "09:00 + live",
    "title": "Day 1 live + highlights",
    "detail": "Instagram Story (live), Instagram, LinkedIn · Stories all day + evening post",
    "owner": "Saadan"
  },
  {
    "id": "T52",
    "kind": "task",
    "date": "2027-03-28",
    "title": "CONFERENCE DAY 2 + awards",
    "detail": "Jury scores by 14:00; award ceremony; closing photo (P44).",
    "owner": "Team"
  },
  {
    "id": "P44",
    "kind": "post",
    "date": "2027-03-28",
    "time": "18:00",
    "title": "Day 2 + awards + closing",
    "detail": "Instagram Story (live), Instagram, LinkedIn, Facebook · Stories all day + evening post",
    "owner": "Saadan"
  },
  {
    "id": "T53",
    "kind": "task",
    "date": "2027-03-29",
    "title": "Send press release (E23) and start certificates (E21)",
    "detail": "Certificates to all presenters by 2 April.",
    "owner": "Saadan"
  },
  {
    "id": "E21",
    "kind": "email",
    "date": "2027-03-29",
    "title": "Send E21: Certificates delivery",
    "detail": "To: All presenters (cc supervisor teachers), jury, session chairs, volunteers",
    "owner": "Saadan"
  },
  {
    "id": "E23",
    "kind": "email",
    "date": "2027-03-29",
    "title": "Send E23: Press release",
    "detail": "To: IAU Corporate Communications, local and education media, partner newsletters",
    "owner": "Saadan"
  },
  {
    "id": "P45",
    "kind": "post",
    "date": "2027-03-30",
    "time": "19:00",
    "title": "Thank you",
    "detail": "Instagram, LinkedIn, Facebook · Carousel (photos)",
    "owner": "Saadan"
  },
  {
    "id": "T54",
    "kind": "task",
    "date": "2027-04-01",
    "title": "Thank-you emails + survey (E22)",
    "detail": "Survey reminder 8 April.",
    "owner": "Saadan"
  },
  {
    "id": "E22",
    "kind": "email",
    "date": "2027-04-01",
    "title": "Send E22: Thank-you + feedback survey",
    "detail": "To: Supervisor teachers, school principals, partner universities, Pen Research, PAIU, IAU units",
    "owner": "Saadan"
  },
  {
    "id": "P46",
    "kind": "post",
    "date": "2027-04-01",
    "time": "19:00",
    "title": "Award winners",
    "detail": "Instagram, LinkedIn, Facebook · Carousel (award winners)",
    "owner": "Saadan"
  },
  {
    "id": "T55",
    "kind": "task",
    "date": "2027-04-03",
    "title": "Produce Video 3 (Recap)",
    "detail": "From day footage; consent-checked.",
    "owner": "Saadan"
  },
  {
    "id": "P47",
    "kind": "post",
    "date": "2027-04-06",
    "time": "19:00",
    "title": "VIDEO 3: Recap",
    "detail": "Instagram Reel, TikTok, YouTube, LinkedIn · Video (60s, 9:16 + 16:9)",
    "owner": "Saadan"
  },
  {
    "id": "E22b",
    "kind": "email",
    "date": "2027-04-08",
    "title": "Send E22: Thank-you + feedback survey (reminder / wave 2)",
    "detail": "To: Supervisor teachers, school principals, partner universities, Pen Research, PAIU, IAU units",
    "owner": "Saadan"
  },
  {
    "id": "T56",
    "kind": "task",
    "date": "2027-04-09",
    "title": "Compile the abstract book",
    "detail": "Accepted and presented abstracts only; ISBN if applicable.",
    "owner": "Pen Research"
  },
  {
    "id": "P48",
    "kind": "post",
    "date": "2027-04-10",
    "time": "12:00",
    "title": "Photo gallery",
    "detail": "Instagram, Facebook · Carousel (10 photos)",
    "owner": "Saadan"
  },
  {
    "id": "T57",
    "kind": "task",
    "date": "2027-04-15",
    "title": "Publish abstract book + post P49",
    "detail": "Upload to the website.",
    "owner": "Saadan"
  },
  {
    "id": "P49",
    "kind": "post",
    "date": "2027-04-15",
    "time": "19:00",
    "title": "Abstract book published",
    "detail": "Instagram, LinkedIn · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T58",
    "kind": "task",
    "date": "2027-04-16",
    "title": "Close finances",
    "detail": "Payments vs. invoices; refunds if any; costs.",
    "owner": "IAU Finance"
  },
  {
    "id": "T59",
    "kind": "task",
    "date": "2027-04-20",
    "title": "Final report to partners (E24)",
    "detail": "Use 'Final Report Outline' in 06_April_2027.",
    "owner": "Saadan"
  },
  {
    "id": "E24",
    "kind": "email",
    "date": "2027-04-20",
    "title": "Send E24: Final report to partners",
    "detail": "To: Osman Gültekin, Hasan Karacan, Pen Research, PAIU Rector's office",
    "owner": "Saadan"
  },
  {
    "id": "P50",
    "kind": "post",
    "date": "2027-04-20",
    "time": "19:00",
    "title": "See you next year",
    "detail": "Instagram, LinkedIn, Facebook · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T60",
    "kind": "task",
    "date": "2027-04-23",
    "title": "Debrief meeting: lessons learned for 2028",
    "detail": "What worked, what didn't, keep/stop/start list.",
    "owner": "Team"
  }
],
};

export const PROGRAMS: Program[] = [AJSRC];
