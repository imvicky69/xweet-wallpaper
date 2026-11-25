"use client";

import React, { useState, useMemo, useEffect } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { HeroSection } from "@/components/sections/HeroSection";
import { WallpaperFilters } from "@/components/wallpapers/WallpaperFilters";
import { WallpaperGrid } from "@/components/wallpapers/WallpaperGrid";
import { WallpaperQuickViewModal } from "@/components/wallpapers/WallpaperQuickViewModal";
import { shuffleWallpapers } from "@/lib/wallpapers";
import { useWallpapers } from "@/hooks/useWallpapers";
import { Wallpaper, Orientation, WallpaperSort } from "@/types/wallpaper";
import { IconSearch, IconX } from "@tabler/icons-react";

const COMPACT_STYLES = [
  "All",
  "Abstract",
  "Minimal",
  "Dark & AMOLED",
  "Flowers",
  "Nature",
  "Anime",
  "Lockscreen",
];

function matchesCompactStyle(wp: Wallpaper, style: string): boolean {
  if (style === "All") return true;
  const cat = (wp.category || "").toLowerCase();
  const col = (wp.collection || "").toLowerCase();
  const tags = (wp.tags || []).map((t) => t.toLowerCase());
  const hay = [cat, col, ...tags].join(" ");

  switch (style) {
    case "Abstract":
      return cat.includes("abstract");
    case "Minimal":
      return (
        cat.includes("minimal") ||
        cat.includes("neutral") ||
        cat.includes("pastel") ||
        cat.includes("monochrome")
      );
    case "Dark & AMOLED":
      return cat.includes("dark") || cat.includes("amoled") || tags.includes("oled");
    case "Flowers":
      return cat.includes("flower") || hay.includes("flower");
    case "Nature":
      return cat.includes("nature") || tags.includes("nature");
    case "Anime":
      return cat.includes("anime") || tags.includes("anime");
    case "Lockscreen":
      return cat.includes("lockscreen") || cat.includes("portrait");
    default:
      return cat === style.toLowerCase();
  }
}

export default function Home() {
  const { wallpapers } = useWallpapers();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedOrientation, setSelectedOrientation] = useState<Orientation>("all");
  const [sortBy, setSortBy] = useState<WallpaperSort>("random");
  const [shuffleSeed, setShuffleSeed] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activePreview, setActivePreview] = useState<Wallpaper | null>(null);

  useEffect(() => {
    setIsMounted(true);
    setShuffleSeed(Date.now());
  }, []);

  const handleShuffle = () => {
    setSortBy("random");
    setShuffleSeed(Date.now());
  };

  // Filter & Sort logic
  const filteredWallpapers = useMemo(() => {
    let list = wallpapers.filter((wp) => {
      const matchesCategory = matchesCompactStyle(wp, selectedCategory);

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

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        wp.title.toLowerCase().includes(query) ||
        wp.description.toLowerCase().includes(query) ||
        wp.category.toLowerCase().includes(query) ||
        wp.tags.some((t) => t.toLowerCase().includes(query));

      return matchesCategory && matchesOrientation && matchesSearch;
    });

    if (sortBy === "random" && isMounted) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      list = shuffleWallpapers(list);
    } else if (sortBy === "newest") {
      list.sort((a, b) => {
        const timeA = a.createdAt || (a.publishedAt ? new Date(a.publishedAt).getTime() : 0);
        const timeB = b.createdAt || (b.publishedAt ? new Date(b.publishedAt).getTime() : 0);
        return timeB - timeA;
      });
    } else if (sortBy === "featured") {
      list.sort((a, b) => {
        const featA = a.isFeatured ? 1 : 0;
        const featB = b.isFeatured ? 1 : 0;
        if (featB !== featA) return featB - featA;
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
    } else if (sortBy === "oldest") {
      list.sort((a, b) => {
        const timeA = a.createdAt || (a.publishedAt ? new Date(a.publishedAt).getTime() : 0);
        const timeB = b.createdAt || (b.publishedAt ? new Date(b.publishedAt).getTime() : 0);
        return timeA - timeB;
      });
    }

    return list;
  }, [wallpapers, selectedCategory, selectedOrientation, searchQuery, sortBy, shuffleSeed, isMounted]);

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedOrientation("all");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Seamless Header merged over Hero */}
      <SiteHeader
        seamless
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1">
        {/* Compact Hero Section with dual-URL laptop + phone preview */}
        <HeroSection
          wallpapers={wallpapers}
          onPreview={setActivePreview}
        />

        {/* Compact Catalog Section */}
        <section id="wallpapers" className="w-full py-5 sm:py-8">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
            {/* Compact Header + Inline Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 sm:mb-4">
              <div className="flex items-baseline gap-2.5">
                <h2 className="font-sans text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                  All Wallpapers
                </h2>
                <span className="font-mono text-[11px] text-muted-foreground uppercase">
                  4K Desktop &amp; Phone
                </span>
              </div>

              <div className="w-full sm:w-72">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search titles, tags, colors..."
                    className="h-8.5 w-full rounded-none border border-border bg-surface pl-8 pr-7 font-sans text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                  />
                  <IconSearch
                    size={14}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      title="Clear search"
                      aria-label="Clear search"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      <IconX size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Active Search Banner */}
            {searchQuery.trim() && (
              <div className="mb-3 flex items-center justify-between border border-primary/30 bg-secondary/30 px-3 py-1.5 text-xs font-mono">
                <div className="flex items-center gap-2 text-foreground">
                  <IconSearch size={13} className="text-primary shrink-0" />
                  <span>
                    Results for <strong className="text-primary font-bold">&quot;{searchQuery}&quot;</strong>
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">
                    {filteredWallpapers.length} found
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>Clear</span>
                  <IconX size={12} />
                </button>
              </div>
            )}

            {/* Compact Filter Bar */}
            <div className="mb-5">
              <WallpaperFilters
                categories={COMPACT_STYLES}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                selectedOrientation={selectedOrientation}
                onSelectOrientation={setSelectedOrientation}
                sortBy={sortBy}
                onSelectSort={setSortBy}
                onShuffle={handleShuffle}
                totalResults={filteredWallpapers.length}
              />
            </div>

            {/* Responsive Wallpaper Grid */}
            <WallpaperGrid
              wallpapers={filteredWallpapers}
              onPreview={setActivePreview}
              onResetFilters={resetFilters}
              onShuffle={handleShuffle}
              isFiltered={
                selectedCategory !== "All" ||
                selectedOrientation !== "all" ||
                Boolean(searchQuery.trim())
              }
            />
          </div>
        </section>
      </main>

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

      <WallpaperQuickViewModal
        wallpaper={activePreview}
        onClose={() => setActivePreview(null)}
      />
    </div>
  );
}
