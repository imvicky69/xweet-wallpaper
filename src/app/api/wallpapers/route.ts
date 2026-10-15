import { NextRequest, NextResponse } from "next/server";
import { WALLPAPERS, normalizeWallpaper, getCdnImageUrl } from "@/lib/wallpapers";
import { Wallpaper } from "@/types/wallpaper";

// CORS Headers helper
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

/**
 * Handle CORS Preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

/**
 * Format a Wallpaper domain object into an API-ready DTO
 */
function formatWallpaperDto(wp: Wallpaper, origin: string) {
  const cdnMasterUrl = getCdnImageUrl(wp.imageUrl);
  const avatarUrl = wp.author?.photoURL
    ? wp.author.photoURL.startsWith("http")
      ? wp.author.photoURL
      : `${origin}${wp.author.photoURL}`
    : `${origin}/logo.png`;

  return {
    id: wp.id,
    slug: wp.slug,
    title: wp.title,
    description: wp.description,
    classification: {
      category: wp.category,
      collection: wp.collection,
      aspectRatio: wp.aspectRatio,
      resolution: wp.resolution,
    },
    styling: {
      dominantColor: wp.dominantColor,
      paletteHex: wp.paletteHex || wp.dominantColor,
      palette: wp.palette || [wp.dominantColor],
      tags: wp.tags || [],
    },
    author: {
      name: wp.author?.displayName || "Vicky",
      username: wp.author?.username || "xweet",
      avatarUrl,
      isVerified: wp.author?.isVerified ?? true,
      bio: wp.author?.bio || null,
    },
    urls: {
      master: cdnMasterUrl,
      phoneLockscreen: `${origin}/api/download/${wp.slug}?type=phone-4k`,
      desktop1080p: `${origin}/api/download/${wp.slug}?type=desktop-1080p`,
      desktop4k: `${origin}/api/download/${wp.slug}?type=desktop-4k`,
      thumbnail: getCdnImageUrl(wp.thumbnailUrl || wp.imageUrl),
      webPage: `${origin}/wallpaper/${wp.slug}`,
    },
    flags: {
      isFeatured: wp.isFeatured ?? false,
      isNew: wp.isNew ?? false,
      hasPhoneCrop: wp.hasPhoneCrop ?? true,
    },
    publishedAt: wp.publishedAt || wp.metadata?.publishedAt || null,
    createdAt: wp.createdAt || wp.metadata?.createdAt || null,
  };
}

/**
 * GET /api/wallpapers
 * Flexible, public REST API to query wallpapers for external apps, widgets, and services.
 */
export async function GET(request: NextRequest) {
  try {

  const origin = request.nextUrl.origin || "https://wallpaper.xweet.in";
  const { searchParams } = new URL(request.url);

  // 1. Parse Query Parameters
  const slugParam = searchParams.get("slug") || searchParams.get("id");
  const queryParam = (searchParams.get("q") || searchParams.get("search") || "").trim().toLowerCase();
  const categoryParam = (searchParams.get("category") || "").trim().toLowerCase();
  const orientationParam = (searchParams.get("orientation") || searchParams.get("type") || "all").trim().toLowerCase();
  const featuredParam = searchParams.get("featured");
  const randomParam = searchParams.get("random") === "true" || searchParams.get("random") === "1";
  const sortParam = (searchParams.get("sort") || (randomParam ? "random" : "newest")).toLowerCase();
  const isAll = searchParams.get("all") === "true" || searchParams.get("all") === "1";
  const limitParam = parseInt(searchParams.get("limit") || searchParams.get("count") || "20", 10);
  const pageParam = parseInt(searchParams.get("page") || "1", 10);

  // 2. Load Wallpapers (Firestore Primary, In-Memory Static Catalog Resilient Fallback)
  let wallpapersList: Wallpaper[] = [];

  try {
    const adminMod = await import("@/lib/firebase/admin");
    const adminDb = adminMod.adminDb;
    if (adminDb) {
      const fetchPromise = adminDb.collection("wallpapers").get();
      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500));
      const snap = await Promise.race([fetchPromise, timeoutPromise]);
      if (snap && !snap.empty) {
        wallpapersList = snap.docs.map((doc: any) =>
          normalizeWallpaper({
            id: doc.id,
            ...doc.data(),
          })
        );
      }
    }
  } catch (e: unknown) {
    // Graceful fallback to static wallpapers catalog
  }

  if (wallpapersList.length === 0) {
    wallpapersList = [...WALLPAPERS];
  }

  // 3. Single Item Lookup by Slug / ID
  if (slugParam) {
    const singleMatch = wallpapersList.find(
      (wp) => wp.slug.toLowerCase() === slugParam.toLowerCase() || wp.id.toLowerCase() === slugParam.toLowerCase()
    );

    if (!singleMatch) {
      return NextResponse.json(
        {
          success: false,
          error: `Wallpaper with identifier '${slugParam}' not found`,
        },
        {
          status: 404,
          headers: {
            ...corsHeaders,
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          },
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: formatWallpaperDto(singleMatch, origin),
      },
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=86400",
        },
      }
    );
  }

  // 4. Filtering Pipeline
  let filtered = wallpapersList.filter((wp) => {
    // A. Category / Style Match
    if (categoryParam && categoryParam !== "all") {
      const wpCat = (wp.category || "").toLowerCase();
      const wpCol = (wp.collection || "").toLowerCase();
      if (wpCat !== categoryParam && wpCol !== categoryParam) {
        return false;
      }
    }

    // B. Orientation / Type Match
    if (orientationParam === "mobile" || orientationParam === "phone") {
      const hasPhone = wp.orientation === "mobile" || wp.hasPhoneCrop || Boolean(wp.phoneImageUrl);
      if (!hasPhone) return false;
    } else if (orientationParam === "desktop") {
      const hasDesktop =
        wp.orientation === "desktop" ||
        Boolean(wp.desktopAsset) ||
        wp.aspectRatio === "16:9" ||
        wp.aspectRatio === "16:10";
      if (!hasDesktop) return false;
    }

    // C. Featured Match
    if (featuredParam === "true" || featuredParam === "1") {
      if (!wp.isFeatured && !wp.flags?.isFeatured) return false;
    }

    // D. Search Query Match
    if (queryParam) {
      const titleMatch = (wp.title || "").toLowerCase().includes(queryParam);
      const descMatch = (wp.description || "").toLowerCase().includes(queryParam);
      const catMatch = (wp.category || "").toLowerCase().includes(queryParam);
      const tagsMatch = (wp.tags || []).some((tag) => tag.toLowerCase().includes(queryParam));
      if (!titleMatch && !descMatch && !catMatch && !tagsMatch) return false;
    }

    return true;
  });

  // 5. Sorting / Randomization Pipeline
  if (sortParam === "random" || randomParam) {
    // Fisher-Yates array shuffle
    for (let i = filtered.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
    }
  } else if (sortParam === "oldest") {
    filtered.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  } else if (sortParam === "title") {
    filtered.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
  } else {
    // Default newest
    filtered.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  }

  // 6. Pagination Pipeline
  const total = filtered.length;
  let paginated: Wallpaper[];
  let page = Math.max(1, pageParam || 1);
  let limit = isAll ? total : Math.min(100, Math.max(1, limitParam || 20));
  let totalPages = isAll ? 1 : Math.max(1, Math.ceil(total / limit));

  if (isAll) {
    paginated = filtered;
    page = 1;
    limit = total;
    totalPages = 1;
  } else {
    const startIndex = (page - 1) * limit;
    paginated = filtered.slice(startIndex, startIndex + limit);
  }

  const hasMore = page < totalPages;

  // 7. Format Output Items
  const formattedData = paginated.map((wp) => formatWallpaperDto(wp, origin));

  return NextResponse.json(
    {
      success: true,
      timestamp: Date.now(),
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasMore,
      },
      data: formattedData,
    },
    {
      status: 200,
      headers: {
        ...corsHeaders,
        "Cache-Control": randomParam
          ? "no-cache, no-store, must-revalidate"
          : "public, s-maxage=300, stale-while-revalidate=86400",
      },
    }
  );

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('Wallpapers API Catch:', err);
    return NextResponse.json({ success: false, error: msg }, { status: 500, headers: corsHeaders });
  }
}
