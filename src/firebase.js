// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC5HoDV6NoN0yByWXUCD0BaQOoc14wBHGQ",
  authDomain: "poop-logger-ad469.firebaseapp.com",
  projectId: "poop-logger-ad469",
  storageBucket: "poop-logger-ad469.firebasestorage.app",
  messagingSenderId: "583124381034",
  appId: "1:583124381034:web:e0c6711f4ea5a944fd8913"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);