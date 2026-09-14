/**
 * The gate on the workroom.
 *
 * Same shape as the others: the cookie carries a hash of the code, never the
 * code, and the middleware refuses everything under /ops without it. Two
 * people use this, so it is one shared code, and it is exactly as private as
 * the more careless of the two.
 */

export const OPS_COOKIE = "ops_access";
export const OPS_COOKIE_MAX_AGE = 60 * 60 * 24 * 90;

/** Set OPS_CODE in the host's environment to rotate it without a deploy. */
export function opsCode(): string {
  return (process.env.OPS_CODE || "djmanotto").trim();
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function opsToken(): Promise<string> {
  return sha256Hex(`ops/v1/${opsCode()}`);
}

function sameSecret(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function opsCodeIsCorrect(entered: string): boolean {
  return sameSecret(entered.trim().toLowerCase(), opsCode().toLowerCase());
}

export async function opsTokenIsValid(value: string | undefined): Promise<boolean> {
  if (!value) return false;
  return sameSecret(value, await opsToken());
}
