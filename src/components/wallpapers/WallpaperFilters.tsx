"use client";

import React from "react";
import { IconDeviceDesktop, IconDeviceMobile, IconLayoutGrid } from "@tabler/icons-react";
import { Orientation } from "@/types/wallpaper";

interface WallpaperFiltersProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedOrientation: Orientation;
  onSelectOrientation: (orientation: Orientation) => void;
  totalResults: number;
}

export const WallpaperFilters: React.FC<WallpaperFiltersProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedOrientation,
  onSelectOrientation,
  totalResults,
}) => {
  return (
    <div className="flex flex-col gap-5 py-4 border-y border-border">
      {/* Top Filter Row: Categories */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-xs text-muted-foreground mr-1 uppercase">
          Style:
        </span>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`h-8 px-3.5 text-xs font-mono tracking-wide uppercase transition-all cursor-pointer ${
                isActive
                  ? "bg-primary text-primary-foreground border border-primary font-medium"
                  : "bg-surface border border-border text-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Bottom Filter Row: Orientation + Count */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground mr-1 uppercase">
            Ratio:
          </span>
          <button
            onClick={() => onSelectOrientation("all")}
            className={`flex items-center gap-1.5 h-8 px-3 text-xs font-mono uppercase transition-colors cursor-pointer ${
              selectedOrientation === "all"
                ? "bg-secondary text-secondary-foreground border border-border font-medium"
                : "bg-surface border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <IconLayoutGrid size={14} />
            <span>All Formats</span>
          </button>

          <button
            onClick={() => onSelectOrientation("desktop")}
            className={`flex items-center gap-1.5 h-8 px-3 text-xs font-mono uppercase transition-colors cursor-pointer ${
              selectedOrientation === "desktop"
                ? "bg-secondary text-secondary-foreground border border-border font-medium"
                : "bg-surface border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <IconDeviceDesktop size={14} />
            <span>Desktop</span>
          </button>

          <button
            onClick={() => onSelectOrientation("mobile")}
            className={`flex items-center gap-1.5 h-8 px-3 text-xs font-mono uppercase transition-colors cursor-pointer ${
              selectedOrientation === "mobile"
                ? "bg-secondary text-secondary-foreground border border-border font-medium"
                : "bg-surface border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <IconDeviceMobile size={14} />
            <span>Mobile</span>
          </button>
        </div>

        {/* Live Counter in Geist Mono */}
        <div className="font-mono text-xs text-muted-foreground">
          <span className="text-foreground font-semibold">{totalResults}</span> WALLPAPERS
        </div>
      </div>
    </div>
  );
};
