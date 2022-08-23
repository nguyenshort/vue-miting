// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {FirebaseOptions} from "@firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyDcIX6hKPXULPCCxMXdyGhVzn35fM6oUIQ",
  authDomain: "miting-9823a.firebaseapp.com",
  projectId: "miting-9823a",
  storageBucket: "miting-9823a.appspot.com",
  messagingSenderId: "1084165343007",
  appId: "1:1084165343007:web:b572e00e10a949a402122a",
  measurementId: "G-5JHFR7RVKL",
  databaseURL:
    'https://miting-9823a-default-rtdb.asia-southeast1.firebasedatabase.app',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
