import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://xweet.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/private/"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/wallpapers/", "/logo.png"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
