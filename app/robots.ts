import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/data/costants";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = SITE_ORIGIN;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/auth/", "/admin/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
