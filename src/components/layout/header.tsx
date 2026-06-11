"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, HeartPulse, ShoppingBag } from "lucide-react";

import { SimulationModeBadge } from "@/components/badges";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/use-cart-store";

export function Header() {
  const pathname = usePathname();
  const cartCount = useCartStore((state) =>
    state.cart.reduce((total, line) => total + line.quantity, 0),
  );
  const navItems = [
    { href: "/shop", label: "Keşfet" },
    { href: "/shop#kategoriler", label: "Kategoriler" },
    { href: "/sepet", label: "Sepetim" },
    { href: "/dashboard", label: "Panel", icon: BarChart3 },
    { href: "/yardim", label: "Yardım" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-surface/86 shadow-[0_10px_30px_-28px_hsl(var(--navy)/0.7)] backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href="/shop"
          className="focus-ring flex items-center gap-2 rounded-md"
          aria-label="Doply mağaza ana sayfa"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-glow">
            <HeartPulse className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-normal text-navy">Doply</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Ana navigasyon">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/shop#kategoriler"
                ? false
                : item.href === "/shop"
                  ? pathname === "/shop" || pathname.startsWith("/kategori") || pathname.startsWith("/urun")
                  : pathname.startsWith(item.href);

            return (
              <Button
                key={item.href}
                variant="ghost"
                asChild
                className={active ? "bg-primary/10 text-primary" : undefined}
              >
                <Link href={item.href} aria-current={active ? "page" : undefined}>
                  {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
                  {item.label}
                </Link>
              </Button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <SimulationModeBadge className="px-2 text-[11px]" />
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
