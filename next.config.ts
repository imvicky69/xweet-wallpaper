import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["firebase-admin", "sharp"],
  typescript: {
    ignoreBuildErrors: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    localPatterns: [
      {
        pathname: "/**",
      },
      {
        pathname: "/api/download/**",
        search: "?*",
      },
    ],
    qualities: [75, 80, 85, 88, 90, 92, 95],
    // Cache optimized images on server/edge for 1 year instead of default 60s
    minimumCacheTTL: 31536000,
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2560],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.xweet.in",
      },
      {
        protocol: "https",
        hostname: "xweet.in",
      },
      {
        protocol: "https",
        hostname: "wallpaper.xweet.in",
      },
      {
        protocol: "https",
        hostname: "cdn.xweet.com",
      },
      {
        protocol: "https",
        hostname: "xweet.com",
      },
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        // Cache direct wallpaper download streams for 1 year
        source: "/api/download(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, s-maxage=31536000, immutable",
          },
          {
            key: "CDN-Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
          {
            key: "Cloudflare-CDN-Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
