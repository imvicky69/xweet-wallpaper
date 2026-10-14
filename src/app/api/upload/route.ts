import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase/admin";
import { uploadToR2, publicCdnDomain } from "@/lib/r2";
import { Wallpaper, AuthorRef } from "@/types/wallpaper";
import sharp from "sharp";

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
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (err: any) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or expired token.", details: err.message },
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
    const title = formData.get("title")?.toString() || "Untitled Master";
    const description = formData.get("description")?.toString() || "";
    const category = formData.get("category")?.toString() || "Warm Neutrals";
    const resolution = formData.get("resolution")?.toString() || "3840 × 2160";
    const dominantColor = formData.get("dominantColor")?.toString() || "#D6C7B2";
    const tagsString = formData.get("tags")?.toString() || "";

    const desktopFile = formData.get("desktopImage") as File | null;
    const phoneFile = formData.get("phoneImage") as File | null;

    if (!desktopFile) {
      return NextResponse.json(
        { error: "Validation Error: 'desktopImage' file is required." },
        { status: 400 }
      );
    }

    // 4. Generate clean Slug and Keys
    const slugBase = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const wallpaperId = `wp_${Date.now()}`;
    const slug = `${slugBase}-${wallpaperId.slice(-6)}`;

    // 5. Upload Desktop Image to Cloudflare R2
    const desktopBuffer = Buffer.from(await desktopFile.arrayBuffer());
    const desktopExt = desktopFile.type.split("/")[1] || "webp";
    const desktopKey = `wallpapers/${slug}/desktop.${desktopExt}`;

    const desktopCdnUrl = await uploadToR2({
      key: desktopKey,
      buffer: desktopBuffer,
      contentType: desktopFile.type || "image/webp",
    });

    // 6. Generate and Upload High-Speed WebP Thumbnail (~800px width)
    let thumbnailBuffer: Buffer;
    try {
      thumbnailBuffer = await sharp(desktopBuffer)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 85 })
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

    // 7. Handle Companion Phone Wallpaper (Author uploaded or auto-generated 9:16 crop)
    let phoneBuffer: Buffer;
    let phoneExt: string;
    let phoneContentType: string;

    if (phoneFile) {
      phoneBuffer = Buffer.from(await phoneFile.arrayBuffer());
      phoneExt = phoneFile.type.split("/")[1] || "webp";
      phoneContentType = phoneFile.type || "image/webp";
    } else {
      // Automatically crop 9:16 (1290x2796) vertical phone lockscreen wallpaper from master
      try {
        phoneBuffer = await sharp(desktopBuffer)
          .resize({
            width: 1290,
            height: 2796,
            fit: "cover",
            position: "centre",
          })
          .webp({ quality: 90 })
          .toBuffer();
        phoneExt = "webp";
        phoneContentType = "image/webp";
      } catch (cropErr) {
        console.warn("Auto phone crop failed, falling back to desktop buffer:", cropErr);
        phoneBuffer = desktopBuffer;
        phoneExt = desktopExt;
        phoneContentType = desktopFile.type || "image/webp";
      }
    }

    const phoneKey = `wallpapers/${slug}/phone.${phoneExt}`;
    const phoneCdnUrl = await uploadToR2({
      key: phoneKey,
      buffer: phoneBuffer,
      contentType: phoneContentType,
    });

    // 8. Parse Tags
    const tags = tagsString
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    // 9. Assemble Full Wallpaper Payload
    const wallpaperPayload: Wallpaper = {
      id: wallpaperId,
      slug,
      title,
      description,
      imageUrl: desktopCdnUrl,
      thumbnailUrl: thumbnailCdnUrl,
      desktopAsset: {
        key: desktopKey,
        url: desktopCdnUrl,
        width: 3840,
        height: 2160,
        resolution,
        aspectRatio: "16:9",
        fileSizeBytes: desktopBuffer.byteLength,
        format: desktopExt as any,
      },
      hasPhoneCrop: true,
      phoneImageUrl: phoneCdnUrl,
      phoneAsset: {
        key: phoneKey,
        url: phoneCdnUrl,
        width: 1290,
        height: 2796,
        resolution: "1290 × 2796",
        aspectRatio: "9:16",
        fileSizeBytes: phoneBuffer.byteLength,
        format: phoneExt as any,
      },
      resolution,
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

    // 10. Save Document in Firestore 'wallpapers' Collection
    await adminDb.collection("wallpapers").doc(wallpaperId).set(wallpaperPayload);

    return NextResponse.json({
      success: true,
      message: "Wallpaper uploaded to Cloudflare R2 and indexed in Firestore.",
      wallpaper: wallpaperPayload,
    });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
