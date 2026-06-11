"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, RefreshCcw } from "lucide-react";

import { CheckoutEmptyGuard } from "@/components/checkout/checkout-empty-guard";
import { CheckoutStepShell } from "@/components/checkout/checkout-step-shell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { resolveCartLineProduct } from "@/lib/cart-line-product";
import {
  addressTypeOptions,
  cityDistricts,
  generateFictionalAddress,
  getDistrictsForCity,
} from "@/lib/checkout";
import { deliverySimulationSchema, type AddressType } from "@/lib/schemas";
import { useCartStore } from "@/store/use-cart-store";

export default function DeliverySimulationPage() {
  const router = useRouter();
  const cart = useCartStore((state) => state.cart);
  const delivery = useCartStore((state) => state.delivery);
  const setDelivery = useCartStore((state) => state.setDelivery);

  const [city, setCity] = useState(delivery?.city ?? "İstanbul");
  const [district, setDistrict] = useState(delivery?.district ?? getDistrictsForCity(city)[0]);
  const [addressType, setAddressType] = useState<AddressType>(
    delivery?.addressType ?? "home",
  );
  const [error, setError] = useState("");

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
  const districts = getDistrictsForCity(city);
  const fictionalAddress = generateFictionalAddress({ city, district, addressType });

  function handleCityChange(nextCity: string) {
    const nextDistrict = getDistrictsForCity(nextCity)[0];
    setCity(nextCity);
    setDistrict(nextDistrict);
  }

  function handleSubmit() {
    const parsed = deliverySimulationSchema.safeParse({
      city,
      district,
      addressType,
      fictionalAddress,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Teslimat simülasyonu eksik.");
      return;
    }

    setError("");
    setDelivery(parsed.data);
    router.push("/checkout/kargo");
  }

  return (
    <CheckoutEmptyGuard>
      <CheckoutStepShell
        step="delivery"
        title="Teslimat Simülasyonu"
        description="Şehir, ilçe ve adres tipi seç. Açık adres istemiyoruz; Doply güvenli, kurgu bir teslimat adresi üretir."
        subtotal={subtotal}
        itemCount={itemCount}
        backHref="/checkout"
      >
        <section className="premium-card p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="city">Şehir</Label>
              <select
                id="city"
                value={city}
                onChange={(event) => handleCityChange(event.target.value)}
                className="focus-ring h-11 rounded-md border bg-surface px-3 text-sm"
              >
                {Object.keys(cityDistricts).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="district">İlçe</Label>
              <select
                id="district"
                value={district}
                onChange={(event) => setDistrict(event.target.value)}
                className="focus-ring h-11 rounded-md border bg-surface px-3 text-sm"
              >
                {districts.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-semibold text-navy">Adres tipi</p>
            <RadioGroup
              value={addressType}
              onValueChange={(value) => setAddressType(value as AddressType)}
              className="mt-3 grid gap-3 sm:grid-cols-2"
            >
              {addressTypeOptions.map((option) => (
                <Label
                  key={option.id}
                  htmlFor={option.id}
                  className="flex cursor-pointer gap-3 rounded-lg border bg-background p-4 transition hover:border-primary/50"
                >
                  <RadioGroupItem id={option.id} value={option.id} className="mt-1" />
                  <span>
                    <span className="block font-semibold">{option.label}</span>
                    <span className="mt-1 block text-sm leading-5 text-muted-foreground">
                      {option.description}
                    </span>
                  </span>
                </Label>
              ))}
            </RadioGroup>
          </div>

          <div className="mt-6 rounded-lg border border-primary/20 bg-[linear-gradient(180deg,hsl(var(--primary)/0.08),hsl(var(--card)))] p-4 shadow-sm">
            <p className="flex items-center gap-2 text-sm font-semibold text-navy">
              <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
              Oluşturulan güvenli kurgu adres
            </p>
            <p className="mt-2 text-base font-semibold text-primary">{fictionalAddress}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Bu adres gerçek bir kişiye veya açık konuma ait değildir. Sokak, kapı, telefon ya da
              kimlik bilgisi istemiyoruz.
            </p>
          </div>

          {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Button type="button" variant="outline" onClick={() => setAddressType("random")}>
              <RefreshCcw className="h-4 w-4" aria-hidden="true" />
              Random adres tipi seç
            </Button>
            <Button type="button" size="lg" onClick={handleSubmit}>
              Kargo Simülasyonuna Geç
            </Button>
          </div>
        </section>
      </CheckoutStepShell>
    </CheckoutEmptyGuard>
  );
}
