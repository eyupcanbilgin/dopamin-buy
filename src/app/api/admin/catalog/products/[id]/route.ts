import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";

import { createAdminAuditLog } from "@/lib/admin-audit";
import { requireAdmin } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";
import { slugifyTurkish } from "@/lib/slug";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const productUpdateSchema = z.object({
  name: z.string().trim().min(2).max(180),
  slug: z.string().trim().min(2).max(200).optional(),
  description: z.string().trim().min(10).max(4000),
  shortDescription: z.string().trim().min(5).max(500),
  categoryId: z.string().min(1),
  brandId: z.string().min(1),
  priceCents: z.coerce.number().int().min(1),
  compareAtPriceCents: z.coerce.number().int().min(1).nullable().optional(),
  discountPercentage: z.coerce.number().int().min(0).max(90).optional(),
  merchantName: z.string().trim().max(140).nullable().optional(),
  rating: z.coerce.number().min(0).max(5),
  reviewCount: z.coerce.number().int().min(0).max(1_000_000),
  dopamineScore: z.coerce.number().min(0).max(5),
  simulatedDeliveryEstimate: z.string().trim().max(140).nullable().optional(),
  images: z.array(z.string().trim().url()).max(12).default([]),
});

const routeParamsSchema = z.object({
  id: z.string().trim().min(1).max(120),
});

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  const adminError = requireAdmin(request);

  if (adminError) {
    return adminError;
  }

  const params = routeParamsSchema.safeParse(await context.params);

  if (!params.success) {
    return NextResponse.json({ error: "Ürün kimliği geçersiz." }, { status: 400 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = productUpdateSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Ürün düzenleme verisi geçersiz.",
        issues: parsed.error.issues,
      },
      { status: 400 },
    );
  }

  const { id } = params.data;
  const data = parsed.data;
  const prisma = getPrisma();
  const slug = slugifyTurkish(data.slug || data.name);
  const compareAtPriceCents = resolveCompareAtPrice(
    data.priceCents,
    data.compareAtPriceCents ?? null,
    data.discountPercentage ?? 0,
  );

  try {
    const product = await prisma.$transaction(async (transaction) => {
      const previous = await transaction.product.findUnique({
        where: { id },
        select: { id: true, name: true, slug: true },
      });

      if (!previous) {
        throw new Error("Ürün bulunamadı.");
      }

      const updated = await transaction.product.update({
        where: { id },
        data: {
          name: data.name,
          slug,
          description: data.description,
          shortDescription: data.shortDescription,
          categoryId: data.categoryId,
          brandId: data.brandId,
          priceCents: data.priceCents,
          compareAtPriceCents,
          merchantName: data.merchantName || null,
          rating: new Prisma.Decimal(data.rating.toFixed(1)),
          reviewCount: data.reviewCount,
          dopamineScore: new Prisma.Decimal(data.dopamineScore.toFixed(1)),
          simulatedDeliveryEstimate: data.simulatedDeliveryEstimate || null,
          searchKeywords: [
            data.name,
            slug,
            data.merchantName,
            data.simulatedDeliveryEstimate,
            "Doply",
            "sanal sipariş",
          ]
            .filter(Boolean)
            .join(" "),
        },
        include: {
          category: { select: { id: true, name: true, slug: true } },
          brand: { select: { id: true, name: true, slug: true } },
          images: { orderBy: { sortOrder: "asc" } },
        },
      });

      await transaction.productImage.deleteMany({ where: { productId: id } });

      if (data.images.length > 0) {
        await transaction.productImage.createMany({
          data: data.images.map((url, index) => ({
            productId: id,
            url,
            altText: `${data.name} sanal ürün görseli`,
            sortOrder: index,
          })),
        });
      }

      await createAdminAuditLog(transaction, {
        action: "product_update",
        entityType: "Product",
        entityId: id,
        summary: `${previous.name} katalog kaydı güncellendi.`,
        metadata: {
          previousSlug: previous.slug,
          nextSlug: slug,
          imageCount: data.images.length,
        },
      });

      return updated;
    });

    return NextResponse.json({
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        category: product.category,
        brand: product.brand,
        priceCents: product.priceCents,
        compareAtPriceCents: product.compareAtPriceCents,
        rating: Number(product.rating),
        dopamineScore: Number(product.dopamineScore),
        reviewCount: product.reviewCount,
        images: product.images,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Ürün güncellenemedi. Slug benzersiz olmalı ve kategori/marka geçerli olmalı.",
      },
      { status: 400 },
    );
  }
}

function resolveCompareAtPrice(
  priceCents: number,
  compareAtPriceCents: number | null,
  discountPercentage: number,
) {
  if (compareAtPriceCents && compareAtPriceCents > priceCents) {
    return compareAtPriceCents;
  }

  if (discountPercentage > 0) {
    return Math.round(priceCents / (1 - discountPercentage / 100));
  }

  return null;
}
