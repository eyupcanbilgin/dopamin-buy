import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { AdSlot } from "@/components/ad-slot";
import { ProductListing } from "@/components/product/product-listing";
import { SectionHeader } from "@/components/section-header";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { getPublicAdSlot } from "@/lib/ad-server";
import {
  getCatalogCategories,
  getCatalogCategoryBySlug,
  getCatalogProductsByCategory,
} from "@/lib/catalog-db";
import {
  buildBreadcrumbJsonLd,
  buildCategoryCollectionJsonLd,
  buildMetadata,
} from "@/lib/seo";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const categories = await getCatalogCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCatalogCategoryBySlug(slug);
  const title = category
    ? `${category.name} sanal alışveriş kategorisi`
    : "Sanal alışveriş kategorisi";
  const description = category
    ? `${category.name} kategorisinde ürün keşfetme ve Sanal Sipariş hissini gerçek ödeme, stok vaadi veya teslimat olmadan deneyimle.`
    : "Dopamin kategorileri gerçek satış yapmayan alışveriş simülasyonu vitrinleridir.";

  return buildMetadata({
    title,
    description,
    path: `/kategori/${slug}`,
    image: category?.image,
    imageAlt: category ? `${category.name} sanal kategori vitrini` : "Dopamin kategori vitrini",
    keywords: category ? [`${category.name} sanal alışveriş`, `${category.name} simülasyonu`] : [],
    noIndex: !category,
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCatalogCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const [categoryProducts, categories, midFeedAdSlot, sidebarAdSlot] = await Promise.all([
    getCatalogProductsByCategory(slug, 240),
    getCatalogCategories(),
    getPublicAdSlot("category-mid-feed"),
    getPublicAdSlot("sidebar-desktop"),
  ]);

  return (
    <main className="container py-8">
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Dopamin", path: "/" },
            { name: "Sanal Mağaza", path: "/shop" },
            { name: category.name, path: `/kategori/${category.slug}` },
          ]),
          buildCategoryCollectionJsonLd({
            name: `${category.name} sanal kategori vitrini`,
            description: category.description,
            path: `/kategori/${category.slug}`,
            products: categoryProducts,
          }),
        ]}
      />
      <Button asChild variant="ghost" className="mb-5 px-0">
        <Link href="/shop">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Mağazaya dön
        </Link>
      </Button>

      <section className="mb-8 premium-card p-6">
        <SectionHeader
          eyebrow="Kategori"
          title={category.name}
          description={category.description}
          headingLevel="h1"
          className="mb-0"
        />
      </section>

      <ProductListing
        products={categoryProducts}
        categories={categories}
        initialCategory={slug}
        showCategoryFilter={false}
        midFeedAdSlot={
          <AdSlot
            placement="category-mid-feed"
            pageType="category"
            variant="mid-feed"
            slot={midFeedAdSlot}
            disableRemoteLoad
          />
        }
        sidebarAdSlot={
          <AdSlot
            placement="sidebar-desktop"
            pageType="category"
            variant="sidebar"
            slot={sidebarAdSlot}
            disableRemoteLoad
          />
        }
      />
    </main>
  );
}
