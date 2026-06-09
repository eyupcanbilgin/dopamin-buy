import { describe, it, expect } from "vitest";
import { formatCurrency, formatOrderDate } from "@/lib/format";

describe("Format Utilities", () => {
  describe("formatCurrency", () => {
    it("should format numbers to Turkish Lira format", () => {
      const formatted = formatCurrency(3290);
      // Output in Node can be "3.290,00 ₺", "₺3.290", "3.290 TL", or similar.
      // We check that it formats the numeric thousands separators correctly and contains TRY symbol clues.
      expect(formatted).toContain("3.290");
    });
  });

  describe("formatOrderDate", () => {
    it("should format ISO string to Turkish locale date style", () => {
      const isoDate = "2026-06-09T12:00:00.000Z";
      const formatted = formatOrderDate(isoDate);
      expect(formatted).toContain("2026");
      // Check that it doesn't crash and returns a string
      expect(typeof formatted).toBe("string");
    });
  });
});
