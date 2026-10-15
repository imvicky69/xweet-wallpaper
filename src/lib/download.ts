/**
 * Triggers a direct native browser download using the dynamic cropping & optimization pipeline.
 * Hits /api/download/[slug]?type=[type]&format=[format]
 */
export function triggerDynamicDownload(
  slug: string,
  type: "desktop-4k" | "desktop-1080p" | "phone-4k" | "thumbnail" = "desktop-4k",
  format: "webp" | "png" | "jpg" = "webp"
) {
  if (typeof window === "undefined") return;

  const downloadApiUrl = `/api/download/${encodeURIComponent(slug)}?type=${encodeURIComponent(type)}&format=${encodeURIComponent(format)}`;
  const link = document.createElement("a");
  link.href = downloadApiUrl;
  link.download = `${slug}-${type}.${format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Triggers a direct native browser download with the specified filename
 * using the server-side /api/download attachment streamer.
 *
 * This forces the browser to open the native "Save / Download" dialog
 * instead of opening a cross-origin CDN URL in a new browser tab.
 */
export function triggerDirectDownload(imageUrl: string, filename: string) {
  if (typeof window === "undefined") return;

  const downloadApiUrl = `/api/download?url=${encodeURIComponent(imageUrl)}&filename=${encodeURIComponent(filename)}`;
  
  const link = document.createElement("a");
  link.href = downloadApiUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
