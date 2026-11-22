import { Collection, Wallpaper, WallpaperDoc, AuthorRef } from "@/types/wallpaper";

export const XWEET_AUTHOR: AuthorRef = {
  id: "xweet",
  username: "xweet",
  displayName: "Vicky",
  photoURL: "/logo.png",
  isVerified: true,
  bio: "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens.",
  joinedAt: "2026-01-01",
};

export const COLLECTIONS: Collection[] = [
  {
    id: "minimal-abstracts",
    slug: "minimal-abstracts",
    title: "Minimal Abstracts",
    description: "AI-generated and curated by Xweet. Quiet forms, chromatic diffusions, and organic textures.",
    coverImageUrl: "https://cdn.xweet.in/wallpapers/midnight-amber.webp",
    count: 63,
    tags: ["Minimal", "Abstract", "4K", "Tactile", "Phone"],
  },
];

export const CATEGORIES = [
  "All",
  "Dark Abstract",
  "Warm Minimal",
  "Cool Minimal",
  "Pastel Abstract",
  "Earthy Abstract",
  "Warm Dark Abstract",
  "Warm Neutral",
  "Pastel Gradient",
  "Cool Abstract",
  "Soft Minimal",
  "Monochrome Abstract",
  "Earthy Minimal",
  "Modern Abstract",
  "Warm Dark Minimal",
  "flower",
  "Nature Vertical",
  "Lockscreen",
  "Anime Vertical",
  "AMOLED Mobile",
  "Aesthetic Portrait",
  "Minimal Mobile"
];

export const MOBILE_CATEGORIES = [
  "Lockscreen",
  "AMOLED Mobile",
  "Dark Abstract",
  "Minimal Mobile",
  "Anime Vertical",
  "Cyberpunk Mobile",
  "Aesthetic Portrait",
  "Nature Vertical",
  "Typography Lockscreen",
  "Warm Minimal",
  "Pastel Gradient",
  "Monochrome Abstract",
  "Warm Dark Abstract"
];

const RAW_WALLPAPERS: WallpaperDoc[] = [
  {
    "id": "wp-01",
    "slug": "midnight-amber",
    "title": "Midnight Amber",
    "description": "Flowing midnight-blue forms meet a delicate amber glow in this textured abstract wallpaper. A calm, cinematic backdrop for a focused desktop.",
    "classification": {
      "category": "Dark Abstract",
      "collection": "Minimal Abstracts",
      "aspectRatio": "16:9",
      "resolution": "2752 × 1536"
    },
    "styling": {
      "dominantColor": "#111B2A",
      "paletteHex": "#D99562",
      "palette": [
        "#111B2A",
        "#344153",
        "#D99562"
      ],
      "tags": [
        "minimal",
        "abstract",
        "navy",
        "amber",
        "dark blue",
        "grain texture",
        "flowing curves",
        "desktop"
      ]
    },
    "flags": {
      "isFeatured": true,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/midnight-amber.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 680,
        "y": 0,
        "width": 864,
        "height": 1536
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/midnight-amber.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/midnight-amber.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/midnight-amber.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/midnight-amber.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14",
      "createdAt": 1791934171013
    }
  },
  {
    "id": "wp-02",
    "slug": "sand-and-cream",
    "title": "Sand & Cream",
    "description": "Subtle tactile paper gradients and layered dunes of warm sand and soft ivory cream.",
    "classification": {
      "category": "Warm Minimal",
      "collection": "Minimal Abstracts",
      "aspectRatio": "16:9",
      "resolution": "2752 × 1536"
    },
    "styling": {
      "dominantColor": "#F0E5D2",
      "paletteHex": "#D6C4A7",
      "palette": [
        "#F0E5D2",
        "#D6C4A7",
        "#B7A58B"
      ],
      "tags": [
        "warm minimal",
        "sand",
        "cream",
        "neutral",
        "beige",
        "ivory",
        "desktop"
      ]
    },
    "flags": {
      "isFeatured": true,
      "isNew": false,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/sand-and-cream.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 944,
        "y": 0,
        "width": 864,
        "height": 1536
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/sand-and-cream.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/sand-and-cream.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/sand-and-cream.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/sand-and-cream.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14",
      "createdAt": 1791934171099
    }
  },
  {
    "id": "wp-03",
    "slug": "ocean-mist",
    "title": "Ocean Mist",
    "description": "Cool atmospheric fog sweeping over soft ocean blue gradients for an open, airy desktop workspace.",
    "classification": {
      "category": "Cool Minimal",
      "collection": "Minimal Abstracts",
      "aspectRatio": "16:9",
      "resolution": "2752 × 1536"
    },
    "styling": {
      "dominantColor": "#829BAA",
      "paletteHex": "#C7D7DF",
      "palette": [
        "#C7D7DF",
        "#829BAA",
        "#64717D"
      ],
      "tags": [
        "cool minimal",
        "ocean blue",
        "mist",
        "cyan",
        "airy",
        "calm",
        "desktop"
      ]
    },
    "flags": {
      "isFeatured": true,
      "isNew": false,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/ocean-mist.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 944,
        "y": 0,
        "width": 864,
        "height": 1536
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/ocean-mist.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/ocean-mist.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/ocean-mist.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/ocean-mist.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14",
      "createdAt": 1791934171231
    }
  },
  {
    "id": "wp-04",
    "slug": "lavender-haze",
    "title": "Lavender Haze",
    "description": "Soft diffusions of dusty lavender and warm peach light, casting quiet chromatic serenity.",
    "classification": {
      "category": "Pastel Abstract",
      "collection": "Minimal Abstracts",
      "aspectRatio": "16:9",
      "resolution": "2752 × 1536"
    },
    "styling": {
      "dominantColor": "#B8A9D0",
      "paletteHex": "#D9B5B2",
      "palette": [
        "#B8A9D0",
        "#D9B5B2",
        "#E8C7A8"
      ],
      "tags": [
        "pastel",
        "lavender",
        "violet",
        "peach",
        "haze",
        "soft light",
        "desktop"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/lavender-haze.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 944,
        "y": 0,
        "width": 864,
        "height": 1536
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/lavender-haze.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/lavender-haze.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/lavender-haze.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/lavender-haze.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14",
      "createdAt": 1791934171350
    }
  },
  {
    "id": "wp-05",
    "slug": "forest-glass",
    "title": "Forest Glass",
    "description": "Refractive frosted glass forms infused with organic forest green and earthy sage pigments.",
    "classification": {
      "category": "Earthy Abstract",
      "collection": "Minimal Abstracts",
      "aspectRatio": "16:9",
      "resolution": "2752 × 1536"
    },
    "styling": {
      "dominantColor": "#263F32",
      "paletteHex": "#71856B",
      "palette": [
        "#263F32",
        "#71856B",
        "#E5E3CE"
      ],
      "tags": [
        "earthy",
        "forest green",
        "sage",
        "cream",
        "glass",
        "botanical",
        "desktop"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": false,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/forest-glass.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 944,
        "y": 0,
        "width": 864,
        "height": 1536
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/forest-glass.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/forest-glass.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/forest-glass.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/forest-glass.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14",
      "createdAt": 1791934171431
    }
  },
  {
    "id": "wp-06",
    "slug": "copper-horizon",
    "title": "Copper Horizon",
    "description": "Sculptural charcoal folds catching the ember glow of brushed copper and baked terracotta.",
    "classification": {
      "category": "Warm Dark Abstract",
      "collection": "Minimal Abstracts",
      "aspectRatio": "16:9",
      "resolution": "2752 × 1536"
    },
    "styling": {
      "dominantColor": "#242323",
      "paletteHex": "#9C6047",
      "palette": [
        "#242323",
        "#9C6047",
        "#D99A71"
      ],
      "tags": [
        "warm dark",
        "charcoal",
        "copper",
        "terracotta",
        "metallic",
        "cinematic",
        "desktop"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/copper-horizon.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 944,
        "y": 0,
        "width": 864,
        "height": 1536
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/copper-horizon.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/copper-horizon.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/copper-horizon.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/copper-horizon.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14",
      "createdAt": 1791934171519
    }
  },
  {
    "id": "wp-07",
    "slug": "arctic-minimal",
    "title": "Arctic Minimal",
    "description": "Crisp architectural ice plains with pale silver reflections and pure negative space.",
    "classification": {
      "category": "Cool Minimal",
      "collection": "Minimal Abstracts",
      "aspectRatio": "16:9",
      "resolution": "2752 × 1536"
    },
    "styling": {
      "dominantColor": "#EAF2F4",
      "paletteHex": "#C6D7DE",
      "palette": [
        "#EAF2F4",
        "#C6D7DE",
        "#9AAEB9"
      ],
      "tags": [
        "arctic",
        "cool minimal",
        "ice blue",
        "silver",
        "clean",
        "bright",
        "desktop"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": false,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/arctic-minimal.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 944,
        "y": 0,
        "width": 864,
        "height": 1536
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/arctic-minimal.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/arctic-minimal.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/arctic-minimal.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/arctic-minimal.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14",
      "createdAt": 1791934171647
    }
  },
  {
    "id": "wp-08",
    "slug": "mocha-waves",
    "title": "Mocha Waves",
    "description": "Rich cappuccino swirls and velvet mocha contours creating an organic, grounded desk aesthetic.",
    "classification": {
      "category": "Warm Neutral",
      "collection": "Minimal Abstracts",
      "aspectRatio": "16:9",
      "resolution": "2752 × 1536"
    },
    "styling": {
      "dominantColor": "#49372E",
      "paletteHex": "#98745C",
      "palette": [
        "#49372E",
        "#98745C",
        "#D8C1A4"
      ],
      "tags": [
        "mocha",
        "warm neutral",
        "taupe",
        "cappuccino",
        "waves",
        "earthy",
        "desktop"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": false,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/mocha-waves.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 944,
        "y": 0,
        "width": 864,
        "height": 1536
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/mocha-waves.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/mocha-waves.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/mocha-waves.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/mocha-waves.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14",
      "createdAt": 1791934171734
    }
  },
  {
    "id": "wp-09",
    "slug": "pastel-sunrise",
    "title": "Pastel Sunrise",
    "description": "First light filtering across apricot dunes and blush morning skies.",
    "classification": {
      "category": "Pastel Gradient",
      "collection": "Minimal Abstracts",
      "aspectRatio": "16:9",
      "resolution": "2752 × 1536"
    },
    "styling": {
      "dominantColor": "#E9A88F",
      "paletteHex": "#F1D4AA",
      "palette": [
        "#E9A88F",
        "#F1D4AA",
        "#B6C7DA"
      ],
      "tags": [
        "pastel gradient",
        "sunrise",
        "apricot",
        "blush",
        "dusty blue",
        "calm",
        "desktop"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": false,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/pastel-sunrise.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 944,
        "y": 0,
        "width": 864,
        "height": 1536
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/pastel-sunrise.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/pastel-sunrise.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/pastel-sunrise.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/pastel-sunrise.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14",
      "createdAt": 1791934171828
    }
  },
  {
    "id": "wp-10",
    "slug": "deep-teal",
    "title": "Deep Teal",
    "description": "Submerged oceanic depth with petrol teal light sweeping over midnight mineral ridges.",
    "classification": {
      "category": "Cool Abstract",
      "collection": "Minimal Abstracts",
      "aspectRatio": "16:9",
      "resolution": "2752 × 1536"
    },
    "styling": {
      "dominantColor": "#103B3D",
      "paletteHex": "#246568",
      "palette": [
        "#103B3D",
        "#246568",
        "#7CA7A0"
      ],
      "tags": [
        "deep teal",
        "petrol",
        "turquoise",
        "ocean",
        "midnight",
        "abstract",
        "desktop"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/deep-teal.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 944,
        "y": 0,
        "width": 864,
        "height": 1536
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/deep-teal.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/deep-teal.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/deep-teal.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/deep-teal.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14",
      "createdAt": 1791934171927
    }
  },
  {
    "id": "wp-11",
    "slug": "rose-quartz",
    "title": "Rose Quartz",
    "description": "Sculpted mineral facets in dusty rose and soft ivory, bringing quiet warmth to minimal spaces.",
    "classification": {
      "category": "Soft Minimal",
      "collection": "Minimal Abstracts",
      "aspectRatio": "16:9",
      "resolution": "2752 × 1536"
    },
    "styling": {
      "dominantColor": "#D9B5B2",
      "paletteHex": "#EAD5D0",
      "palette": [
        "#D9B5B2",
        "#EAD5D0",
        "#F5EAE0"
      ],
      "tags": [
        "rose quartz",
        "soft minimal",
        "blush",
        "ivory",
        "mineral",
        "elegant",
        "desktop"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": false,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/rose-quartz.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 944,
        "y": 0,
        "width": 864,
        "height": 1536
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/rose-quartz.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/rose-quartz.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/rose-quartz.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/rose-quartz.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14",
      "createdAt": 1791934172003
    }
  },
  {
    "id": "wp-12",
    "slug": "graphite-silver",
    "title": "Graphite Silver",
    "description": "Precision industrial geometry and brushed silver reflections on a deep graphite field.",
    "classification": {
      "category": "Monochrome Abstract",
      "collection": "Minimal Abstracts",
      "aspectRatio": "16:9",
      "resolution": "2752 × 1536"
    },
    "styling": {
      "dominantColor": "#343638",
      "paletteHex": "#8C9295",
      "palette": [
        "#343638",
        "#8C9295",
        "#D9D9D3"
      ],
      "tags": [
        "graphite",
        "monochrome",
        "silver",
        "minimalist",
        "industrial",
        "metallic",
        "desktop"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": false,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/graphite-silver.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 944,
        "y": 0,
        "width": 864,
        "height": 1536
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/graphite-silver.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/graphite-silver.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/graphite-silver.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/graphite-silver.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14",
      "createdAt": 1791934172079
    }
  },
  {
    "id": "wp-13",
    "slug": "olive-and-stone",
    "title": "Olive & Stone",
    "description": "Textured natural limestone layered with muted botanical olive pigments.",
    "classification": {
      "category": "Earthy Minimal",
      "collection": "Minimal Abstracts",
      "aspectRatio": "16:9",
      "resolution": "2752 × 1536"
    },
    "styling": {
      "dominantColor": "#777B52",
      "paletteHex": "#B6B39A",
      "palette": [
        "#777B52",
        "#B6B39A",
        "#E1D7C2"
      ],
      "tags": [
        "olive",
        "stone",
        "earthy minimal",
        "limestone",
        "organic",
        "tactile",
        "desktop"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": false,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/olive-and-stone.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 944,
        "y": 0,
        "width": 864,
        "height": 1536
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/olive-and-stone.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/olive-and-stone.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/olive-and-stone.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/olive-and-stone.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14",
      "createdAt": 1791934172152
    }
  },
  {
    "id": "wp-14",
    "slug": "electric-blue-haze",
    "title": "Electric Blue Haze",
    "description": "Vibrant cobalt aura emerging through soft layers of atmospheric steel blue mist.",
    "classification": {
      "category": "Modern Abstract",
      "collection": "Minimal Abstracts",
      "aspectRatio": "16:9",
      "resolution": "2752 × 1536"
    },
    "styling": {
      "dominantColor": "#315B9C",
      "paletteHex": "#7596BF",
      "palette": [
        "#315B9C",
        "#7596BF",
        "#B9C9D9"
      ],
      "tags": [
        "electric blue",
        "cobalt",
        "steel blue",
        "modern abstract",
        "radiant",
        "desktop"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/electric-blue-haze.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 944,
        "y": 0,
        "width": 864,
        "height": 1536
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/electric-blue-haze.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/electric-blue-haze.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/electric-blue-haze.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/electric-blue-haze.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14",
      "createdAt": 1791934172226
    }
  },
  {
    "id": "wp-15",
    "slug": "eclipse-cream",
    "title": "Eclipse Cream",
    "description": "Delicate crescent of warm cream light cutting through dense charcoal green shadows.",
    "classification": {
      "category": "Warm Dark Minimal",
      "collection": "Minimal Abstracts",
      "aspectRatio": "16:9",
      "resolution": "2752 × 1536"
    },
    "styling": {
      "dominantColor": "#202C2A",
      "paletteHex": "#AFA18E",
      "palette": [
        "#F0E2CC",
        "#AFA18E",
        "#202C2A"
      ],
      "tags": [
        "eclipse cream",
        "warm dark",
        "charcoal",
        "cream",
        "contrast",
        "shadows",
        "desktop"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": false,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/eclipse-cream.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 944,
        "y": 0,
        "width": 864,
        "height": 1536
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/eclipse-cream.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/eclipse-cream.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/eclipse-cream.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/eclipse-cream.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14",
      "createdAt": 1791934172302
    }
  },
  {
    "id": "wp-16",
    "slug": "midnight-dunes",
    "title": "Midnight Dunes",
    "description": "Rolling minimalist desert dunes bathed in late-night obsidian shadows with an ethereal amber rim glow.",
    "classification": {
      "category": "Dark Abstract",
      "collection": "Minimal Abstracts",
      "aspectRatio": "16:9",
      "resolution": "1672 × 941"
    },
    "styling": {
      "dominantColor": "#111827",
      "paletteHex": "#D97706",
      "palette": [
        "#111827",
        "#D97706",
        "#374151"
      ],
      "tags": [
        "midnight dunes",
        "amber glow",
        "dark abstract",
        "dunes",
        "desert",
        "calm",
        "desktop"
      ]
    },
    "flags": {
      "isFeatured": true,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/midnight-dunes.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 572,
        "y": 0,
        "width": 529,
        "height": 941
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/midnight-dunes.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/midnight-dunes.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/midnight-dunes.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/midnight-dunes.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14",
      "createdAt": 1791934172366
    }
  },
  {
    "id": "wp_1791979952605",
    "slug": "sunflowers-in-soft-morning-light-952605",
    "title": "Sunflowers in Soft Morning Light",
    "description": "#minimal #4k #editorial #clean",
    "classification": {
      "category": "flower",
      "collection": "flower",
      "aspectRatio": "16:9",
      "resolution": "1672 × 941"
    },
    "styling": {
      "dominantColor": "#111B2A",
      "paletteHex": "#111B2A",
      "palette": [
        "#111B2A",
        "#344153",
        "#111B2A"
      ],
      "tags": [
        "minimal",
        "4k",
        "editorial",
        "clean"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/sunflowers-in-soft-morning-light-952605.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 572,
        "y": 0,
        "width": 529,
        "height": 941
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/sunflowers-in-soft-morning-light-952605.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/sunflowers-in-soft-morning-light-952605.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/sunflowers-in-soft-morning-light-952605.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/sunflowers-in-soft-morning-light-952605.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14T12:12:38.290Z",
      "createdAt": 1791979958290
    }
  },
  {
    "id": "wp_1791994019956",
    "slug": "red-rose-luxury-minimalism-019956",
    "title": "Red Rose — Luxury Minimalism",
    "description": "#minimal #4k #editorial #clean #red #rose",
    "classification": {
      "category": "flower",
      "collection": "flower",
      "aspectRatio": "16:9",
      "resolution": "2752 × 1536"
    },
    "styling": {
      "dominantColor": "#E11D48",
      "paletteHex": "#E11D48",
      "palette": [
        "#E11D48",
        "#344153",
        "#E11D48"
      ],
      "tags": [
        "minimal",
        "4k",
        "editorial",
        "clean",
        "red",
        "rose"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/red-rose-luxury-minimalism-019956.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 944,
        "y": 0,
        "width": 864,
        "height": 1536
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/red-rose-luxury-minimalism-019956.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/red-rose-luxury-minimalism-019956.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/red-rose-luxury-minimalism-019956.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/red-rose-luxury-minimalism-019956.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14T16:07:04.273Z",
      "createdAt": 1791994024273
    }
  },
  {
    "id": "wp_1791999833279",
    "slug": "white-daisy-playful-minimalism",
    "title": "White Daisy — Playful Minimalism",
    "description": "#minimal #4k #editorial #clean",
    "classification": {
      "category": "flower",
      "collection": "flower",
      "aspectRatio": "16:9",
      "resolution": "2752 × 1536"
    },
    "styling": {
      "dominantColor": "#111B2A",
      "paletteHex": "#111B2A",
      "palette": [
        "#111B2A",
        "#344153",
        "#111B2A"
      ],
      "tags": [
        "minimal",
        "4k",
        "editorial",
        "clean"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/white-daisy-playful-minimalism.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 944,
        "y": 0,
        "width": 864,
        "height": 1536
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/white-daisy-playful-minimalism.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/white-daisy-playful-minimalism.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/white-daisy-playful-minimalism.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/white-daisy-playful-minimalism.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14T17:43:57.693Z",
      "createdAt": 1791999837693
    }
  },
  {
    "id": "wp_1792005720707",
    "slug": "calla-lily-sculptural-white",
    "title": "Calla Lily — Sculptural White",
    "description": "#minimal #4k #editorial #clean",
    "classification": {
      "category": "flower",
      "collection": "flower",
      "aspectRatio": "16:9",
      "resolution": "2752 × 1536"
    },
    "styling": {
      "dominantColor": "#7d7632",
      "paletteHex": "#7d7632",
      "palette": [
        "#7d7632",
        "#344153",
        "#7d7632"
      ],
      "tags": [
        "minimal",
        "4k",
        "editorial",
        "clean"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/calla-lily-sculptural-white.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 944,
        "y": 0,
        "width": 864,
        "height": 1536
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/calla-lily-sculptural-white.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/calla-lily-sculptural-white.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/calla-lily-sculptural-white.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/calla-lily-sculptural-white.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14T19:22:04.320Z",
      "createdAt": 1792005724320
    }
  },
  {
    "id": "wp_1792005759805",
    "slug": "cherry-blossom-soft-pink",
    "title": "Cherry Blossom — Soft Pink",
    "description": "#minimal #4k #editorial #clean",
    "classification": {
      "category": "flower",
      "collection": "flower",
      "aspectRatio": "16:9",
      "resolution": "2752 × 1536"
    },
    "styling": {
      "dominantColor": "#111B2A",
      "paletteHex": "#111B2A",
      "palette": [
        "#111B2A",
        "#344153",
        "#111B2A"
      ],
      "tags": [
        "minimal",
        "4k",
        "editorial",
        "clean"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/cherry-blossom-soft-pink.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 944,
        "y": 0,
        "width": 864,
        "height": 1536
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/cherry-blossom-soft-pink.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/cherry-blossom-soft-pink.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/cherry-blossom-soft-pink.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/cherry-blossom-soft-pink.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14T19:22:42.713Z",
      "createdAt": 1792005762713
    }
  },
  {
    "id": "wp_1792005787727",
    "slug": "forget-me-nots-tiny-blue-blooms",
    "title": "Forget Me Nots — Tiny Blue Blooms",
    "description": "#minimal #4k #editorial #clean",
    "classification": {
      "category": "flower",
      "collection": "flower",
      "aspectRatio": "16:9",
      "resolution": "2752 × 1536"
    },
    "styling": {
      "dominantColor": "#111B2A",
      "paletteHex": "#111B2A",
      "palette": [
        "#111B2A",
        "#344153",
        "#111B2A"
      ],
      "tags": [
        "minimal",
        "4k",
        "editorial",
        "clean"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/forget-me-nots-tiny-blue-blooms.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 944,
        "y": 0,
        "width": 864,
        "height": 1536
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/forget-me-nots-tiny-blue-blooms.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/forget-me-nots-tiny-blue-blooms.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/forget-me-nots-tiny-blue-blooms.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/forget-me-nots-tiny-blue-blooms.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14T19:23:11.016Z",
      "createdAt": 1792005791016
    }
  },
  {
    "id": "wp_1792005820212",
    "slug": "tulips-peach-cream",
    "title": "Tulips — Peach & Cream",
    "description": "#minimal #4k #editorial #clean",
    "classification": {
      "category": "flower",
      "collection": "flower",
      "aspectRatio": "16:9",
      "resolution": "2752 × 1536"
    },
    "styling": {
      "dominantColor": "#111B2A",
      "paletteHex": "#111B2A",
      "palette": [
        "#111B2A",
        "#344153",
        "#111B2A"
      ],
      "tags": [
        "minimal",
        "4k",
        "editorial",
        "clean"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/tulips-peach-cream.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 944,
        "y": 0,
        "width": 864,
        "height": 1536
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/tulips-peach-cream.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/tulips-peach-cream.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/tulips-peach-cream.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/tulips-peach-cream.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14T19:23:42.962Z",
      "createdAt": 1792005822962
    }
  },
  {
    "id": "wp_1792005867722",
    "slug": "lotus-misty-blue",
    "title": "Lotus — Misty Blue",
    "description": "#minimal #4k #editorial #clean",
    "classification": {
      "category": "flower",
      "collection": "flower",
      "aspectRatio": "16:9",
      "resolution": "2752 × 1536"
    },
    "styling": {
      "dominantColor": "#111B2A",
      "paletteHex": "#111B2A",
      "palette": [
        "#111B2A",
        "#344153",
        "#111B2A"
      ],
      "tags": [
        "minimal",
        "4k",
        "editorial",
        "clean"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/lotus-misty-blue.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 944,
        "y": 0,
        "width": 864,
        "height": 1536
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/lotus-misty-blue.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/lotus-misty-blue.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/lotus-misty-blue.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/lotus-misty-blue.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14T19:24:30.298Z",
      "createdAt": 1792005870298
    }
  },
  {
    "id": "wp_1792005891534",
    "slug": "hibiscus-tropical-coral",
    "title": "Hibiscus — Tropical Coral",
    "description": "#minimal #4k #editorial #clean",
    "classification": {
      "category": "flower",
      "collection": "flower",
      "aspectRatio": "16:9",
      "resolution": "2752 × 1536"
    },
    "styling": {
      "dominantColor": "#111B2A",
      "paletteHex": "#111B2A",
      "palette": [
        "#111B2A",
        "#344153",
        "#111B2A"
      ],
      "tags": [
        "minimal",
        "4k",
        "editorial",
        "clean"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/hibiscus-tropical-coral.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 944,
        "y": 0,
        "width": 864,
        "height": 1536
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/hibiscus-tropical-coral.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/hibiscus-tropical-coral.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/hibiscus-tropical-coral.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/hibiscus-tropical-coral.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14T19:24:53.919Z",
      "createdAt": 1792005893919
    }
  },
  {
    "id": "wp_1792005916285",
    "slug": "lavender-purple-haze",
    "title": "Lavender — Purple Haze",
    "description": "#minimal #4k #editorial #clean",
    "classification": {
      "category": "flower",
      "collection": "flower",
      "aspectRatio": "16:9",
      "resolution": "2752 × 1536"
    },
    "styling": {
      "dominantColor": "#111B2A",
      "paletteHex": "#111B2A",
      "palette": [
        "#111B2A",
        "#344153",
        "#111B2A"
      ],
      "tags": [
        "minimal",
        "4k",
        "editorial",
        "clean"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/lavender-purple-haze.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 944,
        "y": 0,
        "width": 864,
        "height": 1536
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/lavender-purple-haze.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/lavender-purple-haze.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/lavender-purple-haze.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/lavender-purple-haze.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14T19:25:18.824Z",
      "createdAt": 1792005918824
    }
  },
  {
    "id": "wp_1792005976139",
    "slug": "poppies-orange-blue",
    "title": "Poppies — Orange & Blue",
    "description": "#minimal #4k #editorial #clean",
    "classification": {
      "category": "flower",
      "collection": "flower",
      "aspectRatio": "16:9",
      "resolution": "2752 × 1536"
    },
    "styling": {
      "dominantColor": "#111B2A",
      "paletteHex": "#111B2A",
      "palette": [
        "#111B2A",
        "#344153",
        "#111B2A"
      ],
      "tags": [
        "minimal",
        "4k",
        "editorial",
        "clean"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/poppies-orange-blue.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 944,
        "y": 0,
        "width": 864,
        "height": 1536
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/poppies-orange-blue.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/poppies-orange-blue.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/poppies-orange-blue.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/poppies-orange-blue.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14T19:26:18.390Z",
      "createdAt": 1792005978390
    }
  },
  {
    "id": "wp_1792006035111",
    "slug": "dewlit-white-flower-in-misty-forest",
    "title": "Dewlit White Flower in Misty Forest",
    "description": "#minimal #4k #editorial #clean",
    "classification": {
      "category": "flower",
      "collection": "flower",
      "aspectRatio": "16:9",
      "resolution": "1672 × 941"
    },
    "styling": {
      "dominantColor": "#111B2A",
      "paletteHex": "#111B2A",
      "palette": [
        "#111B2A",
        "#344153",
        "#111B2A"
      ],
      "tags": [
        "minimal",
        "4k",
        "editorial",
        "clean"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/dewlit-white-flower-in-misty-forest.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 572,
        "y": 0,
        "width": 529,
        "height": 941
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/dewlit-white-flower-in-misty-forest.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/dewlit-white-flower-in-misty-forest.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/dewlit-white-flower-in-misty-forest.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/dewlit-white-flower-in-misty-forest.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14T19:27:16.922Z",
      "createdAt": 1792006036922
    }
  },
  {
    "id": "wp_1792013815747",
    "slug": "a-quiet-moon",
    "title": "A Quiet Moon",
    "description": "#minimal #4k #editorial #clean",
    "classification": {
      "category": "Dark Abstract",
      "collection": "Dark Abstract",
      "aspectRatio": "16:9",
      "resolution": "2752 × 1536"
    },
    "styling": {
      "dominantColor": "#b8c0d6",
      "paletteHex": "#b8c0d6",
      "palette": [
        "#b8c0d6",
        "#344153",
        "#b8c0d6"
      ],
      "tags": [
        "minimal",
        "4k",
        "editorial",
        "clean"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/a-quiet-moon.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 944,
        "y": 0,
        "width": 864,
        "height": 1536
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/a-quiet-moon.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/a-quiet-moon.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/a-quiet-moon.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/a-quiet-moon.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14T21:36:59.218Z",
      "createdAt": 1792013819218
    }
  },
  {
    "id": "wp_1792013847388",
    "slug": "eclipse-oled",
    "title": "Eclipse — OLED",
    "description": "#minimal #4k #editorial #clean #oled",
    "classification": {
      "category": "Dark Abstract",
      "collection": "Dark Abstract",
      "aspectRatio": "16:9",
      "resolution": "2752 × 1536"
    },
    "styling": {
      "dominantColor": "#111B2A",
      "paletteHex": "#111B2A",
      "palette": [
        "#111B2A",
        "#344153",
        "#111B2A"
      ],
      "tags": [
        "minimal",
        "4k",
        "editorial",
        "clean",
        "oled"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/eclipse-oled.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 944,
        "y": 0,
        "width": 864,
        "height": 1536
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/eclipse-oled.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/eclipse-oled.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/eclipse-oled.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/eclipse-oled.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14T21:37:28.914Z",
      "createdAt": 1792013848914
    }
  },
  {
    "id": "wp_1792013895208",
    "slug": "endless-horizon",
    "title": "Endless Horizon",
    "description": "#minimal #4k #editorial #clean",
    "classification": {
      "category": "Warm Neutral",
      "collection": "Warm Neutral",
      "aspectRatio": "16:9",
      "resolution": "2752 × 1536"
    },
    "styling": {
      "dominantColor": "#eae1d7",
      "paletteHex": "#eae1d7",
      "palette": [
        "#eae1d7",
        "#344153",
        "#eae1d7"
      ],
      "tags": [
        "minimal",
        "4k",
        "editorial",
        "clean"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/endless-horizon.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 944,
        "y": 0,
        "width": 864,
        "height": 1536
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/endless-horizon.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/endless-horizon.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/endless-horizon.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/endless-horizon.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14T21:38:18.508Z",
      "createdAt": 1792013898508
    }
  },
  {
    "id": "wp_1792013981567",
    "slug": "frozen-wave",
    "title": "Frozen Wave",
    "description": "#minimal #4k #editorial #clean",
    "classification": {
      "category": "Cool Abstract",
      "collection": "Cool Abstract",
      "aspectRatio": "16:9",
      "resolution": "2752 × 1536"
    },
    "styling": {
      "dominantColor": "#a7c1d0",
      "paletteHex": "#a7c1d0",
      "palette": [
        "#a7c1d0",
        "#344153",
        "#a7c1d0"
      ],
      "tags": [
        "minimal",
        "4k",
        "editorial",
        "clean"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/frozen-wave.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 944,
        "y": 0,
        "width": 864,
        "height": 1536
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/frozen-wave.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/frozen-wave.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/frozen-wave.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/frozen-wave.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14T21:39:44.499Z",
      "createdAt": 1792013984499
    }
  },
  {
    "id": "wp_1792014041396",
    "slug": "golden-afterglow-oled",
    "title": "Golden Afterglow — OLED",
    "description": "#minimal #4k #editorial #clean",
    "classification": {
      "category": "Dark Abstract",
      "collection": "Dark Abstract",
      "aspectRatio": "16:9",
      "resolution": "3840 × 2160"
    },
    "styling": {
      "dominantColor": "#232324",
      "paletteHex": "#232324",
      "palette": [
        "#232324",
        "#344153",
        "#232324"
      ],
      "tags": [
        "minimal",
        "4k",
        "editorial",
        "clean"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/golden-afterglow-oled.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 944,
        "y": 0,
        "width": 864,
        "height": 1536
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/golden-afterglow-oled.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/golden-afterglow-oled.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/golden-afterglow-oled.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/golden-afterglow-oled.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14T21:40:44.247Z",
      "createdAt": 1792014044247
    }
  },
  {
    "id": "wp_1792014065725",
    "slug": "golden-lotus-oled",
    "title": "Golden Lotus — OLED",
    "description": "#minimal #4k #editorial #clean",
    "classification": {
      "category": "Dark Abstract",
      "collection": "Dark Abstract",
      "aspectRatio": "16:9",
      "resolution": "2752 × 1536"
    },
    "styling": {
      "dominantColor": "#111B2A",
      "paletteHex": "#111B2A",
      "palette": [
        "#111B2A",
        "#344153",
        "#111B2A"
      ],
      "tags": [
        "minimal",
        "4k",
        "editorial",
        "clean"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/golden-lotus-oled.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 944,
        "y": 0,
        "width": 864,
        "height": 1536
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/golden-lotus-oled.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/golden-lotus-oled.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/golden-lotus-oled.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/golden-lotus-oled.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14T21:41:07.895Z",
      "createdAt": 1792014067895
    }
  },
  {
    "id": "wp_1792014139024",
    "slug": "liquid-silk",
    "title": "Liquid Silk",
    "description": "#minimal #4k #editorial #clean",
    "classification": {
      "category": "Dark Abstract",
      "collection": "Dark Abstract",
      "aspectRatio": "16:9",
      "resolution": "2752 × 1536"
    },
    "styling": {
      "dominantColor": "#111B2A",
      "paletteHex": "#111B2A",
      "palette": [
        "#111B2A",
        "#344153",
        "#111B2A"
      ],
      "tags": [
        "minimal",
        "4k",
        "editorial",
        "clean"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/liquid-silk.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 944,
        "y": 0,
        "width": 864,
        "height": 1536
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/liquid-silk.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/liquid-silk.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/liquid-silk.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/liquid-silk.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14T21:42:21.390Z",
      "createdAt": 1792014141390
    }
  },
  {
    "id": "wp_1792014179856",
    "slug": "liquid-silk-copy",
    "title": "Liquid Silk Copy",
    "description": "#minimal #4k #editorial #clean",
    "classification": {
      "category": "Dark Abstract",
      "collection": "Dark Abstract",
      "aspectRatio": "16:9",
      "resolution": "1536 × 2752"
    },
    "styling": {
      "dominantColor": "#111B2A",
      "paletteHex": "#111B2A",
      "palette": [
        "#111B2A",
        "#344153",
        "#111B2A"
      ],
      "tags": [
        "minimal",
        "4k",
        "editorial",
        "clean"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/liquid-silk-copy.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 0,
        "y": 0,
        "width": 1206,
        "height": 2160
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/liquid-silk-copy.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/liquid-silk-copy.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/liquid-silk-copy.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/liquid-silk-copy.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14T21:43:03.230Z",
      "createdAt": 1792014183230
    }
  },
  {
    "id": "wp_1792014238571",
    "slug": "midnight-blossom-oled",
    "title": "Midnight Blossom — OLED",
    "description": "#minimal #4k #editorial #clean",
    "classification": {
      "category": "Dark Abstract",
      "collection": "Dark Abstract",
      "aspectRatio": "16:9",
      "resolution": "2752 × 1536"
    },
    "styling": {
      "dominantColor": "#111B2A",
      "paletteHex": "#111B2A",
      "palette": [
        "#111B2A",
        "#344153",
        "#111B2A"
      ],
      "tags": [
        "minimal",
        "4k",
        "editorial",
        "clean"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true
    },
    "storage": {
      "r2Key": "wallpapers/midnight-blossom-oled.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 944,
        "y": 0,
        "width": 864,
        "height": 1536
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/midnight-blossom-oled.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/midnight-blossom-oled.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/midnight-blossom-oled.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/thumbnails/midnight-blossom-oled.webp"
    },
    "metadata": {
      "publishedAt": "2026-10-14T21:44:01.062Z",
      "createdAt": 1792014241062
    }
  },
  {
    "id": "wp_1795379412592_1",
    "slug": "a-quiet-road-corner",
    "title": "A Quiet Road Corner",
    "description": "Curated nature vertical wallpaper crafted for mobile lockscreens.",
    "classification": {
      "category": "Nature Vertical",
      "collection": "Mobile Lockscreen Edition",
      "aspectRatio": "9:16",
      "resolution": "1536 × 2730"
    },
    "styling": {
      "dominantColor": "#4830F0",
      "paletteHex": "#3018F0",
      "palette": [
        "#4830F0",
        "#3018F0",
        "#F04830",
        "#F06048"
      ],
      "tags": [
        "mobile",
        "lockscreen",
        "phone",
        "nature-vertical",
        "quiet",
        "road",
        "corner"
      ]
    },
    "flags": {
      "isFeatured": true,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true,
      "bio": "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens."
    },
    "storage": {
      "r2Key": "wallpapers/phone/a-quiet-road-corner.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 0,
        "y": 0,
        "width": 1536,
        "height": 2730
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/a-quiet-road-corner.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/a-quiet-road-corner.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/phone/a-quiet-road-corner.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/a-quiet-road-corner.webp"
    },
    "metadata": {
      "publishedAt": "2026-11-22T20:04:14.501Z",
      "createdAt": 1795377854501
    }
  },
  {
    "id": "wp_1795379414913_2",
    "slug": "abundand-boat",
    "title": "Abundand Boat",
    "description": "Curated lockscreen wallpaper crafted for mobile lockscreens.",
    "classification": {
      "category": "Lockscreen",
      "collection": "Mobile Lockscreen Edition",
      "aspectRatio": "9:16",
      "resolution": "1536 × 2730"
    },
    "styling": {
      "dominantColor": "#F0D8D8",
      "paletteHex": "#D8D8F0",
      "palette": [
        "#F0D8D8",
        "#D8D8F0",
        "#D8D8D8",
        "#D8F0D8"
      ],
      "tags": [
        "mobile",
        "lockscreen",
        "phone",
        "lockscreen",
        "abundand",
        "boat"
      ]
    },
    "flags": {
      "isFeatured": true,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true,
      "bio": "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens."
    },
    "storage": {
      "r2Key": "wallpapers/phone/abundand-boat.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 0,
        "y": 0,
        "width": 1536,
        "height": 2730
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/abundand-boat.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/abundand-boat.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/phone/abundand-boat.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/abundand-boat.webp"
    },
    "metadata": {
      "publishedAt": "2026-11-22T20:05:16.456Z",
      "createdAt": 1795377916456
    }
  },
  {
    "id": "wp_1795379416560_3",
    "slug": "aesthatic-japan-train",
    "title": "Aesthatic Japan Train",
    "description": "Curated anime vertical wallpaper crafted for mobile lockscreens.",
    "classification": {
      "category": "Anime Vertical",
      "collection": "Mobile Lockscreen Edition",
      "aspectRatio": "9:16",
      "resolution": "1536 × 2730"
    },
    "styling": {
      "dominantColor": "#F06060",
      "paletteHex": "#F04848",
      "palette": [
        "#F06060",
        "#F04848",
        "#4848F0",
        "#F07878"
      ],
      "tags": [
        "mobile",
        "lockscreen",
        "phone",
        "anime-vertical",
        "aesthatic",
        "japan",
        "train"
      ]
    },
    "flags": {
      "isFeatured": true,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true,
      "bio": "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens."
    },
    "storage": {
      "r2Key": "wallpapers/phone/aesthatic-japan-train.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 0,
        "y": 0,
        "width": 1536,
        "height": 2730
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/aesthatic-japan-train.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/aesthatic-japan-train.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/phone/aesthatic-japan-train.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/aesthatic-japan-train.webp"
    },
    "metadata": {
      "publishedAt": "2026-11-22T20:06:18.328Z",
      "createdAt": 1795377978328
    }
  },
  {
    "id": "wp_1795379418412_4",
    "slug": "alpenglow-under-a-crescent-moon",
    "title": "Alpenglow Under a Crescent Moon",
    "description": "Curated nature vertical wallpaper crafted for mobile lockscreens.",
    "classification": {
      "category": "Nature Vertical",
      "collection": "Mobile Lockscreen Edition",
      "aspectRatio": "9:16",
      "resolution": "941 × 1672"
    },
    "styling": {
      "dominantColor": "#181830",
      "paletteHex": "#303048",
      "palette": [
        "#181830",
        "#303048",
        "#183030",
        "#183048"
      ],
      "tags": [
        "mobile",
        "lockscreen",
        "phone",
        "nature-vertical",
        "alpenglow",
        "under",
        "crescent",
        "moon"
      ]
    },
    "flags": {
      "isFeatured": true,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true,
      "bio": "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens."
    },
    "storage": {
      "r2Key": "wallpapers/phone/alpenglow-under-a-crescent-moon.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 0,
        "y": 0,
        "width": 941,
        "height": 1672
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/alpenglow-under-a-crescent-moon.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/alpenglow-under-a-crescent-moon.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/phone/alpenglow-under-a-crescent-moon.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/alpenglow-under-a-crescent-moon.webp"
    },
    "metadata": {
      "publishedAt": "2026-11-22T20:07:19.775Z",
      "createdAt": 1795378039775
    }
  },
  {
    "id": "wp_1795379419844_5",
    "slug": "antigravity-sphere",
    "title": "Antigravity Sphere",
    "description": "Curated lockscreen wallpaper crafted for mobile lockscreens.",
    "classification": {
      "category": "Lockscreen",
      "collection": "Mobile Lockscreen Edition",
      "aspectRatio": "9:16",
      "resolution": "1536 × 2730"
    },
    "styling": {
      "dominantColor": "#18F048",
      "paletteHex": "#1818F0",
      "palette": [
        "#18F048",
        "#1818F0",
        "#3018F0",
        "#F04830"
      ],
      "tags": [
        "mobile",
        "lockscreen",
        "phone",
        "lockscreen",
        "antigravity",
        "sphere"
      ]
    },
    "flags": {
      "isFeatured": true,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true,
      "bio": "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens."
    },
    "storage": {
      "r2Key": "wallpapers/phone/antigravity-sphere.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 0,
        "y": 0,
        "width": 1536,
        "height": 2730
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/antigravity-sphere.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/antigravity-sphere.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/phone/antigravity-sphere.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/antigravity-sphere.webp"
    },
    "metadata": {
      "publishedAt": "2026-11-22T20:08:21.414Z",
      "createdAt": 1795378101414
    }
  },
  {
    "id": "wp_1795379421516_6",
    "slug": "autumn-rowboat-on-reflective-waters",
    "title": "Autumn Rowboat on Reflective Waters",
    "description": "Curated lockscreen wallpaper crafted for mobile lockscreens.",
    "classification": {
      "category": "Lockscreen",
      "collection": "Mobile Lockscreen Edition",
      "aspectRatio": "9:16",
      "resolution": "941 × 1672"
    },
    "styling": {
      "dominantColor": "#001818",
      "paletteHex": "#183030",
      "palette": [
        "#001818",
        "#183030",
        "#003018",
        "#003030"
      ],
      "tags": [
        "mobile",
        "lockscreen",
        "phone",
        "lockscreen",
        "autumn",
        "rowboat",
        "reflective",
        "waters"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true,
      "bio": "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens."
    },
    "storage": {
      "r2Key": "wallpapers/phone/autumn-rowboat-on-reflective-waters.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 0,
        "y": 0,
        "width": 941,
        "height": 1672
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/autumn-rowboat-on-reflective-waters.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/autumn-rowboat-on-reflective-waters.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/phone/autumn-rowboat-on-reflective-waters.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/autumn-rowboat-on-reflective-waters.webp"
    },
    "metadata": {
      "publishedAt": "2026-11-22T20:09:22.908Z",
      "createdAt": 1795378162908
    }
  },
  {
    "id": "wp_1795379422953_7",
    "slug": "bird-on-a-bloom-oled",
    "title": "Bird on a Bloom OLED",
    "description": "Curated amoled mobile wallpaper crafted for mobile lockscreens.",
    "classification": {
      "category": "AMOLED Mobile",
      "collection": "Mobile Lockscreen Edition",
      "aspectRatio": "9:16",
      "resolution": "1536 × 2730"
    },
    "styling": {
      "dominantColor": "#0000F0",
      "paletteHex": "#000000",
      "palette": [
        "#0000F0",
        "#000000",
        "#F00000",
        "#00F000"
      ],
      "tags": [
        "mobile",
        "lockscreen",
        "phone",
        "amoled-mobile",
        "bird",
        "bloom",
        "oled"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true,
      "bio": "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens."
    },
    "storage": {
      "r2Key": "wallpapers/phone/bird-on-a-bloom-oled.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 0,
        "y": 0,
        "width": 1536,
        "height": 2730
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/bird-on-a-bloom-oled.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/bird-on-a-bloom-oled.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/phone/bird-on-a-bloom-oled.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/bird-on-a-bloom-oled.webp"
    },
    "metadata": {
      "publishedAt": "2026-11-22T20:10:24.189Z",
      "createdAt": 1795378224189
    }
  },
  {
    "id": "wp_1795379424239_8",
    "slug": "crimson-koi-fish",
    "title": "Crimson Koi Fish",
    "description": "Curated anime vertical wallpaper crafted for mobile lockscreens.",
    "classification": {
      "category": "Anime Vertical",
      "collection": "Mobile Lockscreen Edition",
      "aspectRatio": "9:16",
      "resolution": "1536 × 2730"
    },
    "styling": {
      "dominantColor": "#1818F0",
      "paletteHex": "#F01818",
      "palette": [
        "#1818F0",
        "#F01818",
        "#181818",
        "#3030F0"
      ],
      "tags": [
        "mobile",
        "lockscreen",
        "phone",
        "anime-vertical",
        "crimson",
        "koi",
        "fish"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true,
      "bio": "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens."
    },
    "storage": {
      "r2Key": "wallpapers/phone/crimson-koi-fish.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 0,
        "y": 0,
        "width": 1536,
        "height": 2730
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/crimson-koi-fish.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/crimson-koi-fish.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/phone/crimson-koi-fish.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/crimson-koi-fish.webp"
    },
    "metadata": {
      "publishedAt": "2026-11-22T20:11:26.493Z",
      "createdAt": 1795378286493
    }
  },
  {
    "id": "wp_1795379426583_9",
    "slug": "dreamy-grass",
    "title": "Dreamy Grass",
    "description": "Curated lockscreen wallpaper crafted for mobile lockscreens.",
    "classification": {
      "category": "Lockscreen",
      "collection": "Mobile Lockscreen Edition",
      "aspectRatio": "9:16",
      "resolution": "1536 × 2730"
    },
    "styling": {
      "dominantColor": "#9090F0",
      "paletteHex": "#A890F0",
      "palette": [
        "#9090F0",
        "#A890F0",
        "#F0A890",
        "#90F0C0"
      ],
      "tags": [
        "mobile",
        "lockscreen",
        "phone",
        "lockscreen",
        "dreamy",
        "grass"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true,
      "bio": "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens."
    },
    "storage": {
      "r2Key": "wallpapers/phone/dreamy-grass.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 0,
        "y": 0,
        "width": 1536,
        "height": 2730
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/dreamy-grass.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/dreamy-grass.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/phone/dreamy-grass.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/dreamy-grass.webp"
    },
    "metadata": {
      "publishedAt": "2026-11-22T20:12:28.439Z",
      "createdAt": 1795378348439
    }
  },
  {
    "id": "wp_1795379428493_10",
    "slug": "dreemy-valley",
    "title": "Dreemy Valley",
    "description": "Curated nature vertical wallpaper crafted for mobile lockscreens.",
    "classification": {
      "category": "Nature Vertical",
      "collection": "Mobile Lockscreen Edition",
      "aspectRatio": "9:16",
      "resolution": "1536 × 2730"
    },
    "styling": {
      "dominantColor": "#F07878",
      "paletteHex": "#F06060",
      "palette": [
        "#F07878",
        "#F06060",
        "#F09090",
        "#F04848"
      ],
      "tags": [
        "mobile",
        "lockscreen",
        "phone",
        "nature-vertical",
        "dreemy",
        "valley"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true,
      "bio": "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens."
    },
    "storage": {
      "r2Key": "wallpapers/phone/dreemy-valley.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 0,
        "y": 0,
        "width": 1536,
        "height": 2730
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/dreemy-valley.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/dreemy-valley.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/phone/dreemy-valley.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/dreemy-valley.webp"
    },
    "metadata": {
      "publishedAt": "2026-11-22T20:13:30.274Z",
      "createdAt": 1795378410274
    }
  },
  {
    "id": "wp_1795379430388_11",
    "slug": "fluffy-persian-cat-in-warm-sunlight",
    "title": "Fluffy Persian Cat in Warm Sunlight",
    "description": "Curated aesthetic portrait wallpaper crafted for mobile lockscreens.",
    "classification": {
      "category": "Aesthetic Portrait",
      "collection": "Mobile Lockscreen Edition",
      "aspectRatio": "9:16",
      "resolution": "941 × 1671"
    },
    "styling": {
      "dominantColor": "#C0A890",
      "paletteHex": "#D8C0A8",
      "palette": [
        "#C0A890",
        "#D8C0A8",
        "#D8D8C0",
        "#F0D8C0"
      ],
      "tags": [
        "mobile",
        "lockscreen",
        "phone",
        "aesthetic-portrait",
        "fluffy",
        "persian",
        "cat",
        "warm",
        "sunlight"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true,
      "bio": "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens."
    },
    "storage": {
      "r2Key": "wallpapers/phone/fluffy-persian-cat-in-warm-sunlight.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 0,
        "y": 0,
        "width": 941,
        "height": 1671
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/fluffy-persian-cat-in-warm-sunlight.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/fluffy-persian-cat-in-warm-sunlight.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/phone/fluffy-persian-cat-in-warm-sunlight.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/fluffy-persian-cat-in-warm-sunlight.webp"
    },
    "metadata": {
      "publishedAt": "2026-11-22T20:14:31.964Z",
      "createdAt": 1795378471964
    }
  },
  {
    "id": "wp_1795379432021_12",
    "slug": "minimal-green-botanical-circle",
    "title": "Minimal Green Botanical Circle",
    "description": "Curated nature vertical wallpaper crafted for mobile lockscreens.",
    "classification": {
      "category": "Nature Vertical",
      "collection": "Mobile Lockscreen Edition",
      "aspectRatio": "9:16",
      "resolution": "941 × 1672"
    },
    "styling": {
      "dominantColor": "#F0D8C0",
      "paletteHex": "#F0D8D8",
      "palette": [
        "#F0D8C0",
        "#F0D8D8",
        "#304830",
        "#484830"
      ],
      "tags": [
        "mobile",
        "lockscreen",
        "phone",
        "nature-vertical",
        "minimal",
        "green",
        "botanical",
        "circle"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true,
      "bio": "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens."
    },
    "storage": {
      "r2Key": "wallpapers/phone/minimal-green-botanical-circle.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 0,
        "y": 0,
        "width": 941,
        "height": 1672
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/minimal-green-botanical-circle.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/minimal-green-botanical-circle.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/phone/minimal-green-botanical-circle.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/minimal-green-botanical-circle.webp"
    },
    "metadata": {
      "publishedAt": "2026-11-22T20:15:33.353Z",
      "createdAt": 1795378533353
    }
  },
  {
    "id": "wp_1795379433443_13",
    "slug": "minimalist-white-india-map-outline",
    "title": "Minimalist White India Map Outline",
    "description": "Curated minimal mobile wallpaper crafted for mobile lockscreens.",
    "classification": {
      "category": "Minimal Mobile",
      "collection": "Mobile Lockscreen Edition",
      "aspectRatio": "9:16",
      "resolution": "941 × 1672"
    },
    "styling": {
      "dominantColor": "#000000",
      "paletteHex": "#606060",
      "palette": [
        "#000000",
        "#606060",
        "#181818",
        "#303030"
      ],
      "tags": [
        "mobile",
        "lockscreen",
        "phone",
        "minimal-mobile",
        "minimalist",
        "white",
        "india",
        "map",
        "outline"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true,
      "bio": "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens."
    },
    "storage": {
      "r2Key": "wallpapers/phone/minimalist-white-india-map-outline.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 0,
        "y": 0,
        "width": 941,
        "height": 1672
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/minimalist-white-india-map-outline.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/minimalist-white-india-map-outline.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/phone/minimalist-white-india-map-outline.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/minimalist-white-india-map-outline.webp"
    },
    "metadata": {
      "publishedAt": "2026-11-22T20:16:34.571Z",
      "createdAt": 1795378594571
    }
  },
  {
    "id": "wp_1795379434615_14",
    "slug": "moon-in-day",
    "title": "Moon in Day",
    "description": "Curated lockscreen wallpaper crafted for mobile lockscreens.",
    "classification": {
      "category": "Lockscreen",
      "collection": "Mobile Lockscreen Edition",
      "aspectRatio": "9:16",
      "resolution": "1536 × 2730"
    },
    "styling": {
      "dominantColor": "#90F0D8",
      "paletteHex": "#F0D8A8",
      "palette": [
        "#90F0D8",
        "#F0D8A8",
        "#F0C090",
        "#F0F0C0"
      ],
      "tags": [
        "mobile",
        "lockscreen",
        "phone",
        "lockscreen",
        "moon",
        "day"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true,
      "bio": "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens."
    },
    "storage": {
      "r2Key": "wallpapers/phone/moon-in-day.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 0,
        "y": 0,
        "width": 1536,
        "height": 2730
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/moon-in-day.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/moon-in-day.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/phone/moon-in-day.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/moon-in-day.webp"
    },
    "metadata": {
      "publishedAt": "2026-11-22T20:17:36.353Z",
      "createdAt": 1795378656353
    }
  },
  {
    "id": "wp_1795379436412_15",
    "slug": "moonlit-autumn-teahouse-with-sleeping-cat",
    "title": "Moonlit Autumn Teahouse with Sleeping Cat",
    "description": "Curated amoled mobile wallpaper crafted for mobile lockscreens.",
    "classification": {
      "category": "AMOLED Mobile",
      "collection": "Mobile Lockscreen Edition",
      "aspectRatio": "9:16",
      "resolution": "941 × 1670"
    },
    "styling": {
      "dominantColor": "#D8C090",
      "paletteHex": "#F0C090",
      "palette": [
        "#D8C090",
        "#F0C090",
        "#D8A890",
        "#D8A878"
      ],
      "tags": [
        "mobile",
        "lockscreen",
        "phone",
        "amoled-mobile",
        "moonlit",
        "autumn",
        "teahouse",
        "with",
        "sleeping",
        "cat"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true,
      "bio": "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens."
    },
    "storage": {
      "r2Key": "wallpapers/phone/moonlit-autumn-teahouse-with-sleeping-cat.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 0,
        "y": 0,
        "width": 941,
        "height": 1670
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/moonlit-autumn-teahouse-with-sleeping-cat.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/moonlit-autumn-teahouse-with-sleeping-cat.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/phone/moonlit-autumn-teahouse-with-sleeping-cat.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/moonlit-autumn-teahouse-with-sleeping-cat.webp"
    },
    "metadata": {
      "publishedAt": "2026-11-22T20:18:38.073Z",
      "createdAt": 1795378718073
    }
  },
  {
    "id": "wp_1795379438154_16",
    "slug": "moonlit-blossoms-over-twilight-clouds-1",
    "title": "Moonlit Blossoms Over Twilight Clouds (1)",
    "description": "Curated amoled mobile wallpaper crafted for mobile lockscreens.",
    "classification": {
      "category": "AMOLED Mobile",
      "collection": "Mobile Lockscreen Edition",
      "aspectRatio": "9:16",
      "resolution": "941 × 1672"
    },
    "styling": {
      "dominantColor": "#303048",
      "paletteHex": "#181830",
      "palette": [
        "#303048",
        "#181830",
        "#183030",
        "#484848"
      ],
      "tags": [
        "mobile",
        "lockscreen",
        "phone",
        "amoled-mobile",
        "moonlit",
        "blossoms",
        "over",
        "twilight",
        "clouds",
        "(1)"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true,
      "bio": "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens."
    },
    "storage": {
      "r2Key": "wallpapers/phone/moonlit-blossoms-over-twilight-clouds-1.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 0,
        "y": 0,
        "width": 941,
        "height": 1672
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/moonlit-blossoms-over-twilight-clouds-1.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/moonlit-blossoms-over-twilight-clouds-1.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/phone/moonlit-blossoms-over-twilight-clouds-1.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/moonlit-blossoms-over-twilight-clouds-1.webp"
    },
    "metadata": {
      "publishedAt": "2026-11-22T20:19:39.609Z",
      "createdAt": 1795378779609
    }
  },
  {
    "id": "wp_1795379439751_17",
    "slug": "moonlit-crane-beneath-blossoms",
    "title": "Moonlit Crane Beneath Blossoms",
    "description": "Curated amoled mobile wallpaper crafted for mobile lockscreens.",
    "classification": {
      "category": "AMOLED Mobile",
      "collection": "Mobile Lockscreen Edition",
      "aspectRatio": "9:16",
      "resolution": "941 × 1671"
    },
    "styling": {
      "dominantColor": "#D8C090",
      "paletteHex": "#D8C0A8",
      "palette": [
        "#D8C090",
        "#D8C0A8",
        "#A89078",
        "#C0A890"
      ],
      "tags": [
        "mobile",
        "lockscreen",
        "phone",
        "amoled-mobile",
        "moonlit",
        "crane",
        "beneath",
        "blossoms"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true,
      "bio": "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens."
    },
    "storage": {
      "r2Key": "wallpapers/phone/moonlit-crane-beneath-blossoms.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 0,
        "y": 0,
        "width": 941,
        "height": 1671
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/moonlit-crane-beneath-blossoms.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/moonlit-crane-beneath-blossoms.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/phone/moonlit-crane-beneath-blossoms.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/moonlit-crane-beneath-blossoms.webp"
    },
    "metadata": {
      "publishedAt": "2026-11-22T20:20:41.280Z",
      "createdAt": 1795378841280
    }
  },
  {
    "id": "wp_1795379441349_18",
    "slug": "moonlit-lake-with-lantern-and-sleeping-dog",
    "title": "Moonlit Lake with Lantern and Sleeping Dog",
    "description": "Curated amoled mobile wallpaper crafted for mobile lockscreens.",
    "classification": {
      "category": "AMOLED Mobile",
      "collection": "Mobile Lockscreen Edition",
      "aspectRatio": "9:16",
      "resolution": "941 × 1672"
    },
    "styling": {
      "dominantColor": "#304848",
      "paletteHex": "#303048",
      "palette": [
        "#304848",
        "#303048",
        "#484860",
        "#304860"
      ],
      "tags": [
        "mobile",
        "lockscreen",
        "phone",
        "amoled-mobile",
        "moonlit",
        "lake",
        "with",
        "lantern",
        "and",
        "sleeping",
        "dog"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true,
      "bio": "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens."
    },
    "storage": {
      "r2Key": "wallpapers/phone/moonlit-lake-with-lantern-and-sleeping-dog.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 0,
        "y": 0,
        "width": 941,
        "height": 1672
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/moonlit-lake-with-lantern-and-sleeping-dog.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/moonlit-lake-with-lantern-and-sleeping-dog.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/phone/moonlit-lake-with-lantern-and-sleeping-dog.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/moonlit-lake-with-lantern-and-sleeping-dog.webp"
    },
    "metadata": {
      "publishedAt": "2026-11-22T20:21:42.783Z",
      "createdAt": 1795378902783
    }
  },
  {
    "id": "wp_1795379442875_19",
    "slug": "moonlit-radha-and-krishna-beneath-blossoms",
    "title": "Moonlit Radha and Krishna Beneath Blossoms",
    "description": "Curated amoled mobile wallpaper crafted for mobile lockscreens.",
    "classification": {
      "category": "AMOLED Mobile",
      "collection": "Mobile Lockscreen Edition",
      "aspectRatio": "9:16",
      "resolution": "941 × 1672"
    },
    "styling": {
      "dominantColor": "#181818",
      "paletteHex": "#303030",
      "palette": [
        "#181818",
        "#303030",
        "#000000",
        "#484848"
      ],
      "tags": [
        "mobile",
        "lockscreen",
        "phone",
        "amoled-mobile",
        "moonlit",
        "radha",
        "and",
        "krishna",
        "beneath",
        "blossoms"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true,
      "bio": "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens."
    },
    "storage": {
      "r2Key": "wallpapers/phone/moonlit-radha-and-krishna-beneath-blossoms.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 0,
        "y": 0,
        "width": 941,
        "height": 1672
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/moonlit-radha-and-krishna-beneath-blossoms.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/moonlit-radha-and-krishna-beneath-blossoms.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/phone/moonlit-radha-and-krishna-beneath-blossoms.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/moonlit-radha-and-krishna-beneath-blossoms.webp"
    },
    "metadata": {
      "publishedAt": "2026-11-22T20:22:44.354Z",
      "createdAt": 1795378964354
    }
  },
  {
    "id": "wp_1795379444424_20",
    "slug": "moonlit-white-lily-on-stone",
    "title": "Moonlit White Lily on Stone",
    "description": "Curated amoled mobile wallpaper crafted for mobile lockscreens.",
    "classification": {
      "category": "AMOLED Mobile",
      "collection": "Mobile Lockscreen Edition",
      "aspectRatio": "9:16",
      "resolution": "941 × 1672"
    },
    "styling": {
      "dominantColor": "#001818",
      "paletteHex": "#181818",
      "palette": [
        "#001818",
        "#181818",
        "#000018",
        "#303018"
      ],
      "tags": [
        "mobile",
        "lockscreen",
        "phone",
        "amoled-mobile",
        "moonlit",
        "white",
        "lily",
        "stone"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true,
      "bio": "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens."
    },
    "storage": {
      "r2Key": "wallpapers/phone/moonlit-white-lily-on-stone.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 0,
        "y": 0,
        "width": 941,
        "height": 1672
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/moonlit-white-lily-on-stone.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/moonlit-white-lily-on-stone.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/phone/moonlit-white-lily-on-stone.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/moonlit-white-lily-on-stone.webp"
    },
    "metadata": {
      "publishedAt": "2026-11-22T20:23:45.963Z",
      "createdAt": 1795379025963
    }
  },
  {
    "id": "wp_1795379446059_21",
    "slug": "sunlit-persian-cat-portrait",
    "title": "Sunlit Persian Cat Portrait",
    "description": "Curated aesthetic portrait wallpaper crafted for mobile lockscreens.",
    "classification": {
      "category": "Aesthetic Portrait",
      "collection": "Mobile Lockscreen Edition",
      "aspectRatio": "9:16",
      "resolution": "941 × 1672"
    },
    "styling": {
      "dominantColor": "#D8D8C0",
      "paletteHex": "#A8A890",
      "palette": [
        "#D8D8C0",
        "#A8A890",
        "#D8C0C0",
        "#C0A8A8"
      ],
      "tags": [
        "mobile",
        "lockscreen",
        "phone",
        "aesthetic-portrait",
        "sunlit",
        "persian",
        "cat",
        "portrait"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true,
      "bio": "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens."
    },
    "storage": {
      "r2Key": "wallpapers/phone/sunlit-persian-cat-portrait.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 0,
        "y": 0,
        "width": 941,
        "height": 1672
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/sunlit-persian-cat-portrait.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/sunlit-persian-cat-portrait.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/phone/sunlit-persian-cat-portrait.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/sunlit-persian-cat-portrait.webp"
    },
    "metadata": {
      "publishedAt": "2026-11-22T20:24:47.740Z",
      "createdAt": 1795379087740
    }
  },
  {
    "id": "wp_1795379447800_22",
    "slug": "sunrise-valley-it-can-t-always-be-night",
    "title": "Sunrise Valley It Can’t Always Be Night",
    "description": "Curated amoled mobile wallpaper crafted for mobile lockscreens.",
    "classification": {
      "category": "AMOLED Mobile",
      "collection": "Mobile Lockscreen Edition",
      "aspectRatio": "9:16",
      "resolution": "941 × 1671"
    },
    "styling": {
      "dominantColor": "#303030",
      "paletteHex": "#304860",
      "palette": [
        "#303030",
        "#304860",
        "#484848",
        "#486060"
      ],
      "tags": [
        "mobile",
        "lockscreen",
        "phone",
        "amoled-mobile",
        "sunrise",
        "valley",
        "can’t",
        "always",
        "night"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true,
      "bio": "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens."
    },
    "storage": {
      "r2Key": "wallpapers/phone/sunrise-valley-it-can-t-always-be-night.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 0,
        "y": 0,
        "width": 941,
        "height": 1671
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/sunrise-valley-it-can-t-always-be-night.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/sunrise-valley-it-can-t-always-be-night.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/phone/sunrise-valley-it-can-t-always-be-night.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/sunrise-valley-it-can-t-always-be-night.webp"
    },
    "metadata": {
      "publishedAt": "2026-11-22T20:25:49.144Z",
      "createdAt": 1795379149144
    }
  },
  {
    "id": "wp_1795379449234_23",
    "slug": "sunset-bicycle-reading-nook",
    "title": "Sunset Bicycle Reading Nook",
    "description": "Curated nature vertical wallpaper crafted for mobile lockscreens.",
    "classification": {
      "category": "Nature Vertical",
      "collection": "Mobile Lockscreen Edition",
      "aspectRatio": "9:16",
      "resolution": "941 × 1671"
    },
    "styling": {
      "dominantColor": "#C0A8A8",
      "paletteHex": "#D8A8A8",
      "palette": [
        "#C0A8A8",
        "#D8A8A8",
        "#606078",
        "#D89078"
      ],
      "tags": [
        "mobile",
        "lockscreen",
        "phone",
        "nature-vertical",
        "sunset",
        "bicycle",
        "reading",
        "nook"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true,
      "bio": "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens."
    },
    "storage": {
      "r2Key": "wallpapers/phone/sunset-bicycle-reading-nook.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 0,
        "y": 0,
        "width": 941,
        "height": 1671
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/sunset-bicycle-reading-nook.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/sunset-bicycle-reading-nook.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/phone/sunset-bicycle-reading-nook.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/sunset-bicycle-reading-nook.webp"
    },
    "metadata": {
      "publishedAt": "2026-11-22T20:26:50.978Z",
      "createdAt": 1795379210978
    }
  },
  {
    "id": "wp_1795379451068_24",
    "slug": "terracotta-sun-over-layered-hills",
    "title": "Terracotta Sun Over Layered Hills",
    "description": "Curated nature vertical wallpaper crafted for mobile lockscreens.",
    "classification": {
      "category": "Nature Vertical",
      "collection": "Mobile Lockscreen Edition",
      "aspectRatio": "9:16",
      "resolution": "941 × 1671"
    },
    "styling": {
      "dominantColor": "#F0D8C0",
      "paletteHex": "#909078",
      "palette": [
        "#F0D8C0",
        "#909078",
        "#183018",
        "#F0D8D8"
      ],
      "tags": [
        "mobile",
        "lockscreen",
        "phone",
        "nature-vertical",
        "terracotta",
        "sun",
        "over",
        "layered",
        "hills"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true,
      "bio": "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens."
    },
    "storage": {
      "r2Key": "wallpapers/phone/terracotta-sun-over-layered-hills.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 0,
        "y": 0,
        "width": 941,
        "height": 1671
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/terracotta-sun-over-layered-hills.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/terracotta-sun-over-layered-hills.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/phone/terracotta-sun-over-layered-hills.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/terracotta-sun-over-layered-hills.webp"
    },
    "metadata": {
      "publishedAt": "2026-11-22T20:27:52.309Z",
      "createdAt": 1795379272309
    }
  },
  {
    "id": "wp_1795379452398_25",
    "slug": "ukiyo-e-pagoda-beneath-the-red-sun",
    "title": "Ukiyo E Pagoda Beneath the Red Sun",
    "description": "Curated anime vertical wallpaper crafted for mobile lockscreens.",
    "classification": {
      "category": "Anime Vertical",
      "collection": "Mobile Lockscreen Edition",
      "aspectRatio": "9:16",
      "resolution": "941 × 1672"
    },
    "styling": {
      "dominantColor": "#D8C0A8",
      "paletteHex": "#F0D8A8",
      "palette": [
        "#D8C0A8",
        "#F0D8A8",
        "#F0C0A8",
        "#C0A890"
      ],
      "tags": [
        "mobile",
        "lockscreen",
        "phone",
        "anime-vertical",
        "ukiyo",
        "pagoda",
        "beneath",
        "the",
        "red",
        "sun"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true,
      "bio": "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens."
    },
    "storage": {
      "r2Key": "wallpapers/phone/ukiyo-e-pagoda-beneath-the-red-sun.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 0,
        "y": 0,
        "width": 941,
        "height": 1672
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/ukiyo-e-pagoda-beneath-the-red-sun.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/ukiyo-e-pagoda-beneath-the-red-sun.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/phone/ukiyo-e-pagoda-beneath-the-red-sun.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/ukiyo-e-pagoda-beneath-the-red-sun.webp"
    },
    "metadata": {
      "publishedAt": "2026-11-22T20:28:54.273Z",
      "createdAt": 1795379334273
    }
  },
  {
    "id": "wp_1795379454353_26",
    "slug": "whale-in-sky",
    "title": "Whale in Sky",
    "description": "Curated lockscreen wallpaper crafted for mobile lockscreens.",
    "classification": {
      "category": "Lockscreen",
      "collection": "Mobile Lockscreen Edition",
      "aspectRatio": "9:16",
      "resolution": "1536 × 2730"
    },
    "styling": {
      "dominantColor": "#F00018",
      "paletteHex": "#1830F0",
      "palette": [
        "#F00018",
        "#1830F0",
        "#30F000",
        "#001830"
      ],
      "tags": [
        "mobile",
        "lockscreen",
        "phone",
        "lockscreen",
        "whale",
        "sky"
      ]
    },
    "flags": {
      "isFeatured": false,
      "isNew": true,
      "hasPhoneCrop": true,
      "hasDedicatedPhone": true
    },
    "author": {
      "id": "xweet",
      "username": "xweet",
      "displayName": "Vicky",
      "photoURL": "/logo.png",
      "isVerified": true,
      "bio": "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens."
    },
    "storage": {
      "r2Key": "wallpapers/phone/whale-in-sky.webp",
      "format": "webp",
      "phoneCropCoords": {
        "x": 0,
        "y": 0,
        "width": 1536,
        "height": 2730
      }
    },
    "urls": {
      "phone": "https://cdn.xweet.in/wallpapers/phone/whale-in-sky.webp",
      "phoneThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/whale-in-sky.webp",
      "desktop": "https://cdn.xweet.in/wallpapers/phone/whale-in-sky.webp",
      "desktopThumbnail": "https://cdn.xweet.in/wallpapers/phone/thumbnails/whale-in-sky.webp"
    },
    "metadata": {
      "publishedAt": "2026-11-22T20:29:55.823Z",
      "createdAt": 1795379395823
    }
  }
];

/**
 * Ensures wallpaper, phone crop, or thumbnail URLs point to the public Cloudflare R2 CDN.
 * Handles legacy relative paths gracefully.
 */
export function getCdnImageUrl(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("/wallpapers/")) {
    return `https://cdn.xweet.in${url}`;
  }
  return url;
}

/**
 * Calculates responsive CSS object-position for phone preview cards
 * based on saved phoneCropCoords and original master resolution.
 */
export function getPhoneCropStyle(wallpaper?: Wallpaper | null): React.CSSProperties {
  if (!wallpaper) return { objectPosition: "center center" };

  // If a dedicated phone image is provided, it is already framed as a vertical phone asset
  if (wallpaper.urls?.phone && wallpaper.urls.phone !== wallpaper.urls?.desktop) {
    return { objectPosition: "center center" };
  }

  // If the wallpaper itself is portrait/mobile
  if (
    wallpaper.orientation === "mobile" ||
    wallpaper.aspectRatio === "9:16" ||
    wallpaper.aspectRatio === "9:19.5"
  ) {
    return { objectPosition: "center center" };
  }

  const coords = wallpaper.storage?.phoneCropCoords;
  if (!coords || typeof coords.x !== "number" || typeof coords.width !== "number") {
    return { objectPosition: "center center" };
  }

  let naturalWidth = 2752;
  if (wallpaper.resolution) {
    const parts = wallpaper.resolution.split(/[×xX]/);
    const parsedW = parseInt(parts[0]?.trim(), 10);
    if (!isNaN(parsedW) && parsedW > 0) {
      naturalWidth = parsedW;
    }
  }

  const maxOffset = naturalWidth - coords.width;
  if (maxOffset <= 0) return { objectPosition: "center center" };

  const pct = Math.max(0, Math.min(100, (coords.x / maxOffset) * 100));
  return { objectPosition: `${pct.toFixed(2)}% center` };
}

/**
 * Returns the best CDN image URL for mobile lockscreen previews.
 * Prefers the dedicated phone thumbnail or phone master.
 */
export function getPhonePreviewUrl(wallpaper?: Wallpaper | null): string {
  if (!wallpaper) return "";
  return (
    wallpaper.urls?.phoneThumbnail ||
    wallpaper.urls?.phone ||
    wallpaper.phoneThumbnailUrl ||
    wallpaper.phoneImageUrl ||
    getCdnImageUrl(wallpaper.thumbnailUrl || wallpaper.imageUrl)
  );
}

/**
 * Normalizes any raw wallpaper (from Firestore or static fallback)
 * into the clean schema with backwards-compatible getters.
 */
export function normalizeWallpaper(raw: any): Wallpaper {
  if (!raw) return raw;
  const id = raw.id || raw.slug;
  const slug = raw.slug || raw.id;
  const title = raw.title || slug.replace(/-/g, " ");
  const description = raw.description || "";

  const classification = {
    category: raw.classification?.category || raw.category || "Modern Abstract",
    collection: raw.classification?.collection || raw.collection || "Minimal Abstracts",
    aspectRatio: (raw.classification?.aspectRatio || raw.aspectRatio || "16:9") as any,
    resolution: raw.classification?.resolution || raw.resolution || "3840 × 2160",
  };

  const dominantColor = raw.styling?.dominantColor || raw.dominantColor || "#111B2A";
  const paletteHex = raw.styling?.paletteHex || raw.paletteHex || dominantColor;
  const palette = raw.styling?.palette || (Array.isArray(raw.palette) ? raw.palette : [dominantColor]);
  const tags = raw.styling?.tags || (Array.isArray(raw.tags) ? raw.tags : ["minimal", "abstract"]);
  const styling = { dominantColor, paletteHex, palette, tags };

  const isFeatured = Boolean(raw.flags?.isFeatured ?? raw.isFeatured ?? raw.featured);
  const isNew = Boolean(raw.flags?.isNew ?? raw.isNew);
  const hasPhoneCrop = Boolean(raw.flags?.hasPhoneCrop ?? raw.hasPhoneCrop ?? true);
  const flags = { isFeatured, isNew, hasPhoneCrop, hasDedicatedPhone: true };

  const publishedAt = raw.metadata?.publishedAt || raw.publishedAt || new Date().toISOString();
  const createdAt = raw.metadata?.createdAt || raw.createdAt || Date.now();
  const metadata = { publishedAt, createdAt };

  const author = raw.author || {
    id: "xweet",
    username: "xweet",
    displayName: "Vicky",
    photoURL: "/logo.png",
    isVerified: true,
  };

  const isMobile =
    raw.orientation === "mobile" ||
    classification.aspectRatio === "9:16" ||
    classification.aspectRatio === "9:19.5";

  // Clean URLs
  const phoneMasterUrl = raw.urls?.phone || raw.phoneUrl || `https://cdn.xweet.in/wallpapers/phone/${slug}.webp`;
  const phoneThumbUrl = raw.urls?.phoneThumbnail || raw.phoneThumbnailUrl || `https://cdn.xweet.in/wallpapers/phone/thumbnails/${slug}.webp`;
  const desktopMasterUrl = raw.urls?.desktop || (isMobile ? phoneMasterUrl : `https://cdn.xweet.in/wallpapers/${slug}.webp`);
  const desktopThumbUrl = raw.urls?.desktopThumbnail || (isMobile ? phoneThumbUrl : `https://cdn.xweet.in/wallpapers/thumbnails/${slug}.webp`);

  const urls = {
    phone: phoneMasterUrl,
    phoneThumbnail: phoneThumbUrl,
    desktop: desktopMasterUrl,
    desktopThumbnail: desktopThumbUrl,
  };

  const storage = {
    r2Key: raw.storage?.r2Key || (isMobile ? `wallpapers/phone/${slug}.webp` : `wallpapers/${slug}.webp`),
    format: "webp",
    phoneCropCoords: raw.storage?.phoneCropCoords,
  };

  return {
    id,
    slug,
    title,
    description,
    classification,
    styling,
    flags,
    metadata,
    author,
    storage,
    urls,

    // Convenience accessors mapped directly to urls (clean & backwards compatible)
    imageUrl: desktopMasterUrl,
    thumbnailUrl: desktopThumbUrl,
    phoneImageUrl: phoneMasterUrl,
    phoneUrl: phoneMasterUrl,
    phoneThumbnailUrl: phoneThumbUrl,
    category: classification.category,
    collection: classification.collection,
    resolution: classification.resolution,
    aspectRatio: classification.aspectRatio,
    orientation: isMobile ? "mobile" : "desktop",
    dominantColor,
    paletteHex,
    palette,
    tags,
    isFeatured,
    featured: isFeatured,
    isNew,
    hasPhoneCrop,
    publishedAt,
    createdAt,
    views: raw.views || 0,
    downloads: raw.downloads || 0,
    desktopAsset: raw.desktopAsset,
    phoneAsset: raw.phoneAsset,
  };
}

export const WALLPAPERS: Wallpaper[] = RAW_WALLPAPERS.map(normalizeWallpaper);

/**
 * Fisher-Yates array shuffle for wallpapers catalog
 */
export function shuffleWallpapers<T>(items: T[]): T[] {
  const array = [...items];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
