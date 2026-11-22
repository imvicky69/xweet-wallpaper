import fs from "fs";
import path from "path";
import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";

const envContent = fs.readFileSync(".env.local", "utf-8");
const env = {};
envContent.split("\n").forEach((l) => {
  const [k, ...v] = l.trim().split("=");
  if (k && !k.startsWith("#")) env[k] = v.join("=").replace(/^["']|["']$/g, "");
});

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const wallpapersTs = fs.readFileSync("src/lib/wallpapers.ts", "utf-8");
const jsonMatch = wallpapersTs.match(/const RAW_WALLPAPERS: WallpaperDoc\[\] = (\[[\s\S]*?\]);/);
const wallpapers = JSON.parse(jsonMatch[1]);

async function checkAsset(wp) {
  const localPng = path.resolve(`public/wallpapers/${wp.slug}.png`);
  const localWebp = path.resolve(`public/wallpapers/${wp.slug}.webp`);
  let localFound = fs.existsSync(localPng) ? localPng : fs.existsSync(localWebp) ? localWebp : null;

  let r2Found = false;
  const r2Key = wp.storage?.r2Key || `wallpapers/${wp.slug}.webp`;
  try {
    await s3.send(new HeadObjectCommand({ Bucket: env.CLOUDFLARE_R2_BUCKET_NAME || "xweet", Key: r2Key }));
    r2Found = true;
  } catch {}

  let cdnFound = false;
  if (!localFound && !r2Found) {
    try {
      const res = await fetch(`https://cdn.xweet.in/${r2Key}`);
      if (res.ok) cdnFound = true;
    } catch {}
  }

  return { slug: wp.slug, localFound: Boolean(localFound), r2Found, cdnFound };
}

async function main() {
  console.log(`Checking master assets for all ${wallpapers.length} wallpapers...`);
  const results = [];
  for (const wp of wallpapers) {
    const res = await checkAsset(wp);
    results.push(res);
    console.log(`[${res.slug}] Local: ${res.localFound ? "✓" : "✗"} | R2: ${res.r2Found ? "✓" : "✗"} | CDN: ${res.cdnFound ? "✓" : "✗"}`);
  }
}

main().catch(console.error);
