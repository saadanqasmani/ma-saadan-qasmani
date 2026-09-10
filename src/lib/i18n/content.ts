import {
  highestBranch,
  instruments,
  researchNote,
  type ResearchItem,
  type WorkItem,
} from "@/content/site";
import type { Book, Person } from "@/lib/data";
import { icd } from "@/content/icd";
import { MARKS, type Mark } from "@/content/marginalia";
import { mediaSets, type MediaSet } from "@/content/media";
import { iris } from "@/content/iris";
import { recruitment } from "@/content/recruitment";
import { defaultLocale, type Locale } from "@/lib/i18n/config";
import { merge, type Overlay } from "@/lib/i18n/dictionary";

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
  work?: Record<string, { title?: string; summary?: string; linkLabel?: string }>;
  /**
   * The three deep pages. Each is a tree of plain strings, so a translation
   * is the same tree with the branches it has words for. Anything it leaves
   * out keeps the English underneath.
   */
  /** The seven marks, by id: the hint, and what each one reveals. */
  marks?: Record<string, { hint?: string; title?: string; line?: string }>;
  /**
   * Photograph captions, by set. The captions are given as a list in the
   * order the set holds them, since a caption has no key of its own.
   */
  media?: Record<string, { title?: string; captions?: readonly string[] }>;
  iris?: Overlay<typeof iris>;
  icd?: Overlay<typeof icd>;
  recruitment?: Overlay<typeof recruitment>;
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
  /**
   * Each of these takes the record as it was read — from the database when
   * one is connected, from src/content otherwise — and returns it in this
   * language. Translating a copy of the static content instead would mean
   * that editing the site in the dashboard silently stopped reaching every
   * page but the English one.
   */
  person: (base: Person) => Person;
  book: (base: Book) => Book;
  purchase: { amazonRegions: string; directRegions: string; directNote: string };
  instrument: { label: string; definition: string | null };
  researchNote: { before: string; name: string; after: string };
  work: (items: WorkItem[]) => WorkItem[];
  research: (items: ResearchItem[]) => TranslatedResearchItem[];
  marks: Mark[];
  mediaSet: (key: string) => MediaSet | null;
  iris: typeof iris;
  icd: typeof icd;
  recruitment: typeof recruitment;
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

    person: (base) => ({
      ...base,
      positioning: pick(p.positioning, base.positioning),
      location: pick(p.location, base.location),
      bio: pick(p.bio, base.bio),
      practitionerNote: pick(p.practitionerNote, base.practitionerNote),
      roles: base.roles.map((role, i) => ({
        ...role,
        title: pick(p.roles?.[i]?.title, role.title),
        // The organisation is a proper name. It is translated only where a
        // language has its own established name for it.
        org: pick(p.roles?.[i]?.org, role.org),
      })),
      founded: base.founded.map((item, i) => ({
        ...item,
        name: pick(p.founded?.[i]?.name, item.name),
        org: pick(p.founded?.[i]?.org, item.org),
      })),
      honors: base.honors.map((honor, i) => ({
        ...honor,
        title: pick(p.honors?.[i]?.title, honor.title),
        org: pick(p.honors?.[i]?.org, honor.org),
      })),
    }),

    book: (base) => ({
      ...base,
      genre: pick(b.genre, base.genre),
      tagline: pick(b.tagline, base.tagline),
      status: pick(b.status, base.status),
      synopsis: pick(b.synopsis, base.synopsis),
      subject: pick(b.subject, base.subject),
    }),

    purchase: {
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

    marks: MARKS.map((mark) => {
      const t = overlay.marks?.[mark.id];
      if (!t) return mark;
      return {
        ...mark,
        hint: pick(t.hint, mark.hint),
        title: pick(t.title, mark.title),
        line: pick(t.line, mark.line),
      };
    }),

    mediaSet: (key) => {
      const set = mediaSets[key];
      if (!set) return null;
      const t = overlay.media?.[key];
      if (!t) return set;
      return {
        ...set,
        title: pick(t.title, set.title),
        items: set.items.map((item, i) => ({
          ...item,
          caption: pick(t.captions?.[i], item.caption),
        })),
      };
    },
    iris: merge(iris, overlay.iris),
    icd: merge(icd, overlay.icd),
    recruitment: merge(recruitment, overlay.recruitment),

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
