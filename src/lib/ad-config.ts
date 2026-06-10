export const adPlacementOptions = [
  {
    id: "homepage-banner",
    prismaValue: "HOMEPAGE_BANNER",
    label: "Homepage banner",
    description: "Sanal mağaza girişinde yatay, geniş ama sakin sponsor alanı.",
  },
  {
    id: "category-mid-feed",
    prismaValue: "CATEGORY_MID_FEED",
    label: "Kategori ara akış",
    description: "Kategori ürün listesinin ortasında, ürün kartı gibi gizlenmeden görünür.",
  },
  {
    id: "sidebar-desktop",
    prismaValue: "SIDEBAR_DESKTOP",
    label: "Desktop sidebar",
    description: "Geniş ekranda filtre panelinin altında düşük yoğunluklu sponsor alanı.",
  },
  {
    id: "footer",
    prismaValue: "FOOTER",
    label: "Footer",
    description: "Sayfa sonuna yakın, düşük öncelikli sponsor alanı.",
  },
  {
    id: "guide-inline",
    prismaValue: "GUIDE_INLINE",
    label: "Rehber içi",
    description: "Eğitici rehberlerde paragraf arası, net etiketli sponsor alanı.",
  },
] as const;

export const adPageTypeOptions = [
  "home",
  "shop",
  "category",
  "product",
  "guide",
  "footer",
  "admin",
] as const;

export type AdPlacementId = (typeof adPlacementOptions)[number]["id"];
export type AdPageType = (typeof adPageTypeOptions)[number];

export type PublicAdSlot = {
  id: string;
  name: string;
  placement: AdPlacementId;
  label: "Reklam" | "Sponsorlu";
  title: string;
  body: string;
  sponsorName: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  frequencyCap: number;
};

export type AdSlotVariant = "banner" | "mid-feed" | "sidebar" | "footer" | "inline";

export const sensitiveAdExcludedPathPrefixes = [
  "/checkout",
  "/sepet",
  "/siparis-takip",
  "/dashboard",
];

export const premiumNoAdsFlagPlaceholder =
  process.env.NEXT_PUBLIC_DOPAMIN_PREMIUM_NO_ADS === "true";

export function isAdExcludedPath(pathname: string) {
  return sensitiveAdExcludedPathPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function getAdPlacementById(id: string) {
  return adPlacementOptions.find((placement) => placement.id === id);
}

export function getAdPlacementByPrismaValue(value: string) {
  return adPlacementOptions.find((placement) => placement.prismaValue === value);
}

export function isAdPlacementId(value: string): value is AdPlacementId {
  return Boolean(getAdPlacementById(value));
}
