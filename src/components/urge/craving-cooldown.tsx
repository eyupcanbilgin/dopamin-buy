"use client";

import { useEffect, useMemo, useState } from "react";
import { TimerReset } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/use-cart-store";

const COOLDOWN_MS = 2 * 60 * 1000;

export function CravingCooldown() {
  const cooldownUntil = useCartStore((state) => state.latestOrder?.cooldownUntil ?? null);
  const setLatestOrderCooldownUntil = useCartStore((state) => state.setLatestOrderCooldownUntil);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!cooldownUntil) {
      return;
    }

    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [cooldownUntil]);

  const remainingSeconds = useMemo(() => {
    if (!cooldownUntil) {
      return 0;
    }

    return Math.max(0, Math.ceil((new Date(cooldownUntil).getTime() - now) / 1000));
  }, [cooldownUntil, now]);

  function startCooldown() {
    setLatestOrderCooldownUntil(new Date(Date.now() + COOLDOWN_MS).toISOString());
    setNow(Date.now());
  }

  return (
    <section className="rounded-lg border bg-card p-5 shadow-sm">
      <h2 className="flex items-center gap-2 font-semibold text-navy">
        <TimerReset className="h-5 w-5 text-primary" aria-hidden="true" />
        İstek soğuma molası
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        2 dakika bekle ve isteğinin geçip geçmediğini kontrol et. Bu bir test değil; sadece nazik
        bir duraklama.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button type="button" variant={remainingSeconds > 0 ? "outline" : "default"} onClick={startCooldown}>
          2 dakikalık mola başlat
        </Button>
        {cooldownUntil ? (
          <p className="text-sm font-medium text-navy" aria-live="polite">
            {remainingSeconds > 0
              ? `${Math.floor(remainingSeconds / 60)}:${String(remainingSeconds % 60).padStart(2, "0")} kaldı`
              : "Mola tamamlandı. İsteğin hâlâ aynı mı diye nazikçe bakabilirsin."}
          </p>
        ) : null}
      </div>
    </section>
  );
}
