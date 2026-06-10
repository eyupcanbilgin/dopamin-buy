import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProductCard } from "@/components/product-card";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/catalog";

type ProductRailProps = {
  eyebrow: string;
  title: string;
  description?: string;
  products: Product[];
  id?: string;
};

export function ProductRail({ eyebrow, title, description, products, id }: ProductRailProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section id={id} className="container py-10">
      <SectionHeader
        eyebrow={eyebrow}
        title={title}
        description={description}
        actions={
          <Button asChild variant="outline">
            <Link href="#tum-urunler">
              Tümünü gör
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
