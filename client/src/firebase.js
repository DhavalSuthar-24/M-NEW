// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-1928f.firebaseapp.com",
  projectId: "mern-blog-1928f",
  storageBucket: "mern-blog-1928f.appspot.com",
  messagingSenderId: "168245218906",
  appId: "1:168245218906:web:c94c0d15f8a39715665263",
  measurementId: "G-LRVW7ZMCT5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
