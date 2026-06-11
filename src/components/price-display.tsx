import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

type PriceDisplayProps = {
  price: number;
  compareAtPrice?: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function PriceDisplay({
  price,
  compareAtPrice,
  label = "Sanal sepet tutarı",
  size = "md",
  className,
}: PriceDisplayProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <p
        className={cn(
          "font-bold tracking-normal text-navy",
          size === "sm" && "text-base",
          size === "md" && "text-lg",
          size === "lg" && "text-3xl",
        )}
      >
        {formatCurrency(price)}
      </p>
      {compareAtPrice ? (
        <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="line-through">{formatCurrency(compareAtPrice)}</span>
          <span>Sanal sepet tutarı</span>
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">{label}</p>
      )}
    </div>
  );
}
