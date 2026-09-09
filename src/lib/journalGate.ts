/**
 * The gate on the essays and notes.
 *
 * Two ways through it. A reader can enter the access code they were sent when
 * they subscribed, or they can subscribe here and the page opens for them on
 * the spot. Both end in the same cookie.
 *
 * The cookie carries a hash of the code rather than the code, so a reader who
 * was never given it cannot write themselves a valid one. Web Crypto rather
 * than node:crypto, so the same module works wherever it is imported.
 *
 * This is a courtesy gate, not a vault: the code is shared between everyone
 * who has it, and anyone can type an address into the subscribe box. It is
 * built to be worth subscribing for, not to be unbreakable.
 */

export const JOURNAL_COOKIE = "journal_access";

/** How long one unlock lasts. A year: this is a reader, not a session. */
export const JOURNAL_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * Set JOURNAL_CODE in the environment to change the code without a deploy.
 * The fallback is the code that goes out with the subscription email.
 */
export function journalCode(): string {
  return (process.env.JOURNAL_CODE || "THB19").trim();
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** The value a reader who has been let in carries. */
export function journalToken(): Promise<string> {
  return sha256Hex(`journal/v1/${journalCode()}`);
}

/** Compares without leaking, through timing, how much of a match it was. */
function sameSecret(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** True when the entered code is the current one. Case and space forgiving. */
export function codeIsCorrect(entered: string): boolean {
  return sameSecret(entered.trim().toLowerCase(), journalCode().toLowerCase());
}

/** True when this cookie value was written by a correct code. */
export async function tokenIsValid(value: string | undefined): Promise<boolean> {
  if (!value) return false;
  return sameSecret(value, await journalToken());
}
