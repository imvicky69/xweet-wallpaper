"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconArrowDown,
  IconSparkles,
  IconLock,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/Button";
import { Wallpaper } from "@/types/wallpaper";
import { getCdnImageUrl } from "@/lib/wallpapers";

interface HeroSlide {
  wallpaper: Wallpaper;
  word: string;
  tagline: string;
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

  // Curated hero slides pulling from real wallpapers
  const heroSlides: HeroSlide[] = useMemo(() => {
    const curatedList = wallpapers.slice(0, 4);
    const editorialMeta = [
      { word: "depth.", tagline: "Flowing midnight forms meet a delicate amber glow." },
      { word: "calm.", tagline: "Tactile architectural paper and serene cream textures." },
      { word: "clarity.", tagline: "Muted aquatic chromatic diffusions for focused desks." },
      { word: "focus.", tagline: "Dreamy violet gradients meeting soft twilight shadows." },
    ];

    if (curatedList.length === 0) {
      return [
        {
          wallpaper: {
            id: "wp-01",
            slug: "midnight-amber",
            title: "Midnight Amber",
            category: "Dark Abstract",
            imageUrl: "https://cdn.xweet.in/wallpapers/midnight-amber.png",
            thumbnailUrl: "https://cdn.xweet.in/wallpapers/thumbnails/midnight-amber.webp",
            phoneImageUrl: "https://cdn.xweet.in/wallpapers/phone/midnight-amber.png",
            resolution: "2752 × 1536",
            dominantColor: "#111B2A",
          } as Wallpaper,
          word: "depth.",
          tagline: "Flowing midnight forms meet a delicate amber glow.",
        },
      ];
    }

    return curatedList.map((wp, idx) => ({
      wallpaper: wp,
      word: editorialMeta[idx % editorialMeta.length].word,
      tagline: wp.description || editorialMeta[idx % editorialMeta.length].tagline,
    }));
  }, [wallpapers]);

  // Preload all slide images to prevent any frame drops or white flicker
  useEffect(() => {
    if (typeof window === "undefined") return;
    heroSlides.forEach((slide) => {
      const desktopImg = new window.Image();
      desktopImg.src = getCdnImageUrl(slide.wallpaper.imageUrl);
      const phoneImg = new window.Image();
      phoneImg.src = getCdnImageUrl(
        slide.wallpaper.phoneImageUrl || slide.wallpaper.imageUrl
      );
    });
  }, [heroSlides]);

  // Auto-advance timer (pauses when user hovers over the laptop/phone mockup)
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setActiveIndex((curr) => (curr + 1) % heroSlides.length);
    }, SLIDE_DURATION_MS);
    return () => clearInterval(timer);
  }, [isHovered, heroSlides.length]);

  const active = heroSlides[activeIndex] || heroSlides[0];

  return (
    <section className="relative w-full border-b border-border overflow-hidden bg-background py-10 lg:py-16">
      {/* 1. Soft Ambient Background Glow that transitions with current wallpaper */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <AnimatePresence>
          <motion.div
            key={active.wallpaper.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.12 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={getCdnImageUrl(
                active.wallpaper.thumbnailUrl || active.wallpaper.imageUrl
              )}
              alt=""
              fill
              sizes="100vw"
              className="object-cover filter blur-[3px]"
              priority
            />
          </motion.div>
        </AnimatePresence>
        {/* Editorial Paper Gradient Wash */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Dynamic Editorial Typography & Controls */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Headline with Synchronized Animated Word */}
            <h1 className="font-sans text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground leading-[1.06]">
              Your screen deserves{" "}
              <span className="inline-block relative">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={active.word}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    className="text-primary italic inline-block underline decoration-secondary decoration-4 underline-offset-4"
                  >
                    {active.word}
                  </motion.span>
                </AnimatePresence>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="font-sans text-base sm:text-lg text-muted-foreground mt-5 max-w-xl leading-relaxed">
              Thoughtfully crafted wallpapers for everyday displays. Focused on quiet tactile textures,
              natural earth pigments, and editorial restraint.
            </p>

            {/* Current Spotlight Info */}
            <div className="flex items-center gap-2 mt-4 text-xs font-mono text-muted-foreground">
              <span className="text-foreground font-semibold uppercase">{active.wallpaper.title}</span>
              <span>—</span>
              <span className="truncate">{active.tagline}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-7">
              <Button href="#wallpapers" size="md" variant="primary">
                <span>Explore wallpapers</span>
                <IconArrowDown size={16} />
              </Button>

              <Button
                size="md"
                variant="secondary"
                onClick={() => onPreview(active.wallpaper)}
              >
                <IconSparkles size={16} />
                <span>Inspect spotlight</span>
              </Button>
            </div>
          </div>

          {/* Right Column: Pure Laptop & Phone Viewed Wallpaper Mockup (No clutter, No extra elements) */}
          <div
            className="lg:col-span-6 relative flex items-center justify-center py-4"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Ambient Base Shadow */}
            <div className="absolute bottom-2 inset-x-8 h-8 bg-black/25 blur-2xl rounded-full pointer-events-none" />

            {/* Laptop Mockup Wrapper */}
            <div
              onClick={() => onPreview(active.wallpaper)}
              className="relative w-full max-w-[520px] transition-transform duration-300 hover:scale-[1.015] cursor-pointer group select-none"
              title="Click to inspect wallpaper"
            >
              {/* Laptop Screen Lid */}
              <div className="relative rounded-t-[14px] sm:rounded-t-[18px] bg-[#1a1a1e] p-[7px] sm:p-[9px] pb-0 border border-neutral-700/60 shadow-[0_20px_50px_rgba(0,0,0,0.45)]">
                {/* Camera Notch Dot */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-neutral-900 border border-neutral-700/80 z-20 pointer-events-none" />

                {/* Display Glass (16:10 Laptop Screen) */}
                <div className="relative aspect-[16/10] w-full rounded-t-[6px] sm:rounded-t-[8px] overflow-hidden bg-black shadow-inner">
                  {/* Protective Layer */}
                  <div
                    className="absolute inset-0 z-10 select-none cursor-pointer"
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                  />

                  {/* Synchronized 4K Master Wallpaper */}
                  <AnimatePresence>
                    <motion.div
                      key={active.wallpaper.id}
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={getCdnImageUrl(active.wallpaper.imageUrl)}
                        alt={active.wallpaper.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        quality={92}
                        priority
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Subtle Screen Glare Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Laptop Lower Base / Keyboard Deck */}
              <div className="relative -mt-[1px] h-[11px] sm:h-[15px] w-[104%] -left-[2%] bg-gradient-to-b from-[#2e2e34] via-[#1c1c20] to-[#101013] rounded-b-[10px] sm:rounded-b-[14px] border-t border-neutral-600/60 shadow-[0_20px_35px_rgba(0,0,0,0.4)] flex justify-center">
                {/* Trackpad Thumb Notch */}
                <div className="w-14 sm:w-20 h-1 sm:h-1.5 bg-neutral-800/90 rounded-b-md" />
              </div>

              {/* Phone Mockup (Standing Elegantly Overlapping on the Right) */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview(active.wallpaper);
                }}
                className="absolute -bottom-4 sm:-bottom-6 right-2 sm:right-0 w-[110px] sm:w-[145px] md:w-[155px] aspect-[9/19.5] rounded-[24px] sm:rounded-[28px] border-[4px] sm:border-[5px] border-[#18181b] bg-black shadow-[0_25px_60px_rgba(0,0,0,0.7)] overflow-hidden ring-1 ring-white/10 z-20 transition-transform duration-300 hover:scale-[1.03] cursor-pointer"
                title="Click to view lockscreen preview"
              >
                {/* Protective Layer */}
                <div
                  className="absolute inset-0 z-10 select-none cursor-pointer"
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                />

                {/* Synchronized Phone Crop */}
                <AnimatePresence>
                  <motion.div
                    key={active.wallpaper.id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={getCdnImageUrl(
                        active.wallpaper.phoneImageUrl || active.wallpaper.imageUrl
                      )}
                      alt={`${active.wallpaper.title} Phone Lockscreen Crop`}
                      fill
                      sizes="200px"
                      quality={92}
                      priority
                      className="object-cover select-none pointer-events-none"
                      draggable={false}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* iPhone Dynamic Island */}
                <div className="absolute top-2 inset-x-0 flex justify-center z-30 pointer-events-none">
                  <div className="h-3 w-12 sm:w-14 bg-black rounded-full shadow-xs" />
                </div>

                {/* Minimalist Lock Screen Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/60 p-2 sm:p-2.5 flex flex-col justify-between text-white pointer-events-none select-none">
                  <div className="pt-4 sm:pt-5 flex flex-col items-center">
                    <IconLock size={10} className="text-white/80 mb-0.5" />
                    <span className="font-mono text-lg sm:text-xl font-light tracking-tight drop-shadow-md">
                      09:41
                    </span>
                    <span className="font-sans text-[8px] sm:text-[9px] text-white/90 drop-shadow-sm font-medium">
                      Wednesday, Oct 14
                    </span>
                  </div>

                  <div className="pb-1 sm:pb-1.5 flex justify-center">
                    <div className="h-1 w-9 bg-white/80 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
