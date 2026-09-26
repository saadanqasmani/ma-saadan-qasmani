/**
 * The pile a student has to assemble, and who actually produces each piece.
 *
 * The `from` field is the one that matters. A student who thinks they can
 * print their own transcript finds out otherwise at the worst possible
 * moment, and the two items their school must produce need weeks of notice,
 * not days. Sorting the list by who provides it is the single most useful
 * thing this page does.
 */

export type Provider = "you" | "school" | "board" | "test" | "bank";

export type Doc = {
  id: string;
  name: string;
  from: Provider;
  /** Rough lead time, in days, so the plan can order itself by urgency. */
  leadDays: number;
  what: string;
  /** The mistake people actually make with this one. */
  watch: string;
  /** Not needed by everyone. */
  optional?: boolean;
};

export const providerLabel: Record<Provider, string> = {
  you: "You",
  school: "Your school",
  board: "Your exam board or IBCC",
  test: "A test centre",
  bank: "Your bank or sponsor",
};

export const documents: Doc[] = [
  {
    id: "passport",
    name: "Passport",
    from: "you",
    leadDays: 30,
    what: "A machine-readable passport valid well past the end of your first year.",
    watch: "Renewing takes weeks in Pakistan and every other document must match the spelling on it exactly. Start here, not last.",
  },
  {
    id: "transcript",
    name: "Official transcripts",
    from: "school",
    leadDays: 21,
    what: "Your results, sent by your school directly to the university or uploaded through the portal.",
    watch: "A copy you print yourself is not an official transcript. Ask your school now who does this and how much notice they need.",
  },
  {
    id: "reference",
    name: "School reference or counsellor letter",
    from: "school",
    leadDays: 28,
    what: "UCAS takes one reference from the school. Common App wants a counsellor recommendation alongside your teachers'.",
    watch: "Ask in writing, early, and give them notes to work from. A teacher with nothing specific in front of them writes a weaker letter.",
  },
  {
    id: "teacher-recs",
    name: "Teacher recommendations",
    from: "school",
    leadDays: 28,
    what: "Usually one or two, from teachers of subjects related to what you want to study.",
    watch: "Ask the teacher who knows your work, not the one with the most senior title.",
    optional: true,
  },
  {
    id: "equivalence",
    name: "IBCC equivalence certificate",
    from: "board",
    leadDays: 21,
    what: "Converts O and A Level results onto the Pakistani scale. Required by some destinations and by Pakistani universities.",
    watch: "Only IBCC can issue it. Our calculator shows you the marks; it is not the certificate.",
    optional: true,
  },
  {
    id: "english",
    name: "English test",
    from: "test",
    leadDays: 45,
    what: "IELTS, TOEFL or Duolingo, depending on what the university accepts.",
    watch: "Book the seat before you are ready. Dates fill up, and scores take a fortnight to arrive.",
  },
  {
    id: "statement",
    name: "Personal statement",
    from: "you",
    leadDays: 30,
    what: "Why this subject, why you, and what you have actually done about it.",
    watch: "First drafts are about how passionate you are. Good ones are about what you did on a Tuesday.",
  },
  {
    id: "cv",
    name: "CV or activity list",
    from: "you",
    leadDays: 7,
    what: "What you have done outside the classroom, with dates and hours.",
    watch: "Three things you stuck at beat eleven you turned up to once.",
  },
  {
    id: "funds",
    name: "Proof of funds",
    from: "bank",
    leadDays: 30,
    what: "Bank statements or a blocked account showing you can cover the year.",
    watch: "Several countries want the money to have been sitting there for months. Check the required history before you move anything.",
  },
  {
    id: "photos",
    name: "Photographs",
    from: "you",
    leadDays: 3,
    what: "Passport-standard photographs to each country's specification.",
    watch: "Background colour and head size differ by country. A Schengen photo is not a US photo.",
  },
];

/** The stages of the thing, for a progress that means something. */
export const stages = [
  { id: "decide", name: "Decide", blurb: "Grades converted, countries chosen, budget known." },
  { id: "shortlist", name: "Shortlist", blurb: "A list of universities you would actually go to." },
  { id: "gather", name: "Gather", blurb: "Every document, from whoever produces it." },
  { id: "write", name: "Write", blurb: "The statement, and anything the university asks on top." },
  { id: "submit", name: "Submit", blurb: "Filed, fees paid, confirmations saved." },
];
