export type AspectRatio = "16:9" | "9:16" | "16:10" | "21:9" | "9:19.5";
export type Orientation = "all" | "desktop" | "mobile";
export type WallpaperSort = "random" | "newest" | "featured" | "oldest";

/**
 * Author reference stored inside the wallpaper document.
 */
export interface AuthorRef {
  id: string; // 'xweet' or Firebase Auth UID
  username: string; // e.g. 'xweet'
  displayName: string; // e.g. 'Vicky'
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
 * Clean storage specifications on Cloudflare R2
 */
export interface WallpaperStorage {
  r2Key: string; // e.g. 'wallpapers/midnight-amber.webp'
  phoneR2Key?: string; // Optional companion phone R2 key
  format: "webp" | "png" | "jpg" | "avif" | string;
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
  hasDedicatedPhone?: boolean;
}

export interface WallpaperMetadata {
  publishedAt: string;
  createdAt: number;
}

export interface WallpaperMonetization {
  affiliateMood?: string;
}

/**
 * Clean, single source of truth for all permanent CDN URLs
 */
export interface WallpaperUrls {
  phone: string;
  phoneThumbnail: string;
  desktop: string;
  desktopThumbnail: string;
}

/**
 * Legacy / transient asset format
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
 * Clean, minimal Wallpaper Document stored in Firestore
 */
export interface WallpaperDoc {
  id: string;
  slug: string;
  title: string;
  description: string;
  classification: WallpaperClassification;
  styling: WallpaperStyling;
  flags: WallpaperFlags;
  author: AuthorRef;
  storage: WallpaperStorage;
  urls: WallpaperUrls;
  metadata: WallpaperMetadata;
  monetization?: WallpaperMonetization;
}

/**
 * Normalized Wallpaper domain model with convenience accessors
 */
export interface Wallpaper extends WallpaperDoc {
  id: string;
  slug: string;
  title: string;
  description: string;

  classification: WallpaperClassification;
  styling: WallpaperStyling;
  flags: WallpaperFlags;
  author: AuthorRef;
  storage: WallpaperStorage;
  urls: WallpaperUrls;
  metadata: WallpaperMetadata;
  monetization?: WallpaperMonetization;

  // Convenience accessors mapped directly from urls
  imageUrl: string;
  thumbnailUrl: string;
  phoneImageUrl?: string;
  phoneUrl?: string;
  phoneThumbnailUrl?: string;
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
