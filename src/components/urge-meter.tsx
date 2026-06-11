"use client";

import { HeartPulse } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type UrgeMeterProps = {
  value: number | null;
  onChange: (value: number) => void;
  title: string;
  description: string;
  emptyText: string;
  compact?: boolean;
};

export function UrgeMeter({
  value,
  onChange,
  title,
  description,
  emptyText,
  compact = false,
}: UrgeMeterProps) {
  return (
    <section className={cn("premium-card p-5", compact && "p-4")}>
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary shadow-sm">
          <HeartPulse className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className={cn("font-semibold text-navy", compact ? "text-base" : "text-xl")}>
            {title}
          </h2>
          <p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p>
        </div>
      </div>
      <div
        className="mt-5 grid grid-cols-5 gap-2 sm:grid-cols-10"
        role="group"
        aria-label={title}
      >
        {Array.from({ length: 10 }, (_, index) => index + 1).map((score) => (
          <Button
            key={score}
            type="button"
            variant={value === score ? "default" : "outline"}
            className={cn(
              "h-10 px-0 transition-transform hover:-translate-y-0.5",
              value === score && "shadow-glow",
              value !== score && "bg-surface hover:bg-primary/8",
            )}
            aria-pressed={value === score}
            aria-label={`${score} üzerinden 10 dürtü seviyesi`}
            onClick={() => onChange(score)}
          >
            {score}
          </Button>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        <Progress value={value ? value * 10 : 0} />
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {value ? `Seçili seviye: ${value}/10` : emptyText}
        </p>
      </div>
    </section>
  );
}
