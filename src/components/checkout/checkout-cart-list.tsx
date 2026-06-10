"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";

import { PriceDisplay } from "@/components/price-display";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { CartProductSnapshot } from "@/lib/cart-types";

export type CheckoutCartLine = {
  product: CartProductSnapshot;
  quantity: number;
};

type CheckoutCartListProps = {
  lines: CheckoutCartLine[];
  onQuantityChange?: (productId: string, quantity: number) => void;
  onRemove?: (productId: string) => void;
};

export function CheckoutCartList({
  lines,
  onQuantityChange,
  onRemove,
}: CheckoutCartListProps) {
  return (
    <section className="overflow-hidden rounded-lg border bg-card shadow-sm">
      {lines.map((line, index) => (
        <div key={line.product.id}>
          <article className="grid gap-4 p-4 sm:grid-cols-[112px_1fr_auto] sm:items-center">
            <Link
              href={`/urun/${line.product.slug}`}
              className="focus-ring relative aspect-square overflow-hidden rounded-lg bg-muted"
            >
              <Image
                src={line.product.image}
                alt={line.product.name}
                fill
                sizes="112px"
                className="object-cover"
              />
            </Link>
            <div>
              <Link
                href={`/urun/${line.product.slug}`}
                className="focus-ring rounded-sm font-semibold text-navy hover:text-primary"
              >
                {line.product.name}
              </Link>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                {line.product.shortDescription}
              </p>
              <PriceDisplay className="mt-3" price={line.product.price} size="sm" />
            </div>
            {onQuantityChange || onRemove ? (
              <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                {onQuantityChange ? (
                  <div className="flex items-center rounded-md border">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Adedi azalt"
                      onClick={() => onQuantityChange(line.product.id, line.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <span className="w-10 text-center text-sm font-semibold">
                      {line.quantity}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Adedi artır"
                      onClick={() => onQuantityChange(line.product.id, line.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                ) : null}
                {onRemove ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`${line.product.name} ürününü kaldır`}
                    onClick={() => onRemove(line.product.id)}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                ) : null}
              </div>
            ) : (
              <p className="text-sm font-semibold text-muted-foreground">{line.quantity} adet</p>
            )}
          </article>
          {index < lines.length - 1 ? <Separator /> : null}
        </div>
      ))}
    </section>
  );
}
