import React from "react";
import Link from "next/link";
import Image from "next/image";
import { IconArrowUpRight, IconShieldCheck, IconPhoto } from "@tabler/icons-react";

export const SiteFooter: React.FC = () => {
  return (
    <footer className="w-full border-t border-border bg-background transition-colors mt-20">
      {/* Upper Editorial Strip */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          {/* Brand & Editorial Mission */}
          <div className="md:col-span-5 flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border/80 bg-white shadow-xs">
                <Image
                  src="/logo.png"
                  alt="Xweet Wallpapers"
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-lg font-semibold tracking-tight text-foreground">
                  Xweet <span className="font-light text-muted-foreground">Wallpapers</span>
                </span>
                <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
                  Curated Artwork Catalog
                </span>
              </div>
            </div>

            <p className="font-sans text-sm text-muted-foreground leading-relaxed max-w-md">
              A curated wallpaper discovery platform focused on abstract textures, calm gradients,
              organic forms, and desktop minimalism. Designed with warm cream canvases and crisp
              editorial geometry.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 border border-border bg-surface px-2.5 py-1 text-[11px] font-mono text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                CATALOG V1.0 ACTIVE
              </span>
              <span className="inline-flex items-center gap-1.5 border border-border bg-surface px-2.5 py-1 text-[11px] font-mono text-muted-foreground">
                <IconShieldCheck size={13} className="text-primary" />
                HIGH RESOLUTION
              </span>
            </div>
          </div>

          {/* Quick Links Column 1: Curations */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
              Collections
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-muted-foreground font-sans">
              <li>
                <Link href="/#collections" className="hover:text-primary transition-colors inline-flex items-center gap-1">
                  Warm Neutrals
                </Link>
              </li>
              <li>
                <Link href="/#collections" className="hover:text-primary transition-colors inline-flex items-center gap-1">
                  Abstract Textures
                </Link>
              </li>
              <li>
                <Link href="/#collections" className="hover:text-primary transition-colors inline-flex items-center gap-1">
                  Soft Gradients
                </Link>
              </li>
              <li>
                <Link href="/#collections" className="hover:text-primary transition-colors inline-flex items-center gap-1">
                  Forest & Earth
                </Link>
              </li>
              <li>
                <Link href="/#collections" className="hover:text-primary transition-colors inline-flex items-center gap-1">
                  Dark & Moody
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links Column 2: Platform */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
              Platform
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-muted-foreground font-sans">
              <li>
                <Link href="/#wallpapers" className="hover:text-primary transition-colors">
                  Explore All
                </Link>
              </li>
              <li>
                <Link href="/#featured" className="hover:text-primary transition-colors">
                  Weekly Spotlight
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-primary transition-colors">
                  Philosophy
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/tabler/tabler-icons"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors inline-flex items-center gap-1"
                >
                  Tabler Icons <IconArrowUpRight size={12} />
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links Column 3: Standards */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
              Display Specs
            </h4>
            <div className="flex flex-col gap-2 font-mono text-[11px] text-muted-foreground">
              <span className="border border-border/80 bg-surface px-2 py-1">4K UHD (3840×2160)</span>
              <span className="border border-border/80 bg-surface px-2 py-1">5K Studio (5120×2880)</span>
              <span className="border border-border/80 bg-surface px-2 py-1">Mobile 19.5:9 HDR</span>
              <span className="border border-border/80 bg-surface px-2 py-1">Lossless WebP/PNG</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hairline Bottom Strip */}
      <div className="border-t border-border bg-surface/50">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 px-6 py-6 lg:px-12 text-xs font-mono text-muted-foreground">
          <p>© 2026 XWEET WALLPAPERS. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <span>WARM MINIMALISM</span>
            <span>•</span>
            <span>GEIST TYPOGRAPHY</span>
            <span>•</span>
            <span className="text-primary font-medium">DESIGNED FOR SCREENS</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
