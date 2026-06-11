export const DEFAULT_PRODUCT_IMAGE = "https://placehold.co/900x675/F7F1E8/243047/png?text=Doply";

export function createProductImageFallback(label = "Doply") {
  const safeLabel = encodeURIComponent(label.trim().slice(0, 42) || "Doply");
  return `https://placehold.co/900x675/F7F1E8/243047/png?text=${safeLabel}`;
}

export function getSafeProductImage(value: unknown, label = "Doply") {
  if (typeof value !== "string") {
    return createProductImageFallback(label);
  }

  const trimmed = value.trim();

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    return url.protocol === "https:" ? url.toString() : createProductImageFallback(label);
  } catch {
    return createProductImageFallback(label);
  }
}

export function getSafeProductGallery(values: unknown[], label = "Doply") {
  const gallery = values
    .map((value) => getSafeProductImage(value, label))
    .filter((value, index, all) => value && all.indexOf(value) === index);

  return gallery.length > 0 ? gallery : [DEFAULT_PRODUCT_IMAGE];
}
