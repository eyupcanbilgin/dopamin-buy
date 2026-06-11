import type { FaqItem } from "@/lib/seo";

export type GuidePage = {
  slug: string;
  title: string;
  description: string;
  updatedAt: string;
  readingTime: string;
  keywords: string[];
  intro: string;
  sections: Array<{
    title: string;
    body: string;
  }>;
  faqs: FaqItem[];
};

export const guidePages: GuidePage[] = [
  {
    slug: "alisveris-istegi-nasil-yonetilir",
    title: "Alışveriş isteği nasıl yönetilir?",
    description:
      "Alışveriş isteğini fark etmek, bekletmek ve harcama yapmadan tamamlamak için destekleyici Doply yaklaşımı.",
    updatedAt: "2026-06-10",
    readingTime: "4 dk okuma",
    keywords: ["alışveriş isteği", "dürtü yönetimi", "harcamadan bekleme"],
    intro:
      "Alışveriş isteği bazen ihtiyaçtan, bazen stres, sıkılma, sosyal medya veya kendini ödüllendirme arzusundan doğar. Doply bu hissi bastırmak yerine güvenli bir simülasyon akışında görünür kılar.",
    sections: [
      {
        title: "İsteği önce puanla",
        body:
          "Kendine kısa bir soru sor: şu an alışveriş isteğim kaç / 10? Bu sayı doğru ya da yanlış değildir; sadece kararın içinden geçerken kendini takip etmene yardım eder.",
      },
      {
        title: "Tetikleyiciyi isimlendir",
        body:
          "Stres, sıkılma, gece geç saat, indirim korkusu veya sosyal medya gibi etiketler isteğin kaynağını netleştirir. Etiket seçmek yargılama değil, düzen fark etme aracıdır.",
      },
      {
        title: "Harcamadan kapanış oluştur",
        body:
          "Sanal sepete eklemek, teslimat ve ödeme hissini simüle etmek, bazı kullanıcılar için alışveriş döngüsünü gerçek harcama olmadan kapatmaya yardımcı olur. Doply kart bilgisi veya açık adres istemez.",
      },
      {
        title: "Kısa bir bekleme alanı aç",
        body:
          "10 dakika, 24 saat veya maaş gününe kadar bekletme seçeneği kararın üzerindeki baskıyı azaltır. Bu bir tıbbi yöntem değil; bütçe farkındalığı için sakin bir ürün tasarımıdır.",
      },
    ],
    faqs: [
      {
        question: "Doply alışveriş isteğini tedavi eder mi?",
        answer:
          "Hayır. Doply tıbbi tedavi veya tanı sunmaz. Alışveriş hissini gerçek harcama yapmadan simüle eden destekleyici bir farkındalık aracıdır.",
      },
      {
        question: "Alışveriş isteği gelince ne yapabilirim?",
        answer:
          "İsteği 1-10 arasında puanlayabilir, tetikleyiciyi seçebilir, sanal sepet akışını tamamlayabilir ve sonra kısa bir bekleme molası verebilirsin.",
      },
    ],
  },
  {
    slug: "sepete-ekleyip-almamak-neden-rahatlatir",
    title: "Sepete ekleyip almamak neden rahatlatır?",
    description:
      "Sepete ekleme hissinin neden rahatlatıcı olabileceğini ve Doply'nin bunu gerçek ödeme olmadan nasıl simüle ettiğini öğren.",
    updatedAt: "2026-06-10",
    readingTime: "3 dk okuma",
    keywords: ["sepete ekleyip almamak", "sanal sepet", "alışveriş hissi"],
    intro:
      "Online alışverişte rahatlatıcı olan şey bazen ürüne sahip olmak değil, seçmek, karşılaştırmak ve sepeti tamamlamaktır. Doply bu döngüyü gerçek ödeme olmadan kapatır.",
    sections: [
      {
        title: "Seçim yapmak zihinsel kapanış sağlar",
        body:
          "Ürünü bulmak, renk veya model seçmek ve sepete eklemek bir kararın tamamlandığı hissini verebilir. Doply bu hissi ticari siparişe çevirmeden sunar.",
      },
      {
        title: "Sepet, isteği dışarı taşır",
        body:
          "İstek sadece zihinde döndüğünde büyüyebilir. Sanal sepet, isteği görünür hale getirir ve toplam tutarı harcanmayan para olarak gösterebilir.",
      },
      {
        title: "Ödeme simülasyonu baskıyı azaltır",
        body:
          "Doply ödeme alanında kart numarası, CVV veya son kullanma tarihi istemez. Bunun yerine sanal ödeme yöntemi seçilir ve akış para harcamadan tamamlanır.",
      },
    ],
    faqs: [
      {
        question: "Sepete eklemek gerçek satın alma başlatır mı?",
        answer:
          "Hayır. Doply'de sepet ve Sanal Sipariş yalnızca simülasyondur; gerçek ödeme, stok ayırma veya teslimat oluşturmaz.",
      },
      {
        question: "Sepeti tamamladıktan sonra ne olur?",
        answer:
          "Simülasyon kapanış ekranı korunan tutarı ve dürtü puanı değişimini gösterir. İstersen 2 dakikalık soğuma molası veya bekletme modu seçebilirsin.",
      },
    ],
  },
  {
    slug: "doply-nasil-calisir",
    title: "Doply nasıl çalışır?",
    description:
      "Doply'nin sanal mağaza, sanal sepet, ödeme simülasyonu, takip ve dürtü paneli akışını açıkça anlatan rehber.",
    updatedAt: "2026-06-10",
    readingTime: "4 dk okuma",
    keywords: ["Doply nasıl çalışır", "alışveriş simülasyonu", "sanal ödeme"],
    intro:
      "Doply, premium bir e-ticaret deneyimi gibi hissettiren ama gerçek satış yapmayan bir alışveriş simülasyonudur. Amaç alışveriş dürtüsünü gerçek para harcamadan tamamlamaya destek olmaktır.",
    sections: [
      {
        title: "Önce açık bilgilendirme",
        body:
          "İlk kullanımda Doply'nin gerçek ödeme almadığı, gerçek teslimat yapmadığı, gerçek sipariş oluşturmadığı ve kart bilgisi istemediği açıkça anlatılır.",
      },
      {
        title: "Sonra gerçekçi keşif deneyimi",
        body:
          "Kullanıcı kategori ve ürün sayfalarında gezinir, ürünleri sanal sepete ekler ve dilerse isteğini 1-10 arasında puanlar. Ürün sayfaları satış vaadi değil, simülasyon deneyimi sunar.",
      },
      {
        title: "Checkout tamamen simülasyondur",
        body:
          "Teslimat adımında yalnızca şehir, ilçe ve adres tipi seçilir. Ödeme adımında kart alanı yoktur; Sanal Sipariş harcama yapmadan tamamlanır.",
      },
      {
        title: "Kapanış ve panel",
        body:
          "Sanal takip ekranı, korunan tutarı, son dürtü puanını, bekletme modlarını ve kısa yansıma sorularını gösterir. Panel günlük, haftalık ve aylık korunan tutarı özetler.",
      },
    ],
    faqs: [
      {
        question: "Doply gerçek ürün satar mı?",
        answer:
          "Hayır. Doply ürün benzeri katalog kullanır, ancak ödeme, teslimat, fatura veya gerçek sipariş oluşturmaz.",
      },
      {
        question: "Doply hangi bilgileri istemez?",
        answer:
          "Kart numarası, CVV, son kullanma tarihi, kimlik numarası ve tam açık adres istemez.",
      },
    ],
  },
  {
    slug: "sanal-siparis-nedir",
    title: "Sanal sipariş nedir?",
    description:
      "Sanal Sipariş kavramının gerçek siparişten farkını, ödeme ve teslimat içermeyen Doply akışını öğren.",
    updatedAt: "2026-06-10",
    readingTime: "3 dk okuma",
    keywords: ["sanal sipariş", "ödeme simülasyonu", "gerçek teslimat yok"],
    intro:
      "Sanal Sipariş, Doply'de alışveriş hissini tamamlayan ama gerçek ticari işlem oluşturmayan kapanış adıdır. Bir sipariş numarası hissi verir; gerçek sipariş değildir.",
    sections: [
      {
        title: "Gerçek ödeme yoktur",
        body:
          "Sanal Sipariş sırasında kart bilgisi girilmez, para çekilmez ve ödeme sağlayıcısına veri gönderilmez.",
      },
      {
        title: "Gerçek teslimat yoktur",
        body:
          "Teslimat simülasyonu açık adres istemez. Şehir, ilçe ve adres tipiyle kurgusal bir teslimat hissi oluşturulur; gerçek kurye veya kargo yoktur.",
      },
      {
        title: "Amaç duygusal kapanıştır",
        body:
          "Sanal Sipariş, sepete ekleme ve tamamlama hissini bütçeye zarar vermeden bitirmek için tasarlanır. Kullanıcı sonunda harcamadan koruduğu tutarı görür.",
      },
    ],
    faqs: [
      {
        question: "Sanal Sipariş numarası gerçek takip numarası mı?",
        answer:
          "Hayır. Numara yalnızca Doply simülasyonunun kapanış hissi için üretilir; gerçek lojistik takibi değildir.",
      },
      {
        question: "Sanal Siparişten sonra ürün gelir mi?",
        answer:
          "Hayır. Doply gerçek teslimat başlatmaz ve kullanıcıdan tam açık adres istemez.",
      },
    ],
  },
];

export function getGuidePages() {
  return guidePages;
}

export function getGuidePageBySlug(slug: string) {
  return guidePages.find((page) => page.slug === slug);
}
