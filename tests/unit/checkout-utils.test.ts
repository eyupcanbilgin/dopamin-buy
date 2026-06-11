import { describe, it, expect } from "vitest";
import { generateFictionalAddress, getDistrictsForCity } from "@/lib/checkout";

describe("Checkout Utilities", () => {
  describe("getDistrictsForCity", () => {
    it("should return correct districts for Istanbul", () => {
      const districts = getDistrictsForCity("İstanbul");
      expect(districts).toContain("Kadıköy");
      expect(districts).toContain("Beşiktaş");
    });

    it("should return correct districts for Ankara", () => {
      const districts = getDistrictsForCity("Ankara");
      expect(districts).toContain("Çankaya");
    });

    it("should fallback to Istanbul if city is unknown", () => {
      const districts = getDistrictsForCity("Izmir-non-existent");
      expect(districts).toContain("Kadıköy");
    });
  });

  describe("generateFictionalAddress", () => {
    it("should generate fictional address containing simulation markers", () => {
      const address = generateFictionalAddress({
        city: "Ankara",
        district: "Çankaya",
        addressType: "home",
      });

      expect(address).toContain("Doply Simülasyon Alanı");
      expect(address).toContain("Çankaya / Ankara");
    });

    it("should generate different street names for different address types", () => {
      const addressHome = generateFictionalAddress({
        city: "İstanbul",
        district: "Kadıköy",
        addressType: "home",
      });

      const addressWork = generateFictionalAddress({
        city: "İstanbul",
        district: "Kadıköy",
        addressType: "work",
      });

      expect(addressHome).not.toBe(addressWork);
    });
  });
});
