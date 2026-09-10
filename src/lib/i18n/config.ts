/**
 * The languages the site is written in.
 *
 * English is the source. The other four are translations of it, and they
 * are treated as translations rather than as separate sites: the same
 * routes, the same structure, the same content, said in another language.
 *
 * English keeps the bare paths it has always had (/work, /research), so
 * nothing already linked or indexed moves. The others sit under a prefix.
 * A visitor is never redirected by their browser's language header; the
 * language they asked for in the URL is the language they get.
 */

/**
 * The order they are offered in, which is the order they appear in the
 * switcher: English first as the source, then the languages of the places
 * the work actually happens.
 */
export const locales = ["en", "tr", "de", "ru", "ar", "ur"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale = "en" as const satisfies Locale;

/** The locales that carry a URL prefix. English does not. */
export const prefixedLocales = locales.filter((l) => l !== defaultLocale);

type LocaleMeta = {
  /** What the language calls itself. Never the English name for it. */
  label: string;
  /** The English name, for the switcher's accessible label. */
  english: string;
  /** Writing direction of the script. */
  dir: "ltr" | "rtl";
  /** BCP 47 tag for <html lang> and hreflang. */
  tag: string;
  /**
   * A flag shown beside the language in the switcher.
   *
   * Flags name countries, not languages, so every one of these is a
   * shorthand rather than a fact: English is not only Britain's, German is
   * spoken in Austria and Switzerland, and Arabic belongs to more than
   * twenty countries at once. They are here because a reader scanning a
   * list finds a flag faster than a word in a script they cannot read.
   * Changing one is a single character.
   */
  flag: string;
};

export const localeMeta: Record<Locale, LocaleMeta> = {
  en: { label: "English", english: "English", dir: "ltr", tag: "en", flag: "🇬🇧" },
  tr: { label: "Türkçe", english: "Turkish", dir: "ltr", tag: "tr", flag: "🇹🇷" },
  de: { label: "Deutsch", english: "German", dir: "ltr", tag: "de", flag: "🇩🇪" },
  ru: { label: "Русский", english: "Russian", dir: "ltr", tag: "ru", flag: "🇷🇺" },
  ar: { label: "العربية", english: "Arabic", dir: "rtl", tag: "ar", flag: "🇸🇦" },
  ur: { label: "اردو", english: "Urdu", dir: "rtl", tag: "ur", flag: "🇵🇰" },
};

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function dirFor(locale: Locale): "ltr" | "rtl" {
  return localeMeta[locale].dir;
}

export function isRtl(locale: Locale): boolean {
  return localeMeta[locale].dir === "rtl";
}

/**
 * The path a given route takes in a given language.
 *
 * Everything on the site is written as its English path; this is the one
 * place that knows a prefix exists. Passing an already-prefixed path back
 * in is safe, so a link built from the current pathname does not double up.
 */
export function localePath(path: string, locale: Locale): string {
  const bare = stripLocale(path);
  if (locale === defaultLocale) return bare;
  return bare === "/" ? `/${locale}` : `/${locale}${bare}`;
}

/** The English path underneath a possibly-prefixed one. */
export function stripLocale(path: string): string {
  const match = /^\/([a-z]{2})(?=\/|$)/.exec(path);
  if (match && isLocale(match[1]) && match[1] !== defaultLocale) {
    return path.slice(3) || "/";
  }
  return path || "/";
}

/** The locale a path is asking for, English when it carries no prefix. */
export function localeFromPath(path: string): Locale {
  const match = /^\/([a-z]{2})(?=\/|$)/.exec(path);
  return match && isLocale(match[1]) ? match[1] : defaultLocale;
}

/** Scripts that run right to left: Hebrew, Arabic, Syriac, Thaana, NKo. */
const RTL_CHARS = /[֐-׿؀-ۿ܀-ݏݐ-ݿހ-޿߀-߿ࡠ-ࣿיִ-﷿ﹰ-﻿]/;
const LTR_CHARS = /[A-Za-zÀ-ɏͰ-ϿЀ-ӿ]/;

/**
 * Which way a piece of text runs, read from its own first strong character.
 *
 * Used where the direction of a string cannot be assumed from the page: a
 * paper title that has no translation yet, a proper name, an acronym. Returns
 * undefined when the text says nothing either way, so the element simply
 * inherits the page's direction.
 */
export function textDirection(text: string): "ltr" | "rtl" | undefined {
  const rtl = RTL_CHARS.exec(text);
  const ltr = LTR_CHARS.exec(text);
  if (!rtl && !ltr) return undefined;
  if (rtl && !ltr) return "rtl";
  if (ltr && !rtl) return "ltr";
  return rtl!.index < ltr!.index ? "rtl" : "ltr";
}
