"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  DatabaseZap,
  Edit3,
  EyeOff,
  FileClock,
  ImageOff,
  Loader2,
  Save,
  Search,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatOrderDate } from "@/lib/format";

type CatalogMeta = {
  categories: Array<{ id: string; name: string; slug: string }>;
  brands: Array<{ id: string; name: string; slug: string }>;
  sources: string[];
};

type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: { id: string; name: string; slug: string };
  brand: { id: string; name: string; slug: string };
  priceCents: number;
  compareAtPriceCents: number | null;
  discountPercentage: number;
  merchantName: string | null;
  rating: number;
  reviewCount: number;
  dopamineScore: number;
  simulatedDeliveryEstimate: string | null;
  catalogSource: string;
  isActive: boolean;
  images: Array<{ id: string; url: string; altText: string; sortOrder: number }>;
  missingImage: boolean;
  invalidPrice: boolean;
  updatedAt: string;
};

type ProductsResponse = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  products: AdminProduct[];
};

type QualityResponse = {
  metrics: {
    totalProducts: number;
    productsWithoutImages: number;
    duplicateCandidates: number;
    suspiciousPrices: number;
  };
  categoryDistribution: Array<{ categoryId: string; name: string; slug: string; count: number }>;
  importHistory: Array<{
    id: string;
    source: string;
    provider: string;
    totalRows: number;
    importedCount: number;
    skippedCount: number;
    duplicateCount: number;
    errors: unknown;
    createdAt: string;
  }>;
  auditLogs: Array<{
    id: string;
    action: string;
    entityType: string;
    entityId: string | null;
    summary: string;
    metadata: unknown;
    createdAt: string;
  }>;
};

type ProductFormState = {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  brandId: string;
  priceTl: string;
  oldPriceTl: string;
  discountPercentage: string;
  merchantName: string;
  rating: string;
  reviewCount: string;
  dopamineScore: string;
  simulatedDeliveryEstimate: string;
  imageUrls: string;
};

const emptyProductsResponse: ProductsResponse = {
  page: 1,
  pageSize: 50,
  total: 0,
  totalPages: 1,
  products: [],
};

export function CatalogAdminPanel() {
  const [adminKey, setAdminKey] = useState("");
  const [meta, setMeta] = useState<CatalogMeta>({ categories: [], brands: [], sources: [] });
  const [quality, setQuality] = useState<QualityResponse | null>(null);
  const [productsResponse, setProductsResponse] = useState<ProductsResponse>(emptyProductsResponse);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [formState, setFormState] = useState<ProductFormState | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 350);
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [source, setSource] = useState("");
  const [missingImage, setMissingImage] = useState(false);
  const [invalidPrice, setInvalidPrice] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [bulkAction, setBulkAction] = useState("publish");
  const [bulkCategoryId, setBulkCategoryId] = useState("");
  const [bulkConfirmed, setBulkConfirmed] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingPanel, setLoadingPanel] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [runningBulk, setRunningBulk] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const authHeaders = useMemo(
    () => ({
      "x-dopamin-admin-key": adminKey,
    }),
    [adminKey],
  );

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const allCurrentPageSelected =
    productsResponse.products.length > 0 &&
    productsResponse.products.every((product) => selectedSet.has(product.id));

  const fetchMetaAndQuality = useCallback(async () => {
    if (!adminKey.trim()) {
      return;
    }

    setLoadingPanel(true);
    setError("");

    try {
      const [metaResponse, qualityResponse] = await Promise.all([
        fetch("/api/admin/catalog/meta", { headers: authHeaders }),
        fetch("/api/admin/catalog/quality", { headers: authHeaders }),
      ]);

      const metaPayload = await metaResponse.json();
      const qualityPayload = await qualityResponse.json();

      if (!metaResponse.ok) {
        throw new Error(metaPayload.error || "Katalog meta verisi alınamadı.");
      }

      if (!qualityResponse.ok) {
        throw new Error(qualityPayload.error || "Kalite metrikleri alınamadı.");
      }

      setMeta(metaPayload as CatalogMeta);
      setQuality(qualityPayload as QualityResponse);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Admin panel yüklenemedi.");
    } finally {
      setLoadingPanel(false);
    }
  }, [adminKey, authHeaders]);

  const fetchProducts = useCallback(async () => {
    if (!adminKey.trim()) {
      return;
    }

    setLoadingProducts(true);
    setError("");

    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });

    if (debouncedSearch.trim()) {
      params.set("search", debouncedSearch.trim());
    }

    if (categoryId) {
      params.set("categoryId", categoryId);
    }

    if (brandId) {
      params.set("brandId", brandId);
    }

    if (source) {
      params.set("source", source);
    }

    if (missingImage) {
      params.set("missingImage", "true");
    }

    if (invalidPrice) {
      params.set("invalidPrice", "true");
    }

    try {
      const response = await fetch(`/api/admin/catalog/products?${params.toString()}`, {
        headers: authHeaders,
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Ürünler alınamadı.");
      }

      setProductsResponse(payload as ProductsResponse);
      setSelectedIds((current) =>
        current.filter((id) => (payload as ProductsResponse).products.some((product) => product.id === id)),
      );
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Ürünler alınamadı.");
    } finally {
      setLoadingProducts(false);
    }
  }, [
    adminKey,
    authHeaders,
    brandId,
    categoryId,
    debouncedSearch,
    invalidPrice,
    missingImage,
    page,
    pageSize,
    source,
  ]);

  useEffect(() => {
    void fetchMetaAndQuality();
  }, [fetchMetaAndQuality, refreshKey]);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts, refreshKey]);

  useEffect(() => {
    setPage(1);
  }, [brandId, categoryId, debouncedSearch, invalidPrice, missingImage, pageSize, source]);

  function startEditing(product: AdminProduct) {
    setEditingProduct(product);
    setFormState(createFormState(product));
    setNotice("");
    setError("");
  }

  function toggleSelected(productId: string) {
    setSelectedIds((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  }

  function toggleCurrentPage() {
    if (allCurrentPageSelected) {
      setSelectedIds((current) =>
        current.filter((id) => !productsResponse.products.some((product) => product.id === id)),
      );
      return;
    }

    setSelectedIds((current) => Array.from(new Set([...current, ...productsResponse.products.map((product) => product.id)])));
  }

  async function saveProduct() {
    if (!editingProduct || !formState) {
      return;
    }

    setSavingProduct(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`/api/admin/catalog/products/${editingProduct.id}`, {
        method: "PATCH",
        headers: {
          ...authHeaders,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          name: formState.name,
          slug: formState.slug,
          description: formState.description,
          shortDescription: formState.shortDescription,
          categoryId: formState.categoryId,
          brandId: formState.brandId,
          priceCents: tlToCents(formState.priceTl),
          compareAtPriceCents: formState.oldPriceTl.trim() ? tlToCents(formState.oldPriceTl) : null,
          discountPercentage: Number(formState.discountPercentage || 0),
          merchantName: formState.merchantName || null,
          rating: Number(formState.rating || 0),
          reviewCount: Number(formState.reviewCount || 0),
          dopamineScore: Number(formState.dopamineScore || 0),
          simulatedDeliveryEstimate: formState.simulatedDeliveryEstimate || null,
          images: formState.imageUrls
            .split("\n")
            .map((url) => url.trim())
            .filter(Boolean),
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Ürün kaydedilemedi.");
      }

      setNotice("Ürün kaydedildi ve audit log oluşturuldu.");
      setEditingProduct(null);
      setFormState(null);
      setRefreshKey((value) => value + 1);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Ürün kaydedilemedi.");
    } finally {
      setSavingProduct(false);
    }
  }

  async function runBulkAction() {
    if (selectedIds.length === 0) {
      setError("Bulk işlem için ürün seç.");
      return;
    }

    if (!bulkConfirmed) {
      setError("Bulk işlemden önce güvenli işlem onayını işaretle.");
      return;
    }

    setRunningBulk(true);
    setError("");
    setNotice("");

    try {
      const response = await fetch("/api/admin/catalog/products/bulk", {
        method: "POST",
        headers: {
          ...authHeaders,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          action: bulkAction,
          productIds: selectedIds,
          categoryId: bulkAction === "update-category" ? bulkCategoryId : undefined,
          confirmation: bulkAction === "delete-selected" ? deleteConfirmation : undefined,
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Bulk işlem tamamlanamadı.");
      }

      setNotice(`${payload.affectedCount ?? selectedIds.length} ürün için bulk işlem tamamlandı.`);
      setSelectedIds([]);
      setBulkConfirmed(false);
      setDeleteConfirmation("");
      setRefreshKey((value) => value + 1);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Bulk işlem tamamlanamadı.");
    } finally {
      setRunningBulk(false);
    }
  }

  if (!adminKey.trim()) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <Badge variant="simulation" className="w-fit">
            Admin korumalı alan
          </Badge>
          <CardTitle>Katalog panelini aç</CardTitle>
          <CardDescription className="max-w-2xl leading-6">
            Ürün verisi, kalite metrikleri ve bulk işlemler yalnızca admin anahtarıyla yüklenir.
            Anahtar tarayıcıda saklanmaz.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <Label htmlFor="catalog-admin-key">Admin anahtarı</Label>
          <Input
            id="catalog-admin-key"
            type="password"
            value={adminKey}
            onChange={(event) => setAdminKey(event.target.value)}
            autoComplete="off"
            className="max-w-xl"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex flex-col gap-3 pt-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-navy">
              <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
              Admin oturumu aktif
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Okuma ve yazma istekleri admin anahtarıyla korunuyor.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href="/admin/import">
                <DatabaseZap className="h-4 w-4" aria-hidden="true" />
                Import paneli
              </Link>
            </Button>
            <Button type="button" variant="outline" onClick={() => setAdminKey("")}>
              Anahtarı unut
            </Button>
          </div>
        </CardContent>
      </Card>

      {error ? (
        <Card className="border-destructive/40 bg-destructive/5" role="alert">
          <CardContent className="pt-5">
            <p className="font-semibold text-destructive">İşlem tamamlanamadı</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      ) : null}

      {notice ? (
        <Card className="border-saved/30 bg-saved/5" aria-live="polite">
          <CardContent className="flex items-center gap-2 pt-5">
            <CheckCircle2 className="h-5 w-5 text-saved" aria-hidden="true" />
            <p className="text-sm font-medium text-navy">{notice}</p>
          </CardContent>
        </Card>
      ) : null}

      <QualityDashboard quality={quality} loading={loadingPanel} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="grid gap-4">
          <ProductFilters
            meta={meta}
            search={search}
            setSearch={setSearch}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
            brandId={brandId}
            setBrandId={setBrandId}
            source={source}
            setSource={setSource}
            missingImage={missingImage}
            setMissingImage={setMissingImage}
            invalidPrice={invalidPrice}
            setInvalidPrice={setInvalidPrice}
            pageSize={pageSize}
            setPageSize={setPageSize}
          />

          <BulkActions
            meta={meta}
            selectedCount={selectedIds.length}
            bulkAction={bulkAction}
            setBulkAction={setBulkAction}
            bulkCategoryId={bulkCategoryId}
            setBulkCategoryId={setBulkCategoryId}
            bulkConfirmed={bulkConfirmed}
            setBulkConfirmed={setBulkConfirmed}
            deleteConfirmation={deleteConfirmation}
            setDeleteConfirmation={setDeleteConfirmation}
            runBulkAction={runBulkAction}
            runningBulk={runningBulk}
          />

          <ProductTable
            response={productsResponse}
            selectedSet={selectedSet}
            allCurrentPageSelected={allCurrentPageSelected}
            loading={loadingProducts}
            toggleCurrentPage={toggleCurrentPage}
            toggleSelected={toggleSelected}
            startEditing={startEditing}
            page={page}
            setPage={setPage}
          />
        </section>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <ProductEditPanel
            meta={meta}
            product={editingProduct}
            formState={formState}
            setFormState={setFormState}
            saveProduct={saveProduct}
            saving={savingProduct}
            close={() => {
              setEditingProduct(null);
              setFormState(null);
            }}
          />
          <HistoryPanel quality={quality} />
        </aside>
      </div>
    </div>
  );
}

function ProductFilters({
  meta,
  search,
  setSearch,
  categoryId,
  setCategoryId,
  brandId,
  setBrandId,
  source,
  setSource,
  missingImage,
  setMissingImage,
  invalidPrice,
  setInvalidPrice,
  pageSize,
  setPageSize,
}: {
  meta: CatalogMeta;
  search: string;
  setSearch: (value: string) => void;
  categoryId: string;
  setCategoryId: (value: string) => void;
  brandId: string;
  setBrandId: (value: string) => void;
  source: string;
  setSource: (value: string) => void;
  missingImage: boolean;
  setMissingImage: (value: boolean) => void;
  invalidPrice: boolean;
  setInvalidPrice: (value: boolean) => void;
  pageSize: number;
  setPageSize: (value: number) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-primary" aria-hidden="true" />
          Ürün filtreleri
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="grid gap-2">
            <Label htmlFor="product-search">Arama</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="product-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Ürün, slug, mağaza veya anahtar kelime"
                className="pl-9"
              />
            </div>
          </div>
          <SelectField
            id="category-filter"
            label="Kategori"
            value={categoryId}
            onChange={setCategoryId}
            options={meta.categories.map((category) => ({ value: category.id, label: category.name }))}
            emptyLabel="Tüm kategoriler"
          />
          <SelectField
            id="brand-filter"
            label="Marka"
            value={brandId}
            onChange={setBrandId}
            options={meta.brands.map((brand) => ({ value: brand.id, label: brand.name }))}
            emptyLabel="Tüm markalar"
          />
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_1fr]">
          <SelectField
            id="source-filter"
            label="Import kaynağı"
            value={source}
            onChange={setSource}
            options={meta.sources.map((item) => ({ value: item, label: item }))}
            emptyLabel="Tüm kaynaklar"
          />
          <SelectField
            id="page-size"
            label="Sayfa boyutu"
            value={String(pageSize)}
            onChange={(value) => setPageSize(Number(value))}
            options={[25, 50, 100].map((value) => ({ value: String(value), label: `${value} ürün` }))}
            emptyLabel="Sayfa boyutu"
          />
          <ToggleField
            id="missing-image-filter"
            checked={missingImage}
            onChange={setMissingImage}
            label="Eksik/placeholder görsel"
            description="Görselsiz veya placeholder kullanan ürünleri göster."
          />
          <ToggleField
            id="invalid-price-filter"
            checked={invalidPrice}
            onChange={setInvalidPrice}
            label="Geçersiz fiyat"
            description="Sıfır veya hatalı fiyat kayıtlarını göster."
          />
        </div>
      </CardContent>
    </Card>
  );
}

function BulkActions({
  meta,
  selectedCount,
  bulkAction,
  setBulkAction,
  bulkCategoryId,
  setBulkCategoryId,
  bulkConfirmed,
  setBulkConfirmed,
  deleteConfirmation,
  setDeleteConfirmation,
  runBulkAction,
  runningBulk,
}: {
  meta: CatalogMeta;
  selectedCount: number;
  bulkAction: string;
  setBulkAction: (value: string) => void;
  bulkCategoryId: string;
  setBulkCategoryId: (value: string) => void;
  bulkConfirmed: boolean;
  setBulkConfirmed: (value: boolean) => void;
  deleteConfirmation: string;
  setDeleteConfirmation: (value: string) => void;
  runBulkAction: () => void;
  runningBulk: boolean;
}) {
  return (
    <Card className="border-dopamine/30 bg-dopamine/5">
      <CardHeader>
        <CardTitle>Güvenli bulk işlemler</CardTitle>
        <CardDescription>
          Seçili ürünler üzerinde toplu işlem yap. Silme işlemi için ek yazılı onay gerekir.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_1fr]">
          <SelectField
            id="bulk-action"
            label={`İşlem (${selectedCount} seçili)`}
            value={bulkAction}
            onChange={setBulkAction}
            options={[
              { value: "publish", label: "Yayınla" },
              { value: "unpublish", label: "Yayından kaldır" },
              { value: "update-category", label: "Kategori güncelle" },
              { value: "regenerate-prices", label: "Fiyatları yeniden üret" },
              { value: "regenerate-dopamin-scores", label: "Dopamin skorlarını yenile" },
              { value: "delete-selected", label: "Seçilenleri sil" },
            ]}
            emptyLabel="İşlem seç"
          />
          {bulkAction === "update-category" ? (
            <SelectField
              id="bulk-category"
              label="Hedef kategori"
              value={bulkCategoryId}
              onChange={setBulkCategoryId}
              options={meta.categories.map((category) => ({ value: category.id, label: category.name }))}
              emptyLabel="Kategori seç"
            />
          ) : (
            <ToggleField
              id="bulk-confirm"
              checked={bulkConfirmed}
              onChange={setBulkConfirmed}
              label="Bu bulk işlemi onaylıyorum"
              description="İşlem audit log’a kaydedilir."
            />
          )}
        </div>

        {bulkAction === "update-category" ? (
          <ToggleField
            id="bulk-confirm-category"
            checked={bulkConfirmed}
            onChange={setBulkConfirmed}
            label="Kategori değişikliğini onaylıyorum"
            description="Seçili ürünlerin kategori ilişkisi güncellenir."
          />
        ) : null}

        {bulkAction === "delete-selected" ? (
          <div className="grid gap-2">
            <Label htmlFor="delete-confirmation">Silme onayı</Label>
            <Input
              id="delete-confirmation"
              value={deleteConfirmation}
              onChange={(event) => setDeleteConfirmation(event.target.value)}
              placeholder="Silmek için SIL yaz"
            />
          </div>
        ) : null}

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={runBulkAction}
            disabled={selectedCount === 0 || runningBulk}
            variant={bulkAction === "delete-selected" ? "destructive" : "default"}
          >
            {runningBulk ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
            Seçili ürünlere uygula
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductTable({
  response,
  selectedSet,
  allCurrentPageSelected,
  loading,
  toggleCurrentPage,
  toggleSelected,
  startEditing,
  page,
  setPage,
}: {
  response: ProductsResponse;
  selectedSet: Set<string>;
  allCurrentPageSelected: boolean;
  loading: boolean;
  toggleCurrentPage: () => void;
  toggleSelected: (id: string) => void;
  startEditing: (product: AdminProduct) => void;
  page: number;
  setPage: (value: number) => void;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
        <div>
          <CardTitle>Ürün tablosu</CardTitle>
          <CardDescription>
            {response.total.toLocaleString("tr-TR")} ürün, sayfa {response.page} / {response.totalPages}
          </CardDescription>
        </div>
        {loading ? <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden="true" /> : null}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-[980px] w-full text-left text-sm">
            <thead className="bg-secondary/70 text-xs text-muted-foreground">
              <tr>
                <th className="w-10 px-3 py-3">
                  <input
                    type="checkbox"
                    aria-label="Bu sayfadaki ürünleri seç"
                    checked={allCurrentPageSelected}
                    onChange={toggleCurrentPage}
                    className="h-4 w-4 rounded border-input"
                  />
                </th>
                <th className="px-3 py-3 font-medium">Ürün</th>
                <th className="px-3 py-3 font-medium">Kategori / Marka</th>
                <th className="px-3 py-3 font-medium">Fiyat</th>
                <th className="px-3 py-3 font-medium">Skor</th>
                <th className="px-3 py-3 font-medium">Kaynak</th>
                <th className="px-3 py-3 font-medium">Kalite</th>
                <th className="px-3 py-3 font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {response.products.map((product) => (
                <tr key={product.id} className="border-t align-top">
                  <td className="px-3 py-3">
                    <input
                      type="checkbox"
                      aria-label={`${product.name} ürününü seç`}
                      checked={selectedSet.has(product.id)}
                      onChange={() => toggleSelected(product.id)}
                      className="h-4 w-4 rounded border-input"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <div className="max-w-[280px]">
                      <p className="font-semibold text-navy">{product.name}</p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">{product.slug}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Güncelleme: {formatOrderDate(product.updatedAt)}
                      </p>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-medium">{product.category.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{product.brand.name}</p>
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-semibold">{formatCents(product.priceCents)}</p>
                    {product.compareAtPriceCents ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Eski: {formatCents(product.compareAtPriceCents)} · %{product.discountPercentage}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-3 py-3">
                    <p>{product.rating.toFixed(1)} puan</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Dopamin {product.dopamineScore.toFixed(1)} · {product.reviewCount} yorum
                    </p>
                  </td>
                  <td className="px-3 py-3">
                    <Badge variant="outline">{product.catalogSource}</Badge>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {product.isActive ? "Yayında" : "Pasif"}
                    </p>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {product.missingImage ? (
                        <Badge variant="dopamine" className="gap-1">
                          <ImageOff className="h-3 w-3" aria-hidden="true" />
                          Görsel
                        </Badge>
                      ) : null}
                      {product.invalidPrice ? (
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                          Fiyat
                        </Badge>
                      ) : null}
                      {!product.isActive ? (
                        <Badge variant="secondary" className="gap-1">
                          <EyeOff className="h-3 w-3" aria-hidden="true" />
                          Pasif
                        </Badge>
                      ) : null}
                      {!product.missingImage && !product.invalidPrice && product.isActive ? (
                        <Badge variant="success">Temiz</Badge>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <Button type="button" variant="outline" size="sm" onClick={() => startEditing(product)}>
                      <Edit3 className="h-4 w-4" aria-hidden="true" />
                      Düzenle
                    </Button>
                  </td>
                </tr>
              ))}
              {response.products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-3 py-10 text-center text-muted-foreground">
                    Bu filtrelerle ürün bulunamadı.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage(Math.max(1, page - 1))}
          >
            Önceki
          </Button>
          <p className="text-sm text-muted-foreground">
            {response.total.toLocaleString("tr-TR")} kayıttan{" "}
            {response.products.length.toLocaleString("tr-TR")} ürün gösteriliyor
          </p>
          <Button
            type="button"
            variant="outline"
            disabled={page >= response.totalPages}
            onClick={() => setPage(Math.min(response.totalPages, page + 1))}
          >
            Sonraki
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductEditPanel({
  meta,
  product,
  formState,
  setFormState,
  saveProduct,
  saving,
  close,
}: {
  meta: CatalogMeta;
  product: AdminProduct | null;
  formState: ProductFormState | null;
  setFormState: (value: ProductFormState) => void;
  saveProduct: () => void;
  saving: boolean;
  close: () => void;
}) {
  if (!product || !formState) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ürün düzenleme</CardTitle>
          <CardDescription>Tablodan bir ürün seçtiğinde detay formu burada açılır.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm leading-6 text-muted-foreground">
          Başlık, slug, kategori, marka, fiyat, görseller ve simülasyon metadata alanlarını hızlıca
          düzenleyebilirsin.
        </CardContent>
      </Card>
    );
  }

  const setField = (field: keyof ProductFormState, value: string) =>
    setFormState({ ...formState, [field]: value });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit3 className="h-5 w-5 text-primary" aria-hidden="true" />
          Ürün düzenleme
        </CardTitle>
        <CardDescription>{product.id}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <TextField id="edit-title" label="Başlık" value={formState.name} onChange={(value) => setField("name", value)} />
        <TextField id="edit-slug" label="Slug" value={formState.slug} onChange={(value) => setField("slug", value)} />
        <div className="grid gap-3 sm:grid-cols-2">
          <SelectField
            id="edit-category"
            label="Kategori"
            value={formState.categoryId}
            onChange={(value) => setField("categoryId", value)}
            options={meta.categories.map((category) => ({ value: category.id, label: category.name }))}
            emptyLabel="Kategori seç"
          />
          <SelectField
            id="edit-brand"
            label="Marka"
            value={formState.brandId}
            onChange={(value) => setField("brandId", value)}
            options={meta.brands.map((brand) => ({ value: brand.id, label: brand.name }))}
            emptyLabel="Marka seç"
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <TextField id="edit-price" label="Fiyat (TL)" value={formState.priceTl} onChange={(value) => setField("priceTl", value)} type="number" />
          <TextField id="edit-old-price" label="Eski fiyat (TL)" value={formState.oldPriceTl} onChange={(value) => setField("oldPriceTl", value)} type="number" />
          <TextField id="edit-discount" label="İndirim (%)" value={formState.discountPercentage} onChange={(value) => setField("discountPercentage", value)} type="number" />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <TextField id="edit-rating" label="Rating" value={formState.rating} onChange={(value) => setField("rating", value)} type="number" />
          <TextField id="edit-reviews" label="Yorum sayısı" value={formState.reviewCount} onChange={(value) => setField("reviewCount", value)} type="number" />
          <TextField id="edit-dopamin-score" label="Dopamin skoru" value={formState.dopamineScore} onChange={(value) => setField("dopamineScore", value)} type="number" />
        </div>
        <TextField id="edit-merchant" label="Sanal mağaza" value={formState.merchantName} onChange={(value) => setField("merchantName", value)} />
        <TextField
          id="edit-delivery"
          label="Simülasyon teslimat tahmini"
          value={formState.simulatedDeliveryEstimate}
          onChange={(value) => setField("simulatedDeliveryEstimate", value)}
        />
        <div className="grid gap-2">
          <Label htmlFor="edit-short-description">Kısa açıklama</Label>
          <Textarea
            id="edit-short-description"
            value={formState.shortDescription}
            onChange={(event) => setField("shortDescription", event.target.value)}
            className="min-h-20"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="edit-description">Açıklama</Label>
          <Textarea
            id="edit-description"
            value={formState.description}
            onChange={(event) => setField("description", event.target.value)}
            className="min-h-28"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="edit-images">Görsel URL’leri</Label>
          <Textarea
            id="edit-images"
            value={formState.imageUrls}
            onChange={(event) => setField("imageUrls", event.target.value)}
            className="min-h-28 font-mono text-xs"
          />
          <p className="text-xs leading-5 text-muted-foreground">Her satıra bir güvenli/izinli görsel URL’si gir.</p>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={close}>
            Kapat
          </Button>
          <Button type="button" onClick={saveProduct} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Save className="h-4 w-4" aria-hidden="true" />}
            Kaydet
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function QualityDashboard({ quality, loading }: { quality: QualityResponse | null; loading: boolean }) {
  const maxCategoryCount = Math.max(1, ...(quality?.categoryDistribution.map((item) => item.count) ?? [1]));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" aria-hidden="true" />
          Veri kalite panosu
        </CardTitle>
        <CardDescription>Eksik, şüpheli veya dengesiz katalog verilerini hızlıca yakala.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5">
        {loading ? (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Kalite metrikleri yükleniyor...
          </p>
        ) : null}
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Toplam ürün" value={quality?.metrics.totalProducts ?? 0} />
          <MetricCard label="Görsel kontrolü" value={quality?.metrics.productsWithoutImages ?? 0} tone="warning" />
          <MetricCard label="Duplicate adayları" value={quality?.metrics.duplicateCandidates ?? 0} tone="warning" />
          <MetricCard label="Şüpheli fiyat" value={quality?.metrics.suspiciousPrices ?? 0} tone="warning" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-navy">Kategori dağılımı</h3>
          <div className="mt-3 grid gap-2">
            {(quality?.categoryDistribution.slice(0, 8) ?? []).map((item) => (
              <div key={item.categoryId} className="grid gap-1">
                <div className="flex justify-between gap-3 text-xs">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground">{item.count.toLocaleString("tr-TR")}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.max(4, (item.count / maxCategoryCount) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function HistoryPanel({ quality }: { quality: QualityResponse | null }) {
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileClock className="h-5 w-5 text-primary" aria-hidden="true" />
            Import geçmişi
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(quality?.importHistory ?? []).map((history) => (
            <div key={history.id} className="rounded-lg border bg-background p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-navy">{history.source}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {history.provider} · {formatOrderDate(history.createdAt)}
                  </p>
                </div>
                <Badge variant={history.skippedCount > 0 ? "dopamine" : "success"}>
                  {history.importedCount.toLocaleString("tr-TR")} import
                </Badge>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Toplam {history.totalRows.toLocaleString("tr-TR")} · atlanan{" "}
                {history.skippedCount.toLocaleString("tr-TR")} · duplicate{" "}
                {history.duplicateCount.toLocaleString("tr-TR")} · hata{" "}
                {getImportErrorCount(history.errors).toLocaleString("tr-TR")}
              </p>
            </div>
          ))}
          {(quality?.importHistory.length ?? 0) === 0 ? (
            <p className="text-sm text-muted-foreground">Henüz import geçmişi yok.</p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audit log</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(quality?.auditLogs ?? []).map((log) => (
            <div key={log.id} className="rounded-lg border bg-background p-3">
              <p className="text-sm font-semibold text-navy">{log.summary}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {log.action} · {formatOrderDate(log.createdAt)}
              </p>
            </div>
          ))}
          {(quality?.auditLogs.length ?? 0) === 0 ? (
            <p className="text-sm text-muted-foreground">Henüz audit log yok.</p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  emptyLabel,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  emptyLabel: string;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <option value="">{emptyLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ToggleField({
  id,
  checked,
  onChange,
  label,
  description,
}: {
  id: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  description: string;
}) {
  return (
    <Label htmlFor={id} className="flex min-h-10 cursor-pointer items-start gap-3 rounded-lg border bg-background p-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-input"
      />
      <span>
        <span className="block text-sm font-semibold text-navy">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-muted-foreground">{description}</span>
      </span>
    </Label>
  );
}

function TextField({
  id,
  label,
  value,
  onChange,
  type = "text",
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  );
}

function MetricCard({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number;
  tone?: "default" | "warning";
}) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className={tone === "warning" && value > 0 ? "mt-1 text-2xl font-bold text-dopamine-foreground" : "mt-1 text-2xl font-bold text-navy"}>
        {value.toLocaleString("tr-TR")}
      </p>
    </div>
  );
}

function createFormState(product: AdminProduct): ProductFormState {
  return {
    name: product.name,
    slug: product.slug,
    description: product.description,
    shortDescription: product.shortDescription,
    categoryId: product.category.id,
    brandId: product.brand.id,
    priceTl: centsToTlInput(product.priceCents),
    oldPriceTl: product.compareAtPriceCents ? centsToTlInput(product.compareAtPriceCents) : "",
    discountPercentage: product.discountPercentage ? String(product.discountPercentage) : "0",
    merchantName: product.merchantName ?? "",
    rating: String(product.rating),
    reviewCount: String(product.reviewCount),
    dopamineScore: String(product.dopamineScore),
    simulatedDeliveryEstimate: product.simulatedDeliveryEstimate ?? "",
    imageUrls: product.images.map((image) => image.url).join("\n"),
  };
}

function formatCents(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 2,
  }).format(value / 100);
}

function centsToTlInput(value: number) {
  return String(Number((value / 100).toFixed(2)));
}

function tlToCents(value: string) {
  return Math.round(Number(value.replace(",", ".")) * 100);
}

function getImportErrorCount(errors: unknown) {
  return Array.isArray(errors) ? errors.length : 0;
}

function useDebouncedValue(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeout);
  }, [delay, value]);

  return debouncedValue;
}
