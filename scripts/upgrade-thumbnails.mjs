import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import sharp from "sharp";

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
const cdnUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN || "https://cdn.xweet.in";

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

async function upgradeThumbnails() {
  console.log("======================================================");
  console.log("REGENERATING HIGH-DEFINITION (1600px, Q92) WEBP THUMBNAILS");
  console.log(`Bucket: ${bucketName}`);
  console.log(`CDN:    ${cdnUrl}`);
  console.log("======================================================\n");

  const wallpapersDir = path.resolve(process.cwd(), "public/wallpapers");
  const thumbsDir = path.resolve(wallpapersDir, "thumbnails");
  fs.mkdirSync(thumbsDir, { recursive: true });

  const files = fs.readdirSync(wallpapersDir).filter((f) => f.endsWith(".png"));

  for (const file of files) {
    const slug = path.basename(file, ".png");
    const srcPath = path.join(wallpapersDir, file);
    const destPath = path.join(thumbsDir, `${slug}.webp`);

    console.log(`Processing [${slug}]...`);

    // 1. Generate 1600px High-Fidelity WebP via Sharp
    const buffer = await sharp(srcPath)
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 92, effort: 6 })
      .toBuffer();

    fs.writeFileSync(destPath, buffer);
    console.log(`  ✓ Generated 1600px WebP: ${(buffer.length / 1024).toFixed(1)} KB`);

    // 2. Upload to Cloudflare R2
    const key = `wallpapers/thumbnails/${slug}.webp`;
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: "image/webp",
      CacheControl: "public, max-age=31536000, immutable",
    });

    await s3.send(command);
    console.log(`  ✓ Uploaded to R2: ${cdnUrl}/${key}`);
  }

  console.log("\n======================================================");
  console.log("✓ ALL 16 THUMBNAILS UPGRADED TO 1600px RETINA-GRADE WEBP!");
  console.log("======================================================\n");
}

upgradeThumbnails().catch((err) => {
  console.error("❌ Fatal Error:", err);
  process.exit(1);
});
