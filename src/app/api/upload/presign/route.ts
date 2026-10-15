import { NextRequest, NextResponse } from "next/server";
import { getPresignedUploadUrl } from "@/lib/r2";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "Xweet Wallpaper Single Master Presign Pipeline",
    methodsAllowed: ["POST"],
  });
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized: Missing or invalid Firebase ID token." },
        { status: 401 }
      );
    }

    const token = authHeader.split("Bearer ")[1];
    let decodedToken: any;
    try {
      const parts = token.split(".");
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
        if (payload && (payload.user_id || payload.sub)) {
          decodedToken = { uid: payload.user_id || payload.sub };
        }
      }
    } catch (err: any) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or expired token.", details: err?.message },
        { status: 401 }
      );
    }

    if (!decodedToken?.uid) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or expired token." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const wallpaperSlug = body.slug || `wp-${Date.now()}`;

    // Single master file key
    const key = body.key || `wallpapers/${wallpaperSlug}.webp`;
    const contentType = body.contentType || "image/webp";

    const presigned = await getPresignedUploadUrl({
      key,
      contentType,
    });

    return NextResponse.json({
      success: true,
      uploadUrl: presigned.uploadUrl,
      cdnUrl: presigned.cdnUrl,
      key: presigned.key,
      slug: wallpaperSlug,
      urls: {
        master: presigned,
      },
    });
  } catch (error: any) {
    console.error("Presign API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned upload URL", message: error?.message },
      { status: 500 }
    );
  }
}
