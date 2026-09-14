import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/siteUrl";


export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Belt as well as braces: the middleware already answers 404 to
        // an uncoded request for /taraki, so a crawler has nothing to index.
        // Naming it here keeps a well-behaved crawler from asking at all.
        disallow: ["/admin", "/taraki", "/ops"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
