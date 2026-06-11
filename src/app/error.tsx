"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="container flex min-h-[70vh] items-center justify-center py-12">
      <section
        role="alert"
        className="max-w-xl rounded-lg border bg-card p-6 text-center shadow-soft sm:p-8"
      >
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <AlertTriangle className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-2xl font-bold text-navy">Bir şey yolunda gitmedi</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Doply simülasyonu güvenli şekilde durdurdu. Gerçek ödeme veya gerçek sipariş işlemi
          oluşmadı.
        </p>
        {error.digest ? (
          <p className="mt-3 text-xs text-muted-foreground">Hata kodu: {error.digest}</p>
        ) : null}
        <div className="mt-6 flex justify-center">
          <Button type="button" onClick={reset}>
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Tekrar dene
          </Button>
        </div>
      </section>
    </main>
  );
}
