import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { UrgeDashboard } from "@/components/urge/urge-dashboard";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Dürtü Paneli",
  description: "Dopamin kişisel simülasyon ve korunan tutar paneli.",
  path: "/dashboard",
  noIndex: true,
});

export default function DashboardPage() {
  return (
    <main className="container py-8">
      <section className="mb-6 rounded-lg border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">Dopamin Panel</p>
            <h1 className="mt-2 text-3xl font-bold tracking-normal text-navy">
              Harcamadan tamamlanan istekler
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Korunan tutarları, tetikleyici kategorileri ve dürtü puanı değişimini sakin bir
              özet halinde takip et. Bu alan tıbbi değerlendirme yapmaz.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/shop">
              Yeni simülasyon
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </section>

      <UrgeDashboard />
    </main>
  );
}
