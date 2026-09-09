/**
 * The gate on the IRIS film and the two sections that describe how it
 * works.
 *
 * The code is the whole of the secret. The cookie never carries it: it
 * carries a hash of it, so a visitor who has not been given the code cannot
 * write themselves a valid cookie, and a visitor who has been given it can
 * be recognised again without the code sitting in their browser in the
 * clear.
 *
 * Web Crypto rather than node:crypto, because the middleware that guards the
 * film file itself runs on the edge and this module is shared with it.
 */

/** Name of the cookie that records a viewer as having entered the code. */
export const IRIS_COOKIE = "iris_access";

/** How long one unlock lasts. Long enough that a viewer asks once. */
export const IRIS_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

/**
 * Set IRIS_FILM_CODE in the environment to change the code without a
 * deploy. The fallback is the code Saadan hands out today.
 */
export function irisCode(): string {
  return (process.env.IRIS_FILM_CODE || "djmanotto").trim();
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** The value a viewer who entered the correct code carries. */
export function irisToken(): Promise<string> {
  return sha256Hex(`iris-film/v1/${irisCode()}`);
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
  return sameSecret(entered.trim().toLowerCase(), irisCode().toLowerCase());
}

/** True when this cookie value was written by a correct code. */
export async function tokenIsValid(value: string | undefined): Promise<boolean> {
  if (!value) return false;
  return sameSecret(value, await irisToken());
}
