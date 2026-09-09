import { createClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";
import {
  person as staticPerson,
  highestBranch as staticBook,
  researchItems as staticResearch,
  workItems as staticWork,
  publications as staticPublications,
  blogPosts as staticPosts,
  type BlogPost,
  type Publication,
  type ResearchItem,
  type WorkCategory,
  type WorkItem,
} from "@/content/site";

/**
 * Public reads.
 *
 * Every getter falls back to the hand-authored content in src/content/site.ts
 * when the database is unreachable or empty. The site therefore renders
 * identically with no backend attached, and each field becomes editable the
 * moment Supabase is connected — without a rebuild of the pages themselves.
 */

export type Person = {
  name: string;
  positioning: string;
  location: string;
  bio: string;
  practitionerNote: string;
  portrait: string | null;
  roles: { title: string; org: string }[];
  founded: { name: string; org: string }[];
  honors: { title: string; year: string; org?: string; media?: string }[];
};

export type Book = {
  title: string;
  genre: string;
  tagline: string;
  subject: string;
  status: string;
  synopsis: string;
  wordCount: number;
  chapterCount: number;
  coverImage: string | null;
  amazonUrl: string | null;
  directOrderEnabled: boolean;
};

function readClient() {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });
}

const fallbackPerson: Person = {
  name: staticPerson.name,
  positioning: staticPerson.positioning,
  location: staticPerson.location,
  bio: staticPerson.bio,
  practitionerNote: staticPerson.practitionerNote,
  portrait: staticPerson.portrait,
  roles: staticPerson.roles.map((r) => ({ ...r })),
  founded: staticPerson.founded.map((f) => ({ ...f })),
  honors: staticPerson.honors.map((h) => ({ ...h })),
};

const fallbackBook: Book = {
  title: staticBook.title,
  genre: staticBook.genre,
  tagline: staticBook.tagline,
  subject: staticBook.subject,
  status: staticBook.status,
  synopsis: staticBook.synopsis,
  wordCount: staticBook.wordCount,
  chapterCount: staticBook.chapterCount,
  coverImage: staticBook.coverImage,
  amazonUrl: staticBook.purchase.amazon.url,
  directOrderEnabled: true,
};

/** Prefer a stored value, but never let a blank column erase real copy. */
function pick<T>(value: T | null | undefined, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string" && value.trim() === "") return fallback;
  return value;
}

export async function getPerson(): Promise<Person> {
  const db = readClient();
  if (!db) return fallbackPerson;

  const { data, error } = await db.from("site_settings").select("*").maybeSingle();
  if (error || !data) return fallbackPerson;

  const list = <T,>(value: unknown, fallback: T[]): T[] =>
    Array.isArray(value) && value.length > 0 ? (value as T[]) : fallback;

  return {
    name: pick(data.name, fallbackPerson.name),
    positioning: pick(data.positioning, fallbackPerson.positioning),
    location: pick(data.location, fallbackPerson.location),
    bio: pick(data.bio, fallbackPerson.bio),
    practitionerNote: pick(data.practitioner_note, fallbackPerson.practitionerNote),
    // Same fallback as every other field here. Reading the column directly
    // meant that connecting the database at all replaced the portrait with
    // nothing, because the row exists long before anyone fills it in.
    portrait: pick(data.portrait_path, fallbackPerson.portrait),
    roles: list(data.roles, fallbackPerson.roles),
    founded: list(data.founded, fallbackPerson.founded),
    honors: list(data.honors, fallbackPerson.honors),
  };
}

export async function getBook(): Promise<Book> {
  const db = readClient();
  if (!db) return fallbackBook;

  const { data, error } = await db.from("book_settings").select("*").maybeSingle();
  if (error || !data) return fallbackBook;

  return {
    title: pick(data.title, fallbackBook.title),
    genre: pick(data.genre, fallbackBook.genre),
    tagline: pick(data.tagline, fallbackBook.tagline),
    subject: pick(data.subject, fallbackBook.subject),
    status: pick(data.status, fallbackBook.status),
    synopsis: pick(data.synopsis, fallbackBook.synopsis),
    wordCount: pick(data.word_count, fallbackBook.wordCount),
    chapterCount: pick(data.chapter_count, fallbackBook.chapterCount),
    coverImage: pick(data.cover_image_path, fallbackBook.coverImage),
    amazonUrl: pick(data.amazon_url, fallbackBook.amazonUrl),
    directOrderEnabled: data.direct_order_enabled ?? true,
  };
}

export async function getResearchItems(): Promise<ResearchItem[]> {
  const db = readClient();
  if (!db) return staticResearch;

  const { data, error } = await db
    .from("research_items")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error || !data || data.length === 0) return staticResearch;

  // The table has no column for a subtitle or for the instrument badge, and
  // an empty cell should not blank a field the content file fills. Both are
  // carried over from the content file by slug, the way the work links are.
  const authored = new Map(staticResearch.map((r) => [r.slug, r]));

  return data.map((row) => {
    const base = authored.get(row.slug);
    return {
      slug: row.slug,
      title: pick(row.title, base?.title ?? row.slug),
      subtitle: base?.subtitle,
      abstract: pick(row.abstract, base?.abstract ?? ""),
      date: pick(row.date, base?.date ?? ""),
      area: pick(row.area, base?.area ?? ""),
      keywords: row.keywords?.length ? row.keywords : (base?.keywords ?? []),
      type: pick(row.type, base?.type ?? ""),
      authors: base?.authors,
      coAuthors: row.co_authors?.length ? row.co_authors : (base?.coAuthors ?? []),
      institution: row.institution ?? base?.institution,
      doiOrLink: row.doi_or_link ?? base?.doiOrLink ?? null,
      access: row.access === "open" ? "open" : "restricted",
      instrument: base?.instrument,
    };
  });
}

export async function getResearchItem(slug: string): Promise<ResearchItem | null> {
  const items = await getResearchItems();
  return items.find((i) => i.slug === slug) ?? null;
}

export async function getWorkItems(): Promise<WorkItem[]> {
  const db = readClient();
  if (!db) return staticWork;

  const { data, error } = await db
    .from("work_items")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error || !data || data.length === 0) return staticWork;

  // The table has no column for an outward link, so it is carried over from
  // the content file by slug rather than lost the moment a row exists.
  const links = new Map(staticWork.map((w) => [w.slug, w.link]));

  return data.map((row) => ({
    slug: row.slug,
    title: row.title,
    category: (row.category ?? "Projects") as WorkCategory,
    summary: row.summary ?? "",
    date: row.date ?? "",
    link: links.get(row.slug),
  }));
}

export async function getPublications(): Promise<Publication[]> {
  const db = readClient();
  if (!db) return staticPublications;

  const { data, error } = await db
    .from("publications")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error || !data) return staticPublications;

  return data.map((row) => ({
    slug: row.slug,
    title: row.title,
    kind: (row.kind ?? "Other") as Publication["kind"],
    summary: row.summary ?? "",
    date: row.date ?? "",
    externalLink: row.external_link ?? null,
  }));
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const db = readClient();
  if (!db) return staticPosts;

  const { data, error } = await db
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error || !data || data.length === 0) return staticPosts;

  return data.map((row) => ({
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle ?? undefined,
    date: (row.published_at ?? row.created_at ?? "").slice(0, 10),
    category: row.category ?? "Notes",
    tags: row.tags ?? [],
    readingTime: row.reading_time ?? "",
    excerpt: row.excerpt ?? "",
    body: row.body ?? "",
    coverImage: row.cover_image_path ?? null,
  }));
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}
