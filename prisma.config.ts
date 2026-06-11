import { defineConfig } from "prisma/config";

// Generate only needs a syntactically valid URL; real DATABASE_URL is required at runtime.
const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://prisma:prisma@127.0.0.1:5432/doply?schema=public";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: databaseUrl,
  },
  migrations: {
    seed: "tsx prisma/seed.ts",
  },
});
