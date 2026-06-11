import { slugifyTurkish } from "@/lib/slug";

export const DEFAULT_BRAND_NAME = "Doply Studio";

export function cleanText(value: string) {
  return value
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function cleanProductName(value: string) {
  return cleanText(value)
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/([([{])\s+/g, "$1")
    .replace(/\s+([)\]}])/g, "$1");
}

export function parsePriceToKurus(value: string | number) {
  if (typeof value === "number") {
    return Number.isFinite(value) && value > 0 ? Math.round(value * 100) : null;
  }

  const normalized = value
    .trim()
    .replace(/[^\d.,-]/g, "")
    .replace(/\.(?=\d{3}(?:\D|$))/g, "")
    .replace(",", ".");

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) && parsed > 0 ? Math.round(parsed * 100) : null;
}

export function normalizeDeduplicationText(value?: string) {
  return slugifyTurkish(cleanText(value || "") || "markasiz");
}

export function createProductSlug(title: string, brand: string | undefined, category: string) {
  const parts = [title, brand || DEFAULT_BRAND_NAME, category]
    .map(slugifyTurkish)
    .filter(Boolean);

  return parts.join("-");
}

export function createDeduplicationKey(title: string, brand: string | undefined, category: string) {
  return [
    normalizeDeduplicationText(title),
    normalizeDeduplicationText(brand || DEFAULT_BRAND_NAME),
    normalizeDeduplicationText(category),
  ].join("|");
}

export function createPlaceholderImageUrl(title: string) {
  const label = encodeURIComponent(cleanProductName(title).slice(0, 54) || "Doply");
  return `https://placehold.co/900x675/F7F1E8/243047/png?text=${label}`;
}
