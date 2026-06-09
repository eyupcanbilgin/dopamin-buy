"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight } from "lucide-react";

import { CheckoutCartList } from "@/components/checkout/checkout-cart-list";
import { CheckoutEmptyGuard } from "@/components/checkout/checkout-empty-guard";
import { CheckoutStepShell } from "@/components/checkout/checkout-step-shell";
import { UrgeCheckIn } from "@/components/urge-check-in";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/catalog";
import { useCartStore } from "@/store/use-cart-store";

export default function CheckoutPage() {
  const cart = useCartStore((state) => state.cart);
  const urgeBefore = useCartStore((state) => state.urgeBefore);

  const lines = useMemo(
    () =>
      cart
        .map((line) => {
          const product = products.find((item) => item.id === line.productId);
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
          <UrgeCheckIn mode="before" />
          <div className="premium-card p-4">
            <p className="text-sm leading-6 text-muted-foreground">
              Devam etmek için dürtü seviyeni seç. Bu puan kapanış ekranında değişimi görmene
              yardımcı olur ve ödeme bilgisiyle ilişkili değildir.
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
