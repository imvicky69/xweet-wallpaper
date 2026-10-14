"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Wallpaper } from "@/types/wallpaper";
import { CATEGORIES, MOBILE_CATEGORIES, getCdnImageUrl } from "@/lib/wallpapers";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import {
  IconX,
  IconCheck,
  IconPalette,
  IconHash,
  IconPlus,
  IconTrash,
  IconPencil,
  IconAlertCircle,
  IconSparkles,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/Button";

interface EditWallpaperModalProps {
  wallpaper: Wallpaper | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (updated: Wallpaper) => void;
}

export const EditWallpaperModal: React.FC<EditWallpaperModalProps> = ({
  wallpaper,
  isOpen,
  onClose,
  onSaved,
}) => {
  // Form fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [description, setDescription] = useState("");
  const [dominantColor, setDominantColor] = useState("#111B2A");
  const [palette, setPalette] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState("");
  const [orientation, setOrientation] = useState<"desktop" | "mobile">("desktop");

  // State
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Synchronize initial data whenever a wallpaper is opened
  useEffect(() => {
    if (wallpaper) {
      setTitle(wallpaper.title || "");
      const cat = wallpaper.category || "Dark Abstract";
      setCategory(cat);
      setIsCustomCategory(
        !CATEGORIES.includes(cat) && !MOBILE_CATEGORIES.includes(cat)
      );
      setCustomCategoryInput(
        !CATEGORIES.includes(cat) && !MOBILE_CATEGORIES.includes(cat) ? cat : ""
      );
      setCollectionName(wallpaper.collection || cat);
      setDescription(wallpaper.description || "");
      setDominantColor(wallpaper.dominantColor || "#111B2A");

      // Palette fallback
      const initialPalette =
        wallpaper.palette && wallpaper.palette.length > 0
          ? [...wallpaper.palette]
          : [
              wallpaper.dominantColor || "#111B2A",
              wallpaper.paletteHex || "#344153",
              "#D99562",
            ];
      setPalette(initialPalette);

      setTagsInput(wallpaper.tags ? wallpaper.tags.join(", ") : "");
      setOrientation(wallpaper.orientation || "desktop");
      setError("");
      setSuccess(false);
    }
  }, [wallpaper]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSaving) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSaving, onClose]);

  if (!isOpen || !wallpaper) return null;

  const handlePaletteColorChange = (index: number, newColor: string) => {
    const updated = [...palette];
    updated[index] = newColor;
    setPalette(updated);
  };

  const handleAddPaletteColor = () => {
    if (palette.length < 5) {
      setPalette([...palette, "#888888"]);
    }
  };

  const handleRemovePaletteColor = (index: number) => {
    if (palette.length > 1) {
      setPalette(palette.filter((_, i) => i !== index));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Please provide a title for the wallpaper.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const finalCategory = isCustomCategory
        ? customCategoryInput.trim() || category
        : category;

      const parsedTags = tagsInput
        .split(",")
        .map((t) => t.trim().toLowerCase().replace(/^#/, ""))
        .filter(Boolean);

      const updatedPayload: Partial<Wallpaper> = {
        title: title.trim(),
        category: finalCategory,
        collection: collectionName.trim() || finalCategory,
        description: description.trim(),
        dominantColor,
        paletteHex: palette[0] || dominantColor,
        palette,
        tags: parsedTags,
        orientation,
      };

      // Persist to Firestore with merge: true (handles existing or newly synced entries)
      const docRef = doc(db, "wallpapers", wallpaper.id);
      await setDoc(docRef, updatedPayload, { merge: true });

      setSuccess(true);

      const mergedWallpaper: Wallpaper = {
        ...wallpaper,
        ...updatedPayload,
      } as Wallpaper;

      if (onSaved) {
        onSaved(mergedWallpaper);
      }

      setTimeout(() => {
        setIsSaving(false);
        onClose();
      }, 700);
    } catch (err: any) {
      console.error("Failed to update wallpaper metadata:", err);
      setError(err?.message || "Failed to save wallpaper metadata to Firestore.");
      setIsSaving(false);
    }
  };

  const allAvailableCategories = Array.from(
    new Set([...CATEGORIES.filter((c) => c !== "All"), ...MOBILE_CATEGORIES])
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-foreground/60 backdrop-blur-xs">
        {/* Backdrop click */}
        <div
          className="absolute inset-0"
          onClick={() => !isSaving && onClose()}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
          className="relative z-10 w-full max-w-2xl max-h-[92vh] flex flex-col border border-border bg-surface shadow-2xl rounded-none overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5 bg-background">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-14 shrink-0 border border-border overflow-hidden bg-muted/40">
                <Image
                  src={getCdnImageUrl(wallpaper.thumbnailUrl || wallpaper.imageUrl)}
                  alt={wallpaper.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-primary font-semibold flex items-center gap-1">
                  <IconPencil size={12} />
                  <span>Metadata Editor</span>
                </span>
                <h3 className="font-sans text-sm sm:text-base font-semibold text-foreground line-clamp-1">
                  {wallpaper.title}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              aria-label="Close modal"
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <IconX size={18} />
            </button>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {error && (
              <div className="flex items-start gap-2 border border-destructive/60 bg-destructive/10 p-3 text-xs text-destructive">
                <IconAlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 border border-emerald-500 bg-emerald-50 text-emerald-800 p-3 text-xs">
                <IconCheck size={16} className="text-emerald-600 shrink-0" />
                <span>Metadata saved successfully! Updating showcase...</span>
              </div>
            )}

            {/* 1. Title */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                Wallpaper Title <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Midnight Amber"
                className="h-10 w-full rounded-none border border-border bg-background px-3 font-sans text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            {/* 2. Category & Collection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    Category
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustomCategory(!isCustomCategory)}
                    className="font-mono text-[11px] text-primary hover:underline cursor-pointer"
                  >
                    {isCustomCategory ? "Choose preset" : "+ Custom"}
                  </button>
                </div>

                {isCustomCategory ? (
                  <input
                    type="text"
                    required
                    placeholder="e.g. AMOLED Gradient"
                    value={customCategoryInput}
                    onChange={(e) => setCustomCategoryInput(e.target.value)}
                    className="h-10 w-full rounded-none border border-primary bg-background px-3 font-sans text-xs text-foreground focus:outline-none"
                  />
                ) : (
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-10 w-full rounded-none border border-border bg-background px-3 font-sans text-xs text-foreground focus:border-primary focus:outline-none"
                  >
                    {allAvailableCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                  Collection
                </label>
                <input
                  type="text"
                  value={collectionName}
                  onChange={(e) => setCollectionName(e.target.value)}
                  placeholder="e.g. Minimal Abstracts"
                  className="h-10 w-full rounded-none border border-border bg-background px-3 font-sans text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            {/* 3. Dominant Color & Color Palette */}
            <div className="border border-border bg-background/50 p-4 space-y-3.5">
              <div className="flex items-center justify-between">
                <label className="font-mono text-xs uppercase tracking-wider text-foreground flex items-center gap-1.5 font-semibold">
                  <IconPalette size={14} className="text-primary" />
                  <span>Color Tones & Palette</span>
                </label>
                <span className="font-mono text-[10px] text-muted-foreground">
                  Up to 5 palette accents
                </span>
              </div>

              {/* Dominant Color */}
              <div>
                <span className="block font-mono text-[11px] text-muted-foreground mb-1">
                  Primary Dominant Tone (Used for background/contrast):
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={dominantColor}
                    onChange={(e) => setDominantColor(e.target.value)}
                    className="h-9 w-12 border border-border bg-background cursor-pointer p-0.5 rounded-none"
                  />
                  <input
                    type="text"
                    value={dominantColor}
                    onChange={(e) => setDominantColor(e.target.value)}
                    className="h-9 flex-1 border border-border bg-background px-3 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                  <div className="flex items-center gap-1">
                    {["#111B2A", "#F0E5D2", "#829BAA", "#263F32", "#B8A9D0"].map(
                      (preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setDominantColor(preset)}
                          style={{ backgroundColor: preset }}
                          className="h-6 w-6 border border-border/80 hover:scale-110 transition-transform cursor-pointer"
                          title={`Pick ${preset}`}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Palette Array */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[11px] text-muted-foreground">
                    Palette Swatches ({palette.length}/5):
                  </span>
                  {palette.length < 5 && (
                    <button
                      type="button"
                      onClick={handleAddPaletteColor}
                      className="font-mono text-[11px] text-primary hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <IconPlus size={12} />
                      <span>Add Swatch</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {palette.map((colorHex, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1.5 border border-border bg-surface p-1.5"
                    >
                      <input
                        type="color"
                        value={colorHex}
                        onChange={(e) =>
                          handlePaletteColorChange(idx, e.target.value)
                        }
                        className="h-7 w-7 border border-border cursor-pointer p-0 rounded-none shrink-0"
                      />
                      <input
                        type="text"
                        value={colorHex}
                        onChange={(e) =>
                          handlePaletteColorChange(idx, e.target.value)
                        }
                        className="h-7 flex-1 min-w-0 border border-border/60 bg-background px-1.5 font-mono text-[11px] text-foreground"
                      />
                      {palette.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePaletteColor(idx)}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                          title="Remove swatch"
                        >
                          <IconTrash size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Tags */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
                <IconHash size={13} className="text-primary" />
                <span>Tags (Comma Separated)</span>
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="minimal, 4k, dark, abstract, clean"
                className="h-10 w-full rounded-none border border-border bg-background px-3 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            {/* 5. Editorial Description */}
            <div>
              <label className="block font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1.5">
                Editorial Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Curator notes, composition details, and lighting..."
                className="w-full rounded-none border border-border bg-background p-3 font-sans text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            {/* 6. Orientation Mode */}
            <div className="flex items-center gap-4 pt-1">
              <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                Display Format:
              </span>
              <label className="flex items-center gap-1.5 font-mono text-xs text-foreground cursor-pointer">
                <input
                  type="radio"
                  name="orientation"
                  value="desktop"
                  checked={orientation === "desktop"}
                  onChange={() => setOrientation("desktop")}
                  className="accent-primary cursor-pointer"
                />
                <span>Desktop (16:9 / 16:10)</span>
              </label>
              <label className="flex items-center gap-1.5 font-mono text-xs text-foreground cursor-pointer">
                <input
                  type="radio"
                  name="orientation"
                  value="mobile"
                  checked={orientation === "mobile"}
                  onChange={() => setOrientation("mobile")}
                  className="accent-primary cursor-pointer"
                />
                <span>Mobile (9:19.5)</span>
              </label>
            </div>
          </form>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-border px-5 py-3.5 bg-background">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="h-10 px-4 font-mono text-xs text-foreground border border-border hover:border-foreground transition-colors cursor-pointer rounded-none disabled:opacity-50"
            >
              Cancel
            </button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              isLoading={isSaving}
              className="h-10 px-5 text-xs font-semibold gap-1.5"
            >
              <IconCheck size={14} />
              <span>Save Changes</span>
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
