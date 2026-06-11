"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/catalog";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

type HeroCarouselProps = {
  products: Product[];
};

export function HeroCarousel({ products }: HeroCarouselProps) {
  const slides = useMemo(() => {
    const polishedProducts = products.filter((product) => !product.image.includes("placehold.co"));
    return (polishedProducts.length > 0 ? polishedProducts : products).slice(0, 4);
  }, [products]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeProduct = slides[activeIndex] ?? slides[0];

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5200);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  if (!activeProduct) {
    return null;
  }

  function go(direction: "next" | "previous") {
    setActiveIndex((current) =>
      direction === "next"
        ? (current + 1) % slides.length
        : (current - 1 + slides.length) % slides.length,
    );
  }

  return (
    <section className="relative overflow-hidden border-b bg-surface-strong text-white">
      <div className="absolute inset-0">
        <Image
          key={activeProduct.id}
          src={activeProduct.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-42 transition"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,24,38,0.94),rgba(18,24,38,0.72),rgba(18,24,38,0.28))]" />
      </div>

      <div className="container relative grid min-h-[520px] gap-8 py-10 lg:grid-cols-[1fr_420px] lg:items-center">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-dopamine">
            Doply seçkisi
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight tracking-normal sm:text-6xl">
            Büyük vitrin hissi, sakin sepet deneyimi.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/78">
            Popüler ürünlere bak, listeye ekle, sepeti tamamla. Acele ettiren sayaçlar ve baskılı
            satın alma dili yok.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="bg-white text-navy hover:bg-white/90">
              <Link href="#tum-urunler">
                Ürünleri keşfet
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/34 bg-white/8 text-white hover:bg-white/16 hover:text-white"
            >
              <Link href={`/urun/${activeProduct.slug}`}>Öne çıkan ürüne bak</Link>
            </Button>
          </div>
        </div>

        <article className="rounded-lg border border-white/14 bg-white/12 p-4 shadow-soft backdrop-blur-xl">
          <Link href={`/urun/${activeProduct.slug}`} className="focus-ring block rounded-md">
            <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-white/10">
              <Image
                src={activeProduct.image}
                alt={activeProduct.name}
                fill
                priority
                sizes="(min-width: 1024px) 420px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="pt-4">
              <p className="text-sm text-white/68">{activeProduct.merchantName ?? "Doply Vitrin"}</p>
              <h2 className="mt-1 text-xl font-bold leading-6">{activeProduct.name}</h2>
              <div className="mt-3 flex items-end justify-between gap-4">
                <p className="text-2xl font-bold">{formatCurrency(activeProduct.price)}</p>
                {activeProduct.discountPercentage ? (
                  <span className="rounded-md bg-dopamine px-2.5 py-1 text-xs font-bold text-dopamine-foreground">
                    %{activeProduct.discountPercentage} sepet avantajı
                  </span>
                ) : null}
              </div>
            </div>
          </Link>
        </article>

        {slides.length > 1 ? (
          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-9 w-9 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              aria-label="Önceki vitrin"
              onClick={() => go("previous")}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`${index + 1}. vitrini göster`}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "h-2.5 rounded-full transition",
                  index === activeIndex ? "w-8 bg-dopamine" : "w-2.5 bg-white/42",
                )}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-9 w-9 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white"
              aria-label="Sonraki vitrin"
              onClick={() => go("next")}
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
