import { PauseCircle } from "lucide-react";

import { NoRealPaymentBadge, SavedMoneyBadge } from "@/components/badges";
import { cn } from "@/lib/utils";

type AdSlotProps = {
  title?: string;
  description?: string;
  className?: string;
};

export function AdSlot({
  title = "Sakin mola alanı",
  description = "Bu alanda bu fazda reklam, geri sayım veya satın alma baskısı yok. İstersen sepete eklemeden önce bir nefeslik durakla.",
  className,
}: AdSlotProps) {
  return (
    <aside
      aria-label="Etik duyuru alanı"
      className={cn(
        "rounded-lg border border-dopamine/40 bg-dopamine/12 p-5 text-navy shadow-sm",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-dopamine text-dopamine-foreground">
          <PauseCircle className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <div className="flex flex-wrap gap-2">
            <NoRealPaymentBadge />
            <SavedMoneyBadge />
          </div>
          <h2 className="mt-4 text-lg font-bold tracking-normal">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate">{description}</p>
        </div>
      </div>
    </aside>
  );
}
