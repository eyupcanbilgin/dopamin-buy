"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight } from "lucide-react";

import { CheckoutCartList } from "@/components/checkout/checkout-cart-list";
import { CheckoutEmptyGuard } from "@/components/checkout/checkout-empty-guard";
import { CheckoutStepShell } from "@/components/checkout/checkout-step-shell";
import { TriggerSelector } from "@/components/urge/trigger-selector";
import { UrgeCheckIn } from "@/components/urge-check-in";
import { Button } from "@/components/ui/button";
import { resolveCartLineProduct } from "@/lib/cart-line-product";
import { useCartStore } from "@/store/use-cart-store";

export default function CheckoutPage() {
  const cart = useCartStore((state) => state.cart);
  const urgeBefore = useCartStore((state) => state.urgeBefore);
  const urgeTriggers = useCartStore((state) => state.urgeTriggers);
  const setUrgeTriggers = useCartStore((state) => state.setUrgeTriggers);

  const lines = useMemo(
    () =>
      cart
        .map((line) => {
          const product = resolveCartLineProduct(line);
          return product ? { product, quantity: line.quantity } : null;
        })
        .filter((line): line is NonNullable<typeof line> => Boolean(line)),
    [cart],
  );

  const itemCount = lines.reduce((total, line) => total + line.quantity, 0);
  const subtotal = lines.reduce((total, line) => total + line.product.price * line.quantity, 0);

  return (
    <CheckoutEmptyGuard>
      <CheckoutStepShell
        step="review"
        title="Sanal Sipariş ön izlemesi"
        description="Sepetini gözden geçir ve alışveriş dürtüsünü ölç. Bu adım bir ticari işlem başlatmaz; yalnızca Simülasyon akışına hazırlar."
        subtotal={subtotal}
        itemCount={itemCount}
        backHref="/sepet"
        backLabel="Sanal sepete dön"
      >
        <div className="space-y-5">
          <CheckoutCartList lines={lines} />
          <UrgeCheckIn mode="before" title="Şu an alışveriş isteğin kaç / 10?" />
          <TriggerSelector value={urgeTriggers} onChange={setUrgeTriggers} />
          <div className="premium-card p-4">
            <p className="text-sm leading-6 text-muted-foreground">
              Devam etmek için dürtü seviyeni seç. Tetikleyici etiketleri isteğe bağlıdır; kapanış
              ekranında ve panelde kendi alışveriş ritmini daha net görmene yardım eder.
            </p>
            <div className="mt-4 flex justify-end">
              {urgeBefore ? (
                <Button asChild size="lg">
                  <Link href="/checkout/teslimat">
                    Teslimat Simülasyonuna Geç
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              ) : (
                <Button size="lg" disabled>
                  Önce dürtü puanı seç
                </Button>
              )}
            </div>
          </div>
        </div>
      </CheckoutStepShell>
    </CheckoutEmptyGuard>
  );
}
