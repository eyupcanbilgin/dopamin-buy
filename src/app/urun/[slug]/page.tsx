import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { DopaminScoreBadge, SimulationBadge } from "@/components/badges";
import { PriceDisplay } from "@/components/price-display";
import { ProductDetailActions } from "@/components/product/product-detail-actions";
import { ProductCard } from "@/components/product-card";
import { SectionHeader } from "@/components/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getProductBySlug, getRelatedProducts, products } from "@/lib/catalog";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  return {
    title: product ? product.name : "Ürün",
    description: product?.shortDescription,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(product);

  return (
    <main className="container py-8">
      <Button asChild variant="ghost" className="mb-5 px-0">
        <Link href="/shop">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Mağazaya dön
        </Link>
      </Button>

      <section className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="grid gap-3">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted shadow-sm">
            <Image
              src={product.gallery[0] ?? product.image}
              alt={product.name}
              fill
              priority
              sizes="(min-width: 1024px) 58vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {product.gallery.slice(1, 3).map((image) => (
              <div
                key={image}
                className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted"
              >
                <Image
                  src={image}
                  alt={`${product.name} ek görsel`}
                  fill
                  sizes="(min-width: 1024px) 28vw, 50vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <article className="premium-card p-6">
          <div className="flex flex-wrap gap-2">
            <SimulationBadge />
            {product.tags.map((tag) => (
              <Badge key={tag} variant={tag.includes("Yok") ? "success" : "secondary"}>
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="mt-5 text-3xl font-bold leading-tight tracking-normal">{product.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <DopaminScoreBadge score={product.rating} />
            <span>{product.reviewCount} sanal değerlendirme</span>
          </div>
          <PriceDisplay
            className="mt-5"
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            size="lg"
          />
          <p className="mt-5 leading-7 text-muted-foreground">{product.description}</p>
          <Separator className="my-6" />
          <ProductDetailActions product={product} />
          <Separator className="my-6" />
          <div className="rounded-lg bg-secondary/55 p-4">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
              Etik hatırlatma
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {product.reflection} Bu sayfa satın alma baskısı kurmaz; karar vermen için kısa bir
              duraklama alanı sunar.
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
            eyebrow="Benzer sanal ürünler"
            title="Benzer seçeneklere sakin bak"
            description="Buradaki öneriler satın alma baskısı oluşturmak için değil, dürtüyü güvenli alanda gözlemlemek için var."
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
