import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let authInst = null;
let providerInst = null;
const isPlaceholder = (v) => typeof v === "string" && v.toUpperCase().includes("YOUR_");
if (
  config.apiKey &&
  config.authDomain &&
  config.projectId &&
  config.appId &&
  !isPlaceholder(config.apiKey) &&
  !isPlaceholder(config.authDomain) &&
  !isPlaceholder(config.projectId) &&
  !isPlaceholder(config.appId)
) {
  const app = getApps().length ? getApps()[0] : initializeApp(config);
  authInst = getAuth(app);
  providerInst = new GoogleAuthProvider();
}

export const auth = authInst;
export const googleProvider = providerInst;
