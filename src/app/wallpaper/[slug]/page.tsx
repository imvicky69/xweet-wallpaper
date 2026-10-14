import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense, use } from "react";
import { WALLPAPERS } from "@/lib/wallpapers";
import WallpaperDetailClient from "./WallpaperDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return WALLPAPERS.map((wp) => ({
    slug: wp.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const wallpaper = WALLPAPERS.find((wp) => wp.slug === resolved.slug);

  if (!wallpaper) {
    return {
      title: "Wallpaper Not Found | Xweet",
      description: "The requested wallpaper could not be found on Xweet Wallpapers.",
    };
  }

  // Exact SEO natural title format requested by user:
  // e.g. "Midnight Amber Wallpaper – Dark Abstract | Xweet"
  const title = `${wallpaper.title} Wallpaper – ${wallpaper.category} | Xweet`;
  const description = wallpaper.description;

  return {
    title,
    description,
    keywords: [
      ...wallpaper.tags,
      wallpaper.category,
      wallpaper.collection || "Minimal Abstracts",
      "Xweet",
      "Xweet Wallpapers",
      "4k desktop wallpaper",
      "minimal wallpaper",
      "aesthetic background",
    ],
    authors: [{ name: "Xweet", url: "https://wallpaper.xweet.in/xweet" }],
    creator: "Xweet",
    publisher: "Xweet Wallpapers",
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://wallpaper.xweet.in/wallpaper/${wallpaper.slug}`,
      siteName: "Xweet Wallpapers",
      images: [
        {
          url: wallpaper.imageUrl,
          width: 2752,
          height: 1536,
          alt: `${wallpaper.title} Minimal Abstract Wallpaper`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@xweet",
      images: [wallpaper.imageUrl],
    },
  };
}

function WallpaperContainer({ paramsPromise }: { paramsPromise: Promise<{ slug: string }> }) {
  const resolved = use(paramsPromise);
  const wallpaper = WALLPAPERS.find((wp) => wp.slug === resolved.slug);

  if (!wallpaper) {
    notFound();
  }

  return <WallpaperDetailClient wallpaper={wallpaper} />;
}

export default function WallpaperPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background font-mono text-xs text-muted-foreground">
          LOADING WALLPAPER MASTER...
        </div>
      }
    >
      <WallpaperContainer paramsPromise={params} />
    </Suspense>
  );
}
