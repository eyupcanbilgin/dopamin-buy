"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Heart, ShoppingBag, Star, Store, Truck } from "lucide-react";
import { useState } from "react";

import { DoplyScoreBadge } from "@/components/badges";
import { PriceDisplay } from "@/components/price-display";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/catalog";
import { toCartProductSnapshot } from "@/lib/cart-snapshot";
import { createProductImageFallback, getSafeProductImage } from "@/lib/product-image";
import { useCartStore } from "@/store/use-cart-store";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const [imageSrc, setImageSrc] = useState(() => getSafeProductImage(product.image, product.name));

  function handleAddToCart() {
    addItem(product.id, 1, toCartProductSnapshot(product));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  }

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="commerce-card group flex h-full flex-col overflow-hidden"
    >
      <div className="relative">
        <Link
          href={`/urun/${product.slug}`}
          className="focus-ring relative block aspect-[4/3] overflow-hidden bg-[linear-gradient(135deg,hsl(var(--surface-subtle)),hsl(var(--muted)))]"
          aria-label={`${product.name} ürün detayını aç`}
        >
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
            onError={() => setImageSrc(createProductImageFallback(product.name))}
          />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-navy/30 to-transparent opacity-0 transition group-hover:opacity-100" />
          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {product.discountPercentage ? (
              <Badge variant="dopamine" className="shadow-sm">%{product.discountPercentage} sepet avantajı</Badge>
            ) : product.compareAtPrice ? (
              <Badge variant="secondary" className="shadow-sm">Fiyat düşüşü</Badge>
            ) : null}
          </div>
        </Link>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={liked ? "Listeden kaldır" : "Listeye ekle"}
          onClick={() => setLiked((current) => !current)}
          className="absolute right-3 top-3 h-9 w-9 rounded-full border-white/80 bg-white/92 shadow-sm backdrop-blur transition hover:bg-white hover:shadow-lift"
        >
          <motion.span animate={{ scale: liked ? [1, 1.25, 1] : 1 }} transition={{ duration: 0.22 }}>
            <Heart
              className={liked ? "h-4 w-4 fill-primary text-primary" : "h-4 w-4"}
              aria-hidden="true"
            />
          </motion.span>
        </Button>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <DoplyScoreBadge score={product.dopaminScore ?? product.rating} className="bg-primary/8" />
            <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-dopamine text-dopamine" aria-hidden="true" />
              {product.rating.toFixed(1)} ({product.reviewCount})
            </span>
          </div>
          <Link
            href={`/urun/${product.slug}`}
            className="focus-ring line-clamp-2 min-h-12 rounded-sm text-base font-semibold leading-6 text-navy hover:text-primary"
          >
            {product.name}
          </Link>
          {product.merchantName ? (
            <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <Store className="h-3.5 w-3.5" aria-hidden="true" />
              {product.merchantName}
            </p>
          ) : null}
          <p className="line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
            {product.shortDescription}
          </p>
          {(product.simulatedDeliveryEstimate || product.stockFeelingLabel) ? (
            <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
              {product.simulatedDeliveryEstimate ? (
                <span className="inline-flex items-center gap-1">
                  <Truck className="h-3.5 w-3.5" aria-hidden="true" />
                  {product.simulatedDeliveryEstimate}
                </span>
              ) : null}
              {product.stockFeelingLabel ? <span>{product.stockFeelingLabel}</span> : null}
            </p>
          ) : null}
        </div>
        <div className="mt-auto grid gap-3 border-t border-border/60 pt-3">
          <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} />
          <Button
            type="button"
            aria-label={`${product.name} ürününü sepete ekle`}
            onClick={handleAddToCart}
            className="w-full"
          >
            {added ? (
              <Check className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            )}
            {added ? "Sepete eklendi" : "Sepete Ekle"}
          </Button>
        </div>
      </div>
    </motion.article>
  );
}
