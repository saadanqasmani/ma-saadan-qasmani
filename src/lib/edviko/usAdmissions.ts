/**
 * The American application grid: deadlines, fees, tests, recommendations.
 *
 * Every year the Common App publishes one file that decides most of what a
 * student applying to the United States has to do and by when: which
 * deadlines each institution offers, what it charges, whether it takes a fee
 * waiver, whether it wants the personal essay, what its testing policy is,
 * and how many letters it expects. Nine hundred-odd rows of it.
 *
 * Two rules govern this module.
 *
 * The first is that none of it is typed in from memory or read off a
 * screenshot. It is imported from the published file, and every row carries
 * where it came from and the date it was read. A deadline invented here
 * would not look invented — it would look exactly like a researched one, and
 * a student would miss an application because of it.
 *
 * The second is that this is a reference, not a pipe. There is no public API
 * for submitting a Common App application from another system, and their
 * terms do not permit one to operate on a student's login. So what this can
 * honestly do is know every requirement and every date, prepare the student
 * against them, and hand them a finished file to submit themselves.
 */

export type DeadlineKind = "ED" | "ED2" | "EA" | "EA2" | "REA" | "RD" | "rolling";

export const DEADLINE_LABEL: Record<DeadlineKind, string> = {
  ED: "Early Decision",
  ED2: "Early Decision II",
  EA: "Early Action",
  EA2: "Early Action II",
  REA: "Restrictive Early Action",
  RD: "Regular Decision",
  rolling: "Rolling",
};

/** Binding commitments are a different kind of promise and are marked as one. */
export const BINDING: DeadlineKind[] = ["ED", "ED2"];

export type TestPolicy = "required" | "optional" | "free-choice" | "blind" | "see-website";

export const TEST_POLICY_LABEL: Record<TestPolicy, string> = {
  required: "Tests required",
  optional: "Test optional",
  "free-choice": "Test free choice",
  blind: "Tests not considered",
  "see-website": "See the university",
};

export type FeeWaiver = "accepted" | "not-accepted" | "us-only" | "unknown";

export type Source = {
  name: string;
  url: string;
  /** ISO date the file was read. */
  asOf: string;
  /** True only once checked against the publisher rather than a copy. */
  verified: boolean;
};

export type UsProgramme = {
  /** Institution name as the published file spells it. */
  name: string;
  schoolType: "coed" | "women" | "men" | "unknown";
  /** ISO dates, or "rolling". Absent keys are deadlines the school does not offer. */
  deadlines: Partial<Record<DeadlineKind, string>>;
  feeUsd: number | null;
  feeInternationalUsd: number | null;
  feeWaiver: FeeWaiver;
  personalEssay: boolean;
  coursesAndGrades: boolean;
  portfolio: boolean;
  writingSupplement: boolean;
  testPolicy: TestPolicy;
  /** Whatever the file says about English proficiency, verbatim. */
  english: string | null;
  teacherRecommendations: number | null;
  counselorRecommendation: boolean;
  midYearReport: boolean;
  source: Source;
};

/* ------------------------------------------------------------------ *
 * Importing
 *
 * The published file is a wide grid with merged headers, so the importer
 * takes a header row and maps by column name rather than by position:
 * position changes between years, names mostly do not, and a silent
 * off-by-one column would move every deadline in the country by a category.
 * ------------------------------------------------------------------ */

export type ImportProblem = { row: number; field: string; value: string; why: string };

export type ImportResult = {
  rows: UsProgramme[];
  problems: ImportProblem[];
  /** Columns in the file that this importer did not recognise. */
  ignored: string[];
};

/** Column names this importer understands, lower-cased and stripped. */
const COLUMNS: Record<string, keyof UsProgramme | DeadlineKind | "ignore"> = {
  "common app member": "name",
  "member": "name",
  "institution": "name",
  "school type": "schoolType",
  "ed": "ED",
  "edi": "ED",
  "ed i": "ED",
  "edii": "ED2",
  "ed ii": "ED2",
  "ed2": "ED2",
  "ea": "EA",
  "eai": "EA",
  "eaii": "EA2",
  "ea ii": "EA2",
  "ea2": "EA2",
  "rea": "REA",
  "rd": "RD",
  "rd/rolling": "RD",
  "regular decision": "RD",
  "rolling": "rolling",
  "us": "feeUsd",
  "application fee us": "feeUsd",
  "intl": "feeInternationalUsd",
  "application fee intl": "feeInternationalUsd",
  "common app fee waiver": "feeWaiver",
  "fee waiver": "feeWaiver",
  "personal essay": "personalEssay",
  "courses & grades": "coursesAndGrades",
  "courses and grades": "coursesAndGrades",
  "portfolio": "portfolio",
  "writing": "writingSupplement",
  "writing supplement": "writingSupplement",
  "test policy": "testPolicy",
  "sat/act tests used": "ignore",
  "english proficiency": "english",
  "ts": "teacherRecommendations",
  "teacher": "teacherRecommendations",
  "cr": "counselorRecommendation",
  "counselor": "counselorRecommendation",
  "mr": "midYearReport",
  "midyear": "midYearReport",
};

function clean(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function key(header: string): string {
  return clean(header).toLowerCase().replace(/[.*†‡]/g, "").trim();
}

/** Splits one CSV line, honouring quotes. */
export function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const c = line[i];
    if (quoted) {
      if (c === '"' && line[i + 1] === '"') { field += '"'; i += 1; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { out.push(field); field = ""; }
    else field += c;
  }
  out.push(field);
  return out.map(clean);
}

/**
 * A date in the published file, which uses American order.
 *
 * 11/1/2026 is the first of November, not the eleventh of January, and
 * getting that backwards moves a deadline by ten months. Anything that is
 * not a date or the word rolling is refused rather than guessed at.
 */
export function parseDeadline(value: string): string | null {
  const raw = clean(value);
  if (!raw || raw === "-" || raw === "—") return null;
  if (/^rolling$/i.test(raw)) return "rolling";

  const slash = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/.exec(raw);
  if (slash) {
    const [, m, d, y] = slash;
    const year = y.length === 2 ? `20${y}` : y;
    const month = Number(m);
    const day = Number(d);
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  return iso ? raw : null;
}

function parseMoney(value: string): number | null {
  const raw = clean(value).replace(/[$,]/g, "");
  if (!raw || /^n\/?a$/i.test(raw)) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function parseYesNo(value: string): boolean {
  return /^(y|yes|required|accepted|true|x|✓)$/i.test(clean(value));
}

function parseWaiver(value: string): FeeWaiver {
  const raw = clean(value).toLowerCase();
  if (!raw) return "unknown";
  if (raw.includes("not accepted")) return "not-accepted";
  if (raw.includes("u.s. only") || raw.includes("us only")) return "us-only";
  if (raw.includes("accepted")) return "accepted";
  return "unknown";
}

function parseTestPolicy(value: string): TestPolicy {
  const raw = clean(value).toLowerCase();
  if (raw.startsWith("r")) return "required";
  if (raw.startsWith("o")) return "optional";
  if (raw.startsWith("f")) return "free-choice";
  if (raw.startsWith("n") || raw.includes("blind")) return "blind";
  return "see-website";
}

function parseCount(value: string): number | null {
  const raw = clean(value);
  if (!raw) return null;
  if (/^y|✓|x$/i.test(raw)) return 1;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

/**
 * Turn the published grid into rows, and say what it could not read.
 *
 * Nothing is inferred. A cell the importer cannot parse becomes a problem
 * with the row number, the column and the value in it, so that whoever is
 * loading the file fixes the file rather than trusting a silent default.
 */
export function importCommonAppCsv(text: string, source: Source): ImportResult {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    return { rows: [], problems: [{ row: 0, field: "file", value: "", why: "Needs a header row and at least one institution." }], ignored: [] };
  }

  const headers = splitCsvLine(lines[0]).map(key);
  const ignored = headers.filter((h) => h && !(h in COLUMNS));
  const problems: ImportProblem[] = [];
  const rows: UsProgramme[] = [];

  for (let i = 1; i < lines.length; i += 1) {
    const cells = splitCsvLine(lines[i]);
    const row: UsProgramme = {
      name: "",
      schoolType: "unknown",
      deadlines: {},
      feeUsd: null,
      feeInternationalUsd: null,
      feeWaiver: "unknown",
      personalEssay: false,
      coursesAndGrades: false,
      portfolio: false,
      writingSupplement: false,
      testPolicy: "see-website",
      english: null,
      teacherRecommendations: null,
      counselorRecommendation: false,
      midYearReport: false,
      source,
    };

    headers.forEach((header, col) => {
      const target = COLUMNS[header];
      if (!target || target === "ignore") return;
      const value = cells[col] ?? "";

      switch (target) {
        case "name": row.name = value; break;
        case "schoolType":
          row.schoolType = /women/i.test(value) ? "women" : /men/i.test(value) ? "men" : /co-?ed/i.test(value) ? "coed" : "unknown";
          break;
        case "feeUsd": row.feeUsd = parseMoney(value); break;
        case "feeInternationalUsd": row.feeInternationalUsd = parseMoney(value); break;
        case "feeWaiver": row.feeWaiver = parseWaiver(value); break;
        case "personalEssay": row.personalEssay = parseYesNo(value); break;
        case "coursesAndGrades": row.coursesAndGrades = parseYesNo(value); break;
        case "portfolio": row.portfolio = parseYesNo(value); break;
        case "writingSupplement": row.writingSupplement = parseYesNo(value); break;
        case "testPolicy": row.testPolicy = parseTestPolicy(value); break;
        case "english": row.english = value || null; break;
        case "teacherRecommendations": row.teacherRecommendations = parseCount(value); break;
        case "counselorRecommendation": row.counselorRecommendation = parseYesNo(value); break;
        case "midYearReport": row.midYearReport = parseYesNo(value); break;
        default: {
          const when = parseDeadline(value);
          if (value && !when) {
            problems.push({ row: i, field: header, value, why: "Not a date this importer recognises." });
          } else if (when) {
            row.deadlines[target as DeadlineKind] = when;
          }
        }
      }
    });

    if (!row.name) {
      problems.push({ row: i, field: "name", value: cells[0] ?? "", why: "No institution on this row." });
      continue;
    }
    rows.push(row);
  }

  return { rows, problems, ignored };
}

/* ------------------------------------------------------------------ *
 * Reading it back
 * ------------------------------------------------------------------ */

/** Days from a date to a deadline. Negative means it has passed. */
export function daysUntil(deadline: string, from: Date): number | null {
  if (deadline === "rolling") return null;
  const then = new Date(`${deadline}T00:00:00Z`);
  const now = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
  return Math.round((then.getTime() - now.getTime()) / 86400000);
}

export type Upcoming = {
  programme: UsProgramme;
  kind: DeadlineKind;
  date: string;
  inDays: number;
  binding: boolean;
};

/** Every deadline still ahead, soonest first. */
export function upcoming(rows: UsProgramme[], from: Date, withinDays = 120): Upcoming[] {
  const out: Upcoming[] = [];
  for (const programme of rows) {
    for (const [kind, date] of Object.entries(programme.deadlines) as [DeadlineKind, string][]) {
      const inDays = daysUntil(date, from);
      if (inDays === null || inDays < 0 || inDays > withinDays) continue;
      out.push({ programme, kind, date, inDays, binding: BINDING.includes(kind) });
    }
  }
  return out.sort((a, b) => a.inDays - b.inDays);
}

/** What a student has to have ready for one institution, in plain words. */
export function requirementsOf(p: UsProgramme): string[] {
  const out: string[] = [];
  if (p.personalEssay) out.push("The personal essay, 250 to 650 words, which goes to every institution you apply to.");
  if (p.writingSupplement) out.push("A writing supplement of its own, written for this university and nobody else.");
  if (p.coursesAndGrades) out.push("Courses and grades entered by hand, subject by subject.");
  if (p.portfolio) out.push("A portfolio.");
  if (p.teacherRecommendations) out.push(`${p.teacherRecommendations} teacher recommendation${p.teacherRecommendations === 1 ? "" : "s"}. Ask early; a rushed letter reads like one.`);
  if (p.counselorRecommendation) out.push("A counsellor recommendation.");
  if (p.midYearReport) out.push("A mid-year report, sent after the application.");
  if (p.testPolicy === "required") out.push("SAT or ACT scores. This one does not read applications without them.");
  if (p.english) out.push(`English proficiency: ${p.english}`);
  const fee = p.feeInternationalUsd ?? p.feeUsd;
  if (fee) {
    out.push(
      p.feeWaiver === "accepted"
        ? `An application fee of $${fee}, which a fee waiver covers.`
        : p.feeWaiver === "us-only"
          ? `An application fee of $${fee}. The waiver is for US students only.`
          : `An application fee of $${fee}.`
    );
  }
  return out;
}
