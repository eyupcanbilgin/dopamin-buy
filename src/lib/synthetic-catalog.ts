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

type PriceProfile = {
  min: number;
  max: number;
  typicalMax: number;
  discountRate: number;
  minDiscount: number;
  maxDiscount: number;
  reviewMax: number;
};

type ProductTitleInfo = {
  title: string;
  noun: string;
  attribute: string;
  spec: string;
  material: string;
  color: string;
  variant: string;
};

const brandSyllables: Record<SyntheticCategory["brandStyle"], string[]> = {
  tech: ["Vire", "Nexo", "Lumo", "Orbi", "Tekno", "Avio", "Zenvo", "Pixo", "Volta", "Arvo", "Lutra", "Novu", "Aero", "Ferro", "Iono", "Voxi"],
  mobile: ["Mobi", "Kavo", "Teli", "Velo", "Zeni", "Orva", "Lina", "Modo", "Aksa", "Navi", "Rimo", "Vera", "Sivo", "Taro", "Lento", "Onda"],
  computer: ["Byte", "Nex", "Core", "Vera", "Lino", "Aster", "Ravo", "Mira", "Grid", "Arka", "Opta", "Vento", "Nova", "Desk", "Rino", "Sera"],
  gaming: ["Grav", "Rift", "Kron", "Vox", "Drift", "Nero", "Zyra", "Arka", "Vanta", "Kairo", "Rova", "Axel", "Talon", "Pixel", "Forge", "Nitra"],
  fashion: ["Arel", "Luna", "Mira", "Vena", "Nora", "Sole", "Rima", "Kaira", "Elya", "Liva", "Pera", "Vira", "Nila", "Olea", "Dora", "Sena"],
  home: ["Sova", "Kora", "Liva", "Mina", "Evra", "Dora", "Pera", "Noma", "Rumi", "Talia", "Lora", "Vadi", "Kiva", "Mona", "Rena", "Ala"],
  beauty: ["Derma", "Liora", "Niva", "Aural", "Vela", "Mina", "Sena", "Flora", "Vita", "Luma", "Rosa", "Alya", "Nora", "Elin", "Mira", "Sola"],
  active: ["Fit", "Rova", "Nef", "Kinet", "Vento", "Pika", "Liva", "Tera", "Astra", "Rido", "Mova", "Vira", "Sento", "Kora", "Delta", "Runa"],
  paper: ["Nota", "Krea", "Mavi", "Punto", "Lina", "Doku", "Fika", "Arti", "Kalem", "Sayfa", "Rulo", "Defne", "Motto", "Karo", "Pera", "Nora"],
};

const brandEndings: Record<SyntheticCategory["brandStyle"], string[]> = {
  tech: ["on", "ix", "va", "lab", "io", "tek", "nova", "volt", "zen", "link", "ware", "node"],
  mobile: ["cell", "line", "go", "mate", "dock", "ora", "case", "port", "loop", "plus", "zone", "kit"],
  computer: ["core", "desk", "byte", "works", "pro", "grid", "logic", "frame", "station", "craft", "lab", "hub"],
  gaming: ["forge", "pulse", "arena", "strike", "gear", "zone", "shift", "quest", "macro", "blade", "axis", "rush"],
  fashion: ["atelier", "mode", "wear", "studio", "line", "form", "textile", "wardrobe", "edit", "loom", "daily", "fit"],
  home: ["home", "living", "casa", "ev", "craft", "room", "nest", "house", "deco", "soft", "wood", "loom"],
  beauty: ["care", "derma", "glow", "labs", "skin", "flora", "pure", "sense", "ritual", "natura", "soft", "leaf"],
  active: ["sport", "move", "trail", "fit", "club", "run", "gear", "field", "active", "pace", "terra", "motion"],
  paper: ["paper", "note", "kitap", "craft", "studio", "kalem", "folio", "sayfa", "desk", "mark", "hobi", "çizgi"],
};

const brandQualifiers = ["Atelier", "Studio", "Works", "Lab", "Line", "Craft", "House", "Select", "Design", "Co"];

const merchantDistricts = [
  "Kadıköy",
  "Nişantaşı",
  "Alsancak",
  "Çankaya",
  "Moda",
  "Karşıyaka",
  "Beşiktaş",
  "Nilüfer",
  "Bostanlı",
  "Kalamış",
  "Etiler",
  "Bomonti",
  "Bahçelievler",
  "Üsküdar",
  "Göztepe",
  "Teşvikiye",
];
const merchantDescriptors = [
  "Vitrin",
  "Reyon",
  "Seçki",
  "Atölye",
  "Pazar",
  "Kolektif",
  "Dükkan",
  "Market",
  "Mağaza",
  "Katalog",
  "Studio",
  "Depo",
];
const merchantSuffixes = ["Mağazası", "Seçkisi", "Market", "Atölyesi", "Dükkanı", "Köşesi"];

const colors = ["Siyah", "Beyaz", "Ekru", "Lacivert", "Antrasit", "Gri", "Kum Beji", "Adaçayı", "Gül Kurusu", "Taş", "Kahverengi", "Gece Mavisi"];
const sizes = ["XS", "S", "M", "L", "XL"];
const shoeSizes = ["36", "37", "38", "39", "40", "41", "42", "43", "44"];
const years = ["2025", "2026"];
const seriesNames = ["Nova", "Aura", "Urban", "Mono", "Soft", "Core", "Terra", "Liva", "Mira", "Vento", "Prime", "Daily", "Studio", "Route", "Pure", "Flex"];
const seasonalEdits = ["İlkbahar Seçkisi", "Kış Dokusu", "Günlük Seri", "Hafta Sonu Serisi", "Ofis Seçkisi", "Şehir Serisi"];
const bookThemes = ["Şehir Notları", "Sakin Akşam", "Uzun Yol", "Mavi Defter", "Sessiz Hafta", "Yeni Sayfa", "Kısa Mola", "Evde Pazar"];
const campaignLabels = [
  "Demo katalog fiyatı",
  "Sakin vitrin etiketi",
  "Sepette dengelenen fiyat",
  "Listeye almaya uygun fiyat",
  "Haftanın katalog indirimi",
  "Bütçe kontrol etiketi",
];
const deliveryEstimates = ["Standart teslimat hissi", "1-2 gün teslim simülasyonu", "2-3 gün teslim simülasyonu", "Hafta içi teslim seçeneği", "Rahat teslimat modu"];
const stockFeelingLabels = ["Rahat seçim", "Acele yok", "Baskısız vitrin", "Listeye uygun", "Karar vermek için uygun", "Sakin sepet ürünü"];
const collisionVariantLabels = ["Günlük Seri", "Stüdyo Serisi", "Ev Seti", "Mini Paket", "Atölye Serisi", "Seçki Paketi"];

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

const priceProfiles: Record<string, PriceProfile> = {
  "teknoloji:kulaklık": { min: 549, max: 12_999, typicalMax: 4_499, discountRate: 0.36, minDiscount: 5, maxDiscount: 24, reviewMax: 3_800 },
  "teknoloji:hoparlör": { min: 349, max: 8_999, typicalMax: 3_499, discountRate: 0.34, minDiscount: 5, maxDiscount: 22, reviewMax: 2_600 },
  "teknoloji:akıllı ev": { min: 179, max: 5_499, typicalMax: 1_899, discountRate: 0.29, minDiscount: 4, maxDiscount: 20, reviewMax: 1_700 },
  "telefon-aksesuar:telefon": { min: 8_999, max: 64_999, typicalMax: 36_999, discountRate: 0.23, minDiscount: 4, maxDiscount: 18, reviewMax: 4_800 },
  "telefon-aksesuar:aksesuar": { min: 99, max: 3_999, typicalMax: 1_299, discountRate: 0.41, minDiscount: 6, maxDiscount: 26, reviewMax: 5_200 },
  "bilgisayar:dizüstü": { min: 14_999, max: 89_999, typicalMax: 52_999, discountRate: 0.25, minDiscount: 4, maxDiscount: 18, reviewMax: 2_100 },
  "bilgisayar:monitör": { min: 2_299, max: 28_999, typicalMax: 13_499, discountRate: 0.31, minDiscount: 5, maxDiscount: 21, reviewMax: 2_900 },
  "oyuncu-ekipmanlari:klavye": { min: 549, max: 8_999, typicalMax: 3_799, discountRate: 0.37, minDiscount: 6, maxDiscount: 25, reviewMax: 3_600 },
  "oyuncu-ekipmanlari:mouse": { min: 399, max: 6_999, typicalMax: 2_799, discountRate: 0.39, minDiscount: 6, maxDiscount: 25, reviewMax: 4_200 },
  "moda:giyim": { min: 249, max: 5_999, typicalMax: 2_199, discountRate: 0.48, minDiscount: 8, maxDiscount: 32, reviewMax: 6_500 },
  "ayakkabi-canta:ayakkabı": { min: 699, max: 7_999, typicalMax: 3_799, discountRate: 0.44, minDiscount: 7, maxDiscount: 30, reviewMax: 5_800 },
  "ayakkabi-canta:çanta": { min: 399, max: 5_999, typicalMax: 2_699, discountRate: 0.42, minDiscount: 7, maxDiscount: 28, reviewMax: 4_400 },
  "ev-yasam:tekstil": { min: 179, max: 4_999, typicalMax: 1_899, discountRate: 0.36, minDiscount: 6, maxDiscount: 24, reviewMax: 3_200 },
  "ev-yasam:dekor": { min: 149, max: 6_999, typicalMax: 2_499, discountRate: 0.33, minDiscount: 5, maxDiscount: 22, reviewMax: 2_400 },
  "mutfak:pişirme": { min: 229, max: 11_999, typicalMax: 4_899, discountRate: 0.35, minDiscount: 5, maxDiscount: 24, reviewMax: 3_500 },
  "mutfak:kahve": { min: 149, max: 4_999, typicalMax: 1_699, discountRate: 0.34, minDiscount: 5, maxDiscount: 22, reviewMax: 3_900 },
  "kozmetik-bakim:cilt": { min: 99, max: 1_999, typicalMax: 899, discountRate: 0.43, minDiscount: 7, maxDiscount: 27, reviewMax: 7_500 },
  "kozmetik-bakim:saç": { min: 89, max: 1_699, typicalMax: 749, discountRate: 0.42, minDiscount: 7, maxDiscount: 27, reviewMax: 6_200 },
  "spor:fitness": { min: 149, max: 4_999, typicalMax: 1_999, discountRate: 0.37, minDiscount: 6, maxDiscount: 25, reviewMax: 4_100 },
  "spor:outdoor": { min: 299, max: 8_999, typicalMax: 3_699, discountRate: 0.32, minDiscount: 5, maxDiscount: 23, reviewMax: 2_900 },
  "kitap-hobi:kitap": { min: 69, max: 1_299, typicalMax: 499, discountRate: 0.28, minDiscount: 5, maxDiscount: 20, reviewMax: 2_800 },
  "kitap-hobi:hobi": { min: 149, max: 2_999, typicalMax: 1_299, discountRate: 0.31, minDiscount: 5, maxDiscount: 22, reviewMax: 1_900 },
  "kirtasiye:defter": { min: 39, max: 699, typicalMax: 329, discountRate: 0.35, minDiscount: 6, maxDiscount: 24, reviewMax: 3_700 },
  "kirtasiye:kalem": { min: 29, max: 899, typicalMax: 399, discountRate: 0.37, minDiscount: 6, maxDiscount: 24, reviewMax: 4_600 },
};

export function generateSyntheticCatalog({
  count = 10_000,
  seed = "doply-demo-2026",
}: GenerateSyntheticCatalogOptions = {}): ProductImportRawRow[] {
  const safeCount = Math.max(1, Math.min(count, 10_000));
  const random = createSeededRandom(seed);
  const seenTitles = new Set<string>();
  const seenSlugKeys = new Set<string>();

  return Array.from({ length: safeCount }, (_, index) => {
    let product = createSyntheticProduct(index, random);
    let collisionAttempt = 0;

    while (
      seenTitles.has(String(product.title)) ||
      seenSlugKeys.has(createSyntheticSlugKey(product))
    ) {
      product = addCollisionVariant(product, index, collisionAttempt);
      collisionAttempt += 1;
    }

    seenTitles.add(String(product.title));
    seenSlugKeys.add(createSyntheticSlugKey(product));
    return product;
  });
}

export function generateFictionalBrand(category: SyntheticCategory, index: number, random: SeededRandom) {
  const starts = brandSyllables[category.brandStyle];
  const endings = brandEndings[category.brandStyle];
  const start = starts[(index + random.int(0, starts.length - 1)) % starts.length];
  const ending = endings[(index * 5 + random.int(0, endings.length - 1)) % endings.length];
  const qualifier = random.float() < 0.28 ? ` ${pick(brandQualifiers, random)}` : "";
  const raw = `${start}${ending}${qualifier}`;

  return toBrandCase(raw.replace(/([a-z])([A-Z])/g, "$1 $2"));
}

function createSyntheticProduct(index: number, random: SeededRandom): ProductImportRawRow {
  const category = SYNTHETIC_CATEGORY_TAXONOMY[index % SYNTHETIC_CATEGORY_TAXONOMY.length];
  const categoryRandom = random.fork(`${category.slug}-${index}`);
  const blueprint = pick(blueprints[category.slug], categoryRandom);
  const brand = generateFictionalBrand(category, index, categoryRandom);
  const merchant = createMerchantName(index, categoryRandom);
  const price = createPrice(category, blueprint, categoryRandom);
  const titleInfo = createProductTitle({
    index,
    category,
    blueprint,
    brand,
    random: categoryRandom,
  });
  const { rating, reviewCount } = createRatingAndReviewCount(category, blueprint, price.current, categoryRandom);
  const popularityScore = createPopularityScore(category, reviewCount, categoryRandom);
  const dopaminScore = createDoplyScore(price.current, category, blueprint, categoryRandom);
  const deliveryEstimate = pick(deliveryEstimates, categoryRandom);
  const stockFeelingLabel = pick(stockFeelingLabels, categoryRandom);

  return {
    title: titleInfo.title,
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
    imageUrl: createPlaceholderImage(category, titleInfo),
    shortDescription: createShortDescription(category, titleInfo, deliveryEstimate),
    description: createDescription(category, titleInfo),
  };
}

function addCollisionVariant(product: ProductImportRawRow, index: number, attempt: number): ProductImportRawRow {
  const suffix = collisionVariantLabels[(index + attempt) % collisionVariantLabels.length];
  const previousTitle = String(product.title);
  const title = `${previousTitle} ${suffix}`;
  const description = typeof product.description === "string"
    ? product.description.replace(previousTitle, title)
    : product.description;

  return {
    ...product,
    title,
    description,
  };
}

function createSyntheticSlugKey(product: ProductImportRawRow) {
  return [product.title, product.brand, product.category]
    .map((value) => slugifyTurkish(String(value ?? "")))
    .filter(Boolean)
    .join("-");
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
}): ProductTitleInfo {
  let noun = pick(blueprint.nouns, random);
  let attribute = pick(blueprint.attributes, random);
  let spec = pick(blueprint.specs, random);
  let material = pick(blueprint.materials, random);
  const color = pick(colors, random);
  const year = pick(years, random);
  const series = pick(seriesNames, random);
  const model = createModelCode(category.slug, index, random);
  let variant = pick([spec, material, attribute, color], random);
  let title: string;
  ({ noun, attribute, spec, material } = refineProductDetails(category, blueprint, {
    noun,
    attribute,
    spec,
    material,
  }, random));

  if (category.slug === "bilgisayar") {
    const secondSpec = pick(blueprint.specs.filter((item) => item !== spec), random) || spec;
    variant = blueprint.kind === "dizüstü" ? `${spec} ${secondSpec}` : `${spec} ${attribute}`;
    title = `${brand} ${series} ${model} ${noun} ${variant} ${color} ${year}`;
    return normalizeTitleInfo({ title, noun, attribute, spec, material, color, variant });
  }

  if (category.slug === "telefon-aksesuar") {
    if (blueprint.kind === "telefon") {
      variant = `${spec} ${attribute}`;
      title = `${brand} ${series} ${noun} ${variant} ${color} ${model}`;
      return normalizeTitleInfo({ title, noun, attribute, spec, material, color, variant });
    }

    variant = `${spec} ${material}`;
    title = `${brand} ${series} ${noun} ${variant} ${attribute} ${color}`;
    return normalizeTitleInfo({ title, noun, attribute, spec, material, color, variant });
  }

  if (category.slug === "oyuncu-ekipmanlari") {
    variant = `${attribute} ${spec}`;
    title = `${brand} ${series} ${noun} ${variant} ${color} ${model}`;
    return normalizeTitleInfo({ title, noun, attribute, spec, material, color, variant });
  }

  if (category.slug === "moda") {
    variant = `${pick(seasonalEdits, random)} ${pick(sizes, random)}`;
    title = random.float() < 0.5
      ? `${brand} ${material} ${noun} ${attribute} ${color} ${variant}`
      : `${brand} ${attribute} ${noun} ${material} ${color} ${variant}`;
    return normalizeTitleInfo({ title, noun, attribute, spec, material, color, variant });
  }

  if (category.slug === "ayakkabi-canta" && blueprint.kind === "ayakkabı") {
    variant = `${pick(shoeSizes, random)} Numara`;
    title = `${brand} ${series} ${noun} ${attribute} ${material} ${color} ${variant}`;
    return normalizeTitleInfo({ title, noun, attribute, spec, material, color, variant });
  }

  if (category.slug === "ayakkabi-canta") {
    variant = `${spec} ${material}`;
    title = `${brand} ${series} ${noun} ${variant} ${attribute} ${color}`;
    return normalizeTitleInfo({ title, noun, attribute, spec, material, color, variant });
  }

  if (category.slug === "kozmetik-bakim") {
    variant = `${spec} ${pick(["Günlük Rutin", "Bakım Serisi", "Yumuşak Dokunuş", "Sakin Bakım"], random)}`;
    title = `${brand} ${series} ${noun} ${attribute} ${variant}`;
    return normalizeTitleInfo({ title, noun, attribute, spec, material, color, variant });
  }

  if (category.slug === "kitap-hobi" && blueprint.kind === "kitap") {
    const theme = pick(bookThemes, random);
    variant = `${theme} ${spec}`;
    title = `${brand} ${theme} ${noun} ${spec} ${material}`;
    return normalizeTitleInfo({ title, noun, attribute, spec, material, color, variant });
  }

  if (category.slug === "kirtasiye") {
    variant = `${spec} ${material}`;
    title = `${brand} ${series} ${noun} ${attribute} ${variant} ${color}`;
    return normalizeTitleInfo({ title, noun, attribute, spec, material, color, variant });
  }

  if (category.slug === "mutfak") {
    variant = `${spec} ${material}`;
    title = `${brand} ${series} ${noun} ${attribute} ${variant} ${color}`;
    return normalizeTitleInfo({ title, noun, attribute, spec, material, color, variant });
  }

  if (category.slug === "ev-yasam") {
    variant = `${spec} ${material}`;
    title = `${brand} ${series} ${noun} ${attribute} ${variant} ${color}`;
    return normalizeTitleInfo({ title, noun, attribute, spec, material, color, variant });
  }

  if (category.slug === "spor") {
    variant = `${attribute} ${spec}`;
    title = `${brand} ${series} ${noun} ${variant} ${material} ${color}`;
    return normalizeTitleInfo({ title, noun, attribute, spec, material, color, variant });
  }

  variant = `${spec} ${material}`;
  title = `${brand} ${series} ${noun} ${attribute} ${variant} ${color}`;
  return normalizeTitleInfo({ title, noun, attribute, spec, material, color, variant });
}

function normalizeTitleInfo(info: ProductTitleInfo): ProductTitleInfo {
  return {
    ...info,
    title: info.title.replace(/\s+/g, " ").trim(),
  };
}

function refineProductDetails(
  category: SyntheticCategory,
  blueprint: ProductBlueprint,
  details: Pick<ProductTitleInfo, "noun" | "attribute" | "spec" | "material">,
  random: SeededRandom,
) {
  const next = { ...details };

  if (next.material.toLocaleLowerCase("tr-TR").includes("yumuşak") && next.attribute.toLocaleLowerCase("tr-TR").includes("yumuşak")) {
    next.attribute = pick(blueprint.attributes.filter((item) => !item.toLocaleLowerCase("tr-TR").includes("yumuşak")), random) || next.attribute;
  }

  if (category.slug === "telefon-aksesuar" && blueprint.kind === "aksesuar") {
    if (next.noun.includes("Powerbank")) {
      next.attribute = pick(["Kablosuz Şarjlı", "Hızlı Şarj", "MagSafe Uyumlu"], random);
      next.spec = pick(["10.000 mAh", "15W", "İnce Tasarım"], random);
      next.material = pick(["Alüminyum", "Mat TPU"], random);
    } else if (next.noun.includes("Kılıf")) {
      next.attribute = pick(["Şeffaf", "Darbeye Dayanıklı", "MagSafe Uyumlu"], random);
      next.spec = pick(["Standlı", "İnce Tasarım"], random);
      next.material = pick(["Silikon", "Mat TPU"], random);
    } else if (next.noun.includes("Stand")) {
      next.attribute = pick(["MagSafe Uyumlu", "Kablosuz Şarjlı"], random);
      next.spec = pick(["15W", "Standlı"], random);
      next.material = pick(["Alüminyum", "Mat TPU"], random);
    }
  }

  if (category.slug === "teknoloji" && blueprint.kind === "akıllı ev") {
    if (next.noun.includes("Priz")) {
      next.attribute = pick(["Uygulama Kontrollü", "Zamanlayıcılı", "Sesli Asistan Uyumlu"], random);
      next.spec = pick(["Enerji Tasarruflu", "Uzaktan Kontrol"], random);
      next.material = pick(["Minimal", "Mat Beyaz", "İnce Gövde"], random);
    } else {
      next.spec = pick(["RGB", "3 Işık Tonu", "Uzaktan Kontrol"], random);
    }
  }

  if (category.slug === "ev-yasam" && blueprint.kind === "dekor") {
    if (next.noun.includes("Lambası")) {
      next.attribute = pick(["Sıcak Işık", "Minimal"], random);
      next.spec = pick(["LED", "Dekoratif"], random);
      next.material = pick(["Metal", "Ahşap"], random);
    } else if (next.noun.includes("Raf")) {
      next.attribute = pick(["Düzenleyici", "Minimal"], random);
      next.spec = pick(["2 Katlı", "Orta Boy"], random);
      next.material = "Ahşap";
    } else if (next.noun.includes("Vazo")) {
      next.attribute = pick(["El Yapımı Görünüm", "Minimal"], random);
      next.spec = pick(["Orta Boy", "Dekoratif"], random);
      next.material = "Seramik";
    } else if (next.noun.includes("Sepet")) {
      next.attribute = "Düzenleyici";
      next.spec = pick(["Orta Boy", "Dekoratif"], random);
      next.material = "Hasır";
    }
  }

  if (category.slug === "mutfak" && blueprint.kind === "kahve") {
    if (next.noun.includes("Öğütücü")) {
      next.attribute = "Ayarlanabilir Öğütme";
      next.spec = "Paslanmaz";
      next.material = pick(["Çelik", "Mat Kaplama"], random);
    } else if (next.noun.includes("Termos")) {
      next.attribute = "Sızdırmaz";
      next.spec = pick(["350 ml", "600 ml"], random);
      next.material = "Çelik";
    } else if (next.noun.includes("French")) {
      next.attribute = pick(["Pratik", "Çift Cidarlı"], random);
      next.spec = "600 ml";
      next.material = "Cam";
    } else if (next.noun.includes("Fincan")) {
      next.attribute = pick(["Çift Cidarlı", "Pratik"], random);
      next.spec = "2'li Set";
      next.material = "Seramik";
    }
  }

  if (category.slug === "kozmetik-bakim") {
    if (next.noun.includes("Güneş")) {
      next.attribute = pick(["Hafif Yapılı", "Günlük Kullanım", "Hassas Cilt Uyumlu"], random);
      next.spec = "SPF 50";
    } else if (next.noun.includes("Gece")) {
      next.attribute = pick(["Parfümsüz", "Hassas Cilt Uyumlu", "Hafif Yapılı"], random);
      next.spec = pick(["50 ml", "Hyaluronik Asit"], random);
    } else if (next.noun.includes("Serum")) {
      next.spec = pick(["30 ml", "Hyaluronik Asit"], random);
      next.material = pick(["Cam Şişe", "Pompalı Ambalaj"], random);
    } else if (next.noun.includes("Şampuan")) {
      next.spec = pick(["250 ml", "Sülfatsız"], random);
      next.material = pick(["Geri Dönüşümlü Ambalaj", "Pompalı Şişe"], random);
    } else if (next.noun.includes("Yağı") || next.noun.includes("Sprey")) {
      next.spec = pick(["100 ml", "Durulanmayan"], random);
      next.material = pick(["Pompalı Şişe", "Seyahat Boy"], random);
    }
  }

  if (category.slug === "spor" && blueprint.kind === "outdoor") {
    if (next.noun.includes("Çantası")) {
      next.attribute = pick(["Su İtici", "Hafif"], random);
      next.spec = "20 L";
      next.material = "Ripstop Kumaş";
    } else if (next.noun.includes("Matara")) {
      next.attribute = pick(["Hafif", "Katlanabilir"], random);
      next.spec = "750 ml";
      next.material = "Çelik";
    } else if (next.noun.includes("Yağmurluk")) {
      next.attribute = pick(["Su İtici", "Nefes Alan", "Hafif"], random);
      next.spec = "Rüzgar Korumalı";
      next.material = "Ripstop Kumaş";
    } else if (next.noun.includes("Lambası")) {
      next.attribute = pick(["Hafif", "Katlanabilir"], random);
      next.spec = "USB Şarjlı";
      next.material = "Mat Kaplama";
    }
  }

  if (category.slug === "spor" && blueprint.kind === "fitness") {
    if (next.noun.includes("Yoga Matı")) {
      next.attribute = pick(["Taşıma Askılı", "Yeni Başlayan Uyumlu", "Kompakt"], random);
      next.spec = "6 mm";
      next.material = pick(["TPE", "Kauçuk"], random);
    } else if (next.noun.includes("Direnç Bandı")) {
      next.attribute = pick(["Ev Antrenmanı", "Yeni Başlayan Uyumlu"], random);
      next.spec = "3'lü Set";
      next.material = pick(["Kauçuk", "Neopren"], random);
    } else if (next.noun.includes("Dambıl")) {
      next.attribute = pick(["Ev Antrenmanı", "Kompakt"], random);
      next.spec = "10 kg";
      next.material = pick(["Çelik", "Neopren"], random);
    } else if (next.noun.includes("Pilates")) {
      next.attribute = pick(["Ev Antrenmanı", "Yeni Başlayan Uyumlu"], random);
      next.spec = pick(["3'lü Set", "Kaymaz Yüzey"], random);
      next.material = pick(["TPE", "Neopren"], random);
    }
  }

  if (category.slug === "kitap-hobi" && blueprint.kind === "kitap") {
    if (next.noun.includes("Kitabı")) {
      next.spec = pick(["Türkçe", "Yeni Baskı", "Ayraç Hediyeli"], random);
    } else if (next.noun.includes("Seti") || next.noun.includes("Kutusu")) {
      next.spec = pick(["Set", "Türkçe", "Ayraç Hediyeli"], random);
    }
  }

  if (category.slug === "kitap-hobi" && blueprint.kind === "hobi") {
    if (next.noun.includes("Puzzle")) {
      next.attribute = pick(["Ekransız Mola", "Yaratıcı"], random);
      next.spec = "1000 Parça";
      next.material = "Karton";
    } else if (next.noun.includes("Suluboya")) {
      next.attribute = pick(["Başlangıç Seviyesi", "Yaratıcı"], random);
      next.spec = "24 Renk";
      next.material = "Karton Kutu";
    } else if (next.noun.includes("Seramik")) {
      next.attribute = pick(["Başlangıç Seviyesi", "Evde Uygun"], random);
      next.spec = "12 Parça";
      next.material = "Seramik";
    } else if (next.noun.includes("Makrome")) {
      next.attribute = pick(["Başlangıç Seviyesi", "Evde Uygun"], random);
      next.spec = "Kılavuzlu";
      next.material = "Pamuk İp";
    }
  }

  return next;
}

function createPrice(category: SyntheticCategory, blueprint: ProductBlueprint, random: SeededRandom) {
  const profile = getPriceProfile(category, blueprint);
  const premium = random.float() < 0.12;
  const min = premium ? Math.max(profile.typicalMax, profile.min) : profile.min;
  const max = premium ? profile.max : profile.typicalMax;
  const curved = Math.pow(random.float(), premium ? 1.15 : 1.55);
  const raw = min + curved * (max - min);
  const current = roundToMarketplaceEnding(raw, random, profile.min, profile.max);
  const hasDiscount = random.float() < profile.discountRate;
  const discountPercentage = hasDiscount ? random.int(profile.minDiscount, profile.maxDiscount) : 0;
  const old = hasDiscount
    ? roundToMarketplaceEnding(current / (1 - discountPercentage / 100), random, current + 10, profile.max * 1.22)
    : undefined;

  return {
    current,
    old,
    discountPercentage,
    campaignLabel: hasDiscount ? pick(campaignLabels, random) : "Sabit sanal fiyat",
  };
}

function getPriceProfile(category: SyntheticCategory, blueprint: ProductBlueprint) {
  return priceProfiles[`${category.slug}:${blueprint.kind}`] ?? {
    min: category.priceRange.min,
    max: category.priceRange.max,
    typicalMax: Math.round(category.priceRange.max * 0.45),
    discountRate: 0.32,
    minDiscount: 5,
    maxDiscount: 22,
    reviewMax: 2_500,
  };
}

function roundToMarketplaceEnding(value: number, random: SeededRandom, min: number, max: number) {
  if (value < 100) {
    const smallEnding = pick([0, 0.5, 0.9], random);
    return round(clamp(Math.floor(value) + smallEnding, min, max), 2);
  }

  const step = value < 1_000 ? 10 : value < 10_000 ? 50 : 100;
  const ending = pick([-1, -0.1, 0, 9, 9.9], random);
  const rounded = Math.round(value / step) * step;
  return round(clamp(rounded + ending, min, max), 2);
}

function createMerchantName(index: number, random: SeededRandom) {
  const district = merchantDistricts[(index + random.int(0, merchantDistricts.length - 1)) % merchantDistricts.length];
  const descriptor = merchantDescriptors[(Math.floor(index / 5) + random.int(0, merchantDescriptors.length - 1)) % merchantDescriptors.length];
  const suffix = pick(merchantSuffixes, random);

  return `${district} ${descriptor} ${suffix}`;
}

function createModelCode(categorySlug: string, index: number, random: SeededRandom) {
  const prefixes: Partial<Record<SyntheticCategorySlug, string>> = {
    teknoloji: "TN",
    "telefon-aksesuar": "MB",
    bilgisayar: "PC",
    "oyuncu-ekipmanlari": "GX",
  };
  const prefix = prefixes[categorySlug as SyntheticCategorySlug] ?? slugifyTurkish(categorySlug).slice(0, 2).toUpperCase();
  const sequence = Math.floor(index / SYNTHETIC_CATEGORY_TAXONOMY.length)
    .toString()
    .padStart(3, "0");
  return `${prefix}-${random.int(20, 98)}${sequence}`;
}

function createShortDescription(
  category: SyntheticCategory,
  titleInfo: ProductTitleInfo,
  deliveryEstimate: string,
) {
  return `${titleInfo.attribute} detayları ve ${titleInfo.spec} seçeneğiyle ${category.name.toLocaleLowerCase("tr-TR")} vitrini için hazırlanmış sakin bir ürün kartı. ${deliveryEstimate}.`;
}

function createDescription(category: SyntheticCategory, titleInfo: ProductTitleInfo) {
  return `${titleInfo.title}, ${titleInfo.material.toLocaleLowerCase("tr-TR")} hissi ve ${titleInfo.variant.toLocaleLowerCase("tr-TR")} detayıyla Doply'nin sanal katalog deneyimi için hazırlanmıştır. Listeye alma, sepet oluşturma ve karar erteleme akışlarında gerçek ödeme almadan kullanılmak üzere tasarlanmıştır.`;
}

function createPlaceholderImage(category: SyntheticCategory, titleInfo: ProductTitleInfo) {
  const encodedText = encodeURIComponent(`${category.name} - ${titleInfo.noun}`.slice(0, 52));
  return `https://placehold.co/900x675/${category.imageTone.background}/${category.imageTone.foreground}/png?text=${encodedText}`;
}

function toBrandCase(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => {
      const lower = part.toLocaleLowerCase("tr-TR");
      return `${lower.charAt(0).toLocaleUpperCase("tr-TR")}${lower.slice(1)}`;
    })
    .join(" ");
}

function createRatingAndReviewCount(
  category: SyntheticCategory,
  blueprint: ProductBlueprint,
  price: number,
  random: SeededRandom,
) {
  const profile = getPriceProfile(category, blueprint);
  const minReviews = category.slug === "kitap-hobi" || category.slug === "kirtasiye" ? 2 : 6;
  const reviewCount = Math.round(minReviews + Math.pow(random.float(), 2.35) * profile.reviewMax + random.int(0, 37));
  const pricePressure = price / profile.max;
  let rating = 4.18 + (random.float() - 0.5) * 0.72 - pricePressure * 0.08;

  if (reviewCount < 30) {
    rating += (random.float() - 0.5) * 0.45;
  }

  if (reviewCount > profile.reviewMax * 0.65) {
    rating = 4.22 + random.float() * 0.44;
  }

  if (random.float() < 0.08) {
    rating -= random.float() * 0.42;
  }

  return {
    rating: round(clamp(rating, 3.5, 4.9), 1),
    reviewCount,
  };
}

function createPopularityScore(category: SyntheticCategory, reviewCount: number, random: SeededRandom) {
  const categoryBoost = category.slug === "moda" || category.slug === "kozmetik-bakim" ? 8 : 0;
  const reviewBoost = Math.min(34, Math.round(Math.log10(reviewCount + 1) * 12));
  return Math.round(clamp(28 + categoryBoost + reviewBoost + random.int(-7, 22), 18, 96));
}

function createDoplyScore(price: number, category: SyntheticCategory, blueprint: ProductBlueprint, random: SeededRandom) {
  const profile = getPriceProfile(category, blueprint);
  const priceWeight = price / profile.max;
  const score = 4.65 - priceWeight * 0.75 + (random.float() - 0.5) * 0.5;
  return round(clamp(score, 3.2, 4.9), 1);
}

function pick<T>(items: readonly T[], random: SeededRandom) {
  return items[random.int(0, items.length - 1)];
}

function round(value: number, digits: number) {
  const multiplier = 10 ** digits;
  return Math.round(value * multiplier) / multiplier;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
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
