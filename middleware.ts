import { NextResponse, type NextRequest } from "next/server";

const ADMIN_REALM = "Doply Admin";

export function middleware(request: NextRequest) {
  const adminKey = process.env.DOPLY_ADMIN_KEY;

  if (!adminKey) {
    return NextResponse.json(
      { error: "Admin route kapalı. DOPLY_ADMIN_KEY ortam değişkeni gerekli." },
      { status: 503, headers: noStoreHeaders() },
    );
  }

  const password = readBasicAuthPassword(request.headers.get("authorization"));

  if (!password || !safeCompare(password, adminKey)) {
    return new NextResponse("Doply admin alanı için yetki gerekli.", {
      status: 401,
      headers: {
        ...noStoreHeaders(),
        "WWW-Authenticate": `Basic realm="${ADMIN_REALM}", charset="UTF-8"`,
      },
    });
  }

  const response = NextResponse.next();
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};

function readBasicAuthPassword(header: string | null) {
  if (!header?.startsWith("Basic ")) {
    return null;
  }

  try {
    const decoded = atob(header.slice("Basic ".length));
    const separatorIndex = decoded.indexOf(":");
    return separatorIndex >= 0 ? decoded.slice(separatorIndex + 1) : null;
  } catch {
    return null;
  }
}

function safeCompare(a: string, b: string) {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;

  for (let index = 0; index < a.length; index += 1) {
    result |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }

  return result === 0;
}

function noStoreHeaders() {
  return {
    "Cache-Control": "no-store",
    "X-Robots-Tag": "noindex, nofollow",
  };
}
