import { Suspense, use } from "react";
import AuthorProfileClient from "./AuthorProfileClient";

interface PageProps {
  params: Promise<{ username: string }>;
}

function ProfileContainer({
  paramsPromise,
}: {
  paramsPromise: Promise<{ username: string }>;
}) {
  const resolved = use(paramsPromise);
  const username = resolved?.username || "xweet";
  return <AuthorProfileClient initialUsername={username} />;
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
