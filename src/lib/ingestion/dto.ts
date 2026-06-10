import { z } from "zod";

import { cleanProductName, cleanText, parsePriceToKurus } from "@/lib/ingestion/normalization";

export type ProductImportRawRow = Record<string, unknown>;

const FIELD_ALIASES = {
  title: ["title", "name", "productName", "product_name", "urun_adi", "ürün adı", "Ürün Adı"],
  category: ["category", "categoryName", "category_name", "kategori", "Kategori"],
  price: ["price", "priceTRY", "price_try", "fiyat", "Fiyat", "fiyat_tl"],
  oldPrice: ["oldPrice", "compareAtPrice", "compare_at_price", "old_price", "eski_fiyat", "Eski Fiyat"],
  discountPercentage: ["discountPercentage", "discount_percentage", "indirim_orani", "İndirim Oranı"],
  imageUrl: ["imageUrl", "imageURL", "image", "image_url", "gorsel", "görsel", "Görsel"],
  brand: ["brand", "brandName", "brand_name", "marka", "Marka"],
  rating: ["rating", "score", "puan", "Puan"],
  reviewCount: ["reviewCount", "review_count", "yorum_sayisi", "Yorum Sayısı"],
  dopaminScore: ["dopaminScore", "dopamineScore", "dopamin_skoru", "Dopamin Skoru"],
  merchant: ["merchant", "seller", "store", "magaza", "mağaza", "Mağaza"],
  simulatedDeliveryEstimate: [
    "simulatedDeliveryEstimate",
    "deliveryEstimate",
    "delivery_estimate",
    "sanal_teslimat",
    "Sanal Teslimat",
  ],
  popularityScore: ["popularityScore", "popularity_score", "populerlik", "Popülerlik"],
  stockFeelingLabel: ["stockFeelingLabel", "stock_feeling_label", "stok_hissi", "Stok Hissi"],
  campaignLabel: ["campaignLabel", "campaign_label", "kampanya_etiketi", "Kampanya Etiketi"],
  catalogSource: ["catalogSource", "catalog_source", "kaynak", "Kaynak"],
  description: ["description", "aciklama", "açıklama", "Açıklama"],
  shortDescription: ["shortDescription", "short_description", "kisa_aciklama", "kısa açıklama"],
} as const;

type CanonicalImportInput = {
  title?: unknown;
  category?: unknown;
  price?: unknown;
  oldPrice?: unknown;
  discountPercentage?: unknown;
  imageUrl?: unknown;
  brand?: unknown;
  rating?: unknown;
  reviewCount?: unknown;
  dopaminScore?: unknown;
  merchant?: unknown;
  simulatedDeliveryEstimate?: unknown;
  popularityScore?: unknown;
  stockFeelingLabel?: unknown;
  campaignLabel?: unknown;
  catalogSource?: unknown;
  description?: unknown;
  shortDescription?: unknown;
};

function readAliasedField(row: ProductImportRawRow, aliases: readonly string[]) {
  for (const alias of aliases) {
    if (Object.prototype.hasOwnProperty.call(row, alias)) {
      return row[alias];
    }
  }

  const lowerCaseEntry = Object.entries(row).find(([key]) =>
    aliases.some((alias) => alias.toLocaleLowerCase("tr-TR") === key.toLocaleLowerCase("tr-TR")),
  );

  return lowerCaseEntry?.[1];
}

export function canonicalizeImportRow(row: ProductImportRawRow): CanonicalImportInput {
  return {
    title: readAliasedField(row, FIELD_ALIASES.title),
    category: readAliasedField(row, FIELD_ALIASES.category),
    price: readAliasedField(row, FIELD_ALIASES.price),
    oldPrice: readAliasedField(row, FIELD_ALIASES.oldPrice),
    discountPercentage: readAliasedField(row, FIELD_ALIASES.discountPercentage),
    imageUrl: readAliasedField(row, FIELD_ALIASES.imageUrl),
    brand: readAliasedField(row, FIELD_ALIASES.brand),
    rating: readAliasedField(row, FIELD_ALIASES.rating),
    reviewCount: readAliasedField(row, FIELD_ALIASES.reviewCount),
    dopaminScore: readAliasedField(row, FIELD_ALIASES.dopaminScore),
    merchant: readAliasedField(row, FIELD_ALIASES.merchant),
    simulatedDeliveryEstimate: readAliasedField(row, FIELD_ALIASES.simulatedDeliveryEstimate),
    popularityScore: readAliasedField(row, FIELD_ALIASES.popularityScore),
    stockFeelingLabel: readAliasedField(row, FIELD_ALIASES.stockFeelingLabel),
    campaignLabel: readAliasedField(row, FIELD_ALIASES.campaignLabel),
    catalogSource: readAliasedField(row, FIELD_ALIASES.catalogSource),
    description: readAliasedField(row, FIELD_ALIASES.description),
    shortDescription: readAliasedField(row, FIELD_ALIASES.shortDescription),
  };
}

const optionalCleanStringSchema = z.preprocess((value) => {
  if (value === null || value === undefined) {
    return undefined;
  }

  const text = String(value).trim();
  return text.length > 0 ? text : undefined;
}, z.string().transform(cleanText).optional());

const priceSchema = z.union([z.string(), z.number()]).transform((value, context) => {
  const priceCents = parsePriceToKurus(value);

  if (!priceCents) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Fiyat pozitif bir TL değeri olmalı.",
    });
    return z.NEVER;
  }

  return priceCents;
});

const optionalPriceSchema = z.preprocess((value) => {
  if (value === null || value === undefined || String(value).trim() === "") {
    return undefined;
  }

  return value;
}, priceSchema.optional());

const optionalIntegerSchema = (minimum: number, maximum: number) =>
  z.preprocess((value) => {
    if (value === null || value === undefined || String(value).trim() === "") {
      return undefined;
    }

    return Number(value);
  }, z.number().int().min(minimum).max(maximum).optional());

const optionalScoreSchema = (minimum: number, maximum: number) =>
  z.preprocess((value) => {
    if (value === null || value === undefined || String(value).trim() === "") {
      return undefined;
    }

    return Number(value);
  }, z.number().min(minimum).max(maximum).optional());

export const productImportSchema = z
  .object({
    title: z
      .string({ required_error: "Ürün adı zorunlu." })
      .min(2, "Ürün adı en az 2 karakter olmalı.")
      .transform(cleanProductName),
    category: z
      .string({ required_error: "Kategori zorunlu." })
      .min(2, "Kategori en az 2 karakter olmalı.")
      .transform(cleanText),
    price: priceSchema,
    oldPrice: optionalPriceSchema,
    discountPercentage: optionalIntegerSchema(0, 90),
    imageUrl: z.preprocess((value) => {
      if (value === null || value === undefined || String(value).trim() === "") {
        return undefined;
      }

      return String(value).trim();
    }, z.string().url("Görsel URL geçerli bir URL olmalı.").optional()),
    brand: optionalCleanStringSchema,
    rating: optionalScoreSchema(0, 5),
    reviewCount: optionalIntegerSchema(0, 1_000_000),
    dopaminScore: optionalScoreSchema(0, 5),
    merchant: optionalCleanStringSchema,
    simulatedDeliveryEstimate: optionalCleanStringSchema,
    popularityScore: optionalIntegerSchema(0, 100),
    stockFeelingLabel: optionalCleanStringSchema,
    campaignLabel: optionalCleanStringSchema,
    catalogSource: optionalCleanStringSchema,
    description: optionalCleanStringSchema,
    shortDescription: optionalCleanStringSchema,
  })
  .transform(({ price, oldPrice, ...data }) => ({
    ...data,
    priceCents: price,
    compareAtPriceCents: oldPrice && oldPrice > price ? oldPrice : undefined,
  }));

export type ProductImportDTO = z.infer<typeof productImportSchema>;

export function normalizeImportRow(row: ProductImportRawRow) {
  return productImportSchema.safeParse(canonicalizeImportRow(row));
}
