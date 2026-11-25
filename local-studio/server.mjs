import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const PORT = Number(process.env.STUDIO_PORT || 4321);

// 1. Load .env.local
function loadEnvLocal() {
  const envPath = path.join(projectRoot, ".env.local");
  const env = {};
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
        env[key] = val;
      }
    }
  }
  return env;
}

const env = loadEnvLocal();

// 2. Initialize Firebase Admin using serviceAccountKey.json
const serviceKeyPath = path.join(projectRoot, "serviceAccountKey.json");
if (!fs.existsSync(serviceKeyPath)) {
  console.error("ERROR: serviceAccountKey.json not found at", serviceKeyPath);
  process.exit(1);
}
const serviceAccount = JSON.parse(fs.readFileSync(serviceKeyPath, "utf-8"));

if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id || "xweet-wallpaper",
  });
}
const db = getFirestore();

// 3. Initialize Cloudflare R2 S3 Client
const accountId = env.CLOUDFLARE_R2_ACCOUNT_ID;
const accessKeyId = env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const bucketName = env.CLOUDFLARE_R2_BUCKET_NAME || "xweet";
const cdnDomain = (env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN || env.NEXT_PUBLIC_CDN_URL || "https://cdn.xweet.in").replace(/\/$/, "");

if (!accountId || !accessKeyId || !secretAccessKey) {
  console.error("ERROR: Missing Cloudflare R2 credentials in .env.local");
  process.exit(1);
}

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

const XWEET_AUTHOR = {
  id: "xweet",
  username: "xweet",
  displayName: "Vicky",
  photoURL: "/logo.png",
  isVerified: true,
  bio: "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens.",
};

const DESKTOP_CATEGORIES = [
  "Dark Abstract",
  "Warm Minimal",
  "Cool Minimal",
  "Pastel Abstract",
  "Earthy Abstract",
  "Warm Dark Abstract",
  "Warm Neutral",
  "Pastel Gradient",
  "Cool Abstract",
  "Soft Minimal",
  "Monochrome Abstract",
  "Earthy Minimal",
  "Modern Abstract",
  "Warm Dark Minimal",
  "flower",
];

const MOBILE_CATEGORIES = [
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
  "Warm Dark Abstract",
];

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

async function listAllR2Objects() {
  let token = undefined;
  const objects = [];
  do {
    const res = await s3.send(
      new ListObjectsV2Command({
        Bucket: bucketName,
        ContinuationToken: token,
      })
    );
    for (const item of res.Contents || []) {
      objects.push({
        key: item.Key,
        size: item.Size || 0,
        lastModified: item.LastModified ? item.LastModified.toISOString() : null,
      });
    }
    token = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (token);
  return objects;
}

function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(body);
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString("utf-8") || "{}");
}

function sanitizeSlug(input) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || `wallpaper-${Date.now()}`;
}

function clampCropCoords(coords, width, height) {
  const left = Math.max(0, Math.min(width - 1, Math.round(Number(coords.x) || 0)));
  const top = Math.max(0, Math.min(height - 1, Math.round(Number(coords.y) || 0)));
  const cropWidth = Math.max(1, Math.min(width - left, Math.round(Number(coords.width) || width)));
  const cropHeight = Math.max(1, Math.min(height - top, Math.round(Number(coords.height) || height)));
  return { x: left, y: top, width: cropWidth, height: cropHeight };
}

const server = http.createServer(async (req, res) => {
  const reqUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  const pathname = reqUrl.pathname;

  try {
    // Serve index.html
    if (req.method === "GET" && (pathname === "/" || pathname === "/index.html")) {
      const htmlPath = path.join(__dirname, "index.html");
      const html = fs.readFileSync(htmlPath, "utf-8");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" });
      res.end(html);
      return;
    }

    // Status & Config endpoint
    if (req.method === "GET" && pathname === "/api/status") {
      return sendJson(res, 200, {
        ok: true,
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        bucketName,
        cdnDomain,
        desktopCategories: DESKTOP_CATEGORIES,
        mobileCategories: MOBILE_CATEGORIES,
      });
    }

    // Live Firestore + R2 listings
    if (req.method === "GET" && pathname === "/api/listings") {
      const [snap, r2Objects] = await Promise.all([
        db.collection("wallpapers").get(),
        listAllR2Objects(),
      ]);

      const r2Map = new Map(r2Objects.map((o) => [o.key, o]));

      const wallpapers = snap.docs
        .map((doc) => {
          const data = doc.data();
          const slug = data.slug || doc.id;
          const ar = data.classification?.aspectRatio || data.aspectRatio || "16:9";
          const isPortrait = ar === "9:16" || ar === "9:19.5";
          const hasPhone = Boolean(data.urls?.phone);
          const hasDesktop = !isPortrait && Boolean(data.urls?.desktop);

          const expectedKeys = {
            desktop: hasDesktop ? `wallpapers/${slug}.webp` : null,
            desktopThumbnail: hasDesktop ? `wallpapers/thumbnails/${slug}.webp` : null,
            phone: hasPhone ? `wallpapers/phone/${slug}.webp` : null,
            phoneThumbnail: hasPhone ? `wallpapers/phone/thumbnails/${slug}.webp` : null,
          };

          const r2Audit = {
            desktop: expectedKeys.desktop ? r2Map.has(expectedKeys.desktop) : null,
            desktopThumbnail: expectedKeys.desktopThumbnail ? r2Map.has(expectedKeys.desktopThumbnail) : null,
            phone: expectedKeys.phone ? r2Map.has(expectedKeys.phone) : null,
            phoneThumbnail: expectedKeys.phoneThumbnail ? r2Map.has(expectedKeys.phoneThumbnail) : null,
          };

          return {
            id: doc.id,
            ...data,
            _mode: isPortrait ? "mobile" : hasPhone ? "dual" : "desktop",
            _r2Audit: r2Audit,
          };
        })
        .sort((a, b) => (b.metadata?.createdAt || 0) - (a.metadata?.createdAt || 0));

      return sendJson(res, 200, {
        ok: true,
        firestoreCount: wallpapers.length,
        r2Count: r2Objects.length,
        wallpapers,
        r2Objects,
      });
    }

    // Publish Wallpaper (desktop | mobile | dual)
    if (req.method === "POST" && pathname === "/api/publish") {
      const request = new Request(`http://localhost:${PORT}${pathname}`, {
        method: "POST",
        headers: req.headers,
        body: req,
        duplex: "half",
      });
      const formData = await request.formData();

      const mode = String(formData.get("mode") || "dual"); // "desktop" | "mobile" | "dual"
      if (!["desktop", "mobile", "dual"].includes(mode)) {
        return sendJson(res, 400, { error: "Invalid mode. Use desktop, mobile, or dual." });
      }

      const title = String(formData.get("title") || "").trim();
      if (!title) {
        return sendJson(res, 400, { error: "Title is required." });
      }

      const slug = sanitizeSlug(formData.get("slug") || title);
      const overwrite = String(formData.get("overwrite") || "false") === "true";

      // Check existing slug in Firestore
      const existingQuery = await db.collection("wallpapers").where("slug", "==", slug).limit(1).get();
      let existingDocId = null;
      if (!existingQuery.empty) {
        if (!overwrite) {
          return sendJson(res, 409, {
            error: `Slug "${slug}" already exists in Firestore (${existingQuery.docs[0].id}). Enable "Overwrite existing slug" or change the slug.`,
          });
        }
        existingDocId = existingQuery.docs[0].id;
      }

      const category = String(formData.get("category") || (mode === "mobile" ? "Lockscreen" : "Dark Abstract")).trim();
      const collectionName = String(
        formData.get("collection") || (mode === "mobile" ? "Mobile Lockscreen Edition" : "Minimal Abstracts")
      ).trim();
      const description = String(formData.get("description") || "").trim();
      const dominantColor = String(formData.get("dominantColor") || "#111B2A").toUpperCase();

      const paletteRaw = String(formData.get("palette") || "");
      const palette = paletteRaw
        .split(",")
        .map((c) => c.trim().toUpperCase())
        .filter((c) => /^#[0-9A-F]{6}$/i.test(c));
      if (palette.length === 0) palette.push(dominantColor);

      const paletteHex = palette[1] || palette[0] || dominantColor;
      const tags = String(formData.get("tags") || "")
        .split(",")
        .map((t) => t.trim().toLowerCase().replace(/^#/, ""))
        .filter(Boolean);

      const isFeatured = String(formData.get("isFeatured") || "false") === "true";
      const isNew = String(formData.get("isNew") || "true") === "true";
      const aspectRatioInput = String(formData.get("aspectRatio") || (mode === "mobile" ? "9:16" : "16:9"));
      const phoneCropAspect = String(formData.get("phoneCropAspect") || "9:19.5");

      let rawCropCoords = null;
      const cropCoordsJson = formData.get("phoneCropCoords");
      if (cropCoordsJson) {
        try {
          rawCropCoords = JSON.parse(String(cropCoordsJson));
        } catch {}
      }

      const desktopFile = formData.get("desktopImage");
      const phoneFile = formData.get("phoneImage");

      if (mode === "desktop" && !(desktopFile instanceof File)) {
        return sendJson(res, 400, { error: "Desktop image file is required for Desktop mode." });
      }
      if (mode === "mobile" && !(phoneFile instanceof File)) {
        return sendJson(res, 400, { error: "Phone image file is required for Phone mode." });
      }
      if (mode === "dual" && !(desktopFile instanceof File)) {
        return sendJson(res, 400, { error: "Desktop master image file is required for Both (Dual) mode." });
      }

      const uploadedAssets = [];
      const docId = existingDocId || `wp_${Date.now()}`;
      const now = Date.now();
      const publishedAt = new Date(now).toISOString();

      let finalDoc = null;

      if (mode === "desktop") {
        // Desktop-only: master (max 3840x2160) + 800px thumb
        const rawBuf = Buffer.from(await desktopFile.arrayBuffer());
        const origMeta = await sharp(rawBuf).metadata();
        const origW = origMeta.width || 3840;
        const origH = origMeta.height || 2160;

        let masterPipe = sharp(rawBuf);
        if (origW > 3840 || origH > 2160) {
          masterPipe = masterPipe.resize({ width: 3840, height: 2160, fit: "inside", withoutEnlargement: true });
        }
        const desktopMasterBuf = await masterPipe.webp({ quality: 94, effort: 4 }).toBuffer();
        const finalMeta = await sharp(desktopMasterBuf).metadata();
        const finalW = finalMeta.width || origW;
        const finalH = finalMeta.height || origH;

        const desktopThumbBuf = await sharp(desktopMasterBuf)
          .resize({ width: 800, withoutEnlargement: true })
          .webp({ quality: 85, effort: 4 })
          .toBuffer();

        const desktopKey = `wallpapers/${slug}.webp`;
        const desktopThumbKey = `wallpapers/thumbnails/${slug}.webp`;

        const [desktopUrl, desktopThumbUrl] = await Promise.all([
          uploadToR2(desktopKey, desktopMasterBuf, "image/webp"),
          uploadToR2(desktopThumbKey, desktopThumbBuf, "image/webp"),
        ]);

        uploadedAssets.push(
          { label: "Desktop Master", key: desktopKey, url: desktopUrl, bytes: desktopMasterBuf.length, dims: `${finalW}×${finalH}` },
          { label: "Desktop Thumbnail", key: desktopThumbKey, url: desktopThumbUrl, bytes: desktopThumbBuf.length, dims: "800px wide" }
        );

        finalDoc = {
          id: docId,
          slug,
          title,
          description: description || `Curated ${category.toLowerCase()} wallpaper crafted for wide desktop displays.`,
          classification: {
            category,
            collection: collectionName,
            aspectRatio: aspectRatioInput || "16:9",
            resolution: `${finalW} × ${finalH}`,
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
            hasPhoneCrop: false,
            hasDedicatedPhone: false,
          },
          author: XWEET_AUTHOR,
          storage: {
            r2Key: desktopKey,
            format: "webp",
          },
          urls: {
            phone: "",
            phoneThumbnail: "",
            desktop: desktopUrl,
            desktopThumbnail: desktopThumbUrl,
          },
          metadata: {
            publishedAt,
            createdAt: now,
          },
        };
      } else if (mode === "mobile") {
        // Phone-only: 1290x2796 WebP + 400x868 thumb
        const rawBuf = Buffer.from(await phoneFile.arrayBuffer());
        const origMeta = await sharp(rawBuf).metadata();
        const origW = origMeta.width || 1290;
        const origH = origMeta.height || 2796;

        let phonePipe = sharp(rawBuf);
        let appliedCrop = { x: 0, y: 0, width: origW, height: origH };

        if (rawCropCoords && Number(rawCropCoords.width) > 0 && Number(rawCropCoords.height) > 0) {
          appliedCrop = clampCropCoords(rawCropCoords, origW, origH);
          phonePipe = phonePipe.extract({
            left: appliedCrop.x,
            top: appliedCrop.y,
            width: appliedCrop.width,
            height: appliedCrop.height,
          });
        }

        const phoneMasterBuf = await phonePipe
          .resize({
            width: 1290,
            height: 2796,
            fit: "cover",
            position: "centre",
            kernel: sharp.kernel.lanczos3,
          })
          .webp({ quality: 94, effort: 4 })
          .toBuffer();

        const phoneThumbBuf = await sharp(phoneMasterBuf)
          .resize({ width: 400, height: 868, fit: "fill" })
          .webp({ quality: 80, effort: 4 })
          .toBuffer();

        const phoneKey = `wallpapers/phone/${slug}.webp`;
        const phoneThumbKey = `wallpapers/phone/thumbnails/${slug}.webp`;

        const [phoneUrl, phoneThumbUrl] = await Promise.all([
          uploadToR2(phoneKey, phoneMasterBuf, "image/webp"),
          uploadToR2(phoneThumbKey, phoneThumbBuf, "image/webp"),
        ]);

        uploadedAssets.push(
          { label: "Phone Lockscreen Master", key: phoneKey, url: phoneUrl, bytes: phoneMasterBuf.length, dims: "1290×2796" },
          { label: "Phone Feed Thumbnail", key: phoneThumbKey, url: phoneThumbUrl, bytes: phoneThumbBuf.length, dims: "400×868" }
        );

        finalDoc = {
          id: docId,
          slug,
          title,
          description: description || `Curated ${category.toLowerCase()} wallpaper crafted for mobile lockscreens.`,
          classification: {
            category,
            collection: collectionName,
            aspectRatio: aspectRatioInput === "9:19.5" ? "9:19.5" : "9:16",
            resolution: `${origW} × ${origH}`,
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
            hasPhoneCrop: true,
            hasDedicatedPhone: true,
          },
          author: XWEET_AUTHOR,
          storage: {
            r2Key: phoneKey,
            format: "webp",
            phoneCropCoords: appliedCrop,
          },
          urls: {
            phone: phoneUrl,
            phoneThumbnail: phoneThumbUrl,
            desktop: phoneUrl,
            desktopThumbnail: phoneThumbUrl,
          },
          metadata: {
            publishedAt,
            createdAt: now,
          },
        };
      } else {
        // Dual mode (Both Desktop 4K + Cropped Phone or Dedicated Phone)
        const rawDesktopBuf = Buffer.from(await desktopFile.arrayBuffer());
        const origMeta = await sharp(rawDesktopBuf).metadata();
        const origW = origMeta.width || 3840;
        const origH = origMeta.height || 2160;

        let desktopPipe = sharp(rawDesktopBuf);
        if (origW > 3840 || origH > 2160) {
          desktopPipe = desktopPipe.resize({ width: 3840, height: 2160, fit: "inside", withoutEnlargement: true });
        }
        const desktopMasterBuf = await desktopPipe.webp({ quality: 94, effort: 4 }).toBuffer();
        const finalMeta = await sharp(desktopMasterBuf).metadata();
        const finalW = finalMeta.width || origW;
        const finalH = finalMeta.height || origH;

        const desktopThumbBuf = await sharp(desktopMasterBuf)
          .resize({ width: 800, withoutEnlargement: true })
          .webp({ quality: 85, effort: 4 })
          .toBuffer();

        // Phone crop coords scaled onto finalW x finalH master
        let scaledCrop;
        if (rawCropCoords && Number(rawCropCoords.width) > 0 && Number(rawCropCoords.height) > 0) {
          const scaleX = finalW / origW;
          const scaleY = finalH / origH;
          scaledCrop = clampCropCoords(
            {
              x: (Number(rawCropCoords.x) || 0) * scaleX,
              y: (Number(rawCropCoords.y) || 0) * scaleY,
              width: Number(rawCropCoords.width) * scaleX,
              height: Number(rawCropCoords.height) * scaleY,
            },
            finalW,
            finalH
          );
        } else {
          const targetRatio = phoneCropAspect === "9:16" ? 9 / 16 : 9 / 19.5;
          const cropH = finalH;
          const cropW = Math.min(finalW, Math.round(finalH * targetRatio));
          const cropX = Math.max(0, Math.round((finalW - cropW) / 2));
          scaledCrop = { x: cropX, y: 0, width: cropW, height: cropH };
        }

        let phoneMasterBuf;
        if (phoneFile instanceof File) {
          const rawPhoneBuf = Buffer.from(await phoneFile.arrayBuffer());
          phoneMasterBuf = await sharp(rawPhoneBuf)
            .resize({
              width: 1290,
              height: 2796,
              fit: "cover",
              position: "centre",
              kernel: sharp.kernel.lanczos3,
            })
            .webp({ quality: 94, effort: 4 })
            .toBuffer();
        } else {
          phoneMasterBuf = await sharp(desktopMasterBuf)
            .extract({
              left: scaledCrop.x,
              top: scaledCrop.y,
              width: scaledCrop.width,
              height: scaledCrop.height,
            })
            .resize({
              width: 1290,
              height: 2796,
              fit: "cover",
              position: "centre",
              kernel: sharp.kernel.lanczos3,
            })
            .webp({ quality: 94, effort: 4 })
            .toBuffer();
        }

        const phoneThumbBuf = await sharp(phoneMasterBuf)
          .resize({ width: 400, height: 868, fit: "fill" })
          .webp({ quality: 80, effort: 4 })
          .toBuffer();

        const desktopKey = `wallpapers/${slug}.webp`;
        const desktopThumbKey = `wallpapers/thumbnails/${slug}.webp`;
        const phoneKey = `wallpapers/phone/${slug}.webp`;
        const phoneThumbKey = `wallpapers/phone/thumbnails/${slug}.webp`;

        const [desktopUrl, desktopThumbUrl, phoneUrl, phoneThumbUrl] = await Promise.all([
          uploadToR2(desktopKey, desktopMasterBuf, "image/webp"),
          uploadToR2(desktopThumbKey, desktopThumbBuf, "image/webp"),
          uploadToR2(phoneKey, phoneMasterBuf, "image/webp"),
          uploadToR2(phoneThumbKey, phoneThumbBuf, "image/webp"),
        ]);

        uploadedAssets.push(
          { label: "Desktop Master", key: desktopKey, url: desktopUrl, bytes: desktopMasterBuf.length, dims: `${finalW}×${finalH}` },
          { label: "Desktop Thumbnail", key: desktopThumbKey, url: desktopThumbUrl, bytes: desktopThumbBuf.length, dims: "800px wide" },
          { label: "Phone Lockscreen Master", key: phoneKey, url: phoneUrl, bytes: phoneMasterBuf.length, dims: "1290×2796" },
          { label: "Phone Feed Thumbnail", key: phoneThumbKey, url: phoneThumbUrl, bytes: phoneThumbBuf.length, dims: "400×868" }
        );

        finalDoc = {
          id: docId,
          slug,
          title,
          description: description || `Curated ${category.toLowerCase()} wallpaper for desktop and cropped mobile lockscreens.`,
          classification: {
            category,
            collection: collectionName,
            aspectRatio: aspectRatioInput || "16:9",
            resolution: `${finalW} × ${finalH}`,
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
            hasPhoneCrop: true,
            hasDedicatedPhone: true,
          },
          author: XWEET_AUTHOR,
          storage: {
            r2Key: desktopKey,
            format: "webp",
            phoneCropCoords: scaledCrop,
          },
          urls: {
            phone: phoneUrl,
            phoneThumbnail: phoneThumbUrl,
            desktop: desktopUrl,
            desktopThumbnail: desktopThumbUrl,
          },
          metadata: {
            publishedAt,
            createdAt: now,
          },
        };
      }

      // Write directly to Firestore using Admin SDK (serviceAccountKey.json)
      await db.collection("wallpapers").doc(docId).set(finalDoc);

      return sendJson(res, 200, {
        ok: true,
        docId,
        slug,
        mode,
        uploadedAssets,
        document: finalDoc,
      });
    }

    // Toggle flag (isNew / isFeatured) in Firestore
    if (req.method === "POST" && pathname === "/api/toggle-flag") {
      const body = await readJsonBody(req);
      const { id, flag, value } = body;
      if (!id || !["isNew", "isFeatured"].includes(flag)) {
        return sendJson(res, 400, { error: "Invalid id or flag." });
      }
      await db.collection("wallpapers").doc(id).update({
        [`flags.${flag}`]: Boolean(value),
      });
      return sendJson(res, 200, { ok: true });
    }

    // Delete wallpaper from Firestore + R2
    if (req.method === "POST" && pathname === "/api/delete") {
      const body = await readJsonBody(req);
      const { id, slug, deleteR2 } = body;
      if (!id) return sendJson(res, 400, { error: "Missing document id." });

      await db.collection("wallpapers").doc(id).delete();

      let deletedKeys = [];
      if (deleteR2 && slug) {
        const candidateKeys = [
          `wallpapers/${slug}.webp`,
          `wallpapers/thumbnails/${slug}.webp`,
          `wallpapers/phone/${slug}.webp`,
          `wallpapers/phone/thumbnails/${slug}.webp`,
        ];
        await s3.send(
          new DeleteObjectsCommand({
            Bucket: bucketName,
            Delete: {
              Objects: candidateKeys.map((Key) => ({ Key })),
              Quiet: true,
            },
          })
        );
        deletedKeys = candidateKeys;
      }

      return sendJson(res, 200, { ok: true, id, deletedKeys });
    }

    return sendJson(res, 404, { error: "Not found" });
  } catch (err) {
    console.error("Studio API error:", err);
    return sendJson(res, 500, { error: err?.message || "Internal server error" });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("=================================================================");
  console.log("  XWEET WALLPAPER LOCAL UPLOAD STUDIO");
  console.log(`  Open in browser: http://localhost:${PORT}`);
  console.log(`  Firestore Project: ${serviceAccount.project_id}`);
  console.log(`  Cloudflare R2 Bucket: ${bucketName} (${cdnDomain})`);
  console.log("=================================================================");
});
