import React from "react";
import Image from "next/image";
import { IconSparkles, IconChecklist, IconPalette, IconDeviceTv } from "@tabler/icons-react";

export const EditorialAboutSection: React.FC = () => {
  return (
    <section id="about" className="w-full border-b border-border bg-surface py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 bg-primary" />
              <span className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
                Editorial Manifesto
              </span>
            </div>

            <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground leading-tight">
              Quiet interface. Expressive artwork. Thoughtful details.
            </h2>

            <p className="font-sans text-base text-muted-foreground leading-relaxed">
              Most digital background websites bombard you with garish ads, neon gradients, and
              artificial AI clutter. Xweet Wallpapers is designed in reverse: an editorial
              monastery built with warm cream paper tones, forest-green inks, and crisp rectangular
              geometry.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border">
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 font-mono text-xs font-semibold text-foreground uppercase">
                  <IconPalette size={16} className="text-primary" />
                  <span>Curated Chromatics</span>
                </div>
                <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                  Every palette is selected to reduce retinal strain and complement desk hardware
                  aesthetics.
                </p>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2 font-mono text-xs font-semibold text-foreground uppercase">
                  <IconDeviceTv size={16} className="text-primary" />
                  <span>Uncompromised Precision</span>
                </div>
                <p className="font-sans text-xs text-muted-foreground leading-relaxed">
                  Full 4K and 5K master assets stored losslessly, ready for macOS, Windows, and
                  handheld screens.
                </p>
              </div>
            </div>
          </div>

          {/* Right Brand Manifest Box */}
          <div className="lg:col-span-5 border border-border bg-background p-8 relative">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-border bg-white shadow-xs">
                <Image
                  src="/logo.png"
                  alt="Xweet Wallpapers"
                  fill
                  sizes="48px"
                  className="object-contain p-1"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-base font-semibold text-foreground">
                  Xweet Identity
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  Warm Editorial Design Standard
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3 font-mono text-xs text-muted-foreground">
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span>PRIMARY CANVAS</span>
                <span className="text-foreground font-medium">#F6F3E9 (Cream)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span>ACCENT INK</span>
                <span className="text-primary font-medium">#244B38 (Forest)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-border/50">
                <span>GEOMETRY</span>
                <span className="text-foreground font-medium">0px Radius (Sharp)</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span>TYPOGRAPHY</span>
                <span className="text-foreground font-medium">Geist Sans & Mono</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
