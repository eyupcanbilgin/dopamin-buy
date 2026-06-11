import { PiggyBank, ShieldCheck } from "lucide-react";

import { SavedMoneyBadge } from "@/components/badges";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";

type SavedMoneySummaryProps = {
  amount: number;
  label?: string;
};

export function SavedMoneySummary({
  amount,
  label = "Bugün harcamaktan kaçındığın tutar",
}: SavedMoneySummaryProps) {
  return (
    <Card className="border-saved/20 bg-[linear-gradient(180deg,hsl(var(--saved)/0.08),hsl(var(--card)))] shadow-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <PiggyBank className="h-5 w-5 text-saved" aria-hidden="true" />
              Birikim özeti
            </CardTitle>
            <p className="mt-2 text-sm leading-5 text-muted-foreground">{label}</p>
          </div>
          <SavedMoneyBadge />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold tracking-normal text-saved">
          {formatCurrency(amount)}
        </p>
        <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-muted-foreground">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-saved" aria-hidden="true" />
          Bu tutar sanal sepetten hesaplandı. Karttan çekim yapılmadı, teslimat planlanmadı.
        </p>
      </CardContent>
    </Card>
  );
}
