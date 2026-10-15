export type AspectRatio = "16:9" | "9:16" | "16:10" | "21:9" | "9:19.5";
export type Orientation = "all" | "desktop" | "mobile";

/**
 * Author reference stored inside the wallpaper document or referenced.
 * For 'xweet', username is 'xweet' and isVerified is always true.
 */
export interface AuthorRef {
  id: string; // 'xweet' or Firebase Auth UID
  username: string; // e.g. 'xweet' or 'alex_v'
  displayName: string; // e.g. 'Xweet Studio' or 'Alex Vance'
  photoURL?: string; // Avatar URL
  isVerified?: boolean; // Automatically true if username === 'xweet'
  bio?: string;
  joinedAt?: string;
}

/**
 * 2D Bounding crop coordinates extracted from 4K master image for phone vertical lockscreen
 */
export interface WallpaperCropCoords {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Storage specifications for the single master WebP file on Cloudflare R2
 */
export interface WallpaperStorage {
  r2Key: string; // e.g. 'wallpapers/midnight-amber.webp'
  format: "webp" | "png" | "jpg" | "avif";
  phoneCropCoords?: WallpaperCropCoords;
}

export interface WallpaperClassification {
  category: string;
  collection: string;
  aspectRatio: AspectRatio;
  resolution: string;
}

export interface WallpaperStyling {
  dominantColor: string;
  paletteHex?: string;
  palette?: string[];
  tags: string[];
}

export interface WallpaperFlags {
  isFeatured?: boolean;
  isNew?: boolean;
  hasPhoneCrop?: boolean;
}

export interface WallpaperMetadata {
  publishedAt: string;
  createdAt: number;
}

export interface WallpaperMonetization {
  affiliateMood?: string;
}

/**
 * Cloudflare R2 Asset variant specifications (legacy / transient)
 */
export interface WallpaperAsset {
  key: string;
  url: string;
  width: number;
  height: number;
  resolution: string;
  aspectRatio: AspectRatio;
  fileSizeBytes?: number;
  format?: "webp" | "jpg" | "png" | "avif";
}

/**
 * Clean Wallpaper Document stored in Firestore
 */
export interface WallpaperDoc {
  id: string;
  slug: string;
  title: string;
  description: string;
  classification: WallpaperClassification;
  styling: WallpaperStyling;
  flags: WallpaperFlags;
  metadata: WallpaperMetadata;
  author: AuthorRef;
  storage: WallpaperStorage;
  monetization?: WallpaperMonetization;
}

/**
 * Normalized Wallpaper with top-level convenience accessors
 */
export interface Wallpaper extends WallpaperDoc {
  id: string;
  slug: string;
  title: string;
  description: string;

  // New clean schema fields
  classification: WallpaperClassification;
  styling: WallpaperStyling;
  flags: WallpaperFlags;
  metadata: WallpaperMetadata;
  author: AuthorRef;
  storage: WallpaperStorage;
  monetization?: WallpaperMonetization;

  // Convenience / backward compatibility fields (guaranteed by normalizeWallpaper)
  imageUrl: string;
  thumbnailUrl: string;
  phoneImageUrl?: string;
  category: string;
  collection: string;
  resolution: string;
  aspectRatio: AspectRatio;
  orientation: "desktop" | "mobile";
  dominantColor: string;
  paletteHex?: string;
  palette?: string[];
  tags: string[];
  isFeatured?: boolean;
  featured?: boolean;
  isNew?: boolean;
  hasPhoneCrop?: boolean;
  publishedAt: string;
  createdAt: number;
  views?: number;
  downloads?: number;
  desktopAsset?: WallpaperAsset;
  phoneAsset?: WallpaperAsset;
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImageUrl: string;
  count: number;
  tags: string[];
}
