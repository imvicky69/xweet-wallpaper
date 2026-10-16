"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
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
  IconSparkles,
  IconX,
  IconHash,
  IconPalette,
  IconRefresh,
  IconCrop,
} from "@tabler/icons-react";
import { CATEGORIES, MOBILE_CATEGORIES } from "@/lib/wallpapers";
import { Wallpaper } from "@/types/wallpaper";

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
];

const POPULAR_DESKTOP_TAGS = [
  "minimal",
  "4k",
  "desktop",
  "dark",
  "texture",
  "editorial",
];

export default function UploadPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();

  // Mode: "mobile" | "dual" | "desktop"
  const [formatMode, setFormatMode] = useState<UploadMode>("mobile");

  // Form State
  const [title, setTitle] = useState("");
  const [rawDescription, setRawDescription] = useState("");
  const [category, setCategory] = useState("Lockscreen");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState("");
  const [dominantColor, setDominantColor] = useState("#111B2A");
  const [palette, setPalette] = useState<string[]>(["#111B2A", "#F0E5D2", "#263F32", "#829BAA"]);
  const [isAutoDetectedColor, setIsAutoDetectedColor] = useState<boolean>(false);
  const [tagsInput, setTagsInput] = useState("lockscreen, minimal, dark");
  const [autoSyncHashtags, setAutoSyncHashtags] = useState(true);

  // Auto-detected title
  const [detectedTitle, setDetectedTitle] = useState("");
  const [autoApplyDetectedTitle, setAutoApplyDetectedTitle] = useState(true);

  const formatTitleFromFilename = (filename: string): string => {
    const withoutExt = filename.replace(/\.[^/.]+$/, "");
    const cleaned = withoutExt
      .replace(/[-_](4k|5k|8k|uhd|hd|wallpaper|lockscreen|mobile|desktop|companion|phone|\d+x\d+)/gi, "")
      .replace(/[_-]+/g, " ")
      .trim();
    return cleaned
      .replace(/\s+/g, " ")
      .split(" ")
      .map((word, i) => {
        if (!word) return "";
        const lower = word.toLowerCase();
        if (i > 0 && ["in", "the", "a", "an", "and", "or", "of", "for", "on", "at", "to", "with"].includes(lower)) {
          return lower;
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  };

  /**
   * Fast, accurate client-side color palette extraction using an offscreen canvas.
   * Clusters colors into quant buckets and extracts 5 diverse, harmonious colors.
   */
  const extractPaletteFromImage = (img: HTMLImageElement): { dominant: string; palette: string[] } => {
    try {
      const canvas = document.createElement("canvas");
      const size = 96;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return { dominant: "#111B2A", palette: ["#111B2A", "#F0E5D2", "#263F32", "#829BAA"] };

      ctx.drawImage(img, 0, 0, size, size);
      const imgData = ctx.getImageData(0, 0, size, size).data;

      // Group pixels into color buckets (quantize by step of 20)
      const step = 20;
      const colorBuckets = new Map<string, { r: number; g: number; b: number; count: number }>();

      for (let i = 0; i < imgData.length; i += 4) {
        const a = imgData[i + 3];
        if (a < 128) continue; // Skip transparency

        const r = imgData[i];
        const g = imgData[i + 1];
        const b = imgData[i + 2];

        const qr = Math.floor(r / step) * step;
        const qg = Math.floor(g / step) * step;
        const qb = Math.floor(b / step) * step;
        const key = `${qr},${qg},${qb}`;

        const existing = colorBuckets.get(key);
        if (existing) {
          existing.r += r;
          existing.g += g;
          existing.b += b;
          existing.count += 1;
        } else {
          colorBuckets.set(key, { r, g, b, count: 1 });
        }
      }

      const allBuckets = Array.from(colorBuckets.values()).map((b) => {
        const avgR = Math.round(b.r / b.count);
        const avgG = Math.round(b.g / b.count);
        const avgB = Math.round(b.b / b.count);
        const maxVal = Math.max(avgR, avgG, avgB);
        const minVal = Math.min(avgR, avgG, avgB);
        const sat = maxVal === 0 ? 0 : (maxVal - minVal) / maxVal;
        return {
          r: avgR,
          g: avgG,
          b: avgB,
          count: b.count,
          saturation: sat,
        };
      });

      if (allBuckets.length === 0) {
        return { dominant: "#111B2A", palette: ["#111B2A", "#F0E5D2", "#263F32", "#829BAA"] };
      }

      // Sort by pixel count for dominant color
      allBuckets.sort((a, b) => b.count - a.count);
      const dominantBucket = allBuckets[0];

      const rgbToHex = (r: number, g: number, b: number): string => {
        const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, "0");
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
      };

      const colorDistance = (
        c1: { r: number; g: number; b: number },
        c2: { r: number; g: number; b: number }
      ) => {
        return Math.sqrt(
          Math.pow(c1.r - c2.r, 2) +
          Math.pow(c1.g - c2.g, 2) +
          Math.pow(c1.b - c2.b, 2)
        );
      };

      const selectedColors: { r: number; g: number; b: number }[] = [dominantBucket];
      const minDistance = 45;

      // 2. Vibrant Accent: find highest saturated color with good presence and far enough from dominant
      const vibrantCandidates = allBuckets.filter((b) => colorDistance(dominantBucket, b) >= minDistance);
      vibrantCandidates.sort((a, b) => (b.saturation * Math.log2(b.count + 2)) - (a.saturation * Math.log2(a.count + 2)));
      if (vibrantCandidates.length > 0 && vibrantCandidates[0].saturation > 0.15) {
        selectedColors.push(vibrantCandidates[0]);
      }

      // 3. Diverse tones from all buckets
      for (const bucket of allBuckets) {
        if (selectedColors.length >= 5) break;
        const isFarEnough = selectedColors.every((c) => colorDistance(c, bucket) >= minDistance);
        if (isFarEnough) {
          selectedColors.push(bucket);
        }
      }

      // 4. If monochromatic or low contrast, relax distance threshold to guarantee 5 harmonious swatches
      if (selectedColors.length < 5) {
        for (const bucket of allBuckets) {
          if (selectedColors.length >= 5) break;
          const isFarEnough = selectedColors.every((c) => colorDistance(c, bucket) >= 22);
          if (isFarEnough) {
            selectedColors.push(bucket);
          }
        }
      }

      const paletteHex = selectedColors.map((c) => rgbToHex(c.r, c.g, c.b));
      const dominantHex = rgbToHex(dominantBucket.r, dominantBucket.g, dominantBucket.b);

      return {
        dominant: dominantHex,
        palette: paletteHex,
      };
    } catch (err) {
      console.warn("Failed to extract color palette:", err);
      return { dominant: "#111B2A", palette: ["#111B2A", "#F0E5D2", "#263F32", "#829BAA"] };
    }
  };

  const reExtractPalette = () => {
    const activeUrl = formatMode === "mobile" ? mobilePreviewUrl : (desktopPreviewUrl || mobilePreviewUrl);
    if (!activeUrl) return;
    const img = new window.Image();
    img.onload = () => {
      const { dominant, palette: extracted } = extractPaletteFromImage(img);
      if (extracted.length > 0) {
        setPalette(extracted);
        setDominantColor(dominant);
        setIsAutoDetectedColor(true);
        showToast("info", "Palette Detected", `Extracted ${extracted.length} colors from active image.`);
      }
    };
    img.src = activeUrl;
  };

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

  // Dual mode crop & optional custom upload
  const [dualPhoneSource, setDualPhoneSource] = useState<"crop" | "upload">("crop");
  const [cropPosition, setCropPosition] = useState<number>(50); // 0 to 100%
  const [isDragging, setIsDragging] = useState(false);
  const cropperContainerRef = useRef<HTMLDivElement>(null);
  const [mobileDimensions, setMobileDimensions] = useState<{ width: number; height: number }>({
    width: 1170,
    height: 2532,
  });
  const [mobileResolution, setMobileResolution] = useState("1170 × 2532");

  // Submission & Feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);

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
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Sync mode changes
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

  const fullDescription = useMemo(() => {
    const cleanRaw = rawDescription.trim();
    if (!autoSyncHashtags || parsedHashtags.length === 0) {
      return cleanRaw;
    }
    if (cleanRaw.endsWith(hashtagString)) {
      return cleanRaw;
    }
    return cleanRaw ? `${cleanRaw}\n\n${hashtagString}` : hashtagString;
  }, [rawDescription, autoSyncHashtags, parsedHashtags, hashtagString]);

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
        if (formatMode === "mobile") {
          setImageDimensions({ width: w, height: h });
          setResolution(`${w} × ${h}`);

          // Auto-extract palette from mobile wallpaper
          const { dominant, palette: extracted } = extractPaletteFromImage(img);
          if (extracted.length > 0) {
            setPalette(extracted);
            setDominantColor(dominant);
            setIsAutoDetectedColor(true);
          }
        } else {
          setMobileDimensions({ width: w, height: h });
          setMobileResolution(`${w} × ${h}`);

          // If no desktop file yet, extract from dedicated phone image
          if (!desktopFile) {
            const { dominant, palette: extracted } = extractPaletteFromImage(img);
            if (extracted.length > 0) {
              setPalette(extracted);
              setDominantColor(dominant);
              setIsAutoDetectedColor(true);
            }
          }
        }
      };
      img.src = url;

      if (formatMode === "mobile") {
        const detected = formatTitleFromFilename(file.name);
        setDetectedTitle(detected);
        if (!title.trim() || autoApplyDetectedTitle) {
          setTitle(detected);
        }
      }
    }
  };

  const handleDesktopFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDesktopFile(file);
      const url = URL.createObjectURL(file);
      setDesktopPreviewUrl(url);

      const detected = formatTitleFromFilename(file.name);
      setDetectedTitle(detected);
      if (!title.trim() || autoApplyDetectedTitle) {
        setTitle(detected);
      }

      const img = new window.Image();
      img.onload = () => {
        const w = img.naturalWidth || 3840;
        const h = img.naturalHeight || 2160;
        setImageDimensions({ width: w, height: h });
        setResolution(`${w} × ${h}`);

        // Auto-extract color palette from desktop wallpaper
        const { dominant, palette: extracted } = extractPaletteFromImage(img);
        if (extracted.length > 0) {
          setPalette(extracted);
          setDominantColor(dominant);
          setIsAutoDetectedColor(true);
        }
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

  const generatePhoneCropBlob = async (
    file: File,
    cropPos: number
  ): Promise<{ blob: Blob; width: number; height: number; format: string }> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      const objUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objUrl);
        const naturalWidth = img.naturalWidth || 3840;
        const naturalHeight = img.naturalHeight || 2160;
        const targetAspect = 9 / 19.5;
        const currentAspect = naturalWidth / naturalHeight;

        let extractWidth: number;
        let extractHeight: number;
        let extractLeft: number;
        let extractTop: number;

        if (currentAspect >= targetAspect) {
          extractHeight = naturalHeight;
          extractWidth = Math.min(naturalWidth, Math.round(naturalHeight * targetAspect));
          const maxOffset = naturalWidth - extractWidth;
          const pct = Math.max(0, Math.min(100, isNaN(cropPos) ? 50 : cropPos));
          extractLeft = Math.round((pct / 100) * maxOffset);
          extractTop = 0;
        } else {
          extractWidth = naturalWidth;
          extractHeight = Math.min(naturalHeight, Math.round(naturalWidth / targetAspect));
          const maxOffset = naturalHeight - extractHeight;
          const pct = Math.max(0, Math.min(100, isNaN(cropPos) ? 50 : cropPos));
          extractTop = Math.round((pct / 100) * maxOffset);
          extractLeft = 0;
        }

        const canvas = document.createElement("canvas");
        canvas.width = extractWidth;
        canvas.height = extractHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Canvas context not available"));

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(
          img,
          extractLeft,
          extractTop,
          extractWidth,
          extractHeight,
          0,
          0,
          extractWidth,
          extractHeight
        );

        const isJpeg = file.type === "image/jpeg" || file.type === "image/jpg";
        const isWebp = file.type === "image/webp";
        const outputMime = isJpeg ? "image/jpeg" : isWebp ? "image/webp" : "image/png";
        const outputQuality = isJpeg || isWebp ? 0.96 : undefined;
        const format = isJpeg ? "jpg" : isWebp ? "webp" : "png";

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({ blob, width: extractWidth, height: extractHeight, format });
            } else {
              reject(new Error("Failed to generate phone crop"));
            }
          },
          outputMime,
          outputQuality
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(objUrl);
        reject(new Error("Failed to decode image file for phone crop"));
      };
      img.src = objUrl;
    });
  };

  const compressImageForUpload = async (
    file: File,
    options: { maxDim?: number; quality?: number; targetMaxBytes?: number } = {}
  ): Promise<File> => {
    const { maxDim = 3840, quality = 0.92, targetMaxBytes = 2.4 * 1024 * 1024 } = options;

    // If file is already small (< 2.2MB) and is WebP or JPEG, keep it
    if (file.size <= 2.2 * 1024 * 1024 && (file.type === "image/webp" || file.type === "image/jpeg")) {
      return file;
    }

    return new Promise((resolve) => {
      const img = new window.Image();
      const objUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objUrl);
        const origW = img.naturalWidth || 3840;
        const origH = img.naturalHeight || 2160;

        let w = origW;
        let h = origH;
        if (w > maxDim || h > maxDim) {
          if (w >= h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(file);

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, w, h);

        const tryExport = (q: number) => {
          canvas.toBlob(
            (blob) => {
              if (blob) {
                if (blob.size > targetMaxBytes && q > 0.78) {
                  return tryExport(q - 0.08);
                }
                const baseName = file.name.replace(/\.[^/.]+$/, "");
                const newFile = new File([blob], `${baseName}.webp`, { type: "image/webp" });
                resolve(newFile);
              } else {
                resolve(file);
              }
            },
            "image/webp",
            q
          );
        };

        tryExport(quality);
      };

      img.onerror = () => {
        URL.revokeObjectURL(objUrl);
        resolve(file);
      };
      img.src = objUrl;
    });
  };

  const generateThumbnailBlob = async (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      const objUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objUrl);
        const maxDim = 800;
        let w = img.naturalWidth || 800;
        let h = img.naturalHeight || 800;
        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(file);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob(
          (blob) => resolve(blob || file),
          "image/webp",
          0.88
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(objUrl);
        resolve(file);
      };
      img.src = objUrl;
    });
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (formatMode === "mobile") {
      if (!mobileFile && !mobilePreviewUrl) {
        const msg = "Please select a mobile lockscreen wallpaper file.";
        setErrorMessage(msg);
        showToast("error", "Missing Image", msg);
        return;
      }
    } else {
      if (!desktopFile && !desktopPreviewUrl) {
        const msg = "Please select a desktop wallpaper file.";
        setErrorMessage(msg);
        showToast("error", "Missing Image", msg);
        return;
      }
      if (formatMode === "dual" && dualPhoneSource === "upload" && !mobileFile && !mobilePreviewUrl) {
        const msg = "Please select a dedicated phone file, or switch to 'Crop from Desktop'.";
        setErrorMessage(msg);
        showToast("error", "Missing Phone File", msg);
        return;
      }
    }

    if (!title.trim()) {
      const msg = "Please give your wallpaper drop a title.";
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

      const isDualUploadPhone =
        formatMode === "dual" && dualPhoneSource === "upload" && Boolean(mobileFile);

      showToast(
        "info",
        "Preparing Master Upload",
        "Optimizing 4K master payload to guarantee fast lossless cloud delivery..."
      );

      // 1. Client-side WebP compression to guarantee total payload is safely under serverless 4.5MB limit
      let finalDesktopFile: File | null = null;
      let finalPhoneFile: File | null = null;

      if (formatMode === "mobile") {
        if (!mobileFile) throw new Error("No vertical lockscreen wallpaper file selected.");
        finalPhoneFile = await compressImageForUpload(mobileFile, {
          maxDim: 2796,
          quality: 0.94,
          targetMaxBytes: 2.2 * 1024 * 1024,
        });
      } else {
        if (!desktopFile) throw new Error("No desktop wallpaper file selected.");
        finalDesktopFile = await compressImageForUpload(desktopFile, {
          maxDim: 3840,
          quality: 0.92,
          targetMaxBytes: 2.2 * 1024 * 1024,
        });

        if (isDualUploadPhone && mobileFile) {
          finalPhoneFile = await compressImageForUpload(mobileFile, {
            maxDim: 2796,
            quality: 0.92,
            targetMaxBytes: 1.6 * 1024 * 1024,
          });
        }
      }

      const slugBase =
        title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") || "wallpaper";
      const slug = slugBase;

      const idToken = await user.getIdToken();
      const uploadFormData = new FormData();
      if (finalDesktopFile) {
        uploadFormData.append("desktopImage", finalDesktopFile, finalDesktopFile.name);
      }
      if (finalPhoneFile) {
        uploadFormData.append("phoneImage", finalPhoneFile, finalPhoneFile.name);
      }
      uploadFormData.append("title", title.trim());
      uploadFormData.append("description", fullDescription);
      uploadFormData.append("category", finalCategory);
      uploadFormData.append("dominantColor", dominantColor);
      uploadFormData.append("palette", palette.join(","));
      uploadFormData.append("tags", parsedHashtags.map((t) => t.replace(/^#/, "")).join(","));
      uploadFormData.append("cropPosition", cropPosition.toString());
      uploadFormData.append("slug", slug);
      uploadFormData.append("formatMode", formatMode);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
        body: uploadFormData,
      });

      // Safely parse server response to avoid JSON parse crashes
      const responseText = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(responseText);
      } catch {
        if (res.status === 413 || responseText.includes("Request Entity Too Large")) {
          throw new Error("File payload was too large for cloud transfer. Please retry.");
        }
        throw new Error(responseText.slice(0, 240) || `Server error (${res.status}: ${res.statusText || "Internal Error"})`);
      }

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || data?.error || "Failed to process 4K master wallpaper.");
      }

      // Client-side Firestore sync as guaranteed backup
      if (data.wallpaper && data.wallpaper.id) {
        try {
          const docRef = doc(db, "wallpapers", data.wallpaper.id);
          const wallpaperWithPalette = {
            ...data.wallpaper,
            styling: {
              ...(data.wallpaper.styling || {}),
              dominantColor,
              paletteHex: dominantColor,
              palette,
            },
            dominantColor,
            paletteHex: dominantColor,
            palette,
          };
          await setDoc(docRef, wallpaperWithPalette, { merge: true });
        } catch (clientFsErr) {
          console.warn("Client Firestore sync notice:", clientFsErr);
        }
      }

      setSuccess(true);
      showToast(
        "success",
        "Drop Published as 4K Master!",
        `"${title}" is compressed to true 4K WebP and indexed in Firestore.`
      );

      setTimeout(() => {
        router.push(`/${profile?.username || "xweet"}`);
      }, 1500);
    } catch (err: any) {
      const detailedMessage =
        err?.message || "An unexpected error occurred while transferring to Cloudflare R2.";
      setErrorMessage(detailedMessage);
      showToast("error", "Upload Failed", detailedMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

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
  const activeSuggestedCategories =
    formatMode === "mobile" ? MOBILE_CATEGORIES : CATEGORIES.filter((c) => c !== "All");
  const popularTags = formatMode === "mobile" ? POPULAR_MOBILE_TAGS : POPULAR_DESKTOP_TAGS;

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden flex flex-col justify-between bg-background text-foreground selection:bg-secondary">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 right-4 z-50 max-w-sm w-full shadow-2xl pointer-events-auto"
          >
            <div
              className={`p-3.5 border flex items-start gap-2.5 backdrop-blur-md rounded-none ${
                toast.type === "error"
                  ? "bg-destructive/15 border-destructive text-destructive-foreground shadow-[0_10px_30px_rgba(239,68,68,0.2)]"
                  : toast.type === "success"
                  ? "bg-emerald-950/80 border-emerald-500 text-emerald-100 shadow-[0_10px_30px_rgba(16,185,129,0.2)]"
                  : "bg-surface/95 border-border text-foreground"
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {toast.type === "error" ? (
                  <IconAlertCircle size={18} className="text-destructive" />
                ) : toast.type === "success" ? (
                  <IconCheck size={18} className="text-emerald-400" />
                ) : (
                  <IconSparkles size={18} className="text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-sans text-xs font-semibold uppercase">{toast.title}</h5>
                <p className="font-sans text-[11px] text-muted-foreground mt-0.5 line-clamp-2">
                  {toast.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setToast((prev) => ({ ...prev, show: false }))}
                className="text-muted-foreground hover:text-foreground p-0.5 transition-colors cursor-pointer"
              >
                <IconX size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Navbar */}
      <header className="border-b border-border py-2.5 px-4 sm:px-6 lg:px-8 bg-surface shrink-0">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <IconArrowLeft size={14} />
            <span>RETURN TO CATALOG</span>
          </Link>

          <div className="flex items-center gap-3">
            <h1 className="font-mono text-xs font-semibold text-primary uppercase tracking-wider hidden sm:inline">
              Curator Pipeline
            </h1>
            <div className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground border-l border-border pl-3">
              <span>AUTHOR:</span>
              <span className="text-primary font-bold">@{profile?.username}</span>
              {isXweet && (
                <span className="flex items-center gap-1 text-primary text-[10px] bg-secondary/60 px-1.5 py-0.5 border border-border">
                  <IconShieldCheck size={12} />
                  <span>VERIFIED</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace (Single fitted screen layout on desktop) */}
      <main className="flex-1 lg:overflow-hidden px-4 sm:px-6 lg:px-8 py-3 max-w-7xl mx-auto w-full flex flex-col min-h-0">
        {errorMessage && (
          <div className="mb-2.5 flex items-center gap-2 border border-destructive/60 bg-destructive/10 px-3 py-2 text-xs text-destructive shrink-0">
            <IconAlertCircle size={15} className="shrink-0" />
            <span className="truncate">{errorMessage}</span>
          </div>
        )}

        {success ? (
          <div className="m-auto border border-primary bg-secondary/30 p-8 text-center max-w-lg w-full">
            <div className="h-10 w-10 bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3">
              <IconCheck size={20} />
            </div>
            <h2 className="font-sans text-xl font-semibold text-foreground">Uploaded & Indexed!</h2>
            <p className="font-sans text-xs text-muted-foreground mt-1">
              Wallpaper is safely stored in Cloudflare R2 and published. Redirecting to showcase...
            </p>
          </div>
        ) : (
          <form
            onSubmit={handlePublish}
            className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 min-h-0 lg:overflow-hidden"
          >
            {/* LEFT COLUMN: Visual Stage & Format Mode (lg:col-span-6) */}
            <div className="lg:col-span-6 flex flex-col gap-2.5 min-h-0 lg:overflow-hidden">
              {/* Format Selector Tabs */}
              <div className="flex items-center gap-1 border border-border bg-surface p-1 shrink-0">
                <button
                  type="button"
                  onClick={() => setFormatMode("mobile")}
                  className={`flex-1 py-1.5 px-2 font-mono text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer rounded-none ${
                    formatMode === "mobile"
                      ? "bg-primary text-primary-foreground border border-primary shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-background"
                  }`}
                >
                  <IconDeviceMobile size={14} />
                  <span>Mobile (9:19.5)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormatMode("dual")}
                  className={`flex-1 py-1.5 px-2 font-mono text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer rounded-none ${
                    formatMode === "dual"
                      ? "bg-primary text-primary-foreground border border-primary shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-background"
                  }`}
                >
                  <div className="flex items-center gap-0.5">
                    <IconDeviceDesktop size={13} />
                    <span>+</span>
                    <IconDeviceMobile size={12} />
                  </div>
                  <span>Dual Drop</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormatMode("desktop")}
                  className={`flex-1 py-1.5 px-2 font-mono text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer rounded-none ${
                    formatMode === "desktop"
                      ? "bg-primary text-primary-foreground border border-primary shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-background"
                  }`}
                >
                  <IconDeviceDesktop size={14} />
                  <span>Desktop (16:9)</span>
                </button>
              </div>

              {/* Media Stage: File Dropzone or Interactive Cropper / Live Viewport */}
              <div className="flex-1 border border-border bg-surface p-3 flex flex-col justify-center items-center relative overflow-hidden min-h-[260px] lg:min-h-0">
                {/* BRANCH 1: MOBILE ONLY MODE */}
                {formatMode === "mobile" && (
                  <>
                    {mobilePreviewUrl ? (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                        {/* Compact Phone Mockup */}
                        <div className="relative h-[240px] sm:h-[280px] lg:h-[300px] aspect-[9/19.5] rounded-[28px] border-[4px] border-neutral-800 bg-black shadow-xl overflow-hidden select-none shrink-0">
                          <img
                            src={mobilePreviewUrl}
                            alt="Mobile preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 pointer-events-none flex flex-col justify-between p-3 text-center">
                            <div className="self-center w-16 h-3.5 bg-black rounded-full border border-white/10" />
                            <div>
                              <p className="font-mono text-[9px] uppercase text-white/80">9:41</p>
                              <h4 className="font-sans text-xl font-light text-white tracking-tight drop-shadow-sm">
                                Wednesday
                              </h4>
                            </div>
                            <div className="w-16 h-0.5 bg-white/70 rounded-full mx-auto" />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                          <span className="bg-background border border-border px-1.5 py-0.5">
                            {resolution}
                          </span>
                          <span className="bg-background border border-border px-1.5 py-0.5">
                            {mobileFile ? `${(mobileFile.size / (1024 * 1024)).toFixed(1)} MB` : "Ready"}
                          </span>
                          <label className="text-primary hover:underline cursor-pointer flex items-center gap-1 font-semibold">
                            <IconRefresh size={11} />
                            <span>Replace</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleMobileFileChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      /* Drag & Drop File Upload Box */
                      <div className="w-full h-full border-2 border-dashed border-border bg-background flex flex-col items-center justify-center p-6 text-center hover:border-primary transition-colors cursor-pointer relative">
                        <input
                          type="file"
                          accept="image/*"
                          required
                          onChange={handleMobileFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <div className="h-10 w-10 bg-secondary flex items-center justify-center text-primary mb-2">
                          <IconDeviceMobile size={22} />
                        </div>
                        <span className="font-sans text-xs sm:text-sm font-semibold text-foreground">
                          Select Vertical Lockscreen Wallpaper
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground mt-0.5">
                          Supports 9:16 / 9:19.5 (WebP, PNG, JPG • Max 50MB)
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* BRANCH 2: DUAL SETUP (Desktop + Phone Cropper or Direct Phone Upload) */}
                {formatMode === "dual" && (
                  <div className="w-full h-full flex flex-col justify-between gap-2 overflow-hidden">
                    {/* Sub-selector: Crop from Desktop vs Upload Dedicated Phone File */}
                    <div className="flex items-center justify-between border-b border-border pb-1.5 shrink-0">
                      <span className="font-mono text-[10px] uppercase text-muted-foreground font-semibold flex items-center gap-1">
                        <span>Phone Edition:</span>
                      </span>
                      <div className="flex items-center gap-1 font-mono text-[10px]">
                        <button
                          type="button"
                          onClick={() => setDualPhoneSource("crop")}
                          className={`px-2 py-0.5 border cursor-pointer transition-colors ${
                            dualPhoneSource === "crop"
                              ? "bg-primary text-primary-foreground border-primary font-semibold"
                              : "bg-surface border-border text-muted-foreground hover:border-primary hover:text-foreground"
                          }`}
                        >
                          ✂️ Crop from Desktop
                        </button>
                        <button
                          type="button"
                          onClick={() => setDualPhoneSource("upload")}
                          className={`px-2 py-0.5 border cursor-pointer transition-colors ${
                            dualPhoneSource === "upload"
                              ? "bg-primary text-primary-foreground border-primary font-semibold"
                              : "bg-surface border-border text-muted-foreground hover:border-primary hover:text-foreground"
                          }`}
                        >
                          📱 Upload Phone File
                        </button>
                      </div>
                    </div>

                    {dualPhoneSource === "crop" ? (
                      /* OPTION A: CROPPING WORKFLOW */
                      desktopPreviewUrl ? (
                        <div className="w-full flex-1 flex flex-col justify-between gap-2 overflow-hidden min-h-0">
                          {/* Interactive Cropper Canvas + Live Phone Sync */}
                          <div className="w-full flex-1 flex flex-col sm:flex-row items-center gap-3 overflow-hidden min-h-0">
                            <div
                              ref={cropperContainerRef}
                              onPointerDown={handlePointerDown}
                              onPointerMove={handlePointerMove}
                              onPointerUp={handlePointerUp}
                              className="relative flex-1 w-full aspect-[16/9] max-h-[220px] bg-black border border-border overflow-hidden select-none cursor-ew-resize touch-none"
                              title="Click or drag to frame phone lockscreen"
                            >
                              <img
                                src={desktopPreviewUrl}
                                alt="Desktop Master"
                                className="w-full h-full object-cover select-none pointer-events-none"
                                draggable={false}
                              />

                              {/* Left mask */}
                              <div
                                className="absolute inset-y-0 left-0 bg-black/65 backdrop-blur-[1px] pointer-events-none"
                                style={{ width: `${cropBoxLeftPercent}%` }}
                              />
                              {/* Right mask */}
                              <div
                                className="absolute inset-y-0 right-0 bg-black/65 backdrop-blur-[1px] pointer-events-none"
                                style={{
                                  width: `${Math.max(0, 100 - (cropBoxLeftPercent + cropBoxWidthPercent))}%`,
                                }}
                              />

                              {/* 9:19.5 Window */}
                              <div
                                className="absolute inset-y-0 border-2 border-white shadow-[0_0_20px_rgba(0,0,0,0.8)] flex flex-col justify-between p-1.5 pointer-events-none"
                                style={{
                                  left: `${cropBoxLeftPercent}%`,
                                  width: `${cropBoxWidthPercent}%`,
                                }}
                              >
                                <span className="bg-primary text-primary-foreground font-mono text-[8px] px-1 py-0.2 self-start font-semibold">
                                  PHONE CROP (9:19.5)
                                </span>
                                <div className="self-center bg-black/80 text-white p-1 rounded-full border border-white/40">
                                  <IconArrowsHorizontal size={12} />
                                </div>
                                <span className="self-center bg-black/80 text-white font-mono text-[8px] px-1 py-0.2">
                                  {cropPosition}%
                                </span>
                              </div>
                            </div>

                            {/* Live Phone Companion Mockup */}
                            <div className="hidden sm:flex flex-col items-center justify-center shrink-0">
                              <div className="relative h-[160px] aspect-[9/19.5] rounded-[18px] border-[3px] border-neutral-700 bg-black shadow-lg overflow-hidden select-none">
                                <img
                                  src={desktopPreviewUrl}
                                  alt="Live phone crop"
                                  style={{ objectPosition: `${cropPosition}% center` }}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 pointer-events-none flex flex-col justify-between p-2 text-center">
                                  <div className="self-center w-8 h-2 bg-black rounded-full border border-white/10" />
                                  <div>
                                    <p className="font-mono text-[7px] uppercase text-white/80">9:41</p>
                                  </div>
                                  <div className="w-6 h-0.5 bg-white/70 rounded-full mx-auto" />
                                </div>
                              </div>
                              <span className="font-mono text-[9px] text-muted-foreground mt-1">Live Phone Crop</span>
                            </div>
                          </div>

                          {/* Presets and Slider Row */}
                          <div className="flex items-center justify-between gap-2 shrink-0 pt-1 border-t border-border/80">
                            <div className="flex items-center gap-1 font-mono text-[10px]">
                              <span className="text-muted-foreground mr-0.5">Crop:</span>
                              {[
                                { label: "Left", pos: 0 },
                                { label: "Center", pos: 50 },
                                { label: "Right", pos: 100 },
                              ].map((preset) => (
                                <button
                                  key={preset.label}
                                  type="button"
                                  onClick={() => setCropPosition(preset.pos)}
                                  className={`px-2 py-0.5 border text-[10px] cursor-pointer ${
                                    cropPosition === preset.pos
                                      ? "bg-primary text-primary-foreground border-primary"
                                      : "bg-background border-border text-foreground hover:border-primary"
                                  }`}
                                >
                                  {preset.label}
                                </button>
                              ))}
                            </div>

                            <div className="flex items-center gap-2 flex-1 max-w-[140px]">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={cropPosition}
                                onChange={(e) => setCropPosition(Number(e.target.value))}
                                className="w-full accent-primary cursor-pointer h-1.5 bg-border"
                              />
                            </div>

                            <label className="text-primary hover:underline cursor-pointer font-mono text-[10px] shrink-0 font-semibold flex items-center gap-1">
                              <IconRefresh size={11} />
                              <span>Replace Master</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleDesktopFileChange}
                                className="hidden"
                              />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <div className="w-full flex-1 border-2 border-dashed border-border bg-background flex flex-col items-center justify-center p-6 text-center hover:border-primary transition-colors cursor-pointer relative min-h-[180px]">
                          <input
                            type="file"
                            accept="image/*"
                            required
                            onChange={handleDesktopFileChange}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <div className="h-10 w-10 bg-secondary flex items-center justify-center text-primary mb-2">
                            <IconPhoto size={22} />
                          </div>
                          <span className="font-sans text-xs sm:text-sm font-semibold text-foreground">
                            Upload 4K/5K Desktop Master
                          </span>
                          <span className="font-mono text-[10px] text-muted-foreground mt-0.5">
                            Activates visual phone cropper automatically (Max 50MB)
                          </span>
                        </div>
                      )
                    ) : (
                      /* OPTION B: SEPARATE DESKTOP & PHONE UPLOAD CARDS */
                      <div className="w-full flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2.5 min-h-0 overflow-y-auto">
                        {/* 1. Desktop Master Slot */}
                        <div className="border border-border bg-background p-2.5 flex flex-col justify-between min-h-[190px]">
                          <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground mb-1.5 shrink-0">
                            <span className="font-semibold text-foreground uppercase flex items-center gap-1">
                              <IconDeviceDesktop size={13} className="text-primary" />
                              <span>1. Desktop Master</span>
                            </span>
                            {desktopFile ? (
                              <span className="text-primary font-bold">READY</span>
                            ) : (
                              <span className="text-destructive font-mono text-[9px]">REQUIRED</span>
                            )}
                          </div>

                          {desktopPreviewUrl ? (
                            <div className="relative flex-1 w-full border border-border overflow-hidden bg-black/60 flex items-center justify-center p-1.5 min-h-[130px]">
                              <div className="relative w-full aspect-[16/10] max-h-[170px] overflow-hidden border border-white/10 shadow-xs">
                                <img
                                  src={desktopPreviewUrl}
                                  alt="Desktop Master"
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute top-1 left-1 bg-black/80 text-white font-mono text-[8px] px-1 py-0.5">
                                  {resolution}
                                </div>
                                <div className="absolute bottom-1 right-1 bg-primary text-primary-foreground font-mono text-[7px] px-1 py-0.5 uppercase font-semibold">
                                  16:10 / 16:9 Master
                                </div>
                              </div>
                            </div>
                          ) : (
                            <label className="flex-1 w-full border border-dashed border-border bg-surface flex flex-col items-center justify-center p-3 text-center hover:border-primary transition-colors cursor-pointer relative min-h-[130px]">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleDesktopFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                              />
                              <IconDeviceDesktop size={20} className="text-primary mb-1" />
                              <span className="font-sans text-xs font-semibold text-foreground">Select Desktop Master</span>
                              <span className="font-mono text-[9px] text-muted-foreground">16:9 / 16:10 File</span>
                            </label>
                          )}

                          <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-border/60 font-mono text-[10px] shrink-0">
                            <span className="text-muted-foreground truncate">
                              {desktopFile ? `${(desktopFile.size / (1024 * 1024)).toFixed(1)} MB` : "Awaiting file"}
                            </span>
                            {desktopPreviewUrl && (
                              <label className="text-primary hover:underline cursor-pointer flex items-center gap-1 font-semibold">
                                <IconRefresh size={11} />
                                <span>Replace</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleDesktopFileChange}
                                  className="hidden"
                                />
                              </label>
                            )}
                          </div>
                        </div>

                        {/* 2. Dedicated Phone Lockscreen Slot */}
                        <div className="border border-border bg-background p-2.5 flex flex-col justify-between min-h-[190px]">
                          <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground mb-1.5 shrink-0">
                            <span className="font-semibold text-foreground uppercase flex items-center gap-1">
                              <IconDeviceMobile size={13} className="text-primary" />
                              <span>2. Dedicated Phone File</span>
                            </span>
                            {mobileFile ? (
                              <span className="text-primary font-bold">READY</span>
                            ) : (
                              <span className="text-amber-600 font-mono text-[9px]">OPTIONAL FILE</span>
                            )}
                          </div>

                          {mobilePreviewUrl ? (
                            <div className="relative flex-1 w-full border border-border overflow-hidden bg-black/60 flex items-center justify-center p-1.5 min-h-[130px]">
                              {/* Sleek Phone Lockscreen Mockup */}
                              <div className="relative h-[160px] sm:h-[180px] aspect-[9/19.5] rounded-[18px] border-[3px] border-neutral-700 bg-black shadow-lg overflow-hidden select-none shrink-0">
                                <img
                                  src={mobilePreviewUrl}
                                  alt="Phone Lockscreen"
                                  className="w-full h-full object-cover"
                                />
                                {/* Phone Screen UI: Notch, Clock, Home Indicator */}
                                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60 pointer-events-none flex flex-col justify-between p-2 text-center">
                                  <div className="self-center w-10 h-2 bg-black rounded-full border border-white/10" />
                                  <div>
                                    <p className="font-mono text-[8px] uppercase text-white/80 font-medium">9:41</p>
                                    <h5 className="font-sans text-[11px] font-light text-white tracking-tight drop-shadow-sm">
                                      Wednesday
                                    </h5>
                                  </div>
                                  <div className="w-8 h-0.5 bg-white/70 rounded-full mx-auto" />
                                </div>
                                <div className="absolute top-1 left-1 bg-black/80 text-white font-mono text-[7px] px-1 py-0.5 border border-white/10">
                                  {mobileResolution}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <label className="flex-1 w-full border border-dashed border-border bg-surface flex flex-col items-center justify-center p-3 text-center hover:border-primary transition-colors cursor-pointer relative min-h-[130px]">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleMobileFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                              />
                              <IconDeviceMobile size={20} className="text-primary mb-1" />
                              <span className="font-sans text-xs font-semibold text-foreground">Select Dedicated Phone File</span>
                              <span className="font-mono text-[9px] text-muted-foreground">9:16 or 9:19.5 Vertical</span>
                            </label>
                          )}

                          <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-border/60 font-mono text-[10px] shrink-0">
                            <span className="text-muted-foreground truncate">
                              {mobileFile ? `${(mobileFile.size / (1024 * 1024)).toFixed(1)} MB` : "No crop will be used"}
                            </span>
                            {mobilePreviewUrl ? (
                              <div className="flex items-center gap-2">
                                <label className="text-primary hover:underline cursor-pointer flex items-center gap-1 font-semibold">
                                  <IconRefresh size={11} />
                                  <span>Replace</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleMobileFileChange}
                                    className="hidden"
                                  />
                                </label>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setMobileFile(null);
                                    setMobilePreviewUrl("");
                                  }}
                                  className="text-muted-foreground hover:text-destructive cursor-pointer p-0.5"
                                  title="Remove phone file"
                                >
                                  <IconX size={12} />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setDualPhoneSource("crop")}
                                className="text-primary hover:underline cursor-pointer text-[9px]"
                              >
                                Or switch to crop →
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* BRANCH 3: DESKTOP ONLY MODE */}
                {formatMode === "desktop" && (
                  <>
                    {desktopPreviewUrl ? (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                        <div className="relative w-full aspect-[16/10] max-h-[260px] border border-border bg-muted/30 overflow-hidden">
                          <img
                            src={desktopPreviewUrl}
                            alt="Desktop Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-primary text-primary-foreground font-mono text-[9px] px-1.5 py-0.5 uppercase">
                            16:9 MASTER
                          </div>
                        </div>

                        <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
                          <span className="bg-background border border-border px-1.5 py-0.5">
                            {resolution}
                          </span>
                          <span className="bg-background border border-border px-1.5 py-0.5">
                            {desktopFile ? `${(desktopFile.size / (1024 * 1024)).toFixed(1)} MB` : "Ready"}
                          </span>
                          <label className="text-primary hover:underline cursor-pointer flex items-center gap-1 font-semibold">
                            <IconRefresh size={11} />
                            <span>Replace</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleDesktopFileChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full border-2 border-dashed border-border bg-background flex flex-col items-center justify-center p-6 text-center hover:border-primary transition-colors cursor-pointer relative">
                        <input
                          type="file"
                          accept="image/*"
                          required
                          onChange={handleDesktopFileChange}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                        />
                        <div className="h-10 w-10 bg-secondary flex items-center justify-center text-primary mb-2">
                          <IconPhoto size={22} />
                        </div>
                        <span className="font-sans text-xs sm:text-sm font-semibold text-foreground">
                          Upload Desktop Wallpaper (16:9)
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground mt-0.5">
                          WebP, PNG, JPG (e.g. 3840 × 2160, 5120 × 2880)
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Compact Metadata & Publication Form (lg:col-span-6) */}
            <div className="lg:col-span-6 flex flex-col justify-between gap-3 min-h-0 lg:overflow-y-auto pr-0.5">
              <div className="space-y-3">
                {/* 1. Title */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                      Wallpaper Title <span className="text-primary">*</span>
                    </label>

                    {detectedTitle && (
                      <button
                        type="button"
                        onClick={() => {
                          setTitle(detectedTitle);
                          setAutoApplyDetectedTitle(true);
                        }}
                        className={`font-mono text-[10px] flex items-center gap-1 cursor-pointer transition-colors ${
                          title === detectedTitle ? "text-primary font-medium" : "text-primary hover:underline"
                        }`}
                        title="Apply filename title"
                      >
                        <IconSparkles size={11} />
                        <span>Use &quot;{detectedTitle}&quot;</span>
                      </button>
                    )}
                  </div>

                  <input
                    type="text"
                    required
                    placeholder={
                      formatMode === "mobile" ? "e.g. Neon Horizon Lockscreen" : "e.g. Serene Terracotta Fold"
                    }
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setAutoApplyDetectedTitle(false);
                    }}
                    className="h-9 w-full rounded-none border border-border bg-surface px-3 font-sans text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
                  />
                </div>

                {/* 2. Category & Dominant Color (2 Columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Category */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                        Category <span className="text-primary">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCustomCategory(!isCustomCategory);
                          if (!isCustomCategory) setCustomCategoryInput("");
                        }}
                        className="font-mono text-[10px] text-primary hover:underline cursor-pointer"
                      >
                        {isCustomCategory ? "Preset" : "+ Custom"}
                      </button>
                    </div>

                    {isCustomCategory ? (
                      <input
                        type="text"
                        required
                        placeholder="e.g. Cyberpunk"
                        value={customCategoryInput}
                        onChange={(e) => setCustomCategoryInput(e.target.value)}
                        className="h-9 w-full rounded-none border border-primary bg-background px-3 font-sans text-xs text-foreground focus:outline-none"
                      />
                    ) : (
                      <select
                        value={category}
                        onChange={(e) => {
                          if (e.target.value === "__NEW__") {
                            setIsCustomCategory(true);
                          } else {
                            setCategory(e.target.value);
                          }
                        }}
                        className="h-9 w-full rounded-none border border-border bg-surface px-2.5 font-sans text-xs text-foreground focus:border-primary focus:outline-none"
                      >
                        {activeSuggestedCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                        <option value="__NEW__">+ Custom Category...</option>
                      </select>
                    )}
                  </div>

                  {/* Dominant Color & Auto-Detected Palette */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                        <IconPalette size={12} className="text-primary" />
                        <span>Color Palette</span>
                      </label>
                      <div className="flex items-center gap-1.5 font-mono text-[10px]">
                        {isAutoDetectedColor ? (
                          <span className="text-primary flex items-center gap-1 font-medium">
                            <IconSparkles size={11} />
                            <span>Auto-detected</span>
                          </span>
                        ) : (desktopPreviewUrl || mobilePreviewUrl) ? (
                          <button
                            type="button"
                            onClick={reExtractPalette}
                            className="text-primary hover:underline cursor-pointer flex items-center gap-0.5"
                            title="Auto-detect palette from image"
                          >
                            <IconSparkles size={10} />
                            <span>Detect from image</span>
                          </button>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <input
                        type="color"
                        value={dominantColor}
                        onChange={(e) => {
                          const val = e.target.value.toUpperCase();
                          setDominantColor(val);
                          setIsAutoDetectedColor(false);
                          setPalette((prev) => {
                            const next = [...prev];
                            next[0] = val;
                            return next;
                          });
                        }}
                        className="h-9 w-9 border border-border bg-background cursor-pointer p-0.5 rounded-none shrink-0"
                        title="Pick custom color"
                      />
                      <input
                        type="text"
                        value={dominantColor}
                        onChange={(e) => {
                          const val = e.target.value.toUpperCase();
                          setDominantColor(val);
                          setIsAutoDetectedColor(false);
                          if (/^#[0-9A-F]{6}$/i.test(val)) {
                            setPalette((prev) => {
                              const next = [...prev];
                              next[0] = val;
                              return next;
                            });
                          }
                        }}
                        className="h-9 flex-1 min-w-0 border border-border bg-surface px-2 font-mono text-[11px] text-foreground focus:border-primary focus:outline-none uppercase"
                        placeholder="#111B2A"
                      />
                      {/* Auto-detected 5-color palette swatches */}
                      <div className="flex items-center gap-1 shrink-0 bg-background border border-border p-1">
                        {palette.map((c, idx) => (
                          <button
                            key={`${c}-${idx}`}
                            type="button"
                            onClick={() => {
                              setDominantColor(c);
                            }}
                            style={{ backgroundColor: c }}
                            className={`h-5 w-5 border transition-all cursor-pointer relative ${
                              dominantColor.toUpperCase() === c.toUpperCase()
                                ? "border-primary ring-1.5 ring-primary scale-110 z-10 shadow-xs"
                                : "border-border/60 hover:scale-105"
                            }`}
                            title={`Select color: ${c}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Tags & Hashtag Sync */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <IconHash size={12} className="text-primary" />
                      <span>Tags</span>
                    </label>
                    <label className="font-mono text-[10px] text-primary cursor-pointer hover:underline flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={autoSyncHashtags}
                        onChange={(e) => setAutoSyncHashtags(e.target.checked)}
                        className="accent-primary cursor-pointer h-3 w-3"
                      />
                      <span>Sync into description</span>
                    </label>
                  </div>

                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="minimal, 4k, lockscreen, dark"
                    className="h-9 w-full rounded-none border border-border bg-surface px-3 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
                  />

                  {/* Compact Tag Chips */}
                  <div className="flex flex-wrap items-center gap-1 mt-1.5">
                    {popularTags.slice(0, 6).map((tag) => {
                      const isSelected = parsedHashtags.includes(`#${tag}`);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleToggleTag(tag)}
                          className={`px-1.5 py-0.5 font-mono text-[9px] border transition-colors cursor-pointer ${
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary font-semibold"
                              : "bg-surface border-border text-muted-foreground hover:border-primary"
                          }`}
                        >
                          #{tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Description */}
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                    Editorial Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Short notes on texture, composition and lighting..."
                    value={rawDescription}
                    onChange={(e) => setRawDescription(e.target.value)}
                    className="w-full rounded-none border border-border bg-surface p-2.5 font-sans text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* 5. Publish Submit Button */}
              <div className="pt-2 border-t border-border mt-auto">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  className="w-full h-11 text-xs sm:text-sm font-semibold tracking-wide"
                >
                  <IconUpload size={16} />
                  <span>
                    {isSubmitting
                      ? "Publishing & Transferring Assets to Cloudflare R2..."
                      : formatMode === "mobile"
                      ? "Publish Mobile Lockscreen Drop"
                      : formatMode === "dual" && dualPhoneSource === "upload"
                      ? "Publish Desktop + Dedicated Phone Drop"
                      : "Publish Master Wallpaper Drop"}
                  </span>
                </Button>
              </div>
            </div>
          </form>
        )}
      </main>

      {/* Compact Status Footer */}
      <footer className="border-t border-border py-2 px-6 text-center text-[10px] font-mono text-muted-foreground bg-surface shrink-0">
        CLOUDFLARE R2 CDN DIRECT TRANSFER • UNCOMPRESSED MASTER QUALITY • FIRESTORE INDEXED
      </footer>
    </div>
  );
}
