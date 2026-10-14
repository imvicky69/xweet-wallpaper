import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID || "";
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "";
export const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || "xweet-wallpapers";
export const publicCdnDomain = process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN || "https://cdn.xweet.com";

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
}: {
  key: string;
  buffer: Buffer | Uint8Array;
  contentType: string;
}): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await r2Client.send(command);

  // Return public CDN URL
  const cleanDomain = publicCdnDomain.replace(/\/$/, "");
  const cleanKey = key.replace(/^\//, "");
  return `${cleanDomain}/${cleanKey}`;
}
