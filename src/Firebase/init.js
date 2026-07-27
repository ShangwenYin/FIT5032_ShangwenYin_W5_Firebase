import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBl3okaNVY4ogrq8yCegqwVm3zoYK0v6W0",
  authDomain: "shangwenyin-week5.firebaseapp.com",
  projectId: "shangwenyin-week5",
  storageBucket: "shangwenyin-week5.firebasestorage.app",
  messagingSenderId: "789824078163",
  appId: "1:789824078163:web:64a8ec33046c27e949a1a6"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);