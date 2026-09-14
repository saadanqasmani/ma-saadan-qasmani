/**
 * Pakistani school-leaving qualifications, and what they convert to.
 *
 * THE RULE, AGAIN: no number without a source, and no certainty we do not
 * have. A student may resit a paper or drop a university off what this
 * says, so where the rule is contested the screen says it is contested.
 *
 * The grade-to-marks table below is the IBCC one and is well attested. The
 * scaling that turns those marks into an equivalence certificate is not
 * settled in the sources we could reach, and the one authority that can
 * settle it is IBCC itself. So the calculator gives the marks, shows the
 * arithmetic, and says plainly that the certificate is IBCC's to issue.
 */

export type SystemId = "olevel" | "alevel" | "matric" | "inter" | "ib" | "akueb" | "ushs";

export type GradeScale = {
  grade: string;
  marks: number;
};

/**
 * IBCC's conversion for Cambridge and Edexcel grades.
 * Consistent across every source we checked; still to be confirmed against
 * IBCC's own published notification before this is shown to a student.
 */
export const ibccGradeMarks: GradeScale[] = [
  { grade: "A*", marks: 90 },
  { grade: "A", marks: 85 },
  { grade: "B", marks: 75 },
  { grade: "C", marks: 65 },
  { grade: "D", marks: 55 },
  { grade: "E", marks: 45 },
  { grade: "U", marks: 0 },
];

export const IBCC_SOURCE = {
  label: "IBCC conversion table, as published by Pakistani admissions services",
  url: "https://blog.maqsad.io/blog/ibcc-equivalence-for-o-and-a-levels",
  asOf: "2026-09-14",
  verified: false,
};

export type System = {
  id: SystemId;
  name: string;
  short: string;
  /** What this qualification is equivalent to in the Pakistani ladder. */
  equivalentTo: string;
  /** How a student enters their result. */
  input: "grades" | "marks" | "points" | "gpa";
  /** Number of subjects counted, where that is fixed. */
  subjects?: number;
  outOf?: number;
  blurb: string;
  ready: boolean;
};

export const systems: System[] = [
  {
    id: "olevel",
    name: "O Level / IGCSE",
    short: "O Level",
    equivalentTo: "Matriculation (SSC)",
    input: "grades",
    subjects: 8,
    blurb: "Eight subjects counted, including the compulsory ones. Graded A* to U.",
    ready: true,
  },
  {
    id: "alevel",
    name: "A Level",
    short: "A Level",
    equivalentTo: "Intermediate (HSSC / FSc / FA)",
    input: "grades",
    subjects: 3,
    blurb: "Your best three principal subjects. Each one counts for 200 marks.",
    ready: true,
  },
  {
    id: "matric",
    name: "Matriculation (SSC)",
    short: "Matric",
    equivalentTo: "Itself. This is the Pakistani ladder.",
    input: "marks",
    outOf: 1100,
    blurb: "Your board total. No conversion needed at home; abroad it becomes a percentage.",
    ready: true,
  },
  {
    id: "inter",
    name: "Intermediate (HSSC / FSc / FA / ICS)",
    short: "Intermediate",
    equivalentTo: "Itself.",
    input: "marks",
    outOf: 1100,
    blurb: "Your board total out of 1100. This is what most foreign universities will read.",
    ready: true,
  },
  {
    id: "ib",
    name: "IB Diploma",
    short: "IB",
    equivalentTo: "Intermediate (HSSC)",
    input: "points",
    outOf: 45,
    blurb: "Six subjects out of 7 points each, plus up to 3 core points. 45 is the maximum.",
    ready: true,
  },
  {
    id: "akueb",
    name: "Aga Khan Board (AKU-EB)",
    short: "AKU-EB",
    equivalentTo: "Matriculation or Intermediate, depending on level",
    input: "marks",
    outOf: 1100,
    blurb: "Read as a Pakistani board result, with its own grading.",
    ready: true,
  },
  {
    id: "ushs",
    name: "American High School Diploma",
    short: "US Diploma",
    equivalentTo: "Intermediate (HSSC)",
    input: "gpa",
    outOf: 4,
    blurb: "A cumulative GPA out of 4.0, usually alongside SAT or AP results.",
    ready: true,
  },
];

/** Marks for one grade, or null for an unknown symbol. */
export function marksForGrade(grade: string): number | null {
  const row = ibccGradeMarks.find((g) => g.grade === grade.toUpperCase());
  return row ? row.marks : null;
}

export type Conversion = {
  /** The headline number, and what it is out of. */
  score: number;
  outOf: number;
  percentage: number;
  /** Every step, so a student can check the arithmetic rather than trust it. */
  workings: string[];
  /** Said on the result, every time, without exception. */
  caveats: string[];
};

/**
 * O Level: eight subjects, each converted, summed out of 800.
 * A Level: best three, each scaled to 200, summed out of 600.
 */
export function convertGrades(system: "olevel" | "alevel", grades: string[]): Conversion | null {
  const counted = system === "olevel" ? 8 : 3;
  const marks = grades.map(marksForGrade);
  if (marks.length < counted || marks.some((m) => m === null)) return null;

  const best = (marks as number[]).slice().sort((a, b) => b - a).slice(0, counted);
  const sum = best.reduce((a, b) => a + b, 0);

  if (system === "olevel") {
    const outOf = counted * 100;
    return {
      score: sum,
      outOf,
      percentage: (sum / outOf) * 100,
      workings: [
        `Each grade converted on the IBCC table: A* 90, A 85, B 75, C 65, D 55, E 45.`,
        `Best ${counted} subjects added: ${best.join(" + ")} = ${sum}.`,
        `That is ${sum} out of ${outOf}.`,
      ],
      caveats: [
        "IBCC scales this to a Matric equivalence out of 1100. The scaling step is not something we will state until it is confirmed against IBCC's own notification.",
        "IBCC issues the certificate. This is your marks, not a certificate.",
      ],
    };
  }

  // Each A Level subject is read out of 200 rather than 100.
  const scaled = best.map((m) => m * 2);
  const sum200 = scaled.reduce((a, b) => a + b, 0);
  return {
    score: sum200,
    outOf: 600,
    percentage: (sum200 / 600) * 100,
    workings: [
      `Each grade converted on the IBCC table: A* 90, A 85, B 75, C 65, D 55, E 45.`,
      `Each subject counts for 200 marks, so each is doubled: ${best.join(", ")} becomes ${scaled.join(", ")}.`,
      `Best 3 added: ${scaled.join(" + ")} = ${sum200} out of 600.`,
    ],
    caveats: [
      "IBCC deducts up to 10 marks per science subject sat without a practical, and may add up to 10 for Additional Mathematics. Those adjustments are not applied here.",
      "Your full Intermediate equivalence combines this with your O Level result. IBCC issues that certificate, not us.",
    ],
  };
}

/** Marks-based systems are already a percentage; say so and stop. */
export function convertMarks(obtained: number, outOf: number): Conversion {
  return {
    score: obtained,
    outOf,
    percentage: (obtained / outOf) * 100,
    workings: [`${obtained} out of ${outOf} is ${((obtained / outOf) * 100).toFixed(1)}%.`],
    caveats: [
      "Most foreign universities read a Pakistani board result as a percentage, and a few apply their own scaling. The university's own admissions page is the authority.",
    ],
  };
}

export function convertIb(points: number): Conversion {
  return {
    score: points,
    outOf: 45,
    percentage: (points / 45) * 100,
    workings: [`${points} points out of a possible 45.`],
    caveats: [
      "IB is read as points, not as a percentage. Universities publish a required point total, often with subject-specific minimums at Higher Level.",
    ],
  };
}

export function convertGpa(gpa: number): Conversion {
  return {
    score: gpa,
    outOf: 4,
    percentage: (gpa / 4) * 100,
    workings: [`A cumulative GPA of ${gpa.toFixed(2)} out of 4.00.`],
    caveats: [
      "A GPA is not directly comparable to a Pakistani percentage, and converting between them is contested. Universities outside the US usually ask for the transcript rather than a converted number.",
    ],
  };
}

/**
 * How a result is generally read, as a band rather than a promise.
 *
 * Deliberately not a prediction and deliberately not tied to any named
 * university until we hold that university's own published requirement.
 */
export function band(percentage: number): { label: string; tone: "high" | "mid" | "low"; note: string } {
  if (percentage >= 85) {
    return {
      label: "Strong",
      tone: "high",
      note: "This sits above the published minimum at most universities that state one. It is not an offer, and selective programmes look at far more than the number.",
    };
  }
  if (percentage >= 70) {
    return {
      label: "Competitive",
      tone: "mid",
      note: "This clears the stated minimum at many universities. Where a course is competitive, the minimum is the floor, not the bar.",
    };
  }
  if (percentage >= 60) {
    return {
      label: "Some doors",
      tone: "mid",
      note: "Several countries have universities with minimums at or below this. The list matters more than the number here.",
    };
  }
  return {
    label: "Narrower",
    tone: "low",
    note: "Fewer universities will take this directly. Foundation years and pathway programmes exist for exactly this position and are a legitimate route, not a consolation.",
  };
}
