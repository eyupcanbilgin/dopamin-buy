import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { ProductCard } from "@/components/product-card";
import { SectionHeader } from "@/components/section-header";
import { Button } from "@/components/ui/button";
import { categories, getCategoryBySlug, getProductsByCategory } from "@/lib/catalog";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  return {
    title: category ? `${category.name} Kategorisi` : "Kategori",
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const categoryProducts = getProductsByCategory(slug);

  return (
    <main className="container py-8">
      <Button asChild variant="ghost" className="mb-5 px-0">
        <Link href="/shop">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Mağazaya dön
        </Link>
      </Button>

      <section className="mb-8 premium-card p-6">
        <SectionHeader
          eyebrow="Sanal kategori"
          title={category.name}
          description={`${category.description} Bu sayfadaki ürünler mock veridir ve ticari kayda dönüşmez.`}
          headingLevel="h1"
          className="mb-0"
        />
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categoryProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </main>
  );
}
