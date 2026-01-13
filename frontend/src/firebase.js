import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCjNQ9A_WsbTteWh9tFjqb7qigthyzUk34",
    authDomain: "carent-beee7.firebaseapp.com",
    projectId: "carent-beee7",
    storageBucket: "carent-beee7.firebasestorage.app",
    messagingSenderId: "135999857354",
    appId: "1:135999857354:web:2316ac2c4273a8fdf3ca33",
    measurementId: "G-RBM998ZJPC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, auth, googleProvider };
