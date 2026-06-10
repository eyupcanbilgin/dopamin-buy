import Link from "next/link";
import { Megaphone } from "lucide-react";

import { AdSlotAdmin } from "@/components/admin/ad-slot-admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Reklam Alanları Admin",
  description: "Dopamin reklam alanı yapılandırma paneli.",
  path: "/admin/ads",
  noIndex: true,
});

export default function AdminAdsPage() {
  return (
    <main className="container py-8">
      <section className="mb-6">
        <Badge variant="calm">Etik monetizasyon</Badge>
        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="hidden h-12 w-12 items-center justify-center rounded-md bg-primary text-primary-foreground sm:flex">
              <Megaphone className="h-6 w-6" aria-hidden="true" />
            </span>
            <div>
              <h1 className="text-3xl font-bold tracking-normal">Reklam alanları</h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
                Sponsorlu içerikleri net etiketlerle yönet. Kritik checkout, ödeme ve kapanış
                akışlarında reklam gösterimi kapalı tutulur.
              </p>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href="/admin/catalog">Katalog paneli</Link>
          </Button>
        </div>
      </section>
      <AdSlotAdmin />
    </main>
  );
}
