/**
 * Twelve questions with right answers.
 *
 * WHAT THIS IS, AND WHAT IT IS NOT. The rest of the assessment asks students
 * to rate themselves, and a student's own rating is worth having: it is what
 * they believe, and belief is what makes them apply or not apply. But it is
 * not evidence. Sixteen year olds routinely rate themselves low on the thing
 * they are best at and high on the thing they enjoy, and a system built only
 * on self-rating hands that confusion straight back to them dressed as
 * advice.
 *
 * So there are twelve questions here with answers that are simply correct,
 * two for each of six reasoning strengths. Two questions cannot measure an
 * aptitude, and nothing in this product will ever say they can. What they
 * can do is disagree with the self-rating, and that disagreement is the
 * useful part: a student who rated numbers 2 out of 5 and got both numerical
 * questions right is a student whose plan may be built on a wrong belief
 * about themselves, and that is worth twenty minutes of an advisor's time.
 *
 * Every question is explained after it is answered, right or wrong, because
 * a test that only scores is a test nobody learns anything from. The
 * explanation is the point; the score is the excuse for reading it.
 */

import type { Aptitude } from "@/content/edviko/careers";

export type Item = {
  id: string;
  of: Aptitude;
  ask: string;
  options: string[];
  /** Index into options. */
  answer: number;
  /** Shown after answering, whether right or wrong. */
  why: string;
};

export const ITEMS: Item[] = [
  {
    id: "n1",
    of: "numerical",
    ask: "A room costs 18,000 a month. In the second year the rent rises by a third. What is the second year's monthly rent?",
    options: ["21,000", "24,000", "27,000", "54,000"],
    answer: 1,
    why: "A third of 18,000 is 6,000, so the new rent is 24,000. The common slip is to read 'a third' as 'to a third'.",
  },
  {
    id: "n2",
    of: "numerical",
    ask: "A scholarship covers 40% of a 12,000 tuition fee, and you also receive a 1,200 grant. How much tuition do you still owe?",
    options: ["4,800", "6,000", "7,200", "10,800"],
    answer: 1,
    why: "40% of 12,000 is 4,800, leaving 7,200. The grant takes off another 1,200, so 6,000. Two steps, and the second is the one people forget when reading a scholarship letter.",
  },
  {
    id: "v1",
    of: "verbal",
    ask: "Thermometer is to temperature as barometer is to:",
    options: ["Weather", "Pressure", "Altitude", "Forecast"],
    answer: 1,
    why: "A thermometer measures temperature; a barometer measures pressure. 'Weather' is what pressure is used to predict, which is the near-miss the question is testing.",
  },
  {
    id: "v2",
    of: "verbal",
    ask: "Every student who submitted on time was interviewed. Ayesha was not interviewed. What must be true?",
    options: [
      "Ayesha did not submit on time",
      "Ayesha submitted late but was rejected",
      "Ayesha was not eligible",
      "Nothing can be concluded",
    ],
    answer: 0,
    why: "If submitting on time guarantees an interview, then no interview means it was not submitted on time. Why it was late is not stated, and the question does not ask you to invent a reason.",
  },
  {
    id: "l1",
    of: "logical",
    ask: "If it rains, the match is cancelled. The match was not cancelled. What follows?",
    options: ["It rained", "It did not rain", "The match was postponed", "Nothing follows"],
    answer: 1,
    why: "The rule only runs one way, and running it backwards correctly gives: no cancellation means no rain. Note that rain is not the only thing that could cancel a match, so the reverse inference would not work.",
  },
  {
    id: "l2",
    of: "logical",
    ask: "What comes next: 2, 6, 12, 20, 30, ?",
    options: ["36", "40", "42", "44"],
    answer: 2,
    why: "The gaps are 4, 6, 8, 10, so the next gap is 12 and the answer is 42. Another way to see it: each term is n times n plus one.",
  },
  {
    id: "a1",
    of: "analytical",
    ask: "Tuition is 9,000 and living costs are 7,000. A scholarship pays half the tuition and nothing else. What share of the total cost does it cover?",
    options: ["25%", "28%", "50%", "56%"],
    answer: 1,
    why: "It pays 4,500 of 16,000, which is 28%. A scholarship advertised as 'covering half your fees' routinely covers under a third of what a year actually costs, and this is exactly why the cost calculator counts every line.",
  },
  {
    id: "a2",
    of: "analytical",
    ask: "Of 200 applicants, 60% were shortlisted, and a quarter of those received offers. How many offers were made?",
    options: ["25", "30", "50", "120"],
    answer: 1,
    why: "120 shortlisted, a quarter of which is 30. Stacked percentages are where most people lose a step, and admissions statistics are almost always stacked.",
  },
  {
    id: "s1",
    of: "spatial",
    ask: "A cube is painted on all six faces, then cut into 27 equal smaller cubes. How many of the small cubes have paint on exactly two faces?",
    options: ["8", "12", "6", "24"],
    answer: 1,
    why: "The edge pieces, one per edge of the cube, and a cube has twelve edges. Corners have three painted faces, face centres have one, and the very middle has none.",
  },
  {
    id: "s2",
    of: "spatial",
    ask: "You fold a square sheet in half, then in half again, then cut off the corner where all the folds meet. How many holes are in the unfolded sheet?",
    options: ["None, it loses a corner", "One, in the middle", "Two", "Four"],
    answer: 1,
    why: "The corner where every fold meets is the centre of the sheet, so the cut opens as a single hole in the middle. The other three corners of the folded square are edges and corners of the original.",
  },
  {
    id: "b1",
    of: "abstract",
    ask: "Circle, square, circle, triangle, circle, square, circle, ?",
    options: ["Circle", "Square", "Triangle", "Hexagon"],
    answer: 2,
    why: "Every second shape is a circle; the others run square, triangle, square, so the next is a triangle. Two patterns interleaved, which is the thing being tested rather than the shapes.",
  },
  {
    id: "b2",
    of: "abstract",
    ask: "Which of these does not belong: 8, 27, 64, 100, 125?",
    options: ["8", "27", "100", "125"],
    answer: 2,
    why: "All the others are cubes: two, three, four and five cubed. 100 is a square, which is the near-miss: it is a perfect power, just not the same one.",
  },
];

export function itemsOf(dimension: Aptitude): Item[] {
  return ITEMS.filter((i) => i.of === dimension);
}

/** The dimensions this indicator actually asks about. Practical is not one. */
export const MEASURED: Aptitude[] = ["numerical", "verbal", "logical", "analytical", "spatial", "abstract"];
