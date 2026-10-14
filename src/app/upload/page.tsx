"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import {
  IconArrowLeft,
  IconUpload,
  IconDeviceMobile,
  IconDeviceDesktop,
  IconShieldCheck,
  IconCheck,
  IconPhoto,
  IconAlertCircle,
  IconArrowsHorizontal,
  IconCrop,
  IconSparkles,
  IconX,
  IconHash,
  IconPlus,
  IconLayersLinked,
  IconPalette,
} from "@tabler/icons-react";
import { CATEGORIES, MOBILE_CATEGORIES } from "@/lib/wallpapers";

type UploadMode = "mobile" | "dual" | "desktop";

interface ToastState {
  show: boolean;
  type: "error" | "success" | "info";
  title: string;
  message: string;
}

const POPULAR_MOBILE_TAGS = [
  "lockscreen",
  "amoled",
  "dark",
  "minimal",
  "aesthetic",
  "4k",
  "abstract",
  "cyberpunk",
  "vertical",
  "cinematic",
];

const POPULAR_DESKTOP_TAGS = [
  "minimal",
  "4k",
  "desktop",
  "dark",
  "texture",
  "editorial",
  "clean",
  "abstract",
  "ultrawide",
  "cinematic",
];

export default function UploadPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();

  // Mode: "mobile" (Vertical Lockscreen only) | "dual" (Desktop + Phone cropper) | "desktop" (16:9 only)
  const [formatMode, setFormatMode] = useState<UploadMode>("mobile");

  // Basic Form State
  const [title, setTitle] = useState("");
  const [rawDescription, setRawDescription] = useState("");
  const [category, setCategory] = useState("Lockscreen");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState("");
  const [dominantColor, setDominantColor] = useState("#111B2A");
  const [tagsInput, setTagsInput] = useState("lockscreen, minimal, dark");
  const [autoSyncHashtags, setAutoSyncHashtags] = useState(true);

  // Files & URLs
  const [mobileFile, setMobileFile] = useState<File | null>(null);
  const [mobilePreviewUrl, setMobilePreviewUrl] = useState<string>("");

  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [desktopPreviewUrl, setDesktopPreviewUrl] = useState<string>("");

  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number }>({
    width: 1170,
    height: 2532,
  });
  const [resolution, setResolution] = useState("1170 × 2532");

  // Interactive Phone Crop (For Dual Mode)
  const [cropPosition, setCropPosition] = useState<number>(50); // 0 to 100%
  const [isDragging, setIsDragging] = useState(false);
  const cropperContainerRef = useRef<HTMLDivElement>(null);

  // Submission & Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

  // Clear Toast Notification
  const [toast, setToast] = useState<ToastState>({
    show: false,
    type: "info",
    title: "",
    message: "",
  });

  const showToast = (type: "error" | "success" | "info", title: string, message: string) => {
    setToast({ show: true, type, title, message });
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Update default category and suggestions when formatMode switches
  useEffect(() => {
    if (formatMode === "mobile") {
      setCategory("Lockscreen");
      setTagsInput("lockscreen, minimal, dark, 4k");
      setResolution("1170 × 2532");
    } else {
      setCategory("Dark Abstract");
      setTagsInput("minimal, 4k, editorial, clean");
      setResolution("3840 × 2160");
    }
    setIsCustomCategory(false);
    setCustomCategoryInput("");
  }, [formatMode]);

  // Convert raw tags input to clean hashtags array e.g. ["#minimal", "#dark", "#4k"]
  const parsedHashtags = useMemo(() => {
    return tagsInput
      .split(",")
      .map((t) => t.trim().toLowerCase().replace(/[^a-z0-9]/g, ""))
      .filter(Boolean)
      .map((t) => `#${t}`);
  }, [tagsInput]);

  const hashtagString = useMemo(() => {
    return parsedHashtags.join(" ");
  }, [parsedHashtags]);

  // Combined description: User notes + synced hashtags at the bottom
  const fullDescription = useMemo(() => {
    const cleanRaw = rawDescription.trim();
    if (!autoSyncHashtags || parsedHashtags.length === 0) {
      return cleanRaw;
    }
    // If the raw description already ends with the hashtags, don't duplicate
    if (cleanRaw.endsWith(hashtagString)) {
      return cleanRaw;
    }
    return cleanRaw ? `${cleanRaw}\n\n${hashtagString}` : hashtagString;
  }, [rawDescription, autoSyncHashtags, parsedHashtags, hashtagString]);

  // Quick toggle tag handler
  const handleToggleTag = (tag: string) => {
    const clean = tag.toLowerCase().replace(/^#/, "").trim();
    const currentList = tagsInput
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    let updatedList: string[];
    if (currentList.includes(clean)) {
      updatedList = currentList.filter((t) => t !== clean);
    } else {
      updatedList = [...currentList, clean];
    }
    setTagsInput(updatedList.join(", "));
  };

  // Mobile Wallpaper File Handler (For Mobile-Only mode)
  const handleMobileFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMobileFile(file);
      const url = URL.createObjectURL(file);
      setMobilePreviewUrl(url);

      const img = new window.Image();
      img.onload = () => {
        const w = img.naturalWidth || 1170;
        const h = img.naturalHeight || 2532;
        setImageDimensions({ width: w, height: h });
        setResolution(`${w} × ${h}`);
      };
      img.src = url;
    }
  };

  // Desktop File Handler (For Dual / Desktop mode)
  const handleDesktopFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDesktopFile(file);
      const url = URL.createObjectURL(file);
      setDesktopPreviewUrl(url);

      const img = new window.Image();
      img.onload = () => {
        const w = img.naturalWidth || 3840;
        const h = img.naturalHeight || 2160;
        setImageDimensions({ width: w, height: h });
        setResolution(`${w} × ${h}`);
      };
      img.src = url;
    }
  };

  // Dual Cropper calculations
  const phoneRatio = 9 / 19.5;
  const imgAspect = imageDimensions.width / imageDimensions.height;
  const cropBoxWidthPercent =
    imgAspect >= phoneRatio
      ? Math.min(100, Math.max(16, (phoneRatio / imgAspect) * 100))
      : 100;
  const cropBoxLeftPercent = ((100 - cropBoxWidthPercent) * cropPosition) / 100;

  const updateCropFromPointer = (clientX: number) => {
    if (!cropperContainerRef.current) return;
    const rect = cropperContainerRef.current.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const containerWidth = rect.width;
    const boxWidthPx = containerWidth * (cropBoxWidthPercent / 100);
    const usableWidth = containerWidth - boxWidthPx;
    if (usableWidth <= 0) return;

    const targetLeft = clickX - boxWidthPx / 2;
    const clamped = Math.max(0, Math.min(usableWidth, targetLeft));
    const percent = Math.round((clamped / usableWidth) * 100);
    setCropPosition(percent);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    } catch {}
    setIsDragging(true);
    updateCropFromPointer(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    updateCropFromPointer(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
      } catch {}
    }
  };

  // Convert large files (> 3.5MB) to high-fidelity WebP on client to stay safely under Vercel's 4.5MB limit
  const optimizeLargeImageForUpload = async (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      // If already under 3.5 MB, send original file directly
      if (file.size <= 3.5 * 1024 * 1024) {
        return resolve(file);
      }

      const img = new window.Image();
      const objUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objUrl);
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(file);

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0);

        // High quality WebP 95% compresses a 15MB PNG to ~1.8MB with zero visual loss
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              resolve(blob);
            } else {
              resolve(file);
            }
          },
          "image/webp",
          0.95
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(objUrl);
        resolve(file);
      };
      img.src = objUrl;
    });
  };

  // Form Submit Handler
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // Validation based on formatMode
    if (formatMode === "mobile") {
      if (!mobileFile && !mobilePreviewUrl) {
        const msg = "Please select a vertical 9:16 / 9:19.5 mobile lockscreen wallpaper to upload.";
        setErrorMessage(msg);
        showToast("error", "Missing Image File", msg);
        return;
      }
    } else {
      if (!desktopFile && !desktopPreviewUrl) {
        const msg = "Please select a desktop master wallpaper file to upload.";
        setErrorMessage(msg);
        showToast("error", "Missing Image File", msg);
        return;
      }
    }

    if (!title.trim()) {
      const msg = "Please give your wallpaper drop an editorial title.";
      setErrorMessage(msg);
      showToast("error", "Missing Title", msg);
      return;
    }

    const finalCategory = isCustomCategory ? customCategoryInput.trim() : category;
    if (!finalCategory) {
      const msg = "Please specify a category for this wallpaper.";
      setErrorMessage(msg);
      showToast("error", "Missing Category", msg);
      return;
    }

    setIsSubmitting(true);

    try {
      if (!user) throw new Error("Your session expired. Please sign in again.");

      // 1. Get Firebase ID Token for verification
      const idToken = await user.getIdToken();

      // 2. Prepare Multipart Form Data
      const formData = new FormData();
      formData.append("formatMode", formatMode);
      formData.append("title", title.trim());
      formData.append("description", fullDescription);
      formData.append("category", finalCategory);
      formData.append("resolution", resolution);
      formData.append("dominantColor", dominantColor);
      formData.append("tags", tagsInput);
      formData.append("cropPosition", cropPosition.toString());

      // Prepare single primary image file
      const sourceFile = formatMode === "mobile" ? mobileFile : desktopFile;
      if (!sourceFile) {
        throw new Error("No wallpaper image file selected.");
      }

      // Optimize file if > 3.5MB to guarantee request body stays under Vercel's 4.5MB limit
      let finalFile: Blob = sourceFile;
      if (sourceFile.size > 3.5 * 1024 * 1024) {
        showToast(
          "info",
          "Optimizing Master Payload",
          "Converting high-res asset to WebP to ensure seamless cloud delivery..."
        );
        finalFile = await optimizeLargeImageForUpload(sourceFile);
      }

      // Append exactly one primary master file to avoid payload duplication
      if (formatMode === "mobile") {
        formData.append("phoneImage", finalFile, sourceFile.name);
      } else {
        formData.append("desktopImage", finalFile, sourceFile.name);
      }

      // 3. Post to Secured Route with robust error capture
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        body: formData,
      });

      // Safely read response text first to prevent JSON syntax crash
      const responseText = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(responseText);
      } catch {
        // Non-JSON response (e.g. gateway error, 500 HTML)
      }

      if (!res.ok) {
        const errorDetail =
          data?.error ||
          data?.message ||
          (responseText && responseText.length < 300
            ? responseText
            : `Server returned error (${res.status}: ${res.statusText || "Internal Server Error"})`);
        throw new Error(errorDetail);
      }

      // 4. Client-side Firestore sync fallback if serverless environment lacks service account
      if (data?.wallpaper && !data?.firestoreSaved) {
        try {
          await setDoc(doc(db, "wallpapers", data.wallpaper.id), data.wallpaper);
        } catch (clientDbErr: any) {
          console.warn("Client Firestore backup sync note:", clientDbErr?.message);
        }
      }

      setSuccess(true);
      showToast(
        "success",
        "Drop Published Successfully!",
        `"${title}" is stored in Cloudflare R2 and indexed.`
      );

      setTimeout(() => {
        router.push(`/${profile?.username || "xweet"}`);
      }, 1600);
    } catch (err: any) {
      const detailedMessage =
        err?.message || "An unexpected error occurred while transferring to Cloudflare R2.";
      setErrorMessage(detailedMessage);
      showToast("error", "Upload Failed", detailedMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Require Auth
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
        <div className="border border-border bg-surface p-8 max-w-md w-full text-center">
          <h2 className="font-sans text-xl font-semibold text-foreground">Author Login Required</h2>
          <p className="font-sans text-sm text-muted-foreground mt-1.5">
            You must be signed in to publish wallpapers to the catalog.
          </p>
          <Button href="/login" variant="primary" className="mt-5 w-full">
            Sign In / Register
          </Button>
        </div>
      </div>
    );
  }

  const isXweet = profile?.username?.toLowerCase() === "xweet";
  const activeSuggestedCategories = formatMode === "mobile" ? MOBILE_CATEGORIES : CATEGORIES.filter((c) => c !== "All");
  const popularTags = formatMode === "mobile" ? POPULAR_MOBILE_TAGS : POPULAR_DESKTOP_TAGS;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground selection:bg-secondary">
      {/* Toast Notification Container */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 right-5 z-50 max-w-md w-full shadow-2xl pointer-events-auto"
          >
            <div
              className={`p-4 border flex items-start gap-3 backdrop-blur-md ${
                toast.type === "error"
                  ? "bg-destructive/15 border-destructive text-destructive-foreground shadow-[0_10px_30px_rgba(239,68,68,0.2)]"
                  : toast.type === "success"
                  ? "bg-emerald-950/80 border-emerald-500 text-emerald-100 shadow-[0_10px_30px_rgba(16,185,129,0.2)]"
                  : "bg-surface/95 border-border text-foreground"
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {toast.type === "error" ? (
                  <IconAlertCircle size={20} className="text-destructive" />
                ) : toast.type === "success" ? (
                  <IconCheck size={20} className="text-emerald-400" />
                ) : (
                  <IconSparkles size={20} className="text-primary" />
                )}
              </div>

              <div className="flex-1">
                <h5 className="font-sans text-xs font-semibold tracking-wide uppercase">
                  {toast.title}
                </h5>
                <p className="font-sans text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {toast.message}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setToast((prev) => ({ ...prev, show: false }))}
                className="text-muted-foreground hover:text-foreground p-1 transition-colors"
              >
                <IconX size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navigation */}
      <div className="border-b border-border py-4 px-6 lg:px-12 bg-surface">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <IconArrowLeft size={14} />
            <span>RETURN TO CATALOG</span>
          </Link>

          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span>AUTHOR:</span>
            <span className="text-primary font-bold">@{profile?.username}</span>
            {isXweet && (
              <span className="flex items-center gap-1 text-primary text-[10px] bg-secondary/60 px-1.5 py-0.5 border border-border">
                <IconShieldCheck size={12} />
                <span>OFFICIAL XWEET</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Upload Content */}
      <div className="mx-auto max-w-6xl w-full px-6 py-8 lg:py-12 flex-1">
        <div className="mb-8 pb-6 border-b border-border">
          <span className="font-mono text-xs font-semibold text-primary uppercase tracking-wider">
            Curator Asset Pipeline
          </span>
          <h1 className="font-sans text-3xl font-semibold tracking-tight text-foreground mt-1">
            Publish New Wallpaper Drop
          </h1>
          <p className="font-sans text-xs sm:text-sm text-muted-foreground mt-1">
            Distribute high-resolution master artwork directly to Cloudflare R2 CDN with synchronized mobile lockscreen editions.
          </p>
        </div>

        {/* Inline Error Banner */}
        {errorMessage && (
          <div className="mb-6 flex items-start gap-3 border border-destructive/60 bg-destructive/10 p-4 text-xs text-destructive">
            <IconAlertCircle size={18} className="shrink-0 mt-0.5 text-destructive" />
            <div className="flex-1">
              <span className="font-semibold uppercase tracking-wider block font-mono text-[11px]">
                Upload Error
              </span>
              <p className="mt-0.5 text-foreground/90">{errorMessage}</p>
            </div>
          </div>
        )}

        {success ? (
          <div className="border border-primary bg-secondary/30 p-12 text-center">
            <div className="h-12 w-12 bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4">
              <IconCheck size={24} />
            </div>
            <h2 className="font-sans text-2xl font-semibold text-foreground">Uploaded & Indexed!</h2>
            <p className="font-sans text-sm text-muted-foreground mt-1">
              Your wallpaper is stored in Cloudflare R2 and published in Firestore. Redirecting to your showcase...
            </p>
          </div>
        ) : (
          <form onSubmit={handlePublish} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Form Left: Metadata & File Dropzone (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              
              {/* 1. UPLOAD FORMAT SELECTOR TABS */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-2">
                  Select Wallpaper Format Mode <span className="text-primary">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Mode 1: Mobile Only */}
                  <button
                    type="button"
                    onClick={() => setFormatMode("mobile")}
                    className={`flex flex-col items-start p-3.5 border text-left transition-all cursor-pointer ${
                      formatMode === "mobile"
                        ? "bg-primary/10 border-primary ring-1 ring-primary shadow-xs"
                        : "bg-surface border-border hover:border-primary/60 text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1.5">
                      <IconDeviceMobile
                        size={20}
                        className={formatMode === "mobile" ? "text-primary" : "text-muted-foreground"}
                      />
                      <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 bg-background border border-border text-foreground font-semibold">
                        9:19.5
                      </span>
                    </div>
                    <span className="font-sans text-xs font-semibold text-foreground">
                      Mobile Only
                    </span>
                    <span className="font-sans text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                      Vertical lockscreen. Zero desktop requirement.
                    </span>
                  </button>

                  {/* Mode 2: Dual Setup */}
                  <button
                    type="button"
                    onClick={() => setFormatMode("dual")}
                    className={`flex flex-col items-start p-3.5 border text-left transition-all cursor-pointer ${
                      formatMode === "dual"
                        ? "bg-primary/10 border-primary ring-1 ring-primary shadow-xs"
                        : "bg-surface border-border hover:border-primary/60 text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1.5">
                      <div className="flex items-center gap-1">
                        <IconDeviceDesktop
                          size={18}
                          className={formatMode === "dual" ? "text-primary" : "text-muted-foreground"}
                        />
                        <span className="text-muted-foreground text-xs">+</span>
                        <IconDeviceMobile
                          size={16}
                          className={formatMode === "dual" ? "text-primary" : "text-muted-foreground"}
                        />
                      </div>
                      <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 bg-background border border-border text-foreground font-semibold">
                        DUAL
                      </span>
                    </div>
                    <span className="font-sans text-xs font-semibold text-foreground">
                      Desktop + Mobile
                    </span>
                    <span className="font-sans text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                      16:9 master with interactive visual phone cropper.
                    </span>
                  </button>

                  {/* Mode 3: Desktop Only */}
                  <button
                    type="button"
                    onClick={() => setFormatMode("desktop")}
                    className={`flex flex-col items-start p-3.5 border text-left transition-all cursor-pointer ${
                      formatMode === "desktop"
                        ? "bg-primary/10 border-primary ring-1 ring-primary shadow-xs"
                        : "bg-surface border-border hover:border-primary/60 text-muted-foreground"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1.5">
                      <IconDeviceDesktop
                        size={20}
                        className={formatMode === "desktop" ? "text-primary" : "text-muted-foreground"}
                      />
                      <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 bg-background border border-border text-foreground font-semibold">
                        16:9
                      </span>
                    </div>
                    <span className="font-sans text-xs font-semibold text-foreground">
                      Desktop Only
                    </span>
                    <span className="font-sans text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                      Master 4K/5K desktop background only.
                    </span>
                  </button>
                </div>
              </div>

              {/* 2. TITLE */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Wallpaper Title <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={formatMode === "mobile" ? "e.g. Neon Horizon Lockscreen" : "e.g. Serene Terracotta Fold"}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-11 w-full rounded-none border border-border bg-surface px-4 font-sans text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>

              {/* 3. EXTENSIBLE CATEGORY SELECTOR */}
              <div className="border border-border bg-surface p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Discipline / Category <span className="text-primary">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomCategory(!isCustomCategory);
                      if (!isCustomCategory) {
                        setCustomCategoryInput("");
                      }
                    }}
                    className="font-mono text-[11px] text-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <IconPlus size={12} />
                    <span>{isCustomCategory ? "Choose From Presets" : "+ Create Custom Category"}</span>
                  </button>
                </div>

                {isCustomCategory ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cyberpunk Tokyo, AMOLED Abstract, Nordic Cozy..."
                      value={customCategoryInput}
                      onChange={(e) => setCustomCategoryInput(e.target.value)}
                      className="h-10 flex-1 rounded-none border border-primary bg-background px-3 font-sans text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomCategory(false)}
                      className="h-10 px-3 bg-secondary text-secondary-foreground font-mono text-xs border border-border cursor-pointer hover:bg-muted"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    <select
                      value={category}
                      onChange={(e) => {
                        if (e.target.value === "__NEW__") {
                          setIsCustomCategory(true);
                        } else {
                          setCategory(e.target.value);
                        }
                      }}
                      className="h-10 w-full rounded-none border border-border bg-background px-3 font-sans text-xs text-foreground focus:border-primary focus:outline-none"
                    >
                      {activeSuggestedCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="__NEW__">+ Add Custom Category...</option>
                    </select>

                    {/* Quick Category Chips */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="font-mono text-[10px] uppercase text-muted-foreground mr-1">
                        Quick Pick:
                      </span>
                      {activeSuggestedCategories.slice(0, 6).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCategory(cat)}
                          className={`px-2 py-0.5 font-mono text-[11px] border transition-colors cursor-pointer ${
                            category === cat
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-surface border-border text-muted-foreground hover:text-foreground hover:border-primary"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 4. FILE DROPZONE BASED ON MODE */}
              {formatMode === "mobile" ? (
                /* Mobile Master File Dropzone */
                <div className="border border-border bg-surface p-5">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
                    <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase text-foreground">
                      <IconDeviceMobile size={18} className="text-primary" />
                      <span>Mobile Lockscreen Wallpaper File (9:16 or 9:19.5) <span className="text-primary">*</span></span>
                    </div>
                    <span className="font-mono text-[10px] text-primary bg-secondary/60 px-2 py-0.5 border border-border">
                      {resolution}
                    </span>
                  </div>

                  <div className="border-2 border-dashed border-border bg-background p-8 text-center hover:border-primary transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*"
                      required={formatMode === "mobile"}
                      onChange={handleMobileFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="flex flex-col items-center gap-2 pointer-events-none">
                      <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center text-primary">
                        <IconDeviceMobile size={26} />
                      </div>
                      <span className="font-sans text-sm font-medium text-foreground">
                        {mobileFile ? mobileFile.name : "Select or drag vertical phone wallpaper"}
                      </span>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {mobileFile
                          ? `${(mobileFile.size / (1024 * 1024)).toFixed(2)} MB • ${resolution} • Ready`
                          : "Supports 9:16 / 9:19.5 WebP, PNG, JPG (e.g. 1170 × 2532, 1290 × 2796)"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Desktop Master File Dropzone */
                <div className="border border-border bg-surface p-5">
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
                    <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase text-foreground">
                      <IconPhoto size={18} className="text-primary" />
                      <span>Desktop Master Wallpaper File (16:9 or 16:10) <span className="text-primary">*</span></span>
                    </div>
                    <span className="font-mono text-[10px] text-primary bg-secondary/60 px-2 py-0.5 border border-border">
                      {resolution}
                    </span>
                  </div>

                  <div className="border-2 border-dashed border-border bg-background p-7 text-center hover:border-primary transition-colors cursor-pointer relative">
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={handleDesktopFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="flex flex-col items-center gap-2 pointer-events-none">
                      <IconPhoto size={28} className="text-primary" />
                      <span className="font-sans text-sm font-medium text-foreground">
                        {desktopFile ? desktopFile.name : "Click or drag 4K/5K desktop master wallpaper"}
                      </span>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {desktopFile
                          ? `${(desktopFile.size / (1024 * 1024)).toFixed(2)} MB • Ready`
                          : "Supports WebP, PNG, JPG (Max 50MB)"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. INTERACTIVE PHONE CROPPER (ONLY IN DUAL MODE) */}
              {formatMode === "dual" && (
                <div className="border border-border bg-surface p-5">
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div className="flex items-center gap-2 text-foreground font-mono text-xs font-semibold uppercase tracking-wider">
                      <IconCrop size={16} className="text-primary" />
                      <span>Interactive Phone Crop Studio (9:19.5)</span>
                    </div>
                    {desktopPreviewUrl && (
                      <span className="font-mono text-[11px] text-primary bg-secondary/60 px-2 py-0.5 border border-border">
                        Framing: {cropPosition}%
                      </span>
                    )}
                  </div>

                  <p className="font-sans text-xs text-muted-foreground mt-2">
                    Frame your companion lockscreen directly on this canvas. It is extracted losslessly at 1170 × 2532 into your drop.
                  </p>

                  {desktopPreviewUrl ? (
                    <div className="flex flex-col gap-3 mt-3">
                      {/* Visual Interactive Cropping Canvas */}
                      <div
                        ref={cropperContainerRef}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        className="relative w-full aspect-[16/9] sm:aspect-[16/10] bg-black/40 border-2 border-border overflow-hidden select-none cursor-ew-resize touch-none shadow-inner"
                        title="Click or drag horizontally to frame phone lockscreen"
                      >
                        <img
                          src={desktopPreviewUrl}
                          alt="Master wallpaper"
                          className="w-full h-full object-cover select-none pointer-events-none"
                          draggable={false}
                        />

                        {/* Darkened mask: Left */}
                        <div
                          className="absolute inset-y-0 left-0 bg-black/65 backdrop-blur-[1px] pointer-events-none transition-all duration-75"
                          style={{ width: `${cropBoxLeftPercent}%` }}
                        />

                        {/* Darkened mask: Right */}
                        <div
                          className="absolute inset-y-0 right-0 bg-black/65 backdrop-blur-[1px] pointer-events-none transition-all duration-75"
                          style={{
                            width: `${Math.max(0, 100 - (cropBoxLeftPercent + cropBoxWidthPercent))}%`,
                          }}
                        />

                        {/* Active 9:19.5 Window */}
                        <div
                          className="absolute inset-y-0 border-2 border-white shadow-[0_0_25px_rgba(0,0,0,0.85)] flex flex-col justify-between p-2 pointer-events-none transition-all duration-75"
                          style={{
                            left: `${cropBoxLeftPercent}%`,
                            width: `${cropBoxWidthPercent}%`,
                          }}
                        >
                          <div className="flex items-center justify-between pointer-events-none">
                            <span className="bg-black/80 text-white font-mono text-[9px] px-1.5 py-0.5 border border-white/20">
                              9:19.5
                            </span>
                            <span className="bg-primary text-primary-foreground font-mono text-[9px] px-1.5 py-0.5">
                              LOCKSCREEN
                            </span>
                          </div>

                          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                            <div className="border-r border-b border-white/30" />
                            <div className="border-r border-b border-white/30" />
                            <div className="border-b border-white/30" />
                            <div className="border-r border-b border-white/30" />
                            <div className="border-r border-b border-white/30" />
                            <div className="border-b border-white/30" />
                            <div className="border-r border-b border-white/30" />
                            <div className="border-r border-b border-white/30" />
                            <div />
                          </div>

                          <div className="self-center bg-black/80 text-white p-1.5 rounded-full border border-white/40 shadow-lg pointer-events-none">
                            <IconArrowsHorizontal size={15} />
                          </div>

                          <div className="self-center bg-black/80 text-white/90 font-mono text-[9px] px-2 py-0.5 border border-white/20 pointer-events-none">
                            Drag to Frame
                          </div>
                        </div>
                      </div>

                      {/* Presets and Slider */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs text-muted-foreground uppercase mr-1">
                            Preset:
                          </span>
                          <button
                            type="button"
                            onClick={() => setCropPosition(0)}
                            className={`h-7 px-2.5 text-xs font-mono uppercase border transition-colors cursor-pointer select-none ${
                              cropPosition === 0
                                ? "bg-primary text-primary-foreground border-primary font-semibold"
                                : "bg-surface border-border text-foreground hover:border-primary"
                            }`}
                          >
                            Left (0%)
                          </button>
                          <button
                            type="button"
                            onClick={() => setCropPosition(50)}
                            className={`h-7 px-2.5 text-xs font-mono uppercase border transition-colors cursor-pointer select-none ${
                              cropPosition === 50
                                ? "bg-primary text-primary-foreground border-primary font-semibold"
                                : "bg-surface border-border text-foreground hover:border-primary"
                            }`}
                          >
                            Center (50%)
                          </button>
                          <button
                            type="button"
                            onClick={() => setCropPosition(100)}
                            className={`h-7 px-2.5 text-xs font-mono uppercase border transition-colors cursor-pointer select-none ${
                              cropPosition === 100
                                ? "bg-primary text-primary-foreground border-primary font-semibold"
                                : "bg-surface border-border text-foreground hover:border-primary"
                            }`}
                          >
                            Right (100%)
                          </button>
                        </div>

                        <div className="flex items-center gap-2 flex-1 sm:max-w-xs">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={cropPosition}
                            onChange={(e) => setCropPosition(Number(e.target.value))}
                            className="w-full accent-primary cursor-pointer h-2 bg-border rounded-none"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 border border-dashed border-border bg-background text-center text-xs font-mono text-muted-foreground mt-2">
                      Upload a desktop wallpaper above to activate interactive phone cropper.
                    </div>
                  )}
                </div>
              )}

              {/* 6. TAGS & AUTOMATIC HASHTAG IN DESCRIPTION */}
              <div className="border border-border bg-surface p-4 flex flex-col gap-4">
                {/* Tags Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <IconHash size={14} className="text-primary" />
                      <span>Tags (Comma Separated)</span>
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="checkbox"
                        id="autoSyncHashtagsToggle"
                        checked={autoSyncHashtags}
                        onChange={(e) => setAutoSyncHashtags(e.target.checked)}
                        className="h-3.5 w-3.5 rounded-none accent-primary cursor-pointer"
                      />
                      <label
                        htmlFor="autoSyncHashtagsToggle"
                        className="font-mono text-[11px] text-primary cursor-pointer hover:underline"
                      >
                        Auto-sync into description
                      </label>
                    </div>
                  </div>

                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="e.g. minimal, lockscreen, dark, amoled, 4k"
                    className="h-10 w-full rounded-none border border-border bg-background px-3 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
                  />

                  {/* Popular Tag Pills for 1-click addition */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    <span className="font-mono text-[10px] uppercase text-muted-foreground mr-1">
                      Suggestions:
                    </span>
                    {popularTags.map((tag) => {
                      const isSelected = parsedHashtags.includes(`#${tag}`);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleToggleTag(tag)}
                          className={`px-2 py-0.5 font-mono text-[10px] border transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary font-semibold"
                              : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-primary"
                          }`}
                        >
                          #{tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Editorial Description Textarea */}
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Editorial Description (With Synced #Hashtags)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Short notes on texture, lighting, and composition..."
                    value={rawDescription}
                    onChange={(e) => setRawDescription(e.target.value)}
                    className="w-full rounded-none border border-border bg-background p-3 font-sans text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />

                  {/* Live Synced Hashtags Preview */}
                  {autoSyncHashtags && parsedHashtags.length > 0 && (
                    <div className="mt-2 p-2 bg-background border border-border/80 flex flex-wrap items-center gap-1 text-[11px] font-mono text-primary">
                      <span className="text-muted-foreground text-[10px] uppercase mr-1">
                        Active #Hashtags:
                      </span>
                      {parsedHashtags.map((ht) => (
                        <span key={ht} className="bg-secondary/70 px-1.5 py-0.5 border border-border/60">
                          {ht}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 7. DOMINANT TONE COLOR PICKER */}
              <div className="border border-border bg-surface p-4">
                <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                  <IconPalette size={14} className="text-primary" />
                  <span>Dominant Tone Palette</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={dominantColor}
                    onChange={(e) => setDominantColor(e.target.value)}
                    className="h-10 w-14 rounded-none border border-border bg-background cursor-pointer p-1"
                  />
                  <input
                    type="text"
                    value={dominantColor}
                    onChange={(e) => setDominantColor(e.target.value)}
                    className="h-10 flex-1 rounded-none border border-border bg-background px-3 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                  <div className="flex items-center gap-1.5">
                    {["#111B2A", "#D6C7B2", "#0D0D11", "#2D3748", "#8B5CF6", "#E11D48"].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setDominantColor(c)}
                        style={{ backgroundColor: c }}
                        className="h-6 w-6 border border-border/80 hover:scale-110 transition-transform cursor-pointer"
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full mt-2 h-12 text-sm font-semibold tracking-wide"
              >
                <IconUpload size={18} />
                <span>
                  {isSubmitting
                    ? "Publishing & Transferring Assets to Cloudflare R2..."
                    : formatMode === "mobile"
                    ? "Publish Mobile Lockscreen Drop"
                    : "Publish Wallpaper Drop"}
                </span>
              </Button>
            </div>

            {/* Form Right: Live Visual Preview (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Live Viewport Preview
                </span>
                <span className="font-mono text-[10px] text-primary uppercase font-semibold">
                  {formatMode === "mobile" ? "9:19.5 Handheld" : formatMode === "dual" ? "Desktop + Phone" : "16:9 Desktop"}
                </span>
              </div>

              {/* BRANCH A: MOBILE ONLY PREVIEW (Enlarged Phone Mockup) */}
              {formatMode === "mobile" ? (
                <div className="border border-border bg-surface p-6 flex flex-col items-center">
                  {/* Phone Device Mockup Frame */}
                  <div className="relative w-64 aspect-[9/19.5] rounded-[38px] border-[5px] border-neutral-700 bg-black shadow-2xl overflow-hidden ring-1 ring-white/10 select-none">
                    {mobilePreviewUrl ? (
                      <img
                        src={mobilePreviewUrl}
                        alt="Mobile Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-black/90 text-muted-foreground gap-3 p-6 text-center">
                        <IconDeviceMobile size={36} className="text-muted-foreground/60" />
                        <span className="font-mono text-xs">Awaiting mobile image selection...</span>
                      </div>
                    )}

                    {/* Realistic Lockscreen Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 pointer-events-none flex flex-col justify-between p-5 text-center">
                      {/* Dynamic Island / Notch */}
                      <div className="self-center w-24 h-5 bg-black rounded-full border border-white/10" />

                      {/* Lockscreen Time & Date */}
                      <div className="pt-4">
                        <p className="font-mono text-[11px] uppercase tracking-wider text-white/80 font-medium">
                          Wednesday, Oct 14
                        </p>
                        <h3 className="font-sans text-5xl font-light text-white tracking-tight drop-shadow-md">
                          09:41
                        </h3>
                      </div>

                      {/* Bottom Home Indicator */}
                      <div className="w-24 h-1 bg-white/70 rounded-full mx-auto mb-1" />
                    </div>
                  </div>

                  {/* Card Details & Synced Tags */}
                  <div className="w-full mt-5 pt-4 border-t border-border">
                    <div className="flex items-center justify-between">
                      <h4 className="font-sans text-sm font-semibold text-foreground truncate">
                        {title || "Untitled Mobile Drop"}
                      </h4>
                      <span className="font-mono text-[10px] text-muted-foreground bg-background px-1.5 py-0.5 border border-border">
                        {resolution}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <span className="bg-primary text-primary-foreground font-mono text-[9px] px-2 py-0.5 uppercase font-medium">
                        {isCustomCategory ? customCategoryInput || "Custom" : category}
                      </span>
                      <span className="bg-surface text-primary font-mono text-[9px] px-2 py-0.5 uppercase border border-border flex items-center gap-1 font-semibold">
                        <IconDeviceMobile size={11} />
                        <span>MOBILE ONLY</span>
                      </span>
                    </div>

                    {/* Synced Hashtags Display */}
                    {parsedHashtags.length > 0 && (
                      <p className="font-mono text-[11px] text-primary/90 mt-3 line-clamp-2 leading-relaxed">
                        {hashtagString}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                /* BRANCH B: DUAL OR DESKTOP PREVIEW */
                <div className="flex flex-col gap-4">
                  {/* Desktop Master Card */}
                  <div className="border border-border bg-surface p-3.5">
                    <span className="font-mono text-[10px] uppercase text-muted-foreground block mb-2 font-medium">
                      Desktop Viewport
                    </span>
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/40 border border-border/60">
                      {desktopPreviewUrl ? (
                        <img
                          src={desktopPreviewUrl}
                          alt="Desktop Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                          <IconPhoto size={28} />
                          <span className="font-mono text-xs">Awaiting desktop master...</span>
                        </div>
                      )}

                      <div className="absolute top-2 left-2 flex items-center gap-1.5 font-mono text-[9px]">
                        <span className="bg-primary text-primary-foreground px-2 py-0.5 uppercase">
                          {isCustomCategory ? customCategoryInput || "Custom" : category}
                        </span>
                        {formatMode === "dual" && (
                          <span className="bg-surface/90 text-foreground px-2 py-0.5 border border-border uppercase flex items-center gap-1">
                            <IconDeviceMobile size={10} />
                            PHONE INCLUDED
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 pb-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-sans text-sm font-semibold text-foreground truncate">
                          {title || "Untitled Master"}
                        </h4>
                        <span className="font-mono text-[10px] text-muted-foreground">{resolution}</span>
                      </div>

                      {parsedHashtags.length > 0 && (
                        <p className="font-mono text-[11px] text-primary/90 mt-2 line-clamp-2">
                          {hashtagString}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Dual Mode: Synchronized Phone Mockup */}
                  {formatMode === "dual" && (
                    <div className="border border-border bg-surface p-4 flex items-center gap-4">
                      <div className="relative w-24 aspect-[9/19.5] rounded-[18px] overflow-hidden border-2 border-neutral-700 bg-black shadow-xl shrink-0 select-none">
                        {desktopPreviewUrl ? (
                          <img
                            src={desktopPreviewUrl}
                            alt="Phone crop preview"
                            style={{
                              objectPosition: `${cropPosition}% center`,
                            }}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-black/80 text-muted-foreground">
                            <IconDeviceMobile size={22} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />
                        <div className="absolute top-2 inset-x-0 text-center font-mono text-[8px] text-white/90 font-semibold pointer-events-none">
                          9:41
                        </div>
                        <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none">
                          <div className="w-8 h-1 bg-white/70 rounded-full" />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-[10px] uppercase text-primary font-bold flex items-center gap-1.5">
                          <IconCheck size={13} />
                          9:19.5 LOCKSCREEN CROP SYNCED
                        </span>
                        <span className="font-mono text-[11px] text-foreground font-medium">
                          1170 × 2532 Lossless Companion
                        </span>
                        <p className="font-sans text-xs text-muted-foreground mt-0.5 leading-relaxed">
                          Framing updates automatically as you slide the cropper window. Both desktop and phone will be delivered together.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </form>
        )}
      </div>

      <div className="border-t border-border py-4 px-6 text-center text-[11px] font-mono text-muted-foreground">
        SECURE FIREBASE TOKEN VERIFICATION • CLOUDFLARE R2 CDN • FIRESTORE INDEXED
      </div>
    </div>
  );
}
