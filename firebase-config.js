import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore, collection, doc, setDoc, getDoc, getDocs, addDoc, query, where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAW1BuCPywcW9rOdwScBg3r46oCKnCejds",
  authDomain: "project-b4619.firebaseapp.com",
  projectId: "project-b4619",
  storageBucket: "project-b4619.firebasestorage.app",
  messagingSenderId: "752389724021",
  appId: "1:752389724021:web:3a56e368c0ff18e463253c",
  measurementId: "G-8P6RNNPKL0"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export { collection, doc, setDoc, getDoc, getDocs, addDoc, query, where };
