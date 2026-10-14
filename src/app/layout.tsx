import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { ServiceWorkerRegister } from "@/components/common/ServiceWorkerRegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#244B38",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://wallpaper.xweet.in"),
  title: {
    default: "Xweet Wallpapers — Curated Minimal Abstracts",
    template: "%s | Xweet Wallpapers",
  },
  description:
    "Curated wallpaper discovery platform for everyday screens. Warm editorial minimalism, crisp geometry, and high-fidelity 4K backgrounds.",
  alternates: {
    canonical: "https://wallpaper.xweet.in",
  },
  category: "Design & Art",
  classification: "Curated Wallpapers, Minimalist Design, 4K Backgrounds",
  keywords: [
    "Xweet",
    "Xweet Wallpapers",
    "4K desktop wallpaper",
    "phone wallpaper",
    "minimalist wallpapers",
    "abstract wallpapers",
    "lockscreen wallpaper",
    "aesthetic backgrounds",
    "clean desktop backgrounds",
    "editorial wallpapers",
    "high resolution backgrounds",
  ],
  authors: [{ name: "Vicky", url: "https://wallpaper.xweet.in/xweet" }],
  creator: "Vicky (@xweet)",
  publisher: "Xweet Wallpapers",
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Xweet Wallpapers",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://wallpaper.xweet.in",
    siteName: "Xweet Wallpapers",
    title: "Xweet Wallpapers — Curated Minimal Abstracts",
    description:
      "Curated wallpaper discovery platform for everyday screens. Warm editorial minimalism, crisp geometry, and high-fidelity 4K backgrounds.",
    images: [
      {
        url: "https://cdn.xweet.in/wallpapers/midnight-amber.png",
        width: 2752,
        height: 1536,
        alt: "Xweet Wallpapers Minimal Abstracts Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@xweet",
    title: "Xweet Wallpapers — Curated Minimal Abstracts",
    description: "Curated wallpaper discovery platform for everyday screens.",
    creator: "@xweet",
    images: ["https://cdn.xweet.in/wallpapers/midnight-amber.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground selection:bg-secondary selection:text-secondary-foreground`}>
        <Providers>
          <ServiceWorkerRegister />
          {children}
        </Providers>
      </body>
    </html>
  );
}
