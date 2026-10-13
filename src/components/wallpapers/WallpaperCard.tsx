"use client";

import React, { useState } from "react";
import Image from "next/image";
import { IconDownload, IconEye, IconBookmark, IconCheck } from "@tabler/icons-react";
import { Wallpaper } from "@/types/wallpaper";
import { Badge } from "@/components/ui/Badge";

interface WallpaperCardProps {
  wallpaper: Wallpaper;
  onPreview?: (wallpaper: Wallpaper) => void;
  onDownload?: (wallpaper: Wallpaper) => void;
}

export const WallpaperCard: React.FC<WallpaperCardProps> = ({
  wallpaper,
  onPreview,
  onDownload,
}) => {
  const [bookmarked, setBookmarked] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDownloaded(true);
    if (onDownload) {
      onDownload(wallpaper);
    } else {
      // Direct high quality download trigger
      const link = document.createElement("a");
      link.href = wallpaper.imageUrl;
      link.download = `${wallpaper.slug}.jpg`;
      link.target = "_blank";
      link.rel = "noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    setTimeout(() => setIsDownloaded(false), 2200);
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarked(!bookmarked);
  };

  const isPortrait = wallpaper.aspectRatio === "9:16";

  return (
    <article
      onClick={() => onPreview && onPreview(wallpaper)}
      className="group relative flex flex-col border border-border bg-surface rounded-none overflow-hidden cursor-pointer transition-all duration-200 hover:border-primary/70"
    >
      {/* Artwork Frame */}
      <div
        className={`relative w-full overflow-hidden bg-muted/30 ${
          isPortrait ? "aspect-[9/16]" : "aspect-[16/10]"
        }`}
      >
        <Image
          src={wallpaper.imageUrl}
          alt={wallpaper.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />

        {/* Top Floating Badge Bar */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {wallpaper.isNew && (
              <span className="bg-primary text-primary-foreground font-mono text-[10px] tracking-widest px-2 py-0.5 uppercase border border-primary">
                NEW DROP
              </span>
            )}
            <span className="bg-surface/90 text-foreground font-mono text-[10px] tracking-wider px-2 py-0.5 border border-border backdrop-blur-xs">
              {wallpaper.orientation.toUpperCase()}
            </span>
          </div>

          <button
            onClick={handleBookmark}
            aria-label="Save to favorites"
            className={`pointer-events-auto flex h-8 w-8 items-center justify-center border transition-colors ${
              bookmarked
                ? "bg-primary border-primary text-primary-foreground"
                : "bg-surface/90 border-border text-foreground hover:text-primary hover:border-primary backdrop-blur-xs"
            }`}
          >
            <IconBookmark size={15} className={bookmarked ? "fill-current" : ""} />
          </button>
        </div>

        {/* Hover Action Overlay (Desktop) */}
        <div className="absolute inset-0 bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 p-4 pointer-events-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPreview && onPreview(wallpaper);
            }}
            className="pointer-events-auto flex items-center gap-2 h-10 px-4 bg-surface text-foreground font-sans text-xs font-medium border border-border hover:border-primary hover:text-primary transition-colors cursor-pointer shadow-xs"
          >
            <IconEye size={15} />
            <span>Quick View</span>
          </button>

          <button
            onClick={handleDownload}
            className="pointer-events-auto flex items-center gap-2 h-10 px-4 bg-primary text-primary-foreground font-sans text-xs font-medium border border-primary hover:bg-primary-hover transition-colors cursor-pointer shadow-xs"
          >
            {isDownloaded ? (
              <>
                <IconCheck size={15} />
                <span>Downloaded</span>
              </>
            ) : (
              <>
                <IconDownload size={15} />
                <span>Download</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Card Content Information */}
      <div className="flex flex-col p-4 border-t border-border bg-surface">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col">
            <h3 className="font-sans text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {wallpaper.title}
            </h3>
            <span className="font-sans text-xs text-muted-foreground mt-0.5">
              {wallpaper.category}
            </span>
          </div>

          <span className="font-mono text-[11px] text-muted-foreground shrink-0 border border-border/80 px-1.5 py-0.5 bg-background">
            {wallpaper.resolution}
          </span>
        </div>

        {/* Bottom Tag / Palette Strip */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-border/50 text-[11px] font-mono text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-none border border-border shrink-0"
              style={{ backgroundColor: wallpaper.dominantColor }}
              title={`Color: ${wallpaper.dominantColor}`}
            />
            <span className="truncate max-w-[140px] uppercase text-[10px]">
              {wallpaper.tags[0] || "Curated"}
            </span>
          </div>

          <span className="text-[10px] text-muted-foreground/80 tracking-wider">
            {wallpaper.aspectRatio}
          </span>
        </div>
      </div>
    </article>
  );
};
