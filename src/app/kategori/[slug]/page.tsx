import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { AdSlot } from "@/components/ad-slot";
import { ProductListing } from "@/components/product/product-listing";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPublicAdSlot } from "@/lib/ad-server";
import {
  getCatalogCategories,
  getCatalogCategoryBySlug,
  getCatalogProductPage,
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
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const PUBLIC_PRODUCT_PAGE_SIZE = 48;

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
    : "Doply kategorileri gerçek satış yapmayan alışveriş simülasyonu vitrinleridir.";

  return buildMetadata({
    title,
    description,
    path: `/kategori/${slug}`,
    image: category?.image,
    imageAlt: category ? `${category.name} sanal kategori vitrini` : "Doply kategori vitrini",
    keywords: category ? [`${category.name} sanal alışveriş`, `${category.name} simülasyonu`] : [],
    noIndex: !category,
  });
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const page = readSearchNumber(resolvedSearchParams?.page, 1);
  const pageSize = readSearchNumber(resolvedSearchParams?.pageSize, PUBLIC_PRODUCT_PAGE_SIZE);
  const category = await getCatalogCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const [categoryProductPage, categories, midFeedAdSlot, sidebarAdSlot] = await Promise.all([
    getCatalogProductPage({ categorySlug: slug, page, pageSize }),
    getCatalogCategories(),
    getPublicAdSlot("category-mid-feed"),
    getPublicAdSlot("sidebar-desktop"),
  ]);
  const categoryProducts = categoryProductPage.products;

  return (
    <main className="container py-8">
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Doply", path: "/" },
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

      <section className="relative mb-8 overflow-hidden rounded-lg border bg-surface-strong text-white shadow-soft">
        <Image
          src={category.image}
          alt={`${category.name} kategori vitrini`}
          fill
          priority
          sizes="(min-width: 1024px) 1200px, 100vw"
          className="object-cover opacity-45 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,hsl(var(--navy)/0.92),hsl(var(--navy)/0.58),hsl(var(--navy)/0.18))]" />
        <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Badge className="border-white/20 bg-white/14 text-white backdrop-blur">Kategori</Badge>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-normal sm:text-5xl">
              {category.name}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/74">
              {category.description}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm sm:min-w-72">
            <div className="rounded-lg border border-white/14 bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-bold">{categoryProductPage.totalCount.toLocaleString("tr-TR")}</p>
              <p className="mt-1 text-white/68">ürünlük kategori</p>
            </div>
            <div className="rounded-lg border border-white/14 bg-white/10 p-4 backdrop-blur">
              <p className="text-2xl font-bold">0 TL</p>
              <p className="mt-1 text-white/68">gerçek ödeme</p>
            </div>
          </div>
        </div>
      </section>

      <ProductListing
        products={categoryProducts}
        categories={categories}
        initialCategory={slug}
        showCategoryFilter={false}
        totalCount={categoryProductPage.totalCount}
        currentPage={categoryProductPage.page}
        pageSize={categoryProductPage.pageSize}
        totalPages={categoryProductPage.totalPages}
        basePath={`/kategori/${category.slug}`}
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

function readSearchNumber(value: string | string[] | undefined, fallback: number) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}
