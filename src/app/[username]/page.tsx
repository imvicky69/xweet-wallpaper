import { Metadata } from "next";
import { Suspense, use } from "react";
import AuthorProfileClient from "./AuthorProfileClient";

interface PageProps {
  params: Promise<{ username: string }>;
}

export async function generateStaticParams() {
  return [
    { username: "xweet" },
    { username: "vikky" },
    { username: "vicky" },
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolved = await params;
  const username = decodeURIComponent(resolved?.username || "xweet").toLowerCase();
  const isCurator = ["xweet", "vikky", "vicky", "rajvicky97988"].includes(username);

  const title = isCurator
    ? "Vicky (@xweet) — Official Curator Portfolio | Xweet Wallpapers"
    : `@${username} — Author Profile | Xweet Wallpapers`;

  const description = isCurator
    ? "Explore the Minimal Abstracts collection curated by Vicky (@xweet) on Xweet Wallpapers. Handcrafted 4K desktop and mobile backgrounds."
    : `Explore curated wallpapers published by @${username} on Xweet Wallpapers.`;

  const canonicalUrl = `https://wallpaper.xweet.in/${isCurator ? "xweet" : username}`;

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: "profile",
      url: canonicalUrl,
      siteName: "Xweet Wallpapers",
      images: [
        {
          url: "/logo.png",
          width: 512,
          height: 512,
          alt: `${isCurator ? "Vicky" : username} on Xweet Wallpapers`,
        },
      ],
    },
    twitter: {
      card: "summary",
      site: "@xweet",
      title,
      description,
      creator: "@xweet",
      images: ["/logo.png"],
    },
  };
}

function ProfileContainer({
  paramsPromise,
}: {
  paramsPromise: Promise<{ username: string }>;
}) {
  const resolved = use(paramsPromise);
  const username = resolved?.username || "xweet";
  const isCurator = ["xweet", "vikky", "vicky", "rajvicky97988"].includes(username.toLowerCase());
  const displayName = isCurator ? "Vicky" : `@${username}`;

  const profileJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    dateCreated: "2024-01-01T00:00:00Z",
    mainEntity: {
      "@type": "Person",
      name: displayName,
      alternateName: `@${username}`,
      identifier: username,
      image: "https://wallpaper.xweet.in/logo.png",
      description: isCurator
        ? "Curator of Minimal Abstracts at Xweet Wallpapers."
        : `Creator portfolio of @${username} on Xweet Wallpapers.`,
      url: `https://wallpaper.xweet.in/${isCurator ? "xweet" : username}`,
      sameAs: isCurator ? ["https://x.com/xweet"] : undefined,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd) }}
      />
      <AuthorProfileClient initialUsername={username} />
    </>
  );
}

export default function Page({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background font-mono text-xs text-muted-foreground">
          LOADING AUTHOR PORTFOLIO...
        </div>
      }
    >
      <ProfileContainer paramsPromise={params} />
    </Suspense>
  );
}
