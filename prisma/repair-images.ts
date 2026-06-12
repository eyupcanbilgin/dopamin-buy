import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { createPlaceholderImageUrl } from "../src/lib/ingestion/normalization";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to repair Doply product images.");
}

const adapter = new PrismaPg(databaseUrl);
const prisma = new PrismaClient({ adapter });

async function main() {
  const productsWithoutImages = await prisma.product.findMany({
    where: {
      isActive: true,
      images: { none: {} },
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (productsWithoutImages.length === 0) {
    console.log("No active products without images found.");
    return;
  }

  await prisma.productImage.createMany({
    data: productsWithoutImages.map((product) => ({
      productId: product.id,
      url: createPlaceholderImageUrl(product.name),
      altText: `${product.name} sanal ürün görseli`,
      sortOrder: 0,
    })),
  });

  console.log(`Repaired ${productsWithoutImages.length} active products without images.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
