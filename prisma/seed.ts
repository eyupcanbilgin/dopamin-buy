import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { resetSyntheticDemoCatalog } from "../src/lib/ingestion/catalog-admin-actions";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed Doply.");
}

const DEFAULT_PRODUCT_COUNT = 10_000;
const DEFAULT_SEED_VALUE = "doply-staging-2026";
const MAX_SEED_PRODUCT_COUNT = 50_000;

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
  const productCount = readPositiveInteger(
    process.env.DOPLY_SEED_PRODUCT_COUNT,
    DEFAULT_PRODUCT_COUNT,
    "DOPLY_SEED_PRODUCT_COUNT",
  );
  const seedValue = process.env.DOPLY_SEED_VALUE?.trim() || DEFAULT_SEED_VALUE;

  console.log(
    `Starting Doply seed with ${productCount.toLocaleString("tr-TR")} synthetic products (seed: ${seedValue}).`,
  );

  const report = await resetSyntheticDemoCatalog(prisma, {
    count: productCount,
    seed: seedValue,
  });

  await seedSupportContent();

  const [activeProductCount, categoryCount, brandCount, productImageCount] = await prisma.$transaction([
    prisma.product.count({ where: { isActive: true } }),
    prisma.category.count({ where: { isActive: true } }),
    prisma.brand.count(),
    prisma.productImage.count(),
  ]);

  const summary = {
    sourceName: report.sourceName,
    provider: report.provider,
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
