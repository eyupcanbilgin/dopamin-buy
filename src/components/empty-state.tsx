import type { ReactNode } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <section className={cn("mx-auto max-w-2xl premium-card p-8 text-center", className)}>
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-primary/10 text-primary">
        {icon ?? <ShoppingBag className="h-7 w-7" aria-hidden="true" />}
      </span>
      <h1 className="mt-5 text-3xl font-bold tracking-normal text-navy">{title}</h1>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </section>
  );
}

export function EmptyStateAction({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Button asChild size="lg">
      <Link href={href}>{children}</Link>
    </Button>
  );
}
