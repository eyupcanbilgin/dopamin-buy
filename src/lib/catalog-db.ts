import "server-only";

import type { Prisma } from "@prisma/client";

import {
  categories as fallbackCategories,
  getCategoryBySlug as getFallbackCategoryBySlug,
  getFeaturedProducts as getFallbackFeaturedProducts,
  getProductBySlug as getFallbackProductBySlug,
  getProductsByCategory as getFallbackProductsByCategory,
  getRelatedProducts as getFallbackRelatedProducts,
  products as fallbackProducts,
  type Category,
  type Product,
} from "@/lib/catalog";
import { getPrisma } from "@/lib/prisma";
import { SYNTHETIC_CATEGORY_TAXONOMY } from "@/lib/synthetic-catalog";

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    brand: true;
    category: true;
    images: {
      orderBy: {
        sortOrder: "asc";
      };
    };
  };
}>;

export async function getCatalogCategories(): Promise<Category[]> {
  return withCatalogFallback(async () => {
    const prisma = getPrisma();
    const records = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });

    if (records.length === 0) {
      return fallbackCategories;
    }

    return records.map((category, index) => {
      const syntheticCategory = SYNTHETIC_CATEGORY_TAXONOMY.find((item) => item.slug === category.slug);
      const fallback =
        getFallbackCategoryBySlug(category.slug) ?? fallbackCategories[index % fallbackCategories.length];

      return {
        slug: category.slug,
        name: category.name,
        description: category.description || fallback.description,
        accent: syntheticCategory?.accent ?? fallback.accent,
        image: syntheticCategory?.image ?? fallback.image,
      };
    });
  }, fallbackCategories);
}

export async function getCatalogCategoryBySlug(slug: string): Promise<Category | undefined> {
  const categories = await getCatalogCategories();
  return categories.find((category) => category.slug === slug);
}

export async function getCatalogProducts(limit = 120): Promise<Product[]> {
  return withCatalogFallback(async () => {
    const prisma = getPrisma();
    const records = await prisma.product.findMany({
      where: { isActive: true },
      include: productInclude,
      orderBy: [{ popularityScore: "desc" }, { updatedAt: "desc" }, { name: "asc" }],
      take: limit,
    });

    return records.length > 0 ? records.map(mapPrismaProduct) : fallbackProducts;
  }, fallbackProducts);
}

export async function getCatalogFeaturedProducts(): Promise<Product[]> {
  const products = await getCatalogProducts(8);
  return products.length > 0 ? products.slice(0, 8) : getFallbackFeaturedProducts();
}

export async function getCatalogProductsByCategory(slug: string, limit = 120): Promise<Product[]> {
  return withCatalogFallback(async () => {
    const prisma = getPrisma();
    const records = await prisma.product.findMany({
      where: {
        isActive: true,
        category: { slug },
      },
      include: productInclude,
      orderBy: [{ popularityScore: "desc" }, { updatedAt: "desc" }, { name: "asc" }],
      take: limit,
    });

    return records.map(mapPrismaProduct);
  }, getFallbackProductsByCategory(slug));
}

export async function getCatalogProductBySlug(slug: string): Promise<Product | undefined> {
  return withCatalogFallback(async () => {
    const prisma = getPrisma();
    const record = await prisma.product.findFirst({
      where: { slug, isActive: true },
      include: productInclude,
    });

    return record ? mapPrismaProduct(record) : undefined;
  }, getFallbackProductBySlug(slug));
}

export async function getCatalogRelatedProducts(product: Product): Promise<Product[]> {
  return withCatalogFallback(async () => {
    const related = await getCatalogProductsByCategory(product.category, 8);
    return related.filter((item) => item.id !== product.id).slice(0, 4);
  }, getFallbackRelatedProducts(product));
}

const productInclude = {
  brand: true,
  category: true,
  images: {
    orderBy: {
      sortOrder: "asc" as const,
    },
  },
};

function mapPrismaProduct(product: ProductWithRelations): Product {
  const gallery = product.images.length > 0
    ? product.images.map((image) => image.url)
    : [`https://placehold.co/900x675/F7F1E8/243047/png?text=${encodeURIComponent(product.name)}`];
  const price = Math.round(product.priceCents / 100);
  const compareAtPrice = product.compareAtPriceCents
    ? Math.round(product.compareAtPriceCents / 100)
    : undefined;
  const discountPercentage = compareAtPrice
    ? Math.max(1, Math.round(((compareAtPrice - price) / compareAtPrice) * 100))
    : undefined;

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    category: product.category.slug,
    price,
    compareAtPrice,
    rating: Number(product.rating),
    reviewCount: product.reviewCount,
    dopaminScore: Number(product.dopamineScore),
    merchantName: product.merchantName ?? undefined,
    simulatedDeliveryEstimate: product.simulatedDeliveryEstimate ?? undefined,
    popularityScore: product.popularityScore,
    stockFeelingLabel: product.stockFeelingLabel ?? undefined,
    campaignLabel: product.campaignLabel ?? undefined,
    discountPercentage,
    image: gallery[0],
    gallery,
    shortDescription: product.shortDescription,
    description: product.description,
    tags: [product.campaignLabel ?? "Sepet avantajı", product.stockFeelingLabel ?? "Acele yok"],
    specs: [
      `${product.category.name} kategorisi`,
      `${product.brand.name} marka kaydı`,
      product.merchantName ? `${product.merchantName} sanal mağazası` : "Kurgusal mağaza kaydı",
      product.simulatedDeliveryEstimate ?? "Teslimat simülasyonu",
      "Yetkili veya sentetik katalog verisi",
    ],
    reflection: "Bu isteğin geçmesi için ürünü gerçekten satın almak zorunda mısın?",
  };
}

async function withCatalogFallback<T>(callback: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await callback();
  } catch {
    return fallback;
  }
}
