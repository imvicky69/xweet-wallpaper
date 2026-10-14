import fs from "fs";
import path from "path";
import sharp from "sharp";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// 1. Load .env.local
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#")) {
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || "xweet";
const cdnDomain = process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN || "https://cdn.xweet.com";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

async function run() {
  const wallpapersDir = path.resolve(process.cwd(), "public", "wallpapers");
  const thumbsDir = path.join(wallpapersDir, "thumbnails");

  if (!fs.existsSync(thumbsDir)) {
    fs.mkdirSync(thumbsDir, { recursive: true });
  }

  const files = fs.readdirSync(wallpapersDir).filter((f) => f.endsWith(".png"));

  console.log("=============================================================");
  console.log(`GENERATING WEBP THUMBNAILS & SYNCING TO CLOUDFLARE R2`);
  console.log(`Processing ${files.length} wallpapers...`);
  console.log("=============================================================\n");

  let totalOriginalBytes = 0;
  let totalThumbBytes = 0;

  for (const file of files) {
    const originalPath = path.join(wallpapersDir, file);
    const slug = file.replace(/\.png$/, "");
    const thumbFileName = `${slug}.webp`;
    const thumbPath = path.join(thumbsDir, thumbFileName);

    const origStats = fs.statSync(originalPath);
    totalOriginalBytes += origStats.size;

    // Generate lightweight WebP thumbnail using sharp (800px width, quality 82)
    const thumbBuffer = await sharp(originalPath)
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toBuffer();

    fs.writeFileSync(thumbPath, thumbBuffer);
    totalThumbBytes += thumbBuffer.length;

    const origMb = (origStats.size / (1024 * 1024)).toFixed(2);
    const thumbKb = (thumbBuffer.length / 1024).toFixed(1);
    const reduction = ((1 - thumbBuffer.length / origStats.size) * 100).toFixed(1);

    console.log(`✓ Generated: ${thumbFileName} (${origMb}MB -> ${thumbKb}KB, -${reduction}%)`);

    // Upload thumbnail to Cloudflare R2
    const r2Key = `wallpapers/thumbnails/${thumbFileName}`;
    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: r2Key,
          Body: thumbBuffer,
          ContentType: "image/webp",
          CacheControl: "public, max-age=31536000, immutable",
        })
      );
      console.log(`  └─ Synced to R2: ${r2Key}`);
    } catch (err) {
      console.warn(`  └─ R2 Upload Warning for ${r2Key}:`, err.message || err);
    }
  }

  console.log("\n=============================================================");
  console.log(`SUMMARY:`);
  console.log(`Original total size:   ${(totalOriginalBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Thumbnails total size: ${(totalThumbBytes / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`Bandwidth Savings:     ${((1 - totalThumbBytes / totalOriginalBytes) * 100).toFixed(1)}%`);
  console.log("=============================================================\n");
}

run().catch(console.error);
