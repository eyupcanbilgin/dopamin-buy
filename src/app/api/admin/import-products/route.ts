import { NextResponse, type NextRequest } from "next/server";
import { Prisma, type PrismaClient } from "@prisma/client";
import { z } from "zod";

import { createAdminAuditLog } from "@/lib/admin-audit";
import { requireAdmin } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";
import {
  refillSyntheticTaxonomy,
  resetSyntheticDemoCatalog,
} from "@/lib/ingestion/catalog-admin-actions";
import { ProductImportPipeline } from "@/lib/ingestion/pipeline";
import {
  CsvProductProvider,
  JsonProductProvider,
  SyntheticProductProvider,
  type ProductImportProvider,
} from "@/lib/ingestion/providers";
import { PrismaProductImportRepository } from "@/lib/ingestion/repository";
import type { ProductImportReport } from "@/lib/ingestion/pipeline";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const jsonRequestSchema = z.discriminatedUnion("sourceType", [
  z.object({
    sourceType: z.literal("json"),
    payload: z.union([z.string(), z.array(z.record(z.unknown())), z.record(z.unknown())]),
  }),
  z.object({
    sourceType: z.literal("synthetic"),
    count: z.coerce.number().int().min(1).max(10_000).default(10_000),
    seed: z.string().min(1).max(80).optional(),
  }),
  z.object({
    sourceType: z.literal("taxonomy"),
  }),
  z.object({
    sourceType: z.literal("reset-demo"),
    count: z.coerce.number().int().min(1).max(10_000).default(10_000),
    seed: z.string().min(1).max(80).optional(),
  }),
]);

type ImportRequestResult =
  | { provider: ProductImportProvider; report?: never }
  | { report: ProductImportReport; provider?: never };

export async function POST(request: NextRequest) {
  const adminError = requireAdmin(request);

  if (adminError) {
    return adminError;
  }

  try {
    const prisma = getPrisma();
    const result = await createImportResultFromRequest(request, prisma);

    if (result.report) {
      await recordImportResult(prisma, result.report);
      return NextResponse.json(result.report);
    }

    const repository = new PrismaProductImportRepository(prisma);
    const report = await new ProductImportPipeline(repository).import(result.provider);

    await recordImportResult(prisma, report);

    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Ürün içe aktarımı başarısız oldu.",
      },
      { status: 400 },
    );
  }
}

async function createImportResultFromRequest(
  request: NextRequest,
  prisma: ReturnType<typeof getPrisma>,
): Promise<ImportRequestResult> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const sourceType = String(formData.get("sourceType") || "");

    if (sourceType !== "csv") {
      throw new Error("Multipart import şimdilik yalnızca CSV kaynakları için desteklenir.");
    }

    const file = formData.get("file");

    if (!(file instanceof File)) {
      throw new Error("CSV import için dosya yüklenmeli.");
    }

    return { provider: new CsvProductProvider(await file.text(), file.name || "products.csv") };
  }

  const body = jsonRequestSchema.parse(await request.json());

  if (body.sourceType === "json") {
    return { provider: new JsonProductProvider(body.payload, "JSON ürün içe aktarımı") };
  }

  if (body.sourceType === "taxonomy") {
    return { report: await refillSyntheticTaxonomy(prisma) };
  }

  if (body.sourceType === "reset-demo") {
    return {
      report: await resetSyntheticDemoCatalog(prisma, {
        count: body.count,
        seed: body.seed,
      }),
    };
  }

  return { provider: new SyntheticProductProvider(body.count, { seed: body.seed }) };
}

async function recordImportResult(prisma: PrismaClient, report: ProductImportReport) {
  const errors = report.validationErrors.slice(0, 200) as Prisma.InputJsonValue;

  await prisma.$transaction(async (transaction) => {
    await transaction.productImportHistory.create({
      data: {
        source: report.sourceName,
        provider: report.provider,
        totalRows: report.totalRows,
        importedCount: report.importedCount,
        skippedCount: report.skippedCount,
        duplicateCount: report.duplicateCount,
        errors,
        metadata: {
          validationErrorCount: report.validationErrors.length,
        },
      },
    });

    await createAdminAuditLog(transaction, {
      action: "catalog_import",
      entityType: "ProductImportHistory",
      summary: `${report.sourceName}: ${report.importedCount} ürün işlendi, ${report.skippedCount} satır atlandı.`,
      metadata: {
        provider: report.provider,
        totalRows: report.totalRows,
        duplicateCount: report.duplicateCount,
        validationErrorCount: report.validationErrors.length,
      },
    });
  });
}
