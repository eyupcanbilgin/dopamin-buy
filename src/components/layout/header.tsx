"use client";

import Link from "next/link";
import { HeartPulse, ShoppingBag } from "lucide-react";

import { NoRealPaymentBadge } from "@/components/badges";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/use-cart-store";

export function Header() {
  const cartCount = useCartStore((state) =>
    state.cart.reduce((total, line) => total + line.quantity, 0),
  );

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-surface/90 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="focus-ring flex items-center gap-2 rounded-md"
          aria-label="Dopamin ana sayfa"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-glow">
            <HeartPulse className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-normal text-navy">Dopamin</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Ana navigasyon">
          <Button variant="ghost" asChild>
            <Link href="/shop">Keşfet</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/shop#kategoriler">Kategoriler</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/checkout">Simülasyon</Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          <NoRealPaymentBadge className="hidden sm:inline-flex" />
          <Button variant="outline" size="icon" asChild aria-label="Sepeti görüntüle">
            <Link href="/sepet" className="relative">
              <ShoppingBag className="h-5 w-5" aria-hidden="true" />
              {cartCount > 0 ? (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-dopamine px-1 text-[11px] font-bold text-dopamine-foreground">
                  {cartCount}
                </span>
              ) : null}
            </Link>
          </Button>
        </div>
      </Container>
    </header>
  );
}
