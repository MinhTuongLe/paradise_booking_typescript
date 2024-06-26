// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBReRd8wCi6LtI732AReqZ8NU-XLDexkZY",
  authDomain: "paradise-booking-app-ts.firebaseapp.com",
  projectId: "paradise-booking-app-ts",
  storageBucket: "paradise-booking-app-ts.appspot.com",
  messagingSenderId: "326522237393",
  appId: "1:326522237393:web:5ae5392328f350fd0730f0",
  measurementId: "G-CWTM1BYVBR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseStorage = getStorage(app);
export const db = getFirestore(app);
