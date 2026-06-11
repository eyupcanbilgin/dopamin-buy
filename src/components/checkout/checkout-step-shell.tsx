import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { NoRealPaymentBadge, SimulationBadge } from "@/components/badges";
import { CartSummary } from "@/components/cart-summary";
import { SavedMoneySummary } from "@/components/saved-money-summary";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { checkoutSteps, type CheckoutStepId } from "@/lib/checkout";
import { cn } from "@/lib/utils";

type CheckoutStepShellProps = {
  step: CheckoutStepId;
  title: string;
  description: string;
  children: ReactNode;
  subtotal: number;
  itemCount: number;
  backHref?: string;
  backLabel?: string;
  sidebarNote?: string;
};

export function CheckoutStepShell({
  step,
  title,
  description,
  children,
  subtotal,
  itemCount,
  backHref,
  backLabel = "Geri",
  sidebarNote = "Bu akış yalnızca Simülasyon içindir. Para çekilmez, teslimat hazırlanmaz.",
}: CheckoutStepShellProps) {
  const activeIndex = checkoutSteps.findIndex((item) => item.id === step);
  const progress = ((activeIndex + 1) / checkoutSteps.length) * 100;

  return (
    <main className="container py-8">
      {backHref ? (
        <Button asChild variant="ghost" className="mb-5 px-0">
          <Link href={backHref}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {backLabel}
          </Link>
        </Button>
      ) : null}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap gap-2">
            <SimulationBadge />
            <NoRealPaymentBadge />
          </div>
          <h1 className="mt-4 text-3xl font-bold leading-tight tracking-normal text-navy">
            {title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>
        <span className="rounded-md border bg-card px-3 py-2 text-sm font-semibold text-muted-foreground shadow-sm">
          {Math.round(progress)}% simülasyon tamamlandı
        </span>
      </div>

      <div className="mb-6 rounded-lg border bg-card p-4 shadow-card">
        <nav aria-label="Sanal Sipariş adımları" className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {checkoutSteps.map((item, index) => {
            const isActive = item.id === step;
            const isPast = index < activeIndex;

            return (
              <Link
                key={item.id}
                href={item.href}
                aria-current={isActive ? "step" : undefined}
                className={cn(
                  "focus-ring flex items-center gap-2 rounded-md border px-3 py-2 text-xs font-semibold transition",
                  isActive && "border-primary bg-primary text-primary-foreground shadow-glow",
                  isPast && !isActive && "border-saved/20 bg-saved/10 text-saved",
                  !isActive && !isPast && "border-border bg-muted text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px]",
                    isActive ? "bg-white/20" : "bg-background/80",
                  )}
                >
                  {index + 1}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Progress className="mt-4" value={progress} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section>{children}</section>
        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <CartSummary subtotal={subtotal} itemCount={itemCount} />
          <SavedMoneySummary amount={subtotal} />
          <div className="rounded-lg border bg-card p-4 text-sm leading-6 text-muted-foreground shadow-sm">
            <p className="flex items-center gap-2 font-semibold text-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
              Simülasyon güvenliği
            </p>
            <p className="mt-1">{sidebarNote}</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
