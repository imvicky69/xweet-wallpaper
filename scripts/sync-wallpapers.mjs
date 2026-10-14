import fs from "fs";
import path from "path";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import sharp from "sharp";

// 1. Initialize Firebase Admin
const rootKeyPath = path.resolve(process.cwd(), "serviceAccountKey.json");
if (!fs.existsSync(rootKeyPath)) {
  console.error("❌ Error: serviceAccountKey.json not found in root.");
  process.exit(1);
}

const serviceAccount = JSON.parse(fs.readFileSync(rootKeyPath, "utf-8"));
if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
}

const db = getFirestore();

// Helper to download remote file to local disk
async function downloadRemoteFile(url, destPath) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`  ⚠️ Could not download ${url}: HTTP ${res.status}`);
      return false;
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(destPath, buffer);
    return true;
  } catch (err) {
    console.warn(`  ⚠️ Network error downloading ${url}:`, err.message);
    return false;
  }
}

async function syncWallpapers() {
  console.log("=================================================");
  console.log("⚡ XWEET WALLPAPERS: PULL & SYNC LOCAL REPO");
  console.log("=================================================\n");

  const wallpapersDir = path.resolve(process.cwd(), "public/wallpapers");
  const phoneDir = path.resolve(wallpapersDir, "phone");
  const thumbsDir = path.resolve(wallpapersDir, "thumbnails");

  fs.mkdirSync(wallpapersDir, { recursive: true });
  fs.mkdirSync(phoneDir, { recursive: true });
  fs.mkdirSync(thumbsDir, { recursive: true });

  console.log("1. Querying Firestore 'wallpapers' collection...");
  const snapshot = await db.collection("wallpapers").get();
  console.log(`✓ Found ${snapshot.size} wallpapers in database.\n`);

  const wallpapers = [];
  const uniqueCategories = new Set(["All", "Dark Abstract", "Warm Minimal", "Cool Minimal"]);

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const slug = data.slug || doc.id.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const title = data.title || slug.replace(/-/g, " ");
    const category = data.category || "Modern Abstract";
    uniqueCategories.add(category);

    console.log(`Processing [${doc.id}]: ${title} (${slug})`);

    // A. Desktop Master Image
    let localDesktopFile = path.resolve(wallpapersDir, `${slug}.png`);
    let localDesktopRel = `/wallpapers/${slug}.png`;

    if (!fs.existsSync(localDesktopFile)) {
      // Check if webp version exists
      const webpVersion = path.resolve(wallpapersDir, `${slug}.webp`);
      if (fs.existsSync(webpVersion)) {
        localDesktopFile = webpVersion;
        localDesktopRel = `/wallpapers/${slug}.webp`;
      } else if (data.imageUrl && data.imageUrl.startsWith("http")) {
        console.log(`  ↓ Downloading master artwork from ${data.imageUrl}...`);
        const downloaded = await downloadRemoteFile(data.imageUrl, localDesktopFile);
        if (!downloaded) {
          localDesktopRel = data.imageUrl; // Fall back to CDN URL if download failed
        }
      }
    }

    // B. Phone Lockscreen Wallpaper
    let localPhoneFile = path.resolve(phoneDir, `${slug}.png`);
    let localPhoneRel = `/wallpapers/phone/${slug}.png`;

    if (!fs.existsSync(localPhoneFile)) {
      const webpPhone = path.resolve(phoneDir, `${slug}.webp`);
      if (fs.existsSync(webpPhone)) {
        localPhoneFile = webpPhone;
        localPhoneRel = `/wallpapers/phone/${slug}.webp`;
      } else if (data.phoneImageUrl && data.phoneImageUrl.startsWith("http")) {
        console.log(`  ↓ Downloading phone artwork from ${data.phoneImageUrl}...`);
        const downloaded = await downloadRemoteFile(data.phoneImageUrl, localPhoneFile);
        if (!downloaded && fs.existsSync(localDesktopFile)) {
          console.log(`  ✂ Generating 9:16 phone crop from master via Sharp...`);
          await sharp(localDesktopFile)
            .resize({ width: 1290, height: 2796, fit: "cover", position: "centre" })
            .png({ quality: 90 })
            .toFile(localPhoneFile);
        }
      } else if (fs.existsSync(localDesktopFile)) {
        console.log(`  ✂ Generating 9:16 phone crop from local master via Sharp...`);
        await sharp(localDesktopFile)
          .resize({ width: 1290, height: 2796, fit: "cover", position: "centre" })
          .png({ quality: 90 })
          .toFile(localPhoneFile);
      }
    }

    // C. WebP Thumbnail
    let localThumbFile = path.resolve(thumbsDir, `${slug}.webp`);
    let localThumbRel = `/wallpapers/thumbnails/${slug}.webp`;

    if (!fs.existsSync(localThumbFile)) {
      if (data.thumbnailUrl && data.thumbnailUrl.startsWith("http")) {
        console.log(`  ↓ Downloading thumbnail from ${data.thumbnailUrl}...`);
        const downloaded = await downloadRemoteFile(data.thumbnailUrl, localThumbFile);
        if (!downloaded && fs.existsSync(localDesktopFile)) {
          console.log(`  ⚡ Generating 800px WebP thumbnail via Sharp...`);
          await sharp(localDesktopFile)
            .resize({ width: 800, withoutEnlargement: true })
            .webp({ quality: 85 })
            .toFile(localThumbFile);
        }
      } else if (fs.existsSync(localDesktopFile)) {
        console.log(`  ⚡ Generating 800px WebP thumbnail via Sharp...`);
        await sharp(localDesktopFile)
          .resize({ width: 800, withoutEnlargement: true })
          .webp({ quality: 85 })
          .toFile(localThumbFile);
      }
    }

    const CDN = process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN || "https://cdn.xweet.in";
    const desktopUrl = `${CDN}/wallpapers/${slug}.png`;
    const phoneUrl = `${CDN}/wallpapers/phone/${slug}.png`;
    const thumbUrl = `${CDN}/wallpapers/thumbnails/${slug}.webp`;

    // Normalize author to Vicky (@xweet) if curator or use existing
    const author = {
      id: "xweet",
      username: "xweet",
      displayName: "Vicky",
      photoURL: "/logo.png",
      isVerified: true,
      bio: "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens.",
      joinedAt: "2026-01-01",
    };

    wallpapers.push({
      id: doc.id,
      slug,
      title,
      description: data.description || `Curated minimal abstract wallpaper for focused screens.`,
      imageUrl: desktopUrl,
      thumbnailUrl: thumbUrl,
      hasPhoneCrop: true,
      phoneImageUrl: phoneUrl,
      resolution: data.resolution || "2752 × 1536",
      aspectRatio: data.aspectRatio || "16:9",
      orientation: data.orientation || "desktop",
      category,
      collection: data.collection || "Minimal Abstracts",
      dominantColor: data.dominantColor || "#111B2A",
      paletteHex: data.paletteHex || data.dominantColor || "#D99562",
      palette: Array.isArray(data.palette) ? data.palette : ["#111B2A", "#344153", "#D99562"],
      tags: Array.isArray(data.tags) ? data.tags : ["minimal", "abstract", "4k"],
      author,
      views: data.views || 0,
      downloads: data.downloads || 0,
      isFeatured: Boolean(data.isFeatured || data.featured),
      featured: Boolean(data.isFeatured || data.featured),
      isNew: Boolean(data.isNew),
      publishedAt: data.publishedAt || new Date().toISOString(),
      createdAt: data.createdAt || Date.now(),
    });
  }

  // Sort wallpapers: newest first or order by id
  wallpapers.sort((a, b) => {
    if (a.id.startsWith("wp-") && b.id.startsWith("wp-")) {
      const numA = parseInt(a.id.replace("wp-", ""), 10);
      const numB = parseInt(b.id.replace("wp-", ""), 10);
      return numA - numB;
    }
    return (b.createdAt || 0) - (a.createdAt || 0);
  });

  console.log(`\n2. Updating src/lib/wallpapers.ts with ${wallpapers.length} synchronized wallpapers...`);

  const wallpapersTsContent = `import { Collection, Wallpaper, AuthorRef } from "@/types/wallpaper";

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
    coverImageUrl: "https://cdn.xweet.in/wallpapers/midnight-amber.png",
    count: ${wallpapers.length},
    tags: ["Minimal", "Abstract", "4K", "Tactile"],
  },
];

export const CATEGORIES = ${JSON.stringify(Array.from(uniqueCategories), null, 2)};

export const WALLPAPERS: Wallpaper[] = ${JSON.stringify(wallpapers, null, 2)};

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
`;

  fs.writeFileSync(path.resolve(process.cwd(), "src/lib/wallpapers.ts"), wallpapersTsContent, "utf-8");

  console.log("✓ src/lib/wallpapers.ts written successfully.");
  console.log("\n=================================================");
  console.log(`✓ SYNC COMPLETE: ${wallpapers.length} Wallpapers Ready for Static SEO & Fast UX!`);
  console.log("Ready to git commit and push:");
  console.log("  git add .");
  console.log('  git commit -m "sync: updated wallpapers from cloud"');
  console.log("  git push");
  console.log("=================================================\n");
}

syncWallpapers().catch(console.error);
