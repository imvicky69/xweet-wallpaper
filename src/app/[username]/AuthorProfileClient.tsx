"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WallpaperGrid } from "@/components/wallpapers/WallpaperGrid";
import { WallpaperQuickViewModal } from "@/components/wallpapers/WallpaperQuickViewModal";
import { WALLPAPERS } from "@/lib/wallpapers";
import { Wallpaper } from "@/types/wallpaper";
import {
  IconShieldCheck,
  IconSparkles,
  IconArrowLeft,
  IconPlus,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

interface AuthorProfileClientProps {
  initialUsername: string;
}

export default function AuthorProfileClient({ initialUsername }: AuthorProfileClientProps) {
  const username = decodeURIComponent(initialUsername || "xweet").toLowerCase();
  const { profile: loggedInProfile } = useAuth();
  const [activePreview, setActivePreview] = useState<Wallpaper | null>(null);

  const isCurator = ["xweet", "vikky", "vicky", "rajvicky97988"].includes(username);
  const displayUsername = isCurator ? "xweet" : username;
  const authorDisplayName = isCurator
    ? "Vicky"
    : loggedInProfile?.username?.toLowerCase() === username
    ? loggedInProfile.displayName || username
    : username.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  const isOwner =
    loggedInProfile?.username?.toLowerCase() === username ||
    (isCurator &&
      (loggedInProfile?.username?.toLowerCase() === "xweet" ||
        loggedInProfile?.username?.toLowerCase() === "vikky" ||
        loggedInProfile?.username?.toLowerCase() === "vicky" ||
        loggedInProfile?.username?.toLowerCase() === "rajvicky97988"));

  // Filter wallpapers authored by this user: curator gets all 16 platform master wallpapers
  const authorWallpapers = useMemo(() => {
    if (isCurator) {
      return WALLPAPERS;
    }
    const matches = WALLPAPERS.filter(
      (wp) => wp.author?.username?.toLowerCase() === username
    );
    return matches;
  }, [username, isCurator]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        {/* Author Profile Header Strip */}
        <section className="w-full border-b border-border bg-surface py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
              <IconArrowLeft size={14} />
              <span>BACK TO CATALOG</span>
            </Link>

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-border">
              {/* Profile Bio & Avatar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {/* Avatar: X logo for curator */}
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-full overflow-hidden border-2 border-border bg-white shadow-sm flex items-center justify-center">
                  {isCurator ? (
                    <Image
                      src="/logo.png"
                      alt="Vicky @xweet"
                      fill
                      sizes="96px"
                      className="object-contain p-2"
                      priority
                    />
                  ) : (
                    <span className="font-mono text-3xl font-bold text-primary">
                      {username[0]?.toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-col">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="font-sans text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                      {authorDisplayName}
                    </h1>

                    {/* Auto-detected Verified Badge */}
                    {isCurator && (
                      <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground font-mono text-[10px] tracking-widest px-2.5 py-1 uppercase border border-primary">
                        <IconShieldCheck size={14} />
                        <span>XWEET VERIFIED CURATOR</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 mt-1.5 font-mono text-xs text-muted-foreground">
                    <span className="text-primary font-semibold">@{displayUsername}</span>
                    <span>•</span>
                    <span>{isCurator ? "Official Platform Curator" : "Community Curator"}</span>
                    <span>•</span>
                    <span>Joined 2026</span>
                  </div>

                  <p className="font-sans text-sm text-muted-foreground mt-3 max-w-xl leading-relaxed">
                    {isCurator
                      ? "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens."
                      : "Independent digital artist sharing curated wallpapers for desktop and mobile displays."}
                  </p>
                </div>
              </div>

              {/* Author Actions / Stats */}
              <div className="flex flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
                {isOwner && (
                  <Button href="/upload" size="sm" variant="primary">
                    <IconPlus size={14} />
                    <span>Upload New Drop</span>
                  </Button>
                )}

                <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground">
                  <div className="border border-border bg-background px-3 py-1.5 text-center">
                    <span className="font-bold text-foreground text-sm block">
                      {authorWallpapers.length}
                    </span>
                    <span className="text-[10px] uppercase">Wallpapers</span>
                  </div>
                  <div className="border border-border bg-background px-3 py-1.5 text-center">
                    <span className="font-bold text-foreground text-sm block">4K / 5K</span>
                    <span className="text-[10px] uppercase">Precision</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Showcase Bar */}
            <div className="flex items-center justify-between pt-6 font-mono text-xs text-muted-foreground">
              <span className="uppercase text-foreground font-semibold flex items-center gap-2">
                <IconSparkles size={15} className="text-primary" />
                <span>Showcase Portfolio</span>
              </span>
              <span>{authorWallpapers.length} WALLPAPERS PUBLISHED</span>
            </div>
          </div>
        </section>

        {/* Author Wallpapers Grid */}
        <section className="w-full py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-12">
            <WallpaperGrid
              wallpapers={authorWallpapers}
              onPreview={setActivePreview}
            />
          </div>
        </section>
      </main>

      <SiteFooter />

      <WallpaperQuickViewModal
        wallpaper={activePreview}
        onClose={() => setActivePreview(null)}
      />
    </div>
  );
}
