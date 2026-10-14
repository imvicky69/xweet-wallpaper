import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://xweet.com"),
  title: {
    default: "Xweet Wallpapers — Curated Minimal Abstracts",
    template: "%s | Xweet Wallpapers",
  },
  description: "Curated wallpaper discovery platform for everyday screens. Warm editorial minimalism, crisp geometry, and high-fidelity 4K backgrounds.",
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
  ],
  authors: [{ name: "Vicky", url: "https://xweet.com/xweet" }],
  creator: "Vicky (@xweet)",
  publisher: "Xweet Wallpapers",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://xweet.com",
    siteName: "Xweet Wallpapers",
    title: "Xweet Wallpapers — Curated Minimal Abstracts",
    description: "Curated wallpaper discovery platform for everyday screens. Warm editorial minimalism, crisp geometry, and high-fidelity 4K backgrounds.",
    images: [
      {
        url: "/wallpapers/midnight-amber.png",
        width: 2752,
        height: 1536,
        alt: "Xweet Wallpapers Minimal Abstracts Collection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Xweet Wallpapers — Curated Minimal Abstracts",
    description: "Curated wallpaper discovery platform for everyday screens.",
    creator: "@xweet",
    images: ["/wallpapers/midnight-amber.png"],
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
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
