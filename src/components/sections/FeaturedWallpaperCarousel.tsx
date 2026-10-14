"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import {
  IconChevronLeft,
  IconChevronRight,
  IconEye,
  IconDownload,
  IconSparkles,
} from "@tabler/icons-react";
import { Wallpaper } from "@/types/wallpaper";
import { getCdnImageUrl } from "@/lib/wallpapers";
import { triggerDirectDownload } from "@/lib/download";
import { Button } from "@/components/ui/Button";

// Import Swiper styles
import "swiper/css";

interface FeaturedWallpaperCarouselProps {
  wallpapers: Wallpaper[];
  onPreview: (wallpaper: Wallpaper) => void;
}

export const FeaturedWallpaperCarousel: React.FC<FeaturedWallpaperCarouselProps> = ({
  wallpapers,
  onPreview,
}) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const featuredList = wallpapers.slice(0, 5);

  return (
    <section id="featured" className="w-full border-b border-border bg-surface py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 pb-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-1.5 font-mono text-xs font-semibold text-primary uppercase tracking-wider">
              <IconSparkles size={15} />
              <span>Spotlight Curation</span>
            </div>
            <h2 className="font-sans text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              A Few Exclusive Drops
            </h2>
            <p className="font-sans text-xs sm:text-sm text-muted-foreground mt-0.5">
              Hand-selected master wallpapers curated for focused screens.
            </p>
          </div>

          {/* Custom Navigation Controls (Square geometry, Geist Mono Counter) */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs text-muted-foreground tracking-widest mr-2">
              <span className="text-foreground font-semibold">0{activeIndex + 1}</span> / 0{featuredList.length}
            </span>
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              aria-label="Previous slide"
              className="flex h-10 w-10 items-center justify-center border border-border bg-background text-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
            >
              <IconChevronLeft size={18} />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              aria-label="Next slide"
              className="flex h-10 w-10 items-center justify-center border border-border bg-background text-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
            >
              <IconChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Carousel Content */}
        <div className="relative">
          {isMounted ? (
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={24}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 1.2 },
                1024: { slidesPerView: 1.5 },
              }}
              loop={true}
              autoplay={{ delay: 5000, disableOnInteraction: true }}
              onBeforeInit={(swiper) => {
                swiperRef.current = swiper;
              }}
              onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
              className="w-full overflow-visible"
            >
              {featuredList.map((wp) => (
                <SwiperSlide key={wp.id}>
                  <div className="group border border-border bg-background p-3 transition-all duration-200 hover:border-primary">
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/30">
                      {/* Protective Layer */}
                      <div
                        className="absolute inset-0 z-10 select-none cursor-pointer"
                        onContextMenu={(e) => e.preventDefault()}
                        onDragStart={(e) => e.preventDefault()}
                      />

                      <Image
                        src={getCdnImageUrl(wp.imageUrl)}
                        alt={wp.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 70vw"
                        quality={90}
                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02] protected-image select-none pointer-events-none"
                        draggable={false}
                      />

                      <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
                        <span className="bg-primary text-primary-foreground font-mono text-[10px] tracking-widest px-2 py-0.5 uppercase border border-primary">
                          {wp.category}
                        </span>
                        <span className="bg-surface/90 text-foreground font-mono text-[10px] px-2 py-0.5 border border-border backdrop-blur-xs">
                          {wp.resolution}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 pb-1 px-1">
                      <div>
                        <h4 className="font-sans text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                          {wp.title}
                        </h4>
                        <p className="font-sans text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          {wp.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => onPreview(wp)}
                          className="text-xs"
                        >
                          <IconEye size={14} />
                          <span className="hidden sm:inline">Inspect</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="primary"
                          className="text-xs"
                          onClick={() =>
                            triggerDirectDownload(
                              getCdnImageUrl(wp.imageUrl),
                              `${wp.slug}-desktop-4k.png`
                            )
                          }
                        >
                          <IconDownload size={14} />
                          <span className="hidden sm:inline">Download</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            /* SSR Static Prerender Frame */
            <div className="border border-border bg-background p-3">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/30">
                <Image
                  src={getCdnImageUrl(featuredList[0].imageUrl)}
                  alt={featuredList[0].title}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
