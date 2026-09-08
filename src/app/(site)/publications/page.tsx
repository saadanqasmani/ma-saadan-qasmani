import { permanentRedirect } from "next/navigation";

/**
 * Archived. Publications never had entries of their own, and the work they
 * would have listed lives in the research archive. A redirect rather than a
 * deletion, so any link already in the wild still lands somewhere true.
 *
 * To bring the section back: restore the previous page from git history and
 * add its entry to src/content/nav.ts and src/app/sitemap.ts.
 */
export default function PublicationsPage() {
  permanentRedirect("/research");
}
