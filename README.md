# Doply

Doply, online alışveriş dürtüsünü gerçek para harcamadan tamamlamaya yardımcı olan etik bir alışveriş simülasyonu platformudur.

Bu proje bir ecommerce checkout sistemi değildir. Gerçek ödeme almaz, gerçek teslimat planlamaz, fatura üretmez ve kullanıcıyı gerçek bir satın alma yaptığına inandırmaz. Ürün akışı özellikle `Sanal Sipariş`, `Simülasyon` ve `Gerçek ödeme yok` diliyle tasarlanmıştır.

## Özellikler

- Premium Türkçe alışveriş simülasyonu arayüzü
- Ürün keşfi, kategori gridleri, ürün detayları ve sanal sepet
- Çok adımlı Sanal Sipariş akışı:
  - sepet inceleme
  - teslimat simülasyonu
  - kargo hissi simülasyonu
  - kart alanı olmayan ödeme simülasyonu
  - duygusal kapanış ekranı
- Alışveriş dürtüsü için önce/sonra check-in
- Harcamaktan kaçınılan tutar özeti
- Zustand ile hassas olmayan simülasyon state yönetimi
- Prisma + PostgreSQL için simülasyon odaklı veri modeli
- CSV/JSON ve sentetik katalog için admin-only ürün import katmanı
- Unit/component/e2e test altyapısı

## Etik sınırlar

Doply özellikle şu verileri istemez ve saklamaz:

- gerçek kredi kartı numarası
- CVV
- son kullanma tarihi
- kimlik numarası
- telefon
- tam açık adres

Teslimat simülasyonunda yalnızca şehir, ilçe, adres tipi ve güvenli şekilde üretilmiş kurgusal adres kullanılabilir.

## Teknoloji

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn/ui tarzı komponentler
- Framer Motion
- Zustand
- Zod
- Prisma 7
- PostgreSQL
- Vitest
- Playwright

## Kurulum

```bash
npm install
```

Ortam değişkeni örneğini oluştur:

```bash
cp .env.example .env
```

`.env` içinde PostgreSQL bağlantını ayarla:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/doply?schema=public"
DOPLY_ADMIN_KEY="yerel-guvenli-admin-anahtari"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

Prisma client üret:

```bash
npm run prisma:generate
```

Geliştirme sunucusunu başlat:

```bash
npm run dev
```

Uygulama varsayılan olarak şu adreste çalışır:

```text
http://localhost:3000
```

## Veritabanı

Doply staging ve production akışı PostgreSQL üzerinde migration + doğrulama adımlarını açık şekilde çalıştırır. Seed/reset komutları build veya deploy sırasında otomatik çalışmaz; sadece doğru veritabanını hedeflediğinden emin olduktan sonra manuel çalıştırılır. Lokal fallback katalog yalnızca geliştirme ve hata toleransı içindir; staging için `npm run db:verify` başarılı olmalıdır.

### Ortam modeli

| Ortam | Git branch | Vercel ortamı | Domain | Veritabanı |
| --- | --- | --- | --- | --- |
| local | feature branch veya local worktree | yok | `http://localhost:3000` | lokal PostgreSQL veya Neon dev/staging branch |
| staging | `staging` | Preview | `https://staging.doply.app` veya Vercel preview URL | Neon staging branch/database |
| production | `main` | Production | `https://doply.app` | Neon production branch/database |

Önerilen akış:

```text
feature branch -> pull request -> staging branch -> Vercel Preview -> main -> Vercel Production
```

`staging` branch'i beta ve veri doğrulama alanıdır. `main` yalnızca staging doğrulaması tamamlandıktan sonra production'a promote edilir.

### Vercel ortam değişkenleri

Vercel panelinde value alanına tırnak koyma. Örneğin `NEXT_PUBLIC_SITE_URL=https://doply.app` yaz; `"https://doply.app"` yazma.

Local `.env` örneği:

```bash
DOPLY_DEPLOY_ENV=local
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require
DOPLY_ADMIN_KEY=uzun-rastgele-local-admin-anahtari
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DOPLY_PREMIUM_NO_ADS=false
```

Vercel Preview / staging:

```bash
DOPLY_DEPLOY_ENV=staging
DATABASE_URL=<Neon staging database URL>
DOPLY_ADMIN_KEY=<staging-only strong key, 16+ chars>
NEXT_PUBLIC_SITE_URL=https://staging.doply.app
NEXT_PUBLIC_DOPLY_PREMIUM_NO_ADS=false
```

Vercel Production:

```bash
DOPLY_DEPLOY_ENV=production
DATABASE_URL=<Neon production database URL>
DOPLY_ADMIN_KEY=<production-only strong key, 16+ chars>
NEXT_PUBLIC_SITE_URL=https://doply.app
NEXT_PUBLIC_DOPLY_PREMIUM_NO_ADS=false
```

Opsiyonel seed ve doğrulama değişkenleri local/staging için kullanılabilir:

```bash
DOPLY_SEED_PRODUCT_COUNT=10000
DOPLY_SEED_VALUE=doply-staging-2026
DOPLY_VERIFY_MIN_PRODUCTS=10000
DOPLY_VERIFY_MIN_CATEGORIES=12
DOPLY_VERIFY_MIN_BRANDS=1000
DOPLY_VERIFY_MIN_IMAGES=10000
```

Şema doğrulama:

```bash
npm run prisma:validate
```

Migration deploy. Bu komut production'da da güvenlidir; yalnızca migration uygular:

```bash
npm run db:migrate
```

Prisma migration scripti ayni isi yapar ve staging dogrulamasinda da calismasi beklenir:

```bash
npm run prisma:migrate:deploy
```

10.000 ürünlük sentetik demo katalog seed'i. Bu komutu normalde yalnızca local veya staging veritabanına karşı çalıştır:

```bash
npm run db:seed
```

Alternatif Prisma seed scripti:

```bash
npm run prisma:db:seed
```

Katalog ve veritabanı sağlığı doğrulama:

```bash
npm run db:verify
```

Aktif ürünlerde eksik görsel çıkarsa güvenli placeholder görsel onarımı:

```bash
npm run db:repair-images
```

Beklenen minimum sonuçlar:

- aktif ürün: en az 10.000
- aktif kategori: en az 12
- marka: en az 1.000
- ürün görseli: en az 10.000
- tekrar eden slug: 0
- eksik/geçersiz fiyat: 0
- kategori ilişkisi eksik ürün: 0
- görselsiz aktif ürün: 0

Staging veritabanı kurulum sırası:

```bash
npm install
npm run prisma:generate
npm run prisma:validate
npm run db:migrate
npm run db:seed
npm run db:verify
npm run build
```

Seed 12 kategorilik Doply taksonomisini, binlerce kurgusal markayı, varsayılan olarak 10.000 Türkçe sentetik ürünü, güvenli placeholder ürün görsellerini, etik ad slotlarını ve temel içerik sayfalarını oluşturur. Seed deterministiktir; aynı `DOPLY_SEED_VALUE` ile aynı katalog yeniden üretilebilir.

Production seed güvenliği:

- `npm run build` seed veya reset çalıştırmaz.
- `npm run db:migrate` seed veya reset çalıştırmaz.
- `npm run db:seed` production-benzeri hedeflerde varsayılan olarak bloklanır.
- Production-benzeri hedef: `DOPLY_DEPLOY_ENV=production`, `VERCEL_ENV=production` veya `NEXT_PUBLIC_SITE_URL=https://doply.app`.
- Production recovery için seed gerçekten gerekiyorsa iki değişken birlikte verilmelidir: `DOPLY_ALLOW_PRODUCTION_SEED=true` ve `DOPLY_SEED_CONFIRM=production-reset`.

### Release kontrolü

Kod release öncesi:

```bash
npm run release:check
```

Bu komut sırasıyla `lint`, `typecheck`, `test`, `build` çalıştırır. İçinde bulunduğun shell'de `DATABASE_URL` varsa ayrıca `db:verify` çalıştırır; yoksa DB doğrulamasını atlar. `npm run deploy:check` aynı komutun alias'ıdır.

### Staging'den production'a promote

1. Feature branch'i PR ile `staging` branch'ine al.
2. Vercel Preview deployment'ının geçtiğini doğrula.
3. Staging Neon DB için `npm run db:migrate`, gerekiyorsa `npm run db:seed`, ardından `npm run db:verify` çalıştır.
4. `npm run release:check` çalıştır.
5. Staging UI'da Sanal Sipariş, ödeme simülasyonu ve admin katalog kontrollerini smoke test et.
6. `staging` branch'ini `main` branch'ine merge et.
7. Production Vercel deployment sonrası production Neon DB için `npm run db:migrate` ve `npm run db:verify` çalıştır.
8. Production'da gerçek ödeme, gerçek kart alanı, açık adres veya gerçek teslimat akışı olmadığını kontrol et.

## Ürün importu

Ürün import katmanı yalnızca yetkili kaynaklar için tasarlanmıştır:

- CSV dosyaları
- JSON feed dosyaları
- partner veya affiliate API/feed kaynakları
- Doply tarafından üretilmiş sentetik katalog verisi

Web scraping, koruma atlatma veya izinsiz ürün görseli kullanımı bu projenin kapsamı dışındadır.

Admin arayüzü:

```text
http://localhost:3000/admin/import
```

API route:

```text
POST /api/admin/import-products
Header: x-doply-admin-key: <DOPLY_ADMIN_KEY>
```

Örnek import dosyaları:

- `data/import-samples/products.example.csv`
- `data/import-samples/products.example.json`

Desteklenen import akışları:

- CSV yükleme
- JSON yapıştırma
- deterministik seed ile 10.000 ürüne kadar sentetik katalog üretimi
- 12 kategorilik Doply taksonomisini yeniden doldurma
- sentetik demo kataloğunu güvenli şekilde sıfırlama

Import raporu toplam satır, içe aktarılan satır, atlanan satır, doğrulama hataları ve tekrar sayısını gösterir. Fiyatlar veritabanında integer kuruş olarak saklanır.

Sentetik katalog motoru:

- gerçek marka, gerçek ürün başlığı veya ecommerce sitesinden kopyalanmış veri kullanmaz
- kategori bazlı kurgusal marka üretir
- Türkçe marketplace stilinde ürün adları oluşturur
- eski fiyat, sanal kampanya etiketi, yorum sayısı, merchant adı, teslimat simülasyonu, popülerlik, dopamin skoru ve baskısız stok hissi üretir
- görseller için güvenli placeholder URL'leri kullanır

Admin hızlı aksiyonları:

- `10.000 Ürün Oluştur`
- `Kategorileri Yeniden Doldur`
- `Demo Kataloğu Sıfırla`

## Kontroller

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

E2E testleri:

```bash
npm run test:e2e
```

## GitHub'a yükleme

Bu klasörde git yoksa:

```bash
git init
git add .
git commit -m "Initial Doply simulation platform"
```

Sonra GitHub'da boş bir repo oluşturup remote ekle:

```bash
git remote add origin https://github.com/<kullanici-adi>/<repo-adi>.git
git branch -M main
git push -u origin main
```

## Ürün notu

Doply destekleyici bir farkındalık aracıdır; tıbbi tedavi yerine geçmez. Zorlayıcı alışveriş dürtüleri için profesyonel destek almak iyi bir adım olabilir.
