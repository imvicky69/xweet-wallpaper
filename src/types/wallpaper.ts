export type AspectRatio = "16:9" | "9:16" | "16:10" | "21:9";
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
 * Cloudflare R2 Asset variant specifications
 */
export interface WallpaperAsset {
  key: string; // Cloudflare R2 object key (e.g. 'wallpapers/serene-terracotta/desktop.webp')
  url: string; // Public CDN URL (e.g. 'https://cdn.xweet.com/wallpapers/serene-terracotta/desktop.webp')
  width: number; // e.g. 3840
  height: number; // e.g. 2160
  resolution: string; // e.g. '3840 × 2160' or '4K UHD'
  aspectRatio: AspectRatio; // '16:9' or '16:10' or '9:16'
  fileSizeBytes?: number; // Raw bytes size
  format?: "webp" | "jpg" | "png" | "avif";
}

/**
 * Optimized Wallpaper Document Payload stored in Firestore
 */
export interface Wallpaper {
  id: string; // Firestore document ID
  slug: string; // URL slug e.g. 'serene-terracotta-fold'
  title: string; // Display title
  description: string; // Editorial description

  // Primary Desktop Asset in Cloudflare R2
  imageUrl: string; // Main image URL for fast display
  desktopAsset?: WallpaperAsset; // Full R2 desktop asset details
  thumbnailUrl?: string; // Lightweight preview for fast grid load

  // Optional Phone Crop Asset
  hasPhoneCrop?: boolean; // True if author included a mobile crop
  phoneImageUrl?: string; // Mobile cropped image URL
  phoneAsset?: WallpaperAsset; // Full R2 phone asset details

  // Specifications & Categorization
  resolution: string; // e.g. '3840 × 2160'
  aspectRatio: AspectRatio; // '16:9'
  orientation: "desktop" | "mobile";
  category: string; // 'Warm Neutrals', 'Abstract Textures', etc.
  collection?: string;
  dominantColor: string; // Hex color e.g. '#D6C7B2'
  paletteHex?: string;
  palette?: string[]; // 3-5 extracted tones
  tags: string[];

  // Author Attribution
  author: AuthorRef;

  // Stats & Flags
  views?: number;
  downloads?: number;
  isFeatured?: boolean;
  featured?: boolean;
  isNew?: boolean;
  publishedAt: string; // ISO string
  createdAt?: number; // Epoch timestamp for sorting
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
