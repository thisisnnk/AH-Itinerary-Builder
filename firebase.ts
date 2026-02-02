import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyArbhajCGpeSrJ_p3ZzkCBPZdxD8hKIkTM",
  authDomain: "ah-itinerary-builder.firebaseapp.com",
  projectId: "ah-itinerary-builder",
  storageBucket: "ah-itinerary-builder.firebasestorage.app",
  messagingSenderId: "1094346446196",
  appId: "1:1094346446196:web:a21739b1ffa725e75cc821"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);