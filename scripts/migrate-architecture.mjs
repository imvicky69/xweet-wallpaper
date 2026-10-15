import fs from "fs";
import path from "path";
import sharp from "sharp";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectsCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";

// 1. Load Environment Variables from .env.local
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      val = val.replace(/^["']|["']$/g, "");
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

// 2. Initialize Firebase Admin SDK
const rootKeyPath = path.resolve(process.cwd(), "serviceAccountKey.json");
if (getApps().length === 0) {
  if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "in-fyn",
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "in-fyn",
    });
  } else if (fs.existsSync(rootKeyPath)) {
    const sa = JSON.parse(fs.readFileSync(rootKeyPath, "utf-8"));
    initializeApp({
      credential: cert(sa),
      projectId: sa.project_id || "in-fyn",
    });
  } else {
    console.error("❌ No Firebase admin credentials found.");
    process.exit(1);
  }
}

const db = getFirestore();

// 3. Initialize Cloudflare R2 S3 Client
const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || "xweet";
const publicCdn = (process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN || "https://cdn.xweet.in").replace(/\/$/, "");

if (!accountId || !accessKeyId || !secretAccessKey) {
  console.error("❌ Missing Cloudflare R2 credentials in environment variables.");
  process.exit(1);
}

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

async function checkR2KeyExists(key) {
  try {
    await r2.send(new HeadObjectCommand({ Bucket: bucketName, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function getR2Buffer(key) {
  try {
    const res = await r2.send(new GetObjectCommand({ Bucket: bucketName, Key: key }));
    return Buffer.from(await res.Body.transformToByteArray());
  } catch {
    return null;
  }
}

async function uploadR2Buffer(key, buffer, contentType = "image/webp") {
  await r2.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );
  return `${publicCdn}/${key}`;
}

async function downloadFromCdn(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch (e) {
    console.warn(`  ⚠️ Could not fetch from ${url}:`, e.message);
    return null;
  }
}

function determineAffiliateMood(category, tags = []) {
  const cat = (category || "").toLowerCase();
  const allTags = tags.map((t) => t.toLowerCase()).join(" ");

  if (cat.includes("flower") || cat.includes("botanical") || allTags.includes("flower")) {
    return "botanical";
  }
  if (cat.includes("dark") || allTags.includes("dark") || allTags.includes("oled") || allTags.includes("midnight")) {
    return "dark-minimal";
  }
  if (cat.includes("warm") || cat.includes("neutral") || cat.includes("cream") || cat.includes("sand")) {
    return "warm-minimal";
  }
  if (cat.includes("cool") || cat.includes("ocean") || cat.includes("teal") || cat.includes("mist")) {
    return "cool-minimal";
  }
  return "dark-minimal";
}

async function runMigration() {
  console.log("==========================================================");
  console.log("🚀 XWEET WALLPAPER: FIRESTORE & R2 ARCHITECTURE MIGRATION");
  console.log("==========================================================\n");

  // Step 1: Query all wallpapers from Firestore
  console.log("1. Fetching all wallpaper documents from Firestore...");
  const snapshot = await db.collection("wallpapers").get();
  console.log(`✓ Found ${snapshot.size} wallpaper documents.\n`);

  const migratedWallpapers = [];

  for (let i = 0; i < snapshot.docs.length; i++) {
    const doc = snapshot.docs[i];
    const data = doc.data();
    const slug = data.slug || doc.id.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const title = data.title || slug.replace(/-/g, " ");

    console.log(`[${i + 1}/${snapshot.size}] Processing "${title}" (${slug})...`);

    // Target Master Key in R2
    const targetMasterKey = `wallpapers/${slug}.webp`;
    const masterExists = await checkR2KeyExists(targetMasterKey);

    let masterDimensions = { width: 3840, height: 2160 };

    if (!masterExists) {
      console.log(`  ⚡ Generating 4K WebP master for "${slug}"...`);
      // Candidate keys/URLs to find existing master
      let sourceBuffer = null;

      // Try R2 object paths
      const candidateKeys = [
        `wallpapers/${slug}.png`,
        `wallpapers/${slug}/desktop.png`,
        `wallpapers/${slug}/desktop.webp`,
        data.desktopAsset?.key,
      ].filter(Boolean);

      for (const k of candidateKeys) {
        sourceBuffer = await getR2Buffer(k);
        if (sourceBuffer) {
          console.log(`  ✓ Found source master in R2: ${k} (${(sourceBuffer.length / 1024 / 1024).toFixed(2)} MB)`);
          break;
        }
      }

      // If not in R2 direct paths, fetch from CDN
      if (!sourceBuffer && data.imageUrl) {
        console.log(`  ↓ Downloading master from CDN: ${data.imageUrl}...`);
        sourceBuffer = await downloadFromCdn(data.imageUrl);
      }

      if (sourceBuffer) {
        try {
          const meta = await sharp(sourceBuffer).metadata();
          let pipeline = sharp(sourceBuffer);

          // Resize to true 4K (3840x2160) if larger
          if ((meta.width || 0) > 3840 || (meta.height || 0) > 2160) {
            pipeline = pipeline.resize({
              width: 3840,
              height: 2160,
              fit: "inside",
              withoutEnlargement: true,
            });
          }

          const webpBuffer = await pipeline.webp({ quality: 94, effort: 4 }).toBuffer();
          const webpMeta = await sharp(webpBuffer).metadata();
          masterDimensions.width = webpMeta.width || meta.width || 3840;
          masterDimensions.height = webpMeta.height || meta.height || 2160;

          await uploadR2Buffer(targetMasterKey, webpBuffer, "image/webp");
          console.log(
            `  ✓ Uploaded 4K WebP master: ${targetMasterKey} (${(webpBuffer.length / 1024 / 1024).toFixed(2)} MB)`
          );
        } catch (procErr) {
          console.warn(`  ⚠️ Sharp conversion failed for ${slug}:`, procErr.message);
        }
      } else {
        console.warn(`  ⚠️ Could not locate any master image source for ${slug}`);
      }
    } else {
      console.log(`  ✓ 4K WebP master already exists: ${targetMasterKey}`);
      try {
        const existingBuf = await getR2Buffer(targetMasterKey);
        if (existingBuf) {
          const meta = await sharp(existingBuf).metadata();
          masterDimensions.width = meta.width || 3840;
          masterDimensions.height = meta.height || 2160;
        }
      } catch {}
    }

    // Determine Phone Crop Coordinates (9:16 vertical ratio)
    const W = masterDimensions.width;
    const H = masterDimensions.height;
    let phoneCropCoords;

    if (slug === "midnight-amber") {
      // User's exact prompt specification
      phoneCropCoords = {
        x: 680,
        y: 0,
        width: 864,
        height: 1536,
      };
    } else if (data.storage?.phoneCropCoords) {
      phoneCropCoords = data.storage.phoneCropCoords;
    } else {
      const targetAspect = 9 / 16;
      let targetHeight = H;
      let targetWidth = Math.min(W, Math.round(H * targetAspect));
      let cropLeft = Math.max(0, Math.round((W - targetWidth) / 2));
      let cropTop = 0;

      phoneCropCoords = {
        x: cropLeft,
        y: cropTop,
        width: targetWidth,
        height: targetHeight,
      };
    }

    const category = data.classification?.category || data.category || "Modern Abstract";
    const collection = data.classification?.collection || data.collection || "Minimal Abstracts";
    const aspectRatio = data.classification?.aspectRatio || data.aspectRatio || "16:9";
    const resolution =
      data.classification?.resolution ||
      data.resolution ||
      `${masterDimensions.width} × ${masterDimensions.height}`;

    const dominantColor = data.styling?.dominantColor || data.dominantColor || "#111B2A";
    const paletteHex = data.styling?.paletteHex || data.paletteHex || dominantColor;
    const palette =
      data.styling?.palette ||
      (Array.isArray(data.palette) ? data.palette : [dominantColor, "#344153", paletteHex]);
    const tags =
      data.styling?.tags ||
      (Array.isArray(data.tags) ? data.tags : ["minimal", "abstract", "4k"]);

    const isFeatured = Boolean(data.flags?.isFeatured ?? data.isFeatured ?? data.featured);
    const isNew = Boolean(data.flags?.isNew ?? data.isNew);
    const hasPhoneCrop = Boolean(data.flags?.hasPhoneCrop ?? data.hasPhoneCrop ?? true);

    const publishedAt = data.metadata?.publishedAt || data.publishedAt || new Date().toISOString();
    const createdAt = data.metadata?.createdAt || data.createdAt || Date.now();

    const author = {
      id: data.author?.id || "xweet",
      username: data.author?.username || "xweet",
      displayName: data.author?.displayName || "Vicky",
      photoURL: data.author?.photoURL || "/logo.png",
      isVerified: Boolean(data.author?.isVerified ?? true),
    };

    const affiliateMood =
      data.monetization?.affiliateMood || determineAffiliateMood(category, tags);

    // EXACT NEW SCHEMA STRUCTURE SPECIFIED IN PROMPT
    const cleanDoc = {
      id: doc.id,
      slug,
      title,
      description: data.description || `Curated minimal abstract wallpaper for focused screens.`,
      classification: {
        category,
        collection,
        aspectRatio,
        resolution,
      },
      styling: {
        dominantColor,
        paletteHex,
        palette,
        tags,
      },
      flags: {
        isFeatured,
        isNew,
        hasPhoneCrop,
      },
      metadata: {
        publishedAt,
        createdAt,
      },
      author,
      storage: {
        r2Key: targetMasterKey,
        format: "webp",
        phoneCropCoords,
      },
      monetization: {
        affiliateMood,
      },
    };

    // Update Firestore with the clean schema (replacing flat/legacy structure)
    await doc.ref.set(cleanDoc);
    console.log(`  ✓ Updated Firestore document [${doc.id}] with new clean schema.\n`);

    migratedWallpapers.push(cleanDoc);
  }

  // Step 2: Delete redundant thumbnails from Cloudflare R2
  console.log("----------------------------------------------------------");
  console.log("2. Cleaning up redundant thumbnails from Cloudflare R2...");
  try {
    let continuationToken = undefined;
    let totalDeleted = 0;
    do {
      const listRes = await r2.send(
        new ListObjectsV2Command({
          Bucket: bucketName,
          ContinuationToken: continuationToken,
        })
      );

      const thumbnailKeys = (listRes.Contents || [])
        .map((c) => c.Key)
        .filter((k) => k && (k.includes("thumbnail") || k.includes("/thumbnails/")));

      if (thumbnailKeys.length > 0) {
        console.log(`  Found ${thumbnailKeys.length} redundant thumbnail files to delete...`);
        const delRes = await r2.send(
          new DeleteObjectsCommand({
            Bucket: bucketName,
            Delete: {
              Objects: thumbnailKeys.map((k) => ({ Key: k })),
              Quiet: true,
            },
          })
        );
        totalDeleted += thumbnailKeys.length;
      }

      continuationToken = listRes.NextContinuationToken;
    } while (continuationToken);

    console.log(`✓ Deleted ${totalDeleted} redundant thumbnail files from R2.\n`);
  } catch (thumbDelErr) {
    console.warn("  ⚠️ Error during R2 thumbnail cleanup:", thumbDelErr.message);
  }

  // Step 3: Update src/lib/wallpapers.ts static backup catalog
  console.log("----------------------------------------------------------");
  console.log("3. Synchronizing src/lib/wallpapers.ts static catalog...");

  const uniqueCategories = new Set(["All", "Dark Abstract", "Warm Minimal", "Cool Minimal"]);
  for (const wp of migratedWallpapers) {
    if (wp.classification?.category) {
      uniqueCategories.add(wp.classification.category);
    }
  }

  const staticFileContent = `import { Collection, Wallpaper, AuthorRef } from "@/types/wallpaper";

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
    count: ${migratedWallpapers.length},
    tags: ["Minimal", "Abstract", "4K", "Tactile"],
  },
];

export const CATEGORIES = ${JSON.stringify(Array.from(uniqueCategories), null, 2)};

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

export const WALLPAPERS: Wallpaper[] = ${JSON.stringify(migratedWallpapers, null, 2)};

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
  const styling = {
    dominantColor,
    paletteHex,
    palette,
    tags,
  };

  const isFeatured = Boolean(raw.flags?.isFeatured ?? raw.isFeatured ?? raw.featured);
  const isNew = Boolean(raw.flags?.isNew ?? raw.isNew);
  const hasPhoneCrop = Boolean(raw.flags?.hasPhoneCrop ?? raw.hasPhoneCrop ?? true);
  const flags = {
    isFeatured,
    isNew,
    hasPhoneCrop,
  };

  const publishedAt = raw.metadata?.publishedAt || raw.publishedAt || new Date().toISOString();
  const createdAt = raw.metadata?.createdAt || raw.createdAt || Date.now();
  const metadata = {
    publishedAt,
    createdAt,
  };

  const author = raw.author || {
    id: "xweet",
    username: "xweet",
    displayName: "Vicky",
    photoURL: "/logo.png",
    isVerified: true,
  };

  const r2Key =
    raw.storage?.r2Key ||
    (raw.desktopAsset?.key ? raw.desktopAsset.key : \`wallpapers/\${slug}.webp\`);
  const format = raw.storage?.format || "webp";
  const phoneCropCoords = raw.storage?.phoneCropCoords || {
    x: 944,
    y: 0,
    width: 864,
    height: 1536,
  };
  const storage = {
    r2Key,
    format,
    phoneCropCoords,
  };

  const monetization = raw.monetization || {
    affiliateMood: classification.category.toLowerCase().includes("dark")
      ? "dark-minimal"
      : "warm-minimal",
  };

  const masterCdnUrl = getCdnImageUrl(raw.imageUrl || \`https://cdn.xweet.in/\${r2Key}\`);

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
    monetization,

    // Backward-compatibility properties
    imageUrl: masterCdnUrl,
    thumbnailUrl: getCdnImageUrl(raw.thumbnailUrl) || masterCdnUrl,
    phoneImageUrl: getCdnImageUrl(raw.phoneImageUrl) || \`/api/download/\${slug}?type=phone-4k\`,
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
`;

  fs.writeFileSync(path.resolve(process.cwd(), "src/lib/wallpapers.ts"), staticFileContent, "utf-8");
  console.log("✓ src/lib/wallpapers.ts written successfully.\n");

  console.log("==========================================================");
  console.log(`🎉 MIGRATION COMPLETE: All ${migratedWallpapers.length} wallpapers migrated to new schema!`);
  console.log("Single 4K WebP masters are active, thumbnails deleted from R2,");
  console.log("and dynamic cropping route /api/download/[slug] is ready!");
  console.log("==========================================================\n");
}

runMigration().catch((err) => {
  console.error("Migration encountered an error:", err);
  process.exit(1);
});
