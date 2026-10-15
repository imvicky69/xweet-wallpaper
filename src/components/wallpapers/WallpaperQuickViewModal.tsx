"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconX,
  IconDownload,
  IconBookmark,
  IconDimensions,
  IconColorSwatch,
  IconCheck,
  IconExternalLink,
  IconDeviceMobile,
  IconDeviceDesktop,
  IconShieldCheck,
  IconShare,
  IconSparkles,
  IconLock,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import { Wallpaper } from "@/types/wallpaper";
import { getCdnImageUrl } from "@/lib/wallpapers";
import { triggerDirectDownload, triggerDynamicDownload } from "@/lib/download";
import { Button } from "@/components/ui/Button";

interface WallpaperQuickViewModalProps {
  wallpaper: Wallpaper | null;
  onClose: () => void;
  onEdit?: (wallpaper: Wallpaper) => void;
  onDelete?: (wallpaper: Wallpaper) => void;
}

export const WallpaperQuickViewModal: React.FC<WallpaperQuickViewModalProps> = ({
  wallpaper,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [previewMode, setPreviewMode] = useState<"desktop" | "phone">("desktop");
  const [shareFeedback, setShareFeedback] = useState(false);
  const [protectionNotice, setProtectionNotice] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (wallpaper) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);

      // If mobile wallpaper, always default to Phone preview!
      const isMobileWp =
        wallpaper.orientation === "mobile" ||
        wallpaper.aspectRatio === "9:19.5" ||
        wallpaper.aspectRatio === "9:16";
      const isMobile =
        window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      const hasPhone = wallpaper.hasPhoneCrop || Boolean(wallpaper.phoneImageUrl);
      setPreviewMode(isMobileWp || (isMobile && hasPhone) ? "phone" : "desktop");
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [wallpaper, onClose]);

  if (!wallpaper) return null;

  const author = wallpaper.author || {
    id: "xweet",
    username: "xweet",
    displayName: "Vicky",
    photoURL: "/logo.png",
    isVerified: true,
  };
  const isXweetAuthor = author.username?.toLowerCase() === "xweet" || author.isVerified;
  const hasPhoneCrop = wallpaper.hasPhoneCrop || Boolean(wallpaper.phoneImageUrl);

  const handleDownloadDesktop = () => {
    setDownloadSuccess("desktop");
    triggerDynamicDownload(wallpaper.slug, "desktop-4k", "webp");
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  const handleDownloadPhone = () => {
    setDownloadSuccess("phone");
    triggerDynamicDownload(wallpaper.slug, "phone-4k", "webp");
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  const handleDownloadBoth = () => {
    setDownloadSuccess("both");
    triggerDynamicDownload(wallpaper.slug, "desktop-4k", "webp");
    setTimeout(() => {
      triggerDynamicDownload(wallpaper.slug, "phone-4k", "webp");
    }, 450);
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  const handleShare = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
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
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2200);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-8 overscroll-contain">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="absolute inset-0 bg-foreground/50 backdrop-blur-[3px]"
        />

        {/* Modal Window: Responsive scrolling on phones, two-column split on desktop */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative z-10 w-full max-w-5xl border border-border bg-surface shadow-2xl flex flex-col lg:flex-row max-h-[94dvh] overflow-y-auto lg:overflow-hidden overscroll-contain"
        >
          {/* Top Actions on Mobile (Sticky Close, Share & Delete) */}
          <div className="sticky top-0 right-0 z-30 flex items-center justify-end gap-2 p-2 bg-surface/90 backdrop-blur-xs border-b border-border/60 lg:hidden">
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDelete(wallpaper);
                }}
                aria-label="Delete wallpaper"
                className="flex h-9 w-9 items-center justify-center border border-destructive/40 bg-background text-destructive hover:bg-destructive hover:text-white transition-colors cursor-pointer"
              >
                <IconTrash size={16} />
              </button>
            )}
            <button
              onClick={handleShare}
              aria-label="Share wallpaper"
              className="flex h-9 w-9 items-center justify-center border border-border bg-background text-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
            >
              {shareFeedback ? <IconCheck size={16} className="text-emerald-600" /> : <IconShare size={16} />}
            </button>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="flex h-9 w-9 items-center justify-center border border-border bg-background text-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
            >
              <IconX size={18} />
            </button>
          </div>

          {/* Desktop Delete & Close Buttons */}
          {onDelete && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onDelete(wallpaper);
              }}
              title="Delete wallpaper"
              aria-label="Delete wallpaper"
              className="hidden lg:flex absolute top-4 right-16 z-30 h-10 w-10 items-center justify-center border border-destructive/40 bg-surface text-destructive hover:bg-destructive hover:text-white transition-colors cursor-pointer"
            >
              <IconTrash size={18} />
            </button>
          )}

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="hidden lg:flex absolute top-4 right-4 z-30 h-10 w-10 items-center justify-center border border-border bg-surface text-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
          >
            <IconX size={20} />
          </button>

          {/* Left: Artwork Viewport */}
          {/* Left: Artwork Viewport */}
          <div className="relative flex-1 bg-black/5 min-h-[260px] sm:min-h-[340px] lg:min-h-[560px] overflow-hidden flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 shrink-0">
            
            {/* Aspect Preview Switcher */}
            {hasPhoneCrop && wallpaper.orientation !== "mobile" && (
              <div className="absolute top-3 left-3 z-30 flex items-center gap-1 border border-border bg-surface/95 p-1 font-mono text-[10px] sm:text-[11px] backdrop-blur-xs select-none">
                <button
                  type="button"
                  onClick={() => setPreviewMode("desktop")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 transition-colors cursor-pointer select-none whitespace-nowrap ${
                    previewMode === "desktop"
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <IconDeviceDesktop size={13} />
                  <span>Desktop 16:9</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("phone")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 transition-colors cursor-pointer select-none whitespace-nowrap ${
                    previewMode === "phone"
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <IconDeviceMobile size={13} />
                  <span>Phone 9:19.5</span>
                </button>
              </div>
            )}

            {/* Visual Container */}
            <div className="w-full flex items-center justify-center py-6 sm:py-8 lg:py-0">
              {previewMode === "desktop" ? (
                /* Desktop 16:9 Frame: Has true 16:9 aspect ratio so it NEVER collapses on phones! */
                <div className="relative w-full aspect-[16/9] max-w-xl max-h-[360px] sm:max-h-[440px] lg:max-h-[500px] border border-border/80 shadow-md overflow-hidden bg-black/30">
                  {/* PROTECTIVE EXTRA LAYER ON IMAGE: Prevents direct right-click or drag */}
                  <div
                    className="absolute inset-0 z-20 cursor-default select-none"
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setProtectionNotice(true);
                      setTimeout(() => setProtectionNotice(false), 2400);
                    }}
                    onDragStart={(e) => e.preventDefault()}
                    style={{
                      WebkitTouchCallout: "none",
                      WebkitUserSelect: "none",
                      userSelect: "none",
                    }}
                  />

                  {/* Protection Notice Toast */}
                  {protectionNotice && (
                    <div className="absolute inset-x-3 bottom-4 z-30 bg-black/90 text-white text-center font-mono text-[11px] p-2 border border-white/20 shadow-lg backdrop-blur-md animate-fade-in pointer-events-none">
                      <div className="flex items-center justify-center gap-1.5 text-primary">
                        <IconLock size={13} />
                        <span className="font-semibold">Master Quality Protected</span>
                      </div>
                      <span className="text-white/80 text-[10px] block mt-0.5">
                        Please use official download buttons for full lossless 4K edition.
                      </span>
                    </div>
                  )}

                  <Image
                    src={getCdnImageUrl(wallpaper.imageUrl)}
                    alt={wallpaper.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    quality={92}
                    className="object-cover protected-image select-none pointer-events-none"
                    draggable={false}
                    priority
                  />
                </div>
              ) : (
                /* Phone 9:19.5 Frame: Scaled cleanly with true portrait crop */
                <div className="relative w-36 sm:w-44 aspect-[9/19.5] rounded-[22px] border-4 border-foreground/30 shadow-2xl overflow-hidden bg-black">
                  {/* PROTECTIVE EXTRA LAYER ON IMAGE */}
                  <div
                    className="absolute inset-0 z-20 cursor-default select-none"
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setProtectionNotice(true);
                      setTimeout(() => setProtectionNotice(false), 2400);
                    }}
                    onDragStart={(e) => e.preventDefault()}
                    style={{
                      WebkitTouchCallout: "none",
                      WebkitUserSelect: "none",
                      userSelect: "none",
                    }}
                  />

                  {protectionNotice && (
                    <div className="absolute inset-x-2 bottom-3 z-30 bg-black/90 text-white text-center font-mono text-[10px] p-1.5 border border-white/20 shadow-lg backdrop-blur-md animate-fade-in pointer-events-none">
                      <span className="font-semibold text-primary block">Protected</span>
                      <span className="text-white/80 text-[9px]">Use buttons below</span>
                    </div>
                  )}

                  <Image
                    src={`/api/download/${wallpaper.slug}?type=phone-4k&inline=true&v=${wallpaper.storage?.phoneCropCoords?.x ?? 0}`}
                    alt={wallpaper.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 480px"
                    quality={95}
                    unoptimized
                    className="object-cover protected-image select-none pointer-events-none"
                    draggable={false}
                    priority
                  />

                  {/* Phone Mockup Screen Elements */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/30 pointer-events-none flex flex-col justify-between p-3 text-center">
                    <div className="pt-2">
                      <p className="font-mono text-[9px] uppercase tracking-wider text-white/80 font-medium">9:41</p>
                    </div>
                    <div className="h-1 w-10 bg-white/60 rounded-full mx-auto mb-1" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Editorial Metadata & Actions */}
          <div className="w-full lg:w-96 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-border bg-surface p-4 sm:p-6 lg:p-8 shrink-0">
            <div className="flex flex-col gap-4 sm:gap-5">
              {/* Category / Status */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="bg-primary text-primary-foreground font-mono text-[10px] tracking-widest px-2 py-0.5 uppercase border border-primary">
                    {wallpaper.category}
                  </span>
                  {wallpaper.orientation === "mobile" ? (
                    <span className="bg-secondary text-secondary-foreground font-mono text-[10px] tracking-wider uppercase border border-border px-2 py-0.5 flex items-center gap-1 font-semibold">
                      <IconDeviceMobile size={12} />
                      <span>MOBILE ONLY</span>
                    </span>
                  ) : hasPhoneCrop ? (
                    <span className="bg-secondary text-secondary-foreground font-mono text-[10px] tracking-wider uppercase border border-border px-2 py-0.5 flex items-center gap-1 font-semibold">
                      <IconDeviceMobile size={12} />
                      <span>DUAL CROP</span>
                    </span>
                  ) : null}
                </div>

                {/* Share Button (Desktop top icon) */}
                <button
                  onClick={handleShare}
                  title="Share Wallpaper"
                  className="hidden lg:flex items-center gap-1 text-xs font-mono text-muted-foreground hover:text-primary transition-colors cursor-pointer mr-10"
                >
                  {shareFeedback ? (
                    <>
                      <IconCheck size={14} className="text-emerald-600" />
                      <span className="text-emerald-600 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <IconShare size={14} />
                      <span>Share</span>
                    </>
                  )}
                </button>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  {wallpaper.title}
                </h2>
                <p className="font-sans text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
                  {wallpaper.description}
                </p>
              </div>

              {/* Author Attribution with Verified Badge */}
              <div className="border border-border bg-background p-3 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative h-9 w-9 rounded-full overflow-hidden bg-white border border-border/80 flex items-center justify-center shrink-0">
                    <Image
                      src={author.photoURL || "/logo.png"}
                      alt={author.displayName || "Vicky"}
                      width={28}
                      height={28}
                      className="object-contain p-1"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono uppercase text-muted-foreground">Curated By</span>
                    <Link
                      href={`/${author.username || "xweet"}`}
                      className="font-sans text-xs font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1"
                    >
                      <span>{author.displayName || "Vicky"}</span>
                      <span className="text-muted-foreground font-mono font-normal">(@{author.username || "xweet"})</span>
                      {isXweetAuthor && <IconShieldCheck size={13} className="text-primary" />}
                    </Link>
                  </div>
                </div>

                <Link
                  href={`/${author.username || "xweet"}`}
                  className="font-mono text-[11px] text-primary hover:underline uppercase"
                >
                  Portfolio →
                </Link>
              </div>

              {/* Technical Specifications */}
              <div className="flex flex-col gap-2 pt-1 border-t border-border font-mono text-xs text-muted-foreground">
                <div className="flex items-center justify-between py-1 border-b border-border/50">
                  <span className="flex items-center gap-1.5 uppercase text-[11px]">
                    <IconDimensions size={13} className="text-primary" />
                    Master Resolution
                  </span>
                  <span className="text-foreground font-medium text-[11px]">{wallpaper.resolution}</span>
                </div>

                {hasPhoneCrop && (
                  <button
                    type="button"
                    onClick={() => setPreviewMode("phone")}
                    className="flex items-center justify-between py-1 border-b border-border/50 text-left hover:text-foreground transition-colors cursor-pointer group select-none"
                    title="Click to preview Phone edition"
                  >
                    <span className="flex items-center gap-1.5 uppercase text-[11px] group-hover:text-primary transition-colors">
                      <IconDeviceMobile size={13} className="text-primary" />
                      Phone Edition
                    </span>
                    <span className="text-foreground font-medium text-[11px] group-hover:underline">1170 × 2532 (9:19.5)</span>
                  </button>
                )}

                <div className="flex items-center justify-between py-1 border-b border-border/50">
                  <span className="flex items-center gap-1.5 uppercase text-[11px]">
                    <IconColorSwatch size={13} className="text-primary" />
                    Color Palette
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-3 w-3 rounded-none border border-border"
                      style={{ backgroundColor: wallpaper.dominantColor }}
                      title={wallpaper.dominantColor}
                    />
                    <span className="text-foreground font-medium text-[11px]">{wallpaper.dominantColor}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons: Dynamically prioritizes and enlarges Phone button in Phone View */}
            <div className="mt-5 pt-3 border-t border-border flex flex-col gap-2.5">
              {previewMode === "phone" ? (
                <>
                  {/* In Phone View: Big, prominent, primary Phone button */}
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleDownloadPhone}
                    className="w-full h-13 text-sm font-semibold tracking-wide flex items-center justify-center gap-2.5 shadow-sm"
                  >
                    {downloadSuccess === "phone" ? (
                      <>
                        <IconCheck size={18} />
                        <span>Downloaded Phone Lockscreen</span>
                      </>
                    ) : (
                      <>
                        <IconDeviceMobile size={18} />
                        <span>Get Phone Edition (1170 × 2532)</span>
                      </>
                    )}
                  </Button>

                  {wallpaper.orientation !== "mobile" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Button
                        variant="secondary"
                        size="md"
                        onClick={handleDownloadDesktop}
                        className="text-xs h-10 w-full"
                      >
                        {downloadSuccess === "desktop" ? (
                          <>
                            <IconCheck size={15} />
                            <span>Downloaded 4K</span>
                          </>
                        ) : (
                          <>
                            <IconDownload size={15} />
                            <span>Get Desktop (4K)</span>
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadBoth}
                        className="w-full text-xs h-10"
                      >
                        {downloadSuccess === "both" ? (
                          <>
                            <IconCheck size={14} />
                            <span>Downloaded Both</span>
                          </>
                        ) : (
                          <>
                            <IconSparkles size={14} className="text-primary" />
                            <span>Bundle (Both)</span>
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* In Desktop View: Primary Desktop button, Secondary Phone button */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleDownloadDesktop}
                      className="text-xs h-11 w-full font-medium"
                    >
                      {downloadSuccess === "desktop" ? (
                        <>
                          <IconCheck size={15} />
                          <span>Downloaded</span>
                        </>
                      ) : (
                        <>
                          <IconDownload size={15} />
                          <span>Get Desktop (4K)</span>
                        </>
                      )}
                    </Button>

                    <Button
                      variant="secondary"
                      size="md"
                      onClick={handleDownloadPhone}
                      className="text-xs h-11 w-full"
                    >
                      {downloadSuccess === "phone" ? (
                        <>
                          <IconCheck size={15} />
                          <span>Downloaded</span>
                        </>
                      ) : (
                        <>
                          <IconDeviceMobile size={15} />
                          <span>Get Phone (Cropped)</span>
                        </>
                      )}
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadBoth}
                    className="w-full text-xs h-9"
                  >
                    {downloadSuccess === "both" ? (
                      <>
                        <IconCheck size={14} />
                        <span>Downloaded Both Editions</span>
                      </>
                    ) : (
                      <>
                        <IconSparkles size={14} className="text-primary" />
                        <span>Download Bundle (Desktop + Phone)</span>
                      </>
                    )}
                  </Button>
                </>
              )}

              <div className="flex items-center gap-2 pt-1">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setBookmarked(!bookmarked)}
                  className="flex-1 text-xs h-8"
                >
                  <IconBookmark size={14} className={bookmarked ? "fill-current text-primary" : ""} />
                  <span>{bookmarked ? "Saved" : "Save"}</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs h-8"
                  href={`/wallpaper/${wallpaper.slug}`}
                >
                  <IconExternalLink size={14} />
                  <span>Full Page</span>
                </Button>
              </div>

              {(onEdit || onDelete) && (
                <div className={`grid ${onEdit && onDelete ? "grid-cols-2" : "grid-cols-1"} gap-2 pt-1`}>
                  {onEdit && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onClose();
                        onEdit(wallpaper);
                      }}
                      className="w-full text-xs h-8 gap-1.5 border-primary/70 text-primary hover:bg-primary hover:text-primary-foreground font-mono"
                    >
                      <IconPencil size={13} />
                      <span>EDIT METADATA</span>
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onClose();
                        onDelete(wallpaper);
                      }}
                      className="w-full text-xs h-8 gap-1.5 border-destructive/60 text-destructive hover:bg-destructive hover:text-white font-mono"
                    >
                      <IconTrash size={13} />
                      <span>DELETE DROP</span>
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
