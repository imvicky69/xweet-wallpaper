"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { WallpaperCropCoords } from "@/types/wallpaper";
import {
  IconDeviceMobile,
  IconAdjustments,
  IconArrowsHorizontal,
  IconRefresh,
  IconCheck,
  IconSparkles,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";

interface PhoneCropEditorProps {
  imageUrl: string;
  initialCrop?: WallpaperCropCoords;
  wallpaperTitle?: string;
  aspectRatio?: string;
  onChange: (coords: WallpaperCropCoords) => void;
}

export const PhoneCropEditor: React.FC<PhoneCropEditorProps> = ({
  imageUrl,
  initialCrop,
  wallpaperTitle = "Wallpaper",
  aspectRatio,
  onChange,
}) => {
  // 1. Natural Dimensions of Master Asset (default 4K 16:9)
  const [naturalDimensions, setNaturalDimensions] = useState({
    width: 3840,
    height: 2160,
  });

  // 2. Aspect Ratio Mode: 9:19.5 (modern flagships) vs 9:16 (standard vertical)
  const [aspectMode, setAspectMode] = useState<"9:19.5" | "9:16">("9:19.5");
  const [showUiOverlay, setShowUiOverlay] = useState(true);

  // 3. Normalized Horizontal Position [0% to 100%]
  const [horizontalPercent, setHorizontalPercent] = useState<number>(() => {
    if (initialCrop && typeof initialCrop.x === "number") {
      const estimatedWidth = initialCrop.width || 997;
      const maxOff = Math.max(1, 3840 - estimatedWidth);
      const pct = (initialCrop.x / maxOff) * 100;
      return Math.max(0, Math.min(100, pct));
    }
    return 50; // Default center
  });

  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Calculate target aspect numeric ratio
  const targetRatio = aspectMode === "9:19.5" ? 9 / 19.5 : 9 / 16;

  // Calculate computed crop pixel coordinates on the master
  const { cropX, cropY, cropWidth, cropHeight, maxCropX } = React.useMemo(() => {
    const W = naturalDimensions.width;
    const H = naturalDimensions.height;

    // Is image already portrait?
    if (W < H) {
      return {
        cropX: 0,
        cropY: 0,
        cropWidth: W,
        cropHeight: H,
        maxCropX: 0,
      };
    }

    const calculatedHeight = H;
    const calculatedWidth = Math.min(W, Math.round(H * targetRatio));
    const maxX = Math.max(0, W - calculatedWidth);
    const calculatedX = Math.round((horizontalPercent / 100) * maxX);

    return {
      cropX: calculatedX,
      cropY: 0,
      cropWidth: calculatedWidth,
      cropHeight: calculatedHeight,
      maxCropX: maxX,
    };
  }, [naturalDimensions, targetRatio, horizontalPercent]);

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  const lastCoordsRef = useRef<WallpaperCropCoords | null>(null);

  // Notify parent on coordinate changes without creating re-render loops
  useEffect(() => {
    const prev = lastCoordsRef.current;
    if (
      !prev ||
      prev.x !== cropX ||
      prev.y !== cropY ||
      prev.width !== cropWidth ||
      prev.height !== cropHeight
    ) {
      const newCoords: WallpaperCropCoords = {
        x: cropX,
        y: cropY,
        width: cropWidth,
        height: cropHeight,
      };
      lastCoordsRef.current = newCoords;
      onChangeRef.current(newCoords);
    }
  }, [cropX, cropY, cropWidth, cropHeight]);

  const calibratedRef = useRef(false);

  // Handle Master Image load to lock exact resolution
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth > 0 && naturalHeight > 0) {
      setNaturalDimensions({
        width: naturalWidth,
        height: naturalHeight,
      });

      // Recalibrate initial percentage once if initialCrop provided
      if (!calibratedRef.current && initialCrop && initialCrop.width) {
        calibratedRef.current = true;
        const maxX = Math.max(1, naturalWidth - initialCrop.width);
        const pct = (initialCrop.x / maxX) * 100;
        setHorizontalPercent(Math.max(0, Math.min(100, pct)));
      }
    }
  };

  // Drag interaction on master canvas
  const updatePositionFromPointer = useCallback(
    (clientX: number) => {
      if (!canvasRef.current || naturalDimensions.width < naturalDimensions.height) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const pointerX = clientX - rect.left;

      // Box width relative to canvas width
      const boxRatio = cropWidth / naturalDimensions.width;
      const boxCanvasWidth = boxRatio * rect.width;

      // Desired box center is pointerX
      const desiredBoxLeft = pointerX - boxCanvasWidth / 2;
      const maxLeft = Math.max(1, rect.width - boxCanvasWidth);

      const clampedPercent = Math.max(0, Math.min(100, (desiredBoxLeft / maxLeft) * 100));
      setHorizontalPercent(clampedPercent);
    },
    [cropWidth, naturalDimensions.width]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updatePositionFromPointer(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      updatePositionFromPointer(e.clientX);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }
    }
  };

  // Presets
  const setPreset = (percent: number) => {
    setHorizontalPercent(percent);
  };

  // Visual percentages for the overlay box
  const boxWidthPercent = (cropWidth / naturalDimensions.width) * 100;
  const boxLeftPercent = (cropX / naturalDimensions.width) * 100;

  return (
    <div className="space-y-5">
      {/* Editorial Header / Context Banner */}
      <div className="border border-border bg-background/60 p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
            <IconDeviceMobile size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-mono text-xs uppercase tracking-wider font-semibold text-foreground">
                Dynamic Phone Crop Studio
              </h4>
              <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 bg-secondary text-secondary-foreground font-semibold">
                Single Master 4K
              </span>
            </div>
            <p className="font-sans text-[11px] text-muted-foreground mt-0.5">
              Drag the crop frame or slide below to position the vertical lockscreen edition.
            </p>
          </div>
        </div>

        {/* Aspect Ratio Selector */}
        <div className="flex items-center gap-1 bg-surface border border-border p-0.5 text-xs font-mono">
          <button
            type="button"
            onClick={() => setAspectMode("9:19.5")}
            className={`px-2.5 py-1 transition-colors cursor-pointer ${
              aspectMode === "9:19.5"
                ? "bg-foreground text-background font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            9:19.5 (Flagship)
          </button>
          <button
            type="button"
            onClick={() => setAspectMode("9:16")}
            className={`px-2.5 py-1 transition-colors cursor-pointer ${
              aspectMode === "9:16"
                ? "bg-foreground text-background font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            9:16 (Standard)
          </button>
        </div>
      </div>

      {/* Main Studio: Canvas on Left, Live Mockup on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left: Master Image Canvas with Draggable Crop Box (7 cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <IconArrowsHorizontal size={14} className="text-primary" />
              <span>Full 4K Master Canvas (Click & Drag to Reposition)</span>
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">
              {naturalDimensions.width} × {naturalDimensions.height} px
            </span>
          </div>

          {/* Interactive Canvas */}
          <div
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="relative w-full aspect-[16/9] border border-border bg-black/90 overflow-hidden cursor-ew-resize select-none touch-none shadow-md group"
          >
            {/* Master Artwork */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt={wallpaperTitle}
              onLoad={handleImageLoad}
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
              draggable={false}
            />

            {/* Left Shaded Dimmed Area */}
            <div
              className="absolute top-0 bottom-0 left-0 bg-black/65 backdrop-blur-[1px] pointer-events-none transition-all duration-75"
              style={{ width: `${boxLeftPercent}%` }}
            />

            {/* Right Shaded Dimmed Area */}
            <div
              className="absolute top-0 bottom-0 right-0 bg-black/65 backdrop-blur-[1px] pointer-events-none transition-all duration-75"
              style={{ width: `${Math.max(0, 100 - (boxLeftPercent + boxWidthPercent))}%` }}
            />

            {/* Active Crop Window Box */}
            <div
              className="absolute top-0 bottom-0 border-2 border-primary shadow-[0_0_15px_rgba(36,75,56,0.5)] transition-all duration-75 flex flex-col justify-between p-2 pointer-events-none"
              style={{
                left: `${boxLeftPercent}%`,
                width: `${boxWidthPercent}%`,
              }}
            >
              {/* Subtle Rule-of-Thirds Grid Overlay */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20">
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-r border-b border-white" />
                <div className="border-b border-white" />
                <div className="border-r border-white" />
                <div className="border-r border-white" />
                <div />
              </div>

              {/* Top Handle Badge */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="font-mono text-[9px] bg-primary text-white font-semibold px-1 py-0.5 shadow-sm">
                  {aspectMode}
                </span>
                <span className="font-mono text-[9px] bg-black/70 text-white/90 px-1 py-0.5 backdrop-blur-xs">
                  {Math.round(horizontalPercent)}%
                </span>
              </div>

              {/* Center Drag Icon Cue */}
              <div className="relative z-10 mx-auto bg-black/60 text-white/90 p-1 rounded-full border border-white/20 backdrop-blur-xs opacity-75 group-hover:opacity-100 transition-opacity">
                <IconArrowsHorizontal size={14} />
              </div>

              {/* Bottom Lockscreen Time Guide */}
              <div className="relative z-10 text-center pb-1">
                <span className="font-mono text-[9px] uppercase tracking-wider text-white/80 font-medium bg-black/40 px-1.5 py-0.5 rounded-xs backdrop-blur-xs">
                  Lockscreen Focus
                </span>
              </div>
            </div>
          </div>

          {/* Slider & Presets Toolbar */}
          <div className="border border-border bg-background/50 p-3 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-muted-foreground flex items-center gap-1">
                <IconAdjustments size={13} className="text-primary" />
                <span>Horizontal Position Offset:</span>
              </span>
              <span className="font-semibold text-foreground">
                {cropX}px <span className="text-muted-foreground">({Math.round(horizontalPercent)}%)</span>
              </span>
            </div>

            {/* Range Slider */}
            <input
              type="range"
              min={0}
              max={100}
              step={0.5}
              value={horizontalPercent}
              onChange={(e) => setHorizontalPercent(parseFloat(e.target.value))}
              className="w-full accent-primary h-2 bg-muted/60 cursor-pointer rounded-none"
            />

            {/* Quick Presets Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-1.5 pt-1">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Presets:
              </span>
              <div className="flex flex-wrap items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPreset(15)}
                  className={`font-mono text-[10px] px-2 py-1 border transition-colors cursor-pointer ${
                    Math.abs(horizontalPercent - 15) < 3
                      ? "bg-primary text-white border-primary"
                      : "border-border bg-surface text-foreground hover:border-foreground"
                  }`}
                >
                  Left Subject (15%)
                </button>
                <button
                  type="button"
                  onClick={() => setPreset(33.3)}
                  className={`font-mono text-[10px] px-2 py-1 border transition-colors cursor-pointer ${
                    Math.abs(horizontalPercent - 33.3) < 3
                      ? "bg-primary text-white border-primary"
                      : "border-border bg-surface text-foreground hover:border-foreground"
                  }`}
                >
                  Rule of 1/3 (33%)
                </button>
                <button
                  type="button"
                  onClick={() => setPreset(50)}
                  className={`font-mono text-[10px] px-2 py-1 border transition-colors cursor-pointer ${
                    Math.abs(horizontalPercent - 50) < 3
                      ? "bg-primary text-white border-primary"
                      : "border-border bg-surface text-foreground hover:border-foreground"
                  }`}
                >
                  Center Focus (50%)
                </button>
                <button
                  type="button"
                  onClick={() => setPreset(66.7)}
                  className={`font-mono text-[10px] px-2 py-1 border transition-colors cursor-pointer ${
                    Math.abs(horizontalPercent - 66.7) < 3
                      ? "bg-primary text-white border-primary"
                      : "border-border bg-surface text-foreground hover:border-foreground"
                  }`}
                >
                  Rule of 2/3 (67%)
                </button>
                <button
                  type="button"
                  onClick={() => setPreset(85)}
                  className={`font-mono text-[10px] px-2 py-1 border transition-colors cursor-pointer ${
                    Math.abs(horizontalPercent - 85) < 3
                      ? "bg-primary text-white border-primary"
                      : "border-border bg-surface text-foreground hover:border-foreground"
                  }`}
                >
                  Right Subject (85%)
                </button>
                <button
                  type="button"
                  onClick={() => setPreset(50)}
                  title="Reset to Center"
                  className="p-1 border border-border bg-surface text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <IconRefresh size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Live Real-Time Phone Mockup Preview (5 cols) */}
        <div className="lg:col-span-4 flex flex-col items-center space-y-3">
          <div className="w-full flex items-center justify-between">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <IconSparkles size={14} className="text-primary" />
              <span>Real-Time Phone Preview</span>
            </span>
            <button
              type="button"
              onClick={() => setShowUiOverlay(!showUiOverlay)}
              className="font-mono text-[10px] text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              {showUiOverlay ? <IconEyeOff size={12} /> : <IconEye size={12} />}
              <span>{showUiOverlay ? "Hide UI" : "Show UI"}</span>
            </button>
          </div>

          {/* Phone Frame: True 9:19.5 or 9:16 aspect with Hardware-Accelerated Real-Time Crop */}
          <div
            className={`relative w-44 sm:w-48 ${
              aspectMode === "9:19.5" ? "aspect-[9/19.5] rounded-[28px]" : "aspect-[9/16] rounded-[22px]"
            } border-4 border-foreground/35 shadow-2xl overflow-hidden bg-black select-none`}
          >
            {/* Hardware-Accelerated Real-Time Cropped Master Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Phone Crop Live Preview"
              style={{
                position: "absolute",
                height: "100%",
                width: `${(naturalDimensions.width / cropWidth) * 100}%`,
                left: `-${(cropX / cropWidth) * 100}%`,
                top: 0,
                maxWidth: "none",
                objectFit: "cover",
                pointerEvents: "none",
              }}
              draggable={false}
            />

            {/* Realistic Mobile Lockscreen UI Simulation */}
            {showUiOverlay && (
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50 pointer-events-none flex flex-col justify-between p-3.5 text-center">
                {/* Status Bar & Dynamic Island */}
                <div className="pt-1">
                  <div className="h-3 w-14 bg-black/80 rounded-full mx-auto mb-2 border border-white/10" />
                  <p className="font-mono text-[8px] uppercase tracking-widest text-white/70 font-medium">
                    Wednesday, Oct 14
                  </p>
                  <h5 className="font-sans text-3xl font-light text-white tracking-tight drop-shadow-md mt-0.5">
                    09:41
                  </h5>
                </div>

                {/* Bottom Controls */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-2 text-white/80">
                    <div className="h-6 w-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-[10px]">
                      ⚡
                    </div>
                    <div className="h-6 w-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-[10px]">
                      📷
                    </div>
                  </div>
                  <div className="h-1 w-12 bg-white/70 rounded-full mx-auto" />
                </div>
              </div>
            )}
          </div>

          {/* Technical Specs Readout */}
          <div className="w-full border border-border bg-surface p-2.5 space-y-1 font-mono text-[10px] text-muted-foreground">
            <div className="flex justify-between">
              <span>Crop Dimensions:</span>
              <span className="text-foreground font-semibold">
                {cropWidth} × {cropHeight}px
              </span>
            </div>
            <div className="flex justify-between">
              <span>Extraction Window:</span>
              <span className="text-foreground">
                X: {cropX}px, Y: {cropY}px
              </span>
            </div>
            <div className="flex justify-between">
              <span>Dynamic Pipeline:</span>
              <span className="text-primary font-semibold flex items-center gap-1">
                <IconCheck size={11} />
                <span>Lossless 4K WebP</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
