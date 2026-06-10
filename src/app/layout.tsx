import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AppShell } from "@/components/layout/app-shell";
import { JsonLd } from "@/components/seo/json-ld";
import {
  buildMetadata,
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
  siteConfig,
} from "@/lib/seo";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Dopamin | Etik alışveriş simülasyonu",
    description:
      "Dopamin, online alışveriş dürtüsünü gerçek ödeme, gerçek teslimat ve gerçek sipariş olmadan tamamlamaya yardımcı olan etik bir simülasyon platformudur.",
    path: "/",
    keywords: ["online alışveriş dürtüsü", "etik alışveriş", "ödeme simülasyonu"],
  }),
  applicationName: siteConfig.name,
  title: {
    default: "Dopamin | Etik alışveriş simülasyonu",
    template: "%s | Dopamin",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-sans`}>
        <JsonLd data={[buildOrganizationJsonLd(), buildWebsiteJsonLd()]} />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
