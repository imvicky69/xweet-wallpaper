"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconArrowDown,
  IconEye,
  IconDownload,
  IconSparkles,
  IconLock,
  IconDeviceMobile,
  IconDeviceDesktop,
  IconChevronLeft,
  IconChevronRight,
  IconPlayerPause,
  IconPlayerPlay,
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
const PROGRESS_TICK_MS = 50;

export const HeroSection: React.FC<HeroSectionProps> = ({
  wallpapers,
  onPreview,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);

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

  const handleSelectSlide = useCallback(
    (idx: number) => {
      setActiveIndex(idx);
      setProgress(0);
    },
    []
  );

  const handleNextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % heroSlides.length);
    setProgress(0);
  }, [heroSlides.length]);

  const handlePrevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setProgress(0);
  }, [heroSlides.length]);

  // Smooth progress bar and auto-advance timer
  useEffect(() => {
    if (isPaused || isHovered) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveIndex((curr) => (curr + 1) % heroSlides.length);
          return 0;
        }
        return prev + (PROGRESS_TICK_MS / SLIDE_DURATION_MS) * 100;
      });
    }, PROGRESS_TICK_MS);

    return () => clearInterval(timer);
  }, [isPaused, isHovered, heroSlides.length]);

  const active = heroSlides[activeIndex] || heroSlides[0];

  return (
    <section className="relative w-full border-b border-border overflow-hidden bg-background py-10 lg:py-16">
      {/* 1. Soft Ambient Background Glow that transitions with current wallpaper */}
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
            
            {/* Slide Controller Bar with Animated Progress Indicators */}
            <div className="flex items-center gap-2.5 mb-5 flex-wrap">
              <span className="h-2 w-2 bg-primary shrink-0 animate-pulse" />
              <span className="font-mono text-xs font-semibold text-primary uppercase tracking-widest">
                Curated Drops
              </span>
              <span className="text-border">|</span>

              {/* Numbered Jump Buttons with Progress Fill */}
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                {heroSlides.map((slide, idx) => (
                  <button
                    key={slide.wallpaper.id}
                    onClick={() => handleSelectSlide(idx)}
                    className={`relative h-6 px-2.5 border transition-all cursor-pointer overflow-hidden ${
                      activeIndex === idx
                        ? "bg-surface text-foreground border-primary font-bold shadow-xs"
                        : "bg-surface/60 border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span className="relative z-10">0{idx + 1}</span>
                    {activeIndex === idx && (
                      <div
                        className="absolute bottom-0 left-0 h-0.5 bg-primary transition-all ease-linear"
                        style={{ width: `${progress}%` }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Pause/Play Toggle Button */}
              <button
                onClick={() => setIsPaused(!isPaused)}
                aria-label={isPaused ? "Resume slideshow" : "Pause slideshow"}
                className="h-6 w-6 flex items-center justify-center border border-border bg-surface text-muted-foreground hover:text-foreground hover:border-primary transition-colors cursor-pointer text-xs ml-1"
                title={isPaused ? "Resume Auto-Slide" : "Pause Auto-Slide"}
              >
                {isPaused ? <IconPlayerPlay size={11} /> : <IconPlayerPause size={11} />}
              </button>
            </div>

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

          {/* Right Column: Harmonious Dual-Device Showcase (Desktop 4K + Synchronized Phone Lockscreen) */}
          <div
            className="lg:col-span-6 relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Gallery Card Frame */}
            <div className="border border-border bg-surface p-3 sm:p-4 shadow-sm transition-all duration-300 hover:border-primary/50">
              
              {/* Header Status Bar with Device Badges and Next/Prev Arrows */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/80">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 font-mono text-[11px] text-foreground font-semibold">
                    <IconDeviceDesktop size={14} className="text-primary" />
                    <span>DESKTOP 4K</span>
                  </span>
                  <span className="text-border">•</span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {active.wallpaper.resolution || "2752 × 1536"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 uppercase tracking-wider font-semibold">
                    <IconDeviceMobile size={11} />
                    <span>Dual Crop Sync</span>
                  </span>

                  {/* Manual Arrow Controls */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handlePrevSlide}
                      aria-label="Previous wallpaper"
                      className="h-6 w-6 flex items-center justify-center border border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary transition-colors cursor-pointer"
                      title="Previous Wallpaper"
                    >
                      <IconChevronLeft size={13} />
                    </button>
                    <button
                      onClick={handleNextSlide}
                      aria-label="Next wallpaper"
                      className="h-6 w-6 flex items-center justify-center border border-border bg-background text-muted-foreground hover:text-foreground hover:border-primary transition-colors cursor-pointer"
                      title="Next Wallpaper"
                    >
                      <IconChevronRight size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Stage: Desktop Canvas + Harmonious Overlapping Phone Lockscreen Frame */}
              <div className="relative pb-6 sm:pb-8">
                
                {/* 1. Desktop 16:10 Canvas */}
                <div
                  onClick={() => onPreview(active.wallpaper)}
                  className="relative aspect-[16/10] w-full overflow-hidden bg-black/60 border border-border group cursor-pointer"
                >
                  {/* Protective Layer */}
                  <div
                    className="absolute inset-0 z-10 select-none cursor-pointer"
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                  />

                  {/* Desktop Image: Pure Synchronized Cross-fade (No mode="wait" gap) */}
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
                        priority
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Category Pill on Desktop Canvas */}
                  <div className="absolute top-3 left-3 z-20 pointer-events-none">
                    <span className="bg-black/70 text-white font-mono text-[10px] tracking-widest px-2 py-0.5 uppercase border border-white/20 backdrop-blur-xs">
                      {active.wallpaper.category}
                    </span>
                  </div>
                </div>

                {/* 2. Synchronized Phone Mockup (Locked in identical transition time) */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview(active.wallpaper);
                  }}
                  className="absolute bottom-0 right-1 sm:-right-3 lg:-right-4 w-32 sm:w-40 lg:w-44 aspect-[9/19.5] rounded-[22px] sm:rounded-[26px] border-[4px] sm:border-[5px] border-neutral-900 bg-black shadow-[0_22px_45px_rgba(0,0,0,0.55)] overflow-hidden cursor-pointer group z-20 transition-transform duration-300 hover:scale-[1.02]"
                  title="Click to view lockscreen preview"
                >
                  {/* Protective Layer */}
                  <div
                    className="absolute inset-0 z-10 select-none cursor-pointer"
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                  />

                  {/* Synchronized Phone Crop: Locks in 1:1 with desktop image */}
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
                        sizes="220px"
                        priority
                        className="object-cover select-none pointer-events-none"
                        draggable={false}
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Realistic iPhone Dynamic Island */}
                  <div className="absolute top-2 inset-x-0 flex justify-center z-30 pointer-events-none">
                    <div className="h-3 w-14 sm:w-16 bg-black rounded-full shadow-xs" />
                  </div>

                  {/* Realistic Minimalist Lock Screen Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/60 p-2.5 sm:p-3 flex flex-col justify-between text-white pointer-events-none select-none">
                    <div className="pt-5 sm:pt-6 flex flex-col items-center">
                      <IconLock size={11} className="text-white/80 mb-0.5" />
                      <span className="font-mono text-xl sm:text-2xl font-light tracking-tight drop-shadow-md">
                        09:41
                      </span>
                      <span className="font-sans text-[9px] sm:text-[10px] text-white/90 drop-shadow-sm font-medium">
                        Wednesday, Oct 14
                      </span>
                    </div>

                    <div className="pb-1 sm:pb-1.5 flex flex-col items-center gap-1">
                      <span className="bg-black/70 backdrop-blur-xs text-[8px] sm:text-[9px] font-mono tracking-wider px-2 py-0.5 rounded-full border border-white/20 uppercase flex items-center gap-1 font-semibold">
                        <IconDeviceMobile size={10} />
                        PHONE CROP
                      </span>
                      <div className="h-1 w-10 bg-white/80 rounded-full mt-0.5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Showcase Metadata & Actions Footer: Placed SAFELY below artwork canvas */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-border mt-1">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-primary uppercase tracking-wider font-semibold">
                      {active.wallpaper.category}
                    </span>
                    <span className="text-border">•</span>
                    <span className="font-sans text-xs text-muted-foreground">
                      Curated by Vicky (@xweet)
                    </span>
                  </div>
                  <h3 className="font-sans text-lg sm:text-xl font-bold text-foreground mt-0.5">
                    {active.wallpaper.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onPreview(active.wallpaper)}
                    className="text-xs h-8 px-3"
                  >
                    <IconEye size={13} />
                    <span>Inspect</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    className="text-xs h-8 px-3.5"
                    href={getCdnImageUrl(active.wallpaper.imageUrl)}
                    target="_blank"
                    rel="noreferrer"
                    download={`${active.wallpaper.slug}-desktop-4k.png`}
                  >
                    <IconDownload size={13} />
                    <span>Get 4K</span>
                  </Button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
