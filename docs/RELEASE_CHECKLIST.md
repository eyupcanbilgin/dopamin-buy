# Doply Release Checklist

Bu kontrol listesi Doply'nin local -> staging -> production akışını güvenli tutmak için kullanılır. Doply bir alışveriş simülasyonu platformudur; release sırasında gerçek ödeme, gerçek kargo, gerçek sipariş veya tam açık adres akışı eklenmediği ayrıca doğrulanmalıdır.

## Branch Modeli

- Feature işleri: kısa ömürlü feature branch.
- Staging adayı: `staging`.
- Production: `main`.
- Promote sırası: `feature branch -> staging -> main`.

## Staging'e Push Etmeden Önce

- `git status` temiz veya beklenen değişiklikleri gösteriyor.
- Yeni secret, `.env`, Neon URL'si veya admin key commit edilmedi.
- `npm run release:check` lokal olarak geçti.
- Schema değiştiyse migration dosyası eklendi.
- Build script seed veya reset çalıştırmıyor.
- Ödeme simülasyonu hala kart numarası, CVV veya son kullanma tarihi istemiyor.
- Teslimat simülasyonu hala tam açık adres istemiyor.
- Sipariş dili hala `Sanal Sipariş` / `Simülasyon` kavramlarını kullanıyor.

## Staging Deployment Sonrası

- Vercel Preview deployment başarılı.
- Preview env değişkenleri doğru:
  - `DOPLY_DEPLOY_ENV=staging`
  - `DATABASE_URL=<Neon staging URL>`
  - `DOPLY_ADMIN_KEY=<staging-only strong key>`
  - `NEXT_PUBLIC_SITE_URL=https://staging.doply.app` veya geçerli preview URL
- Staging Neon DB için migration çalıştırıldı:
  - `npm run db:migrate`
- Staging katalog gerekiyorsa manuel seed edildi:
  - `npm run db:seed`
- Staging DB doğrulandı:
  - `npm run db:verify`
- Beklenen minimumlar sağlandı:
  - aktif ürün >= 10.000
  - aktif kategori >= 12
  - marka >= 1.000
  - ürün görseli >= 10.000
  - duplicate slug = 0
  - eksik/geçersiz fiyat = 0
- Smoke test yapıldı:
  - onboarding/disclosure görünür
  - ürün listeleme ve ürün detay çalışır
  - sepet çalışır
  - teslimat simülasyonu açık adres istemez
  - ödeme simülasyonu kart alanı göstermez
  - sanal sipariş başarı ekranı duygusal kapanış sağlar
  - admin katalog ekranları admin key olmadan açılamaz

## Main'e Merge Etmeden Önce

- Staging deployment en son commit ile çalışıyor.
- Staging smoke test tamamlandı.
- Production env değişkenleri Preview env'den ayrı:
  - `DOPLY_DEPLOY_ENV=production`
  - `DATABASE_URL=<Neon production URL>`
  - `DOPLY_ADMIN_KEY=<production-only strong key>`
  - `NEXT_PUBLIC_SITE_URL=https://doply.app`
- Production Neon DB staging DB'den ayrı branch/database.
- Production seed/reset planlanmıyor.
- Production'a yalnızca migration deploy ve verify yapılacak.

## Production Deployment Sonrası

- Vercel Production deployment başarılı.
- Domain `https://doply.app` doğru deployment'a bağlı.
- Production DB migration uygulandı:
  - `npm run db:migrate`
- Production DB doğrulandı:
  - `npm run db:verify`
- Production smoke test:
  - anasayfa açılır
  - kategori sayfası açılır
  - ürün detay sayfası açılır
  - sepet ve simülasyon checkout çalışır
  - ödeme sayfasında kart numarası, CVV, son kullanma tarihi yok
  - teslimat sayfasında tam açık adres yok
  - başarı ekranı gerçek sipariş iddiası kurmaz
  - admin route'ları key olmadan korunur

## Production Seed Recovery

Normal production release'te seed çalıştırma.

Production katalog recovery gerçekten gerekiyorsa:

```bash
DOPLY_DEPLOY_ENV=production
DOPLY_ALLOW_PRODUCTION_SEED=true
DOPLY_SEED_CONFIRM=production-reset
npm run db:seed
```

Bu yalnızca bilinçli recovery adımıdır. Rutin release sürecinin parçası değildir.
