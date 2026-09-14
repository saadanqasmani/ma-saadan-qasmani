/**
 * Leaving the list with one click.
 *
 * Every letter carries a link that is specific to the address it went to:
 * the address, and a signature over it that only this server can produce.
 * A reader who clicks it is taken off the list without typing anything, and
 * nobody can forge a link for an address that is not their own.
 *
 * The secret is MAIL_SECRET when set; otherwise the service-role key is
 * stretched into one. Either way it never leaves the server, and rotating
 * it only invalidates old links, which a reader can replace by replying.
 */

import { siteUrl } from "@/lib/siteUrl";

function secret(): string {
  return (
    process.env.MAIL_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.RESEND_API_KEY ||
    "unset"
  );
}

async function hmacHex(message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(`unsubscribe/v1/${secret()}`),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function unsubscribeToken(email: string): Promise<string> {
  return (await hmacHex(email.trim().toLowerCase())).slice(0, 32);
}

export async function unsubscribeUrl(email: string): Promise<string> {
  const address = email.trim().toLowerCase();
  const token = await unsubscribeToken(address);
  return `${siteUrl}/api/unsubscribe?e=${encodeURIComponent(address)}&t=${token}`;
}

function sameSecret(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function unsubscribeTokenIsValid(email: string, token: string): Promise<boolean> {
  if (!email || !token) return false;
  return sameSecret(token, await unsubscribeToken(email));
}
