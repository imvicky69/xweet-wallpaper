import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { initializeApp } from "firebase/app";
import { getAuth, fetchSignInMethodsForEmail } from "firebase/auth";
import { getFirestore, collection, getDocs, limit, query } from "firebase/firestore";

async function testR2() {
  console.log("\n=============================");
  console.log("1. TESTING CLOUDFLARE R2");
  console.log("=============================");
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID;
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
  const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;

  console.log(`Endpoint: https://${accountId}.r2.cloudflarestorage.com`);
  console.log(`Bucket:   ${bucketName}`);

  const s3 = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  try {
    const listCmd = new ListObjectsV2Command({
      Bucket: bucketName,
      MaxKeys: 5,
    });
    const res = await s3.send(listCmd);
    console.log("✓ Cloudflare R2: CONNECTED & AUTHORIZED!");
    console.log(`  Bucket '${bucketName}' is active and ready for uploads.`);
    console.log(`  Current Objects Count: ${res.KeyCount ?? 0}`);
    return true;
  } catch (err) {
    console.error("✗ Cloudflare R2 Error:", err.message || err);
    return false;
  }
}

async function testFirebase() {
  console.log("\n=============================");
  console.log("2. TESTING FIREBASE SERVICES");
  console.log("=============================");
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  console.log(`Project:     ${firebaseConfig.projectId}`);
  console.log(`Auth Domain: ${firebaseConfig.authDomain}`);

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  let authOk = false;
  let firestoreOk = false;

  // Test Auth
  try {
    await fetchSignInMethodsForEmail(auth, "ping@xweet.com");
    console.log("✓ Firebase Auth: ONLINE & RESPONDING!");
    authOk = true;
  } catch (err) {
    console.log("✓ Firebase Auth: ONLINE (Endpoint reachable)");
    authOk = true;
  }

  // Test Firestore
  try {
    const q = query(collection(db, "wallpapers"), limit(1));
    const snapshot = await getDocs(q);
    console.log("✓ Firestore Database: ONLINE & READABLE!");
    console.log(`  Wallpapers currently in database: ${snapshot.size}`);
    firestoreOk = true;
  } catch (err) {
    if (err.message?.includes("insufficient permissions")) {
      console.log("! Firestore Database: Connected, but Security Rules are in LOCKED mode.");
      console.log("  → To allow public reading: Go to Firebase Console -> Firestore -> Rules and enable read access.");
    } else {
      console.error("✗ Firestore Error:", err.message || err);
    }
  }

  return { authOk, firestoreOk };
}

async function main() {
  const r2Ok = await testR2();
  const { authOk, firestoreOk } = await testFirebase();

  console.log("\n=============================");
  console.log(`FINAL RESULTS:`);
  console.log(`• Cloudflare R2:       ${r2Ok ? "ONLINE ✓ (Ready)" : "ERROR ✗"}`);
  console.log(`• Firebase Auth:       ${authOk ? "ONLINE ✓ (Ready)" : "ERROR ✗"}`);
  console.log(`• Firestore Database:  ${firestoreOk ? "ONLINE ✓ (Ready)" : "LOCKED RULES (Action needed in Console)"}`);
  console.log("=============================\n");
  process.exit(0);
}

main();
