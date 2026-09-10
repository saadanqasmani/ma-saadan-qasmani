/**
 * Structured data (schema.org, JSON-LD).
 *
 * This is how a search engine learns that "Saadan Qasmani" is a person rather
 * than a phrase, and that The Highest Branch is a book rather than a page
 * title. It is also the input to Google's knowledge panel.
 *
 * Every field below is derived from content that already exists. Nothing is
 * asserted that the site does not already state in prose: no invented job
 * titles, dates, identifiers, page counts, or profile links. A value we do
 * not have is omitted rather than guessed, because structured data that
 * contradicts the page is worse than no structured data at all.
 */

import type { Book, Person } from "@/lib/data";
import { defaultLocale, localeMeta, type Locale } from "@/lib/i18n/config";
import { absoluteUrl } from "@/lib/i18n/metadata";
import type { ResearchItem } from "@/content/site";
import { profiles } from "@/content/site";
import { siteUrl } from "@/lib/siteUrl";

/** Stable node ids, so Book.author can point at the Person rather than repeat it. */
export const PERSON_ID = `${siteUrl}/#person`;
const SITE_ID = `${siteUrl}/#website`;

/** Drops empty strings, nulls and empty arrays so no blank keys are emitted. */
function compact<T extends Record<string, unknown>>(input: T): T {
  return Object.fromEntries(
    Object.entries(input).filter(([, v]) => {
      if (v === null || v === undefined) return false;
      if (typeof v === "string") return v.trim() !== "";
      if (Array.isArray(v)) return v.length > 0;
      return true;
    })
  ) as T;
}

export function personJsonLd(person: Person) {
  const [primaryRole] = person.roles;

  // Roles double as employer and school. Only the ones naming an
  // organisation are used, and each is emitted as the plain
  // Organization/EducationalOrganization it is.
  const worksFor = person.roles
    .filter((r) => r.org && !/university|college|school/i.test(r.org))
    .map((r) => ({ "@type": "Organization", name: r.org }));

  // `affiliation`, deliberately, not `alumniOf`: the MA is in progress, and
  // alumniOf would assert a completed degree. affiliation is true either way.
  const affiliation = person.roles
    .filter((r) => r.org && /university|college|school/i.test(r.org))
    .map((r) => ({ "@type": "EducationalOrganization", name: r.org }));

  return compact({
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: person.name,
    url: siteUrl,
    description: person.bio,
    jobTitle: primaryRole?.title,
    worksFor,
    affiliation,
    homeLocation: person.location
      ? { "@type": "Place", name: person.location }
      : null,
    image: person.portrait ? new URL(person.portrait, siteUrl).toString() : null,
    // The single most valuable field here: it tells Google that this site and
    // an established profile elsewhere are the same person. Empty until real
    // URLs are supplied; an invented one would be worse than none.
    sameAs: [...profiles],
  });
}

export function websiteJsonLd(person: Person, locale: Locale = defaultLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    url: siteUrl,
    name: person.name,
    inLanguage: localeMeta[locale].tag,
    publisher: { "@id": PERSON_ID },
  };
}

export function bookJsonLd(book: Book) {
  // The status field is free text and may still hold a placeholder, so it is
  // never mapped to a publication date. Word and chapter counts are real but
  // have no honest schema.org equivalent (numberOfPages is pages, not words),
  // so they stay in the page copy where they are already explained.
  return compact({
    "@context": "https://schema.org",
    "@type": "Book",
    name: book.title,
    url: `${siteUrl}/the-highest-branch`,
    description: book.synopsis,
    genre: book.genre,
    about: book.subject,
    author: { "@id": PERSON_ID },
    image: book.coverImage
      ? new URL(book.coverImage, siteUrl).toString()
      : null,
    // Only present once the book is actually listed somewhere buyable.
    sameAs: book.amazonUrl ? [book.amazonUrl] : [],
  });
}

/**
 * Each research entry as a ScholarlyArticle.
 *
 * The abstracts open in a panel rather than sitting in the page, so this is
 * how a crawler reads them. Only what the entry already states is emitted:
 * no DOI is invented, and the free-text date field is never mapped to a
 * publication date because it usually says "In progress".
 */
export function researchJsonLd(
  items: ResearchItem[],
  person: Person,
  locale: Locale = defaultLocale
) {
  return items.map((item) =>
    compact({
      "@context": "https://schema.org",
      "@type": "ScholarlyArticle",
      name: item.subtitle ? `${item.title}: ${item.subtitle}` : item.title,
      headline: item.title,
      abstract: item.abstract,
      url: absoluteUrl(`/research/${item.slug}`, locale),
      about: item.area,
      keywords: item.keywords,
      // The language the page is actually written in. Declaring English on
      // a translated page tells a search engine to match it against English
      // queries, which is the one thing the translation exists not to do.
      inLanguage: localeMeta[locale].tag,
      // Author order is a claim in academic work, so the paper's own byline
      // is used where the entry states one. Saadan's node is linked by id so
      // a search engine ties the paper to the person, not to a bare string.
      author: (item.authors?.length
        ? item.authors
        : [person.name, ...(item.coAuthors ?? [])]
      ).map((name) =>
        name.includes("Saadan Qasmani")
          ? { "@id": PERSON_ID, "@type": "Person", name }
          : { "@type": "Person", name }
      ),
      sourceOrganization: item.institution
        ? { "@type": "Organization", name: item.institution }
        : null,
      isAccessibleForFree: item.access === "open",
    })
  );
}
