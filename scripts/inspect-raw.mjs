import fs from "fs";

const wallpapersTs = fs.readFileSync("src/lib/wallpapers.ts", "utf-8");
const jsonMatch = wallpapersTs.match(/const RAW_WALLPAPERS: WallpaperDoc\[\] = (\[[\s\S]*?\]);/);
if (jsonMatch) {
  const wallpapers = JSON.parse(jsonMatch[1]);
  console.log("Total RAW_WALLPAPERS:", wallpapers.length);
  wallpapers.forEach((w, i) => {
    console.log(`[${i+1}] ${w.id} (${w.slug}): r2Key=${w.storage?.r2Key}, phoneCropCoords=${JSON.stringify(w.storage?.phoneCropCoords)}`);
  });
}
