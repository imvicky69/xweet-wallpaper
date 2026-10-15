"use client";

import React, { useState, useEffect, useRef } from "react";
import { Wallpaper } from "@/types/wallpaper";
import { WallpaperCard } from "./WallpaperCard";
import { CatalogEndQuote } from "./CatalogEndQuote";
import {
  IconPhotoOff,
  IconRefresh,
  IconArrowLeft,
  IconArrowRight,
  IconDeviceMobile,
  IconDeviceDesktop,
  IconLayoutGrid,
  IconLayoutColumns,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/Button";

interface WallpaperGridProps {
  wallpapers: Wallpaper[];
  onPreview: (wallpaper: Wallpaper) => void;
  onResetFilters?: () => void;
  itemsPerPage?: number;
  isFiltered?: boolean;
  onEdit?: (wallpaper: Wallpaper) => void;
  onDelete?: (wallpaper: Wallpaper) => void;
}

/**
 * Helper to generate page numbers with ellipsis for cleaner pagination display
 */
function getPaginationItems(currentPage: number, totalPages: number): (number | string)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  if (currentPage <= 3) {
    return [1, 2, 3, 4, "...", totalPages];
  }
  if (currentPage >= totalPages - 2) {
    return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }
  return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
}

export const WallpaperGrid: React.FC<WallpaperGridProps> = ({
  wallpapers,
  onPreview,
  onResetFilters,
  itemsPerPage = 12,
  isFiltered = false,
  onEdit,
  onDelete,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<"auto" | "mobile" | "desktop">("auto");
  const [mobileColumns, setMobileColumns] = useState<1 | 2>(2);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset to page 1 whenever the wallpapers list changes (filter or search applied)
  useEffect(() => {
    setCurrentPage(1);
  }, [wallpapers]);

  // Handle empty search / filter state
  if (wallpapers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border border-border bg-surface p-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center border border-border bg-muted/40 text-muted-foreground mb-4">
          <IconPhotoOff size={24} />
        </div>
        <h3 className="font-sans text-lg font-medium text-foreground">
          No wallpapers found
        </h3>
        <p className="font-sans text-sm text-muted-foreground mt-1 max-w-sm">
          No curated artwork matches the active combination of filters or search terms.
        </p>
        {onResetFilters && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onResetFilters}
            className="mt-6 text-xs"
          >
            <IconRefresh size={14} />
            <span>Reset All Filters</span>
          </Button>
        )}
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(wallpapers.length / itemsPerPage));
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, wallpapers.length);
  const displayedWallpapers = wallpapers.slice(startIndex, endIndex);

  const isFirstPage = validCurrentPage === 1;
  const isLastPage = validCurrentPage === totalPages;

  const scrollToGridTop = () => {
    const targetElement = document.getElementById("wallpapers") || containerRef.current;
    if (targetElement) {
      const navOffset = -80;
      const elementY = targetElement.getBoundingClientRect().top + window.pageYOffset + navOffset;
      window.scrollTo({ top: elementY, behavior: "smooth" });
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage === validCurrentPage || newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    scrollToGridTop();
  };

  const handleNextPage = () => {
    if (!isLastPage) {
      handlePageChange(validCurrentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (!isFirstPage) {
      handlePageChange(validCurrentPage - 1);
    }
  };

  const paginationItems = getPaginationItems(validCurrentPage, totalPages);

  return (
    <div ref={containerRef} className="w-full flex flex-col">
      {/* 1. View Options & Layout Bar */}
      <div className="flex items-center justify-between pb-3 mb-4 text-xs font-mono border-b border-border/60">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span className="hidden sm:inline">Preview Mode:</span>
          <div className="flex items-center gap-1 bg-surface border border-border p-0.5">
            <button
              type="button"
              onClick={() => setViewMode("auto")}
              title="Responsive: Phone view on phones, Desktop master on desktops"
              className={`px-2 py-0.5 text-[11px] transition-colors cursor-pointer ${
                viewMode === "auto"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Adaptive
            </button>
            <button
              type="button"
              onClick={() => setViewMode("mobile")}
              title="Force 4K Phone Lockscreen cropped previews"
              className={`flex items-center gap-1 px-2 py-0.5 text-[11px] transition-colors cursor-pointer ${
                viewMode === "mobile"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <IconDeviceMobile size={12} />
              <span>Phone</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("desktop")}
              title="Force 4K Desktop master landscape previews"
              className={`flex items-center gap-1 px-2 py-0.5 text-[11px] transition-colors cursor-pointer ${
                viewMode === "desktop"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <IconDeviceDesktop size={12} />
              <span>Desktop</span>
            </button>
          </div>
        </div>

        {/* Mobile Column Grid Switcher (1 col vs 2 col) + Drop Count */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex sm:hidden items-center gap-1 bg-surface border border-border p-0.5">
            <button
              type="button"
              onClick={() => setMobileColumns(2)}
              title="2-Column Mobile Feed"
              className={`flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono transition-colors cursor-pointer ${
                mobileColumns === 2
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <IconLayoutGrid size={11} />
              <span>2 Col</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileColumns(1)}
              title="1-Column Full Feed"
              className={`flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono transition-colors cursor-pointer ${
                mobileColumns === 1
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <IconLayoutColumns size={11} />
              <span>1 Col</span>
            </button>
          </div>

          <span className="font-mono text-[11px] text-muted-foreground">
            {wallpapers.length} drops
          </span>
        </div>
      </div>

      {/* 2. Wallpaper Grid: 2-column mobile default (phone proportion), 3-column desktop */}
      <div
        className={`grid ${
          mobileColumns === 1 ? "grid-cols-1" : "grid-cols-2"
        } sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6 lg:gap-8`}
      >
        {displayedWallpapers.map((wallpaper) => (
          <WallpaperCard
            key={wallpaper.id}
            wallpaper={wallpaper}
            viewMode={viewMode}
            onPreview={onPreview}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* 3. Pagination Navigation Bar (visible whenever there is more than 1 page) */}
      {totalPages > 1 && (
        <nav
          aria-label="Wallpaper catalog pagination"
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 sm:pt-8 mt-8 sm:mt-10 border-t border-border"
        >
          {/* Metadata counter */}
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span>
              Showing{" "}
              <strong className="text-foreground font-semibold">
                {startIndex + 1}–{endIndex}
              </strong>{" "}
              of <strong className="text-foreground font-semibold">{wallpapers.length}</strong> drops
            </span>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-1.5">
            {/* Prev Page Button */}
            <button
              onClick={handlePrevPage}
              disabled={isFirstPage}
              aria-label="Go to previous page"
              className="flex items-center gap-1.5 h-8 px-3 border border-border bg-surface font-mono text-xs text-foreground hover:border-primary hover:text-primary disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer rounded-none"
            >
              <IconArrowLeft size={13} />
              <span className="hidden sm:inline">Prev</span>
            </button>

            {/* Numeric / Ellipsis Page Buttons */}
            <div className="flex items-center gap-1">
              {paginationItems.map((item, index) => {
                if (item === "...") {
                  return (
                    <span
                      key={`ellipsis-${index}`}
                      className="flex h-8 w-7 items-center justify-center font-mono text-xs text-muted-foreground select-none"
                    >
                      ...
                    </span>
                  );
                }

                const pageNum = Number(item);
                const isCurrent = pageNum === validCurrentPage;

                return (
                  <button
                    key={`page-${pageNum}`}
                    onClick={() => handlePageChange(pageNum)}
                    aria-current={isCurrent ? "page" : undefined}
                    aria-label={`Page ${pageNum}`}
                    className={`h-8 min-w-[32px] px-2 font-mono text-xs border transition-colors cursor-pointer rounded-none ${
                      isCurrent
                        ? "bg-primary text-primary-foreground border-primary font-semibold"
                        : "bg-surface border-border text-foreground hover:border-primary hover:text-primary"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next Page Button */}
            <button
              onClick={handleNextPage}
              disabled={isLastPage}
              aria-label="Go to next page"
              className="flex items-center gap-1.5 h-8 px-3 border border-border bg-surface font-mono text-xs text-foreground hover:border-primary hover:text-primary disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer rounded-none"
            >
              <span className="hidden sm:inline">Next</span>
              <IconArrowRight size={13} />
            </button>
          </div>
        </nav>
      )}

      {/* 4. Editorial Catalog Quote Sign-Off on Final Page */}
      {isLastPage && (
        <CatalogEndQuote
          onScrollToTop={scrollToGridTop}
          onResetFilters={onResetFilters}
          isFiltered={isFiltered}
        />
      )}
    </div>
  );
};
