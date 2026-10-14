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
