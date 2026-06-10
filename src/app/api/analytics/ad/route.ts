import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";

import { adPageTypeOptions, adPlacementOptions } from "@/lib/ad-config";

const adAnalyticsSchema = z.object({
  event: z.enum(["impression", "click"]),
  placement: z.enum(adPlacementOptions.map((placement) => placement.id) as [
    (typeof adPlacementOptions)[number]["id"],
    ...(typeof adPlacementOptions)[number]["id"][],
  ]),
  pageType: z.enum(adPageTypeOptions),
  slotId: z.string().min(1).max(120),
  path: z.string().min(1).max(240),
});

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const parsed = adAnalyticsSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Privacy-friendly MVP: validate event shape, intentionally avoid user IDs, IPs,
  // user agent strings, precise timestamps, cookies, or session identifiers.
  console.info("dopamin_ad_event", {
    event: parsed.data.event,
    placement: parsed.data.placement,
    pageType: parsed.data.pageType,
    slotId: parsed.data.slotId,
    path: parsed.data.path,
  });

  return NextResponse.json({ ok: true });
}
