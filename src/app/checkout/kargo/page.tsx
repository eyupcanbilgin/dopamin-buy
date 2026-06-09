"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Truck } from "lucide-react";

import { CheckoutEmptyGuard } from "@/components/checkout/checkout-empty-guard";
import { CheckoutStepShell } from "@/components/checkout/checkout-step-shell";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { products } from "@/lib/catalog";
import { shippingSimulationOptions } from "@/lib/checkout";
import { shippingSimulationSchema } from "@/lib/schemas";
import { useCartStore } from "@/store/use-cart-store";

type ShippingSimulationId = (typeof shippingSimulationOptions)[number]["id"];

export default function ShippingSimulationPage() {
  const router = useRouter();
  const cart = useCartStore((state) => state.cart);
  const delivery = useCartStore((state) => state.delivery);
  const shipping = useCartStore((state) => state.shipping);
  const setShipping = useCartStore((state) => state.setShipping);
  const [selectedShipping, setSelectedShipping] = useState<ShippingSimulationId>(
    shipping?.optionId ?? "standard-simulation",
  );
  const [error, setError] = useState("");

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

  if (!delivery) {
    return (
      <CheckoutEmptyGuard>
        <main className="container py-12">
          <EmptyState
            icon={<Truck className="h-7 w-7" aria-hidden="true" />}
            title="Önce teslimat simülasyonu"
            description="Kargo hissini seçmeden önce güvenli kurgu teslimat adresi oluşturmalısın."
            action={
              <Button asChild size="lg">
                <Link href="/checkout/teslimat">Teslimat Simülasyonuna Git</Link>
              </Button>
            }
          />
        </main>
      </CheckoutEmptyGuard>
    );
  }

  function handleSubmit() {
    const parsed = shippingSimulationSchema.safeParse({ optionId: selectedShipping });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Teslimat simülasyonu seç.");
      return;
    }

    setError("");
    setShipping(parsed.data);
    router.push("/checkout/odeme");
  }

  return (
    <CheckoutEmptyGuard>
      <CheckoutStepShell
        step="shipping"
        title="Kargo Simülasyonu"
        description="Bu seçenekler gerçek taşıyıcı hizmeti değildir. Yalnızca alışveriş döngüsünün tanıdık teslimat hissini güvenli biçimde tamamlar."
        subtotal={subtotal}
        itemCount={itemCount}
        backHref="/checkout/teslimat"
      >
        <section className="premium-card p-5">
          <div className="rounded-lg border bg-background p-4">
            <p className="text-sm font-semibold text-navy">Kurgu teslimat noktası</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {delivery.fictionalAddress}
            </p>
          </div>

          <RadioGroup
            value={selectedShipping}
            onValueChange={(value) => setSelectedShipping(value as ShippingSimulationId)}
            className="mt-5 gap-3"
          >
            {shippingSimulationOptions.map((option) => (
              <Label
                key={option.id}
                htmlFor={option.id}
                className="flex cursor-pointer gap-3 rounded-lg border bg-background p-4 transition hover:border-primary/50"
              >
                <RadioGroupItem id={option.id} value={option.id} className="mt-1" />
                <span>
                  <span className="block font-semibold text-navy">{option.title}</span>
                  <span className="mt-1 block text-sm leading-5 text-muted-foreground">
                    {option.description}
                  </span>
                  <span className="mt-2 block text-xs font-semibold text-primary">
                    {option.tone}
                  </span>
                </span>
              </Label>
            ))}
          </RadioGroup>

          {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

          <div className="mt-6 flex justify-end">
            <Button type="button" size="lg" onClick={handleSubmit}>
              Ödeme Simülasyonuna Geç
            </Button>
          </div>
        </section>
      </CheckoutStepShell>
    </CheckoutEmptyGuard>
  );
}
