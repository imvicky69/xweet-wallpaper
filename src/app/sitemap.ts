import { MetadataRoute } from "next";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { WALLPAPERS } from "@/lib/wallpapers";
import { Wallpaper } from "@/types/wallpaper";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wallpaper.xweet.in";

  // Core pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/xweet`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/upload`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // Merge static wallpapers with live Firestore drops
  const wallpaperMap = new Map<string, { slug: string; lastModified: Date }>();

  for (const wp of WALLPAPERS) {
    if (wp.slug) {
      wallpaperMap.set(wp.slug, {
        slug: wp.slug,
        lastModified: new Date(wp.publishedAt || wp.createdAt || Date.now()),
      });
    }
  }

  try {
    const snap = await getDocs(collection(db, "wallpapers"));
    snap.forEach((doc) => {
      const data = doc.data() as Wallpaper;
      if (data.slug) {
        wallpaperMap.set(data.slug, {
          slug: data.slug,
          lastModified: new Date(data.publishedAt || data.createdAt || Date.now()),
        });
      }
    });
  } catch (err) {
    console.warn("Sitemap Firestore fetch note:", err);
  }

  // Dynamic wallpaper routes
  const wallpaperRoutes: MetadataRoute.Sitemap = Array.from(wallpaperMap.values()).map((wp) => ({
    url: `${baseUrl}/wallpaper/${wp.slug}`,
    lastModified: wp.lastModified,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...wallpaperRoutes];
}
