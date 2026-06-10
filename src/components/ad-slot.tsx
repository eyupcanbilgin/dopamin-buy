"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Megaphone } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  isAdExcludedPath,
  premiumNoAdsFlagPlaceholder,
  type AdPageType,
  type AdPlacementId,
  type AdSlotVariant,
  type PublicAdSlot,
} from "@/lib/ad-config";
import { cn } from "@/lib/utils";

type AdSlotProps = {
  placement?: AdPlacementId;
  pageType?: AdPageType;
  variant?: AdSlotVariant;
  slot?: PublicAdSlot | null;
  className?: string;
  title?: string;
  description?: string;
  loading?: boolean;
  disableRemoteLoad?: boolean;
};

type LoadState = "loading" | "ready" | "hidden";

export function AdSlot({
  placement = "homepage-banner",
  pageType = "shop",
  variant = "banner",
  slot,
  className,
  title,
  description,
  loading = false,
  disableRemoteLoad = false,
}: AdSlotProps) {
  const pathname = usePathname();
  const [resolvedSlot, setResolvedSlot] = useState<PublicAdSlot | null | undefined>(slot);
  const [loadState, setLoadState] = useState<LoadState>(
    loading || (!disableRemoteLoad && slot === undefined) ? "loading" : "ready",
  );
  const storageKey = useMemo(() => `dopamin-ad-frequency:${placement}:${todayKey()}`, [placement]);

  useEffect(() => {
    if (premiumNoAdsFlagPlaceholder || isAdExcludedPath(pathname)) {
      setLoadState("hidden");
      return;
    }

    if (loading) {
      setLoadState("loading");
      return;
    }

    if (slot !== undefined) {
      setResolvedSlot(slot);
      setLoadState(shouldHideByFrequency(slot, storageKey) ? "hidden" : "ready");
      return;
    }

    if (disableRemoteLoad) {
      setResolvedSlot(null);
      setLoadState("ready");
      return;
    }

    let cancelled = false;

    async function loadSlot() {
      setLoadState("loading");
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 1800);

      try {
        const response = await fetch(`/api/ad-slots?placement=${placement}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const payload = (await response.json()) as { slot?: PublicAdSlot | null };
        const nextSlot = response.ok ? payload.slot ?? null : null;

        if (cancelled) {
          return;
        }

        setResolvedSlot(nextSlot);
        setLoadState(shouldHideByFrequency(nextSlot, storageKey) ? "hidden" : "ready");
      } catch {
        if (!cancelled) {
          setResolvedSlot(null);
          setLoadState("ready");
        }
      } finally {
        window.clearTimeout(timeout);
      }
    }

    void loadSlot();

    return () => {
      cancelled = true;
    };
  }, [disableRemoteLoad, loading, pathname, placement, slot, storageKey]);

  useEffect(() => {
    if (loadState !== "ready" || !resolvedSlot) {
      return;
    }

    recordFrequency(storageKey);
    trackAdEvent({
      event: "impression",
      placement,
      pageType,
      slotId: resolvedSlot.id,
      path: pathname,
    });
  }, [loadState, pageType, pathname, placement, resolvedSlot, storageKey]);

  if (loadState === "hidden" || premiumNoAdsFlagPlaceholder || isAdExcludedPath(pathname)) {
    return null;
  }

  if (loadState === "loading") {
    return <AdSlotSkeleton className={className} variant={variant} />;
  }

  const hasSponsor = Boolean(resolvedSlot);
  const displayTitle = resolvedSlot?.title ?? title ?? "Sponsorlu alan şu anda boş";
  const displayDescription =
    resolvedSlot?.body ??
    description ??
    "Bu reklam alanı yalnızca açıkça etiketlenmiş, onaylı sponsor içeriği için ayrılmıştır.";
  const label = resolvedSlot?.label ?? "Reklam";

  return (
    <aside
      aria-label={`${label} alanı`}
      data-ad-placement={placement}
      data-ad-state={hasSponsor ? "configured" : "empty"}
      className={cn(
        "overflow-hidden rounded-lg border bg-card text-navy shadow-sm",
        variantClasses[variant],
        hasSponsor ? "border-primary/24" : "border-dashed border-border",
        className,
      )}
    >
      <div className={cn("flex h-full gap-4", variant === "sidebar" ? "flex-col" : "items-start")}>
        <span
          className={cn(
            "flex shrink-0 items-center justify-center rounded-md",
            iconSizeClasses[variant],
            hasSponsor ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground",
          )}
        >
          <Megaphone className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={hasSponsor ? "simulation" : "outline"}>{label}</Badge>
            {resolvedSlot?.sponsorName ? (
              <span className="text-xs font-medium text-muted-foreground">
                {resolvedSlot.sponsorName}
              </span>
            ) : null}
          </div>
          <h2 className={cn("mt-3 font-bold tracking-normal", titleSizeClasses[variant])}>
            {displayTitle}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{displayDescription}</p>
          {resolvedSlot?.ctaHref && resolvedSlot.ctaLabel ? (
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link
                href={resolvedSlot.ctaHref}
                target={isExternalHref(resolvedSlot.ctaHref) ? "_blank" : undefined}
                rel={isExternalHref(resolvedSlot.ctaHref) ? "sponsored noopener noreferrer" : "sponsored"}
                onClick={() =>
                  trackAdEvent({
                    event: "click",
                    placement,
                    pageType,
                    slotId: resolvedSlot.id,
                    path: pathname,
                  })
                }
              >
                {resolvedSlot.ctaLabel}
                {isExternalHref(resolvedSlot.ctaHref) ? (
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                ) : null}
              </Link>
            </Button>
          ) : null}
          {!hasSponsor ? (
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              Burada sponsor içeriği yokken ürün, indirim veya kampanya taklidi gösterilmez.
            </p>
          ) : null}
        </div>
      </div>
    </aside>
  );
}

function AdSlotSkeleton({
  className,
  variant,
}: {
  className?: string;
  variant: AdSlotVariant;
}) {
  return (
    <aside
      aria-label="Reklam alanı yükleniyor"
      className={cn("rounded-lg border bg-card shadow-sm", variantClasses[variant], className)}
    >
      <div className="flex gap-4">
        <Skeleton className="h-10 w-10 rounded-md" />
        <div className="flex-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="mt-4 h-5 w-2/3" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-4/5" />
        </div>
      </div>
    </aside>
  );
}

function shouldHideByFrequency(slot: PublicAdSlot | null | undefined, storageKey: string) {
  if (!slot || typeof window === "undefined") {
    return false;
  }

  const frequencyCap = Math.max(0, slot.frequencyCap);

  if (frequencyCap === 0) {
    return true;
  }

  const current = Number(window.localStorage.getItem(storageKey) ?? "0");
  return current >= frequencyCap;
}

function recordFrequency(storageKey: string) {
  if (typeof window === "undefined") {
    return;
  }

  const current = Number(window.localStorage.getItem(storageKey) ?? "0");
  window.localStorage.setItem(storageKey, String(current + 1));
}

function trackAdEvent(input: {
  event: "impression" | "click";
  placement: AdPlacementId;
  pageType: AdPageType;
  slotId: string;
  path: string;
}) {
  const payload = JSON.stringify(input);

  if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
    navigator.sendBeacon("/api/analytics/ad", new Blob([payload], { type: "application/json" }));
    return;
  }

  void fetch("/api/analytics/ad", {
    method: "POST",
    body: payload,
    headers: {
      "content-type": "application/json",
    },
    keepalive: true,
  }).catch(() => undefined);
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

const variantClasses: Record<AdSlotVariant, string> = {
  banner: "p-5 md:p-6",
  "mid-feed": "p-5 sm:col-span-2 xl:col-span-3 2xl:col-span-4",
  sidebar: "p-4",
  footer: "p-4",
  inline: "p-5",
};

const iconSizeClasses: Record<AdSlotVariant, string> = {
  banner: "h-11 w-11",
  "mid-feed": "h-10 w-10",
  sidebar: "h-10 w-10",
  footer: "h-9 w-9",
  inline: "h-10 w-10",
};

const titleSizeClasses: Record<AdSlotVariant, string> = {
  banner: "text-lg md:text-xl",
  "mid-feed": "text-lg",
  sidebar: "text-base",
  footer: "text-sm",
  inline: "text-lg",
};
