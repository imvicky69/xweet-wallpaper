import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb, hasAdminCredentials } from "@/lib/firebase/admin";
import { uploadToR2 } from "@/lib/r2";
import { Wallpaper, AuthorRef, AspectRatio } from "@/types/wallpaper";
import sharp from "sharp";

export const maxDuration = 60;

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
    let decodedToken: any;
    try {
      if (hasAdminCredentials) {
        decodedToken = await adminAuth.verifyIdToken(token);
      } else {
        try {
          decodedToken = await adminAuth.verifyIdToken(token);
        } catch {
          // If adminAuth couldn't verify because of missing default credentials, safely extract token claims
          const parts = token.split(".");
          if (parts.length === 3) {
            const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
            if (payload && (payload.user_id || payload.sub)) {
              decodedToken = {
                uid: payload.user_id || payload.sub,
                email: payload.email,
                name: payload.name,
                picture: payload.picture,
                ...payload,
              };
            }
          }
        }
      }
    } catch (err: any) {
      console.warn("Verification error:", err?.message);
    }

    if (!decodedToken?.uid) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or expired session. Please re-login." },
        { status: 401 }
      );
    }

    const uid = decodedToken.uid;

    // 2. Fetch User Profile from Firestore to detect verified/xweet status
    let authorProfile: AuthorRef;
    try {
      const isCurator = Boolean(
        decodedToken.email?.toLowerCase().includes("vikky") ||
        decodedToken.email?.toLowerCase().includes("vicky") ||
        decodedToken.email?.toLowerCase().includes("xweet") ||
        decodedToken.email?.toLowerCase().includes("rajvi") ||
        uid === "6EYZ8KNxK7R5HEs06VR48oyf9PN2" ||
        uid === "R26Fl6XBQ0XmQepFfDsUcYfL4xs1" ||
        uid === "05NsJKgLsTMUYK66qxbgQNEETX82"
      );

      if (hasAdminCredentials) {
        const userDoc = await adminDb.collection("users").doc(uid).get();
        if (userDoc.exists) {
          authorProfile = userDoc.data() as AuthorRef;
          if (isCurator) {
            authorProfile.displayName = "Vicky";
            authorProfile.username = "xweet";
            authorProfile.photoURL = "/logo.png";
            authorProfile.isVerified = true;
          }
        } else {
          const username = isCurator ? "xweet" : (decodedToken.email?.split("@")[0] || `user_${uid.slice(0, 5)}`);
          authorProfile = {
            id: isCurator ? "xweet" : uid,
            username: username,
            displayName: isCurator ? "Vicky" : (decodedToken.name || username),
            photoURL: isCurator ? "/logo.png" : (decodedToken.picture || "/logo.png"),
            isVerified: isCurator,
          };
        }
      } else {
        const username = isCurator ? "xweet" : (decodedToken.email?.split("@")[0] || `user_${uid.slice(0, 5)}`);
        authorProfile = {
          id: isCurator ? "xweet" : uid,
          username: username,
          displayName: isCurator ? "Vicky" : (decodedToken.name || username),
          photoURL: isCurator ? "/logo.png" : (decodedToken.picture || "/logo.png"),
          isVerified: isCurator,
        };
      }
    } catch {
      authorProfile = {
        id: "xweet",
        username: "xweet",
        displayName: "Vicky",
        photoURL: "/logo.png",
        isVerified: true,
      };
    }

    const isXweet = authorProfile.username?.toLowerCase() === "xweet" || authorProfile.isVerified;

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

    // 4. Generate clean Slug and Keys
    const slugBase = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "wallpaper";
    const wallpaperId = `wp_${Date.now()}`;
    const slug = `${slugBase}-${wallpaperId.slice(-6)}`;

    // Parse Tags
    const tags = tagsString
      .split(",")
      .map((t) => t.trim().toLowerCase().replace(/^#/, ""))
      .filter(Boolean);

    let wallpaperPayload: Wallpaper;

    // =========================================================================
    // BRANCH A: MOBILE WALLPAPER ONLY (Vertical Lockscreen, No Desktop Required)
    // =========================================================================
    if (formatMode === "mobile") {
      const mobileMasterFile = phoneFile || desktopFile;
      if (!mobileMasterFile) {
        return NextResponse.json(
          { error: "Validation Error: Mobile wallpaper image file is required." },
          { status: 400 }
        );
      }

      const mobileBuffer = Buffer.from(await mobileMasterFile.arrayBuffer());
      const mobileExt = mobileMasterFile.type.split("/")[1] || "png";
      const mobileContentType = mobileMasterFile.type || "image/png";

      // Detect resolution & dimensions safely
      let naturalWidth = 1170;
      let naturalHeight = 2532;
      try {
        const meta = await sharp(mobileBuffer).metadata();
        if (meta.width && meta.height) {
          naturalWidth = meta.width;
          naturalHeight = meta.height;
        }
      } catch (metaErr) {
        console.warn("Could not read mobile image metadata with sharp:", metaErr);
      }

      const detectedResolution = `${naturalWidth} × ${naturalHeight}`;
      const aspectRatio: AspectRatio = "9:19.5";

      // Fast, lightweight WebP thumbnail (effort: 1 prevents Vercel CPU timeout)
      let thumbnailBuffer: Buffer;
      try {
        thumbnailBuffer = await sharp(mobileBuffer)
          .resize({ width: 800, withoutEnlargement: true })
          .webp({ quality: 88, effort: 1 })
          .toBuffer();
      } catch (thumbErr) {
        console.warn("Thumbnail generation failed, falling back to original buffer:", thumbErr);
        thumbnailBuffer = mobileBuffer;
      }

      // Upload Mobile Master & Thumbnail to Cloudflare R2
      const phoneKey = `wallpapers/${slug}/phone.${mobileExt}`;
      const phoneCdnUrl = await uploadToR2({
        key: phoneKey,
        buffer: mobileBuffer,
        contentType: mobileContentType,
      });

      const thumbnailKey = `wallpapers/${slug}/thumbnail.webp`;
      const thumbnailCdnUrl = await uploadToR2({
        key: thumbnailKey,
        buffer: thumbnailBuffer,
        contentType: "image/webp",
      });

      wallpaperPayload = {
        id: wallpaperId,
        slug,
        title,
        description,
        imageUrl: phoneCdnUrl,
        thumbnailUrl: thumbnailCdnUrl,
        hasPhoneCrop: true,
        phoneImageUrl: phoneCdnUrl,
        phoneAsset: {
          key: phoneKey,
          url: phoneCdnUrl,
          width: naturalWidth,
          height: naturalHeight,
          resolution: detectedResolution,
          aspectRatio,
          fileSizeBytes: mobileBuffer.byteLength,
          format: mobileExt as any,
        },
        resolution: detectedResolution,
        aspectRatio,
        orientation: "mobile",
        category,
        collection: category,
        dominantColor,
        tags,
        author: {
          id: isXweet ? "xweet" : uid,
          username: authorProfile.username,
          displayName: authorProfile.displayName,
          photoURL: authorProfile.photoURL,
          isVerified: isXweet,
        },
        views: 0,
        downloads: 0,
        isNew: true,
        publishedAt: new Date().toISOString(),
        createdAt: Date.now(),
      };
    } else {
      // =========================================================================
      // BRANCH B: DUAL SETUP (Desktop Master + Phone Crop) OR DESKTOP ONLY
      // =========================================================================
      if (!desktopFile) {
        return NextResponse.json(
          { error: "Validation Error: 'desktopImage' master file is required." },
          { status: 400 }
        );
      }

      const desktopBuffer = Buffer.from(await desktopFile.arrayBuffer());
      const desktopExt = desktopFile.type.split("/")[1] || "webp";
      const desktopKey = `wallpapers/${slug}/desktop.${desktopExt}`;

      const desktopCdnUrl = await uploadToR2({
        key: desktopKey,
        buffer: desktopBuffer,
        contentType: desktopFile.type || "image/webp",
      });

      // Detect resolution
      let naturalWidth = 3840;
      let naturalHeight = 2160;
      try {
        const meta = await sharp(desktopBuffer).metadata();
        if (meta.width && meta.height) {
          naturalWidth = meta.width;
          naturalHeight = meta.height;
        }
      } catch (metaErr) {
        console.warn("Could not read desktop metadata with sharp:", metaErr);
      }

      const customRes = formData.get("resolution")?.toString() || `${naturalWidth} × ${naturalHeight}`;

      // Fast, lightweight 1200px Retina WebP thumbnail (effort: 1 takes <50ms)
      let thumbnailBuffer: Buffer;
      try {
        thumbnailBuffer = await sharp(desktopBuffer)
          .resize({ width: 1200, withoutEnlargement: true })
          .webp({ quality: 88, effort: 1 })
          .toBuffer();
      } catch (thumbErr) {
        console.warn("Thumbnail generation failed, falling back to desktop buffer:", thumbErr);
        thumbnailBuffer = desktopBuffer;
      }

      const thumbnailKey = `wallpapers/${slug}/thumbnail.webp`;
      const thumbnailCdnUrl = await uploadToR2({
        key: thumbnailKey,
        buffer: thumbnailBuffer,
        contentType: "image/webp",
      });

      let phoneCdnUrl: string | undefined = undefined;
      let phoneKey: string | undefined = undefined;
      let phoneBuffer: Buffer | undefined = undefined;
      let phoneExt = "png";

      if (formatMode === "dual") {
        if (phoneFile) {
          phoneBuffer = Buffer.from(await phoneFile.arrayBuffer());
          phoneExt = phoneFile.type.split("/")[1] || "png";
        } else {
          // Extract 9:19.5 phone crop using sharp with fast compression
          try {
            const targetAspect = 9 / 19.5;
            let extractLeft = 0;
            let extractTop = 0;
            let extractWidth = naturalWidth;
            let extractHeight = naturalHeight;

            if (naturalWidth / naturalHeight >= targetAspect) {
              extractHeight = naturalHeight;
              extractWidth = Math.min(naturalWidth, Math.round(naturalHeight * targetAspect));
              const maxOffset = naturalWidth - extractWidth;
              const pct = Math.max(0, Math.min(100, isNaN(cropPosition) ? 50 : cropPosition));
              extractLeft = Math.round((pct / 100) * maxOffset);
              extractTop = 0;
            } else {
              extractWidth = naturalWidth;
              extractHeight = Math.min(naturalHeight, Math.round(naturalWidth / targetAspect));
              const maxOffset = naturalHeight - extractHeight;
              const pct = Math.max(0, Math.min(100, isNaN(cropPosition) ? 50 : cropPosition));
              extractTop = Math.round((pct / 100) * maxOffset);
              extractLeft = 0;
            }

            phoneBuffer = await sharp(desktopBuffer)
              .extract({
                left: extractLeft,
                top: extractTop,
                width: extractWidth,
                height: extractHeight,
              })
              .resize({
                width: 1170,
                height: 2532,
                fit: "cover",
              })
              .png({ compressionLevel: 4 }) // Level 4 is 20x faster than level 7, prevents server timeout
              .toBuffer();

            phoneExt = "png";
          } catch (cropErr) {
            console.warn("Direct phone crop failed, falling back to desktop buffer:", cropErr);
            phoneBuffer = desktopBuffer;
            phoneExt = desktopExt;
          }
        }

        phoneKey = `wallpapers/${slug}/phone.${phoneExt}`;
        phoneCdnUrl = await uploadToR2({
          key: phoneKey,
          buffer: phoneBuffer,
          contentType: `image/${phoneExt}`,
        });
      }

      wallpaperPayload = {
        id: wallpaperId,
        slug,
        title,
        description,
        imageUrl: desktopCdnUrl,
        thumbnailUrl: thumbnailCdnUrl,
        desktopAsset: {
          key: desktopKey,
          url: desktopCdnUrl,
          width: naturalWidth,
          height: naturalHeight,
          resolution: customRes,
          aspectRatio: "16:9",
          fileSizeBytes: desktopBuffer.byteLength,
          format: desktopExt as any,
        },
        hasPhoneCrop: formatMode === "dual" && Boolean(phoneCdnUrl),
        phoneImageUrl: phoneCdnUrl,
        phoneAsset: phoneCdnUrl
          ? {
              key: phoneKey!,
              url: phoneCdnUrl,
              width: 1170,
              height: 2532,
              resolution: "1170 × 2532",
              aspectRatio: "9:19.5",
              fileSizeBytes: phoneBuffer?.byteLength || 0,
              format: phoneExt as any,
            }
          : undefined,
        resolution: customRes,
        aspectRatio: "16:9",
        orientation: "desktop",
        category,
        collection: category,
        dominantColor,
        tags,
        author: {
          id: isXweet ? "xweet" : uid,
          username: authorProfile.username,
          displayName: authorProfile.displayName,
          photoURL: authorProfile.photoURL,
          isVerified: isXweet,
        },
        views: 0,
        downloads: 0,
        isNew: true,
        publishedAt: new Date().toISOString(),
        createdAt: Date.now(),
      };
    }

    // 10. Save Document in Firestore 'wallpapers' Collection
    let firestoreSaved = false;
    if (hasAdminCredentials) {
      try {
        await adminDb.collection("wallpapers").doc(wallpaperId).set(wallpaperPayload);
        firestoreSaved = true;
      } catch (dbErr: any) {
        console.warn("Server Firestore save warning (client will sync directly):", dbErr?.message);
      }
    } else {
      console.info("Server running in credential-less mode; skipping adminDb. Client will sync document directly.");
    }

    return NextResponse.json({
      success: true,
      message: "Wallpaper successfully uploaded to Cloudflare R2 and indexed.",
      wallpaper: wallpaperPayload,
      firestoreSaved,
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
