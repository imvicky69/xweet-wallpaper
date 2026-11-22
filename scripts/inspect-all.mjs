import fs from "fs";
import path from "path";

const wallpapersTs = fs.readFileSync("src/lib/wallpapers.ts", "utf-8");
const idMatches = wallpapersTs.match(/"id":\s*"(wp-[^"]+)"/g) || [];
const slugs = (wallpapersTs.match(/"slug":\s*"([^"]+)"/g) || []).map(s => s.replace(/"slug":\s*"/, "").replace(/"/, ""));

console.log("Wallpapers in src/lib/wallpapers.ts:", idMatches.length);
console.log("Slugs in src/lib/wallpapers.ts:", slugs);

const localDir = path.resolve("public/wallpapers");
const localFiles = fs.readdirSync(localDir).filter(f => !fs.statSync(path.join(localDir, f)).isDirectory());
console.log("\nLocal master files in public/wallpapers/ (" + localFiles.length + "):", localFiles);

const phoneDir = path.resolve("public/wallpapers/phone");
if (fs.existsSync(phoneDir)) {
  const phoneFiles = fs.readdirSync(phoneDir).filter(f => !fs.statSync(path.join(phoneDir, f)).isDirectory());
  console.log("\nLocal phone files in public/wallpapers/phone/ (" + phoneFiles.length + "):", phoneFiles);
}
