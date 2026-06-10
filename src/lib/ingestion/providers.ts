import { parse } from "csv-parse/sync";

import type { ProductImportRawRow } from "@/lib/ingestion/dto";
import { generateSyntheticCatalog } from "@/lib/synthetic-catalog";

export type ProductProviderKind = "csv" | "json" | "synthetic" | "future-affiliate-feed";

export interface ProductImportProvider {
  readonly kind: ProductProviderKind;
  readonly sourceName: string;
  parse(): Promise<ProductImportRawRow[]>;
}

export interface FutureAffiliateFeedProvider extends ProductImportProvider {
  readonly kind: "future-affiliate-feed";
  readonly requiresAuthorization: true;
}

export class CsvProductProvider implements ProductImportProvider {
  readonly kind = "csv" as const;

  constructor(
    private readonly csvText: string,
    readonly sourceName = "CSV ürün içe aktarımı",
  ) {}

  async parse() {
    return parse(this.csvText, {
      bom: true,
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true,
    }) as ProductImportRawRow[];
  }
}

export class JsonProductProvider implements ProductImportProvider {
  readonly kind = "json" as const;

  constructor(
    private readonly input: string | unknown,
    readonly sourceName = "JSON ürün içe aktarımı",
  ) {}

  async parse() {
    const parsed = typeof this.input === "string" ? JSON.parse(this.input) : this.input;

    if (Array.isArray(parsed)) {
      return parsed.map(toRow);
    }

    if (isRecord(parsed)) {
      const collection = parsed.products ?? parsed.items ?? parsed.data;
      if (Array.isArray(collection)) {
        return collection.map(toRow);
      }
    }

    throw new Error("JSON kaynağı ürün dizisi veya products/items/data alanı içermeli.");
  }
}

export class SyntheticProductProvider implements ProductImportProvider {
  readonly kind = "synthetic" as const;
  readonly sourceName = "Dopamin sentetik katalog üreticisi";

  constructor(
    private readonly count = 10_000,
    private readonly options: { seed?: string } = {},
  ) {}

  async parse() {
    return generateSyntheticCatalog({
      count: this.count,
      seed: this.options.seed,
    });
  }
}

function isRecord(value: unknown): value is ProductImportRawRow {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toRow(value: unknown): ProductImportRawRow {
  return isRecord(value) ? value : {};
}
