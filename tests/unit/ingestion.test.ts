import { describe, expect, it } from "vitest";

import { normalizeImportRow } from "@/lib/ingestion/dto";
import { parsePriceToKurus } from "@/lib/ingestion/normalization";
import { ProductImportPipeline } from "@/lib/ingestion/pipeline";
import { CsvProductProvider, JsonProductProvider } from "@/lib/ingestion/providers";
import type {
  ProductImportRepository,
  UpsertProductInput,
  UpsertedCatalogRecord,
} from "@/lib/ingestion/repository";
import { generateSyntheticCatalog, SYNTHETIC_CATEGORY_TAXONOMY } from "@/lib/synthetic-catalog";
import { slugifyTurkish } from "@/lib/slug";

describe("product ingestion", () => {
  it("normalizes Turkish slugs and prices into kuruş", () => {
    expect(slugifyTurkish("Şık Çanta & Günlük Ürün")).toBe("sik-canta-gunluk-urun");
    expect(parsePriceToKurus("1.299,90 TL")).toBe(129_990);
  });

  it("parses CSV rows with Turkish field aliases", async () => {
    const provider = new CsvProductProvider(
      'Ürün Adı,Kategori,Fiyat,Marka\n"Minimal, Keten Gömlek",Moda,"1.299,90",Luma Atelier',
    );

    const rows = await provider.parse();
    const parsed = normalizeImportRow(rows[0]);

    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.title).toBe("Minimal, Keten Gömlek");
      expect(parsed.data.priceCents).toBe(129_990);
    }
  });

  it("parses JSON products collections", async () => {
    const provider = new JsonProductProvider({
      products: [{ title: "Sakin Defter", category: "Kitap & Hobi", price: 249 }],
    });

    await expect(provider.parse()).resolves.toHaveLength(1);
  });

  it("generates a deterministic Turkish synthetic catalog with rich metadata", () => {
    const first = generateSyntheticCatalog({ count: 120, seed: "test-seed" });
    const second = generateSyntheticCatalog({ count: 120, seed: "test-seed" });
    const other = generateSyntheticCatalog({ count: 120, seed: "other-seed" });

    expect(first).toEqual(second);
    expect(first[0]).not.toEqual(other[0]);
    expect(new Set(first.map((row) => row.title)).size).toBe(120);
    expect(SYNTHETIC_CATEGORY_TAXONOMY.map((category) => category.name)).toEqual([
      "Teknoloji",
      "Telefon & Aksesuar",
      "Bilgisayar",
      "Oyuncu Ekipmanları",
      "Moda",
      "Ayakkabı & Çanta",
      "Ev & Yaşam",
      "Mutfak",
      "Kozmetik & Bakım",
      "Spor",
      "Kitap & Hobi",
      "Kırtasiye",
    ]);
    expect(first[0]).toMatchObject({
      catalogSource: "synthetic",
      stockFeelingLabel: expect.any(String),
      simulatedDeliveryEstimate: expect.any(String),
      campaignLabel: expect.any(String),
      merchant: expect.any(String),
    });
  });

  it("can generate 10,000 unique product titles by default", () => {
    const generated = generateSyntheticCatalog({ seed: "large-test" });

    expect(generated).toHaveLength(10_000);
    expect(new Set(generated.map((row) => row.title)).size).toBe(10_000);
  });

  it("reports invalid rows and duplicate products without crashing the import", async () => {
    const repository = new MemoryImportRepository();
    const provider = new JsonProductProvider([
      { title: "Sakin Defter", category: "Kitap & Hobi", brand: "Defterhane", price: 249 },
      { title: "Sakin Defter", category: "Kitap & Hobi", brand: "Defterhane", price: 249 },
      { title: "", category: "Moda", price: 399 },
    ]);

    const report = await new ProductImportPipeline(repository).import(provider);

    expect(report.totalRows).toBe(3);
    expect(report.importedCount).toBe(1);
    expect(report.duplicateCount).toBe(1);
    expect(report.skippedCount).toBe(2);
    expect(report.validationErrors[0]?.field).toBe("title");
    expect(repository.products.size).toBe(1);
  });
});

class MemoryImportRepository implements ProductImportRepository {
  readonly categories = new Map<string, UpsertedCatalogRecord>();
  readonly brands = new Map<string, UpsertedCatalogRecord>();
  readonly products = new Map<string, UpsertProductInput>();
  readonly images = new Map<string, Array<{ url: string; altText: string }>>();

  async upsertCategory(name: string) {
    return this.upsertRecord(this.categories, name);
  }

  async upsertBrand(name?: string) {
    return this.upsertRecord(this.brands, name || "Dopamin Studio");
  }

  async upsertProduct(input: UpsertProductInput) {
    this.products.set(input.slug, input);
    return { id: input.slug };
  }

  async replaceProductImages(productId: string, images: Array<{ url: string; altText: string }>) {
    this.images.set(productId, images);
  }

  private upsertRecord(map: Map<string, UpsertedCatalogRecord>, name: string) {
    const slug = slugifyTurkish(name);
    const record = map.get(slug) ?? { id: slug, name, slug };
    map.set(slug, record);
    return record;
  }
}
