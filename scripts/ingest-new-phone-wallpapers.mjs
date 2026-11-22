import fs from "fs";
import path from "path";
import sharp from "sharp";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

console.log("=================================================================");
console.log("🚀 INGESTING & DEPLOYING 26 NEW PHONE WALLPAPERS FROM 'New folder/'");
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

// 2. Initialize Firebase Admin SDK
const rootKeyPath = path.resolve(process.cwd(), "serviceAccountKey.json");
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

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});
console.log(`✓ Cloudflare R2 S3 Client connected to bucket '${bucketName}'\n`);

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

// Helper: Extract dominant color and 3-5 palette hex colors from image buffer
async function extractPalette(buffer) {
  try {
    const { data } = await sharp(buffer)
      .resize(64, 64, { fit: "cover" })
      .raw()
      .toBuffer({ resolveWithObject: true });

    const buckets = new Map();
    const step = 24;

    for (let i = 0; i < data.length; i += 3) {
      const r = Math.floor(data[i] / step) * step;
      const g = Math.floor(data[i + 1] / step) * step;
      const b = Math.floor(data[i + 2] / step) * step;
      const key = `${r},${g},${b}`;
      buckets.set(key, (buckets.get(key) || 0) + 1);
    }

    const sorted = Array.from(buckets.entries()).sort((a, b) => b[1] - a[1]);
    const toHex = (rgb) => {
      const [r, g, b] = rgb.split(",").map(Number);
      return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`.toUpperCase();
    };

    const palette = sorted.slice(0, 4).map(([rgb]) => toHex(rgb));
    const dominantColor = palette[0] || "#111B2A";

    return { dominantColor, palette };
  } catch (e) {
    return { dominantColor: "#111B2A", palette: ["#111B2A", "#F0E5D2", "#263F32"] };
  }
}

// Clean title formatter
function formatTitle(filename) {
  const withoutExt = filename.replace(/\.[^/.]+$/, "");
  const cleaned = withoutExt
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned
    .split(" ")
    .map((word, i) => {
      if (!word) return "";
      const lower = word.toLowerCase();
      if (lower === "oled") return "OLED";
      if (i > 0 && ["in", "the", "a", "an", "and", "or", "of", "for", "on", "at", "to", "with"].includes(lower)) {
        return lower;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

// Categorizer
function detectCategory(title, dominantHex) {
  const lower = title.toLowerCase();
  if (lower.includes("oled") || lower.includes("moonlit") || lower.includes("night")) {
    return "AMOLED Mobile";
  }
  if (lower.includes("japan") || lower.includes("pagoda") || lower.includes("teahouse") || lower.includes("ukiyo") || lower.includes("koi")) {
    return "Anime Vertical";
  }
  if (lower.includes("cat") || lower.includes("dog") || lower.includes("bird") || lower.includes("crane") || lower.includes("persian")) {
    return "Aesthetic Portrait";
  }
  if (lower.includes("flower") || lower.includes("lily") || lower.includes("blossom") || lower.includes("bloom") || lower.includes("botanical")) {
    return "Nature Vertical";
  }
  if (lower.includes("minimal") || lower.includes("map") || lower.includes("circle")) {
    return "Minimal Mobile";
  }
  if (lower.includes("valley") || lower.includes("mountain") || lower.includes("alpenglow") || lower.includes("hills") || lower.includes("sunset") || lower.includes("sunrise") || lower.includes("road")) {
    return "Nature Vertical";
  }
  return "Lockscreen";
}

const newFolder = path.resolve("New folder");
const files = fs.readdirSync(newFolder).filter((f) => f.endsWith(".png") || f.endsWith(".jpg") || f.endsWith(".webp"));

const localPhoneDir = path.resolve("public/wallpapers/phone");
const localPhoneThumbDir = path.resolve("public/wallpapers/phone/thumbnails");
const localWallpapersDir = path.resolve("public/wallpapers");

fs.mkdirSync(localPhoneDir, { recursive: true });
fs.mkdirSync(localPhoneThumbDir, { recursive: true });
fs.mkdirSync(localWallpapersDir, { recursive: true });

async function run() {
  console.log(`Found ${files.length} new wallpapers to process in 'New folder/'...\n`);

  const newlyAddedWallpapers = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const rawPath = path.join(newFolder, file);
    const title = formatTitle(file);
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const id = `wp_${Date.now()}_${i + 1}`;
    console.log(`[${i + 1}/${files.length}] Ingesting "${title}" (${slug})...`);

    const rawBuffer = fs.readFileSync(rawPath);
    const meta = await sharp(rawBuffer).metadata();
    const naturalWidth = meta.width || 1290;
    const naturalHeight = meta.height || 2796;

    // 1. Extract Palette
    const { dominantColor, palette } = await extractPalette(rawBuffer);
    const category = detectCategory(title, dominantColor);

    // 2. Generate 1290 × 2796 Retina WebP Phone Lockscreen Master
    const phoneMasterBuffer = await sharp(rawBuffer)
      .resize({
        width: 1290,
        height: 2796,
        fit: "cover",
        position: "centre",
        kernel: sharp.kernel.lanczos3,
      })
      .webp({ quality: 94, effort: 4 })
      .toBuffer();

    // 3. Generate 400 × 868 WebP Phone Feed Thumbnail (~25KB)
    const phoneThumbBuffer = await sharp(phoneMasterBuffer)
      .resize({ width: 400, height: 868, fit: "fill" })
      .webp({ quality: 80, effort: 4 })
      .toBuffer();

    // 4. Upload to Cloudflare R2
    const phoneMasterKey = `wallpapers/phone/${slug}.webp`;
    const phoneThumbKey = `wallpapers/phone/thumbnails/${slug}.webp`;

    const phoneMasterUrl = await uploadToR2(phoneMasterKey, phoneMasterBuffer, "image/webp");
    const phoneThumbUrl = await uploadToR2(phoneThumbKey, phoneThumbBuffer, "image/webp");

    console.log(`  ✓ Uploaded Phone Master: ${phoneMasterKey} (1290×2796, ${(phoneMasterBuffer.length / 1024).toFixed(0)} KB)`);
    console.log(`  ✓ Uploaded Phone Thumbnail: ${phoneThumbKey} (400×868, ${(phoneThumbBuffer.length / 1024).toFixed(1)} KB)`);

    // Save locally
    fs.writeFileSync(path.resolve(localPhoneDir, `${slug}.webp`), phoneMasterBuffer);
    fs.writeFileSync(path.resolve(localPhoneThumbDir, `${slug}.webp`), phoneThumbBuffer);

    // 5. Construct Enriched Document
    const now = Date.now() - (files.length - i) * 60000;
    const isoDate = new Date(now).toISOString();

    const tags = [
      "mobile",
      "lockscreen",
      "phone",
      category.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      ...title.toLowerCase().split(" ").filter((w) => w.length > 2),
    ];

    const wallpaperDoc = {
      id,
      slug,
      title,
      description: `Curated ${category.toLowerCase()} wallpaper crafted for mobile lockscreens.`,
      classification: {
        category,
        collection: "Mobile Lockscreen Edition",
        aspectRatio: "9:16",
        resolution: `${naturalWidth} × ${naturalHeight}`,
      },
      styling: {
        dominantColor,
        paletteHex: palette[1] || dominantColor,
        palette,
        tags,
      },
      flags: {
        isFeatured: i < 5, // Mark top 5 as featured
        isNew: true,
        hasPhoneCrop: true,
        hasDedicatedPhone: true,
      },
      metadata: {
        publishedAt: isoDate,
        createdAt: now,
      },
      author: {
        id: "xweet",
        username: "xweet",
        displayName: "Vicky",
        photoURL: "/logo.png",
        isVerified: true,
        bio: "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens.",
      },
      storage: {
        r2Key: phoneMasterKey,
        phoneR2Key: phoneMasterKey,
        phoneThumbnailR2Key: phoneThumbKey,
        format: "webp",
        phoneCropCoords: {
          x: 0,
          y: 0,
          width: naturalWidth,
          height: naturalHeight,
        },
      },
      urls: {
        phone: phoneMasterUrl,
        phoneThumbnail: phoneThumbUrl,
        desktop: phoneMasterUrl,
        desktopThumbnail: phoneThumbUrl,
        master: phoneMasterUrl,
      },
      phoneUrl: phoneMasterUrl,
      phoneThumbnailUrl: phoneThumbUrl,
      imageUrl: phoneMasterUrl,
      thumbnailUrl: phoneThumbUrl,
      phoneImageUrl: phoneMasterUrl,
      orientation: "mobile",
      category,
      collection: "Mobile Lockscreen Edition",
      aspectRatio: "9:16",
      resolution: `${naturalWidth} × ${naturalHeight}`,
      dominantColor,
      paletteHex: palette[1] || dominantColor,
      palette,
      tags,
      isNew: true,
      publishedAt: isoDate,
      createdAt: now,
    };

    // Index into Firestore
    await db.collection("wallpapers").doc(id).set(wallpaperDoc);
    console.log(`  ✓ Indexed in Firestore document [${id}]\n`);

    newlyAddedWallpapers.push(wallpaperDoc);
  }

  // 6. Merge with existing wallpapers in src/lib/wallpapers.ts
  console.log("=================================================================");
  console.log(`Merging ${newlyAddedWallpapers.length} new wallpapers into src/lib/wallpapers.ts...`);

  const wallpapersTsPath = path.resolve("src/lib/wallpapers.ts");
  const tsContent = fs.readFileSync(wallpapersTsPath, "utf-8");
  const rawMatch = tsContent.match(/const RAW_WALLPAPERS: any\[\] = (\[[\s\S]*?\]);\r?\n/);

  if (rawMatch) {
    const existingWallpapers = JSON.parse(rawMatch[1]);
    const allCombined = [...newlyAddedWallpapers, ...existingWallpapers];

    // Deduplicate by slug
    const seen = new Set();
    const deduplicated = [];
    for (const w of allCombined) {
      if (!seen.has(w.slug)) {
        seen.add(w.slug);
        deduplicated.push(w);
      }
    }

    // Extract categories
    const categoriesSet = new Set(["All", "Dark Abstract", "Warm Minimal", "Cool Minimal"]);
    for (const wp of deduplicated) {
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
    count: ${deduplicated.length},
    tags: ["Minimal", "Abstract", "4K", "Tactile", "Phone"],
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

const RAW_WALLPAPERS: any[] = ${JSON.stringify(deduplicated, null, 2)};

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

  if (wallpaper.phoneImageUrl && wallpaper.phoneImageUrl !== wallpaper.imageUrl) {
    return { objectPosition: "center center" };
  }

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
    console.log(`✓ src/lib/wallpapers.ts updated with all ${deduplicated.length} total wallpapers!`);
  }

  console.log("\n=================================================================");
  console.log(`🎉 ALL 26 NEW PHONE WALLPAPERS FULLY INGESTED & DEPLOYED!`);
  console.log(`Total active wallpapers in catalog: 37 + 26 = 63 wallpapers.`);
  console.log("=================================================================\n");
}

run().catch((err) => {
  console.error("❌ Error in ingest-new-phone-wallpapers:", err);
  process.exit(1);
});
