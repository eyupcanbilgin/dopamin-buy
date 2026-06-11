import Link from "next/link";

import { AdSlot } from "@/components/ad-slot";
import { SimulationBadge } from "@/components/badges";
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
            </div>
            <p className="mt-4 text-sm font-semibold text-navy">Doply</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Doply gerçek ödeme almaz. Sanal Sipariş akışı alışveriş hissini harcama yapmadan
              kapatmaya yardımcı olur; tıbbi tedavi yerine geçmez.
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
            <Link
              className="focus-ring rounded-sm text-muted-foreground hover:text-foreground"
              href="/yardim"
            >
              Yardım / SSS
            </Link>
            <Link
              className="focus-ring rounded-sm text-muted-foreground hover:text-foreground"
              href="/rehber"
            >
              Rehber
            </Link>
          </nav>
        </div>
        <div className="mt-6">
          <AdSlot placement="footer" pageType="footer" variant="footer" />
        </div>
        <Separator className="my-6" />
        <p className="text-xs text-muted-foreground">
          Doply gerçek ödeme almaz. Kart bilgisi, kimlik numarası veya tam açık adres istemez.
        </p>
      </Container>
    </footer>
  );
}
