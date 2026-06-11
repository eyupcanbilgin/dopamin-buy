import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { requireDatabaseUrl } from "@/lib/env";

const globalForPrisma = globalThis as unknown as {
  doplyPrisma?: PrismaClient;
};

function createPrismaClient() {
  const adapter = new PrismaPg(requireDatabaseUrl());
  return new PrismaClient({ adapter });
}

export function getPrisma() {
  if (process.env.NODE_ENV === "production") {
    return createPrismaClient();
  }

  globalForPrisma.doplyPrisma ??= createPrismaClient();
  return globalForPrisma.doplyPrisma;
}
