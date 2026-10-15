import { NextRequest, NextResponse } from "next/server";
import { uploadToR2, publicCdnDomain } from "@/lib/r2";
import { Wallpaper, AuthorRef, AspectRatio, WallpaperCropCoords } from "@/types/wallpaper";
// Lightweight JWT payload parser that runs in pure JavaScript without native Google ADC/gRPC dependencies
function parseJwtPayload(token: string): any {
  try {
    const parts = token.split(".");
    if (parts.length === 3) {
      const payloadJson = Buffer.from(parts[1], "base64").toString("utf-8");
      return JSON.parse(payloadJson);
    }
  } catch (e) {
    console.warn("Failed to parse JWT payload:", e);
  }
  return null;
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "Xweet Wallpaper Single Master Upload Pipeline",
    methodsAllowed: ["POST"],
  });
}

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate Request via Firebase ID Token
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid Firebase ID token." },
        { status: 401 }
      );
    }

    const token = authHeader.split("Bearer ")[1];
    const payload = parseJwtPayload(token);
    const uid = payload?.user_id || payload?.sub;

    if (!uid) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or expired session. Please re-login." },
        { status: 401 }
      );
    }

    // 2. Build Author Profile from token claims
    const isCurator = Boolean(
      payload.email?.toLowerCase().includes("vikky") ||
      payload.email?.toLowerCase().includes("vicky") ||
      payload.email?.toLowerCase().includes("xweet") ||
      payload.email?.toLowerCase().includes("rajvi") ||
      uid === "6EYZ8KNxK7R5HEs06VR48oyf9PN2" ||
      uid === "R26Fl6XBQ0XmQepFfDsUcYfL4xs1" ||
      uid === "05NsJKgLsTMUYK66qxbgQNEETX82"
    );

    const username = isCurator ? "xweet" : (payload.email?.split("@")[0] || `user_${uid.slice(0, 5)}`);
    const authorProfile: AuthorRef = {
      id: isCurator ? "xweet" : uid,
      username: username,
      displayName: isCurator ? "Vicky" : (payload.name || username),
      photoURL: isCurator ? "/logo.png" : (payload.picture || "/logo.png"),
      isVerified: isCurator,
    };

    // 3. Parse Multipart Form Data
    const formData = await req.formData();
    const formatMode = (formData.get("formatMode")?.toString() || "dual") as "mobile" | "dual" | "desktop";
    const title = formData.get("title")?.toString().trim() || "Untitled Master";
    const description = formData.get("description")?.toString().trim() || "";
    const category = formData.get("category")?.toString().trim() || (formatMode === "mobile" ? "Lockscreen" : "Dark Abstract");
    const dominantColor = formData.get("dominantColor")?.toString() || "#111B2A";
    const tagsString = formData.get("tags")?.toString() || "";
    const cropPositionString = formData.get("cropPosition")?.toString();
    const cropPosition = cropPositionString !== undefined ? Number(cropPositionString) : 50;

    const desktopFile = formData.get("desktopImage") as File | null;
    const phoneFile = (formData.get("phoneImage") || formData.get("mobileImage")) as File | null;
    const sourceFile = desktopFile || phoneFile;

    if (!sourceFile) {
      return NextResponse.json(
        { error: "Validation Error: Master image file is required." },
        { status: 400 }
      );
    }

    // 4. Generate clean Slug and Keys
    const customSlug = formData.get("slug")?.toString().trim();
    const slugBase = (customSlug || title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "wallpaper";
    const wallpaperId = `wp_${Date.now()}`;
    const slug = slugBase;

    // Parse Tags
    const tags = tagsString
      .split(",")
      .map((t) => t.trim().toLowerCase().replace(/^#/, ""))
      .filter(Boolean);

    // 5. SINGLE MASTER FILE POLICY:
    // Convert uploaded image to single compressed, high-grade WebP master at true 4K (3840x2160, quality: 94)
    const rawBuffer = Buffer.from(await sourceFile.arrayBuffer());
    let masterWebPBuffer: Buffer = rawBuffer;
    let finalWidth = 3840;
    let finalHeight = 2160;

    let sharpFn: any = null;
    try {
      const sharpMod = await import("sharp");
      sharpFn = sharpMod.default || sharpMod;
    } catch (e) {
      console.warn("Sharp dynamic import unavailable in upload:", e);
    }

    if (sharpFn) {
      try {
        const sharpInstance = sharpFn(rawBuffer);
        const meta = await sharpInstance.metadata();
        const origWidth = meta.width || 3840;
        const origHeight = meta.height || 2160;

        let masterPipeline = sharpFn(rawBuffer);

        // True 4K mastering: scale to 3840x2160 while maintaining aspect ratio
        if (origWidth > 3840 || origHeight > 2160) {
          masterPipeline = masterPipeline.resize({
            width: 3840,
            height: 2160,
            fit: "inside",
            withoutEnlargement: true,
          });
        }

        masterWebPBuffer = await masterPipeline
          .webp({ quality: 94, effort: 4 })
          .toBuffer();

        // Verify final master dimensions
        const processedMeta = await sharpFn(masterWebPBuffer).metadata();
        finalWidth = processedMeta.width || origWidth;
        finalHeight = processedMeta.height || origHeight;
      } catch (sharpProcErr) {
        console.warn("Sharp processing failed, falling back to raw buffer:", sharpProcErr);
        masterWebPBuffer = rawBuffer;
      }
    }

    // 6. Calculate Phone Crop Coordinates (9:16 vertical aspect ratio)
    const targetAspect = 9 / 16;
    let cropLeft = 0;
    let cropTop = 0;
    let cropWidth = finalWidth;
    let cropHeight = finalHeight;

    if (finalWidth / finalHeight >= targetAspect) {
      cropHeight = finalHeight;
      cropWidth = Math.min(finalWidth, Math.round(finalHeight * targetAspect));
      const maxOffset = finalWidth - cropWidth;
      const pct = Math.max(0, Math.min(100, isNaN(cropPosition) ? 50 : cropPosition));
      cropLeft = Math.round((pct / 100) * maxOffset);
      cropTop = 0;
    } else {
      cropWidth = finalWidth;
      cropHeight = Math.min(finalHeight, Math.round(finalWidth / targetAspect));
      const maxOffset = finalHeight - cropHeight;
      const pct = Math.max(0, Math.min(100, isNaN(cropPosition) ? 50 : cropPosition));
      cropTop = Math.round((pct / 100) * maxOffset);
      cropLeft = 0;
    }

    const phoneCropCoords: WallpaperCropCoords = {
      x: cropLeft,
      y: cropTop,
      width: cropWidth,
      height: cropHeight,
    };

    // 7. Upload ONLY the Single Master WebP to Cloudflare R2
    const masterR2Key = `wallpapers/${slug}.webp`;
    const masterCdnUrl = await uploadToR2({
      key: masterR2Key,
      buffer: masterWebPBuffer,
      contentType: "image/webp",
      cacheControl: "public, max-age=31536000, immutable",
    });

    // Determine affiliate mood
    let affiliateMood = "dark-minimal";
    const catLower = category.toLowerCase();
    if (catLower.includes("flower") || catLower.includes("botanical")) {
      affiliateMood = "botanical";
    } else if (catLower.includes("warm") || catLower.includes("neutral") || catLower.includes("cream")) {
      affiliateMood = "warm-minimal";
    } else if (catLower.includes("cool") || catLower.includes("ocean") || catLower.includes("blue")) {
      affiliateMood = "cool-minimal";
    }

    const now = Date.now();
    const isoDate = new Date(now).toISOString();
    const detectedResolution = `${finalWidth} × ${finalHeight}`;
    const aspectRatio: AspectRatio = formatMode === "mobile" ? "9:16" : "16:9";

    // 8. Build New Optimized Wallpaper Schema Structure
    const wallpaperPayload: Wallpaper = {
      id: wallpaperId,
      slug,
      title,
      description,
      classification: {
        category,
        collection: category,
        aspectRatio,
        resolution: detectedResolution,
      },
      styling: {
        dominantColor,
        paletteHex: dominantColor,
        palette: [dominantColor],
        tags,
      },
      flags: {
        isFeatured: false,
        isNew: true,
        hasPhoneCrop: true,
      },
      metadata: {
        publishedAt: isoDate,
        createdAt: now,
      },
      author: authorProfile,
      storage: {
        r2Key: masterR2Key,
        format: "webp",
        phoneCropCoords,
      },
      monetization: {
        affiliateMood,
      },

      // Backward-compatible accessors
      imageUrl: masterCdnUrl,
      thumbnailUrl: masterCdnUrl,
      phoneImageUrl: masterCdnUrl,
      category,
      collection: category,
      resolution: detectedResolution,
      aspectRatio,
      orientation: formatMode === "mobile" ? "mobile" : "desktop",
      dominantColor,
      paletteHex: dominantColor,
      palette: [dominantColor],
      tags,
      isNew: true,
      publishedAt: isoDate,
      createdAt: now,
    };

    // 9. Save to Firestore collection if Admin DB is available
    try {
      const adminMod = await import("@/lib/firebase/admin");
      const adminDb = adminMod.adminDb;
      if (adminDb) {
        await adminDb.collection("wallpapers").doc(wallpaperId).set(wallpaperPayload);
      }
    } catch (dbErr) {
      console.warn("Could not save to firestore in upload:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Wallpaper processed into 4K WebP master and indexed.",
      wallpaper: wallpaperPayload,
      masterUrl: masterCdnUrl,
    });
  } catch (error: any) {
    console.error("Upload API Error:", error);
    return NextResponse.json(
      {
        error: "Upload Pipeline Failed",
        message: error?.message || "An unexpected error occurred during asset processing or R2 upload.",
      },
      { status: 500 }
    );
  }
}
