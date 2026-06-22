import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const display = Fraunces({ subsets: ["latin"], variable: "--font-display", display: "swap", axes: ["opsz"] });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

const SITE_NAME = "Aloculture Plants";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://international.aloculture.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — Rare Variegated Alocasia for International Collectors`, template: `%s · ${SITE_NAME}` },
  description: "Rare variegated Alocasia from Thailand. Internationally priced, collector-grade specimens. Worldwide shipping available.",
  keywords: ["variegated Alocasia", "rare aroids", "Alocasia Thailand", "collector plants", "international shipping"],
  openGraph: { type: "website", siteName: SITE_NAME, title: `${SITE_NAME} — International`, url: SITE_URL },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF7" },
    { media: "(prefers-color-scheme: dark)", color: "#0C0F0D" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans">
        <ThemeProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
