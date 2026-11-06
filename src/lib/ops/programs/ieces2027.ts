/**
 * IECES 2027, as a programme the desk can run.
 *
 * Generated from IECES_2027_Complete_Plan.zip (Master Tracker): 132 tasks,
 * 65 posts and 40 dated email sends. Progress is keyed by item id, so never
 * rename or reuse an id once the campaign is running; add new ids instead.
 */

import type { Program } from "./ajsrc";

export const IECES_2027: Program = {
  id: "ieces-2027",
  short: "IECES",
  name: "7th International Eurasian Conference on Educational and Social Studies",
  startsAt: "2027-10-22T10:00:00+03:00",
  deadlineAt: "2027-08-31T23:59:00+03:00",
  launch: "2027-01-12",
  venue: "Istanbul Aydın University, Florya Campus, and online",
  datesLabel: "22–24 October 2027",
  deadlineLabel: "regular deadline",
  ongoingNote: "Every abstract gets a received email within 2 working days and a decision within 10 days. No payment, no place in the programme.",
  target: { label: "registered participants", value: 500 },
  /**
   * Where each number should stand at the end of each month, cumulative,
   * from the Master Plan. It lives here rather than in the component
   * because it is a plan that can be revised, not a rule of the screen.
   */
  funnel: {
    beforeNote: "Call opens 12 January",
    stages: [
      { key: "submissions", label: "Submissions" },
      { key: "accepted", label: "Accepted" },
      { key: "paid", label: "Paid papers" },
      { key: "registered", label: "Registered" },
      { key: "onsite", label: "Onsite" },
      { key: "countries", label: "Countries" },
    ],
    months: [
      { key: "2027-01", submissions: 40, accepted: 25, paid: 5, registered: 8, onsite: 3, countries: 12 },
      { key: "2027-02", submissions: 100, accepted: 70, paid: 25, registered: 32, onsite: 12, countries: 20 },
      { key: "2027-03", submissions: 160, accepted: 120, paid: 50, registered: 62, onsite: 25, countries: 28 },
      { key: "2027-04", submissions: 230, accepted: 175, paid: 90, registered: 110, onsite: 40, countries: 32 },
      { key: "2027-05", submissions: 380, accepted: 290, paid: 140, registered: 170, onsite: 60, countries: 36 },
      { key: "2027-06", submissions: 400, accepted: 320, paid: 220, registered: 265, onsite: 70, countries: 38 },
      { key: "2027-07", submissions: 440, accepted: 350, paid: 260, registered: 315, onsite: 110, countries: 40 },
      { key: "2027-08", submissions: 600, accepted: 470, paid: 330, registered: 410, onsite: 160, countries: 42 },
      { key: "2027-09", submissions: 650, accepted: 520, paid: 400, registered: 500, onsite: 200, countries: 45 },
      { key: "2027-10", submissions: 650, accepted: 520, paid: 400, registered: 500, onsite: 200, countries: 45 },
    ],
  },
  months: [
  {
    "key": "2026-11",
    "name": "November 2026",
    "theme": "Debrief 2026 and lock the decisions",
    "goal": "Close IECES 2026 properly (numbers, thanks, lessons) and get every 2027 decision made, so the work from December onwards is execution, not discussion."
  },
  {
    "key": "2026-12",
    "name": "December 2026",
    "theme": "Foundations: committees, partners, website, form",
    "goal": "Build everything the launch needs: the call text, a tested form, all website pages drafted, payment channels, publication partners and the outreach database."
  },
  {
    "key": "2027-01",
    "name": "January 2027",
    "theme": "Launch the call for papers (12 January)",
    "goal": "Launch on Tuesday 12 January with all channels at once, reach every warm contact in the first two weeks, and start the rolling review."
  },
  {
    "key": "2027-02",
    "name": "February 2027",
    "theme": "Special sessions, partners and the first wave",
    "goal": "Grow beyond our own network: universities without a partnership, special sessions, keynotes confirmed, and Webinar 1 set up."
  },
  {
    "key": "2027-03",
    "name": "March 2027",
    "theme": "Webinar 1, Ramadan pause and the AJSRC crossover",
    "goal": "Run Webinar 1, keep momentum through Ramadan and Eid, close the special session call, and use AJSRC to reach teachers and supervisors."
  },
  {
    "key": "2027-04",
    "name": "April 2027",
    "theme": "Keynotes, publication partners and the second wave",
    "goal": "Turn credibility into submissions: announce keynotes and journals, publish the accepted special sessions, and start the early-bird countdown."
  },
  {
    "key": "2027-05",
    "name": "May 2027",
    "theme": "Early-bird push (deadline 31 May)",
    "goal": "Make the early-bird deadline (31 May) the biggest submission spike of the year."
  },
  {
    "key": "2027-06",
    "name": "June 2027",
    "theme": "Review, payments and the summer plan",
    "goal": "Convert accepted abstracts into payments, check honestly whether we are on track for 500, and plan the summer."
  },
  {
    "key": "2027-07",
    "name": "July 2027",
    "theme": "Visa letters and the onsite drive",
    "goal": "Secure the onsite numbers: visa letters, the Istanbul package, session chairs and volunteers."
  },
  {
    "key": "2027-08",
    "name": "August 2027",
    "theme": "Regular deadline (31 August)",
    "goal": "Make the regular deadline (31 August) the second spike, and start the logistics."
  },
  {
    "key": "2027-09",
    "name": "September 2027",
    "theme": "Final call, payments close, programme build",
    "goal": "Close submissions and payments, confirm every name, and build the programme from paid papers only."
  },
  {
    "key": "2027-10",
    "name": "October 2027",
    "theme": "Programme, the conference and certificates",
    "goal": "Publish the programme on 8 October, deliver three smooth days (onsite, hybrid, online), and send certificates within a week."
  },
  {
    "key": "2027-11",
    "name": "November 2027",
    "theme": "Publications, report and IECES 2028",
    "goal": "Publish what was presented, report honestly against the 500 target, and set up IECES 2028."
  }
],
  milestones: [
  {
    "date": "2026-11-24",
    "label": "Save the date to 2026 participants"
  },
  {
    "date": "2027-01-12",
    "label": "Call for papers opens"
  },
  {
    "date": "2027-03-31",
    "label": "Special sessions close"
  },
  {
    "date": "2027-05-31",
    "label": "Early-bird deadline"
  },
  {
    "date": "2027-07-30",
    "label": "Visa letter requests close"
  },
  {
    "date": "2027-08-31",
    "label": "Regular deadline"
  },
  {
    "date": "2027-09-15",
    "label": "Final deadline (online only)"
  },
  {
    "date": "2027-09-30",
    "label": "Payment deadline"
  },
  {
    "date": "2027-10-08",
    "label": "Programme published"
  },
  {
    "date": "2027-10-22",
    "label": "Conference day 1"
  },
  {
    "date": "2027-10-24",
    "label": "Conference day 3"
  },
  {
    "date": "2027-11-30",
    "label": "Abstract book published"
  }
],
  ongoing: [
  "E12: Submission received",
  "E13: Acceptance and payment",
  "E14: Revision request or decline",
  "Log every submission and payment in the Master Registry the same day",
  "Reply to every email within 2 working days"
],
  items: [
  {
    "id": "T001",
    "kind": "task",
    "date": "2026-11-09",
    "title": "Send the plan and kick-off email (E01)",
    "detail": "Share this zip with Osman and Hasan; list the 8 decisions needed by 20 November.",
    "owner": "Saadan"
  },
  {
    "id": "E01",
    "kind": "email",
    "date": "2026-11-09",
    "title": "Send E01: Team kick-off and decisions",
    "detail": "To: Osman Gültekin, Hasan Karacan (internal)",
    "owner": "Saadan"
  },
  {
    "id": "T002",
    "kind": "task",
    "date": "2026-11-11",
    "title": "Write the IECES 2026 numbers report",
    "detail": "Submissions, accepted, paid, onsite vs online, countries, both sides (Chair + Pen). Fill the '2026 Baseline' sheet. These numbers are the base for every 2027 target.",
    "owner": "Saadan"
  },
  {
    "id": "T003",
    "kind": "task",
    "date": "2026-11-13",
    "title": "IECES 2026 debrief meeting (60 min)",
    "detail": "Use the 'Lessons from 2026' table in the Master Plan. Agree keep / stop / start.",
    "owner": "Team"
  },
  {
    "id": "T004",
    "kind": "task",
    "date": "2026-11-16",
    "title": "Decide theme, tracks, fees, key dates and format",
    "detail": "Approve or change the proposals in the Master Plan sections 3–6.",
    "owner": "Osman"
  },
  {
    "id": "T005",
    "kind": "task",
    "date": "2026-11-18",
    "title": "Request full website access and a proper form from IAU IT (E03)",
    "detail": "Field-by-field form spec (Form Fields sheet) and a request for Administrator or a dedicated site manager.",
    "owner": "Saadan"
  },
  {
    "id": "E03",
    "kind": "email",
    "date": "2026-11-18",
    "title": "Send E03: IAU IT: website access and submission form",
    "detail": "To: IAU Bilgi İşlem (IT), CC Osman Gültekin",
    "owner": "Saadan"
  },
  {
    "id": "T006",
    "kind": "task",
    "date": "2026-11-19",
    "title": "Clean the 2026 contact list",
    "detail": "One list of 2026 authors, co-authors and listeners with consent to be contacted about IECES. No ID or passport data.",
    "owner": "Saadan"
  },
  {
    "id": "T007",
    "kind": "task",
    "date": "2026-11-20",
    "title": "Confirm Pen Research's role and their 2026 list (E02)",
    "detail": "Who handles which countries, payments and abstract book; merge both 2026 lists into the 2027 Master Registry format.",
    "owner": "Hasan / Pen"
  },
  {
    "id": "E02",
    "kind": "email",
    "date": "2026-11-20",
    "title": "Send E02: Pen Research coordination",
    "detail": "To: Hasan Karacan, Pen Research team",
    "owner": "Saadan"
  },
  {
    "id": "T008",
    "kind": "task",
    "date": "2026-11-23",
    "title": "Prepare the save-the-date visual and email",
    "detail": "P01 visual (dates, Istanbul, hybrid). Email E04 to all 2026 participants.",
    "owner": "Saadan"
  },
  {
    "id": "T009",
    "kind": "task",
    "date": "2026-11-24",
    "title": "Send thank-you + save the date to IECES 2026 participants (E04)",
    "detail": "BCC, from ieces@aydin.edu.tr. Include the photo album link and the 2027 dates.",
    "owner": "Saadan"
  },
  {
    "id": "E04",
    "kind": "email",
    "date": "2026-11-24",
    "title": "Send E04: Thank you + save the date (IECES 2026 participants)",
    "detail": "To: All IECES 2026 authors, co-authors and listeners (BCC)",
    "owner": "Saadan"
  },
  {
    "id": "P01",
    "kind": "post",
    "date": "2026-11-24",
    "time": "10:00",
    "title": "Thank you + save the date",
    "detail": "LinkedIn, Instagram, Facebook, X · Single image (4:5) + LinkedIn 1200×627",
    "owner": "Saadan"
  },
  {
    "id": "T010",
    "kind": "task",
    "date": "2026-11-25",
    "title": "Update the website for 2027 (phase 1)",
    "detail": "Home: 2027 dates and save the date; 2026 archive page with photos, programme and abstract book.",
    "owner": "Saadan"
  },
  {
    "id": "T011",
    "kind": "task",
    "date": "2026-11-27",
    "title": "Invite Scientific Committee members (E05)",
    "detail": "Keep 2026 members who reviewed; add 15–20 new names from partner universities across 25+ countries.",
    "owner": "Osman"
  },
  {
    "id": "E05",
    "kind": "email",
    "date": "2026-11-27",
    "title": "Send E05: Scientific Committee invitation",
    "detail": "To: Academics from partner universities (individual emails)",
    "owner": "Saadan"
  },
  {
    "id": "P02",
    "kind": "post",
    "date": "2026-11-27",
    "time": "10:00",
    "title": "IECES 2026 in numbers",
    "detail": "LinkedIn, Instagram · Carousel (6 slides)",
    "owner": "Saadan"
  },
  {
    "id": "T012",
    "kind": "task",
    "date": "2026-11-30",
    "title": "November review",
    "detail": "Decisions made? Baseline filled? Send a 5-line update to Osman.",
    "owner": "Saadan"
  },
  {
    "id": "T013",
    "kind": "task",
    "date": "2026-12-01",
    "title": "Shortlist keynote speakers (4–5)",
    "detail": "Mix: one big name, one UNESCO/policy voice, one from the region, one AI-in-education voice. Online keynotes are fine.",
    "owner": "Osman"
  },
  {
    "id": "T014",
    "kind": "task",
    "date": "2026-12-03",
    "title": "Write the Call for Papers (EN + TR) and the 1-page flyer",
    "detail": "Theme text, 8 tracks, key dates, fees, publication options, submission link.",
    "owner": "Saadan"
  },
  {
    "id": "P03",
    "kind": "post",
    "date": "2026-12-03",
    "time": "19:00",
    "title": "Moments from IECES 2026",
    "detail": "Instagram, Facebook, LinkedIn · Carousel (8 photos)",
    "owner": "Saadan"
  },
  {
    "id": "T015",
    "kind": "task",
    "date": "2026-12-04",
    "title": "Secure publication partners",
    "detail": "Abstract book ISBN; proceedings with DOI; 2–3 partner journals (indexed where possible) for extended papers. Get written confirmation.",
    "owner": "Hasan / Pen"
  },
  {
    "id": "T016",
    "kind": "task",
    "date": "2026-12-07",
    "title": "Build the submission and registration form",
    "detail": "From the Form Fields sheet. Includes theme field, co-authors, mode (onsite/online), certificate name, invoice details.",
    "owner": "IAU IT"
  },
  {
    "id": "T017",
    "kind": "task",
    "date": "2026-12-08",
    "title": "Set up the Master Registry and Operations workbook on Drive",
    "detail": "Upload IECES_2027_Operations.xlsx as a Google Sheet; share with Osman and Pen only.",
    "owner": "Saadan"
  },
  {
    "id": "T018",
    "kind": "task",
    "date": "2026-12-09",
    "title": "Agree payment channels",
    "detail": "Card link, bank details (EUR and TL), invoice issuer, refund rule. Name one Finance contact.",
    "owner": "Finance"
  },
  {
    "id": "T019",
    "kind": "task",
    "date": "2026-12-10",
    "title": "Build the outreach database (wave 1)",
    "detail": "Partner universities (IAU International Office MoUs and Erasmus partners), 2026 authors' institutions, Turkish faculties of education.",
    "owner": "Saadan"
  },
  {
    "id": "T020",
    "kind": "task",
    "date": "2026-12-14",
    "title": "Invite keynote speakers (E06)",
    "detail": "Personalised; offer online or onsite; ask for a title and bio by 15 February.",
    "owner": "Saadan"
  },
  {
    "id": "E06",
    "kind": "email",
    "date": "2026-12-14",
    "title": "Send E06: Keynote speaker invitation",
    "detail": "To: Shortlisted keynote speakers (individual emails, from or signed by Osman)",
    "owner": "Saadan"
  },
  {
    "id": "T021",
    "kind": "task",
    "date": "2026-12-15",
    "title": "Test the form end to end",
    "detail": "Submit 3 test entries (onsite, online, student with co-authors), check emails and the sheet, then delete them and log 'test removed'.",
    "owner": "Saadan"
  },
  {
    "id": "T022",
    "kind": "task",
    "date": "2026-12-16",
    "title": "Prepare website phase 2 pages",
    "detail": "Call for Papers, Tracks, Important Dates, Fees, Submission Guidelines, Publications, Committees, Venue and Travel, FAQ, Contact. Draft all pages now.",
    "owner": "Saadan"
  },
  {
    "id": "P04",
    "kind": "post",
    "date": "2026-12-17",
    "time": "10:00",
    "title": "Teaser: the call opens 12 January",
    "detail": "LinkedIn, Instagram · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T023",
    "kind": "task",
    "date": "2026-12-18",
    "title": "Design the launch visuals (P05–P10) in Canva",
    "detail": "Brand kit in the Master Plan; prepare LinkedIn and Instagram sizes.",
    "owner": "Saadan"
  },
  {
    "id": "T024",
    "kind": "task",
    "date": "2026-12-21",
    "title": "List conference portals and calls listings",
    "detail": "ConferenceIndex, ConferenceAlerts, 10times, Academia.edu and ResearchGate events, H-Net, university research-office newsletters. Avoid predatory 'conference farm' sites.",
    "owner": "Saadan"
  },
  {
    "id": "T025",
    "kind": "task",
    "date": "2026-12-23",
    "title": "Brief the IAU International Office team",
    "detail": "Ask staff to forward the call to all partner universities in January (E08).",
    "owner": "Osman"
  },
  {
    "id": "T026",
    "kind": "task",
    "date": "2026-12-30",
    "title": "December review",
    "detail": "Form tested? Pages drafted? Publication partners confirmed? Update KPIs.",
    "owner": "Saadan"
  },
  {
    "id": "T027",
    "kind": "task",
    "date": "2027-01-05",
    "title": "Publish website phase 2 (all CFP pages)",
    "detail": "Check every link and the form from a phone and from outside campus.",
    "owner": "Saadan"
  },
  {
    "id": "T028",
    "kind": "task",
    "date": "2027-01-07",
    "title": "Brief IAU Corporate Communications (E07)",
    "detail": "University news item, social posts on launch day, logo files and campus photos.",
    "owner": "Corporate Comms"
  },
  {
    "id": "E07",
    "kind": "email",
    "date": "2027-01-07",
    "title": "Send E07: IAU Corporate Communications brief",
    "detail": "To: IAU Kurumsal İletişim",
    "owner": "Saadan"
  },
  {
    "id": "T029",
    "kind": "task",
    "date": "2027-01-11",
    "title": "Schedule launch posts and emails",
    "detail": "P05–P07 in Meta Business Suite and LinkedIn; E08–E10 ready in drafts.",
    "owner": "Saadan"
  },
  {
    "id": "T030",
    "kind": "task",
    "date": "2027-01-12",
    "title": "LAUNCH: call for papers opens",
    "detail": "Post P05 on all channels; everyone shares on personal LinkedIn; WhatsApp to academic groups.",
    "owner": "Team"
  },
  {
    "id": "T031",
    "kind": "task",
    "date": "2027-01-12",
    "title": "Email all IECES 2026 participants: call is open (E09)",
    "detail": "Ask them to submit and to share with colleagues. Mention the early-bird rate.",
    "owner": "Saadan"
  },
  {
    "id": "E09",
    "kind": "email",
    "date": "2027-01-12",
    "title": "Send E09: Call is open (IECES 2026 participants)",
    "detail": "To: All IECES 2026 participants (BCC)",
    "owner": "Saadan"
  },
  {
    "id": "P05",
    "kind": "post",
    "date": "2027-01-12",
    "time": "10:00",
    "title": "LAUNCH: Call for papers is open",
    "detail": "LinkedIn, Instagram, Facebook, X, WhatsApp groups · Single image (4:5) + LinkedIn 1200×627",
    "owner": "Saadan"
  },
  {
    "id": "T032",
    "kind": "task",
    "date": "2027-01-13",
    "title": "International Office mailing to partner universities (E08)",
    "detail": "Sent by the International Office to all MoU and Erasmus partners.",
    "owner": "Saadan"
  },
  {
    "id": "E08",
    "kind": "email",
    "date": "2027-01-13",
    "title": "Send E08: Call for papers to partner universities",
    "detail": "To: International offices and deans at IAU partner universities (sent by the International Office, BCC)",
    "owner": "Saadan"
  },
  {
    "id": "P06",
    "kind": "post",
    "date": "2027-01-14",
    "time": "10:00",
    "title": "The 2027 theme, explained",
    "detail": "LinkedIn, Instagram · Carousel (6 slides)",
    "owner": "Saadan"
  },
  {
    "id": "T033",
    "kind": "task",
    "date": "2027-01-15",
    "title": "Post the call on conference portals",
    "detail": "Use the list from T024; log each listing with its link.",
    "owner": "Saadan"
  },
  {
    "id": "T034",
    "kind": "task",
    "date": "2027-01-18",
    "title": "Turkish universities wave 1 (E10)",
    "detail": "Faculties of education, social sciences institutes, graduate schools: 25–30 personalised emails a day.",
    "owner": "Saadan"
  },
  {
    "id": "E10-1",
    "kind": "email",
    "date": "2027-01-18",
    "title": "Send E10: Call for papers to Turkish universities (1/3)",
    "detail": "To: Turkish faculties of education, social sciences institutes, graduate schools (individual or small BCC batches)",
    "owner": "Saadan"
  },
  {
    "id": "P07",
    "kind": "post",
    "date": "2027-01-19",
    "time": "10:00",
    "title": "Eight tracks",
    "detail": "LinkedIn, Instagram, Facebook · Carousel (9 slides)",
    "owner": "Saadan"
  },
  {
    "id": "T035",
    "kind": "task",
    "date": "2027-01-20",
    "title": "Launch the special session call (E11, P09)",
    "detail": "Partners can propose a themed session of 5–8 papers; organiser gets a fee waiver if 5 papers are paid.",
    "owner": "Saadan"
  },
  {
    "id": "E11",
    "kind": "email",
    "date": "2027-01-20",
    "title": "Send E11: Call for special sessions",
    "detail": "To: Active 2026 authors, partner departments, committee members (individual emails)",
    "owner": "Saadan"
  },
  {
    "id": "P08",
    "kind": "post",
    "date": "2027-01-21",
    "time": "10:00",
    "title": "Key dates",
    "detail": "LinkedIn, Instagram, Facebook, X · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T036",
    "kind": "task",
    "date": "2027-01-22",
    "title": "Pen Research network mailing",
    "detail": "Balkans, Poland, Baltics, Central Asia, Caucasus, MENA lists. Same text as E08.",
    "owner": "Hasan / Pen"
  },
  {
    "id": "T037",
    "kind": "task",
    "date": "2027-01-25",
    "title": "Start rolling review",
    "detail": "Every abstract: received email (E12) within 2 days, decision within 10 days (E13 / E14 / decline).",
    "owner": "Saadan"
  },
  {
    "id": "P09",
    "kind": "post",
    "date": "2027-01-26",
    "time": "10:00",
    "title": "Call for special sessions",
    "detail": "LinkedIn · Single image (1200×627)",
    "owner": "Saadan"
  },
  {
    "id": "T038",
    "kind": "task",
    "date": "2027-01-27",
    "title": "Invite 2026 participants to be country ambassadors (E15)",
    "detail": "One per country; 5 paid referrals = their own fee waived; ambassador certificate.",
    "owner": "Saadan"
  },
  {
    "id": "E15",
    "kind": "email",
    "date": "2027-01-27",
    "title": "Send E15: Country ambassador invitation",
    "detail": "To: Selected 2026 participants, one or two per country",
    "owner": "Saadan"
  },
  {
    "id": "P10",
    "kind": "post",
    "date": "2027-01-28",
    "time": "19:00",
    "title": "Fees and early bird",
    "detail": "Instagram, Facebook, LinkedIn · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T039",
    "kind": "task",
    "date": "2027-01-29",
    "title": "January review",
    "detail": "Submissions, reach, top posts; first numbers to Osman.",
    "owner": "Saadan"
  },
  {
    "id": "T040",
    "kind": "task",
    "date": "2027-02-01",
    "title": "Turkish universities wave 2 (E10)",
    "detail": "Remaining faculties; add student societies and graduate student associations.",
    "owner": "Saadan"
  },
  {
    "id": "E10-2",
    "kind": "email",
    "date": "2027-02-01",
    "title": "Send E10: Call for papers to Turkish universities (2/3)",
    "detail": "To: Turkish faculties of education, social sciences institutes, graduate schools (individual or small BCC batches)",
    "owner": "Saadan"
  },
  {
    "id": "P11",
    "kind": "post",
    "date": "2027-02-02",
    "time": "10:00",
    "title": "Publish with IECES",
    "detail": "LinkedIn, Instagram · Carousel (5 slides)",
    "owner": "Saadan"
  },
  {
    "id": "T041",
    "kind": "task",
    "date": "2027-02-03",
    "title": "Set up Webinar 1: 'Writing an abstract that gets accepted'",
    "detail": "Zoom, 45 min, 3 March 18:00 Istanbul; registration form; speaker: Osman or a committee member.",
    "owner": "Saadan"
  },
  {
    "id": "P12",
    "kind": "post",
    "date": "2027-02-04",
    "time": "19:00",
    "title": "How to submit in 5 steps",
    "detail": "Instagram, Facebook, LinkedIn · Carousel (6 slides)",
    "owner": "Saadan"
  },
  {
    "id": "T042",
    "kind": "task",
    "date": "2027-02-05",
    "title": "Confirm keynotes and collect bios and photos",
    "detail": "At least 3 confirmed by 15 February for the April announcement.",
    "owner": "Osman"
  },
  {
    "id": "T043",
    "kind": "task",
    "date": "2027-02-08",
    "title": "International wave 1: universities without a partnership (E16)",
    "detail": "Education and social science departments in 30 target countries (Outreach Targets).",
    "owner": "Saadan"
  },
  {
    "id": "E16-1",
    "kind": "email",
    "date": "2027-02-08",
    "title": "Send E16: Call to universities without a partnership (1/3)",
    "detail": "To: Education and social science departments in 30 target countries (individual or small BCC batches)",
    "owner": "Saadan"
  },
  {
    "id": "P13",
    "kind": "post",
    "date": "2027-02-09",
    "time": "10:00",
    "title": "Become an IECES country ambassador",
    "detail": "LinkedIn · Single image (1200×627)",
    "owner": "Saadan"
  },
  {
    "id": "T044",
    "kind": "task",
    "date": "2027-02-10",
    "title": "Confirm journal special issues in writing",
    "detail": "Journal name, indexing, APC, timeline, contact editor. Add to the Publications page.",
    "owner": "Hasan / Pen"
  },
  {
    "id": "P14",
    "kind": "post",
    "date": "2027-02-11",
    "time": "19:00",
    "title": "Onsite or online? Both work",
    "detail": "Instagram, Facebook, LinkedIn · Carousel (4 slides)",
    "owner": "Saadan"
  },
  {
    "id": "T045",
    "kind": "task",
    "date": "2027-02-12",
    "title": "Produce Video 1 (Why IECES? 45 s)",
    "detail": "IECES 2026 footage, campus, Istanbul; captions EN; script in Video_Scripts.",
    "owner": "Saadan"
  },
  {
    "id": "T046",
    "kind": "task",
    "date": "2027-02-15",
    "title": "Invite to Webinar 1 (E17)",
    "detail": "All contacts so far + portals + LinkedIn event.",
    "owner": "Saadan"
  },
  {
    "id": "E17",
    "kind": "email",
    "date": "2027-02-15",
    "title": "Send E17: Webinar 1 invitation",
    "detail": "To: All contacts so far (BCC) + LinkedIn event",
    "owner": "Saadan"
  },
  {
    "id": "P15",
    "kind": "post",
    "date": "2027-02-16",
    "time": "10:00",
    "title": "Webinar 1: Writing an abstract that gets accepted",
    "detail": "LinkedIn event, Instagram, Facebook · Single image (4:5) + LinkedIn event",
    "owner": "Saadan"
  },
  {
    "id": "T047",
    "kind": "task",
    "date": "2027-02-17",
    "title": "Ramadan schedule switch",
    "detail": "Ramadan ≈ 8 Feb – 9 Mar 2027: Turkish and MENA posts at 21:30; no emails on Eid (≈ 9–11 March).",
    "owner": "Saadan"
  },
  {
    "id": "P16",
    "kind": "post",
    "date": "2027-02-18",
    "time": "10:00",
    "title": "Meet the organisers",
    "detail": "LinkedIn, Instagram · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T048",
    "kind": "task",
    "date": "2027-02-19",
    "title": "Confirm the review process",
    "detail": "Two reviewers per abstract for borderline cases; scoring sheet; conflict-of-interest rule.",
    "owner": "Committee"
  },
  {
    "id": "T049",
    "kind": "task",
    "date": "2027-02-22",
    "title": "Follow up special session proposals",
    "detail": "Personal email to partners who showed interest.",
    "owner": "Saadan"
  },
  {
    "id": "P17",
    "kind": "post",
    "date": "2027-02-23",
    "time": "10:00",
    "title": "Our Scientific Committee",
    "detail": "LinkedIn · Single image (1200×627)",
    "owner": "Saadan"
  },
  {
    "id": "P18",
    "kind": "post",
    "date": "2027-02-25",
    "time": "19:00",
    "title": "Voices from 2026",
    "detail": "Instagram, LinkedIn · Single image (4:5) quote card",
    "owner": "Saadan"
  },
  {
    "id": "T050",
    "kind": "task",
    "date": "2027-02-26",
    "title": "February review",
    "detail": "Submissions vs target; reply rate per wave; adjust March plan.",
    "owner": "Saadan"
  },
  {
    "id": "T051",
    "kind": "task",
    "date": "2027-03-01",
    "title": "Run reminders for Webinar 1",
    "detail": "1 and 3 March; LinkedIn event reminder.",
    "owner": "Saadan"
  },
  {
    "id": "P19",
    "kind": "post",
    "date": "2027-03-02",
    "time": "21:30",
    "title": "Webinar 1 is tomorrow",
    "detail": "Instagram Story, LinkedIn · Story + post",
    "owner": "Saadan"
  },
  {
    "id": "T052",
    "kind": "task",
    "date": "2027-03-03",
    "title": "Webinar 1 (18:00 Istanbul)",
    "detail": "Record; share the recording and the abstract template next morning (E18).",
    "owner": "Team"
  },
  {
    "id": "E18",
    "kind": "email",
    "date": "2027-03-04",
    "title": "Send E18: Webinar 1 recording",
    "detail": "To: All webinar registrants (BCC)",
    "owner": "Saadan"
  },
  {
    "id": "T053",
    "kind": "task",
    "date": "2027-03-08",
    "title": "International wave 2 (E16)",
    "detail": "Follow up wave 1 with no reply; new countries.",
    "owner": "Saadan"
  },
  {
    "id": "E16-2",
    "kind": "email",
    "date": "2027-03-08",
    "title": "Send E16: Call to universities without a partnership (2/3)",
    "detail": "To: Education and social science departments in 30 target countries (individual or small BCC batches)",
    "owner": "Saadan"
  },
  {
    "id": "P20",
    "kind": "post",
    "date": "2027-03-09",
    "time": "10:00",
    "title": "Track spotlight: Digital Education and AI",
    "detail": "LinkedIn, Instagram · Carousel (4 slides)",
    "owner": "Saadan"
  },
  {
    "id": "T054",
    "kind": "task",
    "date": "2027-03-12",
    "title": "Publish Video 1 (P21)",
    "detail": "LinkedIn native video + Instagram Reel.",
    "owner": "Saadan"
  },
  {
    "id": "P21",
    "kind": "post",
    "date": "2027-03-12",
    "time": "19:00",
    "title": "VIDEO 1: Why IECES?",
    "detail": "LinkedIn native video, Instagram Reel, YouTube Shorts · Video (45 s, 9:16 and 1:1)",
    "owner": "Saadan"
  },
  {
    "id": "T055",
    "kind": "task",
    "date": "2027-03-15",
    "title": "Plan the AJSRC crossover",
    "detail": "IECES flyer and QR at AJSRC (27–28 March); invite AJSRC teachers and supervisors to submit to IECES.",
    "owner": "Saadan"
  },
  {
    "id": "P22",
    "kind": "post",
    "date": "2027-03-16",
    "time": "10:00",
    "title": "Track spotlight: Internationalisation and Mobility",
    "detail": "LinkedIn, Instagram · Carousel (4 slides)",
    "owner": "Saadan"
  },
  {
    "id": "T056",
    "kind": "task",
    "date": "2027-03-19",
    "title": "Special session reminder (E11 follow-up)",
    "detail": "Deadline 31 March.",
    "owner": "Saadan"
  },
  {
    "id": "P23",
    "kind": "post",
    "date": "2027-03-23",
    "time": "10:00",
    "title": "Special sessions: last week",
    "detail": "LinkedIn · Single image (1200×627)",
    "owner": "Saadan"
  },
  {
    "id": "T057",
    "kind": "task",
    "date": "2027-03-26",
    "title": "Set up IECES desk at AJSRC",
    "detail": "Roll-up, flyers, QR; collect emails of interested academics.",
    "owner": "Saadan"
  },
  {
    "id": "P24",
    "kind": "post",
    "date": "2027-03-27",
    "time": "16:00",
    "title": "From AJSRC to IECES",
    "detail": "Instagram Story, LinkedIn · Photo + story",
    "owner": "Saadan"
  },
  {
    "id": "T058",
    "kind": "task",
    "date": "2027-03-31",
    "title": "Special session proposals close; decide by 9 April",
    "detail": "Accepted sessions get their own page section and a call they can share.",
    "owner": "Committee"
  },
  {
    "id": "T059",
    "kind": "task",
    "date": "2027-03-31",
    "title": "March review + Q1 report to Osman",
    "detail": "Q1 numbers vs plan: submissions, countries, channels that work.",
    "owner": "Saadan"
  },
  {
    "id": "T060",
    "kind": "task",
    "date": "2027-04-05",
    "title": "Announce keynotes (P25, P27, P29)",
    "detail": "One post per keynote across two weeks; update the Keynotes page.",
    "owner": "Saadan"
  },
  {
    "id": "P25",
    "kind": "post",
    "date": "2027-04-06",
    "time": "10:00",
    "title": "Keynote 1",
    "detail": "LinkedIn, Instagram, Facebook, X · Single image (4:5) speaker card",
    "owner": "Saadan"
  },
  {
    "id": "T061",
    "kind": "task",
    "date": "2027-04-07",
    "title": "Announce publication partners (P26, E19)",
    "detail": "Publications page: abstract book ISBN, proceedings DOI, journals with indexing.",
    "owner": "Saadan"
  },
  {
    "id": "P26",
    "kind": "post",
    "date": "2027-04-08",
    "time": "10:00",
    "title": "Publication partners announced",
    "detail": "LinkedIn, Instagram · Carousel (4 slides)",
    "owner": "Saadan"
  },
  {
    "id": "T062",
    "kind": "task",
    "date": "2027-04-09",
    "title": "Send special session decisions",
    "detail": "Organisers get a shareable session call (template in E11).",
    "owner": "Committee"
  },
  {
    "id": "E19",
    "kind": "email",
    "date": "2027-04-09",
    "title": "Send E19: Keynotes and publication partners announced",
    "detail": "To: All contacts who agreed to updates (BCC)",
    "owner": "Saadan"
  },
  {
    "id": "T063",
    "kind": "task",
    "date": "2027-04-12",
    "title": "Turkish universities wave 3 + rectorate letter",
    "detail": "Ask Osman whether a rectorate letter (resmî yazı) to Turkish universities helps.",
    "owner": "Saadan"
  },
  {
    "id": "E10-3",
    "kind": "email",
    "date": "2027-04-12",
    "title": "Send E10: Call for papers to Turkish universities (3/3)",
    "detail": "To: Turkish faculties of education, social sciences institutes, graduate schools (individual or small BCC batches)",
    "owner": "Saadan"
  },
  {
    "id": "P27",
    "kind": "post",
    "date": "2027-04-13",
    "time": "10:00",
    "title": "Keynote 2",
    "detail": "LinkedIn, Instagram, Facebook, X · Single image (4:5) speaker card",
    "owner": "Saadan"
  },
  {
    "id": "T064",
    "kind": "task",
    "date": "2027-04-14",
    "title": "Set up Webinar 2: 'Publishing your conference paper in an indexed journal'",
    "detail": "5 May 18:00; speaker: partner journal editor.",
    "owner": "Saadan"
  },
  {
    "id": "P28",
    "kind": "post",
    "date": "2027-04-15",
    "time": "10:00",
    "title": "Accepted special sessions",
    "detail": "LinkedIn · Carousel (1 slide per session)",
    "owner": "Saadan"
  },
  {
    "id": "T065",
    "kind": "task",
    "date": "2027-04-16",
    "title": "Early-bird campaign plan",
    "detail": "Countdown posts, reminder emails, ambassador push; LinkedIn ads test (small budget).",
    "owner": "Saadan"
  },
  {
    "id": "T066",
    "kind": "task",
    "date": "2027-04-20",
    "title": "Approve the onsite social programme",
    "detail": "Welcome reception (Day 1 evening), Bosphorus and old city tour (Day 3), gala dinner option.",
    "owner": "Osman"
  },
  {
    "id": "P29",
    "kind": "post",
    "date": "2027-04-20",
    "time": "10:00",
    "title": "Keynote 3",
    "detail": "LinkedIn, Instagram, Facebook, X · Single image (4:5) speaker card",
    "owner": "Saadan"
  },
  {
    "id": "P30",
    "kind": "post",
    "date": "2027-04-22",
    "time": "10:00",
    "title": "Webinar 2: Publishing your conference paper",
    "detail": "LinkedIn event, Instagram · Single image (4:5) + LinkedIn event",
    "owner": "Saadan"
  },
  {
    "id": "T067",
    "kind": "task",
    "date": "2027-04-23",
    "title": "Hotel and transfer agreement",
    "detail": "Ask the 2026 hotel for a 2027 group rate; airport transfer price; book a room block.",
    "owner": "Saadan"
  },
  {
    "id": "T068",
    "kind": "task",
    "date": "2027-04-26",
    "title": "International wave 3 + ambassador check-in",
    "detail": "Ambassadors' referrals counted; thank top ambassadors publicly.",
    "owner": "Saadan"
  },
  {
    "id": "E16-3",
    "kind": "email",
    "date": "2027-04-26",
    "title": "Send E16: Call to universities without a partnership (3/3)",
    "detail": "To: Education and social science departments in 30 target countries (individual or small BCC batches)",
    "owner": "Saadan"
  },
  {
    "id": "P31",
    "kind": "post",
    "date": "2027-04-27",
    "time": "19:00",
    "title": "Why Istanbul?",
    "detail": "Instagram, Facebook, LinkedIn · Carousel (5 slides)",
    "owner": "Saadan"
  },
  {
    "id": "P32",
    "kind": "post",
    "date": "2027-04-29",
    "time": "10:00",
    "title": "One month to the early-bird deadline",
    "detail": "LinkedIn, Instagram, Facebook, X · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T069",
    "kind": "task",
    "date": "2027-04-30",
    "title": "April review",
    "detail": "KPIs; submissions per track; which tracks need a push.",
    "owner": "Saadan"
  },
  {
    "id": "T070",
    "kind": "task",
    "date": "2027-05-03",
    "title": "Early-bird reminder 1 (E20)",
    "detail": "To everyone who has not submitted, incl. webinar attendees.",
    "owner": "Saadan"
  },
  {
    "id": "E20-1",
    "kind": "email",
    "date": "2027-05-03",
    "title": "Send E20: Early-bird reminder (1/2)",
    "detail": "To: Everyone who has not submitted (BCC): contacts, webinar attendees, ambassadors",
    "owner": "Saadan"
  },
  {
    "id": "P33",
    "kind": "post",
    "date": "2027-05-04",
    "time": "19:00",
    "title": "Webinar 2 is tomorrow",
    "detail": "Instagram Story, LinkedIn · Story + post",
    "owner": "Saadan"
  },
  {
    "id": "T071",
    "kind": "task",
    "date": "2027-05-05",
    "title": "Webinar 2 (18:00 Istanbul)",
    "detail": "Record; send recording (E21).",
    "owner": "Team"
  },
  {
    "id": "T072",
    "kind": "task",
    "date": "2027-05-05",
    "title": "Track spotlights (P34, P35, P37)",
    "detail": "Push the weakest tracks.",
    "owner": "Saadan"
  },
  {
    "id": "E21",
    "kind": "email",
    "date": "2027-05-06",
    "title": "Send E21: Webinar 2 recording",
    "detail": "To: All webinar registrants (BCC)",
    "owner": "Saadan"
  },
  {
    "id": "P34",
    "kind": "post",
    "date": "2027-05-06",
    "time": "10:00",
    "title": "Track spotlight: Inclusion, Equity and Migration",
    "detail": "LinkedIn, Instagram · Carousel (4 slides)",
    "owner": "Saadan"
  },
  {
    "id": "P35",
    "kind": "post",
    "date": "2027-05-11",
    "time": "10:00",
    "title": "Track spotlight: Sustainability and Climate Education",
    "detail": "LinkedIn, Instagram · Carousel (4 slides)",
    "owner": "Saadan"
  },
  {
    "id": "P36",
    "kind": "post",
    "date": "2027-05-13",
    "time": "19:00",
    "title": "FAQ",
    "detail": "Instagram, Facebook, LinkedIn · Carousel (7 slides)",
    "owner": "Saadan"
  },
  {
    "id": "T073",
    "kind": "task",
    "date": "2027-05-14",
    "title": "Kurban Bayramı schedule",
    "detail": "Eid al-Adha ≈ 16–19 May 2027: no emails, light posting.",
    "owner": "Saadan"
  },
  {
    "id": "P37",
    "kind": "post",
    "date": "2027-05-20",
    "time": "10:00",
    "title": "Track spotlight: Education Policy and Leadership",
    "detail": "LinkedIn, Instagram · Carousel (4 slides)",
    "owner": "Saadan"
  },
  {
    "id": "T074",
    "kind": "task",
    "date": "2027-05-21",
    "title": "Early-bird reminder 2 (E20)",
    "detail": "Last 10 days.",
    "owner": "Saadan"
  },
  {
    "id": "E20-2",
    "kind": "email",
    "date": "2027-05-21",
    "title": "Send E20: Early-bird reminder (2/2)",
    "detail": "To: Everyone who has not submitted (BCC): contacts, webinar attendees, ambassadors",
    "owner": "Saadan"
  },
  {
    "id": "P38",
    "kind": "post",
    "date": "2027-05-25",
    "time": "10:00",
    "title": "One week left (early bird)",
    "detail": "LinkedIn, Instagram, Facebook, X · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T075",
    "kind": "task",
    "date": "2027-05-28",
    "title": "Last-72-hours push",
    "detail": "Posts P39–P40; ambassadors; WhatsApp groups.",
    "owner": "Saadan"
  },
  {
    "id": "P39",
    "kind": "post",
    "date": "2027-05-29",
    "time": "12:00",
    "title": "72 hours",
    "detail": "Instagram, Instagram Story, Facebook, WhatsApp groups · Single image + story countdown",
    "owner": "Saadan"
  },
  {
    "id": "T076",
    "kind": "task",
    "date": "2027-05-31",
    "title": "EARLY-BIRD ABSTRACT DEADLINE (23:59 Istanbul)",
    "detail": "Clear the review queue within 10 days.",
    "owner": "Team"
  },
  {
    "id": "P40",
    "kind": "post",
    "date": "2027-05-31",
    "time": "10:00",
    "title": "Last day: early bird",
    "detail": "LinkedIn, Instagram, Facebook, X · Single image + story",
    "owner": "Saadan"
  },
  {
    "id": "T077",
    "kind": "task",
    "date": "2027-06-03",
    "title": "Clear the early-bird review queue",
    "detail": "All early-bird abstracts decided by 10 June so authors can pay by 15 June.",
    "owner": "Committee"
  },
  {
    "id": "T078",
    "kind": "task",
    "date": "2027-06-07",
    "title": "Payment reminder: early bird ends 15 June (E22)",
    "detail": "Accepted but unpaid authors only.",
    "owner": "Saadan"
  },
  {
    "id": "E22",
    "kind": "email",
    "date": "2027-06-07",
    "title": "Send E22: Early-bird payment reminder",
    "detail": "To: Accepted, unpaid authors",
    "owner": "Saadan"
  },
  {
    "id": "P41",
    "kind": "post",
    "date": "2027-06-08",
    "time": "10:00",
    "title": "Early-bird payment ends 15 June",
    "detail": "LinkedIn, Instagram · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T079",
    "kind": "task",
    "date": "2027-06-10",
    "title": "Mid-campaign review with Osman (half-way)",
    "detail": "Are we on track for 500? Decide extra levers: more special sessions, deadline policy, ads.",
    "owner": "Saadan"
  },
  {
    "id": "T080",
    "kind": "task",
    "date": "2027-06-15",
    "title": "Early-bird payment deadline",
    "detail": "After today the regular fee applies.",
    "owner": "Team"
  },
  {
    "id": "T081",
    "kind": "task",
    "date": "2027-06-17",
    "title": "Publish the first numbers (P42)",
    "detail": "'Researchers from [X] countries have already registered.' Social proof works.",
    "owner": "Saadan"
  },
  {
    "id": "P42",
    "kind": "post",
    "date": "2027-06-17",
    "time": "10:00",
    "title": "[X] countries already",
    "detail": "LinkedIn, Instagram, Facebook · Single image (4:5) map",
    "owner": "Saadan"
  },
  {
    "id": "T082",
    "kind": "task",
    "date": "2027-06-21",
    "title": "Summer outreach plan",
    "detail": "Academics travel in July and August: schedule emails for early mornings, focus on regions on a different calendar (Central Asia, MENA, South Asia).",
    "owner": "Saadan"
  },
  {
    "id": "T083",
    "kind": "task",
    "date": "2027-06-24",
    "title": "Book halls, Zoom licences and technical staff",
    "detail": "Opening hall, 4–6 onsite halls, 6–8 Zoom rooms for Days 2–3, IT support.",
    "owner": "Osman"
  },
  {
    "id": "P43",
    "kind": "post",
    "date": "2027-06-24",
    "time": "10:00",
    "title": "Doctoral forum",
    "detail": "LinkedIn, Instagram · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T084",
    "kind": "task",
    "date": "2027-06-30",
    "title": "June review",
    "detail": "Paid papers vs target; onsite vs online split.",
    "owner": "Saadan"
  },
  {
    "id": "T085",
    "kind": "task",
    "date": "2027-07-01",
    "title": "Visa letter campaign (E23)",
    "detail": "To onsite authors from visa-required countries: request by 30 July.",
    "owner": "Saadan"
  },
  {
    "id": "E23",
    "kind": "email",
    "date": "2027-07-01",
    "title": "Send E23: Visa invitation letters",
    "detail": "To: Accepted onsite authors from visa-required countries",
    "owner": "Saadan"
  },
  {
    "id": "T086",
    "kind": "task",
    "date": "2027-07-05",
    "title": "Issue invitation letters within 3 working days of request",
    "detail": "Accepted and paid only; log in 'Invitation Letters'.",
    "owner": "Saadan"
  },
  {
    "id": "T087",
    "kind": "task",
    "date": "2027-07-05",
    "title": "Onsite drive: 'Why come to Istanbul' (P44–P46)",
    "detail": "Istanbul package, tour, onsite award, networking.",
    "owner": "Saadan"
  },
  {
    "id": "P44",
    "kind": "post",
    "date": "2027-07-06",
    "time": "19:00",
    "title": "Why present onsite",
    "detail": "Instagram, Facebook, LinkedIn · Carousel (5 slides)",
    "owner": "Saadan"
  },
  {
    "id": "T088",
    "kind": "task",
    "date": "2027-07-12",
    "title": "Invite session chairs (E24)",
    "detail": "Onsite chairs from IAU and partners; online chairs from the Scientific Committee.",
    "owner": "Saadan"
  },
  {
    "id": "E24",
    "kind": "email",
    "date": "2027-07-12",
    "title": "Send E24: Session chair invitation",
    "detail": "To: IAU faculty, Scientific Committee members, partner academics",
    "owner": "Saadan"
  },
  {
    "id": "P45",
    "kind": "post",
    "date": "2027-07-13",
    "time": "10:00",
    "title": "Istanbul package",
    "detail": "LinkedIn, Instagram · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T089",
    "kind": "task",
    "date": "2027-07-15",
    "title": "Volunteer call to IAU students (E25)",
    "detail": "25 volunteers incl. 8 Zoom hosts; training in October.",
    "owner": "Saadan"
  },
  {
    "id": "E25-1",
    "kind": "email",
    "date": "2027-07-15",
    "title": "Send E25: Volunteer call (IAU students) (1/2)",
    "detail": "To: IAU students via faculties and clubs",
    "owner": "Saadan"
  },
  {
    "id": "T090",
    "kind": "task",
    "date": "2027-07-20",
    "title": "Produce Video 2 (How to submit and pay)",
    "detail": "Screen recording of the form and payment; 60 s.",
    "owner": "Saadan"
  },
  {
    "id": "P46",
    "kind": "post",
    "date": "2027-07-20",
    "time": "10:00",
    "title": "Visa letters: request by 30 July",
    "detail": "LinkedIn, Instagram · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T091",
    "kind": "task",
    "date": "2027-07-26",
    "title": "Regular-deadline countdown plan",
    "detail": "Posts, emails, ambassador push for August.",
    "owner": "Saadan"
  },
  {
    "id": "P47",
    "kind": "post",
    "date": "2027-07-27",
    "time": "10:00",
    "title": "Best paper awards",
    "detail": "LinkedIn, Instagram · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T092",
    "kind": "task",
    "date": "2027-07-30",
    "title": "Visa invitation letter requests close",
    "detail": "Late requests only with Osman's approval.",
    "owner": "Team"
  },
  {
    "id": "T093",
    "kind": "task",
    "date": "2027-07-31",
    "title": "July review",
    "detail": "KPIs; visa letters issued; onsite registrations.",
    "owner": "Saadan"
  },
  {
    "id": "T094",
    "kind": "task",
    "date": "2027-08-02",
    "title": "Regular deadline reminder 1 (E26)",
    "detail": "Everyone who has not submitted; webinar attendees; portals.",
    "owner": "Saadan"
  },
  {
    "id": "E26-1",
    "kind": "email",
    "date": "2027-08-02",
    "title": "Send E26: Regular deadline reminder (1/2)",
    "detail": "To: Everyone who has not submitted (BCC)",
    "owner": "Saadan"
  },
  {
    "id": "P48",
    "kind": "post",
    "date": "2027-08-03",
    "time": "10:00",
    "title": "Four weeks to the regular deadline",
    "detail": "LinkedIn, Instagram, Facebook, X · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T095",
    "kind": "task",
    "date": "2027-08-06",
    "title": "Publish Video 2 (P49)",
    "detail": "",
    "owner": "Saadan"
  },
  {
    "id": "P49",
    "kind": "post",
    "date": "2027-08-06",
    "time": "19:00",
    "title": "VIDEO 2: How to submit and pay",
    "detail": "Instagram Reel, LinkedIn native video, YouTube Shorts · Video (60 s, 9:16)",
    "owner": "Saadan"
  },
  {
    "id": "T096",
    "kind": "task",
    "date": "2027-08-11",
    "title": "Quotes: printing, catering, reception, tour",
    "detail": "Badges, certificates (digital first), programme booklets, banners, lunch per day, coffee breaks.",
    "owner": "Hasan / Pen"
  },
  {
    "id": "T097",
    "kind": "task",
    "date": "2027-08-16",
    "title": "Draft the programme structure",
    "detail": "Sessions × halls × Zoom rooms; one session = 5 papers × 15 min (12 + 3).",
    "owner": "Saadan"
  },
  {
    "id": "P50",
    "kind": "post",
    "date": "2027-08-17",
    "time": "10:00",
    "title": "Track spotlights: Language, Culture and Identity · Social Sciences and Society",
    "detail": "LinkedIn, Instagram · Carousel (5 slides)",
    "owner": "Saadan"
  },
  {
    "id": "T098",
    "kind": "task",
    "date": "2027-08-20",
    "title": "Regular deadline reminder 2 (E26)",
    "detail": "Last 10 days.",
    "owner": "Saadan"
  },
  {
    "id": "E26-2",
    "kind": "email",
    "date": "2027-08-20",
    "title": "Send E26: Regular deadline reminder (2/2)",
    "detail": "To: Everyone who has not submitted (BCC)",
    "owner": "Saadan"
  },
  {
    "id": "P51",
    "kind": "post",
    "date": "2027-08-24",
    "time": "10:00",
    "title": "One week left (regular)",
    "detail": "LinkedIn, Instagram, Facebook, X · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T099",
    "kind": "task",
    "date": "2027-08-27",
    "title": "Last-72-hours push",
    "detail": "P52 on the day, ambassadors, partner newsletters.",
    "owner": "Saadan"
  },
  {
    "id": "T100",
    "kind": "task",
    "date": "2027-08-31",
    "title": "REGULAR ABSTRACT DEADLINE (23:59 Istanbul)",
    "detail": "From 1 September: online only and late fee.",
    "owner": "Team"
  },
  {
    "id": "P52",
    "kind": "post",
    "date": "2027-08-31",
    "time": "10:00",
    "title": "Last day: regular deadline",
    "detail": "LinkedIn, Instagram, Facebook, X, WhatsApp groups · Single image + story",
    "owner": "Saadan"
  },
  {
    "id": "T101",
    "kind": "task",
    "date": "2027-09-01",
    "title": "Clear the review queue",
    "detail": "All regular abstracts decided by 10 September.",
    "owner": "Committee"
  },
  {
    "id": "T102",
    "kind": "task",
    "date": "2027-09-06",
    "title": "Payment reminder 1 (E27)",
    "detail": "All accepted, unpaid authors: deadline 30 September.",
    "owner": "Saadan"
  },
  {
    "id": "E25-2",
    "kind": "email",
    "date": "2027-09-06",
    "title": "Send E25: Volunteer call (IAU students) (2/2)",
    "detail": "To: IAU students via faculties and clubs",
    "owner": "Saadan"
  },
  {
    "id": "E27-1",
    "kind": "email",
    "date": "2027-09-06",
    "title": "Send E27: Payment reminder (1/2)",
    "detail": "To: Accepted, unpaid authors",
    "owner": "Saadan"
  },
  {
    "id": "P53",
    "kind": "post",
    "date": "2027-09-07",
    "time": "10:00",
    "title": "Final call (online only)",
    "detail": "LinkedIn, Instagram · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T103",
    "kind": "task",
    "date": "2027-09-10",
    "title": "Session chairs confirmed; assign sessions",
    "detail": "Chairs get their session list on 8 October.",
    "owner": "Saadan"
  },
  {
    "id": "T104",
    "kind": "task",
    "date": "2027-09-15",
    "title": "FINAL DEADLINE (online only)",
    "detail": "Decisions within 5 days.",
    "owner": "Team"
  },
  {
    "id": "T105",
    "kind": "task",
    "date": "2027-09-20",
    "title": "Payment reminder 2 (E27) + personal emails",
    "detail": "Phone or WhatsApp for large groups and special sessions.",
    "owner": "Saadan"
  },
  {
    "id": "E27-2",
    "kind": "email",
    "date": "2027-09-20",
    "title": "Send E27: Payment reminder (2/2)",
    "detail": "To: Accepted, unpaid authors",
    "owner": "Saadan"
  },
  {
    "id": "P54",
    "kind": "post",
    "date": "2027-09-21",
    "time": "10:00",
    "title": "Payment deadline 30 September",
    "detail": "LinkedIn, Instagram · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T106",
    "kind": "task",
    "date": "2027-09-24",
    "title": "Name and certificate check email (E28)",
    "detail": "Everyone paid: confirm name, title, affiliation, mode. Corrections close 5 October.",
    "owner": "Saadan"
  },
  {
    "id": "E28",
    "kind": "email",
    "date": "2027-09-24",
    "title": "Send E28: Name and certificate check",
    "detail": "To: All paid participants",
    "owner": "Saadan"
  },
  {
    "id": "T107",
    "kind": "task",
    "date": "2027-09-28",
    "title": "Approve the budget and final orders",
    "detail": "Catering numbers +10%, printing, reception, tour bus.",
    "owner": "Osman"
  },
  {
    "id": "P55",
    "kind": "post",
    "date": "2027-09-28",
    "time": "19:00",
    "title": "Three weeks to go",
    "detail": "Instagram, LinkedIn · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T108",
    "kind": "task",
    "date": "2027-09-30",
    "title": "PAYMENT DEADLINE",
    "detail": "Unpaid papers are removed from the programme draft. Exceptions only with Osman's written approval.",
    "owner": "Team"
  },
  {
    "id": "T109",
    "kind": "task",
    "date": "2027-10-01",
    "title": "Build the programme from paid papers only",
    "detail": "Programme sheet → PDF; onsite day separate from online days; time zones shown.",
    "owner": "Saadan"
  },
  {
    "id": "T110",
    "kind": "task",
    "date": "2027-10-04",
    "title": "Approve the programme",
    "detail": "By 17:00.",
    "owner": "Osman"
  },
  {
    "id": "T111",
    "kind": "task",
    "date": "2027-10-05",
    "title": "Corrections close; freeze the registry",
    "detail": "Badges, certificates, lunch and security lists generated from the frozen registry.",
    "owner": "Saadan"
  },
  {
    "id": "T112",
    "kind": "task",
    "date": "2027-10-06",
    "title": "Send Zoom rooms and technical guide to online presenters",
    "detail": "Part of E29; tech check slots on 18–19 October.",
    "owner": "Saadan"
  },
  {
    "id": "T113",
    "kind": "task",
    "date": "2027-10-08",
    "title": "Publish the programme (E29, P56)",
    "detail": "Website, email to all participants, LinkedIn.",
    "owner": "Saadan"
  },
  {
    "id": "E29",
    "kind": "email",
    "date": "2027-10-08",
    "title": "Send E29: Programme and technical guide",
    "detail": "To: All paid participants (BCC); online presenters get the Zoom part",
    "owner": "Saadan"
  },
  {
    "id": "P56",
    "kind": "post",
    "date": "2027-10-08",
    "time": "10:00",
    "title": "The programme is out",
    "detail": "LinkedIn, Instagram, Facebook, X · Single image (4:5) + PDF link",
    "owner": "Saadan"
  },
  {
    "id": "T114",
    "kind": "task",
    "date": "2027-10-11",
    "title": "Print badges, signage, programme booklets",
    "detail": "Badge generator from the registry; certificates digital.",
    "owner": "Saadan"
  },
  {
    "id": "T115",
    "kind": "task",
    "date": "2027-10-13",
    "title": "Volunteer and Zoom host training",
    "detail": "90 minutes; Volunteer Briefing + Zoom Host Guide.",
    "owner": "Saadan"
  },
  {
    "id": "T116",
    "kind": "task",
    "date": "2027-10-15",
    "title": "Collect slides and backup recordings",
    "detail": "Shared Drive folder per session; chase missing ones.",
    "owner": "Saadan"
  },
  {
    "id": "P57",
    "kind": "post",
    "date": "2027-10-15",
    "time": "10:00",
    "title": "Online presenters: checklist",
    "detail": "LinkedIn, Instagram Story · Story + post",
    "owner": "Saadan"
  },
  {
    "id": "T117",
    "kind": "task",
    "date": "2027-10-18",
    "title": "Online tech checks (18–19 October)",
    "detail": "10-minute slots for online presenters; test sound and screen share.",
    "owner": "Saadan"
  },
  {
    "id": "T118",
    "kind": "task",
    "date": "2027-10-19",
    "title": "Security entry list, lunch numbers, final catering order",
    "detail": "Names only, no ID numbers.",
    "owner": "Saadan"
  },
  {
    "id": "T119",
    "kind": "task",
    "date": "2027-10-20",
    "title": "Day-before email (E30) + venue set-up",
    "detail": "Signage, halls, laptops, Zoom rooms, registration desk.",
    "owner": "Saadan"
  },
  {
    "id": "E30",
    "kind": "email",
    "date": "2027-10-20",
    "title": "Send E30: The day before",
    "detail": "To: All participants (onsite and online versions)",
    "owner": "Saadan"
  },
  {
    "id": "T120",
    "kind": "task",
    "date": "2027-10-21",
    "title": "Final walk-through and briefing",
    "detail": "Run of show; who is where; emergency contacts.",
    "owner": "Team"
  },
  {
    "id": "P58",
    "kind": "post",
    "date": "2027-10-21",
    "time": "19:00",
    "title": "Tomorrow: welcome to Istanbul",
    "detail": "LinkedIn, Instagram, Facebook, X · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T121",
    "kind": "task",
    "date": "2027-10-22",
    "title": "CONFERENCE DAY 1 (onsite)",
    "detail": "Opening, keynotes, onsite sessions, welcome reception.",
    "owner": "Team"
  },
  {
    "id": "P59",
    "kind": "post",
    "date": "2027-10-22",
    "time": "19:00",
    "title": "Day 1 highlights",
    "detail": "Instagram, Facebook, LinkedIn + Stories all day · Carousel (photos)",
    "owner": "Saadan"
  },
  {
    "id": "T122",
    "kind": "task",
    "date": "2027-10-23",
    "title": "CONFERENCE DAY 2 (hybrid)",
    "detail": "Onsite halls + Zoom rooms; best paper jury.",
    "owner": "Team"
  },
  {
    "id": "P60",
    "kind": "post",
    "date": "2027-10-23",
    "time": "19:00",
    "title": "Day 2 highlights",
    "detail": "Instagram, Facebook, LinkedIn + Stories all day · Carousel (photos + screenshots)",
    "owner": "Saadan"
  },
  {
    "id": "T123",
    "kind": "task",
    "date": "2027-10-24",
    "title": "CONFERENCE DAY 3 (online) + Istanbul tour",
    "detail": "Online sessions, doctoral forum, closing and awards.",
    "owner": "Team"
  },
  {
    "id": "P61",
    "kind": "post",
    "date": "2027-10-24",
    "time": "19:00",
    "title": "Closing and awards",
    "detail": "LinkedIn, Instagram, Facebook, X · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T124",
    "kind": "task",
    "date": "2027-10-26",
    "title": "Send certificates (E31)",
    "detail": "Generated from the frozen registry; corrections handled until 5 November.",
    "owner": "Saadan"
  },
  {
    "id": "E31",
    "kind": "email",
    "date": "2027-10-26",
    "title": "Send E31: Certificates",
    "detail": "To: All presenters, co-authors, chairs, volunteers (individual emails)",
    "owner": "Saadan"
  },
  {
    "id": "T125",
    "kind": "task",
    "date": "2027-10-28",
    "title": "Thank-you + survey (E32) and press release (E33)",
    "detail": "Survey reminder 4 November.",
    "owner": "Saadan"
  },
  {
    "id": "E32-1",
    "kind": "email",
    "date": "2027-10-28",
    "title": "Send E32: Thank you + feedback survey (1/2)",
    "detail": "To: All participants (BCC)",
    "owner": "Saadan"
  },
  {
    "id": "E33",
    "kind": "email",
    "date": "2027-10-28",
    "title": "Send E33: Press release",
    "detail": "To: IAU Corporate Comms, education media, partner newsletters",
    "owner": "Saadan"
  },
  {
    "id": "P62",
    "kind": "post",
    "date": "2027-10-29",
    "time": "10:00",
    "title": "Certificates sent",
    "detail": "LinkedIn, Instagram · Single image (4:5)",
    "owner": "Saadan"
  },
  {
    "id": "T126",
    "kind": "task",
    "date": "2027-11-03",
    "title": "Produce Video 3 (Recap)",
    "detail": "From conference footage; consent checked.",
    "owner": "Saadan"
  },
  {
    "id": "E32-2",
    "kind": "email",
    "date": "2027-11-04",
    "title": "Send E32: Thank you + feedback survey (2/2)",
    "detail": "To: All participants (BCC)",
    "owner": "Saadan"
  },
  {
    "id": "P63",
    "kind": "post",
    "date": "2027-11-05",
    "time": "19:00",
    "title": "VIDEO 3: Recap",
    "detail": "Instagram Reel, LinkedIn native video, YouTube · Video (60–90 s)",
    "owner": "Saadan"
  },
  {
    "id": "T127",
    "kind": "task",
    "date": "2027-11-08",
    "title": "Compile the abstract book",
    "detail": "Locked final versions of presented papers only.",
    "owner": "Hasan / Pen"
  },
  {
    "id": "T128",
    "kind": "task",
    "date": "2027-11-12",
    "title": "Full-paper call for proceedings and journals (E34)",
    "detail": "Deadline 15 December; guidelines per journal.",
    "owner": "Saadan"
  },
  {
    "id": "E34",
    "kind": "email",
    "date": "2027-11-12",
    "title": "Send E34: Full-paper call (proceedings and journals)",
    "detail": "To: All presenters (BCC)",
    "owner": "Saadan"
  },
  {
    "id": "P64",
    "kind": "post",
    "date": "2027-11-12",
    "time": "10:00",
    "title": "IECES 2027 in numbers",
    "detail": "LinkedIn, Instagram · Carousel (6 slides)",
    "owner": "Saadan"
  },
  {
    "id": "T129",
    "kind": "task",
    "date": "2027-11-16",
    "title": "Close finances",
    "detail": "Payments vs invoices; refunds; costs; result.",
    "owner": "Finance"
  },
  {
    "id": "T130",
    "kind": "task",
    "date": "2027-11-19",
    "title": "Final report to Osman and partners",
    "detail": "Use the Final Report Outline.",
    "owner": "Saadan"
  },
  {
    "id": "T131",
    "kind": "task",
    "date": "2027-11-24",
    "title": "Debrief and IECES 2028 dates",
    "detail": "Keep / stop / start; propose 2028 dates and theme; save-the-date (P65).",
    "owner": "Team"
  },
  {
    "id": "T132",
    "kind": "task",
    "date": "2027-11-30",
    "title": "Publish the abstract book",
    "detail": "Website + email to participants.",
    "owner": "Saadan"
  },
  {
    "id": "P65",
    "kind": "post",
    "date": "2027-11-30",
    "time": "10:00",
    "title": "Abstract book + save the date 2028",
    "detail": "LinkedIn, Instagram, Facebook, X · Single image (4:5)",
    "owner": "Saadan"
  }
],
};
