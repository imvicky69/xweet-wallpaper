import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wallpaper.xweet.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/wallpaper/", "/xweet", "/wallpapers/"],
        disallow: ["/api/", "/private/"],
      },
      {
        userAgent: ["Googlebot-Image", "Bingbot", "Googlebot"],
        allow: ["/", "/wallpaper/", "/wallpapers/", "/logo.png", "/favicon.png"],
        disallow: ["/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
