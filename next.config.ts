import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    qualities: [75, 80, 85, 90, 92],
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
