"use client";

import React, { useState, useMemo } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedWallpaperCarousel } from "@/components/sections/FeaturedWallpaperCarousel";
import { WallpaperFilters } from "@/components/wallpapers/WallpaperFilters";
import { WallpaperGrid } from "@/components/wallpapers/WallpaperGrid";
import { WallpaperQuickViewModal } from "@/components/wallpapers/WallpaperQuickViewModal";
import CircularCarousel, { CircularCarouselItem } from "@/components/CircularCarousel";
import { CATEGORIES, getCdnImageUrl } from "@/lib/wallpapers";
import { useWallpapers } from "@/hooks/useWallpapers";
import { Wallpaper, Orientation } from "@/types/wallpaper";
import { IconSearch, IconX } from "@tabler/icons-react";

export default function Home() {
  const { wallpapers } = useWallpapers();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedOrientation, setSelectedOrientation] = useState<Orientation>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activePreview, setActivePreview] = useState<Wallpaper | null>(null);

  // Dynamic categories including default and custom categories
  const dynamicCategories = useMemo(() => {
    const list = Array.from(new Set(wallpapers.map((w) => w.category).filter(Boolean)));
    const merged = new Set(["All", ...CATEGORIES.filter((c) => c !== "All"), ...list]);
    return Array.from(merged);
  }, [wallpapers]);

  // Filter logic
  const filteredWallpapers = useMemo(() => {
    return wallpapers.filter((wp) => {
      // Category match
      const matchesCategory =
        selectedCategory === "All" ||
        wp.category.toLowerCase() === selectedCategory.toLowerCase() ||
        Boolean(wp.collection && wp.collection.toLowerCase() === selectedCategory.toLowerCase());

      // Orientation match:
      // When "mobile" is selected, include mobile-only AND dual wallpapers (common ones with phone edition)
      // When "desktop" is selected, include desktop-only AND dual wallpapers (common ones with desktop edition)
      const hasPhone = wp.hasPhoneCrop || Boolean(wp.phoneImageUrl) || wp.orientation === "mobile";
      const hasDesktop =
        wp.orientation === "desktop" ||
        Boolean(wp.desktopAsset) ||
        wp.aspectRatio === "16:9" ||
        wp.aspectRatio === "16:10";

      const matchesOrientation =
        selectedOrientation === "all" ||
        (selectedOrientation === "mobile" && hasPhone) ||
        (selectedOrientation === "desktop" && hasDesktop);

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
  }, [wallpapers, selectedCategory, selectedOrientation, searchQuery]);

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedOrientation("all");
    setSearchQuery("");
  };

  // Curated recent drops for the 3D circular carousel
  const carouselWallpapers = useMemo(() => {
    const drops = [...wallpapers];
    drops.sort((a, b) => {
      if (a.isNew && !b.isNew) return -1;
      if (!a.isNew && b.isNew) return 1;
      return 0;
    });
    return drops.slice(0, 12);
  }, [wallpapers]);

  const carouselItems: CircularCarouselItem[] = useMemo(() => {
    return carouselWallpapers.map((wp) => ({
      src: getCdnImageUrl(wp.thumbnailUrl || wp.imageUrl),
      alt: wp.title,
      title: wp.title,
      subtitle: `${wp.category} • ${wp.resolution}`,
    }));
  }, [carouselWallpapers]);

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
          wallpapers={wallpapers}
          onPreview={setActivePreview}
        />

        {/* 3. A Few Exclusive Drops (Swiper Carousel) */}
        <FeaturedWallpaperCarousel
          wallpapers={wallpapers}
          onPreview={setActivePreview}
        />

        {/* 4. All Wallpapers (Clean Filterable Catalog) */}
        <section id="wallpapers" className="w-full py-10 sm:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            {/* Header with Search and Title */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 sm:gap-6 mb-5 sm:mb-8">
              <div>
                <span className="font-mono text-[11px] sm:text-xs font-semibold text-primary uppercase tracking-wider">
                  Catalog
                </span>
                <h2 className="font-sans text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground mt-0.5">
                  All Wallpapers
                </h2>
                <p className="font-sans text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 max-w-xl line-clamp-1 sm:line-clamp-none">
                  Uncompressed 4K & 5K master backgrounds tailored for clean desks and handheld screens.
                </p>
              </div>

              {/* Inline Search Input with 1-click Clear Button */}
              <div className="w-full md:w-80">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search titles, tags, colors..."
                    className="h-9 sm:h-10 w-full rounded-none border border-border bg-surface pl-9 pr-8 font-sans text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                  <IconSearch
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      title="Clear search"
                      aria-label="Clear search"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      <IconX size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Active Search & Filter Feedback Banner */}
            {searchQuery.trim() && (
              <div className="mb-4 flex items-center justify-between border border-primary/30 bg-secondary/30 px-3.5 py-2 text-xs font-mono">
                <div className="flex items-center gap-2 text-foreground">
                  <IconSearch size={14} className="text-primary shrink-0" />
                  <span>
                    Showing results for <strong className="text-primary font-bold">&quot;{searchQuery}&quot;</strong>
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">
                    {filteredWallpapers.length} {filteredWallpapers.length === 1 ? "wallpaper" : "wallpapers"} found
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>Clear Search</span>
                  <IconX size={12} />
                </button>
              </div>
            )}

            {/* Filter Bar */}
            <div className="mb-6 sm:mb-10">
              <WallpaperFilters
                categories={dynamicCategories}
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
              isFiltered={
                selectedCategory !== "All" ||
                selectedOrientation !== "all" ||
                Boolean(searchQuery.trim())
              }
            />
          </div>
        </section>

        {/* 5. Curated 3D Ring Showcase: Circular Carousel */}
        {carouselItems.length > 0 && (
          <section className="w-full py-12 sm:py-16 bg-surface border-t border-border overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 mb-6 sm:mb-8 text-center flex flex-col items-center">
              <span className="font-mono text-[10px] sm:text-xs font-semibold text-primary uppercase tracking-widest px-2.5 py-1 border border-primary/40 bg-primary/5">
                INTERACTIVE 3D PERSPECTIVE
              </span>
              <h2 className="font-sans text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground mt-3">
                Explore Drops in 3D Orbit
              </h2>
              <p className="font-sans text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-lg leading-relaxed">
                Drag, swipe, or spin the carousel to browse recent releases. Click any wallpaper card to inspect details and download in lossless 4K.
              </p>
            </div>

            <div className="w-full h-[400px] sm:h-[460px] lg:h-[500px] relative select-none">
              <CircularCarousel
                items={carouselItems}
                preset="cylinder"
                autoplay="drift"
                speed={0.35}
                cardWidth={260}
                aspectRatio={16 / 10}
                cornerRadius={0}
                gap={16}
                fadeColor="#FCFAF4"
                captions={true}
                draggable={true}
                onItemClick={(_item, index) => {
                  const targetWp = carouselWallpapers[index];
                  if (targetWp) setActivePreview(targetWp);
                }}
              />
            </div>
          </section>
        )}
      </main>

      {/* 6. Minimal Editorial Footer */}
      <SiteFooter />

      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": "https://wallpaper.xweet.in/#website",
                name: "Xweet Wallpapers",
                url: "https://wallpaper.xweet.in",
                description:
                  "Curated wallpaper discovery platform for everyday screens. Warm editorial minimalism, crisp geometry, and high-fidelity 4K backgrounds.",
                publisher: {
                  "@id": "https://wallpaper.xweet.in/#organization",
                },
                potentialAction: {
                  "@type": "SearchAction",
                  target: "https://wallpaper.xweet.in/?search={search_term_string}",
                  "query-input": "required name=search_term_string",
                },
              },
              {
                "@type": "Organization",
                "@id": "https://wallpaper.xweet.in/#organization",
                name: "Xweet Wallpapers",
                url: "https://wallpaper.xweet.in",
                logo: "https://wallpaper.xweet.in/logo.png",
                founder: {
                  "@type": "Person",
                  name: "Vicky",
                  url: "https://wallpaper.xweet.in/xweet",
                },
                sameAs: ["https://x.com/xweet"],
              },
              {
                "@type": "CollectionPage",
                "@id": "https://wallpaper.xweet.in/#collection",
                url: "https://wallpaper.xweet.in",
                name: "Xweet Minimal Abstracts Wallpaper Catalog",
                description:
                  "Uncompressed 4K & 5K master backgrounds tailored for clean desks and handheld screens.",
                isPartOf: {
                  "@id": "https://wallpaper.xweet.in/#website",
                },
              },
            ],
          }),
        }}
      />

      {/* 6. Quick View Interactive Modal (Framer Motion) */}
      <WallpaperQuickViewModal
        wallpaper={activePreview}
        onClose={() => setActivePreview(null)}
      />
    </div>
  );
}
