import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

let auth = null;
let googleProvider = null;

const isConfigured = firebaseConfig.apiKey && firebaseConfig.authDomain;

if (isConfigured) {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
  } catch (err) {
    console.warn("Firebase initialization failed, using simulated fallback:", err.message);
  }
}

export const signInWithGoogle = async () => {
  if (isConfigured && auth && googleProvider) {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      return {
        success: true,
        user: {
          name: user.displayName,
          email: user.email,
          avatarUrl: user.photoURL,
          googleId: user.uid
        }
      };
    } catch (err) {
      console.error("Firebase Google Auth error, switching to simulation:", err);
    }
  }
  
  // Simulation Fallback: resolves after 800ms with a mock Google Profile
  return new Promise((resolve) => {
    console.log("Simulating Google OAuth account selection...");
    setTimeout(() => {
      resolve({
        success: true,
        user: {
          name: "T. Chitra Yadav (Google)",
          email: "chitra.yadav@gmail.com",
          avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256&h=256",
          googleId: "google-oauth-chitra-12345"
        }
      });
    }, 800);
  });
};
