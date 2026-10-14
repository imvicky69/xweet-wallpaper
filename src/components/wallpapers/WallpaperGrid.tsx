"use client";

import React, { useState, useEffect, useRef } from "react";
import { Wallpaper } from "@/types/wallpaper";
import { WallpaperCard } from "./WallpaperCard";
import { CatalogEndQuote } from "./CatalogEndQuote";
import { IconPhotoOff, IconRefresh, IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
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
      {/* 1. Wallpaper Grid: Strictly 12 items rendered per page */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {displayedWallpapers.map((wallpaper) => (
          <WallpaperCard
            key={wallpaper.id}
            wallpaper={wallpaper}
            onPreview={onPreview}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* 2. Pagination Navigation Bar (visible whenever there is more than 1 page) */}
      {totalPages > 1 && (
        <nav
          aria-label="Wallpaper catalog pagination"
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 mt-10 border-t border-border"
        >
          {/* Metadata counter */}
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span>
              Showing{" "}
              <strong className="text-foreground font-semibold">
                {startIndex + 1}–{endIndex}
              </strong>{" "}
              of{" "}
              <strong className="text-foreground font-semibold">
                {wallpapers.length}
              </strong>
            </span>
            <span className="text-border">•</span>
            <span>
              Page{" "}
              <strong className="text-foreground font-semibold">
                {validCurrentPage}
              </strong>{" "}
              of{" "}
              <strong className="text-foreground font-semibold">
                {totalPages}
              </strong>
            </span>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Previous Page Button */}
            <button
              type="button"
              onClick={handlePrevPage}
              disabled={isFirstPage}
              className={`inline-flex items-center gap-1.5 h-9 px-3.5 font-mono text-xs font-medium border transition-colors select-none rounded-none ${
                isFirstPage
                  ? "border-border/60 bg-muted/20 text-muted-foreground/40 cursor-not-allowed"
                  : "border-border bg-surface text-foreground hover:border-primary hover:text-primary cursor-pointer active:scale-[0.98]"
              }`}
              aria-label="Go to previous page"
            >
              <IconArrowLeft size={14} />
              <span>Prev</span>
            </button>

            {/* Page number buttons */}
            <div className="flex items-center gap-1">
              {paginationItems.map((item, idx) => {
                if (item === "...") {
                  return (
                    <span
                      key={`ellipsis-${idx}`}
                      className="flex h-9 w-7 items-center justify-center font-mono text-xs text-muted-foreground select-none"
                    >
                      …
                    </span>
                  );
                }

                const pageNum = item as number;
                const isActive = pageNum === validCurrentPage;

                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    className={`flex h-9 min-w-9 items-center justify-center px-2.5 font-mono text-xs font-semibold border transition-colors select-none cursor-pointer rounded-none ${
                      isActive
                        ? "bg-primary border-primary text-primary-foreground shadow-xs"
                        : "border-border bg-surface text-foreground hover:border-primary hover:text-primary active:scale-[0.98]"
                    }`}
                    aria-label={`Go to page ${pageNum}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            {/* Next Page Button */}
            <button
              type="button"
              onClick={handleNextPage}
              disabled={isLastPage}
              className={`inline-flex items-center gap-1.5 h-9 px-4 font-mono text-xs font-medium border-2 transition-all select-none rounded-none ${
                isLastPage
                  ? "border-border/60 bg-muted/20 text-muted-foreground/40 cursor-not-allowed"
                  : "border-primary bg-primary text-primary-foreground hover:bg-transparent hover:text-primary hover:border-primary cursor-pointer active:scale-[0.98] shadow-xs"
              }`}
              aria-label="Go to next page"
            >
              <span>Next Page</span>
              <IconArrowRight size={14} />
            </button>
          </div>
        </nav>
      )}

      {/* 3. Gen-Z Finale Quote: Rendered when reaching the last page */}
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
