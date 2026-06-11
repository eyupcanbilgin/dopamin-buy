import { z } from "zod";

import { isSafeAdHref, normalizeAdHrefInput } from "@/lib/ad-url";

export const optionalAdHrefSchema = z.preprocess(
  normalizeAdHrefInput,
  z
    .string()
    .max(240)
    .nullable()
    .refine((href) => href === null || isSafeAdHref(href), {
      message: "CTA bağlantısı http(s) veya / ile başlayan güvenli bir yol olmalı.",
    }),
);
