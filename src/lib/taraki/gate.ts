/**
 * The gate on Taraki.
 *
 * Everything under /taraki is private work. The middleware turns away any
 * request that does not carry a valid cookie, so an uninvited visitor never
 * receives the markup at all — the pages are not merely hidden by CSS or by
 * an unlinked URL.
 *
 * The cookie carries a hash of the code rather than the code, so somebody
 * who was never given it cannot write themselves a valid one.
 *
 * Web Crypto rather than node:crypto: the middleware runs on the edge and
 * shares this module.
 *
 * Read the ceiling on this honestly. It keeps the work off search engines
 * and away from anyone who wanders past. It is one shared code, so it is
 * only ever as private as the shortest-lived copy of that code, and it is
 * not a defence against someone determined.
 */

export const TARAKI_COOKIE = "taraki_access";

/** A month. Long enough that the code is asked for rarely. */
export const TARAKI_COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

/**
 * Set TARAKI_CODE in the host's environment to rotate it without a deploy.
 * GCB_CODE is still read, so a value set under the old name keeps working.
 */
export function tarakiCode(): string {
  return (process.env.TARAKI_CODE || process.env.GCB_CODE || "taraedu12345").trim();
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** What a visitor who entered the correct code carries. */
export function tarakiToken(): Promise<string> {
  return sha256Hex(`taraki/v1/${tarakiCode()}`);
}

/** Compares without leaking, through timing, how much of a match it was. */
function sameSecret(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function tarakiCodeIsCorrect(entered: string): boolean {
  return sameSecret(entered.trim().toLowerCase(), tarakiCode().toLowerCase());
}

export async function tarakiTokenIsValid(value: string | undefined): Promise<boolean> {
  if (!value) return false;
  return sameSecret(value, await tarakiToken());
}
