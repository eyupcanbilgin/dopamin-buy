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
import { getSafeProductGallery } from "@/lib/product-image";
import { SYNTHETIC_CATEGORY_TAXONOMY } from "@/lib/synthetic-catalog";

const DEFAULT_PUBLIC_PAGE_SIZE = 48;
const MAX_PUBLIC_PAGE_SIZE = 96;

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

export type CatalogProductPage = {
  products: Product[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  isFallback: boolean;
};

export type CatalogProductPageOptions = {
  page?: number;
  pageSize?: number;
  categorySlug?: string;
};

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
  const page = await getCatalogProductPage({ page: 1, pageSize: limit });
  return page.products;
}

export async function getCatalogFeaturedProducts(): Promise<Product[]> {
  const products = await getCatalogProducts(8);
  return products.length > 0 ? products.slice(0, 8) : getFallbackFeaturedProducts();
}

export async function getCatalogProductsByCategory(slug: string, limit = 120): Promise<Product[]> {
  const page = await getCatalogProductPage({ page: 1, pageSize: limit, categorySlug: slug });
  return page.products;
}

export async function getCatalogProductPage({
  page = 1,
  pageSize = DEFAULT_PUBLIC_PAGE_SIZE,
  categorySlug,
}: CatalogProductPageOptions = {}): Promise<CatalogProductPage> {
  const safePage = sanitizePage(page);
  const safePageSize = sanitizePageSize(pageSize);
  const fallback = createFallbackProductPage({
    page: safePage,
    pageSize: safePageSize,
    categorySlug,
  });

  return withCatalogFallback(async () => {
    const prisma = getPrisma();
    const where: Prisma.ProductWhereInput = {
      isActive: true,
      ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    };
    const totalCount = await prisma.product.count({ where });

    if (totalCount === 0 && !categorySlug) {
      return fallback;
    }

    const totalPages = Math.max(1, Math.ceil(totalCount / safePageSize));
    const clampedPage = Math.min(safePage, totalPages);
    const records = await prisma.product.findMany({
      where,
      include: productInclude,
      orderBy: [{ popularityScore: "desc" }, { updatedAt: "desc" }, { name: "asc" }],
      skip: (clampedPage - 1) * safePageSize,
      take: safePageSize,
    });

    return {
      products: records.map(mapPrismaProduct),
      totalCount,
      totalPages,
      page: clampedPage,
      pageSize: safePageSize,
      isFallback: false,
    };
  }, fallback);
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
  const gallery = getSafeProductGallery(product.images.map((image) => image.url), product.name);
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

function createFallbackProductPage({
  page,
  pageSize,
  categorySlug,
}: {
  page: number;
  pageSize: number;
  categorySlug?: string;
}): CatalogProductPage {
  const source = categorySlug ? getFallbackProductsByCategory(categorySlug) : fallbackProducts;
  const totalPages = Math.max(1, Math.ceil(source.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    products: source.slice(start, start + pageSize),
    totalCount: source.length,
    totalPages,
    page: safePage,
    pageSize,
    isFallback: true,
  };
}

function sanitizePage(value: number) {
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 1;
}

function sanitizePageSize(value: number) {
  if (!Number.isFinite(value)) {
    return DEFAULT_PUBLIC_PAGE_SIZE;
  }

  return Math.min(MAX_PUBLIC_PAGE_SIZE, Math.max(12, Math.floor(value)));
}
