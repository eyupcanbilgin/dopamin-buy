import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, HeartHandshake, Moon, ShoppingBag, WalletCards } from "lucide-react";

import { AdSlot } from "@/components/ad-slot";
import { CategoryGrid } from "@/components/category-grid";
import { ProductListing } from "@/components/product/product-listing";
import { SectionHeader } from "@/components/section-header";
import { JsonLd } from "@/components/seo/json-ld";
import { HeroCarousel } from "@/components/shop/hero-carousel";
import { ProductRail } from "@/components/shop/product-rail";
import { Button } from "@/components/ui/button";
import { BrowsingUrgeCheckIn } from "@/components/urge/browsing-urge-check-in";
import { getPublicAdSlot } from "@/lib/ad-server";
import {
  getCatalogCategories,
  getCatalogFeaturedProducts,
  getCatalogProductPage,
  getCatalogProducts,
} from "@/lib/catalog-db";
import { buildBreadcrumbJsonLd, buildCategoryCollectionJsonLd, buildMetadata } from "@/lib/seo";

const PUBLIC_PRODUCT_PAGE_SIZE = 48;

type ShopPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = buildMetadata({
  title: "Sanal Mağaza | Harcamadan keşfet",
  description:
    "Doply Sanal Mağaza ürünleri keşfetme, sepete ekleme ve Sanal Sipariş hissini gerçek ödeme veya teslimat olmadan deneyimletir.",
  path: "/shop",
  keywords: ["sanal mağaza", "sanal sepet", "ürün simülasyonu"],
});

export const dynamic = "force-dynamic";

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedSearchParams = await searchParams;
  const page = readSearchNumber(resolvedSearchParams?.page, 1);
  const pageSize = readSearchNumber(resolvedSearchParams?.pageSize, PUBLIC_PRODUCT_PAGE_SIZE);
  const [featured, railProducts, productPage, catalogCategories, homepageAdSlot, sidebarAdSlot] = await Promise.all([
    getCatalogFeaturedProducts(),
    getCatalogProducts(240),
    getCatalogProductPage({ page, pageSize }),
    getCatalogCategories(),
    getPublicAdSlot("homepage-banner"),
    getPublicAdSlot("sidebar-desktop"),
  ]);
  const listingProducts = productPage.products;
  const trendingProducts = [...railProducts]
    .sort((a, b) => (b.popularityScore ?? b.reviewCount) - (a.popularityScore ?? a.reviewCount))
    .slice(0, 8);
  const priceDropProducts = railProducts
    .filter((product) => product.compareAtPrice)
    .sort((a, b) => (b.discountPercentage ?? 0) - (a.discountPercentage ?? 0))
    .slice(0, 8);
  const mostAddedProducts = [...railProducts]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 8);
  const lateNightProducts = railProducts
    .filter((product) =>
      ["teknoloji", "kozmetik-bakim", "ev-yasam", "kitap-hobi", "kirtasiye"].includes(
        product.category,
      ),
    )
    .slice(0, 8);

  return (
    <>
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Doply", path: "/" },
            { name: "Sanal Mağaza", path: "/shop" },
          ]),
          buildCategoryCollectionJsonLd({
            name: "Doply Sanal Mağaza",
            description:
              "Gerçek satış veya teslimat oluşturmayan alışveriş simülasyonu vitrini.",
            path: "/shop",
            products: listingProducts,
          }),
        ]}
      />
      <HeroCarousel products={featured.length > 0 ? featured : listingProducts} />
      <BrowsingUrgeCheckIn />
      <section className="container py-5">
        <AdSlot
          placement="homepage-banner"
          pageType="shop"
          variant="banner"
          slot={homepageAdSlot}
          disableRemoteLoad
        />
      </section>

      <section className="border-b bg-card">
        <div className="container grid gap-3 py-5 sm:grid-cols-3">
          {[
            {
              icon: ShoppingBag,
              title: "Sepete Ekle",
              text: "Ürünleri seç, sepet ritmini tamamla.",
            },
            {
              icon: WalletCards,
              title: "Ödeme baskısı yok",
              text: "Akış, Simülasyon Modu içinde ilerler.",
            },
            {
              icon: HeartHandshake,
              title: "Sakin kapanış",
              text: "Korumayı gördüğün net bir final ekranı.",
            },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 rounded-lg bg-background p-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-sm font-bold">{item.title}</h2>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="kategoriler" className="container py-6">
        <SectionHeader
          eyebrow="Kategoriler"
          title="Hızlı kategori geçişleri"
          description="Teknolojiden mutfağa, gece bakılacak küçük şeylerden büyük elektroniklere kadar düzenli vitrinler."
          actions={
            <Button asChild variant="outline">
              <Link href="#tum-urunler">
                Ürün listesine in
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          }
        />
        <CategoryGrid items={catalogCategories} />
      </section>

      <ProductRail
        eyebrow="Trend"
        title="Bugün en çok bakılanlar"
        description="Popülerlik ve değerlendirme sinyallerine göre dengelenmiş keşif alanı."
        products={trendingProducts}
      />

      <ProductRail
        eyebrow="Fiyat düşüşü hissi"
        title="Sepette iyi hissettiren fiyatlar"
        description="Geri sayım veya stok baskısı olmadan, sadece fiyatı yumuşayan ürünler."
        products={priceDropProducts}
      />

      <ProductRail
        eyebrow="Sepete eklenenler"
        title="Çok seçilen ürünler"
        description="Kullanıcıların sepet ritmine en sık eşlik eden ürün grupları."
        products={mostAddedProducts}
      />

      <section className="container py-10">
        <div className="grid gap-4 rounded-lg border bg-surface-strong p-5 text-white shadow-soft lg:grid-cols-[0.6fr_1.4fr] lg:items-center">
          <div>
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-white/10 text-dopamine">
              <Moon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-normal">Gece gelen bakma isteği</h2>
            <p className="mt-2 text-sm leading-6 text-white/72">
              Teknoloji, bakım, ev ve hobi ürünlerinden oluşan daha sakin bir koleksiyon.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {lateNightProducts.slice(0, 4).map((product) => (
              <Link
                key={product.id}
                href={`/urun/${product.slug}`}
                className="focus-ring rounded-lg border border-white/14 bg-white/10 p-3 transition hover:bg-white/14"
              >
                <p className="line-clamp-2 text-sm font-semibold">{product.name}</p>
                <p className="mt-2 text-xs text-white/68">{product.campaignLabel ?? "Sakin seçim"}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-10">
        <SectionHeader
          eyebrow="Topluluk ritmi"
          title="Bugün harcamadan tamamlanan sepetler"
          description="Doply’de kapanış, ürünü seçme hissini bütçe etkisi olmadan bitirmeye odaklanır."
        />
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["1.284", "tamamlanan sepet"],
            ["₺842K", "korunan sepet değeri"],
            ["7 dk", "ortalama düşünme molası"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-lg border bg-card p-5 shadow-sm">
              <p className="text-3xl font-bold text-navy">{value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="tum-urunler" className="container py-12">
        <SectionHeader
          eyebrow="Tüm ürünler"
          title="Katalogda gez"
          description={`${productPage.totalCount.toLocaleString("tr-TR")} ürünlük katalogdan ${listingProducts.length.toLocaleString("tr-TR")} ürün gösteriliyor.`}
        />
        <ProductListing
          products={listingProducts}
          categories={catalogCategories}
          totalCount={productPage.totalCount}
          currentPage={productPage.page}
          pageSize={productPage.pageSize}
          totalPages={productPage.totalPages}
          basePath="/shop"
          sidebarAdSlot={
            <AdSlot
              placement="sidebar-desktop"
              pageType="shop"
              variant="sidebar"
              slot={sidebarAdSlot}
              disableRemoteLoad
            />
          }
        />
      </section>
    </>
  );
}

function readSearchNumber(value: string | string[] | undefined, fallback: number) {
  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}
