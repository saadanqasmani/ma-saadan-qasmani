import "server-only";
import { baseDictionary, fill, merge, type Dictionary } from "@/lib/i18n/dictionary";
import { getContent as buildContent, type Content } from "@/lib/i18n/content";
import { applyFlat, nest, outside, overridesFor, under } from "@/lib/content/overrides";
import { brand, highestBranch } from "@/content/site";
import { mediaSets } from "@/content/media";
import type { Locale } from "@/lib/i18n/config";

/**
 * The site's words with the dashboard's edits on them.
 *
 * Both layers underneath — English, and the translation written for each
 * language — are read the way they always were, from the files. This adds a
 * third: the lines somebody has changed since the deploy. It is usually
 * empty, and when it cannot be read at all the page still says everything it
 * is supposed to, which is why it is layered on last and never underneath.
 *
 * It lives apart from lib/i18n/dictionary.ts because that module is
 * imported by client components for `fill` and its types, and this one
 * reaches the database.
 */
/** The record strings live under these prefixes; everything else is the dictionary. */
const RECORDS = ["book", "media", "brand"];

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const base = await baseDictionary(locale);
  const edits = outside(await overridesFor(locale), RECORDS);
  return Object.keys(edits).length > 0 ? merge(base, nest(edits)) : base;
}

export async function getContent(locale: Locale): Promise<Content> {
  const flat = await overridesFor(locale);
  // The records are edited as themselves rather than through the narrow
  // translation overlay, so that any string in them can be changed and not
  // only the handful the overlay happens to name. That is also what makes
  // every photograph on the site swappable: a picture is a path, and a path
  // is a string.
  return buildContent(locale, undefined, {
    book: applyFlat(highestBranch, under(flat, "book")),
    media: applyFlat(mediaSets, under(flat, "media")),
    brand: applyFlat(brand, under(flat, "brand")),
  });
}

// Re-exported so a page can take everything it needs from one import.
export { fill };
export type { Dictionary, Content };
