"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((registration) => {
            console.log("[SW] Wallpaper cache service worker active:", registration.scope);
          })
          .catch((err) => {
            // Silently fail if not supported or disabled
            console.debug("[SW] Registration skipped:", err);
          });
      });
    }
  }, []);

  return null;
}
