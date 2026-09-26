/**
 * The student's account and profile.
 *
 * WHAT THIS IS TODAY. The whole sign-up and sign-in experience, the profile,
 * and everything that reads from it, running against the device. There is
 * one function at the bottom of this file where a real backend attaches.
 *
 * WHAT IT IS NOT. A real account. Nothing is sent anywhere, no password is
 * checked, and a second device knows nothing about the first. Making it real
 * needs four things that are not code: the company's own domain, the
 * registered entity behind it, a privacy policy, and a database built for
 * holding minors' exam results. Until those exist, collecting a sixteen year
 * old's name, email and grades on somebody's personal domain would be the
 * one mistake on this project that cannot be undone later.
 *
 * So the gate is real, the profile is real, the advice is real, and the
 * storage is local and says so.
 */

import { serverSnapshot, snapshot, subscribe, write } from "@/lib/edviko/browserStore";
import { formatId, fromLegacy, provisionalSerial, STUDENT } from "@/lib/edviko/id";
import { EMPTY_ASSESSMENT, type Assessment } from "@/lib/edviko/careerFit";

export const ACCOUNT = "ev-account";

export type Profile = {
  /**
   * The student's own number, for life.
   *
   * It does not change when they change school, advisor or country, which
   * is the whole point of having one: the record follows the student rather
   * than the institution. Issued once, at sign-up, and never rewritten.
   */
  id: string;
  /**
   * Where the student's campus is, as a two-letter country. It is the first
   * segment of their Edviko code, so it is recorded on the profile rather
   * than assumed at the point the code is printed.
   */
  country: string;
  name: string;
  email: string;
  /** Where they are in school, so advice can be timed. */
  year: "year-11" | "year-12" | "year-13" | "finished" | "";
  /** Their converted result, copied from the calculator. */
  percentage: number | null;
  system: string | null;
  satTotal: number | null;
  englishTest: "ielts" | "toefl" | "duolingo" | "none" | "";
  englishScore: string;
  activities: string[];
  /** What they can put toward a year, in US dollars. Null means not said. */
  budgetUsd: number | null;
  /** The career assessment, kept with the profile so one save covers both. */
  assessment: Assessment;
  createdAt: string;
};

export const EMPTY: Profile = {
  id: "",
  country: "PK",
  name: "",
  email: "",
  year: "",
  percentage: null,
  system: null,
  satTotal: null,
  englishTest: "",
  englishScore: "",
  activities: [],
  budgetUsd: null,
  assessment: EMPTY_ASSESSMENT,
  createdAt: "",
};

export function readProfile(raw: string | null): Profile | null {
  if (!raw) return null;
  try {
    const saved = JSON.parse(raw) as Partial<Profile>;
    // Merged field by field: a profile saved before the assessment existed
    // must not come back with an undefined where an object belongs.
    const merged = {
      ...EMPTY,
      ...saved,
      assessment: { ...EMPTY_ASSESSMENT, ...(saved.assessment ?? {}) },
    };
    // A profile issued before the code had a shape carries the old one. It
    // is read into the canonical shape here, once, so nothing downstream has
    // to know that two formats ever existed.
    const canonical = merged.id ? fromLegacy(merged.id, merged.country) : null;
    return canonical ? { ...merged, id: formatId(canonical) } : merged;
  } catch {
    return null;
  }
}

export function saveProfile(profile: Profile) {
  write(ACCOUNT, JSON.stringify(profile));
}

export function signOut() {
  write(ACCOUNT, "");
}

export const accountStore = {
  subscribe: subscribe(ACCOUNT),
  snapshot: snapshot(ACCOUNT),
  serverSnapshot,
};

/**
 * How much of the profile is filled in, and what is missing.
 *
 * The missing list is the whole point: "your profile is 60% complete" tells
 * a student nothing, and "you have not put in an English test score, and
 * four of your universities ask for one" tells them what to do this week.
 */
export type Gap = { id: string; label: string; why: string; weight: number };

export function gaps(p: Profile): Gap[] {
  const out: Gap[] = [];
  if (p.percentage === null) {
    out.push({
      id: "grades",
      label: "Convert your grades",
      why: "Without a result there is nothing to compare against what universities ask for.",
      weight: 25,
    });
  }
  if (p.satTotal === null) {
    out.push({
      id: "sat",
      label: "Add a SAT score, or plan to sit it",
      why: "Several universities set a SAT minimum and will not read an application without one.",
      weight: 12,
    });
  }
  if (!p.englishTest || p.englishTest === "none") {
    out.push({
      id: "english",
      label: "Add an English test result",
      why: "Almost every university outside your own country asks for proof of English. Booking one takes about six weeks.",
      weight: 15,
    });
  }
  if (p.activities.length < 3) {
    out.push({
      id: "activities",
      label: "List what you do outside class",
      why: "Three things you stuck at beat eleven you turned up to once, and some countries read this closely.",
      weight: 6,
    });
  }
  if (!p.assessment.takenAt) {
    out.push({
      id: "assessment",
      label: "Take the career assessment",
      why: "Fifteen minutes, and it decides everything after it. Choosing a university before a career is how people end up with a degree they do not use.",
      weight: 25,
    });
  }
  if (p.budgetUsd === null) {
    out.push({
      id: "budget",
      label: "Say what a year can cost",
      why: "Without a number, a shortlist is just a wish. With one, half the world's universities rule themselves out and the rest get easier to choose between.",
      weight: 12,
    });
  }
  if (!p.year) {
    out.push({
      id: "year",
      label: "Tell us what year you are in",
      why: "It decides which deadlines are yours and which have already gone.",
      weight: 5,
    });
  }
  return out;
}

/**
 * The weights add up to exactly 100, so a finished profile is 100 and an
 * empty one is 0. Any other total and the number is decoration.
 */
export function completeness(p: Profile): number {
  const lost = gaps(p).reduce((n, g) => n + g.weight, 0);
  return Math.max(0, 100 - lost);
}

/**
 * The integration point. Today it writes to the device; tomorrow it posts
 * to whatever the company runs. Everything else in the app calls this and
 * does not care.
 */
export async function createAccount(profile: Profile): Promise<Profile> {
  const next = {
    ...profile,
    id: profile.id || newStudentId(profile.country),
    createdAt: new Date().toISOString(),
  };
  saveProfile(next);
  return next;
}

/**
 * A student number that reads like one.
 *
 * The real shape, with the school, campus and advisor left at zero because
 * a student who signed themselves up has not been placed at one yet. The
 * serial is issued on the device and is provisional until a server issues
 * the real one; the shape does not change when it does, so no screen that
 * prints it has to be rewritten.
 */
function newStudentId(country: string): string {
  return formatId({
    country: (country || "PK").toUpperCase(),
    school: "000",
    campus: "00",
    advisor: "00",
    serial: provisionalSerial(),
    relationship: STUDENT,
  });
}
