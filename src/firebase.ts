// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {FirebaseOptions} from "@firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig: FirebaseOptions = {
  apiKey: 'AIzaSyAHPku0i3zora2DH2Mdg5LXDYhb_mljGh0',
  authDomain: 'smileeye-v2.firebaseapp.com',
  databaseURL:
    'https://smileeye-v2-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'smileeye-v2',
  storageBucket: 'smileeye-v2.appspot.com',
  messagingSenderId: '1071334724068',
  appId: '1:1071334724068:web:1e5cec7ba89bc57c7077f1'
}

/**
 *   apiKey: 'AIzaSyAHPku0i3zora2DH2Mdg5LXDYhb_mljGh0',
 *   authDomain: 'smileeye-v2.firebaseapp.com',
 *   databaseURL:
 *     'https://smileeye-v2-default-rtdb.asia-southeast1.firebasedatabase.app',
 *   projectId: 'smileeye-v2',
 *   storageBucket: 'smileeye-v2.appspot.com',
 *   messagingSenderId: '1071334724068',
 *   appId: '1:1071334724068:web:1e5cec7ba89bc57c7077f1'
 */

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
