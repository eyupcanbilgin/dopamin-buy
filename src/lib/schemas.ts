import { z } from "zod";

export const urgeSchema = z
  .number()
  .int()
  .min(1, "Dürtü seviyesi en az 1 olmalı.")
  .max(10, "Dürtü seviyesi en fazla 10 olabilir.");

export const addressTypeSchema = z.enum(["home", "work", "family", "random"]);

export const deliverySimulationSchema = z.object({
  city: z.string().trim().min(2, "Şehir seçimi simülasyon için gerekli.").max(32),
  district: z.string().trim().min(2, "İlçe seçimi simülasyon için gerekli.").max(32),
  addressType: addressTypeSchema,
  fictionalAddress: z
    .string()
    .trim()
    .min(8, "Sanal teslimat adresi oluşturulmalı.")
    .max(160),
});

export const shippingSimulationSchema = z.object({
  optionId: z.enum(["standard-simulation", "fast-relief", "same-day-feeling"], {
    required_error: "Bir teslimat simülasyonu seç.",
  }),
});

export const paymentSimulationSchema = z.object({
  methodId: z.enum(["simulated-dopamin-card", "simulated-cash", "complete-without-spending"], {
    required_error: "Bir sanal ödeme yöntemi seç.",
  }),
  simulationConsent: z.boolean().refine((value) => value, {
    message: "Simülasyon olduğunu onaylaman gerekiyor.",
  }),
});

export type AddressType = z.infer<typeof addressTypeSchema>;
export type DeliverySimulationValues = z.infer<typeof deliverySimulationSchema>;
export type ShippingSimulationValues = z.infer<typeof shippingSimulationSchema>;
export type PaymentSimulationValues = z.infer<typeof paymentSimulationSchema>;
