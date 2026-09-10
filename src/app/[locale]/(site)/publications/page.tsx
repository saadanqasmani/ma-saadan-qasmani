import { permanentRedirect } from "next/navigation";
import { defaultLocale, isLocale, localePath } from "@/lib/i18n/config";

/**
 * Archived. Publications never had entries of their own, and the work they
 * would have listed lives in the research archive. A redirect rather than a
 * deletion, so any link already in the wild still lands somewhere true.
 *
 * To bring the section back: restore the previous page from git history and
 * add its entry to src/content/nav.ts and src/app/sitemap.ts.
 */
export default async function PublicationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  // Lands in the language the visitor was already reading.
  permanentRedirect(localePath("/research", locale));
}
