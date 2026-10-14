import fs from "fs";
import path from "path";

const filePath = path.resolve(process.cwd(), "src", "lib", "wallpapers.ts");
let content = fs.readFileSync(filePath, "utf-8");

// Replace phoneImageUrl: "/wallpapers/${slug}.png" with phoneImageUrl: "/wallpapers/phone/${slug}.png"
const updated = content.replace(
  /phoneImageUrl: "\/wallpapers\/([^"]+)\.png",/g,
  'phoneImageUrl: "/wallpapers/phone/$1.png",'
);

fs.writeFileSync(filePath, updated, "utf-8");
console.log("✓ Updated phoneImageUrl in wallpapers.ts to point to /wallpapers/phone/${slug}.png!");
