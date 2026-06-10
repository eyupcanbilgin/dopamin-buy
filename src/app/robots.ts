import type { MetadataRoute } from "next";

import { absoluteUrl, siteConfig } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/shop", "/kategori/", "/urun/", "/rehber/", "/yardim"],
        disallow: [
          "/admin/",
          "/api/",
          "/checkout/",
          "/dashboard",
          "/sepet",
          "/siparis-takip",
        ],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}
