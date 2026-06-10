import { timingSafeEqual } from "crypto";
import { NextResponse, type NextRequest } from "next/server";

export function requireAdmin(request: NextRequest) {
  const configuredKey = process.env.DOPAMIN_ADMIN_KEY;

  if (!configuredKey) {
    return NextResponse.json(
      {
        error:
          "Admin panel kapalı. DOPAMIN_ADMIN_KEY ortam değişkenini tanımladıktan sonra tekrar dene.",
      },
      { status: 503 },
    );
  }

  const providedKey = request.headers.get("x-dopamin-admin-key") || "";

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
