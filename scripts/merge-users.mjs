import fs from "fs";
import path from "path";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const rootKeyPath = path.resolve(process.cwd(), "serviceAccountKey.json");
const serviceAccount = JSON.parse(fs.readFileSync(rootKeyPath, "utf-8"));

if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id,
  });
}

const db = getFirestore();
const auth = getAuth();

async function mergeAllUsers() {
  console.log("=================================================");
  console.log("MERGING ALL DUPLICATE USERS INTO VICKY (@xweet)");
  console.log("=================================================\n");

  const canonicalUser = {
    id: "xweet",
    username: "xweet",
    displayName: "Vicky",
    photoURL: "/logo.png",
    isVerified: true,
    bio: "Founder & Curator of Xweet Wallpapers. Curated minimal abstracts for focused screens.",
    joinedAt: "2026-01-01",
    role: "admin",
    updatedAt: new Date().toISOString(),
  };

  // 1. Update all Firebase Auth accounts to display name "Vicky" & photoURL
  const listUsersResult = await auth.listUsers(100);
  const uidsToSync = new Set(["xweet", "vikky", "rajvicky97988"]);

  for (const userRecord of listUsersResult.users) {
    console.log(`Processing Auth user [${userRecord.uid}] (${userRecord.email}): currently '${userRecord.displayName}'`);
    uidsToSync.add(userRecord.uid);

    try {
      await auth.updateUser(userRecord.uid, {
        displayName: "Vicky",
        photoURL: "https://xweet.com/logo.png",
      });
      console.log(`  ✓ Updated Auth user [${userRecord.uid}] -> Name: 'Vicky', Photo: 'https://xweet.com/logo.png'`);
    } catch (err) {
      console.error(`  ✗ Error updating Auth user ${userRecord.uid}:`, err.message);
    }
  }

  // Also include the legacy seeded UID
  uidsToSync.add("05NsJKgLsTMUYK66qxbgQNEETX82");

  // 2. Unify all relevant Firestore 'users' documents
  console.log("\nSynchronizing Firestore 'users' documents...");
  for (const docId of uidsToSync) {
    await db.collection("users").doc(docId).set(
      {
        ...canonicalUser,
        uid: docId,
      },
      { merge: true }
    );
    console.log(`  ✓ Synced users/${docId} -> Vicky (@xweet) with X logo pfp`);
  }

  // 3. Ensure all 16 wallpapers have author: Vicky (@xweet)
  const wallpapersSnapshot = await db.collection("wallpapers").get();
  console.log(`\nVerifying author on ${wallpapersSnapshot.size} wallpapers...`);
  for (const wpDoc of wallpapersSnapshot.docs) {
    await wpDoc.ref.update({
      author: {
        id: "xweet",
        username: "xweet",
        displayName: "Vicky",
        photoURL: "/logo.png",
        isVerified: true,
        bio: canonicalUser.bio,
        joinedAt: canonicalUser.joinedAt,
      },
    });
  }
  console.log(`✓ All ${wallpapersSnapshot.size} wallpapers verified with author 'Vicky' (@xweet)`);

  console.log("\n=================================================");
  console.log("✓ SUCCESS: All users merged into Vicky (@xweet)");
  console.log("=================================================\n");
}

mergeAllUsers().catch(console.error);
