import { en, type Dictionary } from "@/content/i18n/en";
import { defaultLocale, type Locale } from "@/lib/i18n/config";

/**
 * A translation of the English dictionary. Every key optional: a language
 * is allowed to be half done, and the half that is missing reads as English
 * rather than as a broken page.
 */
export type Overlay<T> = {
  [K in keyof T]?: T[K] extends string
    ? string
    : T[K] extends readonly string[]
      ? readonly string[]
      : T[K] extends object
        ? Overlay<T[K]>
        : T[K];
};

export type DictionaryOverlay = Overlay<Dictionary>;

const overlays: Record<Exclude<Locale, "en">, () => Promise<DictionaryOverlay>> = {
  ar: () => import("@/content/i18n/ar").then((m) => m.ar),
  ru: () => import("@/content/i18n/ru").then((m) => m.ru),
  ur: () => import("@/content/i18n/ur").then((m) => m.ur),
  de: () => import("@/content/i18n/de").then((m) => m.de),
};

/**
 * English underneath, the translation on top.
 *
 * Arrays are replaced whole rather than merged element by element: a list of
 * three roles translated as three roles is one decision, and merging by
 * index would let a shorter translated list leave English stragglers behind.
 */
function merge<T>(base: T, over: unknown): T {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base) || Array.isArray(over)) return over as T;
  if (typeof base !== "object" || typeof over !== "object") return over as T;

  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [key, value] of Object.entries(over as Record<string, unknown>)) {
    out[key] = key in out ? merge(out[key], value) : value;
  }
  return out as T;
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  if (locale === defaultLocale) return en;
  return merge(en, await overlays[locale]());
}

export type { Dictionary };
