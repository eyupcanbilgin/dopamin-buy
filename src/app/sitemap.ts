import type { MetadataRoute } from "next";

import { getCatalogCategories, getCatalogProducts } from "@/lib/catalog-db";
import { getGuidePages } from "@/lib/guides";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [categories, products] = await Promise.all([
    getCatalogCategories(),
    getCatalogProducts(50000),
  ]);
  const now = new Date();

  return [
    entry("/", now, "weekly", 1),
    entry("/shop", now, "daily", 0.9),
    entry("/rehber", now, "weekly", 0.8),
    entry("/yardim", now, "monthly", 0.7),
    ...getGuidePages().map((guide) =>
      entry(`/rehber/${guide.slug}`, new Date(guide.updatedAt), "monthly", 0.78),
    ),
    ...categories.map((category) =>
      entry(`/kategori/${category.slug}`, now, "daily", 0.74),
    ),
    ...products.map((product) =>
      entry(`/urun/${product.slug}`, now, "weekly", 0.58),
    ),
  ];
}

function entry(
  path: string,
  lastModified: Date,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number,
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  };
}
