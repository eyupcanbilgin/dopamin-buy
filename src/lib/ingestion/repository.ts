import { Prisma, type PrismaClient } from "@prisma/client";

import type { ProductImportDTO } from "@/lib/ingestion/dto";
import {
  DEFAULT_BRAND_NAME,
  cleanText,
  createPlaceholderImageUrl,
} from "@/lib/ingestion/normalization";
import { slugifyTurkish } from "@/lib/slug";

export type UpsertedCatalogRecord = {
  id: string;
  name: string;
  slug: string;
};

export type UpsertProductInput = {
  dto: ProductImportDTO;
  slug: string;
  category: UpsertedCatalogRecord;
  brand: UpsertedCatalogRecord;
};

export interface ProductImportRepository {
  upsertCategory(name: string): Promise<UpsertedCatalogRecord>;
  upsertBrand(name?: string): Promise<UpsertedCatalogRecord>;
  upsertProduct(input: UpsertProductInput): Promise<{ id: string }>;
  replaceProductImages(productId: string, images: Array<{ url: string; altText: string }>): Promise<void>;
}

export class PrismaProductImportRepository implements ProductImportRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async upsertCategory(name: string) {
    const cleanedName = cleanText(name);
    const slug = slugifyTurkish(cleanedName);

    return this.prisma.category.upsert({
      where: { slug },
      update: { name: cleanedName, isActive: true },
      create: {
        name: cleanedName,
        slug,
        description: `${cleanedName} kategorisinde sanal ürün keşifleri.`,
        isActive: true,
      },
      select: { id: true, name: true, slug: true },
    });
  }

  async upsertBrand(name?: string) {
    const cleanedName = cleanText(name || DEFAULT_BRAND_NAME);
    const slug = slugifyTurkish(cleanedName);

    return this.prisma.brand.upsert({
      where: { slug },
      update: {
        name: cleanedName,
        isFictional: true,
      },
      create: {
        name: cleanedName,
        slug,
        description: `${cleanedName}, Dopamin katalog simülasyonu için yetkili veya sentetik kaynaklardan kullanılan marka adıdır.`,
        isFictional: true,
      },
      select: { id: true, name: true, slug: true },
    });
  }

  async upsertProduct({ dto, slug, category, brand }: UpsertProductInput) {
    const description =
      dto.description ||
      `${dto.title}, Dopamin Sanal Sipariş deneyiminde gerçek ödeme veya teslimat oluşturmadan incelenen simülasyon ürünüdür.`;
    const shortDescription =
      dto.shortDescription ||
      `${category.name} kategorisinde güvenli sanal alışveriş hissi için katalog kaydı.`;
    const rating = new Prisma.Decimal((dto.rating ?? 4.4).toFixed(1));
    const dopamineScore = new Prisma.Decimal((dto.dopaminScore ?? 4.1).toFixed(1));
    const searchKeywords = [
      dto.title,
      category.name,
      brand.name,
      dto.merchant,
      dto.campaignLabel,
      "sanal sipariş",
      "simülasyon",
      "gerçek ödeme yok",
    ]
      .filter(Boolean)
      .join(" ");

    const product = await this.prisma.product.upsert({
      where: { slug },
      update: {
        categoryId: category.id,
        brandId: brand.id,
        name: dto.title,
        description,
        shortDescription,
        priceCents: dto.priceCents,
        compareAtPriceCents: dto.compareAtPriceCents ?? null,
        rating,
        dopamineScore,
        reviewCount: dto.reviewCount ?? (dto.rating ? 24 : 0),
        merchantName: dto.merchant ?? null,
        simulatedDeliveryEstimate: dto.simulatedDeliveryEstimate ?? null,
        popularityScore: dto.popularityScore ?? 50,
        stockFeelingLabel: dto.stockFeelingLabel ?? null,
        campaignLabel: dto.campaignLabel ?? null,
        catalogSource: dto.catalogSource || "import",
        isActive: true,
        searchKeywords,
      },
      create: {
        categoryId: category.id,
        brandId: brand.id,
        name: dto.title,
        slug,
        description,
        shortDescription,
        priceCents: dto.priceCents,
        compareAtPriceCents: dto.compareAtPriceCents ?? null,
        rating,
        dopamineScore,
        reviewCount: dto.reviewCount ?? (dto.rating ? 24 : 0),
        merchantName: dto.merchant ?? null,
        simulatedDeliveryEstimate: dto.simulatedDeliveryEstimate ?? null,
        popularityScore: dto.popularityScore ?? 50,
        stockFeelingLabel: dto.stockFeelingLabel ?? null,
        campaignLabel: dto.campaignLabel ?? null,
        catalogSource: dto.catalogSource || "import",
        isActive: true,
        searchKeywords,
      },
      select: { id: true },
    });

    return product;
  }

  async replaceProductImages(
    productId: string,
    images: Array<{ url: string; altText: string }>,
  ) {
    await this.prisma.productImage.deleteMany({ where: { productId } });

    if (images.length === 0) {
      return;
    }

    await this.prisma.productImage.createMany({
      data: images.map((image, index) => ({
        productId,
        url: image.url,
        altText: image.altText,
        sortOrder: index,
      })),
    });
  }
}

export function createImportImages(dto: ProductImportDTO) {
  return [
    {
      url: dto.imageUrl || createPlaceholderImageUrl(dto.title),
      altText: `${dto.title} sanal ürün görseli`,
    },
  ];
}
