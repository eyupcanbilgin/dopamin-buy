import "server-only";

import type { AdSlot, AdSlotPlacement } from "@prisma/client";

import {
  getAdPlacementById,
  getAdPlacementByPrismaValue,
  premiumNoAdsFlagPlaceholder,
  type AdPlacementId,
  type PublicAdSlot,
} from "@/lib/ad-config";
import { getPrisma } from "@/lib/prisma";

export async function getPublicAdSlot(placement: AdPlacementId): Promise<PublicAdSlot | null> {
  if (premiumNoAdsFlagPlaceholder) {
    return null;
  }

  const placementConfig = getAdPlacementById(placement);

  if (!placementConfig) {
    return null;
  }

  try {
    const prisma = getPrisma();
    const slot = await prisma.adSlot.findFirst({
      where: {
        placement: placementConfig.prismaValue as AdSlotPlacement,
        isActive: true,
      },
      orderBy: [{ sortOrder: "asc" }, { updatedAt: "desc" }],
    });

    return slot ? mapAdSlot(slot) : null;
  } catch {
    return null;
  }
}

export function mapAdSlot(slot: AdSlot): PublicAdSlot | null {
  const placement = getAdPlacementByPrismaValue(slot.placement);

  if (!placement) {
    return null;
  }

  return {
    id: slot.id,
    name: slot.name || slot.slug,
    placement: placement.id,
    label: slot.label === "Reklam" ? "Reklam" : "Sponsorlu",
    title: slot.title,
    body: slot.body,
    sponsorName: slot.sponsorName,
    ctaLabel: slot.ctaLabel,
    ctaHref: slot.ctaHref,
    frequencyCap: slot.frequencyCap,
  };
}
