"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Home, ShoppingBag, Sparkles, Store } from "lucide-react";

import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/use-cart-store";

const items = [
  { href: "/shop", label: "Ana", icon: Home },
  { href: "/shop#kategoriler", label: "Keşfet", icon: Store },
  { href: "/sepet", label: "Sepet", icon: ShoppingBag },
  { href: "/checkout", label: "Akış", icon: Sparkles },
  { href: "/dashboard", label: "Panel", icon: BarChart3 },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const cartCount = useCartStore((state) =>
    state.cart.reduce((total, line) => total + line.quantity, 0),
  );

  return (
    <nav
      aria-label="Mobil hızlı navigasyon"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-surface/94 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-[0_-16px_40px_-28px_hsl(var(--navy)/0.72)] backdrop-blur-xl md:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/shop#kategoriler"
              ? false
              : item.href === "/shop"
                ? pathname === "/shop"
                : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "focus-ring relative flex min-h-12 flex-col items-center justify-center gap-1 rounded-md px-2 text-[11px] font-semibold text-muted-foreground transition",
                active && "bg-primary/10 text-primary shadow-sm",
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              <span>{item.label}</span>
              {item.href === "/sepet" && cartCount > 0 ? (
                <span className="absolute right-4 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-dopamine px-1 text-[10px] font-bold text-dopamine-foreground shadow-sm">
                  {cartCount}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
      <span className="sr-only">Doply mobil menüsü Simülasyon Modu içinde çalışır.</span>
    </nav>
  );
}
