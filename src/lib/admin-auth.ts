import { timingSafeEqual } from "crypto";
import { NextResponse, type NextRequest } from "next/server";

import { getAdminKey } from "@/lib/env";
import { adminApiRateLimit, rateLimitRequest, type RateLimitOptions } from "@/lib/rate-limit";

type AdminGuardOptions = {
  rateLimit?: RateLimitOptions | false;
};

export function requireAdmin(request: NextRequest, options: AdminGuardOptions = {}) {
  const rateLimit = options.rateLimit === undefined ? adminApiRateLimit : options.rateLimit;
  const rateLimitError = rateLimit ? rateLimitRequest(request, rateLimit) : null;

  if (rateLimitError) {
    return rateLimitError;
  }

  const configuredKey = getAdminKey();

  if (!configuredKey) {
    return NextResponse.json(
      {
        error:
          "Admin panel kapalı. DOPLY_ADMIN_KEY ortam değişkenini tanımladıktan sonra tekrar dene.",
      },
      { status: 503 },
    );
  }

  const providedKey = request.headers.get("x-doply-admin-key") || "";

  if (!safeCompare(providedKey, configuredKey)) {
    return NextResponse.json(
      { error: "Bu admin işlemi yalnızca yetkili admin anahtarıyla yapılabilir." },
      { status: 401 },
    );
  }

  return null;
}

function safeCompare(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return timingSafeEqual(aBuffer, bBuffer);
}
