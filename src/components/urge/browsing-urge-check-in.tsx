"use client";

import { useMemo } from "react";
import { ArrowRight, HeartPulse } from "lucide-react";

import { TriggerSelector } from "@/components/urge/trigger-selector";
import { UrgeCheckIn } from "@/components/urge-check-in";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/use-cart-store";

export function BrowsingUrgeCheckIn() {
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const urgeBefore = useCartStore((state) => state.urgeBefore);
  const urgeTriggers = useCartStore((state) => state.urgeTriggers);
  const setUrgeTriggers = useCartStore((state) => state.setUrgeTriggers);
  const dismissedAt = useCartStore((state) => state.browseCheckInDismissedAt);
  const dismissBrowseCheckIn = useCartStore((state) => state.dismissBrowseCheckIn);

  const dismissedToday = useMemo(() => {
    if (!dismissedAt) {
      return false;
    }

    return new Date(dismissedAt).toDateString() === new Date().toDateString();
  }, [dismissedAt]);

  if (!hasHydrated || urgeBefore || dismissedToday) {
    return null;
  }

  return (
    <section className="container py-5">
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
          <div className="flex items-start gap-3 lg:w-72">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <HeartPulse className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-semibold text-navy">Gezmeden önce küçük bir check-in</h2>
              <p className="mt-1 text-sm leading-5 text-muted-foreground">
                İstersen alışveriş isteğini ve tetikleyiciyi not et; istemezsen doğrudan devam et.
              </p>
              <Button type="button" variant="ghost" size="sm" className="mt-2" onClick={dismissBrowseCheckIn}>
                Sonra bakarım
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
          <div className="grid flex-1 gap-4 xl:grid-cols-2">
            <UrgeCheckIn mode="before" compact title="Şu an alışveriş isteğin kaç / 10?" />
            <TriggerSelector value={urgeTriggers} onChange={setUrgeTriggers} compact />
          </div>
        </div>
      </div>
    </section>
  );
}
