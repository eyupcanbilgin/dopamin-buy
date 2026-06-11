import "server-only";

import { z } from "zod";

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DATABASE_URL: z.string().trim().url("DATABASE_URL geçerli bir PostgreSQL URL olmalı.").optional(),
    DOPLY_ADMIN_KEY: z.string().trim().min(16, "DOPLY_ADMIN_KEY en az 16 karakter olmalı.").optional(),
    NEXT_PUBLIC_SITE_URL: z.string().trim().url().default("http://localhost:3000"),
    NEXT_PUBLIC_DOPLY_PREMIUM_NO_ADS: z.enum(["true", "false"]).default("false"),
  })
  .superRefine((env, context) => {
    if (env.NODE_ENV === "production" && env.DOPLY_ADMIN_KEY === "change-me-before-importing") {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["DOPLY_ADMIN_KEY"],
        message: "Production/staging admin anahtarı varsayılan değer olamaz.",
      });
    }
  });

type AppEnv = z.infer<typeof envSchema>;

let cachedEnv: AppEnv | null = null;

export function getEnv() {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "ENV"}: ${issue.message}`)
      .join("; ");
    throw new Error(`Doply ortam değişkenleri geçersiz: ${message}`);
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}

export function getAdminKey() {
  return getEnv().DOPLY_ADMIN_KEY;
}

export function requireDatabaseUrl() {
  const databaseUrl = getEnv().DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for database access.");
  }

  return databaseUrl;
}
