// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASVjG3axR4xqxKidaKT4Yc1Hs4tqdDjHI",
  authDomain: "inventory-management-app-accc3.firebaseapp.com",
  projectId: "inventory-management-app-accc3",
  storageBucket: "inventory-management-app-accc3.appspot.com",
  messagingSenderId: "1046790344012",
  appId: "1:1046790344012:web:8fd58f65c38dd1606c53e9",
  //measurementId: "G-5MDMSVK5D8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const firestore = getFirestore(app);
export {firestore};