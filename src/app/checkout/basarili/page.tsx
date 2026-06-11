"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BarChart3,
  BookHeart,
  CheckCircle2,
  Clock,
  RotateCcw,
  ShieldCheck,
  Smile,
  Truck,
} from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { SavedMoneySummary } from "@/components/saved-money-summary";
import { CravingCooldown } from "@/components/urge/craving-cooldown";
import { DelayActions } from "@/components/urge/delay-actions";
import { ReflectionCard } from "@/components/urge/reflection-card";
import { UrgeCheckIn } from "@/components/urge-check-in";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatOrderDate } from "@/lib/format";
import { useCartStore } from "@/store/use-cart-store";

export default function CheckoutSuccessPage() {
  const latestOrder = useCartStore((state) => state.latestOrder);
  const resetSession = useCartStore((state) => state.resetSession);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const setUrgeAfter = useCartStore((state) => state.setUrgeAfter);
  const markLatestOrderJournaled = useCartStore((state) => state.markLatestOrderJournaled);
  const setLatestOrderWaitingUntil = useCartStore((state) => state.setLatestOrderWaitingUntil);

  if (!hasHydrated) {
    return (
      <main className="container py-12">
        <section className="mx-auto max-w-2xl premium-card p-8">
          <Skeleton className="mx-auto h-14 w-14" />
          <Skeleton className="mx-auto mt-5 h-9 w-72" />
          <Skeleton className="mx-auto mt-3 h-5 w-full max-w-md" />
          <Skeleton className="mx-auto mt-2 h-5 w-80" />
        </section>
      </main>
    );
  }

  if (!latestOrder) {
    return (
      <main className="container py-12">
        <EmptyState
          icon={<ShieldCheck className="h-7 w-7" aria-hidden="true" />}
          title="Henüz sanal sipariş yok"
          description="Kapanış ekranı için önce sanal sepete ürün ekleyip checkout simülasyonunu tamamla."
          action={
            <Button asChild size="lg">
              <Link href="/shop">Sanal mağazaya dön</Link>
            </Button>
          }
        />
      </main>
    );
  }

  const before = latestOrder.urgeBefore;
  const after = latestOrder.urgeAfter;
  const delta = before && after ? before - after : null;
  const waitingUntil = latestOrder.waitingUntil ? formatOrderDate(latestOrder.waitingUntil) : null;

  function handleReliefClick() {
    setUrgeAfter(Math.max(1, (before ?? 5) - 3));
  }

  function handleWaitClick() {
    setLatestOrderWaitingUntil(new Date(Date.now() + 10 * 60 * 1000).toISOString(), "ten-minutes");
  }

  return (
    <main className="container py-8">
      <section className="overflow-hidden rounded-lg border border-saved/20 bg-[linear-gradient(135deg,hsl(var(--card)),hsl(var(--saved)/0.08))] p-6 shadow-soft">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:items-start">
          <div>
            <span className="flex h-14 w-14 items-center justify-center rounded-md bg-success text-success-foreground shadow-lift">
              <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
            </span>
            <h1 className="mt-5 text-3xl font-bold tracking-normal">
              Sanal Sipariş tamamlandı.
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
              Gerçek para harcamadan sipariş hissini tamamladın. Ödeme alınmadı, teslimat
              hazırlanmadı, mağaza işlemi başlatılmadı.
            </p>
            <div className="mt-6 grid gap-3 rounded-lg border bg-card/72 p-4 text-sm shadow-sm sm:grid-cols-3">
              <div>
                <p className="text-muted-foreground">Sanal Sipariş no</p>
                <p className="mt-1 font-bold">{latestOrder.id}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Simülasyon zamanı</p>
                <p className="mt-1 font-bold">{formatOrderDate(latestOrder.createdAt)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Sanal sepet değeri</p>
                <p className="mt-1 font-bold text-saved">
                  {formatCurrency(latestOrder.avoidedSpending)}
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 rounded-lg border bg-background p-4 text-sm shadow-sm sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground">Dürtü önce</p>
                <p className="mt-1 text-xl font-bold text-navy">
                  {before ? `${before}/10` : "Seçilmedi"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Dürtü sonra</p>
                <p className="mt-1 text-xl font-bold text-primary">
                  {after ? `${after}/10` : "Henüz ölçülmedi"}
                </p>
              </div>
            </div>
          </div>
          <SavedMoneySummary
            amount={latestOrder.avoidedSpending}
            label="Bu simülasyonda harcamadığın toplam tutar"
          />
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-5">
          <UrgeCheckIn mode="after" title="Şimdi kaç / 10?" />
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Dürtü kapanışı</CardTitle>
            </CardHeader>
            <CardContent>
              {delta === null ? (
                <p className="text-sm leading-6 text-muted-foreground">
                  Simülasyondan sonraki dürtü seviyeni seçtiğinde değişim burada görünecek.
                </p>
              ) : delta > 0 ? (
                <p className="text-sm leading-6 text-muted-foreground">
                  Dürtü seviyen {before}/10 seviyesinden {after}/10 seviyesine indi. Alışveriş
                  hissini gerçek harcama yapmadan tamamladın.
                </p>
              ) : delta === 0 ? (
                <p className="text-sm leading-6 text-muted-foreground">
                  Dürtü seviyen aynı kaldı. Bu da değerli bir gözlem; kısa bir mola veya güvendiğin
                  biriyle konuşmak yardımcı olabilir.
                </p>
              ) : (
                <p className="text-sm leading-6 text-muted-foreground">
                  Dürtü seviyen yükseldi. Doply tıbbi tedavi değildir; zorlayıcı hislerde profesyonel
                  destek almak iyi bir seçenek olabilir.
                </p>
              )}
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Kapanış aksiyonları</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <Button type="button" variant="calm" onClick={handleReliefClick}>
                <Smile className="h-4 w-4" aria-hidden="true" />
                İsteğim Azaldı
              </Button>
              <Button type="button" variant="outline" onClick={handleWaitClick}>
                <Clock className="h-4 w-4" aria-hidden="true" />
                10 Dakika Beklet
              </Button>
              <Button type="button" variant="outline" onClick={markLatestOrderJournaled}>
                <BookHeart className="h-4 w-4" aria-hidden="true" />
                Dürtü Günlüğüne Ekle
              </Button>
              <Button asChild variant="outline">
                <Link href="/siparis-takip">
                  <Truck className="h-4 w-4" aria-hidden="true" />
                  Sanal Siparişi Takip Et
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard">
                  <BarChart3 className="h-4 w-4" aria-hidden="true" />
                  Panele Bak
                </Link>
              </Button>
              <Button asChild variant="outline" onClick={resetSession}>
                <Link href="/shop">
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  Yeni Simülasyon Başlat
                </Link>
              </Button>
            </CardContent>
          </Card>
          <div className="grid gap-4 lg:grid-cols-2">
            <CravingCooldown />
            <DelayActions />
          </div>
          <ReflectionCard />
          {(waitingUntil || latestOrder.journalEntryAdded) ? (
            <Card>
              <CardContent className="pt-5">
                {waitingUntil ? (
                  <p className="text-sm leading-6 text-muted-foreground">
                    Sanal Sipariş molası {waitingUntil} zamanına kadar bekletildi. Geri sayım yok;
                    sadece nazik bir duraklama niyeti var.
                  </p>
                ) : null}
                {latestOrder.journalEntryAdded ? (
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Dürtü günlüğüne eklendi: “Harcamadan tamamladım, sepet değeri korundu.”
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ) : null}
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Sanal sepet içeriği</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {latestOrder.lines.map((line, index) => (
                <div key={line.productId}>
                  <div className="grid grid-cols-[64px_1fr] gap-3">
                    <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
                      <Image src={line.image} alt={line.name} fill sizes="64px" className="object-cover" />
                    </div>
                    <div>
                      <p className="font-medium leading-5">{line.name}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {line.quantity} adet x {formatCurrency(line.price)}
                      </p>
                    </div>
                  </div>
                  {index < latestOrder.lines.length - 1 ? <Separator className="mt-4" /> : null}
                </div>
              ))}
            </CardContent>
          </Card>
          <div className="grid gap-2">
            <Button asChild size="lg" onClick={resetSession}>
              <Link href="/shop">
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Yeni Simülasyon Başlat
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Kavrama dön</Link>
            </Button>
          </div>
        </aside>
      </div>
    </main>
  );
}
