// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBxjA4RnXSQFngvFdT8tcnnF9APfATU3V4",
    authDomain: "pantry-app-2ae8f.firebaseapp.com",
    projectId: "pantry-app-2ae8f",
    storageBucket: "pantry-app-2ae8f.appspot.com",
    messagingSenderId: "500744369654",
    appId: "1:500744369654:web:acd08bb1397dba9de203d7",
    measurementId: "G-S703QWP7N9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}