"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { IconBrandGoogle, IconArrowLeft, IconAlertCircle, IconCheck, IconShieldCheck } from "@tabler/icons-react";

export default function LoginPage() {
  const router = useRouter();
  const { user, profile, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-redirect if already logged in
  if (user && profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
        <div className="border border-border bg-surface p-8 max-w-md w-full text-center">
          <div className="h-12 w-12 rounded-full overflow-hidden border border-border mx-auto mb-4 bg-white">
            <Image src="/logo.png" alt="Logo" width={48} height={48} className="object-contain p-1" />
          </div>
          <h2 className="font-sans text-xl font-semibold text-foreground">You are logged in</h2>
          <p className="font-sans text-sm text-muted-foreground mt-1">
            Logged in as <span className="font-mono text-primary font-bold">@{profile.username}</span>
          </p>
          <div className="flex flex-col gap-2.5 mt-6">
            <Button variant="primary" onClick={() => router.push("/")} className="w-full">
              Back to Catalog
            </Button>
            <Button variant="secondary" onClick={() => router.push(`/${profile.username}`)} className="w-full">
              Go to Profile
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setLoading(true);
      await signInWithGoogle();
      router.push("/");
    } catch (err: any) {
      setError(err?.message || "Failed to sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
      } else {
        if (!username.trim()) {
          throw new Error("Please enter a username.");
        }
        await signUpWithEmail(email, password, username, displayName || username);
      }
      router.push("/");
    } catch (err: any) {
      setError(err?.message || "Authentication failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const isXweetUsername = username.trim().toLowerCase() === "xweet";

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground selection:bg-secondary">
      {/* Top Simple Bar */}
      <div className="border-b border-border py-4 px-6 lg:px-12">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
            <IconArrowLeft size={14} />
            <span>RETURN TO CATALOG</span>
          </Link>

          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-6 w-6 rounded-full overflow-hidden border border-border bg-white">
              <Image src="/logo.png" alt="Xweet" fill sizes="24px" className="object-contain p-0.5" />
            </div>
            <span className="font-sans text-sm font-semibold tracking-tight">Xweet Wallpapers</span>
          </Link>
        </div>
      </div>

      {/* Main Center Auth Box */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md border border-border bg-surface p-8 shadow-xs">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1.5 w-1.5 bg-primary shrink-0" />
              <span className="font-mono text-xs font-semibold text-primary uppercase tracking-wider">
                Author Access
              </span>
            </div>
            <h1 className="font-sans text-2xl font-semibold tracking-tight text-foreground">
              {mode === "signin" ? "Sign in to Xweet" : "Create Author Profile"}
            </h1>
            <p className="font-sans text-xs text-muted-foreground mt-1">
              Publish 4K & 5K wallpapers, curate drops, and build your portfolio.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-0 border border-border mb-6 font-mono text-xs uppercase">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError("");
              }}
              className={`py-2 text-center transition-colors cursor-pointer ${
                mode === "signin"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError("");
              }}
              className={`py-2 text-center transition-colors cursor-pointer border-l border-border ${
                mode === "signup"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
              <IconAlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Sign-In */}
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={handleGoogleSignIn}
            isLoading={loading}
            className="w-full mb-5 text-xs font-medium"
          >
            <IconBrandGoogle size={16} />
            <span>Continue with Google</span>
          </Button>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <span className="relative bg-surface px-3 font-mono text-[10px] text-muted-foreground uppercase">
              OR WITH EMAIL
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "signup" && (
              <>
                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                    Username <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. xweet or studio_art"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                    className="h-10 w-full rounded-none border border-border bg-background px-3 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                  {isXweetUsername && (
                    <div className="flex items-center gap-1.5 mt-1.5 font-mono text-[11px] text-primary">
                      <IconShieldCheck size={14} />
                      <span>Auto-detected: Verified Xweet Official Curator</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Xweet Studio or Jane Doe"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="h-10 w-full rounded-none border border-border bg-background px-3 font-sans text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                Email Address <span className="text-primary">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="author@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 w-full rounded-none border border-border bg-background px-3 font-sans text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                Password <span className="text-primary">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 w-full rounded-none border border-border bg-background px-3 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={loading}
              className="w-full mt-2"
            >
              <IconCheck size={16} />
              <span>{mode === "signin" ? "Sign In" : "Complete Registration"}</span>
            </Button>
          </form>
        </div>
      </div>

      {/* Bottom Fine Print */}
      <div className="border-t border-border py-4 px-6 text-center text-[11px] font-mono text-muted-foreground">
        SECURE FIREBASE AUTHENTICATION • ZERO TRACKING • CURATOR EXCLUSIVE
      </div>
    </div>
  );
}
