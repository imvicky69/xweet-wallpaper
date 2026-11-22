import fs from "fs";
import path from "path";
import sharp from "sharp";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";

console.log("=================================================================");
console.log("🚀 XWEET WALLPAPERS — DIRECT CDN ASSET & FIRESTORE DEPLOYMENT");
console.log("=================================================================\n");

// 1. Load Environment Configuration
const envLocalPath = path.resolve(process.cwd(), ".env.local");
const env = {};
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      env[key] = val;
    }
  }
}

// 2. Initialize Firebase Admin SDK (xweet-wallpaper)
const rootKeyPath = path.resolve(process.cwd(), "serviceAccountKey.json");
if (!fs.existsSync(rootKeyPath)) {
  console.error("❌ Error: serviceAccountKey.json not found in project root.");
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(rootKeyPath, "utf-8"));
if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id || "xweet-wallpaper",
  });
}
const db = getFirestore();
console.log(`✓ Firebase Admin initialized for project: ${serviceAccount.project_id}`);

// 3. Initialize Cloudflare R2 S3 Client
const accountId = env.CLOUDFLARE_R2_ACCOUNT_ID;
const accessKeyId = env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const bucketName = env.CLOUDFLARE_R2_BUCKET_NAME || "xweet";
const cdnDomain = (env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN || "https://cdn.xweet.in").replace(/\/$/, "");

if (!accountId || !accessKeyId || !secretAccessKey) {
  console.error("❌ Missing Cloudflare R2 credentials in .env.local.");
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
console.log(`✓ Cloudflare R2 S3 Client connected to bucket '${bucketName}' via ${cdnDomain}\n`);

// Helper: Check if R2 key exists
async function keyExistsInR2(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: bucketName, Key: key }));
    return true;
  } catch {
    return false;
  }
}

// Helper: Download buffer from R2
async function getBufferFromR2(key) {
  try {
    const res = await s3.send(new GetObjectCommand({ Bucket: bucketName, Key: key }));
    return Buffer.from(await res.Body.transformToByteArray());
  } catch (e) {
    return null;
  }
}

// Helper: Upload buffer to R2
async function uploadToR2(key, buffer, contentType = "image/webp") {
  await s3.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );
  return `${cdnDomain}/${key}`;
}

// Ensure local directories exist
const localWallpapersDir = path.resolve("public/wallpapers");
const localPhoneDir = path.resolve("public/wallpapers/phone");
const localPhoneThumbDir = path.resolve("public/wallpapers/phone/thumbnails");
const localThumbDir = path.resolve("public/wallpapers/thumbnails");

fs.mkdirSync(localWallpapersDir, { recursive: true });
fs.mkdirSync(localPhoneDir, { recursive: true });
fs.mkdirSync(localPhoneThumbDir, { recursive: true });
fs.mkdirSync(localThumbDir, { recursive: true });

// 4. Load raw wallpaper catalog from src/lib/wallpapers.ts
const wallpapersTsPath = path.resolve("src/lib/wallpapers.ts");
const wallpapersTsContent = fs.readFileSync(wallpapersTsPath, "utf-8");
const rawMatch = wallpapersTsContent.match(/const RAW_WALLPAPERS: WallpaperDoc\[\] = (\[[\s\S]*?\]);\r?\n/);

if (!rawMatch) {
  console.error("❌ Could not extract RAW_WALLPAPERS from src/lib/wallpapers.ts");
  process.exit(1);
}

const rawWallpapers = JSON.parse(rawMatch[1]);
console.log(`Found ${rawWallpapers.length} wallpapers to process and deploy.\n`);

async function main() {
  const updatedWallpapers = [];

  // Seed author profile first
  console.log("--> Setting up verified @xweet creator document in 'users'...");
  await db.collection("users").doc("xweet").set(
    {
      id: "xweet",
      username: "xweet",
      displayName: "Vicky",
      photoURL: "/logo.png",
      isVerified: true,
      bio: "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens.",
      joinedAt: "2026-01-01",
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
  console.log("✓ Creator profile indexed in Firestore.\n");

  for (let i = 0; i < rawWallpapers.length; i++) {
    const wp = rawWallpapers[i];
    const slug = wp.slug;
    const title = wp.title || slug;
    console.log(`[${i + 1}/${rawWallpapers.length}] Processing "${title}" (${slug})...`);

    // Target R2 Keys & Public URLs
    const desktopMasterKey = `wallpapers/${slug}.webp`;
    const desktopThumbKey = `wallpapers/thumbnails/${slug}.webp`;
    const phoneMasterKey = `wallpapers/phone/${slug}.webp`;
    const phoneThumbKey = `wallpapers/phone/thumbnails/${slug}.webp`;

    const desktopMasterUrl = `${cdnDomain}/${desktopMasterKey}`;
    const desktopThumbUrl = `${cdnDomain}/${desktopThumbKey}`;
    const phoneMasterUrl = `${cdnDomain}/${phoneMasterKey}`;
    const phoneThumbUrl = `${cdnDomain}/${phoneThumbKey}`;

    // Step A: Locate Master Image Buffer
    let masterBuffer = null;

    // 1. Try local PNG or WebP in public/wallpapers/
    const localPng = path.resolve(localWallpapersDir, `${slug}.png`);
    const localWebp = path.resolve(localWallpapersDir, `${slug}.webp`);
    if (fs.existsSync(localWebp)) {
      masterBuffer = fs.readFileSync(localWebp);
    } else if (fs.existsSync(localPng)) {
      masterBuffer = fs.readFileSync(localPng);
    }

    // 2. If not local, fetch from R2
    if (!masterBuffer) {
      masterBuffer = await getBufferFromR2(desktopMasterKey);
      if (!masterBuffer && wp.storage?.r2Key) {
        masterBuffer = await getBufferFromR2(wp.storage.r2Key);
      }
      if (!masterBuffer) {
        masterBuffer = await getBufferFromR2(`wallpapers/${slug}.png`);
      }
    }

    // 3. Fallback to public CDN fetch
    if (!masterBuffer) {
      try {
        const res = await fetch(`${cdnDomain}/${desktopMasterKey}`);
        if (res.ok) {
          masterBuffer = Buffer.from(await res.arrayBuffer());
        }
      } catch {}
    }

    if (!masterBuffer) {
      console.warn(`  ⚠️ Could not locate master image buffer for "${slug}", skipping asset generation.`);
      continue;
    }

    // Inspect natural dimensions
    const meta = await sharp(masterBuffer).metadata();
    const naturalWidth = meta.width || 3840;
    const naturalHeight = meta.height || 2160;

    // Step B: Ensure Desktop 4K WebP Master is in R2
    const desktopMasterExists = await keyExistsInR2(desktopMasterKey);
    let webpMasterBuffer = masterBuffer;
    if (!desktopMasterExists || meta.format !== "webp") {
      let pipe = sharp(masterBuffer);
      if (naturalWidth > 3840 || naturalHeight > 2160) {
        pipe = pipe.resize({ width: 3840, height: 2160, fit: "inside", withoutEnlargement: true });
      }
      webpMasterBuffer = await pipe.webp({ quality: 94, effort: 4 }).toBuffer();
      await uploadToR2(desktopMasterKey, webpMasterBuffer, "image/webp");
      console.log(`  ✓ Uploaded Desktop Master: ${desktopMasterKey} (${(webpMasterBuffer.length / 1024).toFixed(0)} KB)`);
    }

    // Save local master webp
    fs.writeFileSync(path.resolve(localWallpapersDir, `${slug}.webp`), webpMasterBuffer);

    // Step C: Generate Desktop Thumbnail (800px width)
    const desktopThumbExists = await keyExistsInR2(desktopThumbKey);
    if (!desktopThumbExists) {
      const thumbBuf = await sharp(webpMasterBuffer)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 85, effort: 4 })
        .toBuffer();
      await uploadToR2(desktopThumbKey, thumbBuf, "image/webp");
      fs.writeFileSync(path.resolve(localThumbDir, `${slug}.webp`), thumbBuf);
      console.log(`  ✓ Generated & Uploaded Desktop Thumbnail: ${desktopThumbKey}`);
    }

    // Step D: Generate Phone Lockscreen Master (1290 × 2796 Retina WebP)
    // Check if dedicated phone file exists locally or in R2
    let phoneBuffer = null;
    const localPhonePng = path.resolve(localPhoneDir, `${slug}.png`);
    const localPhoneWebp = path.resolve(localPhoneDir, `${slug}.webp`);

    if (fs.existsSync(localPhoneWebp)) {
      phoneBuffer = fs.readFileSync(localPhoneWebp);
    } else if (fs.existsSync(localPhonePng)) {
      phoneBuffer = fs.readFileSync(localPhonePng);
    }

    if (!phoneBuffer) {
      // Calculate crop from master using verified phoneCropCoords
      const coords = wp.storage?.phoneCropCoords;
      let cropLeft, cropTop, cropWidth, cropHeight;

      if (
        coords &&
        typeof coords.x === "number" &&
        typeof coords.width === "number" &&
        coords.width > 0 &&
        coords.height > 0
      ) {
        cropLeft = Math.max(0, Math.min(naturalWidth - 1, Math.round(coords.x)));
        cropTop = Math.max(0, Math.min(naturalHeight - 1, Math.round(coords.y)));
        cropWidth = Math.min(naturalWidth - cropLeft, Math.round(coords.width));
        cropHeight = Math.min(naturalHeight - cropTop, Math.round(coords.height));
      } else {
        // Center 9:19.5 crop
        const targetAspect = 9 / 19.5;
        cropHeight = naturalHeight;
        cropWidth = Math.min(naturalWidth, Math.round(naturalHeight * targetAspect));
        cropLeft = Math.max(0, Math.round((naturalWidth - cropWidth) / 2));
        cropTop = 0;
      }

      phoneBuffer = await sharp(masterBuffer)
        .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
        .resize({ width: 1290, height: 2796, fit: "cover", position: "centre" })
        .webp({ quality: 94, effort: 4 })
        .toBuffer();
    } else {
      // Re-encode existing phone buffer to true 1290x2796 WebP
      const phoneMeta = await sharp(phoneBuffer).metadata();
      if (phoneMeta.format !== "webp" || phoneMeta.width !== 1290 || phoneMeta.height !== 2796) {
        phoneBuffer = await sharp(phoneBuffer)
          .resize({ width: 1290, height: 2796, fit: "cover", position: "centre" })
          .webp({ quality: 94, effort: 4 })
          .toBuffer();
      }
    }

    // Upload Phone Lockscreen Master to R2
    await uploadToR2(phoneMasterKey, phoneBuffer, "image/webp");
    fs.writeFileSync(path.resolve(localPhoneDir, `${slug}.webp`), phoneBuffer);
    console.log(`  ✓ Generated & Uploaded Phone Master: ${phoneMasterKey} (1290×2796, ${(phoneBuffer.length / 1024).toFixed(0)} KB)`);

    // Step E: Generate Phone Thumbnail (400 × 868 WebP, ~25KB)
    const phoneThumbBuffer = await sharp(phoneBuffer)
      .resize({ width: 400, height: 868, fit: "fill" })
      .webp({ quality: 80, effort: 4 })
      .toBuffer();

    await uploadToR2(phoneThumbKey, phoneThumbBuffer, "image/webp");
    fs.writeFileSync(path.resolve(localPhoneThumbDir, `${slug}.webp`), phoneThumbBuffer);
    console.log(`  ✓ Generated & Uploaded Phone Thumbnail: ${phoneThumbKey} (400×868, ${(phoneThumbBuffer.length / 1024).toFixed(1)} KB)`);

    // Step F: Build Enriched Document Payload with Direct CDN URLs
    const docId = wp.id || `wp_${Date.now()}`;
    const enrichedDoc = {
      ...wp,
      id: docId,
      slug,
      title,
      description: wp.description || `Curated minimal abstract wallpaper for focused screens.`,

      // Direct, Immutable CDN URLs for Mobile and Web Clients
      urls: {
        phone: phoneMasterUrl,
        phoneThumbnail: phoneThumbUrl,
        desktop: desktopMasterUrl,
        desktopThumbnail: desktopThumbUrl,
        master: desktopMasterUrl,
      },

      // Top-level convenience accessors
      phoneUrl: phoneMasterUrl,
      phoneThumbnailUrl: phoneThumbUrl,
      imageUrl: desktopMasterUrl,
      thumbnailUrl: desktopThumbUrl,
      phoneImageUrl: phoneMasterUrl,

      storage: {
        r2Key: desktopMasterKey,
        phoneR2Key: phoneMasterKey,
        phoneThumbnailR2Key: phoneThumbKey,
        format: "webp",
        phoneCropCoords: wp.storage?.phoneCropCoords || {
          x: Math.round((naturalWidth - Math.min(naturalWidth, Math.round(naturalHeight * (9 / 19.5)))) / 2),
          y: 0,
          width: Math.min(naturalWidth, Math.round(naturalHeight * (9 / 19.5))),
          height: naturalHeight,
        },
      },

      flags: {
        ...(wp.flags || {}),
        hasPhoneCrop: true,
        hasDedicatedPhone: true,
      },

      author: wp.author || {
        id: "xweet",
        username: "xweet",
        displayName: "Vicky",
        photoURL: "/logo.png",
        isVerified: true,
      },
    };

    // Step G: Index in Firestore
    await db.collection("wallpapers").doc(docId).set(enrichedDoc);
    console.log(`  ✓ Indexed in Firestore document [${docId}]\n`);

    updatedWallpapers.push(enrichedDoc);
  }

  // Step 5: Update src/lib/wallpapers.ts static backup catalog
  console.log("=================================================================");
  console.log(`Synchronizing src/lib/wallpapers.ts with all ${updatedWallpapers.length} deployed drops...`);

  // Extract unique categories
  const categoriesSet = new Set(["All", "Dark Abstract", "Warm Minimal", "Cool Minimal"]);
  for (const wp of updatedWallpapers) {
    if (wp.classification?.category) categoriesSet.add(wp.classification.category);
    if (wp.category) categoriesSet.add(wp.category);
  }

  const updatedTsContent = `import { Collection, Wallpaper, WallpaperDoc, AuthorRef } from "@/types/wallpaper";

export const XWEET_AUTHOR: AuthorRef = {
  id: "xweet",
  username: "xweet",
  displayName: "Vicky",
  photoURL: "/logo.png",
  isVerified: true,
  bio: "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens.",
  joinedAt: "2026-01-01",
};

export const COLLECTIONS: Collection[] = [
  {
    id: "minimal-abstracts",
    slug: "minimal-abstracts",
    title: "Minimal Abstracts",
    description: "AI-generated and curated by Xweet. Quiet forms, chromatic diffusions, and organic textures.",
    coverImageUrl: "https://cdn.xweet.in/wallpapers/midnight-amber.webp",
    count: ${updatedWallpapers.length},
    tags: ["Minimal", "Abstract", "4K", "Tactile"],
  },
];

export const CATEGORIES = ${JSON.stringify(Array.from(categoriesSet), null, 2)};

export const MOBILE_CATEGORIES = [
  "Lockscreen",
  "AMOLED Mobile",
  "Dark Abstract",
  "Minimal Mobile",
  "Anime Vertical",
  "Cyberpunk Mobile",
  "Aesthetic Portrait",
  "Nature Vertical",
  "Typography Lockscreen",
  "Warm Minimal",
  "Pastel Gradient",
  "Monochrome Abstract",
  "Warm Dark Abstract"
];

const RAW_WALLPAPERS: any[] = ${JSON.stringify(updatedWallpapers, null, 2)};

/**
 * Ensures wallpaper, phone crop, or thumbnail URLs point to the public Cloudflare R2 CDN.
 * Handles legacy relative paths gracefully.
 */
export function getCdnImageUrl(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("/wallpapers/")) {
    return \`https://cdn.xweet.in\${url}\`;
  }
  return url;
}

/**
 * Calculates responsive CSS object-position for phone preview cards
 * based on saved phoneCropCoords and original master resolution.
 */
export function getPhoneCropStyle(wallpaper?: Wallpaper | null): React.CSSProperties {
  if (!wallpaper) return { objectPosition: "center center" };

  // If a dedicated phone image is provided, it is already framed as a vertical phone asset
  if (wallpaper.phoneImageUrl && wallpaper.phoneImageUrl !== wallpaper.imageUrl) {
    return { objectPosition: "center center" };
  }

  // If the wallpaper itself is portrait/mobile
  if (
    wallpaper.orientation === "mobile" ||
    wallpaper.aspectRatio === "9:16" ||
    wallpaper.aspectRatio === "9:19.5"
  ) {
    return { objectPosition: "center center" };
  }

  const coords = wallpaper.storage?.phoneCropCoords;
  if (!coords || typeof coords.x !== "number" || typeof coords.width !== "number") {
    return { objectPosition: "center center" };
  }

  let naturalWidth = 2752;
  if (wallpaper.resolution) {
    const parts = wallpaper.resolution.split(/[×xX]/);
    const parsedW = parseInt(parts[0]?.trim(), 10);
    if (!isNaN(parsedW) && parsedW > 0) {
      naturalWidth = parsedW;
    }
  }

  const maxOffset = naturalWidth - coords.width;
  if (maxOffset <= 0) return { objectPosition: "center center" };

  const pct = Math.max(0, Math.min(100, (coords.x / maxOffset) * 100));
  return { objectPosition: \`\${pct.toFixed(2)}% center\` };
}

/**
 * Returns the best CDN image URL for mobile lockscreen previews.
 * Prefers the dedicated phoneThumbnailUrl or phoneUrl over master.
 */
export function getPhonePreviewUrl(wallpaper?: Wallpaper | null): string {
  if (!wallpaper) return "";
  return (
    wallpaper.phoneThumbnailUrl ||
    wallpaper.urls?.phoneThumbnail ||
    wallpaper.phoneImageUrl ||
    wallpaper.urls?.phone ||
    getCdnImageUrl(wallpaper.thumbnailUrl || wallpaper.imageUrl)
  );
}

/**
 * Normalizes any raw wallpaper (from Firestore or static fallback)
 * into the new clean schema while retaining convenience accessors.
 */
export function normalizeWallpaper(raw: any): Wallpaper {
  if (!raw) return raw;
  const id = raw.id || raw.slug;
  const slug = raw.slug || raw.id;
  const title = raw.title || slug.replace(/-/g, " ");
  const description = raw.description || "";

  const classification = {
    category: raw.classification?.category || raw.category || "Modern Abstract",
    collection: raw.classification?.collection || raw.collection || "Minimal Abstracts",
    aspectRatio: (raw.classification?.aspectRatio || raw.aspectRatio || "16:9") as any,
    resolution: raw.classification?.resolution || raw.resolution || "3840 × 2160",
  };

  const dominantColor = raw.styling?.dominantColor || raw.dominantColor || "#111B2A";
  const paletteHex = raw.styling?.paletteHex || raw.paletteHex || dominantColor;
  const palette = raw.styling?.palette || (Array.isArray(raw.palette) ? raw.palette : [dominantColor]);
  const tags = raw.styling?.tags || (Array.isArray(raw.tags) ? raw.tags : ["minimal", "abstract"]);
  const styling = { dominantColor, paletteHex, palette, tags };

  const isFeatured = Boolean(raw.flags?.isFeatured ?? raw.isFeatured ?? raw.featured);
  const isNew = Boolean(raw.flags?.isNew ?? raw.isNew);
  const hasPhoneCrop = Boolean(raw.flags?.hasPhoneCrop ?? raw.hasPhoneCrop ?? true);
  const flags = { isFeatured, isNew, hasPhoneCrop, hasDedicatedPhone: true };

  const publishedAt = raw.metadata?.publishedAt || raw.publishedAt || new Date().toISOString();
  const createdAt = raw.metadata?.createdAt || raw.createdAt || Date.now();
  const metadata = { publishedAt, createdAt };

  const author = raw.author || {
    id: "xweet",
    username: "xweet",
    displayName: "Vicky",
    photoURL: "/logo.png",
    isVerified: true,
  };

  const masterCdnUrl = raw.urls?.master || \`https://cdn.xweet.in/wallpapers/\${slug}.webp\`;
  const phoneMasterUrl = raw.urls?.phone || raw.phoneUrl || \`https://cdn.xweet.in/wallpapers/phone/\${slug}.webp\`;
  const phoneThumbUrl = raw.urls?.phoneThumbnail || raw.phoneThumbnailUrl || \`https://cdn.xweet.in/wallpapers/phone/thumbnails/\${slug}.webp\`;
  const desktopThumbUrl = raw.urls?.desktopThumbnail || raw.thumbnailUrl || \`https://cdn.xweet.in/wallpapers/thumbnails/\${slug}.webp\`;

  const urls = {
    phone: phoneMasterUrl,
    phoneThumbnail: phoneThumbUrl,
    desktop: masterCdnUrl,
    desktopThumbnail: desktopThumbUrl,
    master: masterCdnUrl,
  };

  const storage = {
    r2Key: raw.storage?.r2Key || \`wallpapers/\${slug}.webp\`,
    phoneR2Key: \`wallpapers/phone/\${slug}.webp\`,
    phoneThumbnailR2Key: \`wallpapers/phone/thumbnails/\${slug}.webp\`,
    format: "webp",
    phoneCropCoords: raw.storage?.phoneCropCoords,
  };

  return {
    id,
    slug,
    title,
    description,
    classification,
    styling,
    flags,
    metadata,
    author,
    storage,
    urls,
    phoneUrl: phoneMasterUrl,
    phoneThumbnailUrl: phoneThumbUrl,
    imageUrl: masterCdnUrl,
    thumbnailUrl: desktopThumbUrl,
    phoneImageUrl: phoneMasterUrl,
    category: classification.category,
    collection: classification.collection,
    resolution: classification.resolution,
    aspectRatio: classification.aspectRatio,
    orientation:
      raw.orientation ||
      (classification.aspectRatio === "9:16" || classification.aspectRatio === "9:19.5"
        ? "mobile"
        : "desktop"),
    dominantColor,
    paletteHex,
    palette,
    tags,
    isFeatured,
    featured: isFeatured,
    isNew,
    hasPhoneCrop,
    publishedAt,
    createdAt,
    views: raw.views || 0,
    downloads: raw.downloads || 0,
    desktopAsset: raw.desktopAsset,
    phoneAsset: raw.phoneAsset,
  };
}

export const WALLPAPERS: Wallpaper[] = RAW_WALLPAPERS.map(normalizeWallpaper);
`;

  fs.writeFileSync(wallpapersTsPath, updatedTsContent, "utf-8");
  console.log("✓ src/lib/wallpapers.ts updated successfully with direct CDN URLs.\n");

  console.log("=================================================================");
  console.log(`🎉 DEPLOYMENT COMPLETE: All ${updatedWallpapers.length} wallpapers deployed!`);
  console.log("• Cloudflare R2: Phone masters (1290×2796) & Thumbnails (400×868) uploaded.");
  console.log("• Firestore: Direct CDN links indexed in 'xweet-wallpaper'.");
  console.log("• Local Static: src/lib/wallpapers.ts fully synchronized.");
  console.log("• Future Flutter app can now directly read from Firestore & R2!");
  console.log("=================================================================\n");
}

main().catch((err) => {
  console.error("❌ Fatal Deployment Error:", err);
  process.exit(1);
});
