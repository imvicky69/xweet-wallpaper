import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense, use } from "react";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { WALLPAPERS } from "@/lib/wallpapers";
import { Wallpaper } from "@/types/wallpaper";
import WallpaperDetailClient from "./WallpaperDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getWallpaperData(slug: string): Promise<Wallpaper | null> {
  const localMatch = WALLPAPERS.find((wp) => wp.slug === slug);
  if (localMatch) return localMatch;

  // Fallback: match without trailing legacy numeric timestamp (e.g. -952605)
  const cleanMatch = WALLPAPERS.find(
    (wp) => wp.slug.replace(/-\d{4,}$/, "") === slug
  );
  if (cleanMatch) return cleanMatch;

  try {
    const q = query(collection(db, "wallpapers"), where("slug", "==", slug), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const data = snap.docs[0].data() as Wallpaper;
      return {
        ...data,
        id: data.id || snap.docs[0].id,
      };
    }
  } catch (err: any) {
    console.warn("Could not query Firestore for wallpaper slug:", slug, err?.message);
  }
  return null;
}

export async function generateStaticParams() {
  return WALLPAPERS.map((wp) => ({
    slug: wp.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const wallpaper = await getWallpaperData(resolved.slug);

  if (!wallpaper) {
    return {
      title: "Wallpaper Not Found | Xweet",
      description: "The requested wallpaper could not be found on Xweet Wallpapers.",
    };
  }

  // Exact SEO natural title format requested by user:
  // e.g. "Midnight Amber Wallpaper – Dark Abstract | Xweet"
  const pageTitle = `${wallpaper.title} Wallpaper – ${wallpaper.category} | Xweet`;
  const description = wallpaper.description;
  const canonicalUrl = `https://wallpaper.xweet.in/wallpaper/${wallpaper.slug}`;

  return {
    title: {
      absolute: pageTitle,
    },
    description,
    alternates: {
      canonical: canonicalUrl,
    },
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
    authors: [
      {
        name: wallpaper.author?.displayName || "Vicky",
        url: `https://wallpaper.xweet.in/${wallpaper.author?.username || "xweet"}`,
      },
    ],
    creator: wallpaper.author?.displayName || "Xweet",
    publisher: "Xweet Wallpapers",
    openGraph: {
      title: pageTitle,
      description,
      type: "article",
      publishedTime: wallpaper.publishedAt,
      modifiedTime: new Date(wallpaper.createdAt || Date.now()).toISOString(),
      url: canonicalUrl,
      siteName: "Xweet Wallpapers",
      tags: wallpaper.tags,
      images: [
        {
          url: wallpaper.imageUrl,
          width: wallpaper.desktopAsset?.width || 2752,
          height: wallpaper.desktopAsset?.height || 1536,
          alt: `${wallpaper.title} Minimal Abstract Wallpaper`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@xweet",
      title: pageTitle,
      description,
      creator: "@xweet",
      images: [wallpaper.imageUrl],
    },
  };
}

async function WallpaperContainer({ paramsPromise }: { paramsPromise: Promise<{ slug: string }> }) {
  const resolved = await paramsPromise;
  const wallpaper = await getWallpaperData(resolved.slug);

  if (!wallpaper) {
    notFound();
  }

  const breadcrumbsJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Catalog",
        item: "https://wallpaper.xweet.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: wallpaper.collection || wallpaper.category || "Minimal Abstracts",
        item: `https://wallpaper.xweet.in/?category=${encodeURIComponent(wallpaper.category)}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: wallpaper.title,
        item: `https://wallpaper.xweet.in/wallpaper/${wallpaper.slug}`,
      },
    ],
  };

  const imageObjectJsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    name: `${wallpaper.title} Wallpaper`,
    caption: wallpaper.description,
    description: wallpaper.description,
    contentUrl: wallpaper.imageUrl,
    thumbnailUrl: wallpaper.thumbnailUrl || wallpaper.imageUrl,
    keywords: wallpaper.tags.join(", "),
    creator: {
      "@type": "Person",
      name: wallpaper.author?.displayName || "Vicky",
      url: `https://wallpaper.xweet.in/${wallpaper.author?.username || "xweet"}`,
    },
    publisher: {
      "@type": "Organization",
      name: "Xweet Wallpapers",
      logo: {
        "@type": "ImageObject",
        url: "https://wallpaper.xweet.in/logo.png",
      },
    },
    license: "https://wallpaper.xweet.in",
    acquireLicensePage: `https://wallpaper.xweet.in/wallpaper/${wallpaper.slug}`,
    isPartOf: {
      "@type": "CollectionPage",
      name: wallpaper.collection || "Minimal Abstracts",
      url: "https://wallpaper.xweet.in",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageObjectJsonLd) }}
      />
      <WallpaperDetailClient wallpaper={wallpaper} />
    </>
  );
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
