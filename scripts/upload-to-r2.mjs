import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

// Load .env.local
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
const cdnUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN || "https://cdn.xweet.com";

if (!accountId || !accessKeyId || !secretAccessKey) {
  console.error("❌ Missing Cloudflare R2 credentials in environment.");
  process.exit(1);
}

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

async function uploadDir(dirPath, r2Prefix) {
  if (!fs.existsSync(dirPath)) return;
  const entries = fs.readdirSync(dirPath);

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry);
    if (fs.statSync(fullPath).isDirectory()) continue;

    const ext = path.extname(entry).toLowerCase();
    const contentType =
      ext === ".webp"
        ? "image/webp"
        : ext === ".jpg" || ext === ".jpeg"
        ? "image/jpeg"
        : "image/png";

    const key = `${r2Prefix}${entry}`;
    const fileBuffer = fs.readFileSync(fullPath);

    console.log(`  -> Uploading [${key}] (${(fileBuffer.length / 1024).toFixed(0)} KB)...`);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    });

    try {
      await s3.send(command);
    } catch (err) {
      console.error(`  ✗ Error uploading ${entry}:`, err.message);
    }
  }
}

async function uploadAll() {
  console.log("======================================================");
  console.log(`UPLOADING ALL LOCAL WALLPAPERS & ASSETS TO CLOUDFLARE R2`);
  console.log(`Bucket:   ${bucketName}`);
  console.log(`CDN Base: ${cdnUrl}`);
  console.log("======================================================\n");

  console.log("1. Uploading Desktop Masters (4K PNGs)...");
  await uploadDir(path.resolve(process.cwd(), "public/wallpapers"), "wallpapers/");

  console.log("\n2. Uploading Phone Wallpapers (9:16)...");
  await uploadDir(path.resolve(process.cwd(), "public/wallpapers/phone"), "wallpapers/phone/");

  console.log("\n3. Uploading WebP Thumbnails (800px)...");
  await uploadDir(path.resolve(process.cwd(), "public/wallpapers/thumbnails"), "wallpapers/thumbnails/");

  console.log("\n======================================================");
  console.log("✓ ALL 4K MASTERS, PHONE WALLPAPERS, AND THUMBNAILS ARE IN CLOUDFLARE R2!");
  console.log("======================================================\n");
}

uploadAll().catch(console.error);
