import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";

const heading = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const body = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KAM Dance Studio — Танцы в Ташкенте",
  description:
    "Keep A Move (KAM) — танцевальная студия в Ташкенте. Сальса, бачата, хип-хоп, контемпорари, танго, стретчинг. Первое занятие бесплатно.", /* #C8: added missing styles */
  openGraph: {
    title: "KAM Dance Studio — Танцы в Ташкенте",
    description: "Сальса, бачата, хип-хоп, контемпорари, танго и стретчинг. Первое занятие бесплатно.",
    type: "website",
    locale: "ru_RU",
    siteName: "KAM Dance Studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "KAM Dance Studio — Танцы в Ташкенте",
    description: "Сальса, бачата, хип-хоп, контемпорари, танго и стретчинг. Первое занятие бесплатно.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${heading.variable} ${body.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
