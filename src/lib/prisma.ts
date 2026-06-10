import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  dopaminPrisma?: PrismaClient;
};

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for database access.");
  }

  const adapter = new PrismaPg(databaseUrl);
  return new PrismaClient({ adapter });
}

export function getPrisma() {
  if (process.env.NODE_ENV === "production") {
    return createPrismaClient();
  }

  globalForPrisma.dopaminPrisma ??= createPrismaClient();
  return globalForPrisma.dopaminPrisma;
}
