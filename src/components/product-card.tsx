"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

import { DopaminScoreBadge, SavedMoneyBadge, SimulationBadge } from "@/components/badges";
import { PriceDisplay } from "@/components/price-display";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/catalog";
import { useCartStore } from "@/store/use-cart-store";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-border/80 bg-card shadow-sm transition hover:shadow-lift"
    >
      <Link
        href={`/urun/${product.slug}`}
        className="focus-ring relative block aspect-[4/3] overflow-hidden bg-muted"
        aria-label={`${product.name} ürün detayını aç`}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <SimulationBadge />
          {product.compareAtPrice ? <SavedMoneyBadge /> : null}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-2">
          <DopaminScoreBadge score={product.rating} />
          <Link
            href={`/urun/${product.slug}`}
            className="focus-ring rounded-sm text-base font-semibold leading-6 text-navy hover:text-primary"
          >
            {product.name}
          </Link>
          <p className="line-clamp-2 text-sm leading-5 text-muted-foreground">
            {product.shortDescription}
          </p>
        </div>
        <div className="mt-auto flex items-end justify-between gap-3">
          <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} />
          <Button
            type="button"
            size="icon"
            aria-label={`${product.name} ürününü sanal sepete ekle`}
            onClick={() => addItem(product.id)}
          >
            <Plus className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
