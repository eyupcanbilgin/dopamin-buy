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
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((category) => (
        <Link
          key={category.slug}
          href={`/kategori/${category.slug}`}
          className="focus-ring group overflow-hidden rounded-lg border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-lift"
        >
          <div className={cn("relative aspect-[4/3]", category.accent)}>
            <Image
              src={category.image}
              alt={`${category.name} kategorisi`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover mix-blend-multiply transition duration-500 group-hover:scale-105"
            />
          </div>
          <div className="flex items-start justify-between gap-4 p-4">
            <div>
              <h3 className="font-semibold">{category.name}</h3>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">{category.description}</p>
            </div>
            <ArrowUpRight
              className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition group-hover:text-primary"
              aria-hidden="true"
            />
          </div>
        </Link>
      ))}
    </div>
  );
}
