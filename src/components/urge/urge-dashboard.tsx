"use client";

import Link from "next/link";
import { useMemo } from "react";
import { BarChart3, Clock3, HeartPulse, Layers3, PiggyBank, Sparkles } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatOrderDate } from "@/lib/format";
import { getTriggerLabel } from "@/lib/urge";
import { cn } from "@/lib/utils";
import { type SimulatedOrder, useCartStore } from "@/store/use-cart-store";

type AmountBucket = {
  today: number;
  week: number;
  month: number;
  total: number;
};

type RankedMetric = {
  label: string;
  count: number;
  amount: number;
};

export function UrgeDashboard() {
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const latestOrder = useCartStore((state) => state.latestOrder);
  const simulationHistory = useCartStore((state) => state.simulationHistory);

  const orders = useMemo(() => {
    const byId = new Map<string, SimulatedOrder>();

    for (const order of simulationHistory) {
      byId.set(order.id, order);
    }

    if (latestOrder) {
      byId.set(latestOrder.id, latestOrder);
    }

    return [...byId.values()].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [latestOrder, simulationHistory]);

  const stats = useMemo(() => buildDashboardStats(orders), [orders]);

  if (!hasHydrated) {
    return (
      <section className="grid gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-32 rounded-lg" />
        ))}
      </section>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={<HeartPulse className="h-7 w-7" aria-hidden="true" />}
        title="Henüz dürtü döngüsü yok"
        description="Bir Sanal Sipariş tamamladığında korunan tutar, dürtü değişimi ve kategori ritmin burada görünür."
        action={
          <Button asChild size="lg">
            <Link href="/shop">Sanal mağazaya git</Link>
          </Button>
        }
      />
    );
  }

  const latest = orders[0];
  const urgeReduction =
    latest.urgeBefore && latest.urgeAfter ? latest.urgeBefore - latest.urgeAfter : null;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={PiggyBank}
          label="Bugün korunan"
          value={formatCurrency(stats.saved.today)}
          tone="saved"
        />
        <MetricCard
          icon={Sparkles}
          label="Son 7 gün"
          value={formatCurrency(stats.saved.week)}
          tone="primary"
        />
        <MetricCard
          icon={BarChart3}
          label="Bu ay"
          value={formatCurrency(stats.saved.month)}
          tone="primary"
        />
        <MetricCard
          icon={Layers3}
          label="Tamamlanan simülasyon"
          value={stats.completed.toLocaleString("tr-TR")}
          tone="navy"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>Dürtü puanı trendi</CardTitle>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Son simülasyonlarda başlangıç ve kapanış puanların. Amaç kendini yargılamak
                  değil, ritmi fark etmek.
                </p>
              </div>
              <Badge variant={urgeReduction && urgeReduction > 0 ? "success" : "outline"}>
                {urgeReduction && urgeReduction > 0
                  ? `${urgeReduction} puan azalma`
                  : "Nazik takip"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.trend.map((order) => (
              <TrendRow key={order.id} order={order} />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>En sık görünen tetikleyiciler</CardTitle>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Seçtiğin etiketler isteğin hangi anlarda belirdiğini anlamaya yardım eder.
            </p>
          </CardHeader>
          <CardContent>
            {stats.triggers.length > 0 ? (
              <RankedList items={stats.triggers} valueLabel="kez" />
            ) : (
              <p className="text-sm leading-6 text-muted-foreground">
                Henüz tetikleyici etiketi seçilmedi. Bir sonraki akışta istersen ekleyebilirsin.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>En çok tetikleyen kategoriler</CardTitle>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Hangi ürün gruplarının sepet döngüsünde daha sık yer aldığını gösterir.
            </p>
          </CardHeader>
          <CardContent>
            <RankedList items={stats.categories} valueLabel="ürün" showAmount />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock3 className="h-5 w-5 text-primary" aria-hidden="true" />
              Riskli saatler
            </CardTitle>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Harcama isteğinin hangi saatlerde daha sık simülasyonla kapandığını gösterir.
            </p>
          </CardHeader>
          <CardContent>
            <RankedList items={stats.hours} valueLabel="akış" />
          </CardContent>
        </Card>
      </section>

      <Card className="border-saved/20 bg-saved/5">
        <CardContent className="grid gap-4 pt-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <h2 className="text-lg font-bold text-navy">Toplam korunan tutar</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Bugüne kadar tamamladığın simülasyonlarda gerçek para harcamadan kapanan sepet
              değeri. Doply tıbbi tedavi sunmaz; bu panel bütçe farkındalığı için tasarlanmıştır.
            </p>
          </div>
          <p className="text-4xl font-bold text-saved">{formatCurrency(stats.saved.total)}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof PiggyBank;
  label: string;
  value: string;
  tone: "saved" | "primary" | "navy";
}) {
  return (
    <Card>
      <CardContent className="pt-5">
        <span
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-md",
            tone === "saved" && "bg-saved/12 text-saved",
            tone === "primary" && "bg-primary/10 text-primary",
            tone === "navy" && "bg-navy/10 text-navy",
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <p className="mt-4 text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-bold text-navy">{value}</p>
      </CardContent>
    </Card>
  );
}

function TrendRow({ order }: { order: SimulatedOrder }) {
  const before = order.urgeBefore ?? 0;
  const after = order.urgeAfter ?? 0;

  return (
    <article className="rounded-lg border bg-background p-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-navy">{order.id}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{formatOrderDate(order.createdAt)}</p>
        </div>
        <p className="text-sm font-semibold text-saved">{formatCurrency(order.avoidedSpending)}</p>
      </div>
      <div className="mt-4 grid gap-3">
        <ScoreBar label="Önce" value={before} />
        <ScoreBar label="Sonra" value={after} muted={!order.urgeAfter} />
      </div>
    </article>
  );
}

function ScoreBar({ label, value, muted = false }: { label: string; value: number; muted?: boolean }) {
  return (
    <div className="grid grid-cols-[52px_1fr_44px] items-center gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <Progress value={(value / 10) * 100} className={cn(muted && "opacity-40")} />
      <span className="font-semibold text-navy">{value ? `${value}/10` : "-"}</span>
    </div>
  );
}

function RankedList({
  items,
  valueLabel,
  showAmount = false,
}: {
  items: RankedMetric[];
  valueLabel: string;
  showAmount?: boolean;
}) {
  if (items.length === 0) {
    return (
      <p className="text-sm leading-6 text-muted-foreground">
        Henüz yeterli veri yok. Birkaç simülasyondan sonra burada daha anlamlı örüntüler görünür.
      </p>
    );
  }

  const highest = Math.max(...items.map((item) => item.count), 1);

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="font-medium text-navy">{item.label}</span>
            <span className="text-muted-foreground">
              {item.count.toLocaleString("tr-TR")} {valueLabel}
              {showAmount ? ` · ${formatCurrency(item.amount)}` : ""}
            </span>
          </div>
          <Progress value={(item.count / highest) * 100} className="mt-2" />
        </div>
      ))}
    </div>
  );
}

function buildDashboardStats(orders: SimulatedOrder[]) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const weekStart = now.getTime() - 7 * 24 * 60 * 60 * 1000;
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const saved: AmountBucket = { today: 0, week: 0, month: 0, total: 0 };
  const categories = new Map<string, RankedMetric>();
  const triggers = new Map<string, RankedMetric>();
  const hours = new Map<string, RankedMetric>();

  for (const order of orders) {
    const timestamp = new Date(order.createdAt).getTime();
    const amount = order.avoidedSpending;
    saved.total += amount;

    if (timestamp >= todayStart) {
      saved.today += amount;
    }

    if (timestamp >= weekStart) {
      saved.week += amount;
    }

    if (timestamp >= monthStart) {
      saved.month += amount;
    }

    const hour = new Date(order.createdAt).getHours();
    incrementMetric(hours, `${String(hour).padStart(2, "0")}:00`, 1, amount);

    for (const trigger of order.triggers ?? []) {
      incrementMetric(triggers, getTriggerLabel(trigger), 1, amount);
    }

    for (const line of order.lines) {
      const categoryName = line.categoryName || line.categorySlug || "Genel";
      const lineAmount = line.price * line.quantity;
      incrementMetric(categories, categoryName, line.quantity, lineAmount);
    }
  }

  return {
    saved,
    completed: orders.length,
    categories: rankMetrics(categories, 5),
    triggers: rankMetrics(triggers, 5),
    hours: rankMetrics(hours, 4),
    trend: orders.slice(0, 8),
  };
}

function incrementMetric(
  map: Map<string, RankedMetric>,
  label: string,
  count: number,
  amount: number,
) {
  const existing = map.get(label) ?? { label, count: 0, amount: 0 };
  map.set(label, {
    ...existing,
    count: existing.count + count,
    amount: existing.amount + amount,
  });
}

function rankMetrics(map: Map<string, RankedMetric>, limit: number) {
  return [...map.values()]
    .sort((a, b) => b.count - a.count || b.amount - a.amount || a.label.localeCompare(b.label, "tr"))
    .slice(0, limit);
}
