import React from "react";
import Image from "next/image";
import { IconArrowRight } from "@tabler/icons-react";
import { COLLECTIONS } from "@/lib/wallpapers";

interface FeaturedCollectionsSectionProps {
  onSelectCollection: (categoryName: string) => void;
}

export const FeaturedCollectionsSection: React.FC<FeaturedCollectionsSectionProps> = ({
  onSelectCollection,
}) => {
  return (
    <section id="collections" className="w-full border-b border-border bg-background py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Section title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6 border-b border-border">
          <div>
            <span className="font-mono text-xs font-semibold text-primary uppercase tracking-wider">
              Curated Series
            </span>
            <h2 className="font-sans text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mt-1">
              Browse by Editorial Style
            </h2>
          </div>
          <span className="font-mono text-xs text-muted-foreground uppercase">
            6 Core Disciplines
          </span>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {COLLECTIONS.map((col) => (
            <div
              key={col.id}
              onClick={() => onSelectCollection(col.title)}
              className="group border border-border bg-surface overflow-hidden cursor-pointer transition-all duration-200 hover:border-primary flex flex-col justify-between"
            >
              {/* Cover Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted/30">
                <Image
                  src={col.coverImageUrl}
                  alt={col.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute top-3 right-3 bg-surface/90 text-foreground font-mono text-[10px] px-2 py-0.5 border border-border backdrop-blur-xs">
                  {col.count} WORKS
                </div>
              </div>

              {/* Text Info */}
              <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                <div>
                  <h3 className="font-sans text-lg font-semibold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                    <span>{col.title}</span>
                    <IconArrowRight
                      size={16}
                      className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all"
                    />
                  </h3>
                  <p className="font-sans text-xs text-muted-foreground mt-2 leading-relaxed">
                    {col.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-border/50">
                  {col.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-border/80 bg-background px-2 py-0.5 font-mono text-[10px] text-muted-foreground uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
