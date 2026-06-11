import { NextResponse, type NextRequest } from "next/server";

export type RateLimitOptions = {
  keyPrefix: string;
  limit: number;
  windowMs: number;
};

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const globalForRateLimit = globalThis as unknown as {
  doplyRateLimitStore?: Map<string, RateLimitBucket>;
};

const store = globalForRateLimit.doplyRateLimitStore ?? new Map<string, RateLimitBucket>();
globalForRateLimit.doplyRateLimitStore = store;

export const adminApiRateLimit: RateLimitOptions = {
  keyPrefix: "admin-api",
  limit: 120,
  windowMs: 60_000,
};

export const adminImportRateLimit: RateLimitOptions = {
  keyPrefix: "admin-import",
  limit: 12,
  windowMs: 60_000,
};

export const publicMutationRateLimit: RateLimitOptions = {
  keyPrefix: "public-mutation",
  limit: 60,
  windowMs: 60_000,
};

export function rateLimitRequest(request: NextRequest, options: RateLimitOptions) {
  const now = Date.now();
  const key = `${options.keyPrefix}:${getClientKey(request)}`;
  const bucket = store.get(key);

  pruneExpiredBuckets(now);

  if (!bucket || bucket.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + options.windowMs });
    return null;
  }

  bucket.count += 1;

  if (bucket.count <= options.limit) {
    return null;
  }

  const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));

  return NextResponse.json(
    {
      error: "Çok fazla istek gönderildi. Lütfen kısa bir süre sonra tekrar dene.",
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
        "X-RateLimit-Limit": String(options.limit),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": String(Math.ceil(bucket.resetAt / 1000)),
      },
    },
  );
}

function getClientKey(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request.headers.get("x-real-ip")?.trim();
  const adminKey = request.headers.get("x-doply-admin-key") || "";
  const ip = forwardedFor || realIp || "unknown";

  return `${ip}:${adminKey ? hashString(adminKey) : "anon"}`;
}

function pruneExpiredBuckets(now: number) {
  if (store.size < 1_000) {
    return;
  }

  for (const [key, bucket] of store.entries()) {
    if (bucket.resetAt <= now) {
      store.delete(key);
    }
  }
}

function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (Math.imul(31, hash) + value.charCodeAt(index)) | 0;
  }

  return Math.abs(hash).toString(36);
}
