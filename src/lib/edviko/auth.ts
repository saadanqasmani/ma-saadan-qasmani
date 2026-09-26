/**
 * Signing up and signing in, built the way it will have to work.
 *
 * There is no server yet, so this cannot be authentication in the sense that
 * matters: nothing is verified by anybody, an account lives in one browser,
 * and a person with the device can read the storage. Every screen that uses
 * this says so, plainly, rather than implying a protection that is not
 * there.
 *
 * What it can do is be the right shape, and it is worth being exact about
 * why that is not just tidiness. A password is never stored. It is put
 * through PBKDF2-SHA256 with a random salt and two hundred and ten thousand
 * iterations, and only the salt and the derived key are kept — which is what
 * a server will do with it, so the day there is one, the same function moves
 * and the accounts move with it. Writing the easy version now would mean
 * writing a migration later that asks every family to set their password
 * again, and teaching everybody who reads this code that plain storage is
 * acceptable in a product holding sixteen year olds' records.
 *
 * The other half of the shape is consent. A student under eighteen cannot
 * give it for themselves in most of the places this will run, so sign-up
 * asks for a guardian's address and records who consented and when. That
 * field is useless today and is exactly what will be asked for on the day
 * the company has to show it.
 */

import { formatId, idProblem, parseId, provisionalSerial, STUDENT } from "@/lib/edviko/id";

export type AccountRole = "student" | "family" | "advisor" | "campus";

export const ROLE_LABEL: Record<AccountRole, string> = {
  student: "Student",
  family: "Parent or guardian",
  advisor: "Career advisor",
  campus: "Campus supervisor",
};

export type Account = {
  /** The Edviko code this account signs in as. */
  code: string;
  role: AccountRole;
  name: string;
  email: string;
  /** Base64. Random per account, stored beside the key it salted. */
  salt: string;
  /** Base64 PBKDF2 output. Never the password, and never reversible. */
  key: string;
  iterations: number;
  createdAt: string;
  /** Students under eighteen: who consented, and when. */
  guardianEmail?: string;
  consentAt?: string;
  /** Parents and guardians: the student they are attached to. */
  student?: string;
};

export const ACCOUNTS_KEY = "ev-accounts";
export const SESSION_KEY = "ev-session";

/* ------------------------------------------------------------------ *
 * The credential itself
 * ------------------------------------------------------------------ */

export const ITERATIONS = 210_000;

function toBase64(bytes: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)));
}

function fromBase64(value: string): Uint8Array {
  return Uint8Array.from(atob(value), (c) => c.charCodeAt(0));
}

/**
 * Derive the stored key from a password.
 *
 * Slow on purpose. The cost is what makes a stolen list of these expensive
 * to attack, and two hundred thousand iterations is about a quarter of a
 * second on a phone, which nobody notices once and an attacker pays for
 * every guess.
 */
export async function deriveKey(
  password: string,
  salt: Uint8Array,
  iterations = ITERATIONS
): Promise<string> {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as unknown as BufferSource, iterations, hash: "SHA-256" },
    material,
    256
  );
  return toBase64(bits);
}

export function newSalt(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(16));
}

/** Compared without leaking, through timing, how much of a match it was. */
function sameKey(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/* ------------------------------------------------------------------ *
 * What the form will and will not accept
 * ------------------------------------------------------------------ */

/**
 * Passwords people actually use, and a system may not.
 *
 * A short list rather than a long one. The point is not to catch every weak
 * password — that is what length is for — but to refuse the handful that
 * are tried first against every leaked list in existence.
 */
const OBVIOUS = [
  "password", "password1", "12345678", "123456789", "1234567890", "qwertyuiop",
  "letmein123", "iloveyou", "admin123", "welcome123", "edviko123", "pakistan1",
];

export function passwordProblem(password: string, email = ""): string | null {
  const p = password.trim();
  if (!p) return "Choose a password.";
  if (p.length < 10) return `Ten characters at least. This has ${p.length}. Length is what makes a password hard to guess, not punctuation.`;
  if (OBVIOUS.includes(p.toLowerCase())) return "That is one of the first passwords anybody tries. Pick something nobody would guess about you.";
  if (email && p.toLowerCase().includes(email.split("@")[0]?.toLowerCase() ?? "\u0000")) {
    return "It contains your own email address, which is the first thing anybody would try.";
  }
  if (/^(.)\1+$/.test(p)) return "One character repeated is not a password.";
  return null;
}

export function emailProblem(email: string): string | null {
  const e = email.trim();
  if (!e) return "An email address, so an account can be recovered later.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) return "That does not look like an email address.";
  return null;
}

export function nameProblem(name: string): string | null {
  const n = name.trim();
  if (!n) return "Your name, as it appears on your documents.";
  if (n.length < 2) return "That is too short to be a name.";
  return null;
}

/* ------------------------------------------------------------------ *
 * The store
 * ------------------------------------------------------------------ */

export function readAccounts(raw: string | null): Account[] {
  if (!raw) return [];
  try {
    const all = JSON.parse(raw) as Account[];
    return Array.isArray(all) ? all : [];
  } catch {
    return [];
  }
}

export function readSession(raw: string | null): string | null {
  if (!raw) return null;
  try {
    const s = JSON.parse(raw) as { code?: string };
    return typeof s?.code === "string" ? s.code : null;
  } catch {
    return null;
  }
}

export function accountOf(accounts: Account[], code: string | null): Account | null {
  if (!code) return null;
  return accounts.find((a) => a.code === code) ?? null;
}

export function emailTaken(accounts: Account[], email: string): boolean {
  return accounts.some((a) => a.email.toLowerCase() === email.trim().toLowerCase());
}

/* ------------------------------------------------------------------ *
 * Joining
 * ------------------------------------------------------------------ */

export type JoinInput = {
  role: AccountRole;
  name: string;
  email: string;
  password: string;
  confirm: string;
  /** Students: their own country, for the code they are issued. */
  country?: string;
  /** Students under eighteen. */
  under18?: boolean;
  guardianEmail?: string;
  consent?: boolean;
  /** Family: the student's code. Advisor and campus: their own. */
  code?: string;
  /** Family: 1 mother, 2 father, 3 and up guardians. */
  relationship?: number;
};

export type JoinResult = { ok: true; account: Account } | { ok: false; field: string; error: string };

/**
 * Everything a role needs before an account can exist.
 *
 * Checked here rather than in the form, so the rules are in one place and
 * the same answers come back whether somebody is typing or a test is
 * calling it.
 */
export function joinProblem(input: JoinInput, accounts: Account[]): { field: string; error: string } | null {
  const name = nameProblem(input.name);
  if (name) return { field: "name", error: name };

  const email = emailProblem(input.email);
  if (email) return { field: "email", error: email };
  if (emailTaken(accounts, input.email)) {
    return { field: "email", error: "There is already an account on this device with that address." };
  }

  const password = passwordProblem(input.password, input.email);
  if (password) return { field: "password", error: password };
  if (input.password !== input.confirm) {
    return { field: "confirm", error: "The two passwords are different." };
  }

  if (input.role === "student" && input.under18) {
    const guardian = emailProblem(input.guardianEmail ?? "");
    if (guardian) return { field: "guardianEmail", error: "A parent or guardian's email address. Under eighteen, they consent, not you." };
    if (!input.consent) {
      return { field: "consent", error: "A guardian has to agree before an account can hold a student's records." };
    }
  }

  if (input.role !== "student") {
    const problem = idProblem(input.code ?? "");
    if (problem) {
      return {
        field: "code",
        error:
          input.role === "family"
            ? `The student's Edviko code, which is on their record. ${problem}`
            : `Your Edviko code, issued by the campus. ${problem}`,
      };
    }
  }

  return null;
}

/**
 * Create the account.
 *
 * A student is issued a code here, provisional until a server issues a real
 * serial. Everybody else arrives with one: a parent's code is their child's
 * with the relationship digit changed, which is precisely what that digit is
 * for, and an advisor's is issued by their campus.
 */
export async function join(input: JoinInput, accounts: Account[]): Promise<JoinResult> {
  const problem = joinProblem(input, accounts);
  if (problem) return { ok: false, ...problem };

  let code: string;
  let student: string | undefined;

  if (input.role === "student") {
    code = formatId({
      country: (input.country || "PK").toUpperCase(),
      school: "000",
      campus: "00",
      advisor: "00",
      serial: provisionalSerial(),
      relationship: STUDENT,
    });
  } else if (input.role === "family") {
    const id = parseId(input.code ?? "");
    if (!id) return { ok: false, field: "code", error: "That code could not be read." };
    student = formatId({ ...id, relationship: STUDENT });
    code = formatId({ ...id, relationship: input.relationship ?? 1 });
    if (accounts.some((a) => a.code === code)) {
      return { ok: false, field: "code", error: "Somebody has already joined as that relation to this student on this device." };
    }
  } else {
    code = (input.code ?? "").trim().toUpperCase();
    if (accounts.some((a) => a.code === code)) {
      return { ok: false, field: "code", error: "There is already an account on this device with that code." };
    }
  }

  const salt = newSalt();
  const key = await deriveKey(input.password, salt);

  const account: Account = {
    code,
    role: input.role,
    name: input.name.trim(),
    email: input.email.trim(),
    salt: toBase64(salt.buffer as ArrayBuffer),
    key,
    iterations: ITERATIONS,
    createdAt: new Date().toISOString(),
    ...(input.under18 ? { guardianEmail: input.guardianEmail?.trim(), consentAt: new Date().toISOString() } : {}),
    ...(student ? { student } : {}),
  };

  return { ok: true, account };
}

/* ------------------------------------------------------------------ *
 * Coming back
 * ------------------------------------------------------------------ */

export type SignInResult = { ok: true; account: Account } | { ok: false; error: string };

/**
 * One message for both failures, on purpose.
 *
 * "No account with that address" tells anybody who asks which addresses have
 * accounts here, and on a product holding students' records that is a list
 * worth having. So a wrong address and a wrong password read the same.
 */
export async function signIn(email: string, password: string, accounts: Account[]): Promise<SignInResult> {
  const found = accounts.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
  const salt = found ? fromBase64(found.salt) : newSalt();
  const key = await deriveKey(password, salt, found?.iterations ?? ITERATIONS);

  if (!found || !sameKey(key, found.key)) {
    return { ok: false, error: "Those details do not match an account on this device." };
  }
  return { ok: true, account: found };
}

/** Where a role lands after signing in. */
export function homeFor(role: AccountRole): string {
  if (role === "advisor") return "/edviko/advisor";
  if (role === "campus") return "/edviko/campus";
  if (role === "family") return "/edviko/family";
  return "/edviko";
}
