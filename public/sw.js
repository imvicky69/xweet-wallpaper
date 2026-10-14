// Xweet Wallpapers High-Performance Wallpaper & CDN Cache Service Worker
const CACHE_NAME = "xweet-wallpaper-cache-v1";
const MAX_CACHE_ENTRIES = 80;

// Match images from Cloudflare CDN, Next.js image optimizer, and wallpaper assets
function isCacheableWallpaperRequest(url) {
  return (
    url.hostname === "cdn.xweet.in" ||
    url.hostname === "cdn.xweet.com" ||
    url.hostname.includes("r2.cloudflarestorage.com") ||
    url.pathname.startsWith("/_next/image") ||
    url.pathname.startsWith("/wallpapers")
  );
}

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          })
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (isCacheableWallpaperRequest(url)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        // 1. Cache-First: Return from local device cache (0ms latency, 0 R2 bandwidth)
        const cached = await cache.match(request);
        if (cached) {
          return cached;
        }

        // 2. Network fallback: Fetch and populate cache
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && (networkResponse.status === 200 || networkResponse.type === "opaque")) {
            cache.put(request, networkResponse.clone());
            trimCache(cache, MAX_CACHE_ENTRIES);
          }
          return networkResponse;
        } catch (err) {
          // If offline or network drop, return whatever is available
          return cached || new Response("Asset offline", { status: 503 });
        }
      })
    );
  }
});

// Helper: Keep cache clean and lightweight
async function trimCache(cache, maxItems) {
  try {
    const keys = await cache.keys();
    if (keys.length > maxItems) {
      await cache.delete(keys[0]);
    }
  } catch {
    // Ignore cache trim errors silently
  }
}
