import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDocs, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const targetUid = process.argv[2];

async function assignXweet() {
  console.log("\n=============================================");
  console.log("ASSIGNING OFFICIAL XWEET CURATOR PRIVILEGES");
  console.log("=============================================");

  if (!targetUid) {
    console.log("Usage: node --env-file=.env.local scripts/assign-xweet.mjs <USER_UID_OR_EMAIL>");
    console.log("\nFetching existing registered users in Firestore...");
    try {
      const snap = await getDocs(collection(db, "users"));
      if (snap.empty) {
        console.log("No users registered yet. First log in via http://localhost:3000/login !");
      } else {
        console.log("\nFound users:");
        snap.forEach((d) => {
          const data = d.data();
          console.log(`- UID: ${d.id} | Email/User: @${data.username} (${data.displayName}) | Verified: ${data.isVerified}`);
        });
        console.log("\nTo assign 'xweet' to any of these, run:");
        console.log("node --env-file=.env.local scripts/assign-xweet.mjs <UID>");
      }
    } catch (e) {
      console.log("Note:", e.message);
    }
    return;
  }

  try {
    const userRef = doc(db, "users", targetUid);
    await setDoc(
      userRef,
      {
        id: "xweet",
        username: "xweet",
        displayName: "Xweet Wallpapers Studio",
        photoURL: "/logo.png",
        isVerified: true,
        bio: "Official editorial studio for Xweet Wallpapers. Curated textures & high-resolution masters.",
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    console.log(`✓ Successfully assigned official 'xweet' profile to user: ${targetUid}`);
    console.log("  - Username:   @xweet");
    console.log("  - Display:    Xweet Wallpapers Studio");
    console.log("  - Verified:   true (Shield Checkmark Badge)");
    console.log("  - Profile:    http://localhost:3000/xweet\n");
  } catch (err) {
    console.error("✗ Failed to assign:", err.message);
  }
}

assignXweet();
