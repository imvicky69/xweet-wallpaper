"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";
import { AuthorRef } from "@/types/wallpaper";

interface AuthContextType {
  user: FirebaseUser | null;
  profile: AuthorRef | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (
    email: string,
    pass: string,
    username: string,
    displayName: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<AuthorRef | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to ensure author profile in Firestore
  const syncUserProfile = async (
    firebaseUser: FirebaseUser,
    customUsername?: string,
    customDisplayName?: string
  ): Promise<AuthorRef> => {
    try {
      const userRef = doc(db, "users", firebaseUser.uid);
      const snap = await getDoc(userRef);

      const isVicky = Boolean(
        firebaseUser.email?.toLowerCase().includes("vikky") ||
        firebaseUser.email?.toLowerCase().includes("vicky") ||
        firebaseUser.email?.toLowerCase().includes("xweet") ||
        firebaseUser.email?.toLowerCase().includes("rajvi") ||
        customUsername?.toLowerCase() === "xweet" ||
        customUsername?.toLowerCase() === "vikky" ||
        customUsername?.toLowerCase() === "vicky" ||
        customUsername?.toLowerCase() === "rajvicky97988" ||
        firebaseUser.uid === "6EYZ8KNxK7R5HEs06VR48oyf9PN2" ||
        firebaseUser.uid === "R26Fl6XBQ0XmQepFfDsUcYfL4xs1" ||
        firebaseUser.uid === "05NsJKgLsTMUYK66qxbgQNEETX82"
      );

      const canonicalVicky: AuthorRef = {
        id: "xweet",
        username: "xweet",
        displayName: "Vicky",
        photoURL: "/logo.png",
        isVerified: true,
        bio: "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens.",
        joinedAt: "2026-01-01",
      };

      if (isVicky) {
        await setDoc(userRef, { ...canonicalVicky, uid: firebaseUser.uid }, { merge: true });
        setProfile(canonicalVicky);
        return canonicalVicky;
      }

      if (snap.exists()) {
        const data = snap.data() as AuthorRef;
        const updatedProfile: AuthorRef = {
          ...data,
          isVerified: data.username?.toLowerCase() === "xweet" || data.isVerified,
        };
        setProfile(updatedProfile);
        return updatedProfile;
      } else {
        const defaultUsername = (
          customUsername ||
          firebaseUser.email?.split("@")[0] ||
          `user_${firebaseUser.uid.slice(0, 5)}`
        )
          .toLowerCase()
          .replace(/[^a-z0-9_]/g, "");

        const newProfile: AuthorRef = {
          id: firebaseUser.uid,
          username: defaultUsername,
          displayName: customDisplayName || firebaseUser.displayName || defaultUsername,
          photoURL: firebaseUser.photoURL || undefined,
          isVerified: defaultUsername === "xweet",
          joinedAt: new Date().toISOString(),
        };

        await setDoc(userRef, newProfile);
        setProfile(newProfile);
        return newProfile;
      }
    } catch {
      const isVicky = Boolean(
        firebaseUser.email?.toLowerCase().includes("vikky") ||
        firebaseUser.email?.toLowerCase().includes("vicky") ||
        firebaseUser.email?.toLowerCase().includes("xweet") ||
        firebaseUser.email?.toLowerCase().includes("rajvi") ||
        customUsername?.toLowerCase() === "xweet" ||
        customUsername?.toLowerCase() === "vikky" ||
        customUsername?.toLowerCase() === "vicky" ||
        firebaseUser.uid === "6EYZ8KNxK7R5HEs06VR48oyf9PN2" ||
        firebaseUser.uid === "R26Fl6XBQ0XmQepFfDsUcYfL4xs1"
      );

      const fallbackProfile: AuthorRef = {
        id: isVicky ? "xweet" : firebaseUser.uid,
        username: isVicky ? "xweet" : "user",
        displayName: isVicky ? "Vicky" : customDisplayName || firebaseUser.displayName || "Author",
        photoURL: isVicky ? "/logo.png" : firebaseUser.photoURL || undefined,
        isVerified: isVicky,
      };
      setProfile(fallbackProfile);
      return fallbackProfile;
    }
  };

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        setUser(firebaseUser);
        if (firebaseUser) {
          await syncUserProfile(firebaseUser);
        } else {
          setProfile(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } catch {
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    if (result.user) {
      await syncUserProfile(result.user);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    if (result.user) {
      await syncUserProfile(result.user);
    }
  };

  const signUpWithEmail = async (
    email: string,
    pass: string,
    username: string,
    displayName: string
  ) => {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    if (result.user) {
      await updateProfile(result.user, { displayName });
      await syncUserProfile(result.user, username, displayName);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
