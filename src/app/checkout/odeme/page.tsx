"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, ShieldCheck } from "lucide-react";

import { CheckoutEmptyGuard } from "@/components/checkout/checkout-empty-guard";
import { CheckoutStepShell } from "@/components/checkout/checkout-step-shell";
import { EmptyState } from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { products } from "@/lib/catalog";
import { paymentSimulationOptions } from "@/lib/checkout";
import { paymentSimulationSchema } from "@/lib/schemas";
import { type SimulatedOrder, useCartStore } from "@/store/use-cart-store";

type PaymentSimulationId = (typeof paymentSimulationOptions)[number]["id"];

export default function PaymentSimulationPage() {
  const router = useRouter();
  const cart = useCartStore((state) => state.cart);
  const urgeBefore = useCartStore((state) => state.urgeBefore);
  const delivery = useCartStore((state) => state.delivery);
  const shipping = useCartStore((state) => state.shipping);
  const payment = useCartStore((state) => state.payment);
  const setPayment = useCartStore((state) => state.setPayment);
  const completeSimulation = useCartStore((state) => state.completeSimulation);

  const [selectedPayment, setSelectedPayment] = useState<PaymentSimulationId>(
    payment?.methodId ?? "complete-without-spending",
  );
  const [simulationConsent, setSimulationConsent] = useState(false);
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

  if (!delivery || !shipping) {
    return (
      <CheckoutEmptyGuard>
        <main className="container py-12">
          <EmptyState
            icon={<CreditCard className="h-7 w-7" aria-hidden="true" />}
            title="Önce teslimat ve kargo simülasyonu"
            description="Sanal ödeme hissine geçmeden önce teslimat ve kargo simülasyonu seçimlerini tamamla."
            action={
              <Button asChild size="lg">
                <Link href="/checkout/teslimat">Eksik adımlara dön</Link>
              </Button>
            }
          />
        </main>
      </CheckoutEmptyGuard>
    );
  }

  function handleComplete() {
    const parsed = paymentSimulationSchema.safeParse({
      methodId: selectedPayment,
      simulationConsent,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Simülasyon onayı gerekli.");
      return;
    }

    if (!urgeBefore) {
      setError("Sanal Sipariş kapanışı için önce dürtü puanını seçmelisin.");
      router.push("/checkout");
      return;
    }

    setPayment({ methodId: parsed.data.methodId });

    const order: SimulatedOrder = {
      id: `SNL-${new Date().getFullYear()}-${Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase()}`,
      createdAt: new Date().toISOString(),
      lines: lines.map((line) => ({
        productId: line.product.id,
        quantity: line.quantity,
        name: line.product.name,
        price: line.product.price,
        image: line.product.image,
      })),
      total: subtotal,
      avoidedSpending: subtotal,
      urgeBefore,
      urgeAfter: null,
      delivery,
      shipping,
      payment: { methodId: parsed.data.methodId },
      journalEntryAdded: false,
      waitingUntil: null,
    };

    completeSimulation(order);
    router.push("/checkout/basarili");
  }

  return (
    <CheckoutEmptyGuard>
      <CheckoutStepShell
        step="payment"
        title="Ödeme Simülasyonu"
        description="Kart alanı yok, CVV yok, son kullanma tarihi yok. Burada sadece harcamadan tamamlama hissini seçiyorsun."
        subtotal={subtotal}
        itemCount={itemCount}
        backHref="/checkout/kargo"
        sidebarNote="Bu sayfada ödeme bilgisi girilemez. Seçimlerin yalnızca Simülasyon durumudur."
      >
        <section className="premium-card p-5">
          <div className="rounded-lg border border-dopamine/40 bg-dopamine/12 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-navy">
              <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
              Kart bilgisi alanı bilinçli olarak yok
            </p>
            <p className="mt-2 text-sm leading-6 text-slate">
              Dopamin ödeme verisi toplamaz. Aşağıdaki seçenekler yalnızca Sanal Sipariş hissini
              tamamlamak için kullanılan simülasyon modlarıdır.
            </p>
          </div>

          <RadioGroup
            value={selectedPayment}
            onValueChange={(value) => setSelectedPayment(value as PaymentSimulationId)}
            className="mt-5 gap-3"
          >
            {paymentSimulationOptions.map((option) => (
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
                </span>
              </Label>
            ))}
          </RadioGroup>

          <Label className="mt-5 flex cursor-pointer items-start gap-3 rounded-lg border bg-secondary/45 p-4">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-input text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              checked={simulationConsent}
              onChange={(event) => setSimulationConsent(event.target.checked)}
            />
            <span className="text-sm leading-6 text-muted-foreground">
              Bunun bir Simülasyon olduğunu, para harcanmayacağını ve yalnızca Sanal Sipariş
              kapanışı oluşturulacağını anlıyorum.
            </span>
          </Label>

          {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

          <div className="mt-6 flex justify-end">
            <Button type="button" size="lg" onClick={handleComplete}>
              Sanal Siparişi Tamamla
            </Button>
          </div>
        </section>
      </CheckoutStepShell>
    </CheckoutEmptyGuard>
  );
}
