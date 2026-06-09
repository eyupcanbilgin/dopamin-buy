import { describe, it, expect } from "vitest";
import {
  getProductBySlug,
  getCategoryBySlug,
  getProductsByCategory,
  getFeaturedProducts,
  getRelatedProducts,
  products,
} from "@/lib/catalog";

describe("Catalog Utilities", () => {
  describe("getProductBySlug", () => {
    it("should return correct product if slug exists", () => {
      const product = getProductBySlug("sakin-ritim-kulaklik");
      expect(product).toBeDefined();
      expect(product?.id).toBe("prd-002");
    });

    it("should return undefined if slug does not exist", () => {
      const product = getProductBySlug("non-existent-product-slug");
      expect(product).toBeUndefined();
    });
  });

  describe("getCategoryBySlug", () => {
    it("should return correct category if slug exists", () => {
      const category = getCategoryBySlug("teknoloji");
      expect(category).toBeDefined();
      expect(category?.name).toBe("Teknoloji");
    });
  });

  describe("getProductsByCategory", () => {
    it("should return products matching category slug", () => {
      const list = getProductsByCategory("moda");
      expect(list.length).toBeGreaterThan(0);
      list.forEach((prod) => {
        expect(prod.category).toBe("moda");
      });
    });
  });

  describe("getFeaturedProducts", () => {
    it("should return a list of featured products of correct length", () => {
      const list = getFeaturedProducts();
      expect(list.length).toBeLessThanOrEqual(8);
    });
  });

  describe("getRelatedProducts", () => {
    it("should return related products from the same category but exclude current product", () => {
      const firstProduct = products[0]; // let's say "Minimal Keten Trençkot", category "moda"
      const list = getRelatedProducts(firstProduct);
      expect(list.length).toBeLessThanOrEqual(4);
      list.forEach((item) => {
        expect(item.category).toBe(firstProduct.category);
        expect(item.id).not.toBe(firstProduct.id);
      });
    });
  });
});
