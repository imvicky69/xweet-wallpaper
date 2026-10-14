"use client";

import React, { useState } from "react";
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
  const [resolution, setResolution] = useState("3840 × 2160");

  // Optional Phone Crop
  const [includePhoneCrop, setIncludePhoneCrop] = useState(false);
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

  const handleDesktopFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDesktopFile(file);
      setDesktopPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handlePhoneFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoneFile(file);
      setPhonePreviewUrl(URL.createObjectURL(file));
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

      if (desktopFile) {
        formData.append("desktopImage", desktopFile);
      }

      if (includePhoneCrop && phoneFile) {
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

              {/* ASSET GENERATION & COMPANION PHONE WALLPAPER */}
              <div className="border border-border bg-surface p-5 mt-2">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-foreground font-mono text-xs font-semibold uppercase tracking-wider">
                    <IconShieldCheck size={16} className="text-primary" />
                    <span>Multi-Format Asset Guarantee</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-muted-foreground bg-background p-3 border border-border">
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>WebP Thumbnail: Auto-generated</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>Phone Crop: Auto 9:16 Lockscreen</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-2 border-t border-border/60">
                    <input
                      type="checkbox"
                      id="phoneCropToggle"
                      checked={includePhoneCrop}
                      onChange={(e) => setIncludePhoneCrop(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded-none accent-primary cursor-pointer"
                    />
                    <div>
                      <label htmlFor="phoneCropToggle" className="font-sans text-sm font-semibold text-foreground cursor-pointer flex items-center gap-2">
                        <IconDeviceMobile size={16} className="text-primary" />
                        <span>Upload Custom Phone Crop (Optional)</span>
                      </label>
                      <p className="font-sans text-xs text-muted-foreground mt-0.5">
                        If unchecked, Xweet automatically creates a crisp 9:16 vertical companion phone wallpaper from your master file. Check this only if you want to upload your own custom-framed artwork.
                      </p>
                    </div>
                  </div>
                </div>

                {includePhoneCrop && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">
                      Phone Cropped File (9:19.5 Ratio)
                    </label>
                    <div className="border border-dashed border-border bg-background p-4 text-center hover:border-primary transition-colors cursor-pointer relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhoneFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <span className="font-sans text-xs text-muted-foreground pointer-events-none">
                        {phoneFile ? phoneFile.name : "Select 9:19.5 phone crop image file"}
                      </span>
                    </div>
                  </div>
                )}
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
                Live Card Preview
              </span>

              {/* Desktop Card Preview */}
              <div className="border border-border bg-surface p-3">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/40 border border-border/60">
                  {desktopPreviewUrl ? (
                    <Image
                      src={desktopPreviewUrl}
                      alt="Preview"
                      fill
                      sizes="400px"
                      className="object-cover"
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
                    {includePhoneCrop && (
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

                  <div className="flex items-center gap-1.5 mt-2 font-mono text-[11px] text-muted-foreground">
                    <span>By:</span>
                    <span className="text-primary font-bold">@{profile?.username}</span>
                    {isXweet && <IconShieldCheck size={13} className="text-primary" />}
                  </div>
                </div>
              </div>

              {/* Phone Preview (If enabled) */}
              {includePhoneCrop && (
                <div className="border border-border bg-surface p-3 flex items-center gap-4">
                  <div className="relative w-16 aspect-[9/19] rounded-[10px] overflow-hidden border border-foreground/30 bg-black shrink-0">
                    <Image
                      src={phonePreviewUrl || desktopPreviewUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe"}
                      alt="Phone preview"
                      fill
                      sizes="80px"
                      className="object-cover scale-110"
                    />
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase text-primary font-semibold block">
                      MOBILE COMPANION READY
                    </span>
                    <p className="font-sans text-xs text-muted-foreground mt-0.5">
                      Visitors will see dual download options for both desktop and phone lockscreen.
                    </p>
                  </div>
                </div>
              )}
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
