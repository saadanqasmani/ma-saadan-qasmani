import {
  Amiri,
  Instrument_Sans,
  Instrument_Serif,
  Inter,
  Literata,
  Newsreader,
  Noto_Nastaliq_Urdu,
  Noto_Sans_Arabic,
} from "next/font/google";
import type { Locale } from "@/lib/i18n/config";

/**
 * A typeface set per script.
 *
 * The Latin faces carry the site's voice, and none of them draw an Arabic,
 * Urdu or Cyrillic glyph. Falling back silently would leave a reader with
 * whatever their system happened to have, which for Nastaliq usually means
 * Naskh and for Cyrillic usually means something that does not match the
 * page at all. So each script gets faces chosen for it rather than
 * inherited: Amiri for Arabic, because the site is literary and Amiri is a
 * book Naskh; Nastaliq for Urdu, because Urdu readers read Nastaliq and a
 * Naskh Urdu page reads as a foreign one; Literata for Russian, drawn for
 * long-form screen reading and cut with a Cyrillic that belongs to the same
 * design rather than being bolted on.
 *
 * Only the Latin faces preload. The rest are fetched by the pages that name
 * them, so an English visitor never pays for an Arabic font.
 */

const instrumentSerif = Instrument_Serif({
  variable: "--font-latin-display",
  // latin-ext carries ı, ğ, ş and the dotted capital İ. Without it Turkish
  // falls back mid-word and the page changes typeface inside a name.
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
});

const newsreader = Newsreader({
  variable: "--font-latin-serif",
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-latin-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
});

const amiri = Amiri({
  variable: "--font-arabic-serif",
  subsets: ["arabic"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-arabic-sans",
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: false,
});

const notoNastaliqUrdu = Noto_Nastaliq_Urdu({
  variable: "--font-urdu",
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: false,
});

const literata = Literata({
  variable: "--font-cyrillic-serif",
  subsets: ["cyrillic", "latin"],
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  preload: false,
});

const inter = Inter({
  variable: "--font-cyrillic-sans",
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: false,
});

/** The Latin faces load on every page: the wordmark and the logo use them. */
const latin = `${instrumentSerif.variable} ${newsreader.variable} ${instrumentSans.variable}`;

const byLocale: Record<Locale, string> = {
  en: latin,
  de: latin,
  tr: latin,
  ar: `${latin} ${amiri.variable} ${notoSansArabic.variable}`,
  ur: `${latin} ${notoNastaliqUrdu.variable}`,
  ru: `${latin} ${literata.variable} ${inter.variable}`,
};

/**
 * The class list for <html>: the font variables this language needs, plus a
 * script class that globals.css uses to point --font-display and friends at
 * them.
 */
export function fontClassNames(locale: Locale): string {
  const script =
    locale === "ar" ? "script-arabic" : locale === "ur" ? "script-urdu" : locale === "ru" ? "script-cyrillic" : "script-latin";
  return `${byLocale[locale]} ${script}`;
}
