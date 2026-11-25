"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconArrowDown,
  IconBrandGooglePlay,
  IconLock,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/Button";
import { Wallpaper } from "@/types/wallpaper";
import { getCdnImageUrl, getPhoneCropStyle, getPhonePreviewUrl } from "@/lib/wallpapers";

interface HeroSlide {
  wallpaper: Wallpaper;
  word: string;
}

interface HeroSectionProps {
  wallpapers: Wallpaper[];
  onPreview: (wp: Wallpaper) => void;
}

const SLIDE_DURATION_MS = 5500;

export const HeroSection: React.FC<HeroSectionProps> = ({
  wallpapers,
  onPreview,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Only include wallpapers that have BOTH a desktop (non-phone) URL and a phone URL
  const heroSlides: HeroSlide[] = useMemo(() => {
    const dualWallpapers = wallpapers.filter((wp) => {
      const isPortrait =
        wp.orientation === "mobile" ||
        wp.aspectRatio === "9:16" ||
        wp.aspectRatio === "9:19.5";
      const desktopUrl = wp.urls?.desktop || wp.imageUrl || "";
      const phoneUrl = wp.urls?.phone || wp.phoneImageUrl || "";
      const hasBothUrls =
        Boolean(desktopUrl) &&
        Boolean(phoneUrl) &&
        !desktopUrl.includes("/wallpapers/phone/") &&
        desktopUrl !== phoneUrl;
      return !isPortrait && hasBothUrls;
    });

    const featuredFirst = [
      ...dualWallpapers.filter((w) => w.isFeatured),
      ...dualWallpapers.filter((w) => !w.isFeatured),
    ];
    const curatedList = featuredFirst.slice(0, 4);
    const words = ["depth.", "calm.", "clarity.", "focus."];

    if (curatedList.length === 0) {
      return [
        {
          wallpaper: {
            id: "wp-01",
            slug: "midnight-amber",
            title: "Midnight Amber",
            category: "Dark Abstract",
            aspectRatio: "16:9",
            orientation: "desktop",
            imageUrl: "https://cdn.xweet.in/wallpapers/midnight-amber.webp",
            thumbnailUrl: "https://cdn.xweet.in/wallpapers/thumbnails/midnight-amber.webp",
            phoneImageUrl: "https://cdn.xweet.in/wallpapers/phone/midnight-amber.webp",
            urls: {
              desktop: "https://cdn.xweet.in/wallpapers/midnight-amber.webp",
              desktopThumbnail: "https://cdn.xweet.in/wallpapers/thumbnails/midnight-amber.webp",
              phone: "https://cdn.xweet.in/wallpapers/phone/midnight-amber.webp",
              phoneThumbnail: "https://cdn.xweet.in/wallpapers/phone/thumbnails/midnight-amber.webp",
            },
            resolution: "2752 × 1536",
            dominantColor: "#111B2A",
          } as Wallpaper,
          word: "focus.",
        },
      ];
    }

    return curatedList.map((wp, idx) => ({
      wallpaper: wp,
      word: words[idx % words.length],
    }));
  }, [wallpapers]);

  useEffect(() => {
    if (activeIndex >= heroSlides.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, heroSlides.length]);

  // Preload slide images
  useEffect(() => {
    if (typeof window === "undefined") return;
    heroSlides.forEach((slide) => {
      const desktopImg = new window.Image();
      desktopImg.src = getCdnImageUrl(slide.wallpaper.urls?.desktop || slide.wallpaper.imageUrl);
      const phoneImg = new window.Image();
      phoneImg.src = getPhonePreviewUrl(slide.wallpaper);
    });
  }, [heroSlides]);

  useEffect(() => {
    if (isHovered || heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIndex((curr) => (curr + 1) % heroSlides.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [isHovered, heroSlides.length]);

  const active = heroSlides[activeIndex] || heroSlides[0];
  const desktopPreviewSrc = getCdnImageUrl(active.wallpaper.urls?.desktop || active.wallpaper.imageUrl);

  return (
    <section className="relative w-full border-b border-border/60 overflow-hidden bg-background pt-16 pb-6 sm:pt-18 sm:pb-8 lg:pt-20 lg:pb-8">
      {/* Ambient Background Glow flowing seamlessly behind the header */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <AnimatePresence>
          <motion.div
            key={active.wallpaper.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.14 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={getCdnImageUrl(
                active.wallpaper.urls?.desktopThumbnail ||
                  active.wallpaper.thumbnailUrl ||
                  desktopPreviewSrc
              )}
              alt=""
              fill
              sizes="100vw"
              className="object-cover filter blur-[4px]"
              priority
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/92 to-background/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* Left Column: Compact Editorial Headline & Actions */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-[1.08]">
              Your screen deserves{" "}
              <span className="inline-block relative">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={active.word}
                    initial={{ y: 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -14, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="text-primary italic inline-block underline decoration-secondary decoration-3 underline-offset-4"
                  >
                    {active.word}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>

            <p className="font-sans text-sm sm:text-base text-muted-foreground mt-3 max-w-lg leading-relaxed">
              4K desktop masters &amp; cropped phone lockscreens — tactile textures, natural pigments, zero clutter.
            </p>

            <div className="flex flex-wrap items-center gap-2.5 mt-5">
              <Button href="#wallpapers" size="sm" variant="primary" className="h-9 px-4 text-xs">
                <span>Browse catalog</span>
                <IconArrowDown size={14} />
              </Button>

              <Button
                href="https://play.google.com/store/apps/details?id=in.xweet.wallpapers"
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
                variant="secondary"
                className="h-9 px-4 text-xs"
              >
                <IconBrandGooglePlay size={14} />
                <span>Get on Google Play</span>
              </Button>
            </div>
          </div>

          {/* Right Column: Compact Dual-URL Laptop + Phone Preview */}
          <div
            className="lg:col-span-6 relative flex flex-col items-center justify-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              onClick={() => onPreview(active.wallpaper)}
              className="relative w-full max-w-[390px] sm:max-w-[420px] transition-transform duration-300 hover:scale-[1.015] cursor-pointer group select-none"
              title="Click to inspect wallpaper"
            >
              {/* Laptop Lid */}
              <div className="relative rounded-t-[12px] sm:rounded-t-[14px] bg-[#1a1a1e] p-[6px] sm:p-[7px] pb-0 border border-neutral-700/60 shadow-[0_14px_34px_rgba(0,0,0,0.35)]">
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-neutral-900 border border-neutral-700/80 z-20 pointer-events-none" />

                {/* 16:10 Desktop Screen */}
                <div className="relative aspect-[16/10] w-full rounded-t-[5px] sm:rounded-t-[6px] overflow-hidden bg-black">
                  <AnimatePresence>
                    <motion.div
                      key={active.wallpaper.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={desktopPreviewSrc}
                        alt={active.wallpaper.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 440px"
                        quality={92}
                        priority
                        className="object-cover select-none pointer-events-none"
                        draggable={false}
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Laptop Base */}
              <div className="relative -mt-[1px] h-[9px] sm:h-[12px] w-[104%] -left-[2%] bg-gradient-to-b from-[#2e2e34] via-[#1c1c20] to-[#101013] rounded-b-[8px] sm:rounded-b-[10px] border-t border-neutral-600/60 shadow-[0_14px_26px_rgba(0,0,0,0.32)] flex justify-center">
                <div className="w-12 sm:w-16 h-1 bg-neutral-800/90 rounded-b-md" />
              </div>

              {/* Phone Mockup (Using paired phone URL) */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview(active.wallpaper);
                }}
                className="absolute -bottom-3 right-1 sm:right-0 w-[86px] sm:w-[112px] aspect-[9/19.5] rounded-[18px] sm:rounded-[22px] border-[3px] sm:border-[4px] border-[#18181b] bg-black shadow-[0_18px_40px_rgba(0,0,0,0.65)] overflow-hidden ring-1 ring-white/10 z-20 transition-transform duration-300 hover:scale-[1.03] cursor-pointer"
                title="Click to view lockscreen preview"
              >
                <AnimatePresence>
                  <motion.div
                    key={active.wallpaper.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={getPhonePreviewUrl(active.wallpaper)}
                      alt={`${active.wallpaper.title} Phone Lockscreen`}
                      fill
                      sizes="240px"
                      quality={95}
                      priority
                      style={getPhoneCropStyle(active.wallpaper)}
                      className="object-cover select-none pointer-events-none"
                      draggable={false}
                    />
                  </motion.div>
                </AnimatePresence>

                <div className="absolute top-1.5 inset-x-0 flex justify-center z-30 pointer-events-none">
                  <div className="h-2.5 w-10 bg-black rounded-full" />
                </div>

                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/55 p-1.5 sm:p-2 flex flex-col justify-between text-white pointer-events-none select-none">
                  <div className="pt-3.5 flex flex-col items-center">
                    <IconLock size={8} className="text-white/80 mb-0.5" />
                    <span className="font-mono text-sm sm:text-base font-light tracking-tight leading-none">
                      09:41
                    </span>
                    <span className="font-sans text-[7px] text-white/85 mt-0.5">
                      Wed, Oct 14
                    </span>
                  </div>
                  <div className="pb-0.5 flex justify-center">
                    <div className="h-0.5 w-7 bg-white/80 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Caption */}
            <div className="mt-4 flex items-center justify-center gap-2 font-mono text-[11px] text-muted-foreground select-none">
              <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
              <span className="text-foreground font-semibold uppercase tracking-wide truncate max-w-[200px]">
                {active.wallpaper.title}
              </span>
              <span className="text-border">•</span>
              <span className="text-primary uppercase text-[10px] tracking-wider">
                {active.wallpaper.category}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
