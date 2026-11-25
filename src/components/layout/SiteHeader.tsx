"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  IconSearch,
  IconMenu2,
  IconX,
} from "@tabler/icons-react";

interface SiteHeaderProps {
  onSearchClick?: () => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  seamless?: boolean;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({
  onSearchClick,
  searchQuery,
  onSearchChange,
  seamless = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!seamless || typeof window === "undefined") return;
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [seamless]);

  const handleClearSearch = () => {
    if (onSearchChange) {
      onSearchChange("");
    }
  };

  const handleSearchInput = (val: string) => {
    if (onSearchChange) {
      onSearchChange(val);
      if (val.trim() && typeof window !== "undefined") {
        const wallpapersSection = document.getElementById("wallpapers");
        if (wallpapersSection && window.scrollY < 160) {
          wallpapersSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
  };

  const headerPositionClass = seamless
    ? `fixed top-0 left-0 right-0 z-40 w-full transition-all duration-200 ${
        isScrolled || mobileMenuOpen
          ? "border-b border-border bg-background/95 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`
    : "sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md transition-all";

  return (
    <header className={headerPositionClass}>
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-12">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border border-border bg-white shadow-xs">
            <Image
              src="/logo.png"
              alt="Xweet Wallpapers"
              fill
              sizes="28px"
              className="object-contain p-0.5"
              priority
            />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-sans text-sm sm:text-base font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
              Xweet
            </span>
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              WALLPAPERS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-mono uppercase tracking-wider">
          <Link
            href="/#wallpapers"
            className="text-foreground hover:text-primary transition-colors duration-150 py-1 font-semibold"
          >
            All Wallpapers
          </Link>
          <Link
            href="/xweet"
            className="text-muted-foreground hover:text-primary transition-colors duration-150 py-1"
          >
            @xweet
          </Link>
        </nav>

        {/* Right Header Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {onSearchChange !== undefined ? (
            <div className="relative w-48 lg:w-56">
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery || ""}
                onChange={(e) => handleSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    handleClearSearch();
                  }
                }}
                className="h-8 w-full rounded-none border border-border bg-surface/90 pl-8 pr-7 font-sans text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
              />
              <IconSearch
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  title="Clear search (Esc)"
                  aria-label="Clear search"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <IconX size={13} />
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onSearchClick}
              className="flex h-8 items-center gap-2 border border-border bg-surface/90 px-3 text-xs font-mono text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
            >
              <IconSearch size={13} />
              <span>SEARCH</span>
            </button>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          className="flex md:hidden h-8 w-8 items-center justify-center border border-border bg-surface/90 text-foreground hover:border-primary transition-colors"
        >
          {mobileMenuOpen ? <IconX size={17} /> : <IconMenu2 size={17} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 py-4 animate-in slide-in-from-top-2 duration-150 space-y-3">
          {onSearchChange !== undefined && (
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery || ""}
                onChange={(e) => handleSearchInput(e.target.value)}
                className="h-9 w-full rounded-none border border-border bg-surface pl-9 pr-8 font-sans text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
              />
              <IconSearch
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  title="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <IconX size={14} />
                </button>
              )}
            </div>
          )}

          <nav className="flex flex-col gap-2 text-sm font-medium">
            <Link
              href="/#wallpapers"
              onClick={() => setMobileMenuOpen(false)}
              className="text-foreground hover:text-primary py-1.5 border-b border-border/50"
            >
              All Wallpapers
            </Link>
            <Link
              href="/xweet"
              onClick={() => setMobileMenuOpen(false)}
              className="text-muted-foreground hover:text-primary py-1.5"
            >
              Curator Portfolio (@xweet)
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
