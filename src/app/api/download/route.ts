import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");
  const filename = searchParams.get("filename") || "wallpaper.png";

  if (!imageUrl) {
    return new NextResponse("Missing url parameter", { status: 400 });
  }

  try {
    const parsed = new URL(imageUrl);
    const allowedHosts = [
      "cdn.xweet.in",
      "cdn.xweet.com",
      "wallpaper.xweet.in",
      "xweet.in",
      "images.unsplash.com",
    ];
    const isAllowed =
      allowedHosts.includes(parsed.hostname) ||
      parsed.hostname.endsWith(".r2.cloudflarestorage.com");

    if (!isAllowed) {
      return new NextResponse("Forbidden domain", { status: 403 });
    }

    // Support conditional ETag validation to save 100% of read bandwidth on re-downloads
    const clientEtag = request.headers.get("if-none-match");

    const res = await fetch(imageUrl, {
      cache: "force-cache",
      next: { revalidate: 31536000 },
    });

    if (!res.ok) {
      return new NextResponse("Failed to fetch image from CDN", { status: res.status });
    }

    const etag = res.headers.get("etag") || `"${imageUrl.split("/").pop()}"`;
    if (clientEtag && clientEtag === etag) {
      return new NextResponse(null, { status: 304 });
    }

    const contentType = res.headers.get("content-type") || "image/png";
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, "_");

    return new NextResponse(res.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${sanitizedFilename}"`,
        "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
        "CDN-Cache-Control": "public, max-age=31536000, immutable",
        "Cloudflare-CDN-Cache-Control": "public, max-age=31536000, immutable",
        "ETag": etag,
      },
    });
  } catch (error) {
    console.error("Error streaming download:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
