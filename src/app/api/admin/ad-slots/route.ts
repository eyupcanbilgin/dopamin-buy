import type { AdSlotPlacement } from "@prisma/client";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/lib/admin-auth";
import { createAdminAuditLog } from "@/lib/admin-audit";
import { adPlacementOptions, getAdPlacementById } from "@/lib/ad-config";
import { optionalAdHrefSchema } from "@/lib/ad-validation";
import { getPrisma } from "@/lib/prisma";
import { slugifyTurkish } from "@/lib/slug";

const placementIds = adPlacementOptions.map((placement) => placement.id) as [
  (typeof adPlacementOptions)[number]["id"],
  ...(typeof adPlacementOptions)[number]["id"][],
];

const adSlotSchema = z.object({
  name: z.string().min(2).max(80),
  placement: z.enum(placementIds),
  title: z.string().min(2).max(120),
  body: z.string().min(2).max(280),
  label: z.enum(["Reklam", "Sponsorlu"]).default("Sponsorlu"),
  sponsorName: z.string().max(80).optional().nullable(),
  ctaLabel: z.string().max(40).optional().nullable(),
  ctaHref: optionalAdHrefSchema,
  frequencyCap: z.coerce.number().int().min(0).max(24).default(3),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
});

export async function GET(request: NextRequest) {
  const unauthorized = requireAdmin(request);

  if (unauthorized) {
    return unauthorized;
  }

  const prisma = getPrisma();
  const slots = await prisma.adSlot.findMany({
    orderBy: [{ placement: "asc" }, { sortOrder: "asc" }, { updatedAt: "desc" }],
  });

  return NextResponse.json({
    placements: adPlacementOptions,
    slots: slots.map((slot) => ({
      id: slot.id,
      slug: slot.slug,
      name: slot.name || slot.slug,
      placement: slot.placement,
      title: slot.title,
      body: slot.body,
      label: slot.label,
      sponsorName: slot.sponsorName,
      ctaLabel: slot.ctaLabel,
      ctaHref: slot.ctaHref,
      frequencyCap: slot.frequencyCap,
      isActive: slot.isActive,
      sortOrder: slot.sortOrder,
      updatedAt: slot.updatedAt.toISOString(),
    })),
  });
}

export async function POST(request: NextRequest) {
  const unauthorized = requireAdmin(request);

  if (unauthorized) {
    return unauthorized;
  }

  const payload = await request.json().catch(() => null);
  const parsed = adSlotSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Reklam alanı bilgileri geçersiz.",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const placement = getAdPlacementById(parsed.data.placement);

  if (!placement) {
    return NextResponse.json({ error: "Geçersiz reklam yerleşimi." }, { status: 400 });
  }

  const prisma = getPrisma();
  const slugBase = slugifyTurkish(`${parsed.data.placement}-${parsed.data.name}`);
  const slot = await prisma.adSlot.create({
    data: {
      slug: `${slugBase}-${Date.now().toString(36)}`,
      name: parsed.data.name,
      placement: placement.prismaValue as AdSlotPlacement,
      title: parsed.data.title,
      body: parsed.data.body,
      label: parsed.data.label,
      sponsorName: parsed.data.sponsorName || null,
      ctaLabel: parsed.data.ctaLabel || null,
      ctaHref: parsed.data.ctaHref || null,
      frequencyCap: parsed.data.frequencyCap,
      isActive: parsed.data.isActive,
      sortOrder: parsed.data.sortOrder,
    },
  });

  await createAdminAuditLog(prisma, {
    action: "ad_slot.create",
    entityType: "AdSlot",
    entityId: slot.id,
    summary: `Reklam alanı oluşturuldu: ${slot.name || slot.slug}`,
    metadata: {
      placement: slot.placement,
      frequencyCap: slot.frequencyCap,
      isActive: slot.isActive,
    },
  });

  return NextResponse.json({ slot }, { status: 201 });
}
