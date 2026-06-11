import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageSquareText, ShieldCheck, Star, Store, TrendingUp, Truck } from "lucide-react";

import { DoplyScoreBadge } from "@/components/badges";
import { PriceDisplay } from "@/components/price-display";
import { ProductDetailActions } from "@/components/product/product-detail-actions";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductCard } from "@/components/product-card";
import { SectionHeader } from "@/components/section-header";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  getCatalogCategoryBySlug,
  getCatalogProductBySlug,
  getCatalogRelatedProducts,
} from "@/lib/catalog-db";
import {
  buildBreadcrumbJsonLd,
  buildMetadata,
  buildSimulationProductPageJsonLd,
} from "@/lib/seo";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);
  const title = product ? `${product.name} sanal ürün simülasyonu` : "Sanal ürün simülasyonu";
  const description = product
    ? `${product.shortDescription} Doply'de gerçek ödeme, stok vaadi veya teslimat olmadan simüle edilir.`
    : "Doply ürün sayfaları gerçek satın alma oluşturmayan simülasyon deneyimleridir.";

  return buildMetadata({
    title,
    description,
    path: `/urun/${slug}`,
    image: product?.image,
    imageAlt: product ? `${product.name} sanal ürün görseli` : "Doply sanal ürün görseli",
    keywords: product ? [product.name, "sanal ürün", "gerçek ödeme yok"] : [],
    noIndex: !product,
  });
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [related, category] = await Promise.all([
    getCatalogRelatedProducts(product),
    getCatalogCategoryBySlug(product.category),
  ]);

  return (
    <main className="container py-8">
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Doply", path: "/" },
            { name: "Sanal Mağaza", path: "/shop" },
            {
              name: category?.name ?? "Kategori",
              path: category ? `/kategori/${category.slug}` : "/shop",
            },
            { name: product.name, path: `/urun/${product.slug}` },
          ]),
          buildSimulationProductPageJsonLd(product),
        ]}
      />
      <Button asChild variant="ghost" className="mb-5 px-0">
        <Link href="/shop">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Mağazaya dön
        </Link>
      </Button>

      <section className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <ProductGallery name={product.name} images={product.gallery} />

        <article className="space-y-5">
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <Badge key={tag} variant={tag.includes("Acele") ? "success" : "secondary"}>
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="mt-5 text-3xl font-bold leading-tight tracking-normal">{product.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <DoplyScoreBadge score={product.dopaminScore ?? product.rating} />
            <span className="inline-flex items-center gap-1 font-medium">
              <Star className="h-4 w-4 fill-dopamine text-dopamine" aria-hidden="true" />
              {product.rating.toFixed(1)} / 5
            </span>
            <span>{product.reviewCount.toLocaleString("tr-TR")} değerlendirme</span>
          </div>
          <div className="mt-5 rounded-lg border border-primary/14 bg-card p-5 shadow-card">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <PriceDisplay
                price={product.price}
                compareAtPrice={product.compareAtPrice}
                size="lg"
              />
              {product.discountPercentage ? (
                <Badge variant="dopamine" className="w-fit">
                  %{product.discountPercentage} sepet avantajı
                </Badge>
              ) : null}
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              Sepet finalinde Doply indirimi toplamı dengeler.
            </p>
          </div>
          <p className="mt-5 leading-7 text-muted-foreground">{product.description}</p>
          <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
            {product.merchantName ? (
              <Card className="shadow-card">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Store className="h-4 w-4 text-primary" aria-hidden="true" />
                    Mağaza
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="font-semibold">{product.merchantName}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Premium vitrin puanı yüksek satıcı profili.
                  </p>
                </CardContent>
              </Card>
            ) : null}
            {product.simulatedDeliveryEstimate ? (
              <Card className="shadow-card">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-primary" aria-hidden="true" />
                    Teslimat
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <p className="font-semibold">{product.simulatedDeliveryEstimate}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Adres adımı yalnızca şehir ve ilçe seçimiyle ilerler.
                  </p>
                </CardContent>
              </Card>
            ) : null}
            {product.popularityScore ? (
              <p className="flex items-center gap-2 rounded-lg border bg-background p-4 text-muted-foreground shadow-sm">
                <TrendingUp className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-navy">Popülerlik:</span>{" "}
                  {product.popularityScore}/100
                </span>
              </p>
            ) : null}
            {product.stockFeelingLabel ? (
              <p className="flex items-center gap-2 rounded-lg border bg-background p-4 text-muted-foreground shadow-sm">
                <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-navy">Stok tonu:</span>{" "}
                  {product.stockFeelingLabel}
                </span>
              </p>
            ) : null}
          </div>
          <Separator className="my-6" />
          <ProductDetailActions product={product} />
          <Separator className="my-6" />
          <div className="rounded-lg border border-dopamine/30 bg-dopamine/12 p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <MessageSquareText className="h-4 w-4 text-primary" aria-hidden="true" />
              Kısa düşünme notu
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {product.reflection}
            </p>
          </div>
          <div className="mt-6">
            <h2 className="font-semibold">Sanal ürün detayları</h2>
            <ul className="mt-3 grid gap-2 text-sm text-muted-foreground">
              {product.specs.map((spec) => (
                <li key={spec} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                  {spec}
                </li>
              ))}
            </ul>
          </div>
        </article>
      </section>

      {related.length > 0 ? (
        <section className="py-12">
          <SectionHeader
            eyebrow="Önerilenler"
            title="Benzer ürünler"
            description="Aynı kategori ritminde, karar vermeyi kolaylaştıran yakın seçenekler."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
