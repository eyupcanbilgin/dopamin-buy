import { SavedMoneyBadge } from "@/components/badges";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/format";

type CartSummaryProps = {
  subtotal: number;
  itemCount: number;
};

export function CartSummary({ subtotal, itemCount }: CartSummaryProps) {
  return (
    <div className="rounded-lg border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Sanal sepet özeti</h2>
      <div className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Ürün adedi</span>
          <span className="font-medium">{itemCount}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Sanal ara toplam</span>
          <span className="font-medium">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Gerçek kargo</span>
          <span className="font-medium">Yok</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Gerçek ödeme</span>
          <span className="font-medium">Yok</span>
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex items-center justify-between gap-4">
        <span className="font-semibold">Kaçınılan harcama</span>
        <span className="text-xl font-bold text-saved">{formatCurrency(subtotal)}</span>
      </div>
      <SavedMoneyBadge amount={subtotal} className="mt-3" />
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        Sepetteki tutar sadece simülasyon kapanışı ve farkındalık özeti için gösterilir.
      </p>
    </div>
  );
}
