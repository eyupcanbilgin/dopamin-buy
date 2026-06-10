import { NextResponse, type NextRequest } from "next/server";

import { requireAdmin } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const adminError = requireAdmin(request);

  if (adminError) {
    return adminError;
  }

  const prisma = getPrisma();
  const [
    totalProducts,
    productsWithoutImages,
    suspiciousPrices,
    duplicateGroups,
    distributionRows,
    categories,
    importHistory,
    auditLogs,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({
      where: {
        OR: [
          { images: { none: {} } },
          { images: { some: { url: { contains: "placehold.co", mode: "insensitive" } } } },
        ],
      },
    }),
    prisma.product.count({
      where: {
        OR: [
          { priceCents: { lte: 2_500 } },
          { priceCents: { gte: 25_000_000 } },
          { compareAtPriceCents: { lte: 0 } },
        ],
      },
    }),
    prisma.product.groupBy({
      by: ["name", "brandId", "categoryId"],
      _count: { _all: true },
    }),
    prisma.product.groupBy({
      by: ["categoryId"],
      _count: { _all: true },
    }),
    prisma.category.findMany({
      select: { id: true, name: true, slug: true },
    }),
    prisma.productImportHistory.findMany({
      orderBy: { createdAt: "desc" },
      take: 12,
      select: {
        id: true,
        source: true,
        provider: true,
        totalRows: true,
        importedCount: true,
        skippedCount: true,
        duplicateCount: true,
        errors: true,
        createdAt: true,
      },
    }),
    prisma.adminAuditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        action: true,
        entityType: true,
        entityId: true,
        summary: true,
        metadata: true,
        createdAt: true,
      },
    }),
  ]);

  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const duplicateCandidates = duplicateGroups
    .filter((group) => group._count._all > 1)
    .reduce((total, group) => total + group._count._all, 0);

  return NextResponse.json({
    metrics: {
      totalProducts,
      productsWithoutImages,
      duplicateCandidates,
      suspiciousPrices,
    },
    categoryDistribution: distributionRows
      .map((row) => {
        const category = categoryById.get(row.categoryId);

        return {
          categoryId: row.categoryId,
          name: category?.name ?? "Bilinmeyen kategori",
          slug: category?.slug ?? row.categoryId,
          count: row._count._all,
        };
      })
      .sort((a, b) => b.count - a.count),
    importHistory: importHistory.map((history) => ({
      ...history,
      createdAt: history.createdAt.toISOString(),
    })),
    auditLogs: auditLogs.map((log) => ({
      ...log,
      createdAt: log.createdAt.toISOString(),
    })),
  });
}
