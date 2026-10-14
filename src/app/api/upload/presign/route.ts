import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/admin";
import { getPresignedUploadUrl } from "@/lib/r2";

export const maxDuration = 60;

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
    try {
      await adminAuth.verifyIdToken(token);
    } catch (err: any) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or expired token.", details: err.message },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { filename, contentType, slug } = body;

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: "Missing required fields: 'filename' and 'contentType' are required." },
        { status: 400 }
      );
    }

    const ext = filename.split(".").pop()?.toLowerCase() || "png";
    const wallpaperSlug = slug || `wp-${Date.now()}`;
    const key = `wallpapers/${wallpaperSlug}/${filename.toLowerCase().includes("phone") ? "phone" : "desktop"}.${ext}`;

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
    });
  } catch (error: any) {
    console.error("Presign API Error:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned upload URL", message: error?.message },
      { status: 500 }
    );
  }
}
