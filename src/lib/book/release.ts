import { highestBranch } from "@/content/site";
import { localeMeta, type Locale } from "@/lib/i18n/config";

/**
 * Publication day, written the way the reader's language writes a date.
 *
 * A Turkish pre-order card was saying "yayımlandığında gönderilir, 19
 * October 2026". The date is a fact and the sentence around it was
 * translated; the date was not, because it was stored as an English
 * sentence. It is stored as a date now and formatted at the point of use.
 */
export function releaseDateIn(locale: string): string {
  const meta = localeMeta[locale as Locale];
  if (!meta) return highestBranch.releaseDate;
  // British order for English: the rest of the site writes 19 October 2026,
  // and a bare "en" gives the American one.
  const tag = meta.tag === "en" ? "en-GB" : meta.tag;
  try {
    return new Intl.DateTimeFormat(tag, {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(`${highestBranch.releaseIso}T00:00:00Z`));
  } catch {
    return highestBranch.releaseDate;
  }
}
