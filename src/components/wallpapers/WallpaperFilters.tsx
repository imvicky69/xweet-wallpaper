"use client";

import React from "react";
import {
  IconDeviceDesktop,
  IconDeviceMobile,
  IconLayoutGrid,
  IconArrowsShuffle,
  IconClock,
  IconSparkles,
} from "@tabler/icons-react";
import { Orientation, WallpaperSort } from "@/types/wallpaper";

interface WallpaperFiltersProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedOrientation: Orientation;
  onSelectOrientation: (orientation: Orientation) => void;
  sortBy?: WallpaperSort;
  onSelectSort?: (sort: WallpaperSort) => void;
  onShuffle?: () => void;
  totalResults: number;
}

export const WallpaperFilters: React.FC<WallpaperFiltersProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  selectedOrientation,
  onSelectOrientation,
  sortBy = "random",
  onSelectSort,
  onShuffle,
  totalResults,
}) => {
  return (
    <div className="flex flex-col gap-2.5 py-2.5 border-y border-border">
      {/* Compact single-row Style pills (horizontally scrollable on small screens) */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
        <span className="font-mono text-[11px] text-muted-foreground mr-1 uppercase shrink-0">
          Style:
        </span>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`h-7 px-2.5 text-[11px] font-mono tracking-wide uppercase transition-colors cursor-pointer shrink-0 select-none ${
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

      {/* Compact Ratio + Order + Count row */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t border-border/50">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Orientation Filter */}
          <div className="flex items-center gap-1">
            <span className="font-mono text-[11px] text-muted-foreground mr-0.5 uppercase shrink-0">
              Ratio:
            </span>
            <button
              type="button"
              onClick={() => onSelectOrientation("all")}
              className={`flex items-center gap-1 h-7 px-2 text-[11px] font-mono uppercase transition-colors cursor-pointer ${
                selectedOrientation === "all"
                  ? "bg-secondary text-secondary-foreground border border-border font-medium"
                  : "bg-surface border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <IconLayoutGrid size={12} />
              <span>All</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectOrientation("desktop")}
              className={`flex items-center gap-1 h-7 px-2 text-[11px] font-mono uppercase transition-colors cursor-pointer ${
                selectedOrientation === "desktop"
                  ? "bg-secondary text-secondary-foreground border border-border font-medium"
                  : "bg-surface border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <IconDeviceDesktop size={12} />
              <span>Desktop</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectOrientation("mobile")}
              className={`flex items-center gap-1 h-7 px-2 text-[11px] font-mono uppercase transition-colors cursor-pointer ${
                selectedOrientation === "mobile"
                  ? "bg-secondary text-secondary-foreground border border-border font-medium"
                  : "bg-surface border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <IconDeviceMobile size={12} />
              <span>Mobile</span>
            </button>
          </div>

          <div className="hidden sm:block h-3.5 w-px bg-border/60" />

          {/* Sort & Shuffle Controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                if (onShuffle) {
                  onShuffle();
                } else if (onSelectSort) {
                  onSelectSort("random");
                }
              }}
              title="Shuffle wallpapers"
              className={`flex items-center gap-1 h-7 px-2 text-[11px] font-mono uppercase transition-all cursor-pointer ${
                sortBy === "random"
                  ? "bg-primary text-primary-foreground border border-primary font-medium"
                  : "bg-surface border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              }`}
            >
              <IconArrowsShuffle size={12} />
              <span>Shuffle</span>
            </button>

            {onSelectSort && (
              <>
                <button
                  type="button"
                  onClick={() => onSelectSort("newest")}
                  className={`flex items-center gap-1 h-7 px-2 text-[11px] font-mono uppercase transition-colors cursor-pointer ${
                    sortBy === "newest"
                      ? "bg-secondary text-secondary-foreground border border-border font-medium"
                      : "bg-surface border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <IconClock size={12} />
                  <span>Newest</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectSort("featured")}
                  className={`flex items-center gap-1 h-7 px-2 text-[11px] font-mono uppercase transition-colors cursor-pointer ${
                    sortBy === "featured"
                      ? "bg-secondary text-secondary-foreground border border-border font-medium"
                      : "bg-surface border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <IconSparkles size={12} />
                  <span>Featured</span>
                </button>
              </>
            )}
          </div>
        </div>

        <div className="font-mono text-[11px] text-muted-foreground shrink-0">
          <span className="text-foreground font-semibold">{totalResults}</span> WALLPAPERS
        </div>
      </div>
    </div>
  );
};
