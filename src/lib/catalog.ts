export type Category = {
  slug: string;
  name: string;
  description: string;
  accent: string;
  image: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  dopaminScore?: number;
  merchantName?: string;
  simulatedDeliveryEstimate?: string;
  popularityScore?: number;
  stockFeelingLabel?: string;
  campaignLabel?: string;
  discountPercentage?: number;
  image: string;
  gallery: string[];
  shortDescription: string;
  description: string;
  tags: string[];
  specs: string[];
  reflection: string;
};

export const categories: Category[] = [
  {
    slug: "moda",
    name: "Moda",
    description: "Dolap yenileme hissini sanal olarak prova et.",
    accent: "bg-[#f7d8c8]",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "teknoloji",
    name: "Teknoloji",
    description: "Yeni cihaz heyecanını harcama yapmadan yaşa.",
    accent: "bg-[#d9edf8]",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "ev-yasam",
    name: "Ev & Yaşam",
    description: "Evin için seç, sepete ekle, sonra dürtüyü izle.",
    accent: "bg-[#e4ead7]",
    image:
      "https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "guzellik",
    name: "Güzellik",
    description: "Bakım alışverişi ritüelini güvenli alanda simüle et.",
    accent: "bg-[#f4d5de]",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "spor",
    name: "Spor",
    description: "Motivasyon alışverişini gerçek ödeme olmadan tamamla.",
    accent: "bg-[#d7eadf]",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "kitap-hobi",
    name: "Kitap & Hobi",
    description: "Kendine vakit ayırma isteğini nazikçe keşfet.",
    accent: "bg-[#f6e7b9]",
    image:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=900&q=80",
  },
];

export const products: Product[] = [
  {
    id: "prd-001",
    slug: "minimal-keten-trenckot",
    name: "Minimal Keten Trençkot",
    category: "moda",
    price: 3290,
    compareAtPrice: 4190,
    rating: 4.7,
    reviewCount: 148,
    image:
      "https://images.unsplash.com/photo-1520975922284-8b456906c813?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1520975922284-8b456906c813?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
    ],
    shortDescription: "Hafif dokulu, şehir temposuna uygun zamansız dış katman.",
    description:
      "Dopamin kataloğundaki bu sanal trençkot, gerçek bir satın alma oluşturmadan stil kararını prova etmek için tasarlandı.",
    tags: ["Sanal Sepet", "Premium His", "Gerçek Ödeme Yok"],
    specs: ["Keten karışım hissi", "Rahat kesim", "Mevsim geçişi görünümü"],
    reflection: "Bunu gerçekten haftada kaç kez giyerdin?",
  },
  {
    id: "prd-002",
    slug: "sakin-ritim-kulaklik",
    name: "Sakin Ritim Kulaklık",
    category: "teknoloji",
    price: 5490,
    compareAtPrice: 6290,
    rating: 4.8,
    reviewCount: 212,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=900&q=80",
    ],
    shortDescription: "Sessiz çalışma ve yürüyüş molaları için kulak üstü deneyim.",
    description:
      "Gürültü azaltma fikrini, ödeme alanı veya mağaza işlemi olmadan deneyimleyebileceğin sanal teknoloji ürünü.",
    tags: ["Teknoloji", "Simülasyon", "Kart Bilgisi Yok"],
    specs: ["40 saat pil hissi", "Yumuşak pedler", "Mat siyah kaplama"],
    reflection: "Bu istek ihtiyaçtan mı, yorgunluktan mı geliyor?",
  },
  {
    id: "prd-003",
    slug: "seramik-kahve-seti",
    name: "Seramik Kahve Seti",
    category: "ev-yasam",
    price: 1190,
    rating: 4.6,
    reviewCount: 86,
    image:
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=80",
    ],
    shortDescription: "İki fincan, bir küçük servis tabağı ve sakin sabah hissi.",
    description:
      "Kahve köşesi kurma dürtüsünü gerçek harcama yapmadan tamamlamak için sıcak, dokulu bir sanal set.",
    tags: ["Ev", "Sanal Sipariş", "Gerçek Teslimat Yok"],
    specs: ["Mat seramik görünüm", "2 fincan", "Hediye kutusu simülasyonu"],
    reflection: "Evinde benzer bir ürün zaten var mı?",
  },
  {
    id: "prd-004",
    slug: "akilli-masa-lambasi",
    name: "Akıllı Masa Lambası",
    category: "teknoloji",
    price: 2390,
    compareAtPrice: 2790,
    rating: 4.5,
    reviewCount: 104,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80",
    ],
    shortDescription: "Çalışma masası için ayarlanabilir ışık ve odak atmosferi.",
    description:
      "Çalışma alanını yenileme isteğini satın alma baskısı olmadan gözlemleten sanal aydınlatma ürünü.",
    tags: ["Odak", "Sanal Ürün", "Simülasyon"],
    specs: ["Üç ışık tonu", "Dokunmatik kontrol hissi", "Minimal taban"],
    reflection: "Bunu almak yerine masanı düzenlemek aynı hissi verir mi?",
  },
  {
    id: "prd-005",
    slug: "gunluk-bakim-seti",
    name: "Günlük Bakım Seti",
    category: "guzellik",
    price: 1490,
    rating: 4.7,
    reviewCount: 176,
    image:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",
    ],
    shortDescription: "Sade bakım rutini hissi veren sanal krem ve serum seti.",
    description:
      "Bakım alışverişi dürtüsünü tetiklemeden, seçme ve tamamlama hissini etik biçimde sunan simülasyon ürünü.",
    tags: ["Bakım", "Kart Girişi Yok", "Destekleyici"],
    specs: ["Nem hissi", "Parfümsüz konsept", "Kompakt rutin"],
    reflection: "Bu ürünü almak istediğinde hangi duyguyu yatıştırıyorsun?",
  },
  {
    id: "prd-006",
    slug: "yumusak-kosu-ayakkabisi",
    name: "Yumuşak Koşu Ayakkabısı",
    category: "spor",
    price: 3890,
    compareAtPrice: 4490,
    rating: 4.4,
    reviewCount: 95,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=80",
    ],
    shortDescription: "Yürüyüş ve koşu niyetini destekleyen hafif taban hissi.",
    description:
      "Spor motivasyonunu alışverişle başlatma dürtüsünü fark etmek için gerçek ürün olmayan bir simülasyon.",
    tags: ["Spor", "Motivasyon", "Sanal Deneyim"],
    specs: ["Nefes alan üst yüzey", "Yumuşak taban", "Günlük kullanım görünümü"],
    reflection: "Bugün 10 dakikalık yürüyüş bu isteğin yerini alabilir mi?",
  },
  {
    id: "prd-007",
    slug: "analog-minimal-saat",
    name: "Analog Minimal Saat",
    category: "moda",
    price: 2790,
    rating: 4.6,
    reviewCount: 67,
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1539874754764-5a96559165b0?auto=format&fit=crop&w=900&q=80",
    ],
    shortDescription: "Sessiz lüks hissi veren ince kasa ve deri kayış görünümü.",
    description:
      "Aksesuar seçme keyfini ticari kayda çevirmeden tamamlayan sanal ürün.",
    tags: ["Aksesuar", "Sanal Sipariş", "Premium"],
    specs: ["İnce kasa", "Deri kayış hissi", "Günlük stil"],
    reflection: "Bu istek kendini ödüllendirme ihtiyacından mı doğdu?",
  },
  {
    id: "prd-008",
    slug: "denge-yoga-mati",
    name: "Denge Yoga Matı",
    category: "spor",
    price: 990,
    rating: 4.5,
    reviewCount: 121,
    image:
      "https://images.unsplash.com/photo-1599447292461-3c5dc9c6b96e?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1599447292461-3c5dc9c6b96e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?auto=format&fit=crop&w=900&q=80",
    ],
    shortDescription: "Evde esneme rutini için sade ve tutuşlu mat hissi.",
    description:
      "Kendine bakım alışverişini simüle ederken dürtünün seviyesini takip etmeye yardımcı olan sanal spor ürünü.",
    tags: ["Rutin", "Sanal", "Dürtü Takibi"],
    specs: ["Kaymaz doku", "Taşıma askısı", "Yumuşak yüzey"],
    reflection: "Mat almadan önce mevcut zeminde kısa bir esneme yapabilir misin?",
  },
  {
    id: "prd-009",
    slug: "mini-projektor",
    name: "Mini Projektör",
    category: "teknoloji",
    price: 6990,
    compareAtPrice: 7790,
    rating: 4.3,
    reviewCount: 54,
    image:
      "https://images.unsplash.com/photo-1626379953822-baec19c3accd?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1626379953822-baec19c3accd?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=900&q=80",
    ],
    shortDescription: "Film gecesi hayalini küçük bir kutuda canlandıran deneyim.",
    description:
      "Yüksek tutarlı teknoloji alışverişini, harcama yapmadan tamamlayıp düşünme alanı açan sanal ürün.",
    tags: ["Yüksek Tutar", "Gerçek Ödeme Yok", "Simülasyon"],
    specs: ["Taşınabilir gövde", "Ev sineması hissi", "Kablosuz bağlantı fikri"],
    reflection: "Bu ürünü kiralamak veya ödünç almak aynı ihtiyacı karşılar mı?",
  },
  {
    id: "prd-010",
    slug: "duzenli-gun-cantasi",
    name: "Düzenli Gün Çantası",
    category: "moda",
    price: 1890,
    rating: 4.5,
    reviewCount: 133,
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
    ],
    shortDescription: "Laptop, defter ve günlük eşyalar için düzen hissi.",
    description:
      "Organize olma arzusunu sanal sepetle tamamlamanı sağlayan, gerçek teslimatı olmayan ürün.",
    tags: ["Düzen", "Sanal Teslimat", "Moda"],
    specs: ["Çok bölmeli görünüm", "Omuz askısı", "Minimal form"],
    reflection: "Düzen isteği için çantadan önce hangi küçük adım yeterli olur?",
  },
  {
    id: "prd-011",
    slug: "sessiz-oda-mum-seti",
    name: "Sessiz Oda Mum Seti",
    category: "ev-yasam",
    price: 790,
    rating: 4.8,
    reviewCount: 188,
    image:
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=900&q=80",
    ],
    shortDescription: "Akşam sakinliği için üçlü mum konsepti.",
    description:
      "Rahatlama arzusunu alışveriş yerine duygu farkındalığına bağlayan sanal ev ürünü.",
    tags: ["Rahatlama", "Gerçek Ürün Yok", "Sanal Sipariş"],
    specs: ["Üç koku konsepti", "Cam kavanoz görünümü", "Hediye paketi hissi"],
    reflection: "Rahatlamak için şu an alışveriş dışında ne mümkün?",
  },
  {
    id: "prd-012",
    slug: "yaratici-defter-seti",
    name: "Yaratıcı Defter Seti",
    category: "kitap-hobi",
    price: 640,
    rating: 4.6,
    reviewCount: 73,
    image:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80",
    ],
    shortDescription: "Planlama, günlük ve fikir notları için sanal kırtasiye seti.",
    description:
      "Yeni başlangıç hissini gerçek harcama olmadan tamamlayan, sonrasında dürtü seviyeni gözlemleten hobi ürünü.",
    tags: ["Hobi", "Sanal", "Düşünme Molası"],
    specs: ["3 defter görünümü", "Yumuşak kapak", "Kalem seti hissi"],
    reflection: "Yeni bir defter almadan ilk sayfayı hangi mevcut deftere açabilirsin?",
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getProductsByCategory(slug: string) {
  return products.filter((product) => product.category === slug);
}

export function getFeaturedProducts() {
  return products.slice(0, 8);
}

export function getRelatedProducts(product: Product) {
  return products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 4);
}
