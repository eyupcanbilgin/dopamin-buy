"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShieldCheck, Trash2 } from "lucide-react";

import { CartSummary } from "@/components/cart-summary";
import { EmptyState } from "@/components/empty-state";
import { SavedMoneySummary } from "@/components/saved-money-summary";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { resolveCartLineProduct } from "@/lib/cart-line-product";
import { formatCurrency } from "@/lib/format";
import { useCartStore } from "@/store/use-cart-store";

export default function CartPage() {
  const cart = useCartStore((state) => state.cart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const hasHydrated = useCartStore((state) => state.hasHydrated);

  const lines = cart
    .map((line) => {
      const product = resolveCartLineProduct(line);
      return product ? { ...line, product } : null;
    })
    .filter((line): line is NonNullable<typeof line> => Boolean(line));

  const itemCount = lines.reduce((total, line) => total + line.quantity, 0);
  const subtotal = lines.reduce((total, line) => total + line.product.price * line.quantity, 0);

  if (!hasHydrated) {
    return (
      <main className="container py-12">
        <section className="mx-auto max-w-2xl premium-card p-8">
          <Skeleton className="mx-auto h-14 w-14" />
          <Skeleton className="mx-auto mt-5 h-9 w-64" />
          <Skeleton className="mx-auto mt-3 h-5 w-full max-w-md" />
          <Skeleton className="mx-auto mt-2 h-5 w-72" />
        </section>
      </main>
    );
  }

  if (lines.length === 0) {
    return (
      <main className="container py-12">
        <EmptyState
          title="Sepetin boş"
          description="Beğendiğin ürünleri sepete ekleyerek alışveriş akışını harcama yapmadan tamamlayabilirsin."
          action={
            <Button asChild size="lg">
              <Link href="/shop">Mağazaya dön</Link>
            </Button>
          }
        />
      </main>
    );
  }

  return (
    <main className="container py-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Sepetim</p>
          <h1 className="mt-2 text-3xl font-bold tracking-normal">Seçimlerini gözden geçir</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Ürünleri düzenle, tutarı gör ve hazır olduğunda Sanal Sipariş akışına geç.
          </p>
        </div>
        <Button type="button" variant="ghost" onClick={clearCart}>
          Sepeti temizle
        </Button>
      </div>

      <section className="mb-6 rounded-lg border border-saved/20 bg-saved/5 p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-saved" aria-hidden="true" />
            <span>
              Sepetin hazır. Sanal Sipariş tamamlandığında bu tutar harcanmış sayılmaz; kapanış
              ekranında korunan toplam olarak görünür.
            </span>
          </p>
          <p className="text-2xl font-bold text-saved">{formatCurrency(subtotal)}</p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="self-start overflow-hidden rounded-lg border bg-card shadow-card">
          {lines.map((line, index) => (
            <div key={line.product.id}>
              <article className="grid gap-4 p-4 transition hover:bg-surface-subtle/80 sm:grid-cols-[112px_1fr_auto] sm:items-center">
                <Link
                  href={`/urun/${line.product.slug}`}
                  className="focus-ring relative aspect-square overflow-hidden rounded-lg bg-muted shadow-sm"
                >
                  <Image
                    src={line.product.image}
                    alt={line.product.name}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </Link>
                <div>
                  <Link
                    href={`/urun/${line.product.slug}`}
                    className="focus-ring rounded-sm font-semibold hover:text-primary"
                  >
                    {line.product.name}
                  </Link>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">
                    {line.product.shortDescription}
                  </p>
                  <p className="mt-3 text-lg font-bold text-navy">{formatCurrency(line.product.price)}</p>
                </div>
                <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                  <div className="flex items-center rounded-md border">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Adedi azalt"
                      onClick={() => updateQuantity(line.product.id, line.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <span className="w-10 text-center text-sm font-semibold">{line.quantity}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Adedi artır"
                      onClick={() => updateQuantity(line.product.id, line.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`${line.product.name} ürününü kaldır`}
                    onClick={() => removeItem(line.product.id)}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </article>
              {index < lines.length - 1 ? <Separator /> : null}
            </div>
          ))}
        </section>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <CartSummary subtotal={subtotal} itemCount={itemCount} />
          <SavedMoneySummary amount={subtotal} label="Simülasyon tamamlanırsa korunacak tutar" />
          <Button asChild size="lg" className="w-full">
            <Link href="/checkout">Sanal Siparişi Tamamla</Link>
          </Button>
        </aside>
      </div>
    </main>
  );
}
