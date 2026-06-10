"use client";

import { Check, Clock, Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/catalog";
import { toCartProductSnapshot } from "@/lib/cart-snapshot";
import { useCartStore } from "@/store/use-cart-store";

type ProductDetailActionsProps = {
  product: Product;
};

export function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [listed, setListed] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  function handleAddToCart() {
    addItem(product.id, quantity, toCartProductSnapshot(product));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1300);
  }

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
          aria-label={`${product.name} sepete ekle`}
          onClick={handleAddToCart}
          className="w-full"
        >
          {added ? (
            <Check className="h-5 w-5" aria-hidden="true" />
          ) : (
            <ShoppingBag className="h-5 w-5" aria-hidden="true" />
          )}
          {added ? "Sepete eklendi" : "Sepete Ekle"}
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full">
          <Link href="/sepet">Sepeti gör</Link>
        </Button>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setListed((current) => !current)}
          className="w-full"
        >
          <Heart className={listed ? "h-4 w-4 fill-primary text-primary" : "h-4 w-4"} aria-hidden="true" />
          {listed ? "Listeye eklendi" : "Listeye Ekle"}
        </Button>
        <Button
          type="button"
          variant="calm"
          onClick={() => setWaiting(true)}
          className="w-full"
        >
          <Clock className="h-4 w-4" aria-hidden="true" />
          {waiting ? "10 dk mola başladı" : "10 Dakika Beklet"}
        </Button>
      </div>
      {waiting ? (
        <p className="rounded-md bg-secondary/55 p-3 text-xs leading-5 text-muted-foreground">
          Bu ürün listende bekliyor. Biraz sonra hâlâ iyi görünüyorsa sepete dönmek kolay.
        </p>
      ) : null}
    </div>
  );
}
