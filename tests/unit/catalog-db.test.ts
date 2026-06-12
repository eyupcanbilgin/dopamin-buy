import { beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = vi.hoisted(() => ({
  product: {
    count: vi.fn(),
    findMany: vi.fn(),
  },
}));

vi.mock("server-only", () => ({}));

vi.mock("@/lib/prisma", () => ({
  getPrisma: () => prismaMock,
}));

import { getCatalogProductPage } from "@/lib/catalog-db";

function createProductRecord(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: "product-1",
    slug: "ornek-urun",
    name: "Örnek Ürün",
    category: { id: "category-1", name: "Teknoloji", slug: "teknoloji" },
    brand: { id: "brand-1", name: "Doply Studio", slug: "doply-studio" },
    images: [{ id: "image-1", url: "https://placehold.co/900x675/png", altText: "Örnek", sortOrder: 0 }],
    priceCents: 12_990,
    compareAtPriceCents: 14_990,
    rating: 4.5,
    dopamineScore: 4.2,
    reviewCount: 120,
    merchantName: "Kadıköy Vitrin",
    simulatedDeliveryEstimate: "2-3 gün teslim simülasyonu",
    popularityScore: 88,
    stockFeelingLabel: "Acele yok",
    campaignLabel: "Sakin vitrin etiketi",
    shortDescription: "Kısa açıklama",
    description: "Uzun açıklama",
    ...overrides,
  };
}

describe("catalog DB pagination", () => {
  beforeEach(() => {
    prismaMock.product.count.mockReset();
    prismaMock.product.findMany.mockReset();
  });

  it("returns Prisma total count separately from the loaded page size", async () => {
    prismaMock.product.count.mockResolvedValue(10_000);
    prismaMock.product.findMany.mockResolvedValue([
      createProductRecord({ id: "product-1", slug: "urun-1" }),
      createProductRecord({ id: "product-2", slug: "urun-2" }),
    ]);

    const page = await getCatalogProductPage({ page: 3, pageSize: 48 });

    expect(page.totalCount).toBe(10_000);
    expect(page.totalPages).toBe(209);
    expect(page.page).toBe(3);
    expect(page.products).toHaveLength(2);
    expect(page.isFallback).toBe(false);
    expect(prismaMock.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 96,
        take: 48,
      }),
    );
  });

  it("clamps out-of-range pages before loading products", async () => {
    prismaMock.product.count.mockResolvedValue(50);
    prismaMock.product.findMany.mockResolvedValue([createProductRecord()]);

    const page = await getCatalogProductPage({ page: 999, pageSize: 24, categorySlug: "moda" });

    expect(page.page).toBe(3);
    expect(page.totalPages).toBe(3);
    expect(prismaMock.product.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 48,
        take: 24,
        where: {
          isActive: true,
          category: { slug: "moda" },
        },
      }),
    );
  });

  it("uses the fallback catalog only when the DB query fails", async () => {
    prismaMock.product.count.mockRejectedValue(new Error("database unavailable"));

    const page = await getCatalogProductPage({ page: 1, pageSize: 48 });

    expect(page.isFallback).toBe(true);
    expect(page.totalCount).toBeGreaterThan(0);
    expect(page.products.length).toBeGreaterThan(0);
  });
});
