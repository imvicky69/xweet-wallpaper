import fs from "fs";
import path from "path";
import sharp from "sharp";

const newFolder = path.resolve("New folder");
const files = fs.readdirSync(newFolder).filter(f => f.endsWith(".png") || f.endsWith(".jpg") || f.endsWith(".webp"));

console.log(`Found ${files.length} new wallpaper files in 'New folder/':`);

for (const file of files) {
  const filePath = path.join(newFolder, file);
  const meta = await sharp(filePath).metadata();
  const ratio = (meta.width / meta.height).toFixed(2);
  const isPortrait = meta.width < meta.height;
  console.log(`• "${file}" -> ${meta.width} × ${meta.height} (${ratio}) [${isPortrait ? "PORTRAIT / MOBILE" : "LANDSCAPE / DESKTOP"}]`);
}
