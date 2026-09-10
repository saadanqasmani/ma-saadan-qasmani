/**
 * The site's index, as routes rather than as words.
 *
 * Each entry carries a key into the dictionary instead of a label, because
 * the label depends on which language is being read. Paths stay in English
 * in every language: /work is /work, and the locale prefix is added when the
 * link is built.
 *
 * Publications is archived, not deleted: the route still redirects to the
 * research archive so nothing already linked or indexed goes to a 404, and
 * the admin resource stays in place for when the novel is actually listed.
 */
export const navLinks = [
  { key: "author", href: "/about" },
  { key: "work", href: "/work" },
  { key: "research", href: "/research" },
  { key: "journal", href: "/journal" },
  { key: "contact", href: "/contact" },
] as const;

export const novelLink = { key: "novelTitle", href: "/the-highest-branch" } as const;

export type NavKey = (typeof navLinks)[number]["key"] | (typeof novelLink)["key"];
