import type { PrismaClient } from "@prisma/client";

import { ProductImportPipeline, type ProductImportReport } from "@/lib/ingestion/pipeline";
import { SyntheticProductProvider } from "@/lib/ingestion/providers";
import { PrismaProductImportRepository } from "@/lib/ingestion/repository";
import { SYNTHETIC_CATEGORY_TAXONOMY } from "@/lib/synthetic-catalog";

export async function refillSyntheticTaxonomy(prisma: PrismaClient): Promise<ProductImportReport> {
  await Promise.all(
    SYNTHETIC_CATEGORY_TAXONOMY.map((category) =>
      prisma.category.upsert({
        where: { slug: category.slug },
        update: {
          name: category.name,
          description: category.description,
          sortOrder: category.sortOrder,
          isActive: true,
        },
        create: {
          name: category.name,
          slug: category.slug,
          description: category.description,
          sortOrder: category.sortOrder,
          isActive: true,
        },
      }),
    ),
  );

  return {
    sourceName: "Kategori taksonomisi yenilendi",
    provider: "synthetic",
    totalRows: SYNTHETIC_CATEGORY_TAXONOMY.length,
    importedCount: SYNTHETIC_CATEGORY_TAXONOMY.length,
    skippedCount: 0,
    duplicateCount: 0,
    validationErrors: [],
  };
}

export async function resetSyntheticDemoCatalog(
  prisma: PrismaClient,
  options: { count?: number; seed?: string },
) {
  await refillSyntheticTaxonomy(prisma);
  await prisma.product.updateMany({
    where: { catalogSource: "synthetic" },
    data: { isActive: false },
  });

  const provider = new SyntheticProductProvider(options.count ?? 10_000, {
    seed: options.seed,
  });
  const repository = new PrismaProductImportRepository(prisma);
  const report = await new ProductImportPipeline(repository).import(provider);

  return {
    ...report,
    sourceName: "Demo kataloğu sıfırlandı ve yeniden üretildi",
  };
}
