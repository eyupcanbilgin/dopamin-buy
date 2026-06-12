import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { normalizeImportRow, type ProductImportDTO } from "../src/lib/ingestion/dto";
import {
  DEFAULT_BRAND_NAME,
  cleanText,
  createDeduplicationKey,
  createProductSlug,
} from "../src/lib/ingestion/normalization";
import { createImportImages } from "../src/lib/ingestion/repository";
import { slugifyTurkish } from "../src/lib/slug";
import { generateSyntheticCatalog, SYNTHETIC_CATEGORY_TAXONOMY } from "../src/lib/synthetic-catalog";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed Doply.");
}

const DEFAULT_PRODUCT_COUNT = 10_000;
const DEFAULT_SEED_VALUE = "doply-staging-2026";
const MAX_SEED_PRODUCT_COUNT = 50_000;
const PRODUCTION_SITE_URLS = new Set(["https://doply.app", "https://www.doply.app"]);

const adapter = new PrismaPg(databaseUrl);
const prisma = new PrismaClient({ adapter });

function readPositiveInteger(value: string | undefined, fallback: number, variableName: string) {
  if (!value?.trim()) {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1 || parsed > MAX_SEED_PRODUCT_COUNT) {
    throw new Error(
      `${variableName} must be an integer between 1 and ${MAX_SEED_PRODUCT_COUNT}. Received: ${value}`,
    );
  }

  return parsed;
}

function normalize(value: string | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function assertSafeSeedTarget() {
  const deployEnv = normalize(process.env.DOPLY_DEPLOY_ENV);
  const vercelEnv = normalize(process.env.VERCEL_ENV);
  const siteUrl = normalize(process.env.NEXT_PUBLIC_SITE_URL).replace(/\/+$/, "");
  const productionLikeTarget =
    deployEnv === "production" ||
    vercelEnv === "production" ||
    PRODUCTION_SITE_URLS.has(siteUrl);

  if (!productionLikeTarget) {
    return;
  }

  const explicitlyAllowed = process.env.DOPLY_ALLOW_PRODUCTION_SEED === "true";
  const confirmation = process.env.DOPLY_SEED_CONFIRM === "production-reset";

  if (explicitlyAllowed && confirmation) {
    console.warn(
      "Doply production seed override enabled. Continuing because DOPLY_ALLOW_PRODUCTION_SEED=true and DOPLY_SEED_CONFIRM=production-reset were both provided.",
    );
    return;
  }

  throw new Error(
    [
      "Refusing to run Doply seed against a production-like environment.",
      "Seed resets the synthetic demo catalog and must stay manual and environment-specific.",
      "Use a Neon staging branch/database for normal seed runs.",
      "If this is an intentional production recovery, set both DOPLY_ALLOW_PRODUCTION_SEED=true and DOPLY_SEED_CONFIRM=production-reset.",
    ].join(" "),
  );
}

type PreparedSyntheticProduct = {
  dto: ProductImportDTO;
  slug: string;
  categorySlug: string;
  brandName: string;
  brandSlug: string;
};

function chunk<T>(items: T[], size: number) {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

function prepareSyntheticProducts(productCount: number, seedValue: string) {
  const rows = generateSyntheticCatalog({ count: productCount, seed: seedValue });
  const seen = new Set<string>();
  const prepared: PreparedSyntheticProduct[] = [];
  const validationErrors: Array<{ row: number; field: string; message: string }> = [];
  let duplicateCount = 0;

  rows.forEach((row, index) => {
    const parsed = normalizeImportRow(row);
    const rowNumber = index + 1;

    if (!parsed.success) {
      validationErrors.push(
        ...parsed.error.issues.map((issue) => ({
          row: rowNumber,
          field: issue.path.join(".") || "row",
          message: issue.message,
        })),
      );
      return;
    }

    const dto = parsed.data;
    const dedupeKey = createDeduplicationKey(dto.title, dto.brand, dto.category);

    if (seen.has(dedupeKey)) {
      duplicateCount += 1;
      return;
    }

    seen.add(dedupeKey);

    const brandName = cleanText(dto.brand || DEFAULT_BRAND_NAME);
    prepared.push({
      dto,
      slug: createProductSlug(dto.title, brandName, dto.category),
      categorySlug: slugifyTurkish(dto.category),
      brandName,
      brandSlug: slugifyTurkish(brandName),
    });
  });

  return {
    totalRows: rows.length,
    prepared,
    duplicateCount,
    validationErrors,
  };
}

async function seedSyntheticCatalogFast(productCount: number, seedValue: string) {
  const preparedResult = prepareSyntheticProducts(productCount, seedValue);
  const { prepared, duplicateCount, validationErrors, totalRows } = preparedResult;

  if (validationErrors.length > 0) {
    return {
      totalRows,
      importedCount: 0,
      skippedCount: totalRows,
      duplicateCount,
      validationErrors,
    };
  }

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

  const brandData = Array.from(
    prepared
      .reduce((map, product) => {
        map.set(product.brandSlug, {
          name: product.brandName,
          slug: product.brandSlug,
          description: `${product.brandName}, Doply katalog simülasyonu için yetkili veya sentetik kaynaklardan kullanılan marka adıdır.`,
          isFictional: true,
        });
        return map;
      }, new Map<string, Prisma.BrandCreateManyInput>())
      .values(),
  );

  for (const brandChunk of chunk(brandData, 1_000)) {
    await prisma.brand.createMany({
      data: brandChunk,
      skipDuplicates: true,
    });
  }

  const [categories, brands] = await Promise.all([
    prisma.category.findMany({
      where: { slug: { in: Array.from(new Set(prepared.map((product) => product.categorySlug))) } },
      select: { id: true, name: true, slug: true },
    }),
    prisma.brand.findMany({
      where: { slug: { in: Array.from(new Set(prepared.map((product) => product.brandSlug))) } },
      select: { id: true, name: true, slug: true },
    }),
  ]);

  const categoryBySlug = new Map(categories.map((category) => [category.slug, category]));
  const brandBySlug = new Map(brands.map((brand) => [brand.slug, brand]));
  const productData: Prisma.ProductCreateManyInput[] = [];

  for (const product of prepared) {
    const category = categoryBySlug.get(product.categorySlug);
    const brand = brandBySlug.get(product.brandSlug);

    if (!category || !brand) {
      validationErrors.push({
        row: productData.length + 1,
        field: "category/brand",
        message: `${product.dto.title} için kategori veya marka bulunamadı.`,
      });
      continue;
    }

    const description =
      product.dto.description ||
      `${product.dto.title}, Doply Sanal Sipariş deneyiminde gerçek ödeme veya teslimat oluşturmadan incelenen simülasyon ürünüdür.`;
    const shortDescription =
      product.dto.shortDescription ||
      `${category.name} kategorisinde güvenli sanal alışveriş hissi için katalog kaydı.`;
    const searchKeywords = [
      product.dto.title,
      category.name,
      brand.name,
      product.dto.merchant,
      product.dto.campaignLabel,
      "sanal sipariş",
      "simülasyon",
      "gerçek ödeme yok",
    ]
      .filter(Boolean)
      .join(" ");

    productData.push({
      categoryId: category.id,
      brandId: brand.id,
      name: product.dto.title,
      slug: product.slug,
      description,
      shortDescription,
      priceCents: product.dto.priceCents,
      compareAtPriceCents: product.dto.compareAtPriceCents ?? null,
      rating: new Prisma.Decimal((product.dto.rating ?? 4.4).toFixed(1)),
      dopamineScore: new Prisma.Decimal((product.dto.dopaminScore ?? 4.1).toFixed(1)),
      reviewCount: product.dto.reviewCount ?? (product.dto.rating ? 24 : 0),
      merchantName: product.dto.merchant ?? null,
      simulatedDeliveryEstimate: product.dto.simulatedDeliveryEstimate ?? null,
      popularityScore: product.dto.popularityScore ?? 50,
      stockFeelingLabel: product.dto.stockFeelingLabel ?? null,
      campaignLabel: product.dto.campaignLabel ?? null,
      catalogSource: product.dto.catalogSource || "synthetic",
      isActive: true,
      searchKeywords,
    });
  }

  for (const productChunk of chunk(productData, 500)) {
    await prisma.product.createMany({
      data: productChunk,
      skipDuplicates: true,
    });
  }

  const productSlugs = productData.map((product) => product.slug);

  for (const slugChunk of chunk(productSlugs, 1_000)) {
    await prisma.product.updateMany({
      where: { slug: { in: slugChunk } },
      data: {
        catalogSource: "synthetic",
        isActive: true,
      },
    });
  }

  const productIdsBySlug = new Map<string, string>();

  for (const slugChunk of chunk(productSlugs, 1_000)) {
    const records = await prisma.product.findMany({
      where: { slug: { in: slugChunk } },
      select: { id: true, slug: true },
    });

    records.forEach((record) => productIdsBySlug.set(record.slug, record.id));
  }

  const productIds = Array.from(productIdsBySlug.values());

  for (const idChunk of chunk(productIds, 1_000)) {
    await prisma.productImage.deleteMany({
      where: { productId: { in: idChunk } },
    });
  }

  const images: Prisma.ProductImageCreateManyInput[] = [];

  for (const product of prepared) {
    const productId = productIdsBySlug.get(product.slug);

    if (!productId) {
      continue;
    }

    images.push(
      ...createImportImages(product.dto).map((image, index) => ({
        productId,
        url: image.url,
        altText: image.altText,
        sortOrder: index,
      })),
    );
  }

  for (const imageChunk of chunk(images, 1_000)) {
    await prisma.productImage.createMany({
      data: imageChunk,
    });
  }

  return {
    totalRows,
    importedCount: prepared.length,
    skippedCount: totalRows - prepared.length + validationErrors.length,
    duplicateCount,
    validationErrors,
  };
}

async function seedSupportContent() {
  const adSlots: Prisma.AdSlotCreateManyInput[] = [
    {
      slug: "home-calm-break",
      placement: "HOMEPAGE_BANNER",
      name: "Ana sayfa sakin mola alanı",
      title: "Sepete bakmadan once bir nefes",
      body: "Bu alanda geri sayim, stok baskisi veya agresif kampanya yok. Istersen sepet hissini acele etmeden tamamla.",
      label: "Sponsorlu",
      ctaLabel: "Sepete bak",
      ctaHref: "/sepet",
      frequencyCap: 2,
      sortOrder: 1,
    },
    {
      slug: "category-mid-feed-calm",
      placement: "CATEGORY_MID_FEED",
      name: "Kategori ara reklam alani",
      title: "Sakin kesif alani",
      body: "Doply, urun kesfini gercek harcama yaratmadan deneyimlemek icin tasarlandi.",
      label: "Reklam",
      ctaLabel: "Nasıl calisir?",
      ctaHref: "/rehber/doply-nasil-calisir",
      frequencyCap: 2,
      sortOrder: 1,
    },
    {
      slug: "footer-ethical-note",
      placement: "FOOTER",
      name: "Footer etik bilgilendirme",
      title: "Gercek odeme yok",
      body: "Doply, Sanal Siparis deneyiminde kart bilgisi veya acik adres istemez.",
      label: "Sponsorlu",
      ctaLabel: "Etik ilkeler",
      ctaHref: "/etik-ilkeler",
      frequencyCap: 1,
      sortOrder: 1,
    },
  ];

  const contentPages: Prisma.ContentPageCreateManyInput[] = [
    {
      slug: "etik-ilkeler",
      type: "ETHICS",
      title: "Doply etik ilkeleri",
      excerpt: "Simulasyon, seffaflik ve harcamadan kapanis.",
      body: "Doply gercek odeme, teslimat, fatura veya ticari kayit olusturmaz. Platform alisveris durtusunu guvenli bir simulasyon alaninda tamamlamaya yardimci olur.",
      isPublished: true,
    },
    {
      slug: "yardim",
      type: "HELP",
      title: "Doply nasil calisir?",
      excerpt: "Sanal sepet, teslimat simulasyonu, odeme simulasyonu ve kapanis.",
      body: "Urunleri kesfeder, Sanal Siparis akisinda sepet hissini tamamlarsin. Kart bilgisi veya acik adres istenmez. Son ekranda kacinmis oldugun harcama gosterilir.",
      isPublished: true,
    },
    {
      slug: "gizlilik",
      type: "PRIVACY",
      title: "Gizlilik yaklasimi",
      excerpt: "Doply hassas odeme veya acik adres verisi toplamaz.",
      body: "Teslimat simulasyonu icin yalnizca sehir, ilce, adres tipi ve guvenli kurgusal adres bilgisi kullanilabilir. Gercek kart verisi saklanmaz.",
      isPublished: true,
    },
  ];

  await prisma.adSlot.createMany({ data: adSlots, skipDuplicates: true });
  await prisma.contentPage.createMany({ data: contentPages, skipDuplicates: true });
}

async function main() {
  assertSafeSeedTarget();

  const productCount = readPositiveInteger(
    process.env.DOPLY_SEED_PRODUCT_COUNT,
    DEFAULT_PRODUCT_COUNT,
    "DOPLY_SEED_PRODUCT_COUNT",
  );
  const seedValue = process.env.DOPLY_SEED_VALUE?.trim() || DEFAULT_SEED_VALUE;

  console.log(
    `Starting Doply seed with ${productCount.toLocaleString("tr-TR")} synthetic products (seed: ${seedValue}).`,
  );

  const report = await seedSyntheticCatalogFast(productCount, seedValue);

  await seedSupportContent();

  const [activeProductCount, categoryCount, brandCount, productImageCount] = await prisma.$transaction([
    prisma.product.count({ where: { isActive: true } }),
    prisma.category.count({ where: { isActive: true } }),
    prisma.brand.count(),
    prisma.productImage.count(),
  ]);

  const summary = {
    sourceName: "Demo kataloğu sıfırlandı ve yeniden üretildi",
    provider: "synthetic",
    totalRows: report.totalRows,
    importedCount: report.importedCount,
    skippedCount: report.skippedCount,
    duplicateCount: report.duplicateCount,
    validationErrorCount: report.validationErrors.length,
    activeProductCount,
    categoryCount,
    brandCount,
    productImageCount,
  };

  console.log(JSON.stringify(summary, null, 2));

  if (report.validationErrors.length > 0) {
    console.warn("Seed validation warnings:", report.validationErrors.slice(0, 10));
  }

  if (report.importedCount < productCount) {
    throw new Error(
      `Doply seed imported ${report.importedCount} products, expected ${productCount}. Skipped: ${report.skippedCount}.`,
    );
  }

  console.log("Doply seed completed successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
