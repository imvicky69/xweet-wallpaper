import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const clean = (val?: string, fallback = "") => {
  if (!val) return fallback;
  return val.trim().replace(/^["']|["']$/g, "").trim() || fallback;
};

const accountId = clean(process.env.CLOUDFLARE_R2_ACCOUNT_ID);
const accessKeyId = clean(process.env.CLOUDFLARE_R2_ACCESS_KEY_ID);
const secretAccessKey = clean(process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY);
export const bucketName = clean(process.env.CLOUDFLARE_R2_BUCKET_NAME, "xweet");
export const publicCdnDomain = clean(process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN, "https://cdn.xweet.in");

export const isR2Configured = Boolean(accountId && accessKeyId && secretAccessKey);

export const r2Client = new S3Client({
  region: "auto",
  endpoint: accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined,
  credentials: {
    accessKeyId: accessKeyId || "",
    secretAccessKey: secretAccessKey || "",
  },
});

/**
 * Uploads a buffer or file to Cloudflare R2
 */
export async function uploadToR2({
  key,
  buffer,
  contentType,
  cacheControl = "public, max-age=31536000, immutable",
}: {
  key: string;
  buffer: Buffer | Uint8Array;
  contentType: string;
  cacheControl?: string;
}): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: cacheControl,
  });

  await r2Client.send(command);

  // Return public CDN URL
  const cleanDomain = publicCdnDomain.replace(/\/$/, "");
  const cleanKey = key.replace(/^\//, "");
  return `${cleanDomain}/${cleanKey}`;
}

/**
 * Generates an S3/R2 presigned upload URL for direct-to-bucket transfers
 */
export async function getPresignedUploadUrl({
  key,
  contentType,
  cacheControl = "public, max-age=31536000, immutable",
}: {
  key: string;
  contentType: string;
  cacheControl?: string;
}): Promise<{ uploadUrl: string; cdnUrl: string; key: string }> {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
    CacheControl: cacheControl,
  });

  const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
  const cleanDomain = publicCdnDomain.replace(/\/$/, "");
  const cleanKey = key.replace(/^\//, "");
  const cdnUrl = `${cleanDomain}/${cleanKey}`;

  return { uploadUrl, cdnUrl, key };
}

/**
 * Downloads an object buffer directly from Cloudflare R2
 */
export async function getObjectFromR2(key: string): Promise<Buffer | null> {
  try {
    const cleanKey = key.replace(/^\//, "");
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: cleanKey,
    });
    const response = await r2Client.send(command);
    if (!response.Body) return null;
    const byteArray = await response.Body.transformToByteArray();
    return Buffer.from(byteArray);
  } catch (error: any) {
    console.warn(`Failed to retrieve ${key} from R2:`, error?.message);
    return null;
  }
}

/**
 * Deletes a single object from Cloudflare R2
 */
export async function deleteFromR2(key: string): Promise<boolean> {
  try {
    const cleanKey = key.replace(/^\//, "");
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: cleanKey,
    });
    await r2Client.send(command);
    return true;
  } catch (error: any) {
    console.warn(`Failed to delete ${key} from R2:`, error?.message);
    return false;
  }
}

/**
 * Deletes multiple objects in batch from Cloudflare R2
 */
export async function deleteMultipleFromR2(keys: string[]): Promise<number> {
  if (!keys.length) return 0;
  try {
    const objects = keys.map((k) => ({ Key: k.replace(/^\//, "") }));
    const command = new DeleteObjectsCommand({
      Bucket: bucketName,
      Delete: {
        Objects: objects,
        Quiet: true,
      },
    });
    const response = await r2Client.send(command);
    const errors = response.Errors?.length || 0;
    return keys.length - errors;
  } catch (error: any) {
    console.warn("Failed batch delete from R2:", error?.message);
    return 0;
  }
}
