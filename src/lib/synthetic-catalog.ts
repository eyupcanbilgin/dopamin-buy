import type { ProductImportRawRow } from "@/lib/ingestion/dto";
import { slugifyTurkish } from "@/lib/slug";

export type SyntheticCategorySlug =
  | "teknoloji"
  | "telefon-aksesuar"
  | "bilgisayar"
  | "oyuncu-ekipmanlari"
  | "moda"
  | "ayakkabi-canta"
  | "ev-yasam"
  | "mutfak"
  | "kozmetik-bakim"
  | "spor"
  | "kitap-hobi"
  | "kirtasiye";

export type SyntheticCategory = {
  name: string;
  slug: SyntheticCategorySlug;
  description: string;
  sortOrder: number;
  accent: string;
  image: string;
  imageTone: {
    background: string;
    foreground: string;
  };
  priceRange: {
    min: number;
    max: number;
  };
  brandStyle: "tech" | "mobile" | "computer" | "gaming" | "fashion" | "home" | "beauty" | "active" | "paper";
};

export const SYNTHETIC_CATEGORY_TAXONOMY: SyntheticCategory[] = [
  {
    name: "Teknoloji",
    slug: "teknoloji",
    description: "Kulaklık, hoparlör, akıllı ev ve günlük teknoloji ürünleri.",
    sortOrder: 0,
    accent: "bg-[#d9edf8]",
    image: "https://placehold.co/900x675/E7F2FA/243047/png?text=Teknoloji",
    imageTone: { background: "E7F2FA", foreground: "243047" },
    priceRange: { min: 449, max: 18_999 },
    brandStyle: "tech",
  },
  {
    name: "Telefon & Aksesuar",
    slug: "telefon-aksesuar",
    description: "Telefon kılıfı, şarj, stand ve mobil yaşam aksesuarları.",
    sortOrder: 1,
    accent: "bg-[#e6e5fb]",
    image: "https://placehold.co/900x675/E6E5FB/243047/png?text=Telefon+%26+Aksesuar",
    imageTone: { background: "E6E5FB", foreground: "243047" },
    priceRange: { min: 129, max: 54_999 },
    brandStyle: "mobile",
  },
  {
    name: "Bilgisayar",
    slug: "bilgisayar",
    description: "Dizüstü bilgisayar, monitör, çevre birimleri ve çalışma ekipmanı.",
    sortOrder: 2,
    accent: "bg-[#e3ebf4]",
    image: "https://placehold.co/900x675/E3EBF4/243047/png?text=Bilgisayar",
    imageTone: { background: "E3EBF4", foreground: "243047" },
    priceRange: { min: 799, max: 78_999 },
    brandStyle: "computer",
  },
  {
    name: "Oyuncu Ekipmanları",
    slug: "oyuncu-ekipmanlari",
    description: "Oyuncu klavyesi, mouse, kulaklık, koltuk ve RGB ekipmanları.",
    sortOrder: 3,
    accent: "bg-[#ede6fb]",
    image: "https://placehold.co/900x675/EDE6FB/243047/png?text=Oyuncu+Ekipmanlari",
    imageTone: { background: "EDE6FB", foreground: "243047" },
    priceRange: { min: 399, max: 24_999 },
    brandStyle: "gaming",
  },
  {
    name: "Moda",
    slug: "moda",
    description: "Günlük giyim, dış giyim, triko ve kapsül dolap parçaları.",
    sortOrder: 4,
    accent: "bg-[#f7d8c8]",
    image: "https://placehold.co/900x675/F7D8C8/243047/png?text=Moda",
    imageTone: { background: "F7D8C8", foreground: "243047" },
    priceRange: { min: 249, max: 8_499 },
    brandStyle: "fashion",
  },
  {
    name: "Ayakkabı & Çanta",
    slug: "ayakkabi-canta",
    description: "Sneaker, bot, günlük çanta ve fonksiyonel aksesuarlar.",
    sortOrder: 5,
    accent: "bg-[#f2dfd4]",
    image: "https://placehold.co/900x675/F2DFD4/243047/png?text=Ayakkabi+%26+Canta",
    imageTone: { background: "F2DFD4", foreground: "243047" },
    priceRange: { min: 399, max: 11_999 },
    brandStyle: "fashion",
  },
  {
    name: "Ev & Yaşam",
    slug: "ev-yasam",
    description: "Ev tekstili, dekorasyon, aydınlatma ve düzen ürünleri.",
    sortOrder: 6,
    accent: "bg-[#e4ead7]",
    image: "https://placehold.co/900x675/E4EAD7/243047/png?text=Ev+%26+Yasam",
    imageTone: { background: "E4EAD7", foreground: "243047" },
    priceRange: { min: 149, max: 19_999 },
    brandStyle: "home",
  },
  {
    name: "Mutfak",
    slug: "mutfak",
    description: "Pişirme, saklama, kahve, servis ve sofra ürünleri.",
    sortOrder: 7,
    accent: "bg-[#f6e7b9]",
    image: "https://placehold.co/900x675/F6E7B9/243047/png?text=Mutfak",
    imageTone: { background: "F6E7B9", foreground: "243047" },
    priceRange: { min: 99, max: 16_999 },
    brandStyle: "home",
  },
  {
    name: "Kozmetik & Bakım",
    slug: "kozmetik-bakim",
    description: "Cilt bakımı, saç bakımı, makyaj ve kişisel bakım ürünleri.",
    sortOrder: 8,
    accent: "bg-[#f4d5de]",
    image: "https://placehold.co/900x675/F4D5DE/243047/png?text=Kozmetik+%26+Bakim",
    imageTone: { background: "F4D5DE", foreground: "243047" },
    priceRange: { min: 79, max: 4_999 },
    brandStyle: "beauty",
  },
  {
    name: "Spor",
    slug: "spor",
    description: "Antrenman, yoga, yürüyüş, kamp ve aktif yaşam ürünleri.",
    sortOrder: 9,
    accent: "bg-[#d7eadf]",
    image: "https://placehold.co/900x675/D7EADF/243047/png?text=Spor",
    imageTone: { background: "D7EADF", foreground: "243047" },
    priceRange: { min: 149, max: 18_499 },
    brandStyle: "active",
  },
  {
    name: "Kitap & Hobi",
    slug: "kitap-hobi",
    description: "Kitap setleri, puzzle, el işi, sanat ve yaratıcı mola ürünleri.",
    sortOrder: 10,
    accent: "bg-[#efe1c4]",
    image: "https://placehold.co/900x675/EFE1C4/243047/png?text=Kitap+%26+Hobi",
    imageTone: { background: "EFE1C4", foreground: "243047" },
    priceRange: { min: 49, max: 3_999 },
    brandStyle: "paper",
  },
  {
    name: "Kırtasiye",
    slug: "kirtasiye",
    description: "Defter, kalem, masa düzeni ve planlama ürünleri.",
    sortOrder: 11,
    accent: "bg-[#e8e2f2]",
    image: "https://placehold.co/900x675/E8E2F2/243047/png?text=Kirtasiye",
    imageTone: { background: "E8E2F2", foreground: "243047" },
    priceRange: { min: 29, max: 2_499 },
    brandStyle: "paper",
  },
];

type GenerateSyntheticCatalogOptions = {
  count?: number;
  seed?: string;
};

type ProductBlueprint = {
  kind: string;
  nouns: string[];
  attributes: string[];
  specs: string[];
  materials: string[];
};

const brandSyllables: Record<SyntheticCategory["brandStyle"], string[]> = {
  tech: ["Vire", "Nexo", "Lumo", "Orbi", "Tekno", "Avio", "Zenvo", "Pixo"],
  mobile: ["Mobi", "Kavo", "Teli", "Velo", "Zeni", "Orva", "Lina", "Modo"],
  computer: ["Byte", "Nex", "Core", "Vera", "Lino", "Aster", "Ravo", "Mira"],
  gaming: ["Grav", "Rift", "Kron", "Vox", "Drift", "Nero", "Zyra", "Arka"],
  fashion: ["Arel", "Luna", "Mira", "Vena", "Nora", "Sole", "Rima", "Kaira"],
  home: ["Sova", "Kora", "Liva", "Mina", "Evra", "Dora", "Pera", "Noma"],
  beauty: ["Derma", "Liora", "Niva", "Aural", "Vela", "Mina", "Sena", "Flora"],
  active: ["Fit", "Rova", "Nef", "Kinet", "Vento", "Pika", "Liva", "Tera"],
  paper: ["Nota", "Krea", "Mavi", "Punto", "Lina", "Doku", "Fika", "Arti"],
};

const brandEndings: Record<SyntheticCategory["brandStyle"], string[]> = {
  tech: ["on", "ix", "va", "lab", "io", "tek"],
  mobile: ["cell", "line", "go", "mate", "dock", "ora"],
  computer: ["core", "desk", "byte", "works", "pro", "grid"],
  gaming: ["forge", "pulse", "arena", "strike", "gear", "zone"],
  fashion: ["atelier", "mode", "wear", "studio", "line", "form"],
  home: ["home", "living", "casa", "ev", "craft", "room"],
  beauty: ["care", "derma", "glow", "labs", "skin", "flora"],
  active: ["sport", "move", "trail", "fit", "club", "run"],
  paper: ["paper", "note", "kitap", "craft", "studio", "kalem"],
};

const merchantPrefixes = ["Mavi Vitrin", "Koru Pazar", "Yeni Sepet", "Sanal Reyon", "Dingin Mağaza", "İyi Hissiyat", "Pazar Noktası", "Dopamin Demo"];
const merchantSuffixes = ["Mağazası", "Market", "Atölye", "Seçki", "Store", "Dükkan"];

const colors = ["Siyah", "Beyaz", "Ekru", "Lacivert", "Antrasit", "Gri", "Kum Beji", "Adaçayı", "Gül Kurusu", "Taş", "Kahverengi", "Gece Mavisi"];
const sizes = ["XS", "S", "M", "L", "XL"];
const shoeSizes = ["36", "37", "38", "39", "40", "41", "42", "43", "44"];
const years = ["2025", "2026"];
const campaignLabels = [
  "Sanal sepet avantajı",
  "Demo katalog fiyatı",
  "Sakin seçim etiketi",
  "Harcamadan dene",
  "Simülasyon fırsatı",
  "Dürtü molası fiyatı",
];
const deliveryEstimates = ["Bugün his modu", "1-2 gün simülasyonu", "2-3 gün simülasyonu", "Hafta içi teslim hissi", "Rahat teslim simülasyonu"];
const stockFeelingLabels = ["Sanal stok", "Rahat stok hissi", "Acele yok", "Simülasyon stoğu", "Baskısız seçim"];

const blueprints: Record<SyntheticCategorySlug, ProductBlueprint[]> = {
  teknoloji: [
    {
      kind: "kulaklık",
      nouns: ["Kablosuz Bluetooth Kulaklık", "Kulak Üstü Kulaklık", "Aktif Gürültü Azaltmalı Kulaklık"],
      attributes: ["Bluetooth 5.3", "40 Saat Pil", "Katlanabilir", "Mikrofonlu"],
      specs: ["USB-C", "ANC", "Hızlı Şarj", "Çift Cihaz Bağlantısı"],
      materials: ["Mat", "Yumuşak Pedli", "Alüminyum Detaylı"],
    },
    {
      kind: "hoparlör",
      nouns: ["Taşınabilir Hoparlör", "Masaüstü Ses Barı", "Mini Bluetooth Hoparlör"],
      attributes: ["Suya Dayanıklı", "Derin Bas", "Kompakt", "Stereo"],
      specs: ["20W", "IPX5", "12 Saat Pil", "Type-C"],
      materials: ["Kumaş Kaplama", "Mat Gövde", "Metal Izgara"],
    },
    {
      kind: "akıllı ev",
      nouns: ["Akıllı Masa Lambası", "Wi-Fi Priz", "Akıllı Gece Lambası"],
      attributes: ["Uygulama Kontrollü", "Zamanlayıcılı", "Sesli Asistan Uyumlu", "Dokunmatik"],
      specs: ["RGB", "Enerji Tasarruflu", "3 Işık Tonu", "Uzaktan Kontrol"],
      materials: ["Minimal", "Mat Beyaz", "İnce Gövde"],
    },
  ],
  "telefon-aksesuar": [
    {
      kind: "telefon",
      nouns: ["Akıllı Telefon", "Geniş Ekran Telefon", "Çift Hatlı Telefon"],
      attributes: ["OLED Ekran", "Hızlı Şarj", "Üçlü Kamera", "İnce Çerçeve"],
      specs: ["128 GB", "256 GB", "8 GB RAM", "5000 mAh"],
      materials: ["Mat Cam", "Titanyum Ton", "Seramik Görünüm"],
    },
    {
      kind: "aksesuar",
      nouns: ["Manyetik Şarj Standı", "Telefon Kılıfı", "Kamera Korumalı Kılıf", "Powerbank"],
      attributes: ["MagSafe Uyumlu", "Şeffaf", "Darbeye Dayanıklı", "Kablosuz Şarjlı"],
      specs: ["15W", "10.000 mAh", "İnce Tasarım", "Standlı"],
      materials: ["Silikon", "Mat TPU", "Alüminyum"],
    },
  ],
  bilgisayar: [
    {
      kind: "dizüstü",
      nouns: ["Dizüstü Bilgisayar", "Ultrabook", "İş Bilgisayarı"],
      attributes: ["IPS Ekran", "Parmak İzi Okuyucu", "Hafif Kasa", "Sessiz Fan"],
      specs: ["16 GB RAM", "512 GB SSD", "1 TB SSD", "15.6 inç", "14 inç"],
      materials: ["Alüminyum Kasa", "Mat Gri", "İnce Çerçeve"],
    },
    {
      kind: "monitör",
      nouns: ["IPS Monitör", "Kavisli Monitör", "Taşınabilir Monitör"],
      attributes: ["Göz Koruma", "İnce Çerçeve", "Ayarlanabilir Stand", "USB-C"],
      specs: ["24 inç", "27 inç", "2K", "75Hz", "144Hz"],
      materials: ["Mat Siyah", "Metal Ayak", "Minimal Gövde"],
    },
  ],
  "oyuncu-ekipmanlari": [
    {
      kind: "klavye",
      nouns: ["Mekanik Oyuncu Klavyesi", "RGB Klavye", "Kompakt Oyuncu Klavyesi"],
      attributes: ["Red Switch", "Blue Switch", "Hot-Swap", "Sessiz Tuş"],
      specs: ["TKL", "Anti-Ghosting", "USB-C", "Makro Destekli"],
      materials: ["Alüminyum Plaka", "Mat Siyah", "PBT Tuş"],
    },
    {
      kind: "mouse",
      nouns: ["Oyuncu Mouse", "Kablosuz Gaming Mouse", "RGB Mouse"],
      attributes: ["Hafif Gövde", "Sessiz Tıklama", "Ayarlanabilir DPI", "Ergonomik"],
      specs: ["16.000 DPI", "2.4 GHz", "USB-C", "6 Tuşlu"],
      materials: ["Mat Kaplama", "Kaymaz Yan Yüzey", "Delikli Gövde"],
    },
  ],
  moda: [
    {
      kind: "giyim",
      nouns: ["Oversize Gömlek", "Pamuklu Tişört", "Keten Pantolon", "Triko Kazak", "Mevsimlik Ceket"],
      attributes: ["Rahat Kesim", "Basic", "Yumuşak Dokulu", "Günlük"],
      specs: ["Uzun Kollu", "Bisiklet Yaka", "Düğmeli", "Dökümlü"],
      materials: ["Pamuk", "Keten Karışım", "Viskon", "Yumuşak Triko"],
    },
  ],
  "ayakkabi-canta": [
    {
      kind: "ayakkabı",
      nouns: ["Günlük Sneaker", "Hafif Koşu Ayakkabısı", "Şehir Botu", "Rahat Loafer"],
      attributes: ["Yumuşak Taban", "Bağcıklı", "Kaymaz", "Nefes Alan"],
      specs: ["Ortopedik Taban", "Günlük Kullanım", "Esnek Taban", "Hafif"],
      materials: ["Suni Deri", "File Kumaş", "Süet Görünüm", "Kanvas"],
    },
    {
      kind: "çanta",
      nouns: ["Günlük Omuz Çantası", "Laptop Sırt Çantası", "Minimal Tote Çanta"],
      attributes: ["Çok Bölmeli", "Su İtici", "Askılı", "Fermuarlı"],
      specs: ["14 inç Laptop Uyumlu", "Ayarlanabilir Askı", "İç Cep", "Kompakt"],
      materials: ["Kanvas", "Suni Deri", "Naylon", "Pamuk Karışım"],
    },
  ],
  "ev-yasam": [
    {
      kind: "tekstil",
      nouns: ["Nevresim Takımı", "Koltuk Şalı", "Dekoratif Yastık", "Pamuklu Pike"],
      attributes: ["Çift Kişilik", "Yumuşak Dokulu", "Nefes Alan", "Minimal Desenli"],
      specs: ["4 Parça", "Fermuarlı", "Makinede Yıkanabilir", "Mevsimlik"],
      materials: ["Pamuk", "Müslin", "Keten Dokulu", "Kadife Dokulu"],
    },
    {
      kind: "dekor",
      nouns: ["Seramik Vazo", "Masa Lambası", "Duvar Rafı", "Hasır Sepet"],
      attributes: ["El Yapımı Görünüm", "Minimal", "Sıcak Işık", "Düzenleyici"],
      specs: ["Orta Boy", "2 Katlı", "LED", "Dekoratif"],
      materials: ["Seramik", "Ahşap", "Metal", "Hasır"],
    },
  ],
  mutfak: [
    {
      kind: "pişirme",
      nouns: ["Granit Görünümlü Tencere Seti", "Döküm Tava", "Çelik Saklama Seti", "Kahve Demleme Seti"],
      attributes: ["İndüksiyon Uyumlu", "Yapışmaz", "Isıya Dayanıklı", "Pratik"],
      specs: ["7 Parça", "26 cm", "Cam Kapaklı", "BPA İçermez"],
      materials: ["Çelik", "Döküm", "Borosilikat Cam", "Ahşap Saplı"],
    },
    {
      kind: "kahve",
      nouns: ["Kahve Öğütücü", "Termos Kupa", "French Press", "Seramik Fincan Seti"],
      attributes: ["Taşınabilir", "Sızdırmaz", "Ayarlanabilir Öğütme", "Çift Cidarlı"],
      specs: ["350 ml", "600 ml", "2'li Set", "Paslanmaz"],
      materials: ["Seramik", "Çelik", "Cam", "Mat Kaplama"],
    },
  ],
  "kozmetik-bakim": [
    {
      kind: "cilt",
      nouns: ["C Vitamini Serum", "Nemlendirici Krem", "Güneş Koruyucu Krem", "Gece Bakım Maskesi"],
      attributes: ["Hafif Yapılı", "Parfümsüz", "Günlük Kullanım", "Hassas Cilt Uyumlu"],
      specs: ["30 ml", "50 ml", "SPF 50", "Hyaluronik Asit"],
      materials: ["Cam Şişe", "Pompalı Ambalaj", "Tüp Ambalaj"],
    },
    {
      kind: "saç",
      nouns: ["Saç Bakım Yağı", "Onarıcı Şampuan", "Bakım Kremi", "Isı Koruyucu Sprey"],
      attributes: ["Elektriklenme Karşıtı", "Yumuşatıcı", "Canlandırıcı", "Hafif Kokulu"],
      specs: ["100 ml", "250 ml", "Durulanmayan", "Sülfatsız"],
      materials: ["Geri Dönüşümlü Ambalaj", "Pompalı Şişe", "Seyahat Boy"],
    },
  ],
  spor: [
    {
      kind: "fitness",
      nouns: ["Kaymaz Yoga Matı", "Direnç Bandı Seti", "Ayarlanabilir Dambıl", "Pilates Çemberi"],
      attributes: ["Ev Antrenmanı", "Taşıma Askılı", "Kompakt", "Yeni Başlayan Uyumlu"],
      specs: ["6 mm", "3'lü Set", "10 kg", "Kaymaz Yüzey"],
      materials: ["TPE", "Kauçuk", "Neopren", "Çelik"],
    },
    {
      kind: "outdoor",
      nouns: ["Yürüyüş Çantası", "Termal Matara", "Hafif Yağmurluk", "Kamp Lambası"],
      attributes: ["Su İtici", "Hafif", "Katlanabilir", "Nefes Alan"],
      specs: ["20 L", "750 ml", "USB Şarjlı", "Rüzgar Korumalı"],
      materials: ["Ripstop Kumaş", "Çelik", "Kauçuk Taban", "Mat Kaplama"],
    },
  ],
  "kitap-hobi": [
    {
      kind: "kitap",
      nouns: ["Roman Seti", "Kişisel Gelişim Kitabı", "Polisiye Kitap Seti", "Çocuk Hikaye Kutusu"],
      attributes: ["Ciltli", "Cep Boy", "3 Kitap", "Hafta Sonu Okuması"],
      specs: ["Türkçe", "Yeni Baskı", "Set", "Ayraç Hediyeli"],
      materials: ["Mat Kapak", "Kuşe Kapak", "Karton Kapak"],
    },
    {
      kind: "hobi",
      nouns: ["Puzzle Seti", "Suluboya Başlangıç Kutusu", "Seramik Boyama Kiti", "Makrome Seti"],
      attributes: ["Başlangıç Seviyesi", "Ekransız Mola", "Yaratıcı", "Evde Uygun"],
      specs: ["1000 Parça", "24 Renk", "12 Parça", "Kılavuzlu"],
      materials: ["Ahşap", "Kağıt", "Pamuk İp", "Seramik"],
    },
  ],
  kirtasiye: [
    {
      kind: "defter",
      nouns: ["Noktalı Defter", "Haftalık Planlayıcı", "Spiral Not Defteri", "Çizim Defteri"],
      attributes: ["A5", "A4", "Kalın Kapak", "Minimal"],
      specs: ["120 Yaprak", "80 gsm", "Tarihsiz", "Lastikli"],
      materials: ["Mat Kapak", "Geri Dönüşümlü Kağıt", "Sert Kapak"],
    },
    {
      kind: "kalem",
      nouns: ["Jel Kalem Seti", "Marker Seti", "Uçlu Kalem", "Fosforlu Kalem Paketi"],
      attributes: ["Pastel Ton", "Akıcı Yazım", "Ergonomik", "Kokusuz"],
      specs: ["6'lı Set", "12 Renk", "0.7 mm", "Çift Uçlu"],
      materials: ["Plastik Gövde", "Metal Klips", "Yumuşak Tutma Alanı"],
    },
  ],
};

export function generateSyntheticCatalog({
  count = 10_000,
  seed = "dopamin-demo-2026",
}: GenerateSyntheticCatalogOptions = {}): ProductImportRawRow[] {
  const safeCount = Math.max(1, Math.min(count, 10_000));
  const random = createSeededRandom(seed);

  return Array.from({ length: safeCount }, (_, index) => createSyntheticProduct(index, random));
}

export function generateFictionalBrand(category: SyntheticCategory, index: number, random: SeededRandom) {
  const starts = brandSyllables[category.brandStyle];
  const endings = brandEndings[category.brandStyle];
  const start = starts[(index + random.int(0, starts.length - 1)) % starts.length];
  const ending = endings[(index * 3 + random.int(0, endings.length - 1)) % endings.length];
  const raw = `${start}${ending}`;

  return raw
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (letter) => letter.toLocaleUpperCase("tr-TR"));
}

function createSyntheticProduct(index: number, random: SeededRandom): ProductImportRawRow {
  const category = SYNTHETIC_CATEGORY_TAXONOMY[index % SYNTHETIC_CATEGORY_TAXONOMY.length];
  const categoryRandom = random.fork(`${category.slug}-${index}`);
  const blueprint = pick(blueprints[category.slug], categoryRandom);
  const brand = generateFictionalBrand(category, index, categoryRandom);
  const merchant = createMerchantName(index, categoryRandom);
  const price = createPrice(category, categoryRandom);
  const title = createProductTitle({
    index,
    category,
    blueprint,
    brand,
    random: categoryRandom,
  });
  const rating = round(3.8 + categoryRandom.float() * 1.1, 1);
  const reviewCount = Math.floor(Math.pow(categoryRandom.float(), 1.8) * 2400) + categoryRandom.int(4, 64);
  const popularityScore = categoryRandom.int(32, 96);
  const dopaminScore = round(3.2 + categoryRandom.float() * 1.5, 1);
  const deliveryEstimate = pick(deliveryEstimates, categoryRandom);
  const stockFeelingLabel = pick(stockFeelingLabels, categoryRandom);

  return {
    title,
    category: category.name,
    brand,
    price: price.current,
    oldPrice: price.old,
    discountPercentage: price.discountPercentage,
    campaignLabel: price.campaignLabel,
    rating,
    reviewCount,
    merchant,
    simulatedDeliveryEstimate: deliveryEstimate,
    popularityScore,
    dopaminScore,
    stockFeelingLabel,
    catalogSource: "synthetic",
    imageUrl: createPlaceholderImage(category, title),
    shortDescription: createShortDescription(category, blueprint, deliveryEstimate),
    description: `${title}, Dopamin için deterministik olarak üretilmiş kurgusal bir katalog ürünüdür. Gerçek stok, gerçek satış, gerçek ödeme veya teslimat vaadi taşımaz; yalnızca sanal alışveriş simülasyonunda kullanılır.`,
  };
}

function createProductTitle({
  index,
  category,
  blueprint,
  brand,
  random,
}: {
  index: number;
  category: SyntheticCategory;
  blueprint: ProductBlueprint;
  brand: string;
  random: SeededRandom;
}) {
  const noun = pick(blueprint.nouns, random);
  const attribute = pick(blueprint.attributes, random);
  const spec = pick(blueprint.specs, random);
  const material = pick(blueprint.materials, random);
  const color = pick(colors, random);
  const year = pick(years, random);
  const model = createModelCode(category.slug, index, random);

  if (category.slug === "bilgisayar") {
    return `${brand} ${model} ${noun} ${spec} ${pick(blueprint.specs, random)} ${color} ${year}`;
  }

  if (category.slug === "telefon-aksesuar") {
    return `${brand} ${model} ${noun} ${spec} ${attribute} ${color}`;
  }

  if (category.slug === "oyuncu-ekipmanlari") {
    return `${brand} ${model} ${attribute} ${noun} ${spec} ${color}`;
  }

  if (category.slug === "moda") {
    return `${brand} ${attribute} ${material} ${noun} ${color} ${pick(sizes, random)} ${model}`;
  }

  if (category.slug === "ayakkabi-canta" && blueprint.kind === "ayakkabı") {
    return `${brand} ${attribute} ${noun} ${material} ${color} ${pick(shoeSizes, random)} ${model}`;
  }

  if (category.slug === "kozmetik-bakim") {
    return `${brand} ${attribute} ${noun} ${spec} ${model}`;
  }

  if (category.slug === "kirtasiye") {
    return `${brand} ${attribute} ${noun} ${spec} ${color} ${model}`;
  }

  return `${brand} ${attribute} ${noun} ${spec} ${material} ${color} ${model}`;
}

function createPrice(category: SyntheticCategory, random: SeededRandom) {
  const min = category.priceRange.min;
  const max = category.priceRange.max;
  const curved = Math.pow(random.float(), 1.7);
  const raw = min + curved * (max - min);
  const current = roundToMarketplaceEnding(raw);
  const hasDiscount = random.float() > 0.22;
  const discountPercentage = hasDiscount ? random.int(5, 32) : 0;
  const old = hasDiscount ? roundToMarketplaceEnding(current / (1 - discountPercentage / 100)) : undefined;

  return {
    current,
    old,
    discountPercentage,
    campaignLabel: hasDiscount ? pick(campaignLabels, random) : "Sabit sanal fiyat",
  };
}

function roundToMarketplaceEnding(value: number) {
  if (value < 100) {
    return Math.max(29.9, Math.round(value) - 0.1);
  }

  const rounded = Math.round(value / 10) * 10;
  return rounded - 0.1;
}

function createMerchantName(index: number, random: SeededRandom) {
  return `${pick(merchantPrefixes, random)} ${pick(merchantSuffixes, random)} ${((index % 89) + 11).toString()}`;
}

function createModelCode(categorySlug: string, index: number, random: SeededRandom) {
  const prefix = slugifyTurkish(categorySlug).slice(0, 2).toLocaleUpperCase("tr-TR");
  const sequence = Math.floor(index / SYNTHETIC_CATEGORY_TAXONOMY.length)
    .toString()
    .padStart(4, "0");
  return `${prefix}${random.int(20, 98)}${sequence}`;
}

function createShortDescription(
  category: SyntheticCategory,
  blueprint: ProductBlueprint,
  deliveryEstimate: string,
) {
  return `${category.name} kategorisinde ${blueprint.kind} odağıyla hazırlanmış sanal ürün. ${deliveryEstimate}; gerçek teslimat yok.`;
}

function createPlaceholderImage(category: SyntheticCategory, title: string) {
  const encodedText = encodeURIComponent(title.slice(0, 52));
  return `https://placehold.co/900x675/${category.imageTone.background}/${category.imageTone.foreground}/png?text=${encodedText}`;
}

function pick<T>(items: readonly T[], random: SeededRandom) {
  return items[random.int(0, items.length - 1)];
}

function round(value: number, digits: number) {
  const multiplier = 10 ** digits;
  return Math.round(value * multiplier) / multiplier;
}

type SeededRandom = ReturnType<typeof createSeededRandom>;

function createSeededRandom(seed: string) {
  let state = hashSeed(seed);

  function next() {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  }

  return {
    float: next,
    int(min: number, max: number) {
      return Math.floor(next() * (max - min + 1)) + min;
    },
    fork(salt: string) {
      return createSeededRandom(`${seed}:${salt}`);
    },
  };
}

function hashSeed(seed: string) {
  let hash = 1779033703 ^ seed.length;

  for (let index = 0; index < seed.length; index += 1) {
    hash = Math.imul(hash ^ seed.charCodeAt(index), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }

  return hash >>> 0;
}
