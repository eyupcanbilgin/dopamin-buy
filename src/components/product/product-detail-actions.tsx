"use client";

import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/catalog";
import { useCartStore } from "@/store/use-cart-store";

type ProductDetailActionsProps = {
  product: Product;
};

export function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="space-y-3">
      <div className="flex w-fit items-center rounded-md border bg-card">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Adedi azalt"
          onClick={() => setQuantity((current) => Math.max(1, current - 1))}
        >
          <Minus className="h-4 w-4" aria-hidden="true" />
        </Button>
        <span className="w-10 text-center text-sm font-semibold" aria-live="polite">
          {quantity}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Adedi artır"
          onClick={() => setQuantity((current) => Math.min(9, current + 1))}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Button
          type="button"
          size="lg"
          onClick={() => addItem(product.id, quantity)}
          className="w-full"
        >
          <ShoppingBag className="h-5 w-5" aria-hidden="true" />
          Sanal sepete ekle
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full">
          <Link href="/sepet">Sanal sepeti gör</Link>
        </Button>
      </div>
      <p className="text-xs leading-5 text-muted-foreground">
        Bu işlem Sanal Sipariş dışında ticari kayıt oluşturmaz. Ödeme bilgisi, CVV veya açık adres
        istemiyoruz.
      </p>
    </div>
  );
}
