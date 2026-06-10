"use client";

import { useMemo, useState } from "react";
import { FileJson, FileUp, Layers3, RotateCcw, ShieldCheck, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { ProductImportReport } from "@/lib/ingestion/pipeline";

const sampleJson = JSON.stringify(
  [
    {
      title: "Yetkili Feed Kahve Öğütücü",
      category: "Mutfak",
      brand: "Kahve Noktası",
      price: 2499.9,
      rating: 4.6,
      merchant: "Partner Demo Feed",
      imageUrl: "https://placehold.co/900x675/F7F1E8/243047/png?text=Kahve+Ogutucu",
    },
  ],
  null,
  2,
);

export function ProductImportAdmin() {
  const [adminKey, setAdminKey] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [jsonText, setJsonText] = useState(sampleJson);
  const [syntheticCount, setSyntheticCount] = useState(10_000);
  const [syntheticSeed, setSyntheticSeed] = useState("dopamin-demo-2026");
  const [report, setReport] = useState<ProductImportReport | null>(null);
  const [error, setError] = useState("");
  const [loadingLabel, setLoadingLabel] = useState("");

  const canSubmit = useMemo(() => adminKey.trim().length > 0 && !loadingLabel, [adminKey, loadingLabel]);

  async function runCsvImport() {
    if (!csvFile) {
      setError("CSV import için önce dosya seç.");
      return;
    }

    const formData = new FormData();
    formData.append("sourceType", "csv");
    formData.append("file", csvFile);

    await submitImport("CSV içe aktarılıyor", {
      method: "POST",
      headers: { "x-dopamin-admin-key": adminKey },
      body: formData,
    });
  }

  async function runJsonImport() {
    await submitImport("JSON içe aktarılıyor", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-dopamin-admin-key": adminKey,
      },
      body: JSON.stringify({ sourceType: "json", payload: jsonText }),
    });
  }

  async function runSyntheticImport() {
    await submitJsonImport("Sentetik katalog üretiliyor", {
      sourceType: "synthetic",
      count: syntheticCount,
      seed: syntheticSeed,
    });
  }

  async function runTenThousandProducts() {
    await submitJsonImport("10.000 ürün oluşturuluyor", {
      sourceType: "synthetic",
      count: 10_000,
      seed: syntheticSeed,
    });
  }

  async function refillTaxonomy() {
    await submitJsonImport("Kategori taksonomisi yenileniyor", {
      sourceType: "taxonomy",
    });
  }

  async function resetDemoCatalog() {
    await submitJsonImport("Demo kataloğu sıfırlanıyor", {
      sourceType: "reset-demo",
      count: 10_000,
      seed: syntheticSeed,
    });
  }

  async function submitJsonImport(label: string, body: Record<string, unknown>) {
    await submitImport(label, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-dopamin-admin-key": adminKey,
      },
      body: JSON.stringify(body),
    });
  }

  async function submitImport(label: string, init: RequestInit) {
    setError("");
    setReport(null);
    setLoadingLabel(label);

    try {
      const response = await fetch("/api/admin/import-products", init);
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Import işlemi başarısız oldu.");
      }

      setReport(payload as ProductImportReport);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Import işlemi başarısız oldu.");
    } finally {
      setLoadingLabel("");
    }
  }

  return (
    <div className="grid gap-6">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="simulation">Admin import</Badge>
            <Badge variant="outline">Yetkili kaynaklar</Badge>
            <Badge variant="success">Gerçek ödeme yok</Badge>
          </div>
          <CardTitle className="mt-3">Ürün veri katmanı</CardTitle>
          <CardDescription className="max-w-3xl leading-6">
            Bu alan yalnızca CSV, JSON, partner feed veya Dopamin tarafından üretilmiş sentetik
            katalog verisi içindir. Web sitesi kazıma, koruma atlatma ya da izinsiz görsel kullanımı
            için tasarlanmamıştır.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="admin-key">Admin anahtarı</Label>
          <Input
            id="admin-key"
            type="password"
            value={adminKey}
            onChange={(event) => setAdminKey(event.target.value)}
            autoComplete="off"
            className="mt-2 max-w-xl"
          />
          <p className="mt-2 text-xs leading-5 text-muted-foreground">
            Anahtar tarayıcıda saklanmaz; sadece import isteğinde header olarak gönderilir.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="dopamine">Sentetik demo katalog</Badge>
            <Badge variant="outline">Deterministik seed</Badge>
          </div>
          <CardTitle className="mt-3">Hızlı katalog operasyonları</CardTitle>
          <CardDescription className="max-w-3xl leading-6">
            Bu aksiyonlar yalnızca kurgusal ürün, marka ve kategori verisi üretir. Gerçek marka,
            gerçek ürün listesi veya telifli ürün görseli kullanılmaz.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="synthetic-seed">Deterministik seed</Label>
            <Input
              id="synthetic-seed"
              value={syntheticSeed}
              onChange={(event) => setSyntheticSeed(event.target.value)}
              className="max-w-xl"
            />
            <p className="text-xs leading-5 text-muted-foreground">
              Aynı seed ve adet aynı başlık, fiyat, marka ve metadata dağılımını üretir.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <Button type="button" onClick={runTenThousandProducts} disabled={!canSubmit}>
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              10.000 Ürün Oluştur
            </Button>
            <Button type="button" variant="outline" onClick={refillTaxonomy} disabled={!canSubmit}>
              <Layers3 className="h-4 w-4" aria-hidden="true" />
              Kategorileri Yeniden Doldur
            </Button>
            <Button type="button" variant="outline" onClick={resetDemoCatalog} disabled={!canSubmit}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Demo Kataloğu Sıfırla
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
              <FileUp className="h-5 w-5" aria-hidden="true" />
            </span>
            <CardTitle>CSV yükle</CardTitle>
            <CardDescription>Başlık satırı olan yetkili CSV feed dosyası.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="csv-file">CSV dosyası</Label>
              <Input
                id="csv-file"
                type="file"
                accept=".csv,text/csv"
                onChange={(event) => setCsvFile(event.target.files?.[0] ?? null)}
              />
            </div>
            <Button type="button" onClick={runCsvImport} disabled={!canSubmit}>
              CSV import et
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
              <FileJson className="h-5 w-5" aria-hidden="true" />
            </span>
            <CardTitle>JSON yapıştır</CardTitle>
            <CardDescription>Ürün dizisi veya products/items/data alanı desteklenir.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="json-feed">JSON kaynak</Label>
              <Textarea
                id="json-feed"
                value={jsonText}
                onChange={(event) => setJsonText(event.target.value)}
                spellCheck={false}
                className="min-h-56 font-mono text-xs"
              />
            </div>
            <Button type="button" onClick={runJsonImport} disabled={!canSubmit}>
              JSON import et
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </span>
            <CardTitle>Sentetik üret</CardTitle>
            <CardDescription>Gerçekçi ama tamamen kurgusal Dopamin katalog verisi.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="synthetic-count">Ürün adedi</Label>
              <Input
                id="synthetic-count"
                type="number"
                min={1}
                max={10000}
                value={syntheticCount}
                onChange={(event) => setSyntheticCount(Number(event.target.value))}
              />
              <p className="text-xs leading-5 text-muted-foreground">
                MVP sınırı tek çalıştırmada 10.000 üründür. Seed yukarıdaki alandan alınır.
              </p>
            </div>
            <Button type="button" onClick={runSyntheticImport} disabled={!canSubmit}>
              Sentetik katalog üret
            </Button>
          </CardContent>
        </Card>
      </div>

      {loadingLabel ? (
        <Card aria-live="polite">
          <CardContent className="flex items-center gap-3 pt-5">
            <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
            <p className="text-sm font-medium">{loadingLabel}...</p>
          </CardContent>
        </Card>
      ) : null}

      {error ? (
        <Card className="border-destructive/40 bg-destructive/5" role="alert">
          <CardContent className="pt-5">
            <p className="font-semibold text-destructive">Import tamamlanamadı</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      ) : null}

      {report ? <ImportReportCard report={report} /> : null}
    </div>
  );
}

function ImportReportCard({ report }: { report: ProductImportReport }) {
  const shownErrors = report.validationErrors.slice(0, 12);

  return (
    <Card aria-live="polite">
      <CardHeader>
        <Badge variant={report.skippedCount > 0 ? "dopamine" : "success"} className="w-fit">
          Import raporu
        </Badge>
        <CardTitle>{report.sourceName}</CardTitle>
        <CardDescription>
          Ürün katalog sayfaları başarılı import sonrası veritabanındaki aktif ürünleri göstermeye
          başlar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-4">
          <ReportMetric label="Toplam satır" value={report.totalRows} />
          <ReportMetric label="İçe aktarılan" value={report.importedCount} />
          <ReportMetric label="Atlanan" value={report.skippedCount} />
          <ReportMetric label="Tekrarlı" value={report.duplicateCount} />
        </div>

        {shownErrors.length > 0 ? (
          <>
            <Separator className="my-5" />
            <div>
              <h3 className="font-semibold">Doğrulama hataları</h3>
              <div className="mt-3 overflow-hidden rounded-lg border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-secondary/70 text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 font-medium">Satır</th>
                      <th className="px-3 py-2 font-medium">Alan</th>
                      <th className="px-3 py-2 font-medium">Açıklama</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shownErrors.map((issue, index) => (
                      <tr key={`${issue.row}-${issue.field}-${index}`} className="border-t">
                        <td className="px-3 py-2">{issue.row}</td>
                        <td className="px-3 py-2">{issue.field}</td>
                        <td className="px-3 py-2">{issue.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {report.validationErrors.length > shownErrors.length ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  İlk {shownErrors.length} hata gösteriliyor; toplam {report.validationErrors.length} hata var.
                </p>
              ) : null}
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}

function ReportMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold text-navy">{value.toLocaleString("tr-TR")}</p>
    </div>
  );
}
