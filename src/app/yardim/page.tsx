import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, ShieldCheck } from "lucide-react";

import { SimulationBadge } from "@/components/badges";
import { Container } from "@/components/layout/container";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, buildMetadata } from "@/lib/seo";

const faqs = [
  {
    question: "Bu gerçek bir alışveriş sitesi mi?",
    answer:
      "Hayır. Doply, alışveriş hissini gerçek para harcamadan yaşatan bir simülasyon platformudur. Ürünler, sepet ve Sanal Sipariş akışı duygusal kapanış için tasarlanır; gerçek satın alma oluşturmaz.",
  },
  {
    question: "Kart bilgilerim istenir mi?",
    answer:
      "Hayır. Doply kart numarası, CVV, son kullanma tarihi, kimlik numarası veya banka bilgisi istemez. Ödeme adımı yalnızca Ödeme Simülasyonu olarak çalışır.",
  },
  {
    question: "Sipariş gelir mi?",
    answer:
      "Hayır. Doply gerçek teslimat başlatmaz. Teslimat adımında açık adres toplanmaz; şehir, ilçe ve adres tipiyle güvenli bir kurgu adres oluşturulur.",
  },
  {
    question: "Bu uygulama ne işe yarar?",
    answer:
      "Doply, alışveriş dürtüsünü fark etmene, sepet deneyimini harcama yapmadan tamamlamana ve koruduğun tutarı görmene yardımcı olan destekleyici bir araçtır. Tıbbi tedavi yerine geçmez.",
  },
];

export const metadata: Metadata = buildMetadata({
  title: "Yardım ve SSS | Doply simülasyon açıklamaları",
  description:
    "Doply'nin gerçek ödeme almadığını, gerçek teslimat yapmadığını ve Sanal Sipariş akışının nasıl çalıştığını açıklayan SSS sayfası.",
  path: "/yardim",
  keywords: ["Doply SSS", "sanal sipariş", "kart bilgisi istenir mi"],
});

export default function HelpPage() {
  return (
    <main className="py-10 sm:py-14">
      <JsonLd
        data={[
          buildBreadcrumbJsonLd([
            { name: "Doply", path: "/" },
            { name: "Yardım ve SSS", path: "/yardim" },
          ]),
          buildFaqJsonLd(faqs),
        ]}
      />
      <Container size="narrow">
        <section className="rounded-lg border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <SimulationBadge />
          </div>
          <h1 className="mt-5 text-3xl font-bold leading-tight tracking-normal text-navy sm:text-4xl">
            Yardım ve SSS
          </h1>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Doply’nin simülasyon yapısını sakin ve net şekilde açıklayan kısa cevaplar.
            Mağaza deneyimi gerçekçi hissettirir; ödeme, teslimat ve sipariş sonuçları gerçek
            değildir.
          </p>
        </section>

        <section className="mt-6 grid gap-4" aria-label="Sık sorulan sorular">
          {faqs.map((faq) => (
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

        <section className="mt-6 rounded-lg border border-saved/20 bg-saved/5 p-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-navy">
            <ShieldCheck className="h-4 w-4 text-saved" aria-hidden="true" />
            Kısa özet
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Doply gerçek ödeme almaz, gerçek teslimat yapmaz, gerçek sipariş oluşturmaz ve tam
            açık adres ya da kart bilgisi toplamaz.
          </p>
          <div className="mt-5">
            <Button asChild>
              <Link href="/shop">Simülasyona dön</Link>
            </Button>
          </div>
        </section>
      </Container>
    </main>
  );
}
