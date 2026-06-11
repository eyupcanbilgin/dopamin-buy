import { Boxes } from "lucide-react";
import Link from "next/link";

import { CatalogAdminPanel } from "@/components/admin/catalog-admin-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Katalog Kalite Admin",
  description: "Doply katalog kalite kontrol paneli.",
  path: "/admin/catalog",
  noIndex: true,
});

export default function AdminCatalogPage() {
  return (
    <main className="container py-8">
      <section className="mb-6">
        <Badge variant="calm">Doply katalog kalite kontrol</Badge>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="hidden h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground sm:flex">
              <Boxes className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-normal">Katalog yönetimi</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                Büyük simülasyon kataloğunu ara, filtrele, düzenle ve toplu kalite işlemleri uygula.
                Bu panel yalnızca yetkili admin anahtarıyla veri okur veya değiştirir.
              </p>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin/ads">Reklam alanları</Link>
          </Button>
        </div>
      </section>
      <CatalogAdminPanel />
    </main>
  );
}
