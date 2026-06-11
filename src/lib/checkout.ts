import type { AddressType, DeliverySimulationValues } from "@/lib/schemas";

export const checkoutSteps = [
  {
    id: "review",
    label: "Sepet",
    href: "/checkout",
  },
  {
    id: "delivery",
    label: "Teslimat",
    href: "/checkout/teslimat",
  },
  {
    id: "shipping",
    label: "Kargo",
    href: "/checkout/kargo",
  },
  {
    id: "payment",
    label: "Ödeme",
    href: "/checkout/odeme",
  },
  {
    id: "success",
    label: "Kapanış",
    href: "/siparis-takip",
  },
] as const;

export type CheckoutStepId = (typeof checkoutSteps)[number]["id"];

export const cityDistricts = {
  İstanbul: ["Kadıköy", "Beşiktaş", "Üsküdar", "Şişli"],
  Ankara: ["Çankaya", "Yenimahalle", "Etimesgut", "Keçiören"],
  İzmir: ["Karşıyaka", "Konak", "Bornova", "Balçova"],
  Bursa: ["Nilüfer", "Osmangazi", "Mudanya", "Yıldırım"],
  Antalya: ["Muratpaşa", "Konyaaltı", "Kepez", "Lara"],
} as const;

export type CityName = keyof typeof cityDistricts;

export const addressTypeOptions: Array<{
  id: AddressType;
  label: string;
  description: string;
}> = [
  {
    id: "home",
    label: "Ev",
    description: "Ev hissi veren kurgu teslimat noktası.",
  },
  {
    id: "work",
    label: "İş",
    description: "İş temposunu temsil eden güvenli simülasyon adresi.",
  },
  {
    id: "family",
    label: "Aile",
    description: "Yakınlık ve destek hissi için oluşturulan kurgu adres.",
  },
  {
    id: "random",
    label: "Rastgele",
    description: "Sadece kapanış hissi için rastgele sanal nokta.",
  },
];

export const shippingSimulationOptions = [
  {
    id: "standard-simulation",
    title: "Standart Simülasyon Teslimatı",
    description: "Tanıdık alışveriş ritmini verir, gerçek kargo süreci başlatmaz.",
    tone: "Dengeli ve sakin",
  },
  {
    id: "fast-relief",
    title: "Hızlı Rahatlama Teslimatı",
    description: "Dürtünün hızlı kapanış ihtiyacını güvenli simülasyonla karşılar.",
    tone: "Hızlı rahatlama hissi",
  },
  {
    id: "same-day-feeling",
    title: "Aynı Gün Hissi",
    description: "Bugün tamamlanmış gibi duygusal kapanış sağlar, teslimat planlamaz.",
    tone: "Aynı gün hissi",
  },
] as const;

export const paymentSimulationOptions = [
  {
    id: "simulated-doply-card",
    title: "Doply Sanal Kart",
    description: "Kart numarası istemeyen, yalnızca simülasyon hissi veren yöntem.",
  },
  {
    id: "simulated-cash",
    title: "Sanal Kapıda Ödeme",
    description: "Kapıda ödeme hissini canlandırır; nakit veya teslimat işlemi yoktur.",
  },
  {
    id: "complete-without-spending",
    title: "Harcamadan Tamamla",
    description: "Harcamadan tamamlama niyetini merkeze alan en sakin seçenek.",
  },
] as const;

const fictionalStreetByType: Record<AddressType, string[]> = {
  home: ["Sakin Ev Rotası", "Dingin Sokak", "Yumuşak Işık Geçidi"],
  work: ["Odak Caddesi", "Mola Plaza Noktası", "Denge İş Rotası"],
  family: ["Yakınlık Sokak", "Destek Bahçesi", "Güvenli Ziyaret Rotası"],
  random: ["Kurgu Teslimat Noktası", "Sanal Vitrin Yolu", "Rahatlama Durağı"],
};

export function generateFictionalAddress({
  city,
  district,
  addressType,
}: Pick<DeliverySimulationValues, "city" | "district" | "addressType">) {
  const options = fictionalStreetByType[addressType];
  const index = Math.abs(city.length + district.length + addressType.length) % options.length;
  const route = options[index];

  return `${route}, Doply Simülasyon Alanı, ${district} / ${city}`;
}

export function getDistrictsForCity(city: string) {
  return cityDistricts[city as CityName] ?? cityDistricts.İstanbul;
}
