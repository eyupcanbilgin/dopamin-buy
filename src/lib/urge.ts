export const urgeTriggerOptions = [
  { id: "stress", label: "Stres" },
  { id: "boredom", label: "Sıkılma" },
  { id: "late-night", label: "Gece isteği" },
  { id: "discount-fear", label: "İndirimi kaçırma korkusu" },
  { id: "social-media", label: "Sosyal medya" },
  { id: "self-reward", label: "Kendini ödüllendirme" },
  { id: "salary-day", label: "Maaş günü" },
  { id: "sadness", label: "Keyifsizlik" },
  { id: "other", label: "Diğer" },
] as const;

export type UrgeTriggerId = (typeof urgeTriggerOptions)[number]["id"];

export type DelayMode = "ten-minutes" | "twenty-four-hours" | "salary-day";

export type ReflectionAnswers = {
  whyWanted: string;
  needed: string;
  feeling: string;
  updatedAt: string;
};

export function getTriggerLabel(triggerId: string) {
  return urgeTriggerOptions.find((trigger) => trigger.id === triggerId)?.label ?? "Diğer";
}

export function calculateDelayUntil(mode: DelayMode, from = new Date()) {
  if (mode === "ten-minutes") {
    return new Date(from.getTime() + 10 * 60 * 1000);
  }

  if (mode === "twenty-four-hours") {
    return new Date(from.getTime() + 24 * 60 * 60 * 1000);
  }

  return new Date(from.getFullYear(), from.getMonth() + 1, 1, 9, 0, 0, 0);
}
