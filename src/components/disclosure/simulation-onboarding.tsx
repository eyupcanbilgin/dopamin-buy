"use client";

import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  MapPinOff,
  PackageX,
  ShieldCheck,
  ShoppingBag,
  WalletCards,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const DISCLOSURE_STORAGE_KEY = "doply-simulation-disclosure-accepted-v1";

const disclosureItems = [
  {
    icon: WalletCards,
    title: "Gerçek ödeme yok",
    text: "Sanal ödeme adımı para çekmez, bakiye etkilemez ve ticari işlem başlatmaz.",
  },
  {
    icon: CreditCard,
    title: "Kart bilgisi yok",
    text: "Kart numarası, CVV, son kullanma tarihi veya banka bilgisi girilmez.",
  },
  {
    icon: PackageX,
    title: "Gerçek teslimat yok",
    text: "Kargo ve takip ekranları yalnızca alışveriş hissinin kapanışı için simüle edilir.",
  },
  {
    icon: ShoppingBag,
    title: "Gerçek sipariş yok",
    text: "Sanal Sipariş numarası kapanış hissi sağlar; ticari kayıt oluşturmaz.",
  },
  {
    icon: MapPinOff,
    title: "Tam açık adres yok",
    text: "Sadece şehir, ilçe ve adres tipi seçilir; kapı numarası veya kimlik bilgisi istenmez.",
  },
];

export function SimulationOnboarding() {
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith("/admin");
  const [isVisible, setIsVisible] = useState(true);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isAdminPath) {
      setIsVisible(false);
      return;
    }

    try {
      const accepted = window.localStorage.getItem(DISCLOSURE_STORAGE_KEY);
      setIsVisible(accepted !== "true");
    } catch {
      setIsVisible(true);
    }
  }, [isAdminPath]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    buttonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isVisible]);

  function acceptDisclosure() {
    try {
      window.localStorage.setItem(DISCLOSURE_STORAGE_KEY, "true");
    } catch {
      // If storage is unavailable, close for the current session.
    }

    setIsVisible(false);
  }

  function handleDialogKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key !== "Tab") {
      return;
    }

    const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
    );

    if (!focusableElements?.length) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  if (isAdminPath || !isVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-navy/70 px-4 py-4 backdrop-blur-md sm:items-center sm:py-8"
      role="presentation"
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="simulation-onboarding-title"
        aria-describedby="simulation-onboarding-description"
        className="w-full max-w-2xl rounded-lg border bg-card p-5 shadow-soft sm:p-7"
        onKeyDown={handleDialogKeyDown}
      >
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-glow">
            <ShieldCheck className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-primary">Simülasyon açıklaması</p>
            <h2
              id="simulation-onboarding-title"
              className="mt-2 text-2xl font-bold leading-tight tracking-normal text-navy sm:text-3xl"
            >
              Doply bir alışveriş simülasyonudur.
            </h2>
          </div>
        </div>

        <p
          id="simulation-onboarding-description"
          className="mt-5 text-base leading-7 text-muted-foreground"
        >
          Doply, alışveriş hissini gerçek para harcamadan yaşatan bir simülasyon platformudur.
          Ürünlere bakabilir, sepete ekleyebilir ve Sanal Sipariş akışını tamamlayabilirsin;
          gerçek ödeme, teslimat veya sipariş oluşmaz.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {disclosureItems.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.title} className="rounded-lg border bg-background p-4">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                  <h3 className="text-sm font-semibold text-navy">{item.title}</h3>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.text}</p>
              </article>
            );
          })}
        </div>

        <p className="mt-5 text-sm leading-6 text-muted-foreground">
          Bu bilgi bir kez gösterilir. Daha sonra üst çubuktaki “Simülasyon Modu” etiketi ve yardım
          sayfası sana eşlik eder.
        </p>

        <div className="mt-6 flex justify-end">
          <Button ref={buttonRef} type="button" size="lg" onClick={acceptDisclosure}>
            Anladım, Simülasyona Başla
          </Button>
        </div>
      </section>
    </div>
  );
}
