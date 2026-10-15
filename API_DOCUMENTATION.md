# Xweet Wallpapers — Public REST API Documentation

The Xweet Wallpapers platform provides a fast, public, and CORS-enabled REST API designed for mobile applications (iOS / Android / Flutter / React Native), desktop lockscreen widgets, browser extensions, and third-party curators.

---

## 1. Overview & Base URLs

- **Production Base URL:** `https://wallpaper.xweet.in`
- **Local Dev Base URL:** `http://localhost:3000`
- **Authentication:** None required (Public Read Access)
- **CORS:** Enabled (`Access-Control-Allow-Origin: *`)
- **Edge Caching:** Default 5-minute cache with 24-hour background stale-while-revalidate. Random requests are uncached.

---

## 2. API Endpoints

### 2.1 List & Filter Wallpapers

Fetch a paginated list of wallpapers with search, category filtering, orientation targeting, or random selection.

```http
GET /api/wallpapers
```

#### Query Parameters

| Parameter | Type | Default | Description |
|---|---|---|---|
| `q` or `search` | `string` | — | Search keyword matching title, description, category, or tags. |
| `category` | `string` | — | Filter by style or collection (e.g. `Dark Abstract`, `Warm Minimal`, `flower`). |
| `orientation` or `type` | `string` | `all` | Target device: `mobile` (phone lockscreens), `desktop` (16:9 / 16:10 masters), or `all`. |
| `featured` | `boolean` | — | When `true`, returns only featured editorial staff picks. |
| `random` | `boolean` | `false` | When `true`, shuffles the results on each request (great for "Wallpaper of the Day" widgets). |
| `sort` | `string` | `newest` | Sort order: `newest`, `oldest`, `title`, or `random`. |
| `limit` or `count` | `number` | `20` | Max items per page (clamped between `1` and `100`). |
| `page` | `number` | `1` | Page offset number (1-indexed). |
| `all` | `boolean` | `false` | When `true`, ignores pagination limits and returns the entire catalog for offline caching. |

---

### 2.2 Single Wallpaper Lookup

Retrieve full metadata for a specific wallpaper by slug or document ID.

```http
GET /api/wallpapers?slug={slug}
GET /api/wallpapers?id={id}
```

Example:
```http
GET https://wallpaper.xweet.in/api/wallpapers?slug=midnight-amber
```

---

### 2.3 Dynamic Image Cropping & Download Stream

Extracts and downloads optimized wallpaper variants on-the-fly directly from the 4K master asset:

```http
GET /api/download/{slug}
```

#### Query Parameters

| Parameter | Values | Default | Description |
|---|---|---|---|
| `type` | `phone-4k`, `desktop-1080p`, `desktop-4k`, `thumbnail` | `desktop-4k` | Output resolution and aspect crop. |
| `format` | `webp`, `png`, `jpg` | `webp` | Target file encoding. |
| `inline` | `true`, `false` | `false` | When `true`, renders directly inside `<img>` without forcing a file download prompt. |

Examples:
- **Phone Lockscreen 4K Crop:** `https://wallpaper.xweet.in/api/download/midnight-amber?type=phone-4k`
- **Desktop 1080p Full HD PNG:** `https://wallpaper.xweet.in/api/download/midnight-amber?type=desktop-1080p&format=png`
- **Inline Phone Preview:** `https://wallpaper.xweet.in/api/download/midnight-amber?type=phone-4k&inline=true`

---

## 3. Response Schema

### Success Response (`200 OK`)

```json
{
  "success": true,
  "timestamp": 1792078650000,
  "pagination": {
    "total": 37,
    "page": 1,
    "limit": 20,
    "totalPages": 2,
    "hasMore": true
  },
  "data": [
    {
      "id": "wp-01",
      "slug": "midnight-amber",
      "title": "Midnight Amber",
      "description": "Flowing midnight-blue forms meet a delicate amber glow in this textured abstract wallpaper.",
      "classification": {
        "category": "Dark Abstract",
        "collection": "Minimal Abstracts",
        "aspectRatio": "16:9",
        "resolution": "2752 × 1536"
      },
      "styling": {
        "dominantColor": "#111B2A",
        "paletteHex": "#D99562",
        "palette": ["#111B2A", "#344153", "#D99562"],
        "tags": ["minimal", "abstract", "navy", "amber", "grain"]
      },
      "author": {
        "name": "Vicky",
        "username": "xweet",
        "avatarUrl": "https://wallpaper.xweet.in/logo.png",
        "isVerified": true,
        "bio": "Founder & Curator of Xweet Wallpapers."
      },
      "urls": {
        "master": "https://cdn.xweet.in/wallpapers/midnight-amber.webp",
        "phoneLockscreen": "https://wallpaper.xweet.in/api/download/midnight-amber?type=phone-4k",
        "desktop1080p": "https://wallpaper.xweet.in/api/download/midnight-amber?type=desktop-1080p",
        "desktop4k": "https://wallpaper.xweet.in/api/download/midnight-amber?type=desktop-4k",
        "thumbnail": "https://cdn.xweet.in/wallpapers/midnight-amber.webp",
        "webPage": "https://wallpaper.xweet.in/wallpaper/midnight-amber"
      },
      "flags": {
        "isFeatured": true,
        "isNew": true,
        "hasPhoneCrop": true
      },
      "publishedAt": "2026-10-14",
      "createdAt": 1791934171013
    }
  ]
}
```

---

## 4. Code Examples for External Integration

### 4.1 JavaScript / TypeScript (`fetch`)

```typescript
// Fetch 5 random phone wallpapers for a widget
async function fetchRandomWallpapers() {
  const res = await fetch("https://wallpaper.xweet.in/api/wallpapers?orientation=mobile&random=true&limit=5");
  const json = await res.json();
  
  if (json.success) {
    json.data.forEach(wp => {
      console.log(wp.title, "->", wp.urls.phoneLockscreen);
    });
  }
}
```

### 4.2 Flutter / Dart (Mobile App)

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

Future<List<dynamic>> getPhoneWallpapers() async {
  final url = Uri.parse('https://wallpaper.xweet.in/api/wallpapers?orientation=mobile&limit=30');
  final response = await http.get(url);

  if (response.statusCode == 200) {
    final Map<String, dynamic> body = jsonDecode(response.body);
    return body['data'];
  } else {
    throw Exception('Failed to load wallpapers');
  }
}
```

### 4.3 Python (`requests`)

```python
import requests

response = requests.get(
    "https://wallpaper.xweet.in/api/wallpapers",
    params={"q": "flower", "limit": 10}
)
wallpapers = response.json().get("data", [])

for wp in wallpapers:
    print(f"{wp['title']} ({wp['styling']['dominantColor']}) -> {wp['urls']['master']}")
```

### 4.4 cURL

```bash
# Get 3 random wallpapers
curl -X GET "https://wallpaper.xweet.in/api/wallpapers?random=true&limit=3"

# Search for AMOLED / OLED wallpapers
curl -X GET "https://wallpaper.xweet.in/api/wallpapers?q=oled"

# Get single wallpaper
curl -X GET "https://wallpaper.xweet.in/api/wallpapers?slug=midnight-amber"
```

---

## 5. HTTP Status Codes

| Code | Meaning | Description |
|---|---|---|
| `200 OK` | Success | The query completed successfully with matching items. |
| `204 No Content` | CORS Preflight | Returned for `OPTIONS` preflight requests. |
| `304 Not Modified` | Cached | The client ETag matches server asset hash; zero bandwidth consumed. |
| `404 Not Found` | Missing Item | Returned when querying a non-existent `slug`. |
| `500 Server Error` | Unexpected | An internal server or database error occurred. |
