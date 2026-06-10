import { NextResponse, type NextRequest } from "next/server";

import { isAdPlacementId } from "@/lib/ad-config";
import { getPublicAdSlot } from "@/lib/ad-server";

export async function GET(request: NextRequest) {
  const placement = request.nextUrl.searchParams.get("placement") ?? "";

  if (!isAdPlacementId(placement)) {
    return NextResponse.json({ slot: null }, { status: 400 });
  }

  const slot = await getPublicAdSlot(placement);
  return NextResponse.json({ slot });
}
