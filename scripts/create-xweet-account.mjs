import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const email = "vikky@xweet.in";
const password = "hello@69";
const displayName = "Vikky";
const username = "xweet";

async function syncProfile() {
  console.log(`Authenticating ${email}...`);
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const user = cred.user;
  console.log(`✓ Authenticated as UID: ${user.uid}`);

  await updateProfile(user, {
    displayName,
    photoURL: "/logo.png",
  });

  const profile = {
    id: "xweet",
    uid: user.uid,
    username: username,
    displayName: displayName,
    email: email,
    photoURL: "/logo.png",
    isVerified: true,
    bio: "Official editorial curator for Xweet Wallpapers.",
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(doc(db, "users", user.uid), profile);
    console.log(`✓ Firestore profile saved at users/${user.uid}!`);
    console.log("  - Username:   @xweet");
    console.log("  - Display:    Vikky");
    console.log("  - Verified:   true");
    console.log("\nEverything is ready! You can now log in at http://localhost:3000/login with:");
    console.log(`Email:    ${email}`);
    console.log(`Password: ${password}\n`);
  } catch (err) {
    console.error("Firestore write note:", err.message);
  }
}

syncProfile();
