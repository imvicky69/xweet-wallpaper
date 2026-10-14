"use client";

import React, { useState, useEffect } from "react";
import { GEN_Z_END_QUOTES, getRandomQuoteIndex } from "@/lib/quotes";
import { IconSparkles, IconDice, IconArrowUp, IconRefresh } from "@tabler/icons-react";

interface CatalogEndQuoteProps {
  onScrollToTop?: () => void;
  onResetFilters?: () => void;
  isFiltered?: boolean;
}

export const CatalogEndQuote: React.FC<CatalogEndQuoteProps> = ({
  onScrollToTop,
  onResetFilters,
  isFiltered = false,
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  // Initialize random quote on client hydration to avoid SSR mismatch
  useEffect(() => {
    setQuoteIndex(getRandomQuoteIndex());
  }, []);

  const handleShuffle = () => {
    setIsRotating(true);
    setQuoteIndex((prev) => getRandomQuoteIndex(prev));
    setTimeout(() => setIsRotating(false), 300);
  };

  const currentQuote = GEN_Z_END_QUOTES[quoteIndex] || GEN_Z_END_QUOTES[0];

  return (
    <aside
      aria-label="End of catalog quote"
      className="mt-12 sm:mt-16 w-full border border-border bg-surface rounded-none overflow-hidden"
    >
      <div className="relative py-8 sm:py-12 px-5 sm:px-8 lg:px-12 text-center flex flex-col items-center">
        {/* Subtle decorative top tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary text-secondary-foreground font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider border border-border rounded-none mb-4">
          <IconSparkles size={13} className="text-primary" />
          <span>YOU&apos;VE REACHED THE END • CATALOG FINALE</span>
        </div>

        {/* The Gen-Z Quote */}
        <blockquote
          key={quoteIndex}
          className={`font-sans text-lg sm:text-2xl md:text-3xl font-medium tracking-tight text-foreground max-w-2xl leading-snug transition-all duration-300 ${
            isRotating ? "opacity-40 scale-[0.98]" : "opacity-100 scale-100"
          }`}
        >
          &ldquo;{currentQuote}&rdquo;
        </blockquote>

        {/* Editorial Subtitle */}
        <p className="font-sans text-xs sm:text-sm text-muted-foreground mt-3 max-w-md">
          {isFiltered
            ? "You reached the end of filtered results. Reset filters to explore the rest of the archive."
            : "You've scrolled through every master wallpaper in this catalog. We curate and drop fresh 4K & 5K gems regularly."}
        </p>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mt-6 sm:mt-8">
          <button
            type="button"
            onClick={handleShuffle}
            className="inline-flex items-center gap-1.5 sm:gap-2 h-9 px-3.5 sm:px-4 border border-border bg-background text-foreground hover:border-primary hover:text-primary font-mono text-xs transition-all cursor-pointer rounded-none active:scale-[0.98]"
            title="Roll another random Gen-Z quote"
          >
            <IconDice
              size={15}
              className={`transition-transform duration-300 ${
                isRotating ? "rotate-180" : ""
              }`}
            />
            <span>SHUFFLE VIBE</span>
          </button>

          {onScrollToTop && (
            <button
              type="button"
              onClick={onScrollToTop}
              className="inline-flex items-center gap-1.5 sm:gap-2 h-9 px-3.5 sm:px-4 border border-border bg-background text-foreground hover:border-primary hover:text-primary font-mono text-xs transition-colors cursor-pointer rounded-none active:scale-[0.98]"
              title="Return to the top of wallpapers catalog"
            >
              <IconArrowUp size={14} />
              <span>BACK TO TOP</span>
            </button>
          )}

          {isFiltered && onResetFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 sm:gap-2 h-9 px-3.5 sm:px-4 border border-border bg-background text-foreground hover:border-primary hover:text-primary font-mono text-xs transition-colors cursor-pointer rounded-none active:scale-[0.98]"
            >
              <IconRefresh size={14} />
              <span>RESET ALL FILTERS</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
