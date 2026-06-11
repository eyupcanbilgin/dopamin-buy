import type { ProductImportDTO } from "@/lib/ingestion/dto";
import { normalizeImportRow } from "@/lib/ingestion/dto";
import {
  createDeduplicationKey,
  createProductSlug,
} from "@/lib/ingestion/normalization";
import type { ProductImportProvider } from "@/lib/ingestion/providers";
import {
  createImportImages,
  type ProductImportRepository,
  type UpsertedCatalogRecord,
} from "@/lib/ingestion/repository";

export type ProductImportValidationError = {
  row: number;
  field: string;
  message: string;
};

export type ProductImportReport = {
  sourceName: string;
  provider: string;
  totalRows: number;
  importedCount: number;
  skippedCount: number;
  duplicateCount: number;
  validationErrors: ProductImportValidationError[];
};

export class ProductImportPipeline {
  private readonly categoryCache = new Map<string, UpsertedCatalogRecord>();
  private readonly brandCache = new Map<string, UpsertedCatalogRecord>();

  constructor(private readonly repository: ProductImportRepository) {}

  async import(provider: ProductImportProvider): Promise<ProductImportReport> {
    const rows = await provider.parse();
    const report: ProductImportReport = {
      sourceName: provider.sourceName,
      provider: provider.kind,
      totalRows: rows.length,
      importedCount: 0,
      skippedCount: 0,
      duplicateCount: 0,
      validationErrors: [],
    };
    const seen = new Set<string>();

    for (const [index, row] of rows.entries()) {
      const rowNumber = index + 1;
      const parsed = normalizeImportRow(row);

      if (!parsed.success) {
        report.skippedCount += 1;
        report.validationErrors.push(
          ...parsed.error.issues.map((issue) => ({
            row: rowNumber,
            field: issue.path.join(".") || "row",
            message: issue.message,
          })),
        );
        continue;
      }

      const dto = parsed.data;
      const dedupeKey = createDeduplicationKey(dto.title, dto.brand, dto.category);

      if (seen.has(dedupeKey)) {
        report.duplicateCount += 1;
        report.skippedCount += 1;
        continue;
      }

      seen.add(dedupeKey);

      try {
        await this.importOne(dto);
        report.importedCount += 1;
      } catch (error) {
        report.skippedCount += 1;
        report.validationErrors.push({
          row: rowNumber,
          field: "row",
          message: error instanceof Error ? error.message : "Ürün içe aktarılırken hata oluştu.",
        });
      }
    }

    return report;
  }

  private async importOne(dto: ProductImportDTO) {
    const category = await this.getCategory(dto.category);
    const brand = await this.getBrand(dto.brand);
    const slug = createProductSlug(dto.title, brand.name, category.name);
    const product = await this.repository.upsertProduct({ dto, slug, category, brand });

    await this.repository.replaceProductImages(product.id, createImportImages(dto));
  }

  private async getCategory(name: string) {
    const cacheKey = createDeduplicationKey(name, undefined, "category");
    const cached = this.categoryCache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const category = await this.repository.upsertCategory(name);
    this.categoryCache.set(cacheKey, category);
    return category;
  }

  private async getBrand(name?: string) {
    const cacheKey = createDeduplicationKey(name || "Doply Studio", undefined, "brand");
    const cached = this.brandCache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const brand = await this.repository.upsertBrand(name);
    this.brandCache.set(cacheKey, brand);
    return brand;
  }
}
