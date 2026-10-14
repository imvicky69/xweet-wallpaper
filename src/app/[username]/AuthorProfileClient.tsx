"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { WallpaperGrid } from "@/components/wallpapers/WallpaperGrid";
import { WallpaperQuickViewModal } from "@/components/wallpapers/WallpaperQuickViewModal";
import { EditWallpaperModal } from "@/components/wallpapers/EditWallpaperModal";
import { useWallpapers } from "@/hooks/useWallpapers";
import { Wallpaper } from "@/types/wallpaper";
import { getCdnImageUrl } from "@/lib/wallpapers";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconShieldCheck,
  IconSparkles,
  IconArrowLeft,
  IconPlus,
  IconTrash,
  IconAlertTriangle,
  IconX,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

interface AuthorProfileClientProps {
  initialUsername: string;
}

export default function AuthorProfileClient({ initialUsername }: AuthorProfileClientProps) {
  const username = decodeURIComponent(initialUsername || "xweet").toLowerCase();
  const { profile: loggedInProfile } = useAuth();
  const { wallpapers } = useWallpapers();
  const [activePreview, setActivePreview] = useState<Wallpaper | null>(null);
  const [editingWallpaper, setEditingWallpaper] = useState<Wallpaper | null>(null);
  const [deletingWallpaper, setDeletingWallpaper] = useState<Wallpaper | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [localUpdates, setLocalUpdates] = useState<Record<string, Wallpaper>>({});

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

  // Filter wallpapers authored by this user: curator gets platform master wallpapers + their drops
  const authorWallpapers = useMemo(() => {
    let list: Wallpaper[];
    if (isCurator) {
      list = wallpapers.filter(
        (wp) =>
          !wp.author?.username ||
          ["xweet", "vikky", "vicky", "rajvicky97988"].includes(wp.author.username.toLowerCase()) ||
          wp.author.isVerified
      );
    } else {
      list = wallpapers.filter(
        (wp) => wp.author?.username?.toLowerCase() === username
      );
    }
    return list
      .filter((wp) => !deletedIds.has(wp.id))
      .map((wp) => localUpdates[wp.id] || wp);
  }, [username, isCurator, wallpapers, localUpdates, deletedIds]);

  const handleConfirmDelete = async () => {
    if (!deletingWallpaper) return;
    setIsDeleting(true);
    setDeleteError("");
    try {
      await deleteDoc(doc(db, "wallpapers", deletingWallpaper.id));
      setDeletedIds((prev) => new Set(prev).add(deletingWallpaper.id));
      if (activePreview?.id === deletingWallpaper.id) {
        setActivePreview(null);
      }
      if (editingWallpaper?.id === deletingWallpaper.id) {
        setEditingWallpaper(null);
      }
      setDeletingWallpaper(null);
    } catch (err: unknown) {
      console.error("Failed to delete wallpaper:", err);
      setDeleteError(err instanceof Error ? err.message : "Failed to delete wallpaper. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

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
              onEdit={isOwner ? (wp) => setEditingWallpaper(wp) : undefined}
              onDelete={isOwner ? (wp) => setDeletingWallpaper(wp) : undefined}
            />
          </div>
        </section>
      </main>

      <SiteFooter />

      <WallpaperQuickViewModal
        wallpaper={activePreview}
        onClose={() => setActivePreview(null)}
        onEdit={isOwner ? (wp) => setEditingWallpaper(wp) : undefined}
        onDelete={isOwner ? (wp) => setDeletingWallpaper(wp) : undefined}
      />

      <EditWallpaperModal
        wallpaper={editingWallpaper}
        isOpen={Boolean(editingWallpaper)}
        onClose={() => setEditingWallpaper(null)}
        onDelete={isOwner ? (wp) => setDeletingWallpaper(wp) : undefined}
        onSaved={(updated) => {
          setLocalUpdates((prev) => ({
            ...prev,
            [updated.id]: updated,
          }));
        }}
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingWallpaper && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overscroll-contain">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setDeletingWallpaper(null)}
              className="absolute inset-0 bg-foreground/50 backdrop-blur-[2px]"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.18 }}
              className="relative z-10 w-full max-w-md border border-border bg-surface p-6 shadow-2xl flex flex-col gap-5"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-2.5 text-destructive">
                  <div className="flex h-9 w-9 items-center justify-center border border-destructive/40 bg-destructive/10">
                    <IconAlertTriangle size={18} />
                  </div>
                  <div>
                    <h3 className="font-sans text-base font-bold text-foreground">
                      Delete Wallpaper Drop
                    </h3>
                    <p className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider">
                      Permanent Removal
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => !isDeleting && setDeletingWallpaper(null)}
                  disabled={isDeleting}
                  className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
                  aria-label="Close dialog"
                >
                  <IconX size={18} />
                </button>
              </div>

              {/* Thumbnail & Title Card */}
              <div className="flex items-center gap-3.5 border border-border bg-background p-3">
                <div className="relative h-14 w-20 shrink-0 overflow-hidden border border-border/80 bg-black/10">
                  <Image
                    src={getCdnImageUrl(deletingWallpaper.thumbnailUrl || deletingWallpaper.imageUrl)}
                    alt={deletingWallpaper.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-sans text-sm font-semibold text-foreground truncate">
                    {deletingWallpaper.title}
                  </span>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground mt-0.5">
                    <span>{deletingWallpaper.category}</span>
                    <span>•</span>
                    <span>{deletingWallpaper.resolution}</span>
                  </div>
                </div>
              </div>

              {/* Warning Notice */}
              <div className="bg-destructive/10 border border-destructive/30 p-3 text-xs text-destructive leading-relaxed">
                <p>
                  Are you sure you want to permanently delete this wallpaper? This action cannot be undone and will immediately remove this wallpaper from your public profile and discovery catalog.
                </p>
              </div>

              {deleteError && (
                <div className="border border-destructive bg-destructive/10 p-2 text-xs text-destructive font-mono">
                  {deleteError}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setDeletingWallpaper(null)}
                  disabled={isDeleting}
                  className="h-10 px-4 font-mono text-xs text-foreground border border-border hover:border-foreground transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="h-10 px-5 font-mono text-xs font-semibold bg-destructive text-white hover:bg-destructive/90 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60 shadow-xs"
                >
                  <IconTrash size={14} />
                  <span>{isDeleting ? "Deleting..." : "Delete Permanently"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
