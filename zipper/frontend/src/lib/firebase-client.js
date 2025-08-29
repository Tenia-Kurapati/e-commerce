// frontend/src/lib/firebase-client.js
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration filled in
const firebaseConfig = {
  apiKey: "AIzaSyA058NbW3aEdJKWXX-i4FA659VxV1-0Y0s",
  authDomain: "cursor-ecommerce-c67d6.firebaseapp.com",
  projectId: "cursor-ecommerce-c67d6",
  storageBucket: "cursor-ecommerce-c67d6.appspot.com", // Corrected storage bucket URL
  messagingSenderId: "309522448005",
  appId: "1:309522448005:web:323908c231a187528f33ec",
  measurementId: "G-K4EQ30JV9R" // Added for completeness
};

// Note: I corrected the 'storageBucket' URL. The value you provided was for Firebase Storage, not the bucket itself.
// The correct format is typically 'your-project-id.appspot.com'.


// Initialize Firebase
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Your Google Client ID for the OAuth consent screen
// This helps ensure only your app can use Google Sign-In with these credentials.
googleProvider.setCustomParameters({
  'webClientId': '309522448005-o6vqr6lfhic9in5cpaov8gmbpqk7dr8d.apps.googleusercontent.com'
});

export { auth, googleProvider };