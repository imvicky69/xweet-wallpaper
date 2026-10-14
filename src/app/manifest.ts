import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Xweet Wallpapers — Curated Minimal Abstracts",
    short_name: "Xweet",
    description:
      "Curated wallpaper discovery platform for everyday screens. Warm editorial minimalism, crisp geometry, and high-fidelity 4K backgrounds.",
    start_url: "/",
    display: "standalone",
    background_color: "#F6F3E9",
    theme_color: "#244B38",
    icons: [
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/favicon.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
