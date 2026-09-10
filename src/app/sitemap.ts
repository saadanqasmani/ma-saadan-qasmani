import type { MetadataRoute } from "next";
import { getBlogPosts, getResearchItems } from "@/lib/data";
import { locales, localeMeta, localePath } from "@/lib/i18n/config";
import { siteUrl } from "@/lib/siteUrl";

/**
 * Every page, in every language, each one naming the others.
 *
 * A translated page that no search engine knows about is a page nobody
 * reads. Listing each language and cross-linking them with hreflang is what
 * turns five prerendered copies into five findable ones, and it is what
 * tells Google that the Arabic page and the English page are the same page
 * rather than duplicates competing with each other.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogPosts, researchItems] = await Promise.all([
    getBlogPosts(),
    getResearchItems(),
  ]);

  const paths: { path: string; lastModified: Date }[] = [
    ...[
      "/",
      "/about",
      "/work",
      "/work/iris",
      "/work/icd",
      "/work/recruitment",
      "/research",
      "/journal",
      "/the-highest-branch",
      "/contact",
    ].map((path) => ({ path, lastModified: new Date() })),
    ...researchItems.map((item) => ({
      path: `/research/${item.slug}`,
      lastModified: new Date(),
    })),
    ...blogPosts.map((post) => ({
      path: `/journal/${post.slug}`,
      lastModified: new Date(post.date),
    })),
  ];

  return paths.flatMap(({ path, lastModified }) => {
    const languages = Object.fromEntries(
      locales.map((locale) => [localeMeta[locale].tag, `${siteUrl}${localePath(path, locale)}`])
    );

    return locales.map((locale) => ({
      url: `${siteUrl}${localePath(path, locale)}`,
      lastModified,
      alternates: { languages },
    }));
  });
}
