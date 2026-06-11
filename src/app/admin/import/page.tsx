import { DatabaseZap } from "lucide-react";
import Link from "next/link";

import { ProductImportAdmin } from "@/components/admin/product-import-admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Ürün Import Admin",
  description: "Doply katalog import yönetimi.",
  path: "/admin/import",
  noIndex: true,
});

export default function AdminImportPage() {
  return (
    <main className="container py-8">
      <section className="mb-6">
        <Badge variant="calm">Doply veri yönetimi</Badge>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="hidden h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground sm:flex">
              <DatabaseZap className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-normal">Ürün katalog importu</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                CSV/JSON kaynaklarını veya sentetik katalog üreticisini kullanarak Doply mağaza
                simülasyonu için ürün verisi ekle. Bu akış gerçek e-ticaret siparişi, ödeme veya
                teslimat oluşturmaz.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href="/admin/catalog">Katalog kalite paneli</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/admin/ads">Reklam alanları</Link>
            </Button>
          </div>
        </div>
      </section>
      <ProductImportAdmin />
    </main>
  );
}
