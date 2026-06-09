# Dopamin

Dopamin, online alışveriş dürtüsünü gerçek para harcamadan tamamlamaya yardımcı olan etik bir alışveriş simülasyonu platformudur.

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
- Unit/component/e2e test altyapısı

## Etik sınırlar

Dopamin özellikle şu verileri istemez ve saklamaz:

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
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dopamin?schema=public"
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

Şema doğrulama:

```bash
npm run prisma:validate
```

Seed çalıştırma:

```bash
npm run db:seed
```

Seed içeriği:

- 10 kategori
- 20 kurgusal marka
- 100 Türkçe kurgusal ürün
- placeholder ürün görselleri
- etik ad slotları
- içerik sayfaları

Not: Seed için çalışan bir PostgreSQL veritabanı ve doğru `DATABASE_URL` gerekir.

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
git commit -m "Initial Dopamin simulation platform"
```

Sonra GitHub'da boş bir repo oluşturup remote ekle:

```bash
git remote add origin https://github.com/<kullanici-adi>/<repo-adi>.git
git branch -M main
git push -u origin main
```

## Ürün notu

Dopamin destekleyici bir farkındalık aracıdır; tıbbi tedavi yerine geçmez. Zorlayıcı alışveriş dürtüleri için profesyonel destek almak iyi bir adım olabilir.
