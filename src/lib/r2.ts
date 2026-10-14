import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const clean = (val?: string, fallback = "") => {
  if (!val) return fallback;
  return val.trim().replace(/^["']|["']$/g, "").trim() || fallback;
};

const accountId = clean(process.env.CLOUDFLARE_R2_ACCOUNT_ID, "e066fe539ea2c049a749b6062d3b35a9");
const accessKeyId = clean(process.env.CLOUDFLARE_R2_ACCESS_KEY_ID, "257e32e56446be74a606b54456efc7c1");
const secretAccessKey = clean(process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY, "93fe294b4e7f360a4bad038c4590e32c834bc7113f83f1b17c9ea7f1cbaefcda");
export const bucketName = clean(process.env.CLOUDFLARE_R2_BUCKET_NAME, "xweet");
export const publicCdnDomain = clean(process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN, "https://cdn.xweet.in");

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
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
