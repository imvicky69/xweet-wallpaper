import { initializeApp, getApps, getApp, cert, type App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

let adminApp: App | null = null;

export const hasAdminCredentials: boolean = Boolean(
  (typeof process !== "undefined" && fs.existsSync(path.resolve(process.cwd(), "serviceAccountKey.json"))) ||
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
  (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY)
);

function getAdminApp(): App | null {
  if (!hasAdminCredentials) {
    return null;
  }

  if (getApps().length > 0) {
    return getApp();
  }

  // 1. Try individual environment variables
  if (process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
    try {
      return initializeApp({
        credential: cert({
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    } catch (e) {
      console.warn("Failed to initialize Firebase Admin with individual env credentials:", e);
    }
  }

  // 2. Try JSON string from FIREBASE_SERVICE_ACCOUNT_KEY
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      return initializeApp({
        credential: cert(parsed),
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || parsed.project_id,
      });
    } catch (e) {
      console.warn("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY JSON:", e);
    }
  }

  // 3. Fallback to local root serviceAccountKey.json file (for local tooling/scripts)
  const rootKeyPath = path.resolve(process.cwd(), "serviceAccountKey.json");
  if (fs.existsSync(rootKeyPath)) {
    try {
      const raw = fs.readFileSync(rootKeyPath, "utf-8");
      const serviceAccount = JSON.parse(raw);
      return initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    } catch (err) {
      console.warn("Found serviceAccountKey.json but failed to parse:", err);
    }
  }

  return null;
}

adminApp = getAdminApp();
export const adminAuth: Auth | null = adminApp ? getAuth(adminApp) : null;
export const adminDb: Firestore | null = adminApp ? getFirestore(adminApp) : null;
