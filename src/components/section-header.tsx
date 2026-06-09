import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  align?: "left" | "center";
  headingLevel?: "h1" | "h2";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  actions,
  align = "left",
  headingLevel = "h2",
  className,
}: SectionHeaderProps) {
  const Heading = headingLevel;

  return (
    <div
      className={cn(
        "mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        align === "center" && "mx-auto max-w-3xl text-center sm:block",
        className,
      )}
    >
      <div>
        {eyebrow ? (
          <Badge variant="secondary" className="mb-3">
            {eyebrow}
          </Badge>
        ) : null}
        <Heading className="text-2xl font-bold leading-tight tracking-normal text-navy sm:text-3xl">
          {title}
        </Heading>
        {description ? (
          <p
            className={cn(
              "mt-3 max-w-2xl text-sm leading-6 text-muted-foreground",
              align === "center" && "mx-auto",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
