export type AspectRatio = "16:9" | "9:16" | "16:10" | "21:9";
export type Orientation = "all" | "desktop" | "mobile";

export interface Wallpaper {
  id: string;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  resolution: string;
  aspectRatio: AspectRatio;
  orientation: "desktop" | "mobile";
  category: string;
  collection: string;
  dominantColor: string;
  paletteHex?: string;
  tags: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  publishedAt: string;
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
