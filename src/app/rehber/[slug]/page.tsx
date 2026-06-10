import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, HelpCircle } from "lucide-react";

import { AdSlot } from "@/components/ad-slot";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPublicAdSlot } from "@/lib/ad-server";
import { getGuidePageBySlug, getGuidePages } from "@/lib/guides";
import {
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
  buildGuideArticleJsonLd,
  buildMetadata,
} from "@/lib/seo";

type GuidePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getGuidePages().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuidePageBySlug(slug);

  if (!guide) {
    return buildMetadata({
      title: "Rehber yazısı",
      description:
        "Dopamin alışveriş simülasyonu ve Sanal Sipariş hakkında dürüst rehber içerikleri.",
      path: `/rehber/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: guide.title,
    description: guide.description,
    path: `/rehber/${guide.slug}`,
    type: "article",
    keywords: guide.keywords,
  });
}

export default async function GuideDetailPage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuidePageBySlug(slug);

  if (!guide) {
    notFound();
  }

  const guideAdSlot = await getPublicAdSlot("guide-inline");

  return (
    <main className="container py-10">
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Dopamin", path: "/" },
            { name: "Rehber", path: "/rehber" },
            { name: guide.title, path: `/rehber/${guide.slug}` },
          ]),
          buildGuideArticleJsonLd({
            title: guide.title,
            description: guide.description,
            path: `/rehber/${guide.slug}`,
            dateModified: guide.updatedAt,
          }),
          buildFaqJsonLd(guide.faqs),
        ]}
      />

      <Button asChild variant="ghost" className="mb-5 px-0">
        <Link href="/rehber">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Rehbere dön
        </Link>
      </Button>

      <article className="mx-auto max-w-3xl">
        <header className="rounded-lg border bg-card p-6 shadow-sm">
          <Badge variant="simulation">Dopamin rehber</Badge>
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-normal text-navy sm:text-4xl">
            {guide.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">{guide.intro}</p>
          <p className="mt-4 text-xs font-medium text-muted-foreground">
            {guide.readingTime} · Güncellendi:{" "}
            {new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(
              new Date(guide.updatedAt),
            )}
          </p>
        </header>

        <div className="mt-8 space-y-6">
          {guide.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-bold tracking-normal text-navy">{section.title}</h2>
              <p className="mt-3 text-base leading-8 text-muted-foreground">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="mt-8">
          <AdSlot
            placement="guide-inline"
            pageType="guide"
            variant="inline"
            slot={guideAdSlot}
            disableRemoteLoad
          />
        </div>

        <section className="mt-10 rounded-lg border border-dopamine/35 bg-dopamine/10 p-5">
          <h2 className="font-semibold text-navy">Kısa not</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Dopamin gerçek ödeme almaz, gerçek teslimat yapmaz ve tıbbi tedavi iddiasında
            bulunmaz. Deneyim, alışveriş hissini daha güvenli bir simülasyon alanında tamamlamaya
            odaklanır.
          </p>
        </section>

        <section className="mt-10 grid gap-4" aria-label="Sık sorulan sorular">
          <h2 className="text-2xl font-bold tracking-normal text-navy">Sık sorulan sorular</h2>
          {guide.faqs.map((faq) => (
            <Card key={faq.question}>
              <CardHeader>
                <CardTitle className="flex items-start gap-3 text-base leading-6">
                  <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  {faq.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      </article>
    </main>
  );
}
