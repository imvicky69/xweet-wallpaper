import fs from "fs";
import path from "path";

const rootKeyPath = path.resolve(process.cwd(), "serviceAccountKey.json");
const envLocalPath = path.resolve(process.cwd(), ".env.local");

if (fs.existsSync(rootKeyPath) && fs.existsSync(envLocalPath)) {
  const sa = JSON.parse(fs.readFileSync(rootKeyPath, "utf-8"));
  let envContent = fs.readFileSync(envLocalPath, "utf-8");

  if (!envContent.includes("FIREBASE_CLIENT_EMAIL")) {
    const formattedKey = sa.private_key.replace(/\n/g, "\\n");
    envContent += `\n# Firebase Admin Credentials (Server-only)\nFIREBASE_CLIENT_EMAIL="${sa.client_email}"\nFIREBASE_PRIVATE_KEY="${formattedKey}"\n`;
    fs.writeFileSync(envLocalPath, envContent, "utf-8");
    console.log("✓ Added FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY to .env.local");
  } else {
    console.log("✓ .env.local already contains FIREBASE_CLIENT_EMAIL");
  }
}
