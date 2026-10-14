"use client";

import { useState, useEffect } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { WALLPAPERS as STATIC_WALLPAPERS } from "@/lib/wallpapers";
import { Wallpaper } from "@/types/wallpaper";

/**
 * Merge Firestore wallpapers with static fallback wallpapers.
 * Ensures deduplication by slug and id, placing newest drops first.
 */
function mergeWallpapers(firestoreItems: Wallpaper[], staticItems: Wallpaper[]): Wallpaper[] {
  const map = new Map<string, Wallpaper>();

  // 1. Add static base items
  for (const item of staticItems) {
    const key = item.slug || item.id;
    if (key) map.set(key, item);
  }

  // 2. Overlay Firestore items (fresh cloud drops take precedence)
  for (const item of firestoreItems) {
    const key = item.slug || item.id;
    if (key) {
      const existing = map.get(key);
      map.set(key, { ...existing, ...item });
    }
  }

  const merged = Array.from(map.values());

  // 3. Sort: newest drops first
  return merged.sort((a, b) => {
    const timeA = a.createdAt || (a.publishedAt ? new Date(a.publishedAt).getTime() : 0);
    const timeB = b.createdAt || (b.publishedAt ? new Date(b.publishedAt).getTime() : 0);
    return timeB - timeA;
  });
}

export function useWallpapers() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>(() =>
    mergeWallpapers([], STATIC_WALLPAPERS)
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const q = query(collection(db, "wallpapers"));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const remoteItems: Wallpaper[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data() as Wallpaper;
            remoteItems.push({
              ...data,
              id: data.id || doc.id,
            });
          });

          const combined = mergeWallpapers(remoteItems, STATIC_WALLPAPERS);
          setWallpapers(combined);
          setLoading(false);
        },
        (error) => {
          console.warn("Firestore real-time wallpaper listener note:", error?.message);
          setWallpapers(mergeWallpapers([], STATIC_WALLPAPERS));
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err: any) {
      console.warn("Could not attach real-time wallpaper listener:", err?.message);
      setLoading(false);
    }
  }, []);

  return { wallpapers, loading };
}
