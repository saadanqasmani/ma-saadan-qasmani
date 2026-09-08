import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/data";
import { siteUrl } from "@/lib/siteUrl";


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = await getBlogPosts();

  const staticRoutes = [
    "",
    "/about",
    "/work",
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

  return [...staticRoutes, ...postRoutes];
}
