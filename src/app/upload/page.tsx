"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
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
} from "@tabler/icons-react";
import { CATEGORIES } from "@/lib/wallpapers";

export default function UploadPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Warm Neutrals");
  const [dominantColor, setDominantColor] = useState("#D6C7B2");
  const [tagsInput, setTagsInput] = useState("Minimal, 4K, Editorial");

  // Files & URLs
  const [desktopFile, setDesktopFile] = useState<File | null>(null);
  const [desktopPreviewUrl, setDesktopPreviewUrl] = useState<string>("");
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number }>({
    width: 3840,
    height: 2160,
  });
  const [resolution, setResolution] = useState("3840 × 2160");

  // Interactive Phone Crop (9:19.5 lockscreen ratio)
  const [cropPosition, setCropPosition] = useState<number>(50); // 0 to 100%
  const [isDragging, setIsDragging] = useState(false);
  const cropperContainerRef = useRef<HTMLDivElement>(null);

  // Optional alternative separate file upload
  const [useSeparateFile, setUseSeparateFile] = useState(false);
  const [phoneFile, setPhoneFile] = useState<File | null>(null);
  const [phonePreviewUrl, setPhonePreviewUrl] = useState<string>("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

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

  // Phone ratio: 9 / 19.5 (~0.4615)
  const phoneRatio = 9 / 19.5;
  const imgAspect = imageDimensions.width / imageDimensions.height;
  const cropBoxWidthPercent =
    imgAspect >= phoneRatio
      ? Math.min(100, Math.max(16, (phoneRatio / imgAspect) * 100))
      : 100;
  const cropBoxLeftPercent = ((100 - cropBoxWidthPercent) * cropPosition) / 100;

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

  const handlePhoneFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoneFile(file);
      setPhonePreviewUrl(URL.createObjectURL(file));
    }
  };

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

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!desktopFile && !desktopPreviewUrl) {
      setErrorMessage("Please select a desktop master wallpaper file to upload.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (!user) throw new Error("User session expired. Please sign in again.");

      // 1. Get Firebase ID Token for authentication
      const idToken = await user.getIdToken();

      // 2. Prepare FormData
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("resolution", resolution);
      formData.append("dominantColor", dominantColor);
      formData.append("tags", tagsInput);
      formData.append("cropPosition", cropPosition.toString());

      if (desktopFile) {
        formData.append("desktopImage", desktopFile);
      }

      if (useSeparateFile && phoneFile) {
        formData.append("phoneImage", phoneFile);
      }

      // 3. Post to Secured Server Route
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to upload wallpaper.");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/${profile?.username || "xweet"}`);
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err?.message || "Failed to publish wallpaper.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground selection:bg-secondary">
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
      <div className="mx-auto max-w-5xl w-full px-6 py-10 lg:py-14 flex-1">
        <div className="mb-8 pb-6 border-b border-border">
          <span className="font-mono text-xs font-semibold text-primary uppercase tracking-wider">
            Secured Curator Pipeline
          </span>
          <h1 className="font-sans text-3xl font-semibold tracking-tight text-foreground mt-1">
            Publish New Wallpaper Drop
          </h1>
          <p className="font-sans text-xs sm:text-sm text-muted-foreground mt-1">
            Transfers image securely to Cloudflare R2 bucket with custom CDN delivery, and indexes metadata directly in Firestore.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 flex items-start gap-2.5 border border-destructive/40 bg-destructive/10 p-3.5 text-xs text-destructive">
            <IconAlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
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
            {/* Form Left: Metadata (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Title */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Wallpaper Title <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Serene Terracotta Fold"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-11 w-full rounded-none border border-border bg-surface px-4 font-sans text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Editorial Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Short notes on texture, lighting, and composition..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-none border border-border bg-surface p-3 font-sans text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>

              {/* Category & Resolution Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Discipline / Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-11 w-full rounded-none border border-border bg-surface px-3 font-sans text-sm text-foreground focus:border-primary focus:outline-none"
                  >
                    {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Master Resolution
                  </label>
                  <input
                    type="text"
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    placeholder="3840 × 2160"
                    className="h-11 w-full rounded-none border border-border bg-surface px-3 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Desktop Image File Picker */}
              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Primary Desktop Master File (Cloudflare R2) <span className="text-primary">*</span>
                </label>
                <div className="border border-dashed border-border bg-surface p-6 text-center hover:border-primary transition-colors cursor-pointer relative">
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
                      {desktopFile ? desktopFile.name : "Click or drag 4K/5K desktop wallpaper"}
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {desktopFile ? `${(desktopFile.size / (1024 * 1024)).toFixed(2)} MB • Ready` : "Supports WebP, PNG, JPG (Max 50MB)"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Color & Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Dominant Tone (Hex)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={dominantColor}
                      onChange={(e) => setDominantColor(e.target.value)}
                      className="h-11 w-12 rounded-none border border-border bg-surface cursor-pointer p-1"
                    />
                    <input
                      type="text"
                      value={dominantColor}
                      onChange={(e) => setDominantColor(e.target.value)}
                      className="h-11 flex-1 rounded-none border border-border bg-surface px-3 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">
                    Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Minimal, Texture, 4K"
                    className="h-11 w-full rounded-none border border-border bg-surface px-3 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* ASSET GENERATION & INTERACTIVE PHONE LOCKSCREEN CROPPER */}
              <div className="border border-border bg-surface p-5 mt-2">
                <div className="flex flex-col gap-3">
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

                  <p className="font-sans text-xs text-muted-foreground">
                    Frame your companion phone lockscreen directly on this page. We extract the exact pixels from your raw 4K master into an uncompressed 1170 × 2532 phone edition.
                  </p>

                  {desktopPreviewUrl ? (
                    <div className="flex flex-col gap-3 mt-1">
                      {/* Visual Interactive Cropping Canvas */}
                      <div
                        ref={cropperContainerRef}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        className="relative w-full aspect-[16/9] sm:aspect-[16/10] bg-black/40 border-2 border-border overflow-hidden select-none cursor-ew-resize touch-none shadow-inner"
                        title="Click or drag to position phone lockscreen crop"
                      >
                        {/* Background Master Image */}
                        <img
                          src={desktopPreviewUrl}
                          alt="Master wallpaper"
                          className="w-full h-full object-cover select-none pointer-events-none"
                          draggable={false}
                        />

                        {/* Darkened mask: Left side */}
                        <div
                          className="absolute inset-y-0 left-0 bg-black/65 backdrop-blur-[1px] pointer-events-none transition-all duration-75"
                          style={{ width: `${cropBoxLeftPercent}%` }}
                        />

                        {/* Darkened mask: Right side */}
                        <div
                          className="absolute inset-y-0 right-0 bg-black/65 backdrop-blur-[1px] pointer-events-none transition-all duration-75"
                          style={{
                            width: `${Math.max(0, 100 - (cropBoxLeftPercent + cropBoxWidthPercent))}%`,
                          }}
                        />

                        {/* Active 9:19.5 Phone Crop Window */}
                        <div
                          className="absolute inset-y-0 border-2 border-white shadow-[0_0_25px_rgba(0,0,0,0.85)] flex flex-col justify-between p-2 pointer-events-none transition-all duration-75"
                          style={{
                            left: `${cropBoxLeftPercent}%`,
                            width: `${cropBoxWidthPercent}%`,
                          }}
                        >
                          {/* Top Badges */}
                          <div className="flex items-center justify-between pointer-events-none">
                            <span className="bg-black/80 text-white font-mono text-[9px] px-1.5 py-0.5 border border-white/20">
                              9:19.5
                            </span>
                            <span className="bg-primary text-primary-foreground font-mono text-[9px] px-1.5 py-0.5">
                              LOCKSCREEN
                            </span>
                          </div>

                          {/* Rule of Thirds Visual Grid */}
                          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                            <div className="border-r border-b border-white/30" />
                            <div className="border-r border-b border-white/30" />
                            <div className="border-b border-white/30" />
                            <div className="border-r border-b border-white/30" />
                            <div className="border-r border-b border-white/30" />
                            <div className="border-b border-white/30" />
                            <div className="border-r border-white/30" />
                            <div className="border-r border-white/30" />
                            <div />
                          </div>

                          {/* Center Grab Handle */}
                          <div className="self-center bg-black/80 text-white p-1.5 rounded-full border border-white/40 shadow-lg pointer-events-none">
                            <IconArrowsHorizontal size={15} />
                          </div>

                          {/* Bottom Hint */}
                          <div className="self-center bg-black/80 text-white/90 font-mono text-[9px] px-2 py-0.5 border border-white/20 pointer-events-none">
                            Drag to Frame
                          </div>
                        </div>
                      </div>

                      {/* Presets and Slider Controls */}
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

                        {/* Precision Slider */}
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

                      <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pt-2 border-t border-border/60">
                        <span className="flex items-center gap-1.5 text-primary font-medium">
                          <IconSparkles size={13} />
                          Target: 1170 × 2532 Lossless PNG (9:19.5)
                        </span>
                        <span>Auto-synchronized</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 border border-dashed border-border bg-background text-center text-xs font-mono text-muted-foreground">
                      Upload a desktop wallpaper above to enable the interactive phone cropper.
                    </div>
                  )}

                  {/* Optional Separate File Override */}
                  <div className="pt-3 border-t border-border/60">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="separateFileToggle"
                        checked={useSeparateFile}
                        onChange={(e) => setUseSeparateFile(e.target.checked)}
                        className="h-3.5 w-3.5 rounded-none accent-primary cursor-pointer"
                      />
                      <label
                        htmlFor="separateFileToggle"
                        className="font-mono text-xs text-muted-foreground cursor-pointer hover:text-foreground"
                      >
                        Upload a completely separate mobile artwork file instead of cropping
                      </label>
                    </div>

                    {useSeparateFile && (
                      <div className="mt-3 p-3 border border-border bg-background">
                        <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">
                          Separate Phone Cropped File (9:19.5)
                        </label>
                        <div className="border border-dashed border-border p-3 text-center hover:border-primary transition-colors cursor-pointer relative">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhoneFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <span className="font-sans text-xs text-muted-foreground pointer-events-none">
                            {phoneFile ? phoneFile.name : "Select separate 9:19.5 phone image file"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full mt-2"
              >
                <IconUpload size={18} />
                <span>Upload via Secured Cloud Pipeline</span>
              </Button>
            </div>

            {/* Form Right: Live Visual Preview (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Live Dual Preview (Desktop & Phone)
              </span>

              {/* Desktop Card Preview */}
              <div className="border border-border bg-surface p-3">
                <span className="font-mono text-[10px] uppercase text-muted-foreground block mb-2 font-medium">
                  Desktop Master Viewport
                </span>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/40 border border-border/60">
                  {desktopPreviewUrl ? (
                    <img
                      src={desktopPreviewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                      <IconPhoto size={28} />
                      <span className="font-mono text-xs">Awaiting file selection...</span>
                    </div>
                  )}

                  <div className="absolute top-2 left-2 flex items-center gap-1.5 font-mono text-[9px]">
                    <span className="bg-primary text-primary-foreground px-2 py-0.5 uppercase">
                      {category}
                    </span>
                    <span className="bg-surface/90 text-foreground px-2 py-0.5 border border-border uppercase flex items-center gap-1">
                      <IconDeviceMobile size={10} />
                      PHONE INCLUDED
                    </span>
                  </div>
                </div>

                <div className="pt-3 pb-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-sans text-sm font-semibold text-foreground truncate">
                      {title || "Untitled Master"}
                    </h4>
                    <span className="font-mono text-[10px] text-muted-foreground">{resolution}</span>
                  </div>

                  <div className="flex items-center gap-1.5 mt-2 font-mono text-[11px] text-muted-foreground">
                    <span>By:</span>
                    <span className="text-primary font-bold">@{profile?.username}</span>
                    {isXweet && <IconShieldCheck size={13} className="text-primary" />}
                  </div>
                </div>
              </div>

              {/* Synchronized Phone Lockscreen Mockup Preview */}
              <div className="border border-border bg-surface p-4 flex items-center gap-4">
                <div className="relative w-24 aspect-[9/19.5] rounded-[18px] overflow-hidden border-2 border-neutral-700 bg-black shadow-xl shrink-0 ring-1 ring-white/10 select-none">
                  {desktopPreviewUrl ? (
                    <img
                      src={phonePreviewUrl || desktopPreviewUrl}
                      alt="Phone crop preview"
                      style={{
                        objectPosition: `${useSeparateFile ? 50 : cropPosition}% center`,
                      }}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black/80 text-muted-foreground">
                      <IconDeviceMobile size={22} />
                    </div>
                  )}

                  {/* Lockscreen Accents */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />
                  <div className="absolute top-2.5 inset-x-0 text-center font-mono text-[9px] text-white/90 drop-shadow select-none pointer-events-none font-semibold">
                    9:41
                  </div>
                  <div className="absolute bottom-2.5 inset-x-0 flex justify-center pointer-events-none">
                    <div className="w-9 h-1 bg-white/70 rounded-full" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-mono text-[10px] uppercase text-primary font-bold flex items-center gap-1.5">
                    <IconCheck size={13} />
                    MOBILE 9:19.5 CROP SYNCED
                  </span>
                  <span className="font-mono text-[11px] text-foreground font-medium">
                    1170 × 2532 Phone Lockscreen
                  </span>
                  <p className="font-sans text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Live framing updates in real-time as you drag the crop window. Both editions will be published together in full quality.
                  </p>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>

      <div className="border-t border-border py-4 px-6 text-center text-[11px] font-mono text-muted-foreground">
        SECURE FIREBASE TOKEN VERIFICATION • CLOUDFLARE R2 CDN • FIRESTORE METADATA
      </div>
    </div>
  );
}
