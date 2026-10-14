"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconArrowDown,
  IconEye,
  IconDownload,
  IconSparkles,
  IconLock,
  IconDeviceMobile,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/Button";
import { Wallpaper } from "@/types/wallpaper";

interface HeroSlide {
  wallpaper: Wallpaper;
  word: string;
  tagline: string;
}

interface HeroSectionProps {
  wallpapers: Wallpaper[];
  onPreview: (wp: Wallpaper) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  wallpapers,
  onPreview,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const heroSlides: HeroSlide[] = [
    {
      wallpaper: wallpapers[0] || {
        id: "wp-01",
        title: "Serene Terracotta Fold",
        category: "Warm Neutrals",
        imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2560&q=90",
        resolution: "3840 × 2160",
        dominantColor: "#D6C7B2",
      } as Wallpaper,
      word: "better.",
      tagline: "Quiet paper folds & warm neutral shadows.",
    },
    {
      wallpaper: wallpapers[1] || {
        id: "wp-02",
        title: "Moss & Limestone",
        category: "Forest & Earth",
        imageUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=2560&q=90",
        resolution: "5120 × 2880",
        dominantColor: "#3F4F3D",
      } as Wallpaper,
      word: "calm.",
      tagline: "Natural mineral earth & soothing botanicals.",
    },
    {
      wallpaper: wallpapers[2] || {
        id: "wp-03",
        title: "Chroma Silence",
        category: "Soft Gradients",
        imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=2560&q=90",
        resolution: "3840 × 2160",
        dominantColor: "#8D9B91",
      } as Wallpaper,
      word: "depth.",
      tagline: "Muted chromatic diffusions for focused desks.",
    },
  ];

  // Auto-fading timer every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroSlides.length);
    }, 4800);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const active = heroSlides[activeIndex];

  return (
    <section className="relative w-full border-b border-border overflow-hidden bg-background py-10 lg:py-16">
      {/* 1. Auto-Fading Ambient Background Image with Warm Overlay */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.wallpaper.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.16, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={active.wallpaper.thumbnailUrl || active.wallpaper.imageUrl}
              alt=""
              fill
              sizes="100vw"
              className="object-cover filter blur-[2px]"
              priority
            />
          </motion.div>
        </AnimatePresence>
        {/* Soft paper texture wash to keep contrast 100% compliant */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Dynamic Typography with Changing Word */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            {/* Editorial Eyebrow & Slide Selector */}
            <div className="flex items-center gap-3 mb-5">
              <span className="h-2 w-2 bg-primary shrink-0 animate-pulse" />
              <span className="font-mono text-xs font-semibold text-primary uppercase tracking-widest">
                A fresh look, every day.
              </span>
              <span className="text-border">|</span>
              {/* Quick Jump Buttons */}
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                {heroSlides.map((slide, idx) => (
                  <button
                    key={slide.wallpaper.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`h-6 px-2 border transition-all cursor-pointer ${
                      activeIndex === idx
                        ? "bg-primary text-primary-foreground border-primary font-bold"
                        : "bg-surface/80 border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    0{idx + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Headline with One Word Changing Auto-Fading */}
            <h1 className="font-sans text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground leading-[1.06]">
              Your screen deserves{" "}
              <span className="inline-block relative">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={active.word}
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -24, opacity: 0 }}
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

            {/* Active Drop Info */}
            <div className="flex items-center gap-2 mt-4 text-xs font-mono text-muted-foreground">
              <span className="text-foreground font-medium uppercase">{active.wallpaper.title}</span>
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

          {/* Right Column: Desktop Wallpaper Showcase + Synchronized Phone Crop & Zoom */}
          <div className="lg:col-span-6 relative">
            <div className="relative">
              {/* 1. Desktop Wallpaper Frame */}
              <div className="border border-border bg-surface p-2 sm:p-2.5 shadow-sm">
                <div
                  onClick={() => onPreview(active.wallpaper)}
                  className="relative aspect-[16/10] w-full overflow-hidden bg-muted/40 group cursor-pointer"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active.wallpaper.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={active.wallpaper.imageUrl}
                        alt={active.wallpaper.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Top Desktop Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
                    <span className="bg-primary text-primary-foreground font-mono text-[10px] tracking-widest px-2 py-0.5 uppercase border border-primary pointer-events-auto">
                      DESKTOP 4K
                    </span>
                    <span className="bg-surface/90 text-foreground font-mono text-[10px] px-2 py-0.5 border border-border backdrop-blur-xs pointer-events-auto">
                      {active.wallpaper.resolution}
                    </span>
                  </div>

                  {/* Bottom Action bar */}
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex items-end justify-between text-white">
                    <div>
                      <span className="font-mono text-[10px] text-white/70 uppercase tracking-widest">
                        {active.wallpaper.category}
                      </span>
                      <h3 className="font-sans text-base font-semibold mt-0.5">
                        {active.wallpaper.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPreview(active.wallpaper);
                        }}
                        className="bg-white/95 text-foreground hover:bg-white text-xs border-0 h-8 px-2.5"
                      >
                        <IconEye size={13} />
                        <span>Inspect</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="primary"
                        className="text-xs h-8 px-3"
                        href={active.wallpaper.imageUrl}
                        target="_blank"
                        rel="noreferrer"
                        download={`${active.wallpaper.slug}-desktop-4k.png`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <IconDownload size={13} />
                        <span>Get 4K</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Sleek Phone Wallpaper Frame (Cropped & Zoomed to show Mobile lockscreen) */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                onClick={() => onPreview(active.wallpaper)}
                className="absolute -bottom-4 right-0 sm:-right-6 w-32 sm:w-44 aspect-[9/19.5] rounded-[22px] sm:rounded-[24px] border-[4px] sm:border-[5px] border-foreground/80 bg-black shadow-2xl overflow-hidden cursor-pointer group z-20"
                title="Click to view lockscreen preview"
              >
                {/* Dynamic Zoomed & Cropped Wallpaper Image */}
                <div className="relative w-full h-full overflow-hidden">
                  {/* Protective Layer */}
                  <div
                    className="absolute inset-0 z-10 select-none cursor-pointer"
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                  />

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active.wallpaper.id}
                      initial={{ opacity: 0, scale: 1.15 }}
                      animate={{ opacity: 1, scale: 1.05 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={active.wallpaper.phoneImageUrl || active.wallpaper.imageUrl}
                        alt="Mobile Wallpaper Crop"
                        fill
                        sizes="200px"
                        className="object-cover protected-image select-none pointer-events-none"
                        draggable={false}
                      />
                    </motion.div>
                  </AnimatePresence>

                  {/* Phone Notch/Island Hint */}
                  <div className="absolute top-2 inset-x-0 flex justify-center z-30 pointer-events-none">
                    <div className="h-3.5 w-16 bg-black/90 rounded-full" />
                  </div>

                  {/* Lock Screen Clock & Minimalist UI */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 p-3 flex flex-col justify-between text-white pointer-events-none select-none">
                    <div className="pt-6 flex flex-col items-center">
                      <IconLock size={12} className="text-white/80 mb-1" />
                      <span className="font-mono text-2xl font-light tracking-tight drop-shadow-md">
                        09:41
                      </span>
                      <span className="font-sans text-[10px] text-white/90 drop-shadow-sm font-medium">
                        Wednesday, Oct 14
                      </span>
                    </div>

                    <div className="pb-2 flex flex-col items-center gap-1">
                      <span className="bg-black/60 backdrop-blur-xs text-[9px] font-mono tracking-wider px-2 py-0.5 rounded-full border border-white/20 uppercase flex items-center gap-1">
                        <IconDeviceMobile size={10} />
                        MOBILE CROP
                      </span>
                      <div className="h-1 w-10 bg-white/70 rounded-full mt-1" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
