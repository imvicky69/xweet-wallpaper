import fs from "fs";
import path from "path";

const rootKeyPath = path.resolve(process.cwd(), "serviceAccountKey.json");
const envLocalPath = path.resolve(process.cwd(), ".env.local");

if (fs.existsSync(rootKeyPath) && fs.existsSync(envLocalPath)) {
  const sa = JSON.parse(fs.readFileSync(rootKeyPath, "utf-8"));
  let env = fs.readFileSync(envLocalPath, "utf-8");

  env = env.replace(
    /NEXT_PUBLIC_FIREBASE_PROJECT_ID=["'].*?["']/,
    `NEXT_PUBLIC_FIREBASE_PROJECT_ID="${sa.project_id}"`
  );
  env = env.replace(
    /NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=["'].*?["']/,
    `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="${sa.project_id}.firebaseapp.com"`
  );
  env = env.replace(
    /FIREBASE_CLIENT_EMAIL=["'].*?["']/,
    `FIREBASE_CLIENT_EMAIL="${sa.client_email}"`
  );

  const formattedKey = sa.private_key.replace(/\n/g, "\\n");
  env = env.replace(
    /FIREBASE_PRIVATE_KEY=["'][\s\S]*?["'](?=\r?\n|$)/,
    `FIREBASE_PRIVATE_KEY="${formattedKey}"`
  );

  fs.writeFileSync(envLocalPath, env, "utf-8");
  console.log("✓ Successfully synchronized .env.local with new serviceAccountKey.json credentials!");
}
