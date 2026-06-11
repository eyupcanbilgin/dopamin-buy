"use client";

import Image from "next/image";
import { useState } from "react";

import { createProductImageFallback, getSafeProductGallery } from "@/lib/product-image";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  name: string;
  images: string[];
};

export function ProductGallery({ name, images }: ProductGalleryProps) {
  const gallery = getSafeProductGallery(images, name);
  const fallbackImage = createProductImageFallback(name);
  const [activeImage, setActiveImage] = useState(gallery[0]);

  return (
    <div className="grid gap-3 lg:grid-cols-[88px_1fr] lg:sticky lg:top-24 lg:self-start">
      <div className="order-2 flex gap-2 overflow-x-auto lg:order-1 lg:grid lg:max-h-[560px] lg:overflow-visible">
        {gallery.slice(0, 6).map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActiveImage(image)}
            aria-label={`${name} görseli ${index + 1}`}
            className={cn(
              "focus-ring relative h-20 w-20 shrink-0 overflow-hidden rounded-md border bg-muted shadow-sm transition",
              activeImage === image ? "border-primary ring-2 ring-primary/20" : "border-border",
            )}
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="80px"
              className="object-cover"
              onError={() => setActiveImage(fallbackImage)}
            />
          </button>
        ))}
      </div>
      <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-lg border bg-[linear-gradient(135deg,hsl(var(--surface-subtle)),hsl(var(--muted)))] shadow-card lg:order-2">
        <Image
          src={activeImage}
          alt={name}
          fill
          priority
          sizes="(min-width: 1024px) 58vw, 100vw"
          className="object-cover transition duration-500 hover:scale-[1.02]"
          onError={() => setActiveImage(fallbackImage)}
        />
      </div>
    </div>
  );
}
