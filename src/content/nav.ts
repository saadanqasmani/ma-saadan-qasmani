/**
 * Publications is archived, not deleted: the route still redirects to the
 * research archive so nothing already linked or indexed goes to a 404, and
 * the admin resource stays in place for when the novel is actually listed.
 */
export const navLinks = [
  { label: "The Author", href: "/about" },
  { label: "The Work", href: "/work" },
  { label: "Research", href: "/research" },
  { label: "The Journal", href: "/journal" },
  { label: "Correspondence", href: "/contact" },
] as const;

export const novelLink = { label: "The Highest Branch", href: "/the-highest-branch" } as const;
