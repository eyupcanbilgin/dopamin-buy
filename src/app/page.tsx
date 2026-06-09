import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, HeartPulse, ShieldCheck, Sparkles } from "lucide-react";

import { CategoryGrid } from "@/components/category-grid";
import { Reveal } from "@/components/motion/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const principles = [
  {
    icon: ShieldCheck,
    title: "Gerçek ödeme yok",
    text: "Kart numarası, CVV, son kullanma tarihi, kimlik numarası veya açık adres istenmez.",
  },
  {
    icon: HeartPulse,
    title: "Dürtüyü azaltmaya odaklı",
    text: "Sanal sepet ve kapanış ekranı, alışveriş hissini tamamlayıp düşünme alanı açar.",
  },
  {
    icon: BadgeCheck,
    title: "Açık simülasyon dili",
    text: "Sanal Sipariş, Simülasyon ve Gerçek ödeme yok ifadeleri deneyim boyunca görünür kalır.",
  },
];

export default function LandingPage() {
  return (
    <>
      <section className="relative min-h-[76svh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1800&q=85"
          alt="Modern mağaza vitrininde seçili ürünler"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(19,24,24,0.82),rgba(19,24,24,0.46),rgba(19,24,24,0.14))]" />
        <div className="container relative flex min-h-[76svh] items-center py-16">
          <Reveal className="max-w-3xl text-white">
            <Badge className="border-white/20 bg-white/14 text-white backdrop-blur">
              Simülasyon alışveriş alanı
            </Badge>
            <h1 className="mt-5 max-w-2xl text-5xl font-bold leading-tight tracking-normal sm:text-6xl">
              Dopamin
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/86">
              Alışveriş dürtüsünü gerçek para harcamadan, ticari kayıt oluşturmadan ve seni
              yanıltmadan tamamlamaya yardımcı olan premium sanal alışveriş deneyimi.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="bg-white text-foreground hover:bg-white/90">
                <Link href="/shop">
                  Deneyimi başlat
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/40 bg-white/8 text-white hover:bg-white/16 hover:text-white"
              >
                <Link href="#etik-ilkeler">Etik ilkeler</Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="etik-ilkeler" className="container py-16">
        <Reveal className="mx-auto max-w-3xl text-center">
          <Badge variant="calm">Destekleyici araç, tıbbi tedavi değil</Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-normal sm:text-4xl">
            Gerçek alışveriş hissi, gerçek finansal sonuçlar olmadan.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Dopamin, sepete ekleme, teslimat seçme ve sanal ödeme adımlarını hissettirir; ancak
            satın alma, ödeme, kargo veya ticari teslimat süreci oluşturmaz.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {principles.map((principle, index) => (
            <Reveal key={principle.title} delay={index * 0.08}>
              <Card className="h-full shadow-sm">
                <CardHeader>
                  <span className="flex h-11 w-11 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                    <principle.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <CardTitle>{principle.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-6 text-muted-foreground">{principle.text}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="border-y bg-card/62 py-16">
        <div className="container grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
          <Reveal>
            <Badge variant="success">Sanal Sipariş</Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-normal">
              Dürtünün döngüsünü kapat, bütçeni koru.
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              Kullanıcı önce dürtüsünü puanlar, ürünleri sanal sepete ekler, ödeme yerine
              simülasyon yöntemi seçer ve sonunda kaçınılan harcamayı görür.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge variant="outline">Gerçek teslimat yok</Badge>
              <Badge variant="outline">Kart bilgisi yok</Badge>
              <Badge variant="outline">Sipariş yanılsaması yok</Badge>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  label: "1",
                  title: "Keşfet",
                  text: "Premium mağaza hissiyle ürünlere bak.",
                },
                {
                  label: "2",
                  title: "Simüle et",
                  text: "Teslimat ve ödeme adımlarını güvenle tamamla.",
                },
                {
                  label: "3",
                  title: "Kapanışı gör",
                  text: "Kaçınılan harcamayı ve dürtü değişimini fark et.",
                },
              ].map((step) => (
                <div key={step.label} className="rounded-lg border bg-background p-5 shadow-sm">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
                    {step.label}
                  </span>
                  <h3 className="mt-4 font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="container py-16">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Badge variant="secondary">Kategoriler</Badge>
            <h2 className="mt-3 text-3xl font-bold tracking-normal">Sanal mağaza vitrinleri</h2>
          </div>
          <Button asChild variant="outline">
            <Link href="/shop">
              Mağazaya geç
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
        <CategoryGrid />
      </section>
    </>
  );
}
