import "server-only";
import { en } from "@/content/i18n/en";
import { brand, highestBranch } from "@/content/site";
import { mediaSets } from "@/content/media";
import { flatten, type Flat } from "@/lib/content/overrides";

/**
 * Everything on the site that is a string, listed once.
 *
 * Two trees: the dictionary, which is every label and sentence the interface
 * says, and the records, which are the words about the man and the book.
 * They are kept apart by a `content.` prefix on the second so one table can
 * hold both, and because that is exactly the shape the translation overlay
 * already has.
 *
 * The English values here are the defaults. The editor shows them as the
 * thing you are replacing, which means somebody working in Turkish can see
 * what the line is supposed to mean before rewriting it.
 */

export type Entry = {
  path: string;
  /** What the repository says, in English. The floor under every language. */
  original: string;
  /** Top-level grouping, for the sake of a page that can be walked. */
  section: string;
  /**
   * A picture is edited by choosing a file, not by typing, and it is the
   * same picture in every language, so it is filed under `*` rather than
   * under whichever language happened to be open.
   */
  kind: "text" | "image";
};

/** The sections, in the order they are worth editing. */
const ORDER = [
  "book",
  "media",
  "brand",
  "nav",
  "home",
  "novel",
  "forms",
  "detail",
  "journal",
  "research",
  "work",
  "contact",
  "footer",
];

function sectionOf(path: string): string {
  const head = path.split(".")[0];
  return head || "other";
}

/** Keys that hold a file rather than a sentence. */
const FILE_KEYS = ["src", "logo", "journalCover", "coverImage", "portrait", "image"];
const FILE_SUFFIX = /\.(png|jpe?g|webp|avif|gif|svg)$/i;

function isImage(path: string, value: string): boolean {
  const last = path.split(".").pop() ?? "";
  return FILE_KEYS.includes(last) || FILE_SUFFIX.test(value);
}

/**
 * Fields that name a shape in the code rather than something a reader sees:
 * `kind: "image" | "video"` decides which element is rendered, and typing
 * into it would break the gallery rather than edit it.
 */
const NOT_EDITABLE = [".kind"];

/**
 * Keys that hold an address the site is still waiting for — the Amazon
 * listing is the one that matters. They are kept even when empty, because an
 * empty one is precisely the field somebody opens this page to fill in.
 */
const LINK_KEYS = ["url", "externalLink", "doiOrLink", "link"];

export function catalogue(): Entry[] {
  const dictionary = flatten(en);
  // The records, addressed as themselves: the novel, every gallery on the
  // site, and the two drawings that are not attached to either. The person's
  // record is already editable under Site settings, which writes it to the
  // database, so it is not doubled up here. Blanks are kept, because a
  // gallery slot with no photograph in it is a slot worth filling.
  const records: Flat = flatten(
    { book: highestBranch, media: mediaSets, brand },
    "",
    {},
    true
  );

  const all: Entry[] = [];
  for (const [path, original] of Object.entries({ ...dictionary, ...records })) {
    if (typeof original !== "string") continue;
    if (NOT_EDITABLE.some((tail) => path.endsWith(tail))) continue;
    const kind = isImage(path, original) ? "image" : "text";
    // An empty sentence is a field with nothing to say; an empty picture
    // frame, or a link the site is waiting on, is the one thing somebody
    // came here to fill.
    const slot = kind === "image" || LINK_KEYS.includes(path.split(".").pop() ?? "");
    if (original.length === 0 && !slot) continue;
    all.push({ path, original, section: sectionOf(path), kind });
  }

  return all.sort((a, b) => {
    const ai = ORDER.indexOf(a.section);
    const bi = ORDER.indexOf(b.section);
    if (ai !== bi) return (ai < 0 ? 99 : ai) - (bi < 0 ? 99 : bi);
    return a.path.localeCompare(b.path);
  });
}

/** The sections present, in the order above. */
export function sections(entries: Entry[]): string[] {
  const seen: string[] = [];
  for (const e of entries) if (!seen.includes(e.section)) seen.push(e.section);
  return seen;
}
