"use client";

import { UrgeMeter } from "@/components/urge-meter";
import { useCartStore } from "@/store/use-cart-store";

type UrgeCheckInProps = {
  mode: "before" | "after";
  compact?: boolean;
  title?: string;
  description?: string;
  emptyText?: string;
};

export function UrgeCheckIn({
  mode,
  compact = false,
  title,
  description,
  emptyText,
}: UrgeCheckInProps) {
  const value = useCartStore((state) => (mode === "before" ? state.urgeBefore : state.urgeAfter));
  const setUrgeBefore = useCartStore((state) => state.setUrgeBefore);
  const setUrgeAfter = useCartStore((state) => state.setUrgeAfter);
  const defaultTitle =
    mode === "before" ? "Şu an alışveriş isteğin kaç / 10?" : "Şimdi kaç / 10?";
  const defaultDescription =
    mode === "before"
      ? "1 sakin, 10 çok güçlü. Bu puan sadece sana destek olmak için tutulur."
      : "Kapanış hissini fark etmek için son bir ölçüm yapalım.";
  const defaultEmptyText =
    mode === "before"
      ? "Başlamadan önce bir seviye seçebilirsin."
      : "Simülasyondan sonra bir seviye seçebilirsin.";

  return (
    <UrgeMeter
      value={value}
      onChange={(score) => (mode === "before" ? setUrgeBefore(score) : setUrgeAfter(score))}
      title={title ?? defaultTitle}
      description={description ?? defaultDescription}
      emptyText={emptyText ?? defaultEmptyText}
      compact={compact}
    />
  );
}
