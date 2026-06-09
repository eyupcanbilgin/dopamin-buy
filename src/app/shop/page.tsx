import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShieldCheck, SlidersHorizontal } from "lucide-react";

import { AdSlot } from "@/components/ad-slot";
import { CategoryGrid } from "@/components/category-grid";
import { Reveal } from "@/components/motion/reveal";
import { ProductCard } from "@/components/product-card";
import { SectionHeader } from "@/components/section-header";
import { UrgeCheckIn } from "@/components/urge-check-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getFeaturedProducts, products } from "@/lib/catalog";

export const metadata = {
  title: "Sanal Mağaza",
};

export default function ShopPage() {
  const featured = getFeaturedProducts();

  return (
    <>
      <section className="border-b bg-card/70">
        <div className="container grid gap-8 py-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <Reveal className="space-y-5">
            <Badge variant="calm">Premium sanal alışveriş</Badge>
            <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-normal sm:text-5xl">
              Sepete ekle, hissi tamamla, gerçek ödeme yapma.
            </h1>
            <p className="max-w-xl text-base leading-7 text-muted-foreground">
              Gerçek ecommerce akışı gibi görünür; fakat sipariş, kargo ve ödeme tamamen
              simülasyondur. Acele ettiren kampanya ya da geri sayım yok.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="#urunler">
                  Ürünleri keşfet
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/sepet">Sanal sepet</Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="grid grid-cols-2 gap-3">
              {featured.slice(0, 4).map((product, index) => (
                <Link
                  key={product.id}
                  href={`/urun/${product.slug}`}
                  className="focus-ring group relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted shadow-sm"
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    priority={index < 2}
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/62 to-transparent p-3">
                    <p className="text-sm font-semibold text-white">{product.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container grid gap-6 py-10 lg:grid-cols-[0.72fr_1.28fr]">
        <UrgeCheckIn mode="before" compact />
        <div className="rounded-lg border bg-secondary/55 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <div>
              <h2 className="font-semibold">Etik alışveriş modu açık</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Dopamin ürün seçme hissini verir; ancak gerçek ödeme toplamaz, gerçek teslimat
                planlamaz ve ticari kayıt oluşturmaz.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="kategoriler" className="container py-6">
        <SectionHeader
          eyebrow="Kategoriler"
          title="Bugünkü sanal vitrin"
          description="Kategoriler gerçek stok vaadi taşımaz; sadece seçme hissini güvenli biçimde denemek içindir."
          actions={
            <SlidersHorizontal
              className="hidden h-5 w-5 text-muted-foreground sm:block"
              aria-hidden="true"
            />
          }
        />
        <CategoryGrid />
      </section>

      <section id="urunler" className="container py-12">
        <SectionHeader
          eyebrow="Sanal ürünler"
          title="Öne çıkan keşifler"
          description={`${products.length} ürün, mock veri. Hiçbiri gerçek stok, gerçek indirim veya satış vaadi değildir.`}
        />
        <AdSlot className="mb-6" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
