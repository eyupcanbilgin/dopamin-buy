"use client";

import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Category, Product } from "@/lib/catalog";
import { cn } from "@/lib/utils";

type ProductListingProps = {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
  showCategoryFilter?: boolean;
  sidebarAdSlot?: ReactNode;
  midFeedAdSlot?: ReactNode;
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
  basePath?: string;
};

type SortKey = "popular" | "price-asc" | "price-desc" | "rating" | "discount";
type PriceBand = "all" | "under-500" | "500-2000" | "2000-10000" | "over-10000";

const priceBands: Array<{ id: PriceBand; label: string; predicate: (product: Product) => boolean }> = [
  { id: "all", label: "Tüm fiyatlar", predicate: () => true },
  { id: "under-500", label: "500 TL altı", predicate: (product) => product.price < 500 },
  {
    id: "500-2000",
    label: "500 - 2.000 TL",
    predicate: (product) => product.price >= 500 && product.price <= 2_000,
  },
  {
    id: "2000-10000",
    label: "2.000 - 10.000 TL",
    predicate: (product) => product.price > 2_000 && product.price <= 10_000,
  },
  { id: "over-10000", label: "10.000 TL üzeri", predicate: (product) => product.price > 10_000 },
];

export function ProductListing({
  products,
  categories,
  initialCategory = "all",
  showCategoryFilter = true,
  sidebarAdSlot,
  midFeedAdSlot,
  totalCount,
  currentPage = 1,
  pageSize,
  totalPages = 1,
  basePath,
}: ProductListingProps) {
  const [category, setCategory] = useState(initialCategory);
  const [priceBand, setPriceBand] = useState<PriceBand>("all");
  const [sort, setSort] = useState<SortKey>("popular");
  const [campaignOnly, setCampaignOnly] = useState(false);
  const [highRating, setHighRating] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    setShowSkeleton(true);
    const timeout = window.setTimeout(() => setShowSkeleton(false), 180);

    return () => window.clearTimeout(timeout);
  }, [category, priceBand, sort, campaignOnly, highRating]);

  const visibleProducts = useMemo(() => {
    const pricePredicate = priceBands.find((band) => band.id === priceBand)?.predicate ?? (() => true);

    return products
      .filter((product) => (category === "all" ? true : product.category === category))
      .filter(pricePredicate)
      .filter((product) => (campaignOnly ? Boolean(product.compareAtPrice) : true))
      .filter((product) => (highRating ? product.rating >= 4.3 : true))
      .sort((a, b) => {
        if (sort === "price-asc") return a.price - b.price;
        if (sort === "price-desc") return b.price - a.price;
        if (sort === "rating") return b.rating - a.rating;
        if (sort === "discount") return (b.discountPercentage ?? 0) - (a.discountPercentage ?? 0);
        return (b.popularityScore ?? b.reviewCount) - (a.popularityScore ?? a.reviewCount);
      });
  }, [campaignOnly, category, highRating, priceBand, products, sort]);

  const filterContent = (
    <FilterControls
      categories={categories}
      category={category}
      setCategory={setCategory}
      priceBand={priceBand}
      setPriceBand={setPriceBand}
      campaignOnly={campaignOnly}
      setCampaignOnly={setCampaignOnly}
      highRating={highRating}
      setHighRating={setHighRating}
      showCategoryFilter={showCategoryFilter}
    />
  );
  const midFeedInsertionIndex = Math.min(8, Math.max(0, visibleProducts.length - 1));
  const catalogTotal = totalCount ?? products.length;
  const pagination =
    basePath && pageSize && totalPages > 1
      ? {
          basePath,
          pageSize,
          totalPages,
        }
      : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[272px_1fr]">
      <aside className="hidden lg:block">
        <div className="sticky top-24 grid gap-4">
          <div className="rounded-lg border bg-card p-4 shadow-card">{filterContent}</div>
          {sidebarAdSlot}
        </div>
      </aside>

      <section aria-label="Ürün listesi" className="min-w-0">
        <div className="mb-4 flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-navy">
              Bu sayfada {visibleProducts.length.toLocaleString("tr-TR")} ürün
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Toplam {catalogTotal.toLocaleString("tr-TR")} ürünlük katalogda sayfa{" "}
              {currentPage.toLocaleString("tr-TR")} / {Math.max(1, totalPages).toLocaleString("tr-TR")}.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="lg:hidden"
              onClick={() => setMobileFiltersOpen(true)}
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Filtrele
            </Button>
            <label className="sr-only" htmlFor="sort-products">
              Ürünleri sırala
            </label>
            <select
              id="sort-products"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="focus-ring h-10 rounded-md border bg-background px-3 text-sm font-medium shadow-sm"
            >
              <option value="popular">Popüler öneriler</option>
              <option value="discount">Sepet avantajı yüksek</option>
              <option value="rating">Puanı yüksek</option>
              <option value="price-asc">Fiyat artan</option>
              <option value="price-desc">Fiyat azalan</option>
            </select>
          </div>
        </div>

        {showSkeleton ? (
          <ProductListingSkeleton />
        ) : visibleProducts.length > 0 ? (
          <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {visibleProducts.map((product, index) => {
              const nodes = [
                <ProductCard key={product.id} product={product} />,
              ];

              if (midFeedAdSlot && index === midFeedInsertionIndex) {
                nodes.unshift(<Fragment key={`ad-${product.id}`}>{midFeedAdSlot}</Fragment>);
              }

              return nodes;
            })}
          </motion.div>
        ) : (
          <div className="rounded-lg border bg-card p-8 text-center shadow-card">
            <h2 className="text-xl font-bold text-navy">Bu filtrelerde ürün bulunamadı</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Fiyat aralığını veya kategori seçimini genişleterek daha fazla ürüne bakabilirsin.
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-5"
              onClick={() => {
                setCategory(initialCategory);
                setPriceBand("all");
                setCampaignOnly(false);
                setHighRating(false);
              }}
            >
              Filtreleri temizle
            </Button>
          </div>
        )}

        {pagination ? (
          <PaginationControls
            basePath={pagination.basePath}
            currentPage={currentPage}
            pageSize={pagination.pageSize}
            totalPages={pagination.totalPages}
            totalCount={catalogTotal}
          />
        ) : null}
      </section>

      <AnimatePresence>
        {mobileFiltersOpen ? (
          <motion.div
            className="fixed inset-0 z-[80] bg-black/35 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileFiltersOpen(false)}
          >
            <motion.div
              className="absolute inset-x-0 bottom-0 max-h-[84svh] overflow-auto rounded-t-lg border-t bg-card p-5 shadow-soft"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">Filtreler</h2>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Filtre panelini kapat"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </Button>
              </div>
              {filterContent}
              <Button type="button" className="mt-5 w-full" onClick={() => setMobileFiltersOpen(false)}>
                Ürünleri göster
              </Button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function PaginationControls({
  basePath,
  currentPage,
  pageSize,
  totalPages,
  totalCount,
}: {
  basePath: string;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}) {
  const previousPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(totalPages, currentPage + 1);

  return (
    <nav
      className="mt-5 flex flex-col gap-3 rounded-lg border bg-card p-4 shadow-card sm:flex-row sm:items-center sm:justify-between"
      aria-label="Ürün sayfaları"
    >
      <p className="text-sm text-muted-foreground">
        {totalCount.toLocaleString("tr-TR")} üründen sayfa{" "}
        {currentPage.toLocaleString("tr-TR")} / {totalPages.toLocaleString("tr-TR")}
      </p>
      <div className="flex gap-2">
        <Button asChild variant="outline" aria-disabled={currentPage <= 1}>
          <Link
            href={createPageHref(basePath, previousPage, pageSize)}
            tabIndex={currentPage <= 1 ? -1 : undefined}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : undefined}
          >
            Önceki
          </Link>
        </Button>
        <Button asChild variant="outline" aria-disabled={currentPage >= totalPages}>
          <Link
            href={createPageHref(basePath, nextPage, pageSize)}
            tabIndex={currentPage >= totalPages ? -1 : undefined}
            className={currentPage >= totalPages ? "pointer-events-none opacity-50" : undefined}
          >
            Sonraki
          </Link>
        </Button>
      </div>
    </nav>
  );
}

function createPageHref(basePath: string, page: number, pageSize: number) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("pageSize", String(pageSize));
  return `${basePath}?${params.toString()}`;
}

function FilterControls({
  categories,
  category,
  setCategory,
  priceBand,
  setPriceBand,
  campaignOnly,
  setCampaignOnly,
  highRating,
  setHighRating,
  showCategoryFilter,
}: {
  categories: Category[];
  category: string;
  setCategory: (value: string) => void;
  priceBand: PriceBand;
  setPriceBand: (value: PriceBand) => void;
  campaignOnly: boolean;
  setCampaignOnly: (value: boolean) => void;
  highRating: boolean;
  setHighRating: (value: boolean) => void;
  showCategoryFilter: boolean;
}) {
  return (
    <div className="grid gap-5">
      {showCategoryFilter ? (
        <FilterGroup title="Kategori">
          <FilterPill active={category === "all"} onClick={() => setCategory("all")}>
            Tümü
          </FilterPill>
          {categories.map((item) => (
            <FilterPill
              key={item.slug}
              active={category === item.slug}
              onClick={() => setCategory(item.slug)}
            >
              {item.name}
            </FilterPill>
          ))}
        </FilterGroup>
      ) : null}

      <FilterGroup title="Fiyat aralığı">
        {priceBands.map((band) => (
          <FilterPill key={band.id} active={priceBand === band.id} onClick={() => setPriceBand(band.id)}>
            {band.label}
          </FilterPill>
        ))}
      </FilterGroup>

      <FilterGroup title="Öne çıkanlar">
        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={campaignOnly}
            onChange={(event) => setCampaignOnly(event.target.checked)}
            className="h-4 w-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          Sepet avantajı olanlar
        </label>
        <label className="flex cursor-pointer items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={highRating}
            onChange={(event) => setHighRating(event.target.checked)}
            className="h-4 w-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          4.3+ puan
        </label>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-bold text-navy">{title}</h3>
      <div className="flex flex-wrap gap-2 lg:grid">{children}</div>
    </div>
  );
}

function FilterPill({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "focus-ring rounded-md border px-3 py-2 text-left text-sm font-medium shadow-sm transition",
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-navy",
      )}
    >
      {children}
    </button>
  );
}

function ProductListingSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" aria-label="Ürünler yükleniyor">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="rounded-lg border bg-card p-3 shadow-sm">
          <Skeleton className="aspect-[4/3] w-full rounded-md" />
          <div className="mt-4 flex items-center justify-between gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-14" />
          </div>
          <Skeleton className="mt-3 h-5 w-full" />
          <Skeleton className="mt-2 h-4 w-2/3" />
          <Skeleton className="mt-5 h-10 w-full rounded-md" />
        </div>
      ))}
    </div>
  );
}
