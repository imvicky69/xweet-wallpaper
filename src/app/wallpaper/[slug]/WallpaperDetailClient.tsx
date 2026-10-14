"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IconDownload,
  IconBookmark,
  IconArrowLeft,
  IconDeviceMobile,
  IconDeviceDesktop,
  IconShieldCheck,
  IconCheck,
  IconCopy,
  IconShare,
  IconSparkles,
  IconLock,
} from "@tabler/icons-react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WallpaperCard } from "@/components/wallpapers/WallpaperCard";
import { WallpaperQuickViewModal } from "@/components/wallpapers/WallpaperQuickViewModal";
import { WALLPAPERS, getCdnImageUrl } from "@/lib/wallpapers";
import { triggerDirectDownload } from "@/lib/download";
import { Wallpaper } from "@/types/wallpaper";

interface WallpaperDetailClientProps {
  wallpaper: Wallpaper;
}

export default function WallpaperDetailClient({ wallpaper }: WallpaperDetailClientProps) {
  const [previewMode, setPreviewMode] = useState<"desktop" | "phone">("desktop");
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [activePreview, setActivePreview] = useState<Wallpaper | null>(null);
  const [protectionNotice, setProtectionNotice] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // On phone / mobile devices, default to Phone view instead of desktop
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isMobile =
        window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile && (wallpaper.hasPhoneCrop || Boolean(wallpaper.phoneImageUrl))) {
        setPreviewMode("phone");
      }
    }
  }, [wallpaper]);

  const author = wallpaper.author || {
    id: "xweet",
    username: "xweet",
    displayName: "Vicky",
    photoURL: "/logo.png",
    isVerified: true,
  };
  const isXweetAuthor = author.username?.toLowerCase() === "xweet" || author.isVerified;

  const downloadFile = (url: string, suffix: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `${wallpaper.slug}-${suffix}.png`;
    link.target = "_blank";
    link.rel = "noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadDesktop = () => {
    setDownloadSuccess("desktop");
    const desktopUrl = getCdnImageUrl(wallpaper.imageUrl || `https://cdn.xweet.in/wallpapers/${wallpaper.slug}.png`);
    triggerDirectDownload(desktopUrl, `${wallpaper.slug}-desktop-4k.png`);
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  const handleDownloadPhone = () => {
    setDownloadSuccess("phone");
    const phoneUrl = getCdnImageUrl(wallpaper.phoneImageUrl || `https://cdn.xweet.in/wallpapers/phone/${wallpaper.slug}.png`);
    triggerDirectDownload(phoneUrl, `${wallpaper.slug}-phone-1170x2532.png`);
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  const handleDownloadBoth = () => {
    setDownloadSuccess("both");
    const desktopUrl = getCdnImageUrl(wallpaper.imageUrl || `https://cdn.xweet.in/wallpapers/${wallpaper.slug}.png`);
    triggerDirectDownload(desktopUrl, `${wallpaper.slug}-desktop-4k.png`);
    setTimeout(() => {
      const phoneUrl = getCdnImageUrl(wallpaper.phoneImageUrl || `https://cdn.xweet.in/wallpapers/phone/${wallpaper.slug}.png`);
      triggerDirectDownload(phoneUrl, `${wallpaper.slug}-phone-1170x2532.png`);
    }, 450);
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  // Related wallpapers from the same collection
  const relatedWallpapers = WALLPAPERS.filter(
    (wp) => wp.slug !== wallpaper.slug && wp.collection === wallpaper.collection
  ).slice(0, 4);

  // Schema.org Structured Data for SEO ImageObject
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    name: `${wallpaper.title} Wallpaper`,
    caption: wallpaper.description,
    description: wallpaper.description,
    contentUrl: getCdnImageUrl(wallpaper.imageUrl),
    thumbnailUrl: getCdnImageUrl(wallpaper.thumbnailUrl || wallpaper.imageUrl),
    keywords: wallpaper.tags.join(", "),
    creator: {
      "@type": "Organization",
      name: "Xweet",
      url: "https://wallpaper.xweet.in",
    },
    publisher: {
      "@type": "Organization",
      name: "Xweet Wallpapers",
      logo: {
        "@type": "ImageObject",
        url: "https://wallpaper.xweet.in/logo.png",
      },
    },
    license: "https://wallpaper.xweet.in/terms",
    acquireLicensePage: "https://wallpaper.xweet.in",
    isPartOf: {
      "@type": "Collection",
      name: wallpaper.collection || "Minimal Abstracts",
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Schema.org Script for Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <SiteHeader />

      <main className="flex-1 pb-24">
        {/* Breadcrumb Bar */}
        <div className="border-b border-border bg-surface/50">
          <div className="mx-auto max-w-7xl px-6 lg:px-12 py-3 flex items-center justify-between text-xs font-mono text-muted-foreground">
            <div className="flex items-center gap-2">
              <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
                <IconArrowLeft size={14} />
                <span>Catalog</span>
              </Link>
              <span>/</span>
              <span className="text-foreground/80">{wallpaper.collection || "Minimal Abstracts"}</span>
              <span>/</span>
              <span className="text-primary font-semibold">{wallpaper.title}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const shareUrl = window.location.href;
                  if (typeof navigator !== "undefined" && navigator.share) {
                    navigator.share({
                      title: `${wallpaper.title} Wallpaper — Xweet`,
                      text: wallpaper.description,
                      url: shareUrl,
                    }).catch(() => {});
                  } else if (typeof navigator !== "undefined" && navigator.clipboard) {
                    navigator.clipboard.writeText(shareUrl);
                    setShareCopied(true);
                    setTimeout(() => setShareCopied(false), 2200);
                  }
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 border border-border bg-surface text-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
              >
                {shareCopied ? (
                  <>
                    <IconCheck size={13} className="text-emerald-600" />
                    <span className="text-emerald-600 font-semibold">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <IconShare size={13} />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Main Stage & Metadata Split */}
        <div className="mx-auto max-w-7xl px-6 lg:px-12 pt-8 lg:pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Interactive Viewer (Desktop or Phone Lockscreen) */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              
              {/* Preview Mode Switcher */}
              <div className="flex items-center justify-between bg-surface border border-border p-2">
                <div className="flex items-center gap-1 text-xs font-mono">
                  <button
                    onClick={() => setPreviewMode("desktop")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors cursor-pointer ${
                      previewMode === "desktop"
                        ? "bg-foreground text-background font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <IconDeviceDesktop size={14} />
                    <span>Desktop (16:9)</span>
                  </button>

                  <button
                    onClick={() => setPreviewMode("phone")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors cursor-pointer ${
                      previewMode === "phone"
                        ? "bg-foreground text-background font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <IconDeviceMobile size={14} />
                    <span>Phone Lockscreen</span>
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                  <span>Lossless PNG</span>
                  <span>•</span>
                  <span>{wallpaper.resolution}</span>
                </div>
              </div>

              {/* Artwork Frame */}
              <div className="relative border border-border bg-black/40 overflow-hidden flex items-center justify-center min-h-[260px] sm:min-h-[460px] lg:min-h-[600px]">
                {/* PROTECTIVE LAYER ON IMAGE */}
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
                  <div className="absolute inset-x-4 bottom-6 z-30 bg-black/90 text-white text-center font-mono text-[11px] p-2.5 border border-white/20 shadow-lg backdrop-blur-md animate-fade-in pointer-events-none max-w-sm mx-auto">
                    <div className="flex items-center justify-center gap-1.5 text-primary">
                      <IconLock size={13} />
                      <span className="font-semibold">Master Quality Protected</span>
                    </div>
                    <span className="text-white/80 text-[10px] block mt-0.5">
                      Please use the official download buttons below to get the lossless edition.
                    </span>
                  </div>
                )}

                {previewMode === "desktop" ? (
                  <div className="relative w-full aspect-[16/9] shadow-2xl">
                    <Image
                      src={getCdnImageUrl(wallpaper.imageUrl)}
                      alt={`${wallpaper.title} 4K Desktop Wallpaper`}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className="object-cover protected-image select-none pointer-events-none"
                      draggable={false}
                    />
                  </div>
                ) : (
                  /* Phone Lockscreen Mockup */
                  <div className="py-6 sm:py-8">
                    <div className="relative w-[220px] sm:w-[300px] aspect-[9/19.5] rounded-[36px] sm:rounded-[42px] border-[5px] sm:border-[6px] border-border/80 overflow-hidden shadow-2xl bg-black">
                      <Image
                        src={getCdnImageUrl(wallpaper.phoneImageUrl || `https://cdn.xweet.in/wallpapers/phone/${wallpaper.slug}.png`)}
                        alt={`${wallpaper.title} Mobile Wallpaper Crop`}
                        fill
                        priority
                        sizes="320px"
                        className="object-cover protected-image select-none pointer-events-none"
                        draggable={false}
                      />
                      {/* Realistic iOS/Android Lockscreen Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50 pointer-events-none flex flex-col justify-between p-5 sm:p-6">
                        <div className="text-center pt-6 sm:pt-8">
                          <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-white/80 font-medium">
                            Wednesday, Oct 14
                          </p>
                          <h4 className="font-sans text-5xl sm:text-6xl font-light text-white tracking-tight drop-shadow-md">
                            09:41
                          </h4>
                        </div>
                        <div className="flex items-center justify-between pb-2 text-white/70">
                          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <span className="font-mono text-xs">⚡</span>
                          </div>
                          <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <span className="font-mono text-xs">📷</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Color Swatch Strip with Click-to-Copy */}
              <div className="border border-border bg-surface p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                      Color Palette:
                    </span>
                    <span className="font-mono text-xs text-primary font-semibold">
                      {copiedHex ? `Copied ${copiedHex}!` : "Click swatch to copy hex"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {(wallpaper.palette || [wallpaper.dominantColor]).map((hex, i) => (
                      <button
                        key={i}
                        onClick={() => copyToClipboard(hex)}
                        title={`Copy ${hex}`}
                        className="group flex items-center gap-1.5 border border-border px-2 py-1 bg-background hover:border-primary transition-colors cursor-pointer"
                      >
                        <span
                          className="h-3.5 w-3.5 rounded-none shrink-0 border border-border"
                          style={{ backgroundColor: hex }}
                        />
                        <span className="font-mono text-[11px] text-foreground group-hover:text-primary">
                          {hex}
                        </span>
                        <IconCopy size={11} className="text-muted-foreground group-hover:text-primary" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Metadata, Specs Table, and Action Buttons */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Header Info */}
              <div className="flex flex-col border border-border bg-surface p-6">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="font-mono text-xs font-semibold text-primary uppercase tracking-wider">
                    {wallpaper.collection || "Minimal Abstracts"}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground border border-border px-2 py-0.5 bg-background">
                    {wallpaper.category}
                  </span>
                </div>

                {/* Primary H1 for SEO */}
                <h1 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                  {wallpaper.title}
                </h1>

                {/* Author Link */}
                <div className="mt-3 flex items-center gap-2 text-xs font-mono">
                  <span className="text-muted-foreground">Curated & Crafted by</span>
                  <Link
                    href={`/${author.username || "xweet"}`}
                    className="flex items-center gap-1.5 font-semibold text-foreground hover:text-primary transition-colors"
                  >
                    <div className="relative h-4.5 w-4.5 rounded-full overflow-hidden bg-white border border-border/80 flex items-center justify-center shrink-0">
                      <Image
                        src="/logo.png"
                        alt={author.displayName || "Vicky"}
                        width={18}
                        height={18}
                        className="object-contain p-0.5"
                      />
                    </div>
                    <span>{author.displayName || "Vicky"}</span>
                    <span className="text-muted-foreground font-normal">(@{author.username || "xweet"})</span>
                    {isXweetAuthor && (
                      <span title="Verified Xweet Creator" className="text-primary">
                        <IconShieldCheck size={14} />
                      </span>
                    )}
                  </Link>
                </div>

                <p className="font-sans text-sm text-muted-foreground leading-relaxed mt-4 border-t border-border pt-4">
                  {wallpaper.description}
                </p>

                {/* Download Actions */}
                <div className="mt-6 flex flex-col gap-2.5">
                  <button
                    onClick={handleDownloadDesktop}
                    className="w-full flex items-center justify-center gap-2 h-11 px-4 bg-primary text-primary-foreground font-sans text-xs font-semibold uppercase tracking-wider border border-primary hover:bg-primary-hover transition-colors cursor-pointer"
                  >
                    {downloadSuccess === "desktop" ? (
                      <>
                        <IconCheck size={16} />
                        <span>Downloaded 4K Desktop</span>
                      </>
                    ) : (
                      <>
                        <IconDownload size={16} />
                        <span>Download Desktop (4K PNG)</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownloadPhone}
                    className="w-full flex items-center justify-center gap-2 h-11 px-4 bg-surface text-foreground font-sans text-xs font-semibold uppercase tracking-wider border border-border hover:border-primary hover:text-primary transition-colors cursor-pointer"
                  >
                    {downloadSuccess === "phone" ? (
                      <>
                        <IconCheck size={16} />
                        <span>Downloaded Phone Lockscreen</span>
                      </>
                    ) : (
                      <>
                        <IconDeviceMobile size={16} />
                        <span>Download Phone Lockscreen</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleDownloadBoth}
                    className="w-full flex items-center justify-center gap-2 h-10 px-4 bg-background text-muted-foreground font-sans text-xs hover:text-foreground hover:border-foreground border border-border/70 transition-colors cursor-pointer"
                  >
                    {downloadSuccess === "both" ? (
                      <>
                        <IconCheck size={14} />
                        <span>Downloaded Both Editions</span>
                      </>
                    ) : (
                      <>
                        <IconSparkles size={14} className="text-primary" />
                        <span>Download Desktop + Mobile Bundle</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Recommended Publishing Specifications Table */}
              <div className="border border-border bg-surface p-6">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground mb-4">
                  Publishing & Artwork Specifications
                </h3>

                <div className="flex flex-col divide-y divide-border/60 text-xs font-mono">
                  <div className="py-2.5 flex justify-between items-center">
                    <span className="text-muted-foreground">Author</span>
                    <Link
                      href={`/${author.username || "xweet"}`}
                      className="text-foreground hover:text-primary font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <div className="relative h-4 w-4 rounded-full overflow-hidden bg-white border border-border/80 flex items-center justify-center shrink-0">
                        <Image
                          src="/logo.png"
                          alt="Vicky"
                          width={16}
                          height={16}
                          className="object-contain p-0.5"
                        />
                      </div>
                      <span>{author.displayName || "Vicky"} (@{author.username || "xweet"})</span>
                      <IconShieldCheck size={13} className="text-primary" />
                    </Link>
                  </div>

                  <div className="py-2.5 flex justify-between items-center">
                    <span className="text-muted-foreground">Publisher</span>
                    <span className="text-foreground font-semibold">Xweet Wallpapers</span>
                  </div>

                  <div className="py-2.5 flex justify-between items-center">
                    <span className="text-muted-foreground">Collection</span>
                    <span className="text-primary font-semibold">{wallpaper.collection || "Minimal Abstracts"}</span>
                  </div>

                  <div className="py-2.5 flex justify-between items-center">
                    <span className="text-muted-foreground">Artwork Type</span>
                    <span className="text-foreground">AI-generated & Curated</span>
                  </div>

                  <div className="py-2.5 flex justify-between items-center">
                    <span className="text-muted-foreground">License</span>
                    <span className="text-foreground">Free Personal & Editorial Use</span>
                  </div>

                  <div className="py-2.5 flex justify-between items-center">
                    <span className="text-muted-foreground">Status</span>
                    <span className="text-emerald-500 font-semibold">Published & Verified</span>
                  </div>

                  <div className="py-2.5 flex justify-between items-center">
                    <span className="text-muted-foreground">Format</span>
                    <span className="text-foreground">Master Lossless PNG</span>
                  </div>

                  <div className="py-2.5 flex justify-between items-center">
                    <span className="text-muted-foreground">Resolution</span>
                    <span className="text-foreground font-semibold">{wallpaper.resolution}</span>
                  </div>

                  <div className="py-2.5 flex justify-between items-center">
                    <span className="text-muted-foreground">Aspect Ratio</span>
                    <span className="text-foreground">{wallpaper.aspectRatio} (Desktop + Mobile)</span>
                  </div>
                </div>
              </div>

              {/* Curated Tags */}
              <div className="border border-border bg-surface p-6">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                  Metadata Tags
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {wallpaper.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-[11px] text-muted-foreground border border-border px-2 py-0.5 bg-background hover:border-primary hover:text-primary transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Related from Minimal Abstracts Collection */}
          {relatedWallpapers.length > 0 && (
            <section className="mt-20 pt-12 border-t border-border">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <span className="font-mono text-xs font-semibold text-primary uppercase tracking-wider">
                    First Collection
                  </span>
                  <h2 className="font-sans text-2xl font-bold tracking-tight text-foreground mt-1">
                    More from Minimal Abstracts
                  </h2>
                </div>
                <Link
                  href="/"
                  className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <span>View All 16</span>
                  <span>→</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedWallpapers.map((wp) => (
                  <WallpaperCard
                    key={wp.id}
                    wallpaper={wp}
                    onPreview={setActivePreview}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <SiteFooter />

      {/* Quick View Modal */}
      {activePreview && (
        <WallpaperQuickViewModal
          wallpaper={activePreview}
          onClose={() => setActivePreview(null)}
        />
      )}
    </div>
  );
}
