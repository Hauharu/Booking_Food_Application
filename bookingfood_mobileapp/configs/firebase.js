// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getDatabase} from "firebase/database"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAeQQt8qtq1pSQZlNf3Uq6Xj2wSY9afIOI",
  authDomain: "chatapp-5634e.firebaseapp.com",
  databaseURL: "https://chatapp-5634e-default-rtdb.firebaseio.com",
  projectId: "chatapp-5634e",
  storageBucket: "chatapp-5634e.firebasestorage.app",
  messagingSenderId: "495920687570",
  appId: "1:495920687570:web:fe4c0471acf1c14f26c00b",
  measurementId: "G-X4YBX6WD3T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
export default db;