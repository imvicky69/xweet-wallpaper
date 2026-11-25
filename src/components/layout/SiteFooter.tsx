"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IconArrowUp } from "@tabler/icons-react";

export const SiteFooter: React.FC = () => {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full border-t border-border bg-background text-foreground transition-colors mt-20 relative overflow-hidden">
      {/* 1. Top Editorial Manifesto Strip */}
      <div className="border-b border-border bg-surface/60">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="font-mono text-xs uppercase tracking-widest text-primary font-semibold flex items-center gap-2 mb-3">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span>Curated Wallpaper Publication</span>
              </span>
              <h2 className="font-sans text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground leading-tight">
                Crafted for minds that prefer quiet screens.
              </h2>
              <p className="font-sans text-xs sm:text-sm text-muted-foreground mt-2.5 max-w-xl leading-relaxed">
                Uncompressed 4K & 5K master backgrounds, tactile abstract textures, and synchronized mobile editions. Free from visual noise and artificial clutter.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-2 h-10 px-5 bg-background text-foreground font-mono text-xs font-medium border border-border hover:border-primary hover:text-primary transition-all cursor-pointer rounded-none active:scale-[0.98]"
              >
                <span>BACK TO TOP</span>
                <IconArrowUp size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Massive Minimalist Architectural Sign-off */}
      <div className="w-full overflow-hidden select-none pointer-events-none -my-4 sm:-my-6 flex justify-center">
        <span className="font-sans text-[18vw] sm:text-[16vw] font-bold tracking-tighter text-foreground/[0.04] leading-none whitespace-nowrap uppercase">
          XWEET
        </span>
      </div>

      {/* 4. Bottom Hairline Strip */}
      <div className="border-t border-border bg-surface/80 relative z-10">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5 lg:px-12 text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <div className="relative h-5 w-5 rounded-full overflow-hidden bg-white border border-border/80 flex items-center justify-center shrink-0">
              <Image
                src="/logo.png"
                alt="Xweet Logo"
                fill
                sizes="20px"
                className="object-contain p-0.5"
              />
            </div>
            <span className="font-semibold text-foreground tracking-wide">
              XWEET WALLPAPERS
            </span>
            <span className="text-border">•</span>
            <span>© 2026</span>
            <span className="hidden md:inline text-border">•</span>
            <span className="hidden md:inline">WARM MINIMALISM</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span>A XWEET APP</span>
            <span className="text-border">•</span>
            <a
              href="https://xweet.in"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-semibold hover:underline"
            >
              xweet.in
            </a>
            <span className="text-border">•</span>
            <Link
              href="/xweet"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              @xweet
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
