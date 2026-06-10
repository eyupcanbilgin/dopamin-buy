import { products } from "@/lib/catalog";
import { toCartProductSnapshot } from "@/lib/cart-snapshot";
import type { CartProductSnapshot } from "@/lib/cart-types";
import type { CartLine } from "@/store/use-cart-store";

export function resolveCartLineProduct(line: CartLine): CartProductSnapshot | undefined {
  if (line.snapshot) {
    return line.snapshot;
  }

  const fallbackProduct = products.find((product) => product.id === line.productId);
  return fallbackProduct ? toCartProductSnapshot(fallbackProduct) : undefined;
}
