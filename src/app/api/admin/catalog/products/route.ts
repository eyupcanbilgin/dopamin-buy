import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";

import { requireAdmin } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_PAGE_SIZE = 100;

export async function GET(request: NextRequest) {
  const adminError = requireAdmin(request);

  if (adminError) {
    return adminError;
  }

  const { searchParams } = new URL(request.url);
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const pageSize = Math.min(
    MAX_PAGE_SIZE,
    Math.max(10, Number(searchParams.get("pageSize") || 50)),
  );
  const where = createProductWhere(searchParams);
  const prisma = getPrisma();

  const [total, products] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: {
        category: { select: { id: true, name: true, slug: true } },
        brand: { select: { id: true, name: true, slug: true } },
        images: {
          orderBy: { sortOrder: "asc" },
          select: { id: true, url: true, altText: true, sortOrder: true },
        },
      },
      orderBy: [{ updatedAt: "desc" }, { name: "asc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json({
    page,
    pageSize,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription,
      category: product.category,
      brand: product.brand,
      priceCents: product.priceCents,
      compareAtPriceCents: product.compareAtPriceCents,
      discountPercentage: calculateDiscount(product.priceCents, product.compareAtPriceCents),
      merchantName: product.merchantName,
      rating: Number(product.rating),
      reviewCount: product.reviewCount,
      dopamineScore: Number(product.dopamineScore),
      simulatedDeliveryEstimate: product.simulatedDeliveryEstimate,
      catalogSource: product.catalogSource,
      isActive: product.isActive,
      images: product.images,
      missingImage: isMissingImage(product.images),
      invalidPrice: isInvalidPrice(product.priceCents, product.compareAtPriceCents),
      updatedAt: product.updatedAt.toISOString(),
    })),
  });
}

function createProductWhere(searchParams: URLSearchParams): Prisma.ProductWhereInput {
  const and: Prisma.ProductWhereInput[] = [];
  const search = searchParams.get("search")?.trim();
  const categoryId = searchParams.get("categoryId")?.trim();
  const brandId = searchParams.get("brandId")?.trim();
  const source = searchParams.get("source")?.trim();
  const missingImage = searchParams.get("missingImage") === "true";
  const invalidPrice = searchParams.get("invalidPrice") === "true";

  if (search) {
    and.push({
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { slug: { contains: search, mode: "insensitive" } },
        { searchKeywords: { contains: search, mode: "insensitive" } },
        { merchantName: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  if (categoryId) {
    and.push({ categoryId });
  }

  if (brandId) {
    and.push({ brandId });
  }

  if (source) {
    and.push({ catalogSource: source });
  }

  if (missingImage) {
    and.push({
      OR: [
        { images: { none: {} } },
        { images: { some: { url: { contains: "placehold.co", mode: "insensitive" } } } },
      ],
    });
  }

  if (invalidPrice) {
    and.push({
      OR: [
        { priceCents: { lte: 0 } },
        { compareAtPriceCents: { lte: 0 } },
      ],
    });
  }

  return and.length > 0 ? { AND: and } : {};
}

function calculateDiscount(priceCents: number, compareAtPriceCents: number | null) {
  if (!compareAtPriceCents || compareAtPriceCents <= priceCents) {
    return 0;
  }

  return Math.round(((compareAtPriceCents - priceCents) / compareAtPriceCents) * 100);
}

function isMissingImage(images: Array<{ url: string }>) {
  return (
    images.length === 0 ||
    images.some((image) => image.url.trim().length === 0 || image.url.includes("placehold.co"))
  );
}

function isInvalidPrice(priceCents: number, compareAtPriceCents: number | null) {
  return priceCents <= 0 || (compareAtPriceCents !== null && compareAtPriceCents <= 0);
}
