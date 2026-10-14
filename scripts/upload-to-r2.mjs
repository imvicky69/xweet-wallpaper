import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";

// Load .env.local if not already loaded
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
const cdnUrl = process.env.NEXT_PUBLIC_CDN_URL || "https://cdn.xweet.com";

if (!accountId || !accessKeyId || !secretAccessKey) {
  console.error("Missing Cloudflare R2 credentials in environment.");
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

async function uploadAll() {
  const wallpapersDir = path.resolve(process.cwd(), "public", "wallpapers");
  const files = fs.readdirSync(wallpapersDir).filter((f) => f.endsWith(".png"));

  console.log(`\n======================================================`);
  console.log(`UPLOADING ${files.length} WALLPAPERS TO CLOUDFLARE R2 (${bucketName})`);
  console.log(`Endpoint: https://${accountId}.r2.cloudflarestorage.com`);
  console.log(`CDN Target: ${cdnUrl}/wallpapers/...`);
  console.log(`======================================================\n`);

  for (const file of files) {
    const filePath = path.join(wallpapersDir, file);
    const fileBuffer = fs.readFileSync(filePath);
    const key = `wallpapers/${file}`;

    console.log(`--> Uploading [${file}] (${(fileBuffer.length / (1024 * 1024)).toFixed(2)} MB)...`);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: "image/png",
      CacheControl: "public, max-age=31536000, immutable",
    });

    try {
      await s3.send(command);
      console.log(`✓ Uploaded: ${cdnUrl}/${key}`);
    } catch (err) {
      console.error(`✗ Error uploading ${file}:`, err.message || err);
    }
  }

  console.log(`\n======================================================`);
  console.log(`✓ ALL WALLPAPERS SYNCHRONIZED TO CLOUDFLARE R2!`);
  console.log(`======================================================\n`);
}

uploadAll().catch(console.error);
