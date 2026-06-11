import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { categories } from "@/lib/catalog";
import type { Category } from "@/lib/catalog";
import { cn } from "@/lib/utils";

type CategoryGridProps = {
  items?: Category[];
};

export function CategoryGrid({ items = categories }: CategoryGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((category) => (
        <Link
          key={category.slug}
          href={`/kategori/${category.slug}`}
          className="focus-ring commerce-card group overflow-hidden"
        >
          <div className={cn("relative aspect-[4/3] overflow-hidden", category.accent)}>
            <Image
              src={category.image}
              alt={`${category.name} kategorisi`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover mix-blend-multiply transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/52 via-navy/6 to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3 text-white">
              <h3 className="text-xl font-bold tracking-normal">{category.name}</h3>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/18 backdrop-blur transition group-hover:bg-white/26">
                <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm leading-6 text-muted-foreground">{category.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
