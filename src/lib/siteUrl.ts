/**
 * The site's canonical origin, resolved once.
 *
 * Every value here is treated as untrusted: an environment variable that is
 * present but empty, whitespace, or missing its protocol must never reach
 * `new URL()`, because a throw at module scope fails the whole build rather
 * than just the metadata. Falls back through the host's own deployment URL
 * before the hardcoded default.
 */

const DEFAULT_SITE_URL = "https://saadanqasmani.com";

function normalize(value: string | undefined | null): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    return new URL(withProtocol).origin;
  } catch {
    return null;
  }
}

export const siteUrl: string =
  normalize(process.env.NEXT_PUBLIC_SITE_URL) ??
  // Set by Vercel: the stable production domain, then the per-deployment host.
  normalize(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
  normalize(process.env.VERCEL_URL) ??
  DEFAULT_SITE_URL;
