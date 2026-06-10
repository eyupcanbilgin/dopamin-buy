import { BadgeCheck, Leaf, ShieldCheck, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

type BadgeProps = {
  className?: string;
};

export function SimulationBadge({ className }: BadgeProps) {
  return (
    <Badge
      variant="simulation"
      className={cn("gap-1.5 whitespace-nowrap", className)}
      aria-label="Bu deneyim simülasyondur"
    >
      <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
      Simülasyon
    </Badge>
  );
}

export function SavedMoneyBadge({
  amount,
  className,
}: BadgeProps & {
  amount?: number;
}) {
  return (
    <Badge
      variant="saved"
      className={cn("gap-1.5 whitespace-nowrap", className)}
      aria-label="Gerçek ödeme yapılmadı"
    >
      <Leaf className="h-3.5 w-3.5" aria-hidden="true" />
      {amount ? `${formatCurrency(amount)} korundu` : "Para korunur"}
    </Badge>
  );
}

export function DopaminScoreBadge({
  score,
  className,
}: BadgeProps & {
  score: number;
}) {
  return (
    <Badge variant="score" className={cn("gap-1.5 whitespace-nowrap", className)}>
      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
      Dopamin skoru {score.toFixed(1)}
    </Badge>
  );
}

export function NoRealPaymentBadge({ className }: BadgeProps) {
  return (
    <Badge variant="dopamine" className={cn("gap-1.5 whitespace-nowrap", className)}>
      <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
      Gerçek ödeme yok
    </Badge>
  );
}

export function SimulationModeBadge({ className }: BadgeProps) {
  return (
    <Badge variant="simulation" className={cn("gap-1.5 whitespace-nowrap", className)}>
      <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
      Simülasyon Modu
    </Badge>
  );
}
