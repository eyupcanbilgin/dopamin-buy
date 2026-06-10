import { NextResponse, type NextRequest } from "next/server";

import { requireAdmin } from "@/lib/admin-auth";
import { getPrisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const adminError = requireAdmin(request);

  if (adminError) {
    return adminError;
  }

  const prisma = getPrisma();
  const [categories, brands, sourceRows] = await Promise.all([
    prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true, slug: true },
    }),
    prisma.brand.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    }),
    prisma.product.findMany({
      distinct: ["catalogSource"],
      orderBy: { catalogSource: "asc" },
      select: { catalogSource: true },
    }),
  ]);

  return NextResponse.json({
    categories,
    brands,
    sources: sourceRows.map((row) => row.catalogSource).filter(Boolean),
  });
}
