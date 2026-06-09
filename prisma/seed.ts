import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to seed Dopamin.");
}

const adapter = new PrismaPg(databaseUrl);
const prisma = new PrismaClient({ adapter });

const categories = [
  ["Moda", "moda", "Kıyafet ve aksesuar simülasyonları"],
  ["Teknoloji", "teknoloji", "Cihaz ve elektronik alışveriş hissi"],
  ["Ev & Yaşam", "ev-yasam", "Ev düzeni ve dekorasyon ürünleri"],
  ["Güzellik", "guzellik", "Bakım ve iyi hissetme kategorisi"],
  ["Spor", "spor", "Hareket ve motivasyon ürünleri"],
  ["Kitap & Hobi", "kitap-hobi", "Yaratıcı mola ve hobi ürünleri"],
  ["Anne & Çocuk", "anne-cocuk", "Aile yaşamı için sanal keşifler"],
  ["Ofis", "ofis", "Çalışma düzeni ve masa üstü ürünleri"],
  ["Mutfak", "mutfak", "Pişirme, servis ve kahve ritüelleri"],
  ["Seyahat", "seyahat", "Yolculuk hissi veren sanal ürünler"],
] as const;

const brands = [
  ["Luma Atelier", "luma-atelier"],
  ["NOVA Sanal", "nova-sanal"],
  ["Mira Kolektif", "mira-kolektif"],
  ["Koru Studio", "koru-studio"],
  ["Vera Goods", "vera-goods"],
  ["Dingin Lab", "dingin-lab"],
  ["Sora Home", "sora-home"],
  ["Pera Works", "pera-works"],
  ["Nefes Club", "nefes-club"],
  ["Yolcu Set", "yolcu-set"],
  ["MonoPazar", "monopazar"],
  ["İyi His", "iyi-his"],
  ["Kanvas Marka", "kanvas-marka"],
  ["Lotus Form", "lotus-form"],
  ["Ritim Tech", "ritim-tech"],
  ["Sadece Studio", "sadece-studio"],
  ["Motto Gear", "motto-gear"],
  ["Kahve Noktası", "kahve-noktasi"],
  ["Defterhane", "defterhane"],
  ["Yumuşak Ev", "yumusak-ev"],
] as const;

type ProductTemplate = {
  name: string;
  shortDescription: string;
  basePrice: number;
};

const productTemplates: Record<string, ProductTemplate[]> = {
  "moda": [
    ["Keten Görünümlü Trençkot", "Mevsim geçişi için zamansız dış katman.", 329_000],
    ["Düzenli Gün Çantası", "Laptop ve günlük eşyalar için sakin form.", 189_000],
    ["Minimal Analog Saat", "Sessiz lüks hissi veren ince aksesuar.", 279_000],
    ["Yumuşak Dokulu Kazak", "Serin günler için rahat ve sade görünüm.", 149_000],
    ["Şehir Sneaker", "Günlük yürüyüş hissi için hafif taban.", 229_000],
    ["İnce Kartlık", "Çantayı sadeleştiren küçük aksesuar.", 69_000],
    ["Dökümlü Gömlek", "Ofis ve hafta sonu için yumuşak kesim.", 129_000],
    ["Pamuklu Şal", "Katmanlı kombin hissi veren dokulu parça.", 89_000],
    ["Kapsül Pantolon", "Günlük dolap düzeni için net siluet.", 179_000],
    ["Sakin Ton Bere", "Kış görünümünü tamamlayan yumuşak aksesuar.", 59_000],
  ].map(toTemplate),
  "teknoloji": [
    ["Sakin Ritim Kulaklık", "Sessiz çalışma ve yürüyüş molaları için.", 549_000],
    ["Mini Projektör", "Film gecesi hayalini canlandıran küçük cihaz.", 699_000],
    ["Akıllı Masa Lambası", "Odak atmosferi için ayarlanabilir ışık.", 239_000],
    ["Kompakt Klavye", "Masa düzeni hissi veren mekanik dokunuş.", 219_000],
    ["Taşınabilir Hoparlör", "Küçük odalar için sıcak ses hissi.", 189_000],
    ["Dijital Not Tableti", "Kağıtsız not alma ritüeli simülasyonu.", 319_000],
    ["Kablosuz Şarj Standı", "Masa üstünde düzenli teknoloji görünümü.", 149_000],
    ["Odak Zamanlayıcı", "Çalışma bloklarını görünür kılan cihaz.", 119_000],
    ["Minimal Webcam", "Toplantı köşesi düzenleme hissi.", 279_000],
    ["Mat Powerbank", "Dışarıda güvende hissettiren taşınabilir enerji.", 259_000],
  ].map(toTemplate),
  "ev-yasam": [
    ["Sessiz Oda Mum Seti", "Akşam sakinliği için üçlü konsept.", 79_000],
    ["Seramik Kahve Seti", "İki fincan ve küçük servis tabağı hissi.", 119_000],
    ["Pamuklu Koltuk Şalı", "Salon ritüeline sıcak dokunuş.", 139_000],
    ["Minimal Duvar Rafı", "Evi düzenleme isteğini simüle eder.", 169_000],
    ["Yumuşak Nevresim Seti", "Dinlenme alanı için sade görünüm.", 329_000],
    ["Cam Vazo", "Masa üstünde ferah odak noktası.", 89_000],
    ["Dingin Oda Spreyi", "Koku ritüeli için güvenli sanal ürün.", 69_000],
    ["Hasır Sepet", "Dağınıklığı toparlama hissi.", 99_000],
    ["Yan Sehpa", "Küçük alanları tamamlayan form.", 249_000],
    ["Okuma Lambası", "Yatak başı sakinlik hissi.", 189_000],
  ].map(toTemplate),
  "guzellik": [
    ["Günlük Bakım Seti", "Sade krem ve serum rutini hissi.", 149_000],
    ["Nem Desteği Kremi", "Kuru günler için bakım simülasyonu.", 89_000],
    ["Yumuşak Ton Ruj", "Günlük görünümü tamamlayan renk.", 59_000],
    ["Sakin Cilt Maskesi", "Akşam bakım ritüeli için konsept.", 79_000],
    ["Minimal Makyaj Çantası", "Bakım ürünlerini düzenleme hissi.", 69_000],
    ["Saç Bakım Yağı", "Parlaklık beklentisini güvenli alanda dene.", 99_000],
    ["El Bakım İkilisi", "Çanta boyu iyi his seti.", 49_000],
    ["Dingin Duş Jeli", "Duş sonrası rahatlık hissi.", 39_000],
    ["Kaş Bakım Seti", "Küçük dokunuş rutini simülasyonu.", 64_000],
    ["Güneş Koruma Kremi", "Günlük bakım çantası hissi.", 129_000],
  ].map(toTemplate),
  "spor": [
    ["Yumuşak Koşu Ayakkabısı", "Yürüyüş motivasyonu için hafif taban.", 389_000],
    ["Denge Yoga Matı", "Evde esneme rutini için sade mat.", 99_000],
    ["Su Matarası", "Gün içinde hareketi hatırlatan aksesuar.", 49_000],
    ["Direnç Bandı Seti", "Kısa egzersiz molaları için kompakt set.", 79_000],
    ["Antrenman Çantası", "Spor niyetini düzenleyen taşıma hissi.", 159_000],
    ["Nefes Egzersiz Topu", "Kısa mola ve odak için sanal araç.", 59_000],
    ["Hafif Yağmurluk", "Açık hava yürüyüşü için koruyucu katman.", 249_000],
    ["Pilates Çemberi", "Ev rutini motivasyon ürünü.", 119_000],
    ["Spor Havlusu", "Çanta düzeni için yumuşak doku.", 39_000],
    ["Akıllı Adım Bilekliği", "Hareket takibi hissi veren cihaz.", 299_000],
  ].map(toTemplate),
  "kitap-hobi": [
    ["Yaratıcı Defter Seti", "Planlama ve fikir notları için set.", 64_000],
    ["Suluboya Başlangıç Kutusu", "Renkli mola hissi veren hobi ürünü.", 139_000],
    ["Roman Okuma Paketi", "Hafta sonu okuma ritüeli.", 99_000],
    ["Puzzle Akşam Seti", "Ekransız zaman için sakin aktivite.", 129_000],
    ["Kaligrafi Kalemleri", "Yavaş ve özenli yazı pratiği.", 89_000],
    ["Örgü Başlangıç Seti", "El işi molası için yumuşak paket.", 119_000],
    ["Masa Oyunu Kutusu", "Arkadaş akşamı hissi.", 189_000],
    ["Eskiz Bloku", "Fikirleri görselleştirme alanı.", 59_000],
    ["Bitki Bakım Günlüğü", "Küçük rutinleri takip etme hissi.", 49_000],
    ["Mini Seramik Kiti", "Evde yaratıcı deneme simülasyonu.", 159_000],
  ].map(toTemplate),
  "anne-cocuk": [
    ["Yumuşak Oyuncak Sepeti", "Çocuk odası düzenleme hissi.", 129_000],
    ["Masal Lambası", "Uyku rutini için sıcak ışık.", 179_000],
    ["Renkli Saklama Kutusu", "Oyun alanını sadeleştirme aracı.", 89_000],
    ["Mini Çizim Masası", "Yaratıcı oyun köşesi hissi.", 249_000],
    ["Pamuklu Battaniye", "Sakin uyku dokusu.", 119_000],
    ["Beslenme Çantası", "Okul hazırlığı ritüeli.", 79_000],
    ["Hikaye Kartları", "Birlikte okuma ve oyun hissi.", 69_000],
    ["Çocuk Sırt Çantası", "Günlük küçük maceralar için.", 149_000],
    ["Oyun Matı", "Güvenli oyun alanı simülasyonu.", 219_000],
    ["Ahşap Blok Seti", "Sakin yapı oyunu hissi.", 169_000],
  ].map(toTemplate),
  "ofis": [
    ["Odak Masa Organizer", "Kabloları ve notları toparlama hissi.", 119_000],
    ["Ergonomik Laptop Yükseltici", "Çalışma duruşu için sade destek.", 189_000],
    ["Haftalık Planlayıcı", "Yoğun haftayı görünür kılan blok.", 49_000],
    ["Sessiz Mouse", "Toplantı aralarında konfor hissi.", 89_000],
    ["Kablo Düzen Seti", "Masa üstünü sakinleştiren detay.", 39_000],
    ["Bel Destek Yastığı", "Uzun çalışma günleri için rahatlık.", 129_000],
    ["Masa Bitkisi", "Çalışma köşesine canlılık hissi.", 59_000],
    ["Not Kartları", "Kısa fikirleri yakalama ritüeli.", 29_000],
    ["Kalemlik Seti", "Masa düzeni için minimal form.", 69_000],
    ["Akustik Masa Paneli", "Odak alanı hissi veren parça.", 299_000],
  ].map(toTemplate),
  "mutfak": [
    ["Döküm Tava", "Hafta sonu pişirme ritüeli.", 279_000],
    ["Cam Saklama Seti", "Mutfak düzeni için şeffaf kutular.", 159_000],
    ["Kahve Öğütücü", "Sabah kahvesi hazırlık hissi.", 249_000],
    ["Servis Tabağı", "Sofra sunumunu tamamlayan sade form.", 99_000],
    ["Baharatlık Rafı", "Lezzet köşesini düzenleme hissi.", 119_000],
    ["Termos Kupa", "Dışarıda kahve ritüeli.", 89_000],
    ["Ahşap Kesme Tahtası", "Hazırlık alanına sıcak doku.", 79_000],
    ["Çay Demleme Seti", "Akşam molası hissi.", 149_000],
    ["Minimal Önlük", "Mutfakta hazırlık modu.", 69_000],
    ["Seramik Kase Seti", "Sofra düzeni için üçlü set.", 129_000],
  ].map(toTemplate),
  "seyahat": [
    ["Kabin Boy Valiz", "Yolculuğa hazırlanma hissi.", 599_000],
    ["Seyahat Organizer", "Çanta içini düzenleyen bölmeler.", 99_000],
    ["Boyun Yastığı", "Uzun yol molası için konfor.", 79_000],
    ["Pasaport Kılıfı", "Seyahat ritüelini tamamlayan aksesuar.", 59_000],
    ["Katlanır Sırt Çantası", "Günübirlik planlar için hafif çanta.", 129_000],
    ["Mini Bakım Şişeleri", "Valiz hazırlığı hissi.", 39_000],
    ["Gürültü Azaltıcı Kulak Tıkacı", "Yolculukta sakinlik simülasyonu.", 49_000],
    ["Seyahat Battaniyesi", "Uçak ve otobüs konfor hissi.", 109_000],
    ["Bagaj Etiketi", "Valizi kişiselleştiren küçük detay.", 29_000],
    ["Harita Defteri", "Yeni rota hayali için not alanı.", 69_000],
  ].map(toTemplate),
};

function toTemplate([name, shortDescription, basePrice]: readonly (string | number)[]): ProductTemplate {
  if (
    typeof name !== "string" ||
    typeof shortDescription !== "string" ||
    typeof basePrice !== "number"
  ) {
    throw new Error("Invalid product seed template.");
  }

  return { name, shortDescription, basePrice };
}

function slugify(value: string) {
  return value
    .toLocaleLowerCase("tr-TR")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  const categoryRecords = await Promise.all(
    categories.map(([name, slug, description], index) =>
      prisma.category.upsert({
        where: { slug },
        update: { name, description, sortOrder: index, isActive: true },
        create: { name, slug, description, sortOrder: index, isActive: true },
      }),
    ),
  );

  const brandRecords = await Promise.all(
    brands.map(([name, slug]) =>
      prisma.brand.upsert({
        where: { slug },
        update: {
          name,
          description: `${name}, Dopamin için oluşturulmuş kurgusal bir markadır.`,
          isFictional: true,
        },
        create: {
          name,
          slug,
          description: `${name}, Dopamin için oluşturulmuş kurgusal bir markadır.`,
          isFictional: true,
        },
      }),
    ),
  );

  let productIndex = 0;

  for (const category of categoryRecords) {
    const templates = productTemplates[category.slug] ?? [];

    for (const template of templates) {
      const brand = brandRecords[productIndex % brandRecords.length];
      const productNumber = productIndex + 1;
      const productName = template.name;
      const slug = `${slugify(productName)}-${productNumber.toString().padStart(3, "0")}`;
      const priceCents = template.basePrice + (productIndex % 5) * 7_500;
      const compareAtPriceCents = productIndex % 3 === 0 ? priceCents + 45_000 : null;
      const dopamineScore = new Prisma.Decimal((4.1 + (productIndex % 8) * 0.1).toFixed(1));
      const reviewCount = 24 + (productIndex * 13) % 220;
      const description = `${productName}, Dopamin Sanal Sipariş deneyiminde alışveriş dürtüsünü güvenli alanda tamamlamak için kullanılan kurgusal bir üründür. Gerçek ödeme, teslimat veya ticari kayıt oluşturmaz.`;

      const product = await prisma.product.upsert({
        where: { slug },
        update: {
          categoryId: category.id,
          brandId: brand.id,
          name: productName,
          description,
          shortDescription: template.shortDescription,
          priceCents,
          compareAtPriceCents,
          dopamineScore,
          reviewCount,
          isActive: true,
          searchKeywords: `${productName} ${category.name} ${brand.name} sanal sipariş simülasyon`,
        },
        create: {
          categoryId: category.id,
          brandId: brand.id,
          name: productName,
          slug,
          description,
          shortDescription: template.shortDescription,
          priceCents,
          compareAtPriceCents,
          dopamineScore,
          reviewCount,
          isActive: true,
          searchKeywords: `${productName} ${category.name} ${brand.name} sanal sipariş simülasyon`,
        },
      });

      await prisma.productImage.deleteMany({ where: { productId: product.id } });

      await prisma.productImage.createMany({
        data: [0, 1, 2].map((imageIndex) => ({
          productId: product.id,
          url: `https://placehold.co/900x700/png?text=${encodeURIComponent(productName)}+${imageIndex + 1}`,
          altText: `${productName} sanal ürün görseli ${imageIndex + 1}`,
          sortOrder: imageIndex,
        })),
      });

      productIndex += 1;
    }
  }

  await prisma.adSlot.createMany({
    data: [
      {
        slug: "shop-calm-break",
        placement: "SHOP_HOME",
        title: "Sakin mola alanı",
        body: "Bu alanda geri sayım, stok baskısı veya agresif kampanya yok. İstersen Sanal Siparişe geçmeden önce bir nefeslik durakla.",
        ctaLabel: "Sanal sepete bak",
        ctaHref: "/sepet",
        sortOrder: 1,
      },
      {
        slug: "cart-no-payment-reminder",
        placement: "CART_REVIEW",
        title: "Harcamadan tamamla",
        body: "Sepet değeri yalnızca kaçınmış olduğun harcamayı görmek için kullanılır. Ödeme bilgisi istenmez.",
        ctaLabel: "Sanal Sipariş akışı",
        ctaHref: "/checkout",
        sortOrder: 1,
      },
      {
        slug: "success-reflection",
        placement: "CHECKOUT_SUCCESS",
        title: "Dürtü kapanışı",
        body: "Sanal Sipariş tamamlandıktan sonra isteğinin nasıl değiştiğini not edebilirsin.",
        ctaLabel: "Dürtü günlüğüne ekle",
        ctaHref: "/checkout/basarili",
        sortOrder: 1,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.contentPage.createMany({
    data: [
      {
        slug: "etik-ilkeler",
        type: "ETHICS",
        title: "Dopamin etik ilkeleri",
        excerpt: "Simülasyon, şeffaflık ve harcamadan kapanış.",
        body: "Dopamin gerçek ödeme, teslimat, fatura veya ticari kayıt oluşturmaz. Platform alışveriş dürtüsünü güvenli bir simülasyon alanında tamamlamaya yardımcı olur.",
      },
      {
        slug: "yardim",
        type: "HELP",
        title: "Dopamin nasıl çalışır?",
        excerpt: "Sanal sepet, teslimat simülasyonu, ödeme simülasyonu ve kapanış.",
        body: "Ürünleri keşfeder, Sanal Sipariş akışını tamamlarsın. Kart bilgisi veya açık adres istenmez. Son ekranda kaçınmış olduğun harcama gösterilir.",
      },
      {
        slug: "gizlilik",
        type: "PRIVACY",
        title: "Gizlilik yaklaşımı",
        excerpt: "Dopamin hassas ödeme veya açık adres verisi toplamaz.",
        body: "Teslimat simülasyonu için yalnızca şehir, ilçe, adres tipi ve güvenli kurgusal adres bilgisi kullanılabilir. Gerçek kart verisi saklanmaz.",
      },
    ],
    skipDuplicates: true,
  });

  console.log(`Seed complete: ${categories.length} categories, ${brands.length} brands, ${productIndex} products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
