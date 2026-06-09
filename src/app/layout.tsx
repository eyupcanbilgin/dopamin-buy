import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AppShell } from "@/components/layout/app-shell";

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
  title: {
    default: "Dopamin | Etik alışveriş simülasyonu",
    template: "%s | Dopamin",
  },
  description:
    "Dopamin, online alışveriş dürtüsünü gerçek ödeme ve ticari kayıt olmadan tamamlamaya yardımcı olan etik bir simülasyon platformudur.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-sans`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
