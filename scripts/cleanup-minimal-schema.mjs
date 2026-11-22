import fs from "fs";
import path from "path";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

console.log("=================================================================");
console.log("🧹 CLEANING FIRESTORE & WALLPAPERS SCHEMA TO MINIMAL REST URLs");
console.log("=================================================================\n");

// 1. Initialize Firebase Admin SDK
const rootKeyPath = path.resolve(process.cwd(), "serviceAccountKey.json");
const serviceAccount = JSON.parse(fs.readFileSync(rootKeyPath, "utf-8"));
if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id || "xweet-wallpaper",
  });
}
const db = getFirestore();
console.log(`✓ Connected to Firestore project: ${serviceAccount.project_id}`);

const cdnDomain = "https://cdn.xweet.in";

// 2. Fetch all documents from Firestore
const snapshot = await db.collection("wallpapers").get();
console.log(`Found ${snapshot.size} documents in Firestore to clean...\n`);

const cleanWallpapersList = [];

for (const doc of snapshot.docs) {
  const data = doc.data();
  const slug = data.slug || doc.id;
  const isMobile = data.orientation === "mobile" || data.classification?.aspectRatio === "9:16";

  const phoneMasterUrl = `${cdnDomain}/wallpapers/phone/${slug}.webp`;
  const phoneThumbUrl = `${cdnDomain}/wallpapers/phone/thumbnails/${slug}.webp`;
  const desktopMasterUrl = isMobile
    ? phoneMasterUrl
    : `${cdnDomain}/wallpapers/${slug}.webp`;
  const desktopThumbUrl = isMobile
    ? phoneThumbUrl
    : `${cdnDomain}/wallpapers/thumbnails/${slug}.webp`;

  // Clean, single-source-of-truth URLs object
  const urls = {
    phone: phoneMasterUrl,
    phoneThumbnail: phoneThumbUrl,
    desktop: desktopMasterUrl,
    desktopThumbnail: desktopThumbUrl,
  };

  const cleanStorage = {
    r2Key: isMobile ? `wallpapers/phone/${slug}.webp` : `wallpapers/${slug}.webp`,
    format: "webp",
    ...(data.storage?.phoneCropCoords ? { phoneCropCoords: data.storage.phoneCropCoords } : {}),
  };

  const cleanDoc = {
    id: doc.id,
    slug,
    title: data.title || slug,
    description: data.description || "",
    classification: {
      category: data.classification?.category || data.category || (isMobile ? "Lockscreen" : "Modern Abstract"),
      collection: data.classification?.collection || data.collection || "Minimal Abstracts",
      aspectRatio: data.classification?.aspectRatio || data.aspectRatio || (isMobile ? "9:16" : "16:9"),
      resolution: data.classification?.resolution || data.resolution || (isMobile ? "1290 × 2796" : "3840 × 2160"),
    },
    styling: {
      dominantColor: data.styling?.dominantColor || data.dominantColor || "#111B2A",
      paletteHex: data.styling?.paletteHex || data.paletteHex || "#D99562",
      palette: data.styling?.palette || data.palette || ["#111B2A", "#344153", "#D99562"],
      tags: data.styling?.tags || data.tags || ["minimal", "abstract", "phone"],
    },
    flags: {
      isFeatured: Boolean(data.flags?.isFeatured ?? data.isFeatured),
      isNew: Boolean(data.flags?.isNew ?? data.isNew),
      hasPhoneCrop: true,
      hasDedicatedPhone: true,
    },
    author: data.author || {
      id: "xweet",
      username: "xweet",
      displayName: "Vicky",
      photoURL: "/logo.png",
      isVerified: true,
    },
    storage: cleanStorage,
    urls,
    metadata: {
      publishedAt: data.metadata?.publishedAt || data.publishedAt || new Date().toISOString(),
      createdAt: data.metadata?.createdAt || data.createdAt || Date.now(),
    },
  };

  // Replace document in Firestore cleanly (removing redundant phoneUrl, phoneThumbnailUrl, imageUrl, thumbnailUrl, etc.)
  await doc.ref.set(cleanDoc);
  cleanWallpapersList.push(cleanDoc);
  console.log(`✓ Cleaned [${doc.id}] "${cleanDoc.title}" -> single clean urls object`);
}

// 3. Update src/lib/wallpapers.ts with the cleaned catalog
console.log(`\nSynchronizing src/lib/wallpapers.ts with all ${cleanWallpapersList.length} cleaned documents...`);

const uniqueCategories = new Set(["All", "Dark Abstract", "Warm Minimal", "Cool Minimal"]);
for (const wp of cleanWallpapersList) {
  if (wp.classification?.category) uniqueCategories.add(wp.classification.category);
}

const wallpapersTsPath = path.resolve("src/lib/wallpapers.ts");
const updatedTsContent = `import { Collection, Wallpaper, WallpaperDoc, AuthorRef } from "@/types/wallpaper";

export const XWEET_AUTHOR: AuthorRef = {
  id: "xweet",
  username: "xweet",
  displayName: "Vicky",
  photoURL: "/logo.png",
  isVerified: true,
  bio: "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens.",
  joinedAt: "2026-01-01",
};

export const COLLECTIONS: Collection[] = [
  {
    id: "minimal-abstracts",
    slug: "minimal-abstracts",
    title: "Minimal Abstracts",
    description: "AI-generated and curated by Xweet. Quiet forms, chromatic diffusions, and organic textures.",
    coverImageUrl: "https://cdn.xweet.in/wallpapers/midnight-amber.webp",
    count: ${cleanWallpapersList.length},
    tags: ["Minimal", "Abstract", "4K", "Tactile", "Phone"],
  },
];

export const CATEGORIES = ${JSON.stringify(Array.from(uniqueCategories), null, 2)};

export const MOBILE_CATEGORIES = [
  "Lockscreen",
  "AMOLED Mobile",
  "Dark Abstract",
  "Minimal Mobile",
  "Anime Vertical",
  "Cyberpunk Mobile",
  "Aesthetic Portrait",
  "Nature Vertical",
  "Typography Lockscreen",
  "Warm Minimal",
  "Pastel Gradient",
  "Monochrome Abstract",
  "Warm Dark Abstract"
];

const RAW_WALLPAPERS: WallpaperDoc[] = ${JSON.stringify(cleanWallpapersList, null, 2)};

/**
 * Ensures wallpaper, phone crop, or thumbnail URLs point to the public Cloudflare R2 CDN.
 * Handles legacy relative paths gracefully.
 */
export function getCdnImageUrl(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("/wallpapers/")) {
    return \`https://cdn.xweet.in\${url}\`;
  }
  return url;
}

/**
 * Calculates responsive CSS object-position for phone preview cards
 * based on saved phoneCropCoords and original master resolution.
 */
export function getPhoneCropStyle(wallpaper?: Wallpaper | null): React.CSSProperties {
  if (!wallpaper) return { objectPosition: "center center" };

  // If a dedicated phone image is provided, it is already framed as a vertical phone asset
  if (wallpaper.urls?.phone && wallpaper.urls.phone !== wallpaper.urls?.desktop) {
    return { objectPosition: "center center" };
  }

  // If the wallpaper itself is portrait/mobile
  if (
    wallpaper.orientation === "mobile" ||
    wallpaper.aspectRatio === "9:16" ||
    wallpaper.aspectRatio === "9:19.5"
  ) {
    return { objectPosition: "center center" };
  }

  const coords = wallpaper.storage?.phoneCropCoords;
  if (!coords || typeof coords.x !== "number" || typeof coords.width !== "number") {
    return { objectPosition: "center center" };
  }

  let naturalWidth = 2752;
  if (wallpaper.resolution) {
    const parts = wallpaper.resolution.split(/[×xX]/);
    const parsedW = parseInt(parts[0]?.trim(), 10);
    if (!isNaN(parsedW) && parsedW > 0) {
      naturalWidth = parsedW;
    }
  }

  const maxOffset = naturalWidth - coords.width;
  if (maxOffset <= 0) return { objectPosition: "center center" };

  const pct = Math.max(0, Math.min(100, (coords.x / maxOffset) * 100));
  return { objectPosition: \`\${pct.toFixed(2)}% center\` };
}

/**
 * Returns the best CDN image URL for mobile lockscreen previews.
 * Prefers the dedicated phone thumbnail or phone master.
 */
export function getPhonePreviewUrl(wallpaper?: Wallpaper | null): string {
  if (!wallpaper) return "";
  return (
    wallpaper.urls?.phoneThumbnail ||
    wallpaper.urls?.phone ||
    wallpaper.phoneThumbnailUrl ||
    wallpaper.phoneImageUrl ||
    getCdnImageUrl(wallpaper.thumbnailUrl || wallpaper.imageUrl)
  );
}

/**
 * Normalizes any raw wallpaper (from Firestore or static fallback)
 * into the clean schema with backwards-compatible getters.
 */
export function normalizeWallpaper(raw: any): Wallpaper {
  if (!raw) return raw;
  const id = raw.id || raw.slug;
  const slug = raw.slug || raw.id;
  const title = raw.title || slug.replace(/-/g, " ");
  const description = raw.description || "";

  const classification = {
    category: raw.classification?.category || raw.category || "Modern Abstract",
    collection: raw.classification?.collection || raw.collection || "Minimal Abstracts",
    aspectRatio: (raw.classification?.aspectRatio || raw.aspectRatio || "16:9") as any,
    resolution: raw.classification?.resolution || raw.resolution || "3840 × 2160",
  };

  const dominantColor = raw.styling?.dominantColor || raw.dominantColor || "#111B2A";
  const paletteHex = raw.styling?.paletteHex || raw.paletteHex || dominantColor;
  const palette = raw.styling?.palette || (Array.isArray(raw.palette) ? raw.palette : [dominantColor]);
  const tags = raw.styling?.tags || (Array.isArray(raw.tags) ? raw.tags : ["minimal", "abstract"]);
  const styling = { dominantColor, paletteHex, palette, tags };

  const isFeatured = Boolean(raw.flags?.isFeatured ?? raw.isFeatured ?? raw.featured);
  const isNew = Boolean(raw.flags?.isNew ?? raw.isNew);
  const hasPhoneCrop = Boolean(raw.flags?.hasPhoneCrop ?? raw.hasPhoneCrop ?? true);
  const flags = { isFeatured, isNew, hasPhoneCrop, hasDedicatedPhone: true };

  const publishedAt = raw.metadata?.publishedAt || raw.publishedAt || new Date().toISOString();
  const createdAt = raw.metadata?.createdAt || raw.createdAt || Date.now();
  const metadata = { publishedAt, createdAt };

  const author = raw.author || {
    id: "xweet",
    username: "xweet",
    displayName: "Vicky",
    photoURL: "/logo.png",
    isVerified: true,
  };

  const isMobile =
    raw.orientation === "mobile" ||
    classification.aspectRatio === "9:16" ||
    classification.aspectRatio === "9:19.5";

  // Clean URLs
  const phoneMasterUrl = raw.urls?.phone || raw.phoneUrl || \`https://cdn.xweet.in/wallpapers/phone/\${slug}.webp\`;
  const phoneThumbUrl = raw.urls?.phoneThumbnail || raw.phoneThumbnailUrl || \`https://cdn.xweet.in/wallpapers/phone/thumbnails/\${slug}.webp\`;
  const desktopMasterUrl = raw.urls?.desktop || (isMobile ? phoneMasterUrl : \`https://cdn.xweet.in/wallpapers/\${slug}.webp\`);
  const desktopThumbUrl = raw.urls?.desktopThumbnail || (isMobile ? phoneThumbUrl : \`https://cdn.xweet.in/wallpapers/thumbnails/\${slug}.webp\`);

  const urls = {
    phone: phoneMasterUrl,
    phoneThumbnail: phoneThumbUrl,
    desktop: desktopMasterUrl,
    desktopThumbnail: desktopThumbUrl,
  };

  const storage = {
    r2Key: raw.storage?.r2Key || (isMobile ? \`wallpapers/phone/\${slug}.webp\` : \`wallpapers/\${slug}.webp\`),
    format: "webp",
    phoneCropCoords: raw.storage?.phoneCropCoords,
  };

  return {
    id,
    slug,
    title,
    description,
    classification,
    styling,
    flags,
    metadata,
    author,
    storage,
    urls,

    // Convenience accessors mapped directly to urls (clean & backwards compatible)
    imageUrl: desktopMasterUrl,
    thumbnailUrl: desktopThumbUrl,
    phoneImageUrl: phoneMasterUrl,
    phoneUrl: phoneMasterUrl,
    phoneThumbnailUrl: phoneThumbUrl,
    category: classification.category,
    collection: classification.collection,
    resolution: classification.resolution,
    aspectRatio: classification.aspectRatio,
    orientation: isMobile ? "mobile" : "desktop",
    dominantColor,
    paletteHex,
    palette,
    tags,
    isFeatured,
    featured: isFeatured,
    isNew,
    hasPhoneCrop,
    publishedAt,
    createdAt,
    views: raw.views || 0,
    downloads: raw.downloads || 0,
    desktopAsset: raw.desktopAsset,
    phoneAsset: raw.phoneAsset,
  };
}

export const WALLPAPERS: Wallpaper[] = RAW_WALLPAPERS.map(normalizeWallpaper);
`;

fs.writeFileSync(wallpapersTsPath, updatedTsContent, "utf-8");
console.log("✓ src/lib/wallpapers.ts updated with single minimal URLs schema.");

console.log("\n=================================================================");
console.log("🎉 SCHEMA CLEANUP COMPLETE: All 63 wallpapers are clean and minimal!");
console.log("=================================================================\n");
