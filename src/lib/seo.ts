import type { Metadata } from "next";

import type { Product } from "@/lib/catalog";
import { getEnv } from "@/lib/env";

export type FaqItem = {
  question: string;
  answer: string;
};

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  keywords?: string[];
  type?: "website" | "article";
  noIndex?: boolean;
};

export const siteConfig = {
  name: "Doply",
  url: trimTrailingSlash(getEnv().NEXT_PUBLIC_SITE_URL),
  locale: "tr_TR",
  description:
    "Doply, alışveriş hissini gerçek ödeme, gerçek teslimat ve gerçek sipariş olmadan simüle eden etik bir platformdur.",
};

export function absoluteUrl(path = "/") {
  if (isAbsoluteUrl(path)) {
    return path;
  }

  return new URL(path, `${siteConfig.url}/`).toString();
}

export function buildMetadata({
  title,
  description,
  path,
  image = "/opengraph-image",
  imageAlt = "Doply alışveriş simülasyonu",
  keywords = [],
  type = "website",
  noIndex = false,
}: MetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const imageUrl = absoluteUrl(image);

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    keywords: [
      "Doply",
      "alışveriş simülasyonu",
      "sanal sipariş",
      "gerçek ödeme yok",
      ...keywords,
    ],
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
  };
}

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

export function buildWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    inLanguage: "tr-TR",
    description: siteConfig.description,
  };
}

export function buildBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildFaqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildGuideArticleJsonLd({
  title,
  description,
  path,
  dateModified,
}: {
  title: string;
  description: string;
  path: string;
  dateModified: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: absoluteUrl(path),
    inLanguage: "tr-TR",
    datePublished: "2026-06-10",
    dateModified,
    author: {
      "@type": "Organization",
      name: siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
    },
  };
}

export function buildCategoryCollectionJsonLd({
  name,
  description,
  path,
  products,
}: {
  name: string;
  description: string;
  path: string;
  products: Product[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absoluteUrl(path),
    inLanguage: "tr-TR",
    about: {
      "@type": "Thing",
      name: "Alışveriş simülasyonu",
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: products.slice(0, 24).map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `${product.name} sanal ürün simülasyonu`,
        url: absoluteUrl(`/urun/${product.slug}`),
      })),
    },
  };
}

export function buildSimulationProductPageJsonLd(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${product.name} sanal ürün simülasyonu`,
    description:
      `${product.shortDescription} Doply bu sayfada gerçek satış, stok, teslimat veya ödeme vaadi sunmaz.`,
    url: absoluteUrl(`/urun/${product.slug}`),
    inLanguage: "tr-TR",
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    about: {
      "@type": "Thing",
      name: product.name,
      description: "Gerçek satın alma oluşturmayan sanal ürün deneyimi.",
    },
  };
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function isAbsoluteUrl(value: string) {
  return /^https?:\/\//i.test(value);
}
