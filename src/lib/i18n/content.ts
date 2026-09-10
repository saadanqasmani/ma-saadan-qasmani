import {
  highestBranch,
  instruments,
  person,
  researchNote,
  type ResearchItem,
  type WorkCategory,
  type WorkItem,
} from "@/content/site";
import { defaultLocale, type Locale } from "@/lib/i18n/config";

/**
 * Translations of the content itself, as opposed to the interface.
 *
 * The English records in src/content stay canonical and keep their slugs,
 * dates, links and images. A translation attaches to a record by its slug
 * and replaces only the words: a paper that gains an Arabic abstract is
 * still the same paper, with the same authors, the same DOI and the same
 * place in the archive.
 *
 * Anything a translation omits stays English. That is what makes it safe to
 * translate the site in pieces.
 */

export type ContentOverlay = {
  person?: {
    positioning?: string;
    location?: string;
    bio?: string;
    practitionerNote?: string;
    roles?: readonly { title: string; org?: string }[];
    founded?: readonly { name: string; org?: string }[];
    honors?: readonly { title: string; org?: string }[];
  };
  book?: {
    genre?: string;
    tagline?: string;
    status?: string;
    synopsis?: string;
    subject?: string;
    amazonRegions?: string;
    directRegions?: string;
    directNote?: string;
  };
  instrumentDefinition?: string;
  instrumentLabel?: string;
  researchNote?: { before?: string; after?: string };
  /** The work categories, which are shown as labels rather than stored as data. */
  categories?: Partial<Record<WorkCategory, string>>;
  work?: Record<string, { title?: string; summary?: string; linkLabel?: string }>;
  research?: Record<
    string,
    {
      title?: string;
      subtitle?: string;
      abstract?: string;
      keywords?: readonly string[];
      area?: string;
      type?: string;
      date?: string;
    }
  >;
};

const overlays: Record<Exclude<Locale, "en">, () => Promise<ContentOverlay>> = {
  ar: () => import("@/content/i18n/ar").then((m) => m.arContent),
  ru: () => import("@/content/i18n/ru").then((m) => m.ruContent),
  ur: () => import("@/content/i18n/ur").then((m) => m.urContent),
  de: () => import("@/content/i18n/de").then((m) => m.deContent),
};

/**
 * A research record in another language, carrying the English it was made
 * from. The original travels with it because an abstract is a published
 * claim: a reader who wants to check a term against the words the authors
 * actually approved should not have to leave the page to do it.
 */
export type TranslatedResearchItem = ResearchItem & {
  original?: { title: string; subtitle?: string; abstract: string };
};

export type Content = {
  locale: Locale;
  /** False for English, and for a language whose overlay is still empty. */
  translated: boolean;
  person: {
    positioning: string;
    location: string;
    bio: string;
    practitionerNote: string;
    roles: readonly { title: string; org: string }[];
    founded: readonly { name: string; org: string }[];
    honors: readonly { title: string; org: string; year: string; media?: string }[];
  };
  book: {
    genre: string;
    tagline: string;
    status: string;
    synopsis: string;
    subject: string;
    amazonRegions: string;
    directRegions: string;
    directNote: string;
  };
  instrument: { label: string; definition: string | null };
  researchNote: { before: string; name: string; after: string };
  category: (category: WorkCategory) => string;
  work: (items: WorkItem[]) => WorkItem[];
  research: (items: ResearchItem[]) => TranslatedResearchItem[];
};

function pick<T>(translated: T | undefined, original: T): T {
  return translated === undefined ? original : translated;
}

export async function getContent(locale: Locale): Promise<Content> {
  const overlay: ContentOverlay = locale === defaultLocale ? {} : await overlays[locale]();
  const translated = Object.keys(overlay).length > 0;

  const p = overlay.person ?? {};
  const b = overlay.book ?? {};

  return {
    locale,
    translated,

    person: {
      positioning: pick(p.positioning, person.positioning),
      location: pick(p.location, person.location),
      bio: pick(p.bio, person.bio),
      practitionerNote: pick(p.practitionerNote, person.practitionerNote),
      roles: person.roles.map((role, i) => ({
        title: pick(p.roles?.[i]?.title, role.title),
        // The organisation is a proper name. It is translated only where a
        // language has its own established name for it.
        org: pick(p.roles?.[i]?.org, role.org),
      })),
      founded: person.founded.map((item, i) => ({
        name: pick(p.founded?.[i]?.name, item.name),
        org: pick(p.founded?.[i]?.org, item.org),
      })),
      honors: person.honors.map((honor, i) => ({
        title: pick(p.honors?.[i]?.title, honor.title),
        org: pick(p.honors?.[i]?.org, honor.org),
        year: honor.year,
        media: honor.media,
      })),
    },

    book: {
      genre: pick(b.genre, highestBranch.genre),
      tagline: pick(b.tagline, highestBranch.tagline),
      status: pick(b.status, highestBranch.status),
      synopsis: pick(b.synopsis, highestBranch.synopsis),
      subject: pick(b.subject, highestBranch.subject),
      amazonRegions: pick(b.amazonRegions, highestBranch.purchase.amazon.regions),
      directRegions: pick(b.directRegions, highestBranch.purchase.direct.regions),
      directNote: pick(b.directNote, highestBranch.purchase.direct.note),
    },

    instrument: {
      label: pick(overlay.instrumentLabel, instruments["img-ipi"].label),
      definition: pick(overlay.instrumentDefinition, instruments["img-ipi"].definition),
    },

    researchNote: {
      before: pick(overlay.researchNote?.before, researchNote.before),
      // Never translated: it is a person's name.
      name: researchNote.name,
      after: pick(overlay.researchNote?.after, researchNote.after),
    },

    category: (category) => overlay.categories?.[category] ?? category,

    work: (items) =>
      items.map((item) => {
        const t = overlay.work?.[item.slug];
        if (!t) return item;
        return {
          ...item,
          title: pick(t.title, item.title),
          summary: pick(t.summary, item.summary),
          link: item.link
            ? { ...item.link, label: pick(t.linkLabel, item.link.label) }
            : item.link,
        };
      }),

    research: (items) =>
      items.map((item) => {
        const t = overlay.research?.[item.slug];
        if (!t?.abstract && !t?.title) return item;
        return {
          ...item,
          title: pick(t.title, item.title),
          subtitle: pick(t.subtitle, item.subtitle),
          abstract: pick(t.abstract, item.abstract),
          keywords: t.keywords ? [...t.keywords] : item.keywords,
          area: pick(t.area, item.area),
          type: pick(t.type, item.type),
          date: pick(t.date, item.date),
          original: {
            title: item.title,
            subtitle: item.subtitle,
            abstract: item.abstract,
          },
        };
      }),
  };
}
