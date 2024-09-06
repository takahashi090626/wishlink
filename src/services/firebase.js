import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCJnG8kiUdOPaNJnVR5q73EoKZPxmmpYj4",
  authDomain: "wishlink-706ca.firebaseapp.com",
  projectId: "wishlink-706ca",
  storageBucket: "wishlink-706ca.appspot.com",
  messagingSenderId: "224359171724",
  appId: "1:224359171724:web:15fb0ae6988fc0dd631da9",
  measurementId: "G-M3XBZFXSQ7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);