"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  IconSearch,
  IconMenu2,
  IconX,
  IconPlus,
  IconShieldCheck,
  IconUser,
  IconLogout,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

interface SiteHeaderProps {
  onSearchClick?: () => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({
  onSearchClick,
  searchQuery,
  onSearchChange,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, profile, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-12">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-border bg-white shadow-xs">
            <Image
              src="/logo.png"
              alt="Xweet Wallpapers"
              fill
              sizes="32px"
              className="object-contain p-0.5"
              priority
            />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-sans text-base font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
              Xweet
            </span>
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              WALLPAPERS
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-wider">
          <Link
            href="/#featured"
            className="text-muted-foreground hover:text-primary transition-colors duration-150 py-1"
          >
            Exclusive Drops
          </Link>
          <Link
            href="/#wallpapers"
            className="text-foreground hover:text-primary transition-colors duration-150 py-1 font-semibold"
          >
            All Wallpapers
          </Link>
        </nav>

        {/* Right Header Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {onSearchChange !== undefined ? (
            <div className="relative w-44 lg:w-52">
              <input
                type="text"
                placeholder="Search catalog..."
                value={searchQuery || ""}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-8.5 w-full rounded-none border border-border bg-surface pl-8 pr-3 font-sans text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
              />
              <IconSearch
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
              />
            </div>
          ) : (
            <button
              onClick={onSearchClick}
              className="flex h-8.5 items-center gap-2 border border-border bg-surface px-3 text-xs font-mono text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer"
            >
              <IconSearch size={13} />
              <span>SEARCH</span>
            </button>
          )}

          {/* User Auth State */}
          {user && profile ? (
            <div className="flex items-center gap-2">
              {/* Upload Button */}
              <Button href="/upload" size="sm" variant="secondary" className="text-xs h-8.5 px-3">
                <IconPlus size={14} />
                <span>Upload</span>
              </Button>

              {/* Username Link to Profile */}
              <Link
                href={`/${profile.username}`}
                className="flex items-center gap-1.5 h-8.5 px-3 border border-border bg-surface hover:border-primary transition-colors font-mono text-xs text-foreground"
              >
                <div className="h-5 w-5 rounded-full overflow-hidden bg-white border border-border/80 flex items-center justify-center text-[10px] text-primary font-bold shrink-0">
                  {profile.photoURL ? (
                    <Image src={profile.photoURL} alt={profile.displayName || profile.username} width={20} height={20} className="object-contain p-0.5" />
                  ) : (
                    profile.username[0]?.toUpperCase()
                  )}
                </div>
                <span className="font-semibold text-primary">@{profile.username}</span>
                {profile.isVerified && (
                  <span title="Xweet Verified Curator" className="text-primary">
                    <IconShieldCheck size={14} />
                  </span>
                )}
              </Link>

              {/* Logout Button */}
              <button
                onClick={() => logout()}
                title="Log out"
                className="flex h-8.5 w-8.5 items-center justify-center border border-border bg-surface text-muted-foreground hover:text-destructive hover:border-destructive transition-colors cursor-pointer"
              >
                <IconLogout size={14} />
              </button>
            </div>
          ) : (
            <Button href="/login" size="sm" variant="primary" className="text-xs h-8.5 px-3.5">
              <IconUser size={13} />
              <span>Author Sign In</span>
            </Button>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          className="flex md:hidden h-9 w-9 items-center justify-center border border-border bg-surface text-foreground hover:border-primary transition-colors"
        >
          {mobileMenuOpen ? <IconX size={18} /> : <IconMenu2 size={18} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-background px-6 py-5 animate-in slide-in-from-top-2 duration-150">
          <nav className="flex flex-col gap-3 text-sm font-medium">
            <Link
              href="/#featured"
              onClick={() => setMobileMenuOpen(false)}
              className="text-foreground hover:text-primary py-2 border-b border-border/50 flex items-center justify-between"
            >
              <span>Exclusive Drops</span>
              <span className="font-mono text-xs text-primary">FEATURED</span>
            </Link>
            <Link
              href="/#wallpapers"
              onClick={() => setMobileMenuOpen(false)}
              className="text-foreground hover:text-primary py-2 border-b border-border/50"
            >
              All Wallpapers
            </Link>

            {user && profile ? (
              <>
                <Link
                  href={`/${profile.username}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-primary py-2 border-b border-border/50 flex items-center gap-2 font-mono text-xs font-semibold"
                >
                  <span>Profile: @{profile.username}</span>
                  {profile.isVerified && <IconShieldCheck size={14} />}
                </Link>
                <div className="pt-2 flex flex-col gap-2">
                  <Button
                    href="/upload"
                    size="md"
                    variant="primary"
                    className="w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <IconPlus size={16} />
                    <span>Upload New Wallpaper</span>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="w-full text-xs text-muted-foreground"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Log Out
                  </Button>
                </div>
              </>
            ) : (
              <div className="pt-2">
                <Button
                  href="/login"
                  size="md"
                  variant="primary"
                  className="w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <IconUser size={16} />
                  <span>Author Sign In / Sign Up</span>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};
