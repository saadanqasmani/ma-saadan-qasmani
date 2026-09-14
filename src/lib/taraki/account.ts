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

import { serverSnapshot, snapshot, subscribe, write } from "@/lib/taraki/browserStore";

export const ACCOUNT = "tk-account";

export type Profile = {
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
  createdAt: string;
};

export const EMPTY: Profile = {
  name: "",
  email: "",
  year: "",
  percentage: null,
  system: null,
  satTotal: null,
  englishTest: "",
  englishScore: "",
  activities: [],
  createdAt: "",
};

export function readProfile(raw: string | null): Profile | null {
  if (!raw) return null;
  try {
    return { ...EMPTY, ...(JSON.parse(raw) as Partial<Profile>) };
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
      weight: 40,
    });
  }
  if (p.satTotal === null) {
    out.push({
      id: "sat",
      label: "Add a SAT score, or plan to sit it",
      why: "Several universities set a SAT minimum and will not read an application without one.",
      weight: 25,
    });
  }
  if (!p.englishTest || p.englishTest === "none") {
    out.push({
      id: "english",
      label: "Add an English test result",
      why: "Almost every university outside your own country asks for proof of English. Booking one takes about six weeks.",
      weight: 20,
    });
  }
  if (p.activities.length < 3) {
    out.push({
      id: "activities",
      label: "List what you do outside class",
      why: "Three things you stuck at beat eleven you turned up to once, and some countries read this closely.",
      weight: 10,
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
  const next = { ...profile, createdAt: new Date().toISOString() };
  saveProfile(next);
  return next;
}
