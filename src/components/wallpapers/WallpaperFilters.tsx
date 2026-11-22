"use client";

import React, { useState } from "react";
import {
  IconDeviceDesktop,
  IconDeviceMobile,
  IconLayoutGrid,
  IconChevronDown,
  IconChevronUp,
  IconAdjustmentsHorizontal,
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
  const [isStylesExpanded, setIsStylesExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-3 sm:gap-5 py-3 sm:py-4 border-y border-border">
      {/* Top Filter Row: Categories */}
      <div>
        {/* Mobile Header for Styles with Collapse / Expand Toggle */}
        <div className="flex sm:hidden items-center justify-between pb-2">
          <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground uppercase">
            <IconAdjustmentsHorizontal size={14} className="text-primary" />
            <span>Style:</span>
            <span className="text-foreground font-semibold uppercase truncate max-w-[140px]">
              {selectedCategory}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsStylesExpanded(!isStylesExpanded)}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-mono uppercase bg-surface border border-border text-foreground hover:border-primary transition-colors cursor-pointer select-none"
          >
            <span>{isStylesExpanded ? "Collapse" : `All Styles (${categories.length})`}</span>
            {isStylesExpanded ? (
              <IconChevronUp size={13} />
            ) : (
              <IconChevronDown size={13} />
            )}
          </button>
        </div>

        {/* Categories List:
            - Desktop: Wraps naturally
            - Mobile Collapsed: Sleek single-line horizontal swipeable track
            - Mobile Expanded: Wraps all styles into grid with full view
        */}
        <div
          className={`flex items-center gap-2 ${
            isStylesExpanded
              ? "flex-wrap"
              : "flex-nowrap overflow-x-auto scrollbar-none pb-1 sm:pb-0 sm:flex-wrap"
          }`}
        >
          <span className="hidden sm:inline font-mono text-xs text-muted-foreground mr-1 uppercase shrink-0">
            Style:
          </span>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`h-7.5 sm:h-8 px-3 sm:px-3.5 text-xs font-mono tracking-wide uppercase transition-all cursor-pointer shrink-0 select-none ${
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
      </div>

      {/* Bottom Filter Row: Orientation + Sort & Shuffle + Count */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/50">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {/* Orientation Filter */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-mono text-xs text-muted-foreground mr-1 uppercase shrink-0">
              Ratio:
            </span>
            <button
              type="button"
              onClick={() => onSelectOrientation("all")}
              className={`flex items-center gap-1.5 h-7 sm:h-8 px-2.5 sm:px-3 text-xs font-mono uppercase transition-colors cursor-pointer ${
                selectedOrientation === "all"
                  ? "bg-secondary text-secondary-foreground border border-border font-medium"
                  : "bg-surface border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <IconLayoutGrid size={13} />
              <span>All</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectOrientation("desktop")}
              className={`flex items-center gap-1.5 h-7 sm:h-8 px-2.5 sm:px-3 text-xs font-mono uppercase transition-colors cursor-pointer ${
                selectedOrientation === "desktop"
                  ? "bg-secondary text-secondary-foreground border border-border font-medium"
                  : "bg-surface border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <IconDeviceDesktop size={13} />
              <span>Desktop</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectOrientation("mobile")}
              className={`flex items-center gap-1.5 h-7 sm:h-8 px-2.5 sm:px-3 text-xs font-mono uppercase transition-colors cursor-pointer ${
                selectedOrientation === "mobile"
                  ? "bg-secondary text-secondary-foreground border border-border font-medium"
                  : "bg-surface border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              <IconDeviceMobile size={13} />
              <span>Mobile</span>
            </button>
          </div>

          {/* Divider */}
          <div className="hidden sm:block h-4 w-px bg-border/60" />

          {/* Sort & Shuffle Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-mono text-xs text-muted-foreground mr-1 uppercase shrink-0">
              Order:
            </span>
            <button
              type="button"
              onClick={() => {
                if (onShuffle) {
                  onShuffle();
                } else if (onSelectSort) {
                  onSelectSort("random");
                }
              }}
              title="Shuffle wallpapers randomly (click again to re-roll)"
              className={`flex items-center gap-1.5 h-7 sm:h-8 px-2.5 sm:px-3 text-xs font-mono uppercase transition-all cursor-pointer ${
                sortBy === "random"
                  ? "bg-primary text-primary-foreground border border-primary font-medium"
                  : "bg-surface border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
              }`}
            >
              <IconArrowsShuffle size={13} />
              <span>Shuffle</span>
            </button>

            {onSelectSort && (
              <>
                <button
                  type="button"
                  onClick={() => onSelectSort("newest")}
                  title="Sort newest drops first"
                  className={`flex items-center gap-1.5 h-7 sm:h-8 px-2.5 sm:px-3 text-xs font-mono uppercase transition-colors cursor-pointer ${
                    sortBy === "newest"
                      ? "bg-secondary text-secondary-foreground border border-border font-medium"
                      : "bg-surface border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <IconClock size={13} />
                  <span>Newest</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectSort("featured")}
                  title="Show featured picks first"
                  className={`flex items-center gap-1.5 h-7 sm:h-8 px-2.5 sm:px-3 text-xs font-mono uppercase transition-colors cursor-pointer ${
                    sortBy === "featured"
                      ? "bg-secondary text-secondary-foreground border border-border font-medium"
                      : "bg-surface border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <IconSparkles size={13} />
                  <span>Featured</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Live Counter in Geist Mono */}
        <div className="font-mono text-xs text-muted-foreground shrink-0">
          <span className="text-foreground font-semibold">{totalResults}</span> WALLPAPERS
        </div>
      </div>
    </div>
  );
};
