/**
 * The Edviko code: one number for a student, for life.
 *
 *     PK - 001 - 02 - 03 - 000125 - 0
 *     │     │     │    │     │       └─ relationship: 0 student, 1 mother,
 *     │     │     │    │     │          2 father, 3+ guardian or authorised
 *     │     │     │    │     └───────── the student's own serial, permanent
 *     │     │     │    └─────────────── career advisor
 *     │     │     └──────────────────── campus within the school
 *     │     └────────────────────────── school or education organisation
 *     └──────────────────────────────── country the campus is in
 *
 * The one rule that matters: the serial is issued once and never rewritten.
 * A student changes school, campus, advisor and country; the record follows
 * the student, not the institution. That is the difference between a career
 * history and a customer list, and it is why the serial sits in the middle
 * of the code rather than being derived from any of the parts around it.
 *
 * Four formats were in circulation while this was being designed —
 * PK-001-02-03-000125-0, EDV-S-2026-000125, PK-ABC-ISB-001 and
 * PK-STU-00000001. This module makes the first one canonical, because it is
 * the only one that carries the hierarchy and the family relationship, and
 * reads the others as legacy input so nothing already written is stranded.
 */

export type EdvikoId = {
  /** ISO 3166-1 alpha-2, the country the campus is in. Upper case. */
  country: string;
  /** School or education organisation, 3 digits. */
  school: string;
  /** Campus or branch within that school, 2 digits. */
  campus: string;
  /** Currently assigned career advisor, 2 digits. */
  advisor: string;
  /** The student's permanent serial, 6 digits. Never changes. */
  serial: string;
  /** Who this code belongs to: the student, or someone authorised for them. */
  relationship: number;
};

export const STUDENT = 0;
export const MOTHER = 1;
export const FATHER = 2;
/** Everything from here up is a guardian or other authorised contact. */
export const FIRST_GUARDIAN = 3;

export const RELATIONSHIPS: { code: number; label: string; short: string }[] = [
  { code: STUDENT, label: "Student", short: "Student" },
  { code: MOTHER, label: "Mother", short: "Mother" },
  { code: FATHER, label: "Father", short: "Father" },
  { code: FIRST_GUARDIAN, label: "Guardian 1", short: "Guardian" },
  { code: 4, label: "Guardian 2", short: "Guardian" },
  { code: 5, label: "Guardian 3", short: "Guardian" },
  { code: 6, label: "Guardian 4", short: "Guardian" },
  { code: 7, label: "Guardian 5", short: "Guardian" },
  { code: 8, label: "Guardian 6", short: "Guardian" },
  { code: 9, label: "Guardian 7", short: "Guardian" },
];

export function relationshipLabel(code: number): string {
  return RELATIONSHIPS.find((r) => r.code === code)?.label ?? `Authorised contact ${code}`;
}

const SHAPE = /^([A-Z]{2})-(\d{3})-(\d{2})-(\d{2})-(\d{6})-(\d)$/;

/** The canonical string. Always upper case, always hyphenated, always six parts. */
export function formatId(id: EdvikoId): string {
  return [
    id.country.toUpperCase(),
    id.school.padStart(3, "0"),
    id.campus.padStart(2, "0"),
    id.advisor.padStart(2, "0"),
    id.serial.padStart(6, "0"),
    String(id.relationship),
  ].join("-");
}

export function parseId(value: string): EdvikoId | null {
  const m = SHAPE.exec(value.trim().toUpperCase());
  if (!m) return null;
  return {
    country: m[1],
    school: m[2],
    campus: m[3],
    advisor: m[4],
    serial: m[5],
    relationship: Number(m[6]),
  };
}

export function isValidId(value: string): boolean {
  return parseId(value) !== null;
}

/**
 * Why a code was refused, in words a person can act on.
 *
 * A validator that answers only true or false makes the person typing guess
 * which of six segments they got wrong, and they are usually typing it off a
 * letter or a screenshot.
 */
export function idProblem(value: string): string | null {
  const raw = value.trim().toUpperCase();
  if (!raw) return "Nothing entered.";
  const parts = raw.split("-");
  if (parts.length !== 6) {
    return `An Edviko code has six parts separated by hyphens. This has ${parts.length}.`;
  }
  const [country, school, campus, advisor, serial, relationship] = parts;
  if (!/^[A-Z]{2}$/.test(country)) return "The first part is the two-letter country, such as PK or TR.";
  if (!/^\d{3}$/.test(school)) return "The school is three digits, such as 001.";
  if (!/^\d{2}$/.test(campus)) return "The campus is two digits, such as 02.";
  if (!/^\d{2}$/.test(advisor)) return "The advisor is two digits, such as 03.";
  if (!/^\d{6}$/.test(serial)) return "The student number is six digits, such as 000125.";
  if (!/^\d$/.test(relationship)) return "The last part is one digit: 0 for the student, 1 mother, 2 father, 3 and up for guardians.";
  return null;
}

/** The same person's code with a different relationship on the end. */
export function familyMember(id: EdvikoId, relationship: number): EdvikoId {
  return { ...id, relationship };
}

/** Everyone attached to one student, the student first. */
export function family(id: EdvikoId, count: number): EdvikoId[] {
  return Array.from({ length: count + 1 }, (_, i) => familyMember(id, i));
}

/**
 * A student moving school, campus, advisor or country.
 *
 * Everything around the serial can change. The serial cannot, which is
 * enforced here rather than trusted to the caller, because this is the one
 * operation in the system where losing a digit loses a person's history.
 */
export function migrate(
  id: EdvikoId,
  to: { country?: string; school?: string; campus?: string; advisor?: string }
): EdvikoId {
  return {
    country: (to.country ?? id.country).toUpperCase(),
    school: (to.school ?? id.school).padStart(3, "0"),
    campus: (to.campus ?? id.campus).padStart(2, "0"),
    advisor: (to.advisor ?? id.advisor).padStart(2, "0"),
    serial: id.serial,
    relationship: id.relationship,
  };
}

/** Two codes belong to the same student when the serial matches. */
export function sameStudent(a: EdvikoId, b: EdvikoId): boolean {
  return a.serial === b.serial;
}

/** What a campus is called in its own right: PK-001-02. */
export function campusCode(id: EdvikoId): string {
  return `${id.country}-${id.school}-${id.campus}`;
}

/** What an advisor is called in their own right: PK-001-02-03. */
export function advisorCode(id: EdvikoId): string {
  return `${campusCode(id)}-${id.advisor}`;
}

/** Short enough to say out loud, still unique: PK-000125. */
export function shortId(id: EdvikoId): string {
  return `${id.country}-${id.serial}`;
}

export function nextSerial(previous: string): string {
  const n = Number(previous) + 1;
  if (!Number.isFinite(n) || n > 999999) throw new Error("Serial range exhausted for this country.");
  return String(n).padStart(6, "0");
}

/**
 * A serial issued on the device, before there is a server to issue one.
 *
 * Marked as provisional by the caller rather than by the number itself: the
 * shape has to be the real shape, or every screen that shows it would need
 * rewriting the day a real one arrives. It is derived from the clock, so two
 * students on two devices can collide, which is exactly why a server issues
 * the real one.
 */
export function provisionalSerial(): string {
  return String(Date.now() % 1000000).padStart(6, "0");
}

/**
 * Reads the formats that were in use before this one.
 *
 * PK-STU-00000001 (the first prototype), EDV-S-2026-000125 (the student
 * dashboard mockup) and a bare six-digit serial all become a canonical code
 * with unknown school, campus and advisor, which is honest: the old formats
 * genuinely did not record them.
 */
export function fromLegacy(value: string, fallbackCountry = "PK"): EdvikoId | null {
  const raw = value.trim().toUpperCase();
  const already = parseId(raw);
  if (already) return already;

  const blank = { school: "000", campus: "00", advisor: "00", relationship: STUDENT };

  const prototype = /^([A-Z]{2})-STU-(\d{6,8})$/.exec(raw);
  if (prototype) {
    return { country: prototype[1], ...blank, serial: prototype[2].slice(-6) };
  }

  const mockup = /^EDV-S-(\d{4})-(\d{6})$/.exec(raw);
  if (mockup) {
    return { country: fallbackCountry, ...blank, serial: mockup[2] };
  }

  const bare = /^(\d{6})$/.exec(raw);
  if (bare) {
    return { country: fallbackCountry, ...blank, serial: bare[1] };
  }

  return null;
}

/** True when the code carries no school, campus or advisor yet. */
export function isUnplaced(id: EdvikoId): boolean {
  return id.school === "000" || id.campus === "00" || id.advisor === "00";
}
