"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconX,
  IconDownload,
  IconBookmark,
  IconDimensions,
  IconColorSwatch,
  IconCheck,
  IconExternalLink,
} from "@tabler/icons-react";
import { Wallpaper } from "@/types/wallpaper";
import { Button } from "@/components/ui/Button";

interface WallpaperQuickViewModalProps {
  wallpaper: Wallpaper | null;
  onClose: () => void;
}

export const WallpaperQuickViewModal: React.FC<WallpaperQuickViewModalProps> = ({
  wallpaper,
  onClose,
}) => {
  const [downloadSuccess, setDownloadSuccess] = React.useState(false);
  const [bookmarked, setBookmarked] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (wallpaper) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [wallpaper, onClose]);

  if (!wallpaper) return null;

  const handleDownload = () => {
    setDownloadSuccess(true);
    const link = document.createElement("a");
    link.href = wallpaper.imageUrl;
    link.download = `${wallpaper.slug}.jpg`;
    link.target = "_blank";
    link.rel = "noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10">
        {/* Backdrop (Restrained, no blur overkill) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
          className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]"
        />

        {/* Modal Window (Square geometry, sharp borders, warm surface) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative z-10 w-full max-w-5xl border border-border bg-surface shadow-2xl flex flex-col lg:flex-row max-h-[92vh] overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center border border-border bg-surface text-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
          >
            <IconX size={20} />
          </button>

          {/* Left: Artwork Viewport */}
          <div className="relative flex-1 bg-black/5 min-h-[340px] sm:min-h-[460px] lg:min-h-[580px] overflow-hidden flex items-center justify-center p-4 lg:p-8">
            <div className="relative w-full h-full max-h-[520px] overflow-hidden border border-border/80 shadow-sm">
              <Image
                src={wallpaper.imageUrl}
                alt={wallpaper.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Right: Editorial Metadata & Actions */}
          <div className="w-full lg:w-96 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-border bg-surface p-6 sm:p-8 overflow-y-auto">
            <div className="flex flex-col gap-6">
              {/* Category / Status */}
              <div className="flex items-center gap-2">
                <span className="bg-primary text-primary-foreground font-mono text-[10px] tracking-widest px-2 py-0.5 uppercase border border-primary">
                  {wallpaper.category}
                </span>
                <span className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase border border-border px-2 py-0.5 bg-background">
                  {wallpaper.orientation}
                </span>
              </div>

              {/* Title & Description */}
              <div>
                <h2 className="font-sans text-2xl font-semibold tracking-tight text-foreground">
                  {wallpaper.title}
                </h2>
                <p className="font-sans text-sm text-muted-foreground mt-2 leading-relaxed">
                  {wallpaper.description}
                </p>
              </div>

              {/* Technical Specifications */}
              <div className="flex flex-col gap-3 pt-3 border-t border-border font-mono text-xs text-muted-foreground">
                <div className="flex items-center justify-between py-1 border-b border-border/50">
                  <span className="flex items-center gap-1.5 uppercase">
                    <IconDimensions size={14} className="text-primary" />
                    Resolution
                  </span>
                  <span className="text-foreground font-medium">{wallpaper.resolution}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-border/50">
                  <span className="uppercase">Aspect Ratio</span>
                  <span className="text-foreground font-medium">{wallpaper.aspectRatio}</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-border/50">
                  <span className="flex items-center gap-1.5 uppercase">
                    <IconColorSwatch size={14} className="text-primary" />
                    Dominant Tone
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 border border-border shrink-0"
                      style={{ backgroundColor: wallpaper.dominantColor }}
                    />
                    <span className="text-foreground font-medium">{wallpaper.dominantColor}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className="uppercase">Collection</span>
                  <span className="text-foreground font-medium">{wallpaper.collection}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {wallpaper.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-border bg-background px-2 py-0.5 font-mono text-[10px] text-muted-foreground uppercase"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col gap-3 pt-6 mt-6 border-t border-border">
              <Button
                variant="primary"
                size="lg"
                onClick={handleDownload}
                className="w-full"
              >
                {downloadSuccess ? (
                  <>
                    <IconCheck size={18} />
                    <span>Download Ready</span>
                  </>
                ) : (
                  <>
                    <IconDownload size={18} />
                    <span>Download Full Resolution</span>
                  </>
                )}
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => setBookmarked(!bookmarked)}
                  className="flex-1 text-xs"
                >
                  <IconBookmark size={15} className={bookmarked ? "fill-current text-primary" : ""} />
                  <span>{bookmarked ? "Saved to Favorites" : "Bookmark"}</span>
                </Button>

                <Button
                  variant="outline"
                  size="md"
                  className="flex-1 text-xs"
                  href={wallpaper.imageUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <IconExternalLink size={15} />
                  <span>Open Raw</span>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
