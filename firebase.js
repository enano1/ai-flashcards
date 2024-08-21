// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB1O7pZzkAsUq7bBW3Kfv6iIHxkiovWY1I",
  authDomain: "flashcardsaas-d9022.firebaseapp.com",
  projectId: "flashcardsaas-d9022",
  storageBucket: "flashcardsaas-d9022.appspot.com",
  messagingSenderId: "952047964168",
  appId: "1:952047964168:web:092e0304fd2ec5fef341bd",
  measurementId: "G-ER1HVVCXYE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }