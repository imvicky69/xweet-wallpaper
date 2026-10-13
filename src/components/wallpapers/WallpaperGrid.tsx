import React from "react";
import { Wallpaper } from "@/types/wallpaper";
import { WallpaperCard } from "./WallpaperCard";
import { IconPhotoOff, IconRefresh } from "@tabler/icons-react";
import { Button } from "@/components/ui/Button";

interface WallpaperGridProps {
  wallpapers: Wallpaper[];
  onPreview: (wallpaper: Wallpaper) => void;
  onResetFilters?: () => void;
}

export const WallpaperGrid: React.FC<WallpaperGridProps> = ({
  wallpapers,
  onPreview,
  onResetFilters,
}) => {
  if (wallpapers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border border-border bg-surface p-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center border border-border bg-muted/40 text-muted-foreground mb-4">
          <IconPhotoOff size={24} />
        </div>
        <h3 className="font-sans text-lg font-medium text-foreground">
          No wallpapers found
        </h3>
        <p className="font-sans text-sm text-muted-foreground mt-1 max-w-sm">
          No curated artwork matches the active combination of filters or search terms.
        </p>
        {onResetFilters && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onResetFilters}
            className="mt-6 text-xs"
          >
            <IconRefresh size={14} />
            <span>Reset All Filters</span>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {wallpapers.map((wallpaper) => (
        <WallpaperCard
          key={wallpaper.id}
          wallpaper={wallpaper}
          onPreview={onPreview}
        />
      ))}
    </div>
  );
};
