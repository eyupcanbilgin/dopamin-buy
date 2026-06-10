import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";

import { createAdminAuditLog } from "@/lib/admin-audit";
import { requireAdmin } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bulkActionSchema = z.object({
  action: z.enum([
    "publish",
    "unpublish",
    "update-category",
    "regenerate-prices",
    "regenerate-dopamin-scores",
    "delete-selected",
  ]),
  productIds: z.array(z.string().min(1)).min(1).max(1000),
  categoryId: z.string().min(1).optional(),
  confirmation: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const adminError = requireAdmin(request);

  if (adminError) {
    return adminError;
  }

  const parsed = bulkActionSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Bulk işlem verisi geçersiz.", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { action, productIds, categoryId, confirmation } = parsed.data;
  const prisma = getPrisma();

  try {
    const result = await prisma.$transaction(async (transaction) => {
      if (action === "publish" || action === "unpublish") {
        const update = await transaction.product.updateMany({
          where: { id: { in: productIds } },
          data: { isActive: action === "publish" },
        });

        await createBulkAudit(transaction, action, productIds, update.count);
        return { affectedCount: update.count };
      }

      if (action === "update-category") {
        if (!categoryId) {
          throw new Error("Kategori güncellemesi için hedef kategori seçilmeli.");
        }

        const update = await transaction.product.updateMany({
          where: { id: { in: productIds } },
          data: { categoryId },
        });

        await createBulkAudit(transaction, action, productIds, update.count, { categoryId });
        return { affectedCount: update.count };
      }

      if (action === "regenerate-prices") {
        const products = await transaction.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true, priceCents: true },
        });

        await Promise.all(
          products.map((product) => {
            const nextPrice = regeneratePrice(product.id, product.priceCents);
            return transaction.product.update({
              where: { id: product.id },
              data: {
                priceCents: nextPrice,
                compareAtPriceCents: Math.round(nextPrice * 1.18),
              },
            });
          }),
        );

        await createBulkAudit(transaction, action, productIds, products.length);
        return { affectedCount: products.length };
      }

      if (action === "regenerate-dopamin-scores") {
        const products = await transaction.product.findMany({
          where: { id: { in: productIds } },
          select: { id: true },
        });

        await Promise.all(
          products.map((product) =>
            transaction.product.update({
              where: { id: product.id },
              data: { dopamineScore: new Prisma.Decimal(regenerateScore(product.id).toFixed(1)) },
            }),
          ),
        );

        await createBulkAudit(transaction, action, productIds, products.length);
        return { affectedCount: products.length };
      }

      if (confirmation !== "SIL") {
        throw new Error("Silme işlemi için onay alanına SIL yazılmalı.");
      }

      const deleted = await transaction.product.deleteMany({
        where: { id: { in: productIds } },
      });

      await createBulkAudit(transaction, action, productIds, deleted.count);
      return { affectedCount: deleted.count };
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Bulk işlem tamamlanamadı. Ürünler sepet veya simülasyon kayıtlarında kullanılıyor olabilir.",
      },
      { status: 400 },
    );
  }
}

async function createBulkAudit(
  transaction: Prisma.TransactionClient,
  action: string,
  productIds: string[],
  affectedCount: number,
  metadata: Record<string, unknown> = {},
) {
  await createAdminAuditLog(transaction, {
    action: `bulk_${action}`,
    entityType: "Product",
    summary: `${affectedCount} ürün için ${action} bulk işlemi uygulandı.`,
    metadata: {
      ...metadata,
      affectedCount,
      selectedCount: productIds.length,
      sampleProductIds: productIds.slice(0, 20),
    },
  });
}

function regeneratePrice(productId: string, currentPriceCents: number) {
  const seed = hashString(productId);
  const factor = 0.82 + (seed % 37) / 100;
  const nextPrice = Math.max(1_000, Math.round(currentPriceCents * factor));

  return Math.round(nextPrice / 10) * 10;
}

function regenerateScore(productId: string) {
  return 3.4 + (hashString(productId) % 16) / 10;
}

function hashString(value: string) {
  return value.split("").reduce((total, char) => total + char.charCodeAt(0), 0);
}
