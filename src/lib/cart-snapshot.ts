import type { Product } from "@/lib/catalog";
import { categories } from "@/lib/catalog";
import type { CartProductSnapshot } from "@/lib/cart-types";

export function toCartProductSnapshot(product: Product): CartProductSnapshot {
  const category = categories.find((item) => item.slug === product.category);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    categorySlug: product.category,
    categoryName: category?.name ?? product.category,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    image: product.image,
    shortDescription: product.shortDescription,
  };
}
