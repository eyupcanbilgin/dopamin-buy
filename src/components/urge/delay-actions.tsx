"use client";

import { Clock, Moon, WalletCards } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatOrderDate } from "@/lib/format";
import { calculateDelayUntil, type DelayMode } from "@/lib/urge";
import { useCartStore } from "@/store/use-cart-store";

const delayOptions: Array<{
  mode: DelayMode;
  label: string;
  description: string;
  icon: typeof Clock;
}> = [
  {
    mode: "ten-minutes",
    label: "10 dakika beklet",
    description: "Kısa bir mola verip isteğin yumuşuyor mu bak.",
    icon: Clock,
  },
  {
    mode: "twenty-four-hours",
    label: "24 saat beklet",
    description: "Kararı yarına taşı; bugün ödeme yok.",
    icon: Moon,
  },
  {
    mode: "salary-day",
    label: "Maaş gününe kadar beklet",
    description: "Bütçe ritmine saygı duyan daha uzun bir duraklama.",
    icon: WalletCards,
  },
];

export function DelayActions() {
  const latestOrder = useCartStore((state) => state.latestOrder);
  const setLatestOrderWaitingUntil = useCartStore((state) => state.setLatestOrderWaitingUntil);

  function handleDelay(mode: DelayMode) {
    setLatestOrderWaitingUntil(calculateDelayUntil(mode).toISOString(), mode);
  }

  return (
    <section className="rounded-lg border bg-card p-5 shadow-sm">
      <h2 className="font-semibold text-navy">Bekletme modu</h2>
      <p className="mt-1 text-sm leading-6 text-muted-foreground">
        Satın alma baskısı olmadan, seçimi biraz ileri taşıyabilirsin.
      </p>
      <div className="mt-4 grid gap-2">
        {delayOptions.map((option) => {
          const Icon = option.icon;

          return (
            <Button
              key={option.mode}
              type="button"
              variant={latestOrder?.delayMode === option.mode ? "default" : "outline"}
              className="h-auto justify-start whitespace-normal px-4 py-3 text-left"
              onClick={() => handleDelay(option.mode)}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span>
                <span className="block">{option.label}</span>
                <span className="mt-1 block text-xs font-normal opacity-80">{option.description}</span>
              </span>
            </Button>
          );
        })}
      </div>
      {latestOrder?.waitingUntil ? (
        <p className="mt-3 text-xs leading-5 text-muted-foreground" aria-live="polite">
          Bu istek {formatOrderDate(latestOrder.waitingUntil)} zamanına kadar bekletildi.
        </p>
      ) : null}
    </section>
  );
}
