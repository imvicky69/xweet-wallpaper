"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  IconArrowUp,
  IconShieldCheck,
  IconCheck,
  IconCopy,
  IconSparkles,
} from "@tabler/icons-react";

interface PaletteColor {
  hex: string;
  name: string;
}

const BRAND_PALETTE: PaletteColor[] = [
  { hex: "#F6F3E9", name: "Paper Cream" },
  { hex: "#DCE5D5", name: "Soft Sage" },
  { hex: "#858B70", name: "Olive Moss" },
  { hex: "#244B38", name: "Deep Forest" },
  { hex: "#111B2A", name: "Obsidian" },
];

export const SiteFooter: React.FC = () => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopyColor = (hex: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(hex);
      setCopiedHex(hex);
      setTimeout(() => setCopiedHex(null), 2000);
    }
  };

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

      {/* 2. Architectural Multi-Column Grid */}
      <div className="mx-auto max-w-7xl px-6 py-12 lg:py-16 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12">
          {/* Column 1: Catalog Navigation (3 cols) */}
          <div className="col-span-2 md:col-span-3 flex flex-col gap-3.5">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
              Discovery
            </h4>
            <ul className="flex flex-col gap-2 font-sans text-xs sm:text-sm text-muted-foreground">
              <li>
                <Link href="/#wallpapers" className="hover:text-primary transition-colors">
                  All Wallpapers
                </Link>
              </li>
              <li>
                <Link href="/#wallpapers" className="hover:text-primary transition-colors">
                  Exclusive Drops
                </Link>
              </li>
              <li>
                <Link href="/xweet" className="hover:text-primary transition-colors inline-flex items-center gap-1.5">
                  <span>Curator Portfolio</span>
                  <span className="text-[10px] font-mono text-primary bg-secondary/80 px-1 py-0.2 border border-border">
                    @XWEET
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/upload" className="hover:text-primary transition-colors">
                  Upload New Drop
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Curated Styles (3 cols) */}
          <div className="col-span-1 md:col-span-3 flex flex-col gap-3.5">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
              Aesthetics
            </h4>
            <ul className="flex flex-col gap-2 font-sans text-xs sm:text-sm text-muted-foreground">
              <li>
                <Link href="/#wallpapers" className="hover:text-primary transition-colors">
                  Dark Abstract
                </Link>
              </li>
              <li>
                <Link href="/#wallpapers" className="hover:text-primary transition-colors">
                  Warm Minimal
                </Link>
              </li>
              <li>
                <Link href="/#wallpapers" className="hover:text-primary transition-colors">
                  Earthy & Botanical
                </Link>
              </li>
              <li>
                <Link href="/#wallpapers" className="hover:text-primary transition-colors">
                  Soft Gradients
                </Link>
              </li>
              <li>
                <Link href="/#wallpapers" className="hover:text-primary transition-colors">
                  Lockscreen Vertical
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Display Specifications (3 cols) */}
          <div className="col-span-1 md:col-span-3 flex flex-col gap-3.5">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
              Master Standards
            </h4>
            <div className="flex flex-col gap-1.5 font-mono text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5 text-foreground font-medium">
                <IconShieldCheck size={13} className="text-primary shrink-0" />
                <span>Cloudflare R2 Direct CDN</span>
              </span>
              <span>4K UHD (3840 × 2160)</span>
              <span>5K Studio (5120 × 2880)</span>
              <span>19.5:9 Phone Lockscreen</span>
              <span className="text-[10px] text-primary mt-1">100% UNCOMPRESSED MASTERS</span>
            </div>
          </div>

          {/* Column 4: Interactive Palette Strip (3 cols) */}
          <div className="col-span-2 md:col-span-3 flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
                Editorial Palette
              </h4>
              <span className="font-mono text-[10px] text-muted-foreground">
                Click to copy
              </span>
            </div>

            <p className="font-sans text-xs text-muted-foreground leading-relaxed">
              Tailored chromatic tokens grounding every wallpaper frame on this canvas.
            </p>

            {/* Interactive Swatches Bar */}
            <div className="flex items-center gap-1.5 pt-1">
              {BRAND_PALETTE.map((color) => {
                const isCopied = copiedHex === color.hex;
                return (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => handleCopyColor(color.hex)}
                    style={{ backgroundColor: color.hex }}
                    className="group relative h-9 flex-1 border border-border/80 transition-all duration-150 hover:-translate-y-0.5 cursor-pointer rounded-none flex items-center justify-center shadow-xs"
                    title={`${color.name} (${color.hex}) — Click to copy`}
                  >
                    {isCopied && (
                      <span className="bg-foreground text-background p-0.5 rounded-none shadow-md">
                        <IconCheck size={11} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {copiedHex ? (
              <span className="font-mono text-[10px] text-primary flex items-center gap-1 font-semibold animate-pulse">
                <IconCheck size={12} />
                <span>Copied {copiedHex} to clipboard!</span>
              </span>
            ) : (
              <span className="font-mono text-[10px] text-muted-foreground flex items-center gap-1">
                <IconSparkles size={11} className="text-primary" />
                <span>5-Tone Brand System</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Massive Minimalist Architectural Sign-off */}
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

          <div className="flex items-center gap-4 text-[11px]">
            <span>GEIST TYPOGRAPHY</span>
            <span className="text-border">•</span>
            <span>FREE FOR ALL SCREENS</span>
            <span className="text-border">•</span>
            <Link
              href="/xweet"
              className="text-primary font-semibold hover:underline"
            >
              @XWEET
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
