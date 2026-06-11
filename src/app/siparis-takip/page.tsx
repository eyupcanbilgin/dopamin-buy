"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart3,
  Bell,
  CheckCircle2,
  Circle,
  MapPinned,
  PackageCheck,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Truck,
  WalletCards,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { EmptyState } from "@/components/empty-state";
import { SavedMoneySummary } from "@/components/saved-money-summary";
import { CravingCooldown } from "@/components/urge/craving-cooldown";
import { DelayActions } from "@/components/urge/delay-actions";
import { ReflectionCard } from "@/components/urge/reflection-card";
import { UrgeCheckIn } from "@/components/urge-check-in";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatOrderDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/use-cart-store";

const statuses = [
  "Sanal sipariş oluşturuldu",
  "Sepet hissi tamamlandı",
  "Dürtü seviyesi izleniyor",
  "Harcama engellendi",
  "Simülasyon tamamlandı",
];

const notifications = [
  "Sanal kuryen yola çıktı",
  "Gerçek para harcamadan sipariş hissi tamamlanıyor",
  "İsteğin azaldıysa simülasyonu kapatabilirsin",
];

export default function SimulatedOrderTrackingPage() {
  const latestOrder = useCartStore((state) => state.latestOrder);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const resetSession = useCartStore((state) => state.resetSession);
  const [activeStep, setActiveStep] = useState(0);
  const latestOrderId = latestOrder?.id;

  useEffect(() => {
    if (!latestOrderId) {
      return;
    }

    const startedAt = Date.now();
    const stepDurationMs = 1600;
    const updateProgress = () => {
      const elapsedSteps = Math.floor((Date.now() - startedAt) / stepDurationMs);
      setActiveStep(Math.min(elapsedSteps, statuses.length - 1));
    };

    updateProgress();
    const interval = window.setInterval(() => {
      updateProgress();
    }, 250);

    return () => window.clearInterval(interval);
  }, [latestOrderId]);

  const estimatedArrival = useMemo(() => {
    if (!latestOrder) {
      return "";
    }

    return formatOrderDate(new Date(new Date(latestOrder.createdAt).getTime() + 8 * 60 * 1000).toISOString());
  }, [latestOrder]);

  const communityMetric = useMemo(() => {
    if (!latestOrder) {
      return 128;
    }

    const number = latestOrder.id
      .split("")
      .reduce((total, character) => total + character.charCodeAt(0), 0);
    return 96 + (number % 74);
  }, [latestOrder]);

  if (!hasHydrated) {
    return (
      <main className="container py-12">
        <section className="mx-auto max-w-3xl premium-card p-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-5 h-64 w-full" />
          <Skeleton className="mt-5 h-20 w-full" />
        </section>
      </main>
    );
  }

  if (!latestOrder) {
    return (
      <main className="container py-12">
        <EmptyState
          icon={<PackageCheck className="h-7 w-7" aria-hidden="true" />}
          title="Takip edilecek Sanal Sipariş yok"
          description="Sepetine ürün ekleyip Sanal Sipariş akışını tamamladığında takip ekranı burada görünür."
          action={
            <Button asChild size="lg">
              <Link href="/shop">Mağazaya dön</Link>
            </Button>
          }
        />
      </main>
    );
  }

  const progress = activeStep / (statuses.length - 1);
  const completed = activeStep === statuses.length - 1;
  const notification = notifications[Math.min(Math.floor(activeStep / 2), notifications.length - 1)];

  return (
    <main className="container py-8">
      <section className="mb-6 overflow-hidden rounded-lg border bg-surface-strong p-5 text-white shadow-soft">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-white/20 bg-white/14 text-white">Simülasyon Modu</Badge>
              <Badge className="border-white/20 bg-white/14 text-white">Doply Rota</Badge>
            </div>
            <h1 className="mt-4 text-3xl font-bold tracking-normal">
              Sanal Sipariş takibi
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/72">
              Soyut rota kartı gerçek konum, gerçek kurye veya gerçek taşıyıcı bilgisi içermez.
              Amaç sipariş hissini güvenli ve tamamlanmış şekilde kapatmaktır.
            </p>
          </div>
          <div className="rounded-lg border border-white/14 bg-white/10 p-4 text-sm backdrop-blur">
            <p className="text-white/68">Sanal Sipariş no</p>
            <p className="mt-1 font-bold">{latestOrder.id}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-6">
          <Card className="overflow-hidden shadow-card">
            <CardHeader className="border-b bg-surface-subtle">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-primary" aria-hidden="true" />
                    Sanal kurye ilerlemesi
                  </CardTitle>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Tahmini simülasyon varışı: {estimatedArrival}
                  </p>
                </div>
                <Badge variant={completed ? "success" : "dopamine"}>
                  {completed ? "Tamamlandı" : "Yolda hissi"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <AbstractMap progress={progress} />
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Sipariş durumları</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative grid gap-4">
                {statuses.map((status, index) => {
                  const isDone = index <= activeStep;
                  const isCurrent = index === activeStep;

                  return (
                    <li key={status} className="grid grid-cols-[32px_1fr] gap-3">
                      <span
                        className={cn(
                          "mt-0.5 flex h-8 w-8 items-center justify-center rounded-full border transition",
                          isDone
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-muted-foreground",
                        )}
                      >
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <Circle className="h-4 w-4" aria-hidden="true" />
                        )}
                      </span>
                      <div className="pb-2">
                        <p className={cn("font-semibold", isCurrent && "text-primary")}>{status}</p>
                        <p className="mt-1 text-sm leading-5 text-muted-foreground">
                          {getStatusDescription(index)}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" aria-hidden="true" />
                Bildirimler
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {notifications.map((message) => (
                <div
                  key={message}
                  className={cn(
                    "rounded-lg border p-4 text-sm transition",
                    message === notification
                      ? "border-primary/30 bg-primary/5 text-navy"
                      : "bg-background text-muted-foreground",
                  )}
                >
                  {message}
                </div>
              ))}
            </CardContent>
          </Card>

          {completed ? (
            <Card className="border-saved/20 bg-[linear-gradient(135deg,hsl(var(--saved)/0.10),hsl(var(--card)))] shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-saved" aria-hidden="true" />
                  Takip tamamlandı
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
                <div>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Gerçek para harcamadan sipariş hissini tamamladın. Bu simülasyonda korunan
                    tutar:
                  </p>
                  <p className="mt-2 text-4xl font-bold text-saved">
                    {formatCurrency(latestOrder.avoidedSpending)}
                  </p>
                  <Button asChild size="lg" className="mt-5" onClick={resetSession}>
                    <Link href="/shop">
                      <RotateCcw className="h-4 w-4" aria-hidden="true" />
                      Bugünlük yeterli
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="ml-0 mt-3 sm:ml-3">
                    <Link href="/dashboard">
                      <BarChart3 className="h-4 w-4" aria-hidden="true" />
                      Panele bak
                    </Link>
                  </Button>
                </div>
                <UrgeCheckIn mode="after" compact title="Şimdi kaç / 10?" />
              </CardContent>
            </Card>
          ) : null}

          {completed ? (
            <div className="grid gap-4 lg:grid-cols-2">
              <CravingCooldown />
              <DelayActions />
            </div>
          ) : null}

          {completed ? <ReflectionCard /> : null}
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <SavedMoneySummary
            amount={latestOrder.avoidedSpending}
            label="Bu takip akışında korunan sepet değeri"
          />

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <WalletCards className="h-5 w-5 text-primary" aria-hidden="true" />
                Sipariş özeti
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Oluşturulma</span>
                  <span className="font-medium">{formatOrderDate(latestOrder.createdAt)}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Kurgusal taşıyıcı</span>
                  <span className="font-medium">Doply Rota</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Toplam sepet hissi</span>
                  <span className="font-medium">{formatCurrency(latestOrder.total)}</span>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                {latestOrder.lines.map((line, index) => (
                  <div key={`${line.productId}-${index}`} className="grid grid-cols-[56px_1fr] gap-3">
                    <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
                      <Image src={line.image} alt={line.name} fill sizes="56px" className="object-cover" />
                    </div>
                    <div>
                      <p className="line-clamp-2 text-sm font-semibold leading-5">{line.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {line.quantity} adet x {formatCurrency(line.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5 shadow-card">
            <CardContent className="pt-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-navy">
                <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                Topluluk aktivitesi
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Şu anda {communityMetric} kişi harcamadan sepet tamamlıyor.
              </p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Bu gösterge Doply içi topluluk aktivitesi olarak etiketlenir; acele ettirme amacı
                taşımaz.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}

function AbstractMap({ progress }: { progress: number }) {
  const dotX = 12 + progress * 76;
  const dotY = 70 - Math.sin(progress * Math.PI) * 42;

  return (
    <div className="relative h-[320px] overflow-hidden bg-[linear-gradient(135deg,hsl(var(--warm)),hsl(var(--surface-subtle)))]">
      <div className="absolute inset-0 opacity-70">
        <div className="absolute left-[8%] top-[18%] h-24 w-36 rounded-lg border bg-white/52 shadow-sm" />
        <div className="absolute right-[10%] top-[16%] h-28 w-44 rounded-lg border bg-white/44 shadow-sm" />
        <div className="absolute bottom-[14%] left-[18%] h-24 w-48 rounded-lg border bg-white/44 shadow-sm" />
        <div className="absolute bottom-[20%] right-[18%] h-20 w-32 rounded-lg border bg-white/52 shadow-sm" />
      </div>

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden="true">
        <path
          d="M12 70 C 28 32, 46 84, 62 42 S 78 30, 88 58"
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <motion.path
          d="M12 70 C 28 32, 46 84, 62 42 S 78 30, 88 58"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: progress }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </svg>

      <motion.span
        className="absolute flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow-glow"
        animate={{ left: `${dotX}%`, top: `${dotY}%` }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <span className="h-2.5 w-2.5 rounded-full bg-white" />
      </motion.span>

      <div className="absolute bottom-4 left-4 right-4 rounded-lg border bg-white/88 p-4 shadow-sm backdrop-blur">
        <p className="flex items-center gap-2 text-sm font-semibold text-navy">
          <MapPinned className="h-4 w-4 text-primary" aria-hidden="true" />
          Soyut rota simülasyonu
        </p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Harita yalnızca kapanış hissi için çizilmiştir; gerçek adres veya konum içermez.
        </p>
      </div>
    </div>
  );
}

function getStatusDescription(index: number) {
  const descriptions = [
    "Sipariş numarası oluşturuldu ve sepet akışı kayıt altına alındı.",
    "Ürün seçme ve sepete ekleme döngüsü tamamlandı.",
    "Başlangıç ve kapanış dürtü puanları için nazik takip sürüyor.",
    "Sepet tutarı Doply indirimiyle dengelendi.",
    "Takip akışı kapanışa ulaştı; artık devam etmek zorunda değilsin.",
  ];

  return descriptions[index];
}
