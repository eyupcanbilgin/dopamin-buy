import Link from "next/link";

import { NoRealPaymentBadge, SimulationBadge } from "@/components/badges";
import { Container } from "@/components/layout/container";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-surface/80">
      <Container className="py-8">
        <div className="grid gap-6 md:grid-cols-[1.2fr_1fr] md:items-start">
          <div>
            <div className="flex flex-wrap gap-2">
              <SimulationBadge />
              <NoRealPaymentBadge />
            </div>
            <p className="mt-4 text-sm font-semibold text-navy">Dopamin</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Alışveriş dürtüsünü gerçek ödeme, gerçek teslimat veya ticari kayıt olmadan
              tamamlamaya yardımcı olan etik bir simülasyon alanı. Tıbbi tedavi yerine geçmez.
            </p>
          </div>
          <nav className="grid grid-cols-2 gap-3 text-sm md:justify-self-end" aria-label="Alt bilgi">
            <Link className="focus-ring rounded-sm text-muted-foreground hover:text-foreground" href="/">
              Kavram
            </Link>
            <Link
              className="focus-ring rounded-sm text-muted-foreground hover:text-foreground"
              href="/shop"
            >
              Mağaza simülasyonu
            </Link>
            <Link
              className="focus-ring rounded-sm text-muted-foreground hover:text-foreground"
              href="/sepet"
            >
              Sanal sepet
            </Link>
            <Link
              className="focus-ring rounded-sm text-muted-foreground hover:text-foreground"
              href="/checkout"
            >
              Sanal ödeme
            </Link>
          </nav>
        </div>
        <Separator className="my-6" />
        <p className="text-xs text-muted-foreground">
          Bu ürün yalnızca simülasyondur. Kart numarası, CVV, son kullanma tarihi, kimlik numarası
          veya açık adres istemez.
        </p>
      </Container>
    </footer>
  );
}
