import { describe, expect, it } from "vitest";

import { normalizeSafeAdHref } from "@/lib/ad-url";
import { optionalAdHrefSchema } from "@/lib/ad-validation";

describe("ad URL validation", () => {
  it("accepts app-relative and http(s) sponsor links", () => {
    expect(normalizeSafeAdHref(" /rehber/doply-nasil-calisir ")).toBe(
      "/rehber/doply-nasil-calisir",
    );
    expect(optionalAdHrefSchema.safeParse("https://example.com/kampanya").success).toBe(true);
    expect(optionalAdHrefSchema.safeParse("http://example.com").success).toBe(true);
  });

  it("rejects unsafe sponsor link schemes", () => {
    expect(normalizeSafeAdHref("javascript:alert(1)")).toBeNull();
    expect(normalizeSafeAdHref("data:text/html,boom")).toBeNull();
    expect(normalizeSafeAdHref("//example.com/path")).toBeNull();
    expect(optionalAdHrefSchema.safeParse("javascript:alert(1)").success).toBe(false);
  });
});
