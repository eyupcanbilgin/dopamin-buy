"use client";

import { UrgeMeter } from "@/components/urge-meter";
import { useCartStore } from "@/store/use-cart-store";

type UrgeCheckInProps = {
  mode: "before" | "after";
  compact?: boolean;
};

export function UrgeCheckIn({ mode, compact = false }: UrgeCheckInProps) {
  const value = useCartStore((state) => (mode === "before" ? state.urgeBefore : state.urgeAfter));
  const setUrgeBefore = useCartStore((state) => state.setUrgeBefore);
  const setUrgeAfter = useCartStore((state) => state.setUrgeAfter);
  const title =
    mode === "before" ? "Alışveriş dürtün şu an kaç?" : "Simülasyondan sonra dürtün kaç?";
  const help =
    mode === "before"
      ? "1 sakin, 10 çok güçlü. Bu puan sadece sana destek olmak için tutulur."
      : "Kapanış hissini fark etmek için son bir ölçüm yapalım.";

  return (
    <UrgeMeter
      value={value}
      onChange={(score) => (mode === "before" ? setUrgeBefore(score) : setUrgeAfter(score))}
      title={title}
      description={help}
      emptyText={
        mode === "before"
          ? "Başlamadan önce bir seviye seçebilirsin."
          : "Simülasyondan sonra bir seviye seçebilirsin."
      }
      compact={compact}
    />
  );
}
