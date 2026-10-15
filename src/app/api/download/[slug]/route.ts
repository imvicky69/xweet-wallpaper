import { NextRequest, NextResponse } from "next/server";
import { getObjectFromR2, publicCdnDomain } from "@/lib/r2";
import { WALLPAPERS, normalizeWallpaper } from "@/lib/wallpapers";
import { Wallpaper, WallpaperCropCoords } from "@/types/wallpaper";

/**
 * Dynamic Cropping & Wallpaper Variant Streamer API Route
 *
 * Query params:
 * - ?type=desktop-4k (default): Full 4K master edition (3840x2160 or master res)
 * - ?type=desktop-1080p: Scaled to 1920x1080 Full HD
 * - ?type=phone-4k / ?type=phone: Vertical mobile lockscreen extracted using phoneCropCoords
 * - ?type=thumbnail / ?type=thumb: Lightweight resized preview (800px)
 * - ?format=webp (default) | png | jpg
 * - ?inline=true: display in browser instead of attachment download
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    if (!slug) {
      return new NextResponse("Missing wallpaper slug", { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const type = (searchParams.get("type") || "desktop-4k").toLowerCase();
    const requestedFormat = (searchParams.get("format") || "webp").toLowerCase();
    const isInline = searchParams.get("inline") === "true";

    // 1. Fetch Wallpaper Metadata from Firestore or fallback static catalog
    let wallpaper: Wallpaper | null = null;

    try {
      const adminMod = await import("@/lib/firebase/admin");
      const adminDb = adminMod.adminDb;
      if (adminDb) {
        const queryPromise = adminDb
          .collection("wallpapers")
          .where("slug", "==", slug)
          .limit(1)
          .get();
        const timeoutPromise = new Promise<null>((resolve) =>
          setTimeout(() => resolve(null), 1200)
        );
        const snap = await Promise.race([queryPromise, timeoutPromise]);

        if (snap && !snap.empty) {
          const docData = snap.docs[0].data();
          wallpaper = normalizeWallpaper({
            id: snap.docs[0].id,
            ...docData,
          });
        } else {
          // Direct ID lookup fallback
          const directPromise = adminDb.collection("wallpapers").doc(slug).get();
          const directSnap = await Promise.race([directPromise, timeoutPromise]);
          if (directSnap && directSnap.exists) {
            wallpaper = normalizeWallpaper({
              id: directSnap.id,
              ...directSnap.data(),
            });
          }
        }
      }
    } catch (dbErr: any) {
      console.warn("Firestore query note in download route:", dbErr?.message);
    }

    if (!wallpaper) {
      wallpaper =
        WALLPAPERS.find((wp) => wp.slug === slug || wp.id === slug) || null;
    }

    // 2. Resolve Master Asset Key / URL
    const cleanSlug = wallpaper?.slug || slug;
    const r2Key =
      wallpaper?.storage?.r2Key ||
      (wallpaper?.desktopAsset as any)?.key ||
      `wallpapers/${cleanSlug}.webp`;

    // 3. Fetch Master Image Buffer
    let masterBuffer: Buffer | null = null;

    // A. Attempt direct R2 download via S3 client
    try {
      masterBuffer = await getObjectFromR2(r2Key);
      if (!masterBuffer && r2Key.endsWith(".webp")) {
        // Fallback check if only png exists
        masterBuffer = await getObjectFromR2(`wallpapers/${cleanSlug}.png`);
        if (!masterBuffer) {
          masterBuffer = await getObjectFromR2(`wallpapers/${cleanSlug}/desktop.png`);
        }
      }
    } catch (e: any) {
      console.warn("Direct R2 read note, falling back to CDN fetch:", e?.message);
    }

    // B. Fallback: Fetch via public CDN URL
    if (!masterBuffer) {
      const candidates = [
        `${publicCdnDomain.replace(/\/$/, "")}/${r2Key.replace(/^\//, "")}`,
        wallpaper?.imageUrl,
        `https://cdn.xweet.in/wallpapers/${cleanSlug}.webp`,
        `https://cdn.xweet.in/wallpapers/${cleanSlug}.png`,
        `https://cdn.xweet.in/wallpapers/${cleanSlug}/desktop.png`,
      ].filter(Boolean) as string[];

      for (const candidateUrl of candidates) {
        try {
          const res = await fetch(candidateUrl, {
            cache: "force-cache",
            next: { revalidate: 31536000 },
          });
          if (res.ok) {
            const arrBuffer = await res.arrayBuffer();
            masterBuffer = Buffer.from(arrBuffer);
            break;
          }
        } catch {
          // Continue to next candidate
        }
      }
    }

    if (!masterBuffer) {
      return new NextResponse(`Master wallpaper asset not found for '${cleanSlug}'`, {
        status: 404,
      });
    }

    // 4. Conditional ETag check to save bandwidth on cached requests
    const cropKey = wallpaper?.storage?.phoneCropCoords
      ? `${wallpaper.storage.phoneCropCoords.x}_${wallpaper.storage.phoneCropCoords.y}_${wallpaper.storage.phoneCropCoords.width}_${wallpaper.storage.phoneCropCoords.height}`
      : "default";
    const etag = `"${cleanSlug}-${type}-${requestedFormat}-${cropKey}"`;
    const clientEtag = request.headers.get("if-none-match");
    if (clientEtag && clientEtag === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          "ETag": etag,
          "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
        },
      });
    }

    // 5. Dynamic Transformation Pipeline (Safe dynamic import with master buffer fallback)
    let outputBuffer: Buffer = masterBuffer;
    let contentType =
      requestedFormat === "png"
        ? "image/png"
        : requestedFormat === "jpg" || requestedFormat === "jpeg"
        ? "image/jpeg"
        : "image/webp";
    let fileExtension =
      requestedFormat === "png"
        ? "png"
        : requestedFormat === "jpg" || requestedFormat === "jpeg"
        ? "jpg"
        : "webp";

    try {
      const sharpMod = await import("sharp");
      const sharpFn = sharpMod.default || sharpMod;
      const sharpInstance = sharpFn(masterBuffer);
      const metadata = await sharpInstance.metadata();
      const naturalWidth = metadata.width || 3840;
      const naturalHeight = metadata.height || 2160;

      let pipeline = sharpFn(masterBuffer);

      if (
        type === "phone-4k" ||
        type === "phone" ||
        type === "mobile" ||
        type === "lockscreen"
      ) {
        // Dynamic vertical cropping using stored phoneCropCoords or auto 9:16 center crop
        const phoneCropCoords: WallpaperCropCoords | undefined =
          wallpaper?.storage?.phoneCropCoords;

        let cropLeft: number;
        let cropTop: number;
        let cropWidth: number;
        let cropHeight: number;

        if (
          phoneCropCoords &&
          typeof phoneCropCoords.width === "number" &&
          typeof phoneCropCoords.height === "number" &&
          phoneCropCoords.width > 0 &&
          phoneCropCoords.height > 0
        ) {
          cropLeft = Math.max(0, Math.min(naturalWidth - 1, Math.round(phoneCropCoords.x)));
          cropTop = Math.max(0, Math.min(naturalHeight - 1, Math.round(phoneCropCoords.y)));
          cropWidth = Math.min(naturalWidth - cropLeft, Math.round(phoneCropCoords.width));
          cropHeight = Math.min(naturalHeight - cropTop, Math.round(phoneCropCoords.height));
        } else {
          // Compute standard vertical 9:16 lockscreen crop centered horizontally
          const targetAspect = 9 / 16;
          cropHeight = naturalHeight;
          cropWidth = Math.min(naturalWidth, Math.round(naturalHeight * targetAspect));
          cropLeft = Math.max(0, Math.round((naturalWidth - cropWidth) / 2));
          cropTop = 0;
        }

        pipeline = pipeline.extract({
          left: cropLeft,
          top: cropTop,
          width: cropWidth,
          height: cropHeight,
        });

        // Target true mobile Retina dimensions if master crop is sufficiently large
        if (cropWidth > 1290 || cropHeight > 2796) {
          pipeline = pipeline.resize({
            width: 1290,
            height: 2796,
            fit: "cover",
            position: "centre",
          });
        }
      } else if (type === "desktop-1080p" || type === "1080p" || type === "fhd") {
        // Scale down to 1080p Full HD
        pipeline = pipeline.resize({
          width: 1920,
          height: 1080,
          fit: "inside",
          withoutEnlargement: true,
        });
      } else if (type === "thumbnail" || type === "thumb") {
        // Fast edge-cached grid thumbnail
        pipeline = pipeline.resize({
          width: 800,
          withoutEnlargement: true,
        });
      } else {
        // Default: 4K Desktop Master. Ensure within true 4K (3840x2160)
        if (naturalWidth > 3840 || naturalHeight > 2160) {
          pipeline = pipeline.resize({
            width: 3840,
            height: 2160,
            fit: "inside",
            withoutEnlargement: true,
          });
        }
      }

      // Encode into Target Image Format
      if (requestedFormat === "png") {
        contentType = "image/png";
        fileExtension = "png";
        pipeline = pipeline.png({ compressionLevel: 6 });
      } else if (requestedFormat === "jpg" || requestedFormat === "jpeg") {
        contentType = "image/jpeg";
        fileExtension = "jpg";
        pipeline = pipeline.jpeg({ quality: 95, mozjpeg: true });
      } else {
        contentType = "image/webp";
        fileExtension = "webp";
        pipeline = pipeline.webp({
          quality: type === "thumbnail" || type === "thumb" ? 85 : 94,
          effort: 4,
        });
      }

      outputBuffer = await pipeline.toBuffer();
    } catch (sharpError: any) {
      console.warn("Sharp transformation unavailable or failed, serving master buffer fallback:", sharpError?.message);
      outputBuffer = masterBuffer;
      const masterExt = r2Key.endsWith(".png") ? "png" : "webp";
      contentType = masterExt === "png" ? "image/png" : "image/webp";
      fileExtension = masterExt;
    }

    const sanitizedFilename = `${cleanSlug}-${type}.${fileExtension}`.replace(
      /[^a-zA-Z0-9_.-]/g,
      "_"
    );
    const disposition = isInline
      ? "inline"
      : `attachment; filename="${sanitizedFilename}"`;

    return new NextResponse(new Uint8Array(outputBuffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": disposition,
        "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
        "CDN-Cache-Control": "public, max-age=31536000, immutable",
        "Cloudflare-CDN-Cache-Control": "public, max-age=31536000, immutable",
        "ETag": etag,
        "Content-Length": outputBuffer.byteLength.toString(),
      },
    });
  } catch (error: any) {
    console.error("Dynamic crop / download route error:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to generate wallpaper variant", message: error?.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
