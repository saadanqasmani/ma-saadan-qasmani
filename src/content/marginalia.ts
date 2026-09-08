/**
 * The Marginalia — a collection set of seven marks hidden in the margins
 * of the site, like annotations left in a used book.
 *
 * Design rationale (from gamification research): pieces of a collection set
 * should appear during ordinary activity rather than in a separate "game",
 * and the reward should belong to the world rather than being points.
 * Every revealed line below is a real fact from Saadan's record.
 */

export type Mark = {
  id: string;
  glyph: "asterisk" | "manicule" | "leaf" | "star" | "paragraph" | "compass" | "seal";
  /** Shown before it is found — a hint, never the answer. */
  hint: string;
  /** Revealed on collect. Must stay factual. */
  title: string;
  line: string;
};

export const MARKS: Mark[] = [
  {
    id: "istanbul",
    glyph: "compass",
    hint: "Where the work is written from",
    title: "Istanbul",
    line: "The city the whole archive is written from.",
  },
  {
    id: "seasons",
    glyph: "leaf",
    hint: "Two clocks, one life",
    title: "Seasons and semesters",
    line: "The novel's central opposition: time that returns against time that expires.",
  },
  {
    id: "nationalities",
    glyph: "asterisk",
    hint: "Counted in the training room",
    title: "Seventy nationalities",
    line: "Intercultural competence training delivered across twelve countries to participants from more than seventy nationalities.",
  },
  {
    id: "unesco",
    glyph: "star",
    hint: "Four countries, one programme",
    title: "Türkiye, Pakistan, Nepal, Iraq",
    line: "UNESCO Peace and Diplomacy Programmes.",
  },
  {
    id: "trilogy",
    glyph: "paragraph",
    hint: "Three papers that belong together",
    title: "The corruption trilogy",
    line: "Marginalization (n = 580), Selling Merit, and the third paper of the set.",
  },
  {
    id: "founded",
    glyph: "manicule",
    hint: "Two things started on a campus",
    title: "Founded at Istanbul Aydın",
    line: "The campus Model United Nations programme and STARLIGHT.",
  },
  {
    id: "branch",
    glyph: "seal",
    hint: "The highest one",
    title: "The Highest Branch",
    line: "Twenty-nine chapters. One hundred and forty-four thousand words.",
  },
];

export const MARK_TOTAL = MARKS.length;
