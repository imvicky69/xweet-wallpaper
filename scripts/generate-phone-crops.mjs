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

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

async function generatePhoneCrops() {
  const wallpapersDir = path.resolve(process.cwd(), "public", "wallpapers");
  const phoneDir = path.join(wallpapersDir, "phone");
  const phoneThumbsDir = path.join(phoneDir, "thumbnails");

  if (!fs.existsSync(phoneDir)) fs.mkdirSync(phoneDir, { recursive: true });
  if (!fs.existsSync(phoneThumbsDir)) fs.mkdirSync(phoneThumbsDir, { recursive: true });

  const files = fs.readdirSync(wallpapersDir).filter((f) => f.endsWith(".png"));

  console.log("=============================================================");
  console.log(`GENERATING 9:19.5 PORTRAIT PHONE CROPS (1170 × 2532) FOR 16 WALLPAPERS`);
  console.log("=============================================================\n");

  for (const file of files) {
    const originalPath = path.join(wallpapersDir, file);
    const slug = file.replace(/\.png$/, "");
    const phoneFileName = `${slug}.png`;
    const phoneThumbFileName = `${slug}.webp`;

    const phonePath = path.join(phoneDir, phoneFileName);
    const phoneThumbPath = path.join(phoneThumbsDir, phoneThumbFileName);

    const image = sharp(originalPath);
    const metadata = await image.metadata();

    const origWidth = metadata.width || 2752;
    const origHeight = metadata.height || 1536;

    // 9:19.5 aspect ratio crop
    const targetAspect = 9 / 19.5;
    const cropWidth = Math.round(origHeight * targetAspect);
    const cropHeight = origHeight;
    const cropLeft = Math.max(0, Math.round((origWidth - cropWidth) / 2));

    console.log(`--> Processing [${slug}] (${origWidth}x${origHeight}) -> Crop: ${cropWidth}x${cropHeight} at left:${cropLeft}`);

    // 1. High-resolution Master Phone Wallpaper (1170 × 2532 HD Lockscreen PNG)
    const phoneBuffer = await sharp(originalPath)
      .extract({ left: cropLeft, top: 0, width: cropWidth, height: cropHeight })
      .resize(1170, 2532, {
        fit: "fill",
        kernel: sharp.kernel.lanczos3,
      })
      .png({ quality: 95, compressionLevel: 8 })
      .toBuffer();

    fs.writeFileSync(phonePath, phoneBuffer);
    console.log(`✓ Created HD Phone Wallpaper: public/wallpapers/phone/${phoneFileName} (${(phoneBuffer.length / (1024 * 1024)).toFixed(2)} MB)`);

    // 2. Fast WebP Phone Thumbnail (390 × 844 for preview widgets, ~25KB)
    const phoneThumbBuffer = await sharp(phoneBuffer)
      .resize(390, 844, { fit: "fill" })
      .webp({ quality: 80 })
      .toBuffer();

    fs.writeFileSync(phoneThumbPath, phoneThumbBuffer);
    console.log(`✓ Created WebP Phone Thumb: public/wallpapers/phone/thumbnails/${phoneThumbFileName} (${(phoneThumbBuffer.length / 1024).toFixed(1)} KB)`);

    // 3. Sync to Cloudflare R2
    const r2Key = `wallpapers/phone/${phoneFileName}`;
    const r2ThumbKey = `wallpapers/phone/thumbnails/${phoneThumbFileName}`;

    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: r2Key,
          Body: phoneBuffer,
          ContentType: "image/png",
          CacheControl: "public, max-age=31536000, immutable",
        })
      );
      await s3.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: r2ThumbKey,
          Body: phoneThumbBuffer,
          ContentType: "image/webp",
          CacheControl: "public, max-age=31536000, immutable",
        })
      );
      console.log(`  └─ Synced Phone Master & Thumb to R2: ${r2Key}`);
    } catch (err) {
      console.warn(`  └─ Cloudflare R2 Upload Warning for ${r2Key}:`, err.message || err);
    }
  }

  console.log("\n=============================================================");
  console.log("✓ ALL 16 PHONE CROPS GENERATED AND SYNCED TO R2!");
  console.log("=============================================================\n");
}

generatePhoneCrops().catch(console.error);
