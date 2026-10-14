const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const sharp = require("sharp");

admin.initializeApp();
const db = admin.firestore();

// Cloudflare R2 Client Configuration
const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || "xweet";
const PUBLIC_CDN = (process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN || "https://cdn.xweet.in").replace(/\/$/, "");

/**
 * Helper to upload buffer to Cloudflare R2
 */
async function uploadR2Buffer(key, buffer, contentType) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });
  await r2Client.send(command);
  return `${PUBLIC_CDN}/${key}`;
}

/**
 * Secured Firebase Cloud Function: uploadWallpaper
 * Authenticated authors can upload wallpapers securely.
 */
exports.uploadWallpaper = onCall(
  {
    cors: true,
    maxInstances: 10,
    memory: "512MiB",
    timeoutSeconds: 60,
  },
  async (request) => {
    // 1. Enforce Authentication
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "You must be signed in to upload wallpapers."
      );
    }

    const uid = request.auth.uid;
    const {
      title,
      description = "",
      category = "Warm Neutrals",
      resolution = "3840 × 2160",
      dominantColor = "#D6C7B2",
      tags = [],
      desktopBase64,
      desktopMimeType = "image/webp",
      phoneBase64,
      phoneMimeType = "image/webp",
    } = request.data;

    if (!title || !desktopBase64) {
      throw new HttpsError(
        "invalid-argument",
        "Both 'title' and 'desktopBase64' image are required."
      );
    }

    // 2. Fetch User Profile to detect curator / @xweet status
    const isCurator = Boolean(
      request.auth.token.email?.toLowerCase().includes("vikky") ||
      request.auth.token.email?.toLowerCase().includes("vicky") ||
      request.auth.token.email?.toLowerCase().includes("xweet") ||
      request.auth.token.email?.toLowerCase().includes("rajvi") ||
      uid === "6EYZ8KNxK7R5HEs06VR48oyf9PN2" ||
      uid === "R26Fl6XBQ0XmQepFfDsUcYfL4xs1" ||
      uid === "05NsJKgLsTMUYK66qxbgQNEETX82"
    );

    let authorProfile;
    const userDoc = await db.collection("users").doc(uid).get();
    if (userDoc.exists) {
      authorProfile = userDoc.data();
    } else {
      const username = isCurator ? "xweet" : (request.auth.token.email?.split("@")[0] || `user_${uid.slice(0, 5)}`);
      authorProfile = {
        id: isCurator ? "xweet" : uid,
        username: username,
        displayName: isCurator ? "Vicky" : (request.auth.token.name || username),
        photoURL: isCurator ? "/logo.png" : (request.auth.token.picture || "/logo.png"),
        isVerified: isCurator,
      };
    }

    const author = {
      id: isCurator ? "xweet" : (authorProfile.id || uid),
      username: isCurator ? "xweet" : authorProfile.username,
      displayName: isCurator ? "Vicky" : authorProfile.displayName,
      photoURL: isCurator ? "/logo.png" : (authorProfile.photoURL || "/logo.png"),
      isVerified: isCurator || authorProfile.isVerified,
    };

    // 3. Generate Unique Slug and File Keys
    const slugBase = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const wallpaperId = `wp_${Date.now()}`;
    const slug = slugBase;

    // 4. Upload Desktop Image Buffer to Cloudflare R2
    const desktopBuffer = Buffer.from(desktopBase64, "base64");
    const desktopExt = desktopMimeType.split("/")[1] || "webp";
    const desktopKey = `wallpapers/${slug}/desktop.${desktopExt}`;

    const desktopCdnUrl = await uploadR2Buffer(
      desktopKey,
      desktopBuffer,
      desktopMimeType
    );

    // 5. Automatically Generate and Upload WebP Thumbnail (~800px width)
    let thumbnailBuffer;
    try {
      thumbnailBuffer = await sharp(desktopBuffer)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 85 })
        .toBuffer();
    } catch (thumbErr) {
      console.warn("Thumbnail generation failed, using desktopBuffer:", thumbErr);
      thumbnailBuffer = desktopBuffer;
    }

    const thumbnailKey = `wallpapers/${slug}/thumbnail.webp`;
    const thumbnailCdnUrl = await uploadR2Buffer(
      thumbnailKey,
      thumbnailBuffer,
      "image/webp"
    );

    // 6. Handle Companion Phone Wallpaper (Author uploaded or auto-generated 9:16 crop)
    let phoneBuffer;
    let phoneExt;
    let phoneMime;

    if (phoneBase64) {
      phoneBuffer = Buffer.from(phoneBase64, "base64");
      phoneExt = phoneMimeType.split("/")[1] || "webp";
      phoneMime = phoneMimeType;
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
        phoneMime = "image/webp";
      } catch (cropErr) {
        console.warn("Auto phone crop failed, using desktopBuffer:", cropErr);
        phoneBuffer = desktopBuffer;
        phoneExt = desktopExt;
        phoneMime = desktopMimeType;
      }
    }

    const phoneKey = `wallpapers/${slug}/phone.${phoneExt}`;
    const phoneCdnUrl = await uploadR2Buffer(
      phoneKey,
      phoneBuffer,
      phoneMime
    );

    // 7. Build Wallpaper Payload
    const wallpaperPayload = {
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
        format: desktopExt,
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
        format: phoneExt,
      },
      resolution,
      aspectRatio: "16:9",
      orientation: "desktop",
      category,
      collection: category,
      dominantColor,
      tags: Array.isArray(tags) ? tags : [tags],
      author,
      views: 0,
      downloads: 0,
      isNew: true,
      publishedAt: new Date().toISOString(),
      createdAt: Date.now(),
    };

    // 8. Write to Firestore 'wallpapers' Collection
    await db.collection("wallpapers").doc(wallpaperId).set(wallpaperPayload);

    return {
      success: true,
      message: "Wallpaper uploaded to Cloudflare R2 and indexed in Firestore.",
      wallpaperId,
      slug,
      desktopUrl: desktopCdnUrl,
      phoneUrl: phoneCdnUrl,
      author: wallpaperPayload.author,
    };
  }
);
