"use client";

import { Tag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { urgeTriggerOptions, type UrgeTriggerId } from "@/lib/urge";

type TriggerSelectorProps = {
  value: UrgeTriggerId[];
  onChange: (value: UrgeTriggerId[]) => void;
  compact?: boolean;
};

export function TriggerSelector({ value, onChange, compact = false }: TriggerSelectorProps) {
  function toggle(triggerId: UrgeTriggerId) {
    onChange(
      value.includes(triggerId)
        ? value.filter((item) => item !== triggerId)
        : [...value, triggerId],
    );
  }

  return (
    <section className={cn("premium-card p-5", compact && "p-4")}>
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Tag className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className={cn("font-semibold text-navy", compact ? "text-base" : "text-xl")}>
            Bu isteği ne tetikledi?
          </h2>
          <p className="mt-1 text-sm leading-5 text-muted-foreground">
            Birden fazla seçebilirsin. Bu etiketler yalnızca kendi düzenini fark etmen içindir.
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Alışveriş isteği tetikleyicileri">
        {urgeTriggerOptions.map((trigger) => {
          const selected = value.includes(trigger.id);

          return (
            <Button
              key={trigger.id}
              type="button"
              variant={selected ? "default" : "outline"}
              size="sm"
              aria-pressed={selected}
              onClick={() => toggle(trigger.id)}
              className={cn(!selected && "bg-surface hover:bg-primary/8")}
            >
              {trigger.label}
            </Button>
          );
        })}
      </div>
    </section>
  );
}
