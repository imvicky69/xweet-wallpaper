"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IconDownload,
  IconEye,
  IconBookmark,
  IconCheck,
  IconDeviceMobile,
  IconShieldCheck,
  IconShare,
} from "@tabler/icons-react";
import { Wallpaper } from "@/types/wallpaper";

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
  const [shareCopied, setShareCopied] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDownloaded(true);
    if (onDownload) {
      onDownload(wallpaper);
    } else {
      // Direct high quality desktop download trigger
      const link = document.createElement("a");
      link.href = wallpaper.imageUrl;
      link.download = `${wallpaper.slug}-desktop-4k.png`;
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

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/wallpaper/${wallpaper.slug}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: `${wallpaper.title} Wallpaper — Xweet`,
          text: wallpaper.description,
          url: shareUrl,
        })
        .catch(() => {});
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    }
  };

  const isPortrait = wallpaper.aspectRatio === "9:16";
  const author = wallpaper.author || {
    id: "xweet",
    username: "xweet",
    displayName: "Vicky",
    photoURL: "/logo.png",
    isVerified: true,
  };
  const isXweetAuthor = author.username?.toLowerCase() === "xweet" || author.isVerified;
  const hasPhoneCompanion = wallpaper.hasPhoneCrop || Boolean(wallpaper.phoneImageUrl);

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
        {/* PROTECTIVE LAYER ON IMAGE: Prevents direct right-click or drag-saving */}
        <div
          className="absolute inset-0 z-10 select-none cursor-pointer"
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          style={{
            WebkitTouchCallout: "none",
            WebkitUserSelect: "none",
            userSelect: "none",
          }}
        />

        <Image
          src={wallpaper.thumbnailUrl || wallpaper.imageUrl}
          alt={wallpaper.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02] protected-image pointer-events-none select-none"
          draggable={false}
        />

        {/* Top Floating Badge Bar */}
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 pointer-events-auto">
            {wallpaper.isNew && (
              <span className="bg-primary text-primary-foreground font-mono text-[10px] tracking-widest px-2 py-0.5 uppercase border border-primary">
                NEW
              </span>
            )}
            {hasPhoneCompanion && (
              <span
                title="Includes Phone Lockscreen Crop"
                className="bg-surface/95 text-primary font-mono text-[9px] tracking-wider px-1.5 py-0.5 border border-border flex items-center gap-1 backdrop-blur-xs font-semibold"
              >
                <IconDeviceMobile size={11} />
                <span>+PHONE</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 pointer-events-auto">
            {/* Share Button */}
            <button
              onClick={handleShare}
              aria-label="Share wallpaper"
              title={shareCopied ? "Link Copied!" : "Share wallpaper"}
              className={`flex h-8 w-8 items-center justify-center border transition-colors ${
                shareCopied
                  ? "bg-emerald-600 border-emerald-600 text-white"
                  : "bg-surface/90 border-border text-foreground hover:text-primary hover:border-primary backdrop-blur-xs"
              }`}
            >
              {shareCopied ? <IconCheck size={14} /> : <IconShare size={14} />}
            </button>

            {/* Bookmark Button */}
            <button
              onClick={handleBookmark}
              aria-label="Save to favorites"
              className={`flex h-8 w-8 items-center justify-center border transition-colors ${
                bookmarked
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-surface/90 border-border text-foreground hover:text-primary hover:border-primary backdrop-blur-xs"
              }`}
            >
              <IconBookmark size={15} className={bookmarked ? "fill-current" : ""} />
            </button>
          </div>
        </div>

        {/* Hover Action Overlay (Desktop) */}
        <div className="absolute inset-0 z-20 bg-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3 p-4 pointer-events-none">
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
            <Link
              href={`/wallpaper/${wallpaper.slug}`}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-sans text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
                {wallpaper.title}
              </h3>
            </Link>
            <span className="font-sans text-xs text-muted-foreground mt-0.5">
              {wallpaper.category}
            </span>
          </div>

          <span className="font-mono text-[11px] text-muted-foreground shrink-0 border border-border/80 px-1.5 py-0.5 bg-background">
            {wallpaper.resolution}
          </span>
        </div>

        {/* Bottom Author Attribution & Palette Strip */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-border/50 text-[11px] font-mono text-muted-foreground">
          {/* Author Name Link with X logo pfp */}
          <Link
            href={`/${author.username || "xweet"}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 hover:text-primary transition-colors"
          >
            <div className="relative h-4 w-4 rounded-full overflow-hidden bg-white border border-border/80 flex items-center justify-center shrink-0">
              <Image
                src="/logo.png"
                alt={author.displayName || "Vicky"}
                width={16}
                height={16}
                className="object-contain p-0.5"
              />
            </div>
            <span className="font-semibold text-foreground hover:text-primary">
              @{author.username || "xweet"}
            </span>
            {isXweetAuthor && (
              <span title="Xweet Verified Curator" className="text-primary">
                <IconShieldCheck size={13} />
              </span>
            )}
          </Link>

          {/* Color Indicator */}
          <div className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-none border border-border shrink-0"
              style={{ backgroundColor: wallpaper.dominantColor }}
              title={`Color: ${wallpaper.dominantColor}`}
            />
            <span className="text-[10px] text-muted-foreground/80 tracking-wider">
              {wallpaper.aspectRatio}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
