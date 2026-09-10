import type { Metadata } from "next";
import { defaultLocale, locales, localeMeta, localePath, type Locale } from "@/lib/i18n/config";
import { siteUrl } from "@/lib/siteUrl";

/**
 * The canonical and hreflang block for one page in one language.
 *
 * Every translation of a page points at every other translation, and all of
 * them name English as the default. Without this a search engine reads five
 * pages saying the same thing and has to guess which is which; with it, it
 * serves the Arabic page to an Arabic reader and the English one to
 * everyone whose language the site does not speak.
 *
 * `path` is always written as the English path. This turns it into the one
 * the language actually uses.
 */
export function localeAlternates(path: string, locale: Locale): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const other of locales) {
    languages[localeMeta[other].tag] = localePath(path, other);
  }
  languages["x-default"] = localePath(path, defaultLocale);

  return { canonical: localePath(path, locale), languages };
}

/** The absolute URL of a page in a language, for JSON-LD and OG tags. */
export function absoluteUrl(path: string, locale: Locale = defaultLocale): string {
  return `${siteUrl}${localePath(path, locale)}`;
}
