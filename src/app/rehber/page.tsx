import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenText } from "lucide-react";

import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getGuidePages } from "@/lib/guides";
import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Alışveriş İsteği Rehberi",
  description:
    "Alışveriş isteğini harcama yapmadan yönetmeye yardımcı Dopamin rehberleri. Sanal Sipariş, sanal sepet ve dürtü farkındalığı hakkında açık içerikler.",
  path: "/rehber",
  keywords: ["alışveriş isteği rehberi", "sanal sepet", "sanal sipariş nedir"],
});

export default function GuideIndexPage() {
  const guides = getGuidePages();

  return (
    <main className="container py-10">
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Dopamin", path: "/" },
          { name: "Rehber", path: "/rehber" },
        ])}
      />
      <section className="mb-8 rounded-lg border bg-card p-6 shadow-sm">
        <Badge variant="simulation">Etik alışveriş simülasyonu</Badge>
        <h1 className="mt-4 text-3xl font-bold tracking-normal text-navy sm:text-4xl">
          Alışveriş isteği rehberi
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
          Dopamin&apos;in amacı alışveriş hissini gerçek para harcamadan tamamlamaya destek olmaktır.
          Bu rehberler tıbbi tedavi değil, sakin ve dürüst ürün açıklamalarıdır.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2" aria-label="Dopamin rehber yazıları">
        {guides.map((guide) => (
          <Card key={guide.slug} className="h-full">
            <CardHeader>
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <BookOpenText className="h-5 w-5" aria-hidden="true" />
              </span>
              <CardTitle className="leading-7">{guide.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">{guide.description}</p>
              <div className="mt-5 flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-muted-foreground">
                  {guide.readingTime}
                </span>
                <Button asChild variant="outline">
                  <Link href={`/rehber/${guide.slug}`}>
                    Oku
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
