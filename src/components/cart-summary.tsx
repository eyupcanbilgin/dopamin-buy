import { SavedMoneyBadge } from "@/components/badges";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/format";

type CartSummaryProps = {
  subtotal: number;
  itemCount: number;
};

export function CartSummary({ subtotal, itemCount }: CartSummaryProps) {
  const simulatedShipping = subtotal > 0 ? 49 : 0;
  const dopamineDiscount = subtotal + simulatedShipping;

  return (
    <div className="rounded-lg border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Sepet özeti</h2>
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Ürün adedi</span>
          <span className="font-medium">{itemCount}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Ara toplam</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Simüle kargo</span>
          <span className="font-medium">{formatCurrency(simulatedShipping)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Dopamin indirimi</span>
          <span className="font-semibold text-saved">-{formatCurrency(dopamineDiscount)}</span>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="mb-4 flex items-center justify-between gap-4 rounded-md bg-saved/10 p-3">
        <span className="font-semibold text-saved">Ödenecek tutar</span>
        <span className="text-xl font-bold text-saved">{formatCurrency(0)}</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="font-semibold">Korunan tutar</span>
        <span className="text-xl font-bold text-saved">{formatCurrency(subtotal)}</span>
      </div>
      <SavedMoneyBadge amount={subtotal} className="mt-3" />
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        Dopamin indirimi sepet tutarını dengeler; ödeme adımı kart bilgisi istemez.
      </p>
    </div>
  );
}
