"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { PackageCheck } from "lucide-react";

import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/store/use-cart-store";

type CheckoutEmptyGuardProps = {
  children: ReactNode;
  requireCart?: boolean;
};

export function CheckoutEmptyGuard({ children, requireCart = true }: CheckoutEmptyGuardProps) {
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const cartCount = useCartStore((state) =>
    state.cart.reduce((total, line) => total + line.quantity, 0),
  );

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

  if (requireCart && cartCount === 0) {
    return (
      <main className="container py-12">
        <EmptyState
          icon={<PackageCheck className="h-7 w-7" aria-hidden="true" />}
          title="Sanal Sipariş için ürün seç"
          description="Simülasyon akışı bir sepet üzerinden duygusal kapanış sağlar. Önce sanal sepete ürün ekleyebilirsin."
          action={
            <Button asChild size="lg">
              <Link href="/shop">Sanal mağazaya dön</Link>
            </Button>
          }
        />
      </main>
    );
  }

  return <>{children}</>;
}
