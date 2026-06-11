import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to verify the Doply database.");
}

const DEFAULT_MIN_PRODUCTS = 10_000;
const DEFAULT_MIN_CATEGORIES = 12;
const DEFAULT_MIN_BRANDS = 1_000;

const adapter = new PrismaPg(databaseUrl);
const prisma = new PrismaClient({ adapter });

type CountRow = {
  count: bigint | number | string;
};

function readMinimum(value: string | undefined, fallback: number, variableName: string) {
  if (!value?.trim()) {
    return fallback;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error(`${variableName} must be a non-negative integer. Received: ${value}`);
  }

  return parsed;
}

function toNumber(value: bigint | number | string | undefined) {
  if (typeof value === "bigint") {
    return Number(value);
  }

  if (typeof value === "number") {
    return value;
  }

  return Number(value ?? 0);
}

function firstCount(rows: CountRow[]) {
  return toNumber(rows[0]?.count);
}

async function main() {
  const minProducts = readMinimum(
    process.env.DOPLY_VERIFY_MIN_PRODUCTS,
    DEFAULT_MIN_PRODUCTS,
    "DOPLY_VERIFY_MIN_PRODUCTS",
  );
  const minCategories = readMinimum(
    process.env.DOPLY_VERIFY_MIN_CATEGORIES,
    DEFAULT_MIN_CATEGORIES,
    "DOPLY_VERIFY_MIN_CATEGORIES",
  );
  const minBrands = readMinimum(
    process.env.DOPLY_VERIFY_MIN_BRANDS,
    DEFAULT_MIN_BRANDS,
    "DOPLY_VERIFY_MIN_BRANDS",
  );
  const minImages = readMinimum(
    process.env.DOPLY_VERIFY_MIN_IMAGES,
    minProducts,
    "DOPLY_VERIFY_MIN_IMAGES",
  );

  const [
    productCount,
    activeProductCount,
    categoryCount,
    activeCategoryCount,
    brandCount,
    productImageCount,
    missingPriceCount,
    activeProductsWithoutImages,
    duplicateSlugRows,
    missingCategoryRows,
    missingBrandRows,
    readableProducts,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.category.count(),
    prisma.category.count({ where: { isActive: true } }),
    prisma.brand.count(),
    prisma.productImage.count(),
    prisma.product.count({ where: { priceCents: { lte: 0 } } }),
    prisma.product.count({ where: { isActive: true, images: { none: {} } } }),
    prisma.$queryRaw<CountRow[]>`
      SELECT COUNT(*) AS count
      FROM (
        SELECT slug
        FROM "Product"
        GROUP BY slug
        HAVING COUNT(*) > 1
      ) duplicate_slugs
    `,
    prisma.$queryRaw<CountRow[]>`
      SELECT COUNT(*) AS count
      FROM "Product" product
      LEFT JOIN "Category" category ON category.id = product."categoryId"
      WHERE category.id IS NULL
    `,
    prisma.$queryRaw<CountRow[]>`
      SELECT COUNT(*) AS count
      FROM "Product" product
      LEFT JOIN "Brand" brand ON brand.id = product."brandId"
      WHERE brand.id IS NULL
    `,
    prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: true,
        brand: true,
        images: {
          orderBy: { sortOrder: "asc" },
          take: 1,
        },
      },
      orderBy: [{ popularityScore: "desc" }, { updatedAt: "desc" }, { name: "asc" }],
      take: 5,
    }),
  ]);

  const duplicateSlugCount = firstCount(duplicateSlugRows);
  const missingCategoryCount = firstCount(missingCategoryRows);
  const missingBrandCount = firstCount(missingBrandRows);
  const unreadableCatalogRows = readableProducts.filter(
    (product) => !product.category || !product.brand || product.images.length === 0,
  ).length;

  const summary = {
    productCount,
    activeProductCount,
    categoryCount,
    activeCategoryCount,
    brandCount,
    productImageCount,
    duplicateSlugCount,
    missingPriceCount,
    missingCategoryCount,
    missingBrandCount,
    activeProductsWithoutImages,
    readableCatalogSampleCount: readableProducts.length,
    sampleSlugs: readableProducts.map((product) => product.slug),
  };

  const failures: string[] = [];

  if (activeProductCount < minProducts) {
    failures.push(`active product count ${activeProductCount} is below expected minimum ${minProducts}`);
  }

  if (activeCategoryCount < minCategories) {
    failures.push(`active category count ${activeCategoryCount} is below expected minimum ${minCategories}`);
  }

  if (brandCount < minBrands) {
    failures.push(`brand count ${brandCount} is below expected minimum ${minBrands}`);
  }

  if (productImageCount < minImages) {
    failures.push(`product image count ${productImageCount} is below expected minimum ${minImages}`);
  }

  if (duplicateSlugCount > 0) {
    failures.push(`duplicate slug groups found: ${duplicateSlugCount}`);
  }

  if (missingPriceCount > 0) {
    failures.push(`products with missing or invalid price found: ${missingPriceCount}`);
  }

  if (missingCategoryCount > 0) {
    failures.push(`products with missing category relation found: ${missingCategoryCount}`);
  }

  if (missingBrandCount > 0) {
    failures.push(`products with missing brand relation found: ${missingBrandCount}`);
  }

  if (activeProductsWithoutImages > 0) {
    failures.push(`active products without images found: ${activeProductsWithoutImages}`);
  }

  if (readableProducts.length === 0 || unreadableCatalogRows > 0) {
    failures.push("catalog read query did not return fully readable product rows");
  }

  console.log(JSON.stringify(summary, null, 2));

  if (failures.length > 0) {
    throw new Error(`Doply database verification failed:\n- ${failures.join("\n- ")}`);
  }

  console.log("Doply database verification passed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
