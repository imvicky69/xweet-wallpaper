/**
 * Initial Seeding Script for Xweet Wallpapers
 * Usage: node scripts/seed-initial.mjs
 *
 * This script seeds the curated wallpapers from wallpapers.ts into your
 * Firestore 'wallpapers' collection and sets up the official 'xweet' author profile.
 */

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";
import { WALLPAPERS, XWEET_AUTHOR } from "../src/lib/wallpapers";

// 1. Check for root serviceAccountKey.json file
const rootKeyPath = path.resolve(process.cwd(), "serviceAccountKey.json");
let serviceAccount: any = null;

if (fs.existsSync(rootKeyPath)) {
  try {
    serviceAccount = JSON.parse(fs.readFileSync(rootKeyPath, "utf-8"));
    console.log("✓ Loaded serviceAccountKey.json from project root!");
  } catch (e) {
    console.warn("Failed to parse serviceAccountKey.json:", e);
  }
} else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    console.log("✓ Loaded service account from environment variable.");
  } catch (e) {
    console.warn("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:", e);
  }
}

if (!serviceAccount && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.log(`
  [INFO] No Firebase Admin Service Account Key detected.
  Please place your serviceAccountKey.json in the project root directory.
  `);
  process.exit(1);
}

if (getApps().length === 0) {
  initializeApp({
    credential: serviceAccount ? cert(serviceAccount) : undefined,
    projectId: serviceAccount?.project_id || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  });
}

const db = getFirestore();

async function seed() {
  console.log("\n=============================================");
  console.log("SEEDING INITIAL FIRESTORE REPOSITORY");
  console.log("=============================================");

  console.log("\n--> 1. Creating official @xweet author document in 'users'...");
  await db.collection("users").doc("xweet").set({
    ...XWEET_AUTHOR,
    createdAt: new Date().toISOString(),
  });
  console.log("✓ Official @xweet profile created and verified.");

  console.log(`\n--> 2. Seeding ${WALLPAPERS.length} curated master wallpapers...`);
  for (const wp of WALLPAPERS) {
    const docRef = db.collection("wallpapers").doc(wp.id);
    await docRef.set({
      ...wp,
      createdAt: Date.now(),
    });
    console.log(`✓ Seeded: [${wp.id}] "${wp.title}" (${wp.category})`);
  }

  console.log("\n=============================================");
  console.log("✓ FIRESTORE SEED COMPLETED SUCCESSFULLY!");
  console.log("=============================================\n");
}

seed().catch((err) => {
  console.error("✗ Failed to seed Firestore:", err);
});
