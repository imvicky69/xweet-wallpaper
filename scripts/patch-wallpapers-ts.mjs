import fs from "fs";
import path from "path";

const filePath = path.resolve(process.cwd(), "src", "lib", "wallpapers.ts");
let content = fs.readFileSync(filePath, "utf-8");

// Replace imageUrl: "/wallpapers/${slug}.png", with:
// imageUrl: "/wallpapers/${slug}.png",
// thumbnailUrl: "/wallpapers/thumbnails/${slug}.webp",
const updated = content.replace(
  /imageUrl: "(\/wallpapers\/([^"]+)\.png)",/g,
  (match, p1, slug) => {
    return `imageUrl: "${p1}",\n    thumbnailUrl: "/wallpapers/thumbnails/${slug}.webp",`;
  }
);

fs.writeFileSync(filePath, updated, "utf-8");
console.log("✓ Updated wallpapers.ts with thumbnailUrl for all items!");
