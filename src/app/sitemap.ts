import type { MetadataRoute } from "next";
import { getBlogPosts, getResearchItems } from "@/lib/data";
import { siteUrl } from "@/lib/siteUrl";


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogPosts, researchItems] = await Promise.all([
    getBlogPosts(),
    getResearchItems(),
  ]);

  const staticRoutes = [
    "",
    "/about",
    "/work",
    "/work/iris",
    "/work/icd",
    "/work/recruitment",
    "/research",
    "/journal",
    "/the-highest-branch",
    "/contact",
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));

  const postRoutes = blogPosts.map((post) => ({
    url: `${siteUrl}/journal/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  const paperRoutes = researchItems.map((item) => ({
    url: `${siteUrl}/research/${item.slug}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...paperRoutes, ...postRoutes];
}
