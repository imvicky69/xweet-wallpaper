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
    count: 37,
    tags: ["Minimal", "Abstract", "4K", "Tactile"],
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
  "flower"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14",
      "createdAt": 1791934171013
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
    "monetization": {
      "affiliateMood": "dark-minimal"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14",
      "createdAt": 1791934171099
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
    "monetization": {
      "affiliateMood": "warm-minimal"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14",
      "createdAt": 1791934171231
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
    "monetization": {
      "affiliateMood": "cool-minimal"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14",
      "createdAt": 1791934171350
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
    "monetization": {
      "affiliateMood": "dark-minimal"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14",
      "createdAt": 1791934171431
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
    "monetization": {
      "affiliateMood": "dark-minimal"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14",
      "createdAt": 1791934171519
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
    "monetization": {
      "affiliateMood": "dark-minimal"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14",
      "createdAt": 1791934171647
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
    "monetization": {
      "affiliateMood": "cool-minimal"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14",
      "createdAt": 1791934171734
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
    "monetization": {
      "affiliateMood": "warm-minimal"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14",
      "createdAt": 1791934171828
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
    "monetization": {
      "affiliateMood": "dark-minimal"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14",
      "createdAt": 1791934171927
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
    "monetization": {
      "affiliateMood": "dark-minimal"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14",
      "createdAt": 1791934172003
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
    "monetization": {
      "affiliateMood": "dark-minimal"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14",
      "createdAt": 1791934172079
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
    "monetization": {
      "affiliateMood": "dark-minimal"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14",
      "createdAt": 1791934172152
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
    "monetization": {
      "affiliateMood": "dark-minimal"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14",
      "createdAt": 1791934172226
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
    "monetization": {
      "affiliateMood": "dark-minimal"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14",
      "createdAt": 1791934172302
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
    "monetization": {
      "affiliateMood": "dark-minimal"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14",
      "createdAt": 1791934172366
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
    "monetization": {
      "affiliateMood": "dark-minimal"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14T12:12:38.290Z",
      "createdAt": 1791979958290
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
    "monetization": {
      "affiliateMood": "botanical"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14T16:07:04.273Z",
      "createdAt": 1791994024273
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
    "monetization": {
      "affiliateMood": "botanical"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14T17:43:57.693Z",
      "createdAt": 1791999837693
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
    "monetization": {
      "affiliateMood": "botanical"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14T19:22:04.320Z",
      "createdAt": 1792005724320
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
    "monetization": {
      "affiliateMood": "botanical"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14T19:22:42.713Z",
      "createdAt": 1792005762713
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
    "monetization": {
      "affiliateMood": "botanical"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14T19:23:11.016Z",
      "createdAt": 1792005791016
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
    "monetization": {
      "affiliateMood": "botanical"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14T19:23:42.962Z",
      "createdAt": 1792005822962
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
    "monetization": {
      "affiliateMood": "botanical"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14T19:24:30.298Z",
      "createdAt": 1792005870298
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
    "monetization": {
      "affiliateMood": "botanical"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14T19:24:53.919Z",
      "createdAt": 1792005893919
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
    "monetization": {
      "affiliateMood": "botanical"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14T19:25:18.824Z",
      "createdAt": 1792005918824
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
    "monetization": {
      "affiliateMood": "botanical"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14T19:26:18.390Z",
      "createdAt": 1792005978390
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
    "monetization": {
      "affiliateMood": "botanical"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14T19:27:16.922Z",
      "createdAt": 1792006036922
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
    "monetization": {
      "affiliateMood": "botanical"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14T21:36:59.218Z",
      "createdAt": 1792013819218
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
    "monetization": {
      "affiliateMood": "dark-minimal"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14T21:37:28.914Z",
      "createdAt": 1792013848914
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
    "monetization": {
      "affiliateMood": "dark-minimal"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14T21:38:18.508Z",
      "createdAt": 1792013898508
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
    "monetization": {
      "affiliateMood": "warm-minimal"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14T21:39:44.499Z",
      "createdAt": 1792013984499
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
    "monetization": {
      "affiliateMood": "cool-minimal"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14T21:40:44.247Z",
      "createdAt": 1792014044247
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
    "monetization": {
      "affiliateMood": "dark-minimal"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14T21:41:07.895Z",
      "createdAt": 1792014067895
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
    "monetization": {
      "affiliateMood": "dark-minimal"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14T21:42:21.390Z",
      "createdAt": 1792014141390
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
    "monetization": {
      "affiliateMood": "dark-minimal"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14T21:43:03.230Z",
      "createdAt": 1792014183230
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
    "monetization": {
      "affiliateMood": "dark-minimal"
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
      "hasPhoneCrop": true
    },
    "metadata": {
      "publishedAt": "2026-10-14T21:44:01.062Z",
      "createdAt": 1792014241062
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
    "monetization": {
      "affiliateMood": "dark-minimal"
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
  if (wallpaper.phoneImageUrl && wallpaper.phoneImageUrl !== wallpaper.imageUrl) {
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

  // Parse natural resolution width
  let naturalWidth = 2752;
  if (wallpaper.resolution) {
    const parts = wallpaper.resolution.split(/[×xX]/);
    const parsedW = parseInt(parts[0]?.trim(), 10);
    if (!isNaN(parsedW) && parsedW > 0) {
      naturalWidth = parsedW;
    }
  } else if (wallpaper.aspectRatio === "16:9") {
    naturalWidth = 2752;
  } else if (wallpaper.aspectRatio === "16:10") {
    naturalWidth = 3840;
  }

  const maxOffset = naturalWidth - coords.width;
  if (maxOffset <= 0) {
    return { objectPosition: "center center" };
  }

  const pct = Math.max(0, Math.min(100, (coords.x / maxOffset) * 100));
  return { objectPosition: `${pct.toFixed(2)}% center` };
}

/**
 * Returns the best CDN image URL for mobile lockscreen previews.
 * Falls back to desktop master/thumbnail if dedicated phone asset is not present.
 */
export function getPhonePreviewUrl(wallpaper?: Wallpaper | null): string {
  if (!wallpaper) return "";
  if (wallpaper.phoneImageUrl && wallpaper.phoneImageUrl !== wallpaper.imageUrl) {
    return getCdnImageUrl(wallpaper.phoneImageUrl);
  }
  return getCdnImageUrl(wallpaper.thumbnailUrl || wallpaper.imageUrl);
}


/**
 * Normalizes any raw wallpaper (from Firestore or static fallback)
 * into the new clean schema while retaining convenience accessors.
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
  const styling = {
    dominantColor,
    paletteHex,
    palette,
    tags,
  };

  const isFeatured = Boolean(raw.flags?.isFeatured ?? raw.isFeatured ?? raw.featured);
  const isNew = Boolean(raw.flags?.isNew ?? raw.isNew);
  const hasPhoneCrop = Boolean(raw.flags?.hasPhoneCrop ?? raw.hasPhoneCrop ?? true);
  const flags = {
    isFeatured,
    isNew,
    hasPhoneCrop,
  };

  const publishedAt = raw.metadata?.publishedAt || raw.publishedAt || new Date().toISOString();
  const createdAt = raw.metadata?.createdAt || raw.createdAt || Date.now();
  const metadata = {
    publishedAt,
    createdAt,
  };

  const author = raw.author || {
    id: "xweet",
    username: "xweet",
    displayName: "Vicky",
    photoURL: "/logo.png",
    isVerified: true,
  };

  const r2Key =
    raw.storage?.r2Key ||
    (raw.desktopAsset?.key ? raw.desktopAsset.key : `wallpapers/${slug}.webp`);
  const format = raw.storage?.format || "webp";
  const phoneCropCoords = raw.storage?.phoneCropCoords || {
    x: 944,
    y: 0,
    width: 864,
    height: 1536,
  };
  const storage = {
    r2Key,
    format,
    phoneCropCoords,
  };

  const monetization = raw.monetization || {
    affiliateMood: classification.category.toLowerCase().includes("dark")
      ? "dark-minimal"
      : "warm-minimal",
  };

  const masterCdnUrl = getCdnImageUrl(raw.imageUrl || `https://cdn.xweet.in/${r2Key}`);

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
    monetization,

    // Backward-compatibility properties
    imageUrl: masterCdnUrl,
    thumbnailUrl: getCdnImageUrl(raw.thumbnailUrl) || masterCdnUrl,
    phoneImageUrl: getCdnImageUrl(raw.phoneImageUrl) || masterCdnUrl,
    category: classification.category,
    collection: classification.collection,
    resolution: classification.resolution,
    aspectRatio: classification.aspectRatio,
    orientation:
      raw.orientation ||
      (classification.aspectRatio === "9:16" || classification.aspectRatio === "9:19.5"
        ? "mobile"
        : "desktop"),
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
