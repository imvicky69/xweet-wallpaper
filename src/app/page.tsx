"use client";

import React, { useState, useMemo } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedWallpaperCarousel } from "@/components/sections/FeaturedWallpaperCarousel";
import { WallpaperFilters } from "@/components/wallpapers/WallpaperFilters";
import { WallpaperGrid } from "@/components/wallpapers/WallpaperGrid";
import { WallpaperQuickViewModal } from "@/components/wallpapers/WallpaperQuickViewModal";
import { WALLPAPERS, CATEGORIES } from "@/lib/wallpapers";
import { Wallpaper, Orientation } from "@/types/wallpaper";
import { IconSearch } from "@tabler/icons-react";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedOrientation, setSelectedOrientation] = useState<Orientation>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activePreview, setActivePreview] = useState<Wallpaper | null>(null);

  // Filter logic
  const filteredWallpapers = useMemo(() => {
    return WALLPAPERS.filter((wp) => {
      // Category match
      const matchesCategory =
        selectedCategory === "All" ||
        wp.category.toLowerCase() === selectedCategory.toLowerCase() ||
        wp.collection.toLowerCase() === selectedCategory.toLowerCase();

      // Orientation match
      const matchesOrientation =
        selectedOrientation === "all" || wp.orientation === selectedOrientation;

      // Search query match
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        wp.title.toLowerCase().includes(query) ||
        wp.description.toLowerCase().includes(query) ||
        wp.category.toLowerCase().includes(query) ||
        wp.tags.some((t) => t.toLowerCase().includes(query));

      return matchesCategory && matchesOrientation && matchesSearch;
    });
  }, [selectedCategory, selectedOrientation, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedOrientation("all");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* 1. Cleaner Premium Navbar with User's Circular Logo */}
      <SiteHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1">
        {/* 2. Hero Section: Auto-Fading Background + Rotating Word + Phone Crop & Zoom */}
        <HeroSection
          wallpapers={WALLPAPERS}
          onPreview={setActivePreview}
        />

        {/* 3. A Few Exclusive Drops (Swiper Carousel) */}
        <FeaturedWallpaperCarousel
          wallpapers={WALLPAPERS}
          onPreview={setActivePreview}
        />

        {/* 4. All Wallpapers (Clean Filterable Catalog) */}
        <section id="wallpapers" className="w-full py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            {/* Header with Search and Title */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div>
                <span className="font-mono text-xs font-semibold text-primary uppercase tracking-wider">
                  Catalog
                </span>
                <h2 className="font-sans text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mt-1">
                  All Wallpapers
                </h2>
                <p className="font-sans text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
                  Uncompressed 4K & 5K master backgrounds tailored for clean desks and handheld screens.
                </p>
              </div>

              {/* Inline Search Input with Tabler Icon */}
              <div className="w-full md:w-80">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search titles, tags, colors..."
                    className="h-10 w-full rounded-none border border-border bg-surface pl-9 pr-4 font-sans text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                  <IconSearch
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="mb-10">
              <WallpaperFilters
                categories={CATEGORIES}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                selectedOrientation={selectedOrientation}
                onSelectOrientation={setSelectedOrientation}
                totalResults={filteredWallpapers.length}
              />
            </div>

            {/* Responsive Wallpaper Grid */}
            <WallpaperGrid
              wallpapers={filteredWallpapers}
              onPreview={setActivePreview}
              onResetFilters={resetFilters}
            />
          </div>
        </section>
      </main>

      {/* 5. Minimal Editorial Footer */}
      <SiteFooter />

      {/* 6. Quick View Interactive Modal (Framer Motion) */}
      <WallpaperQuickViewModal
        wallpaper={activePreview}
        onClose={() => setActivePreview(null)}
      />
    </div>
  );
}
