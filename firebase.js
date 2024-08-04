// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { fireStore, getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCdyNGNt7t2FeB2LzF4eLSQ1zCvyUpONUQ",
    authDomain: "pantry-tracker-2487b.firebaseapp.com",
    projectId: "pantry-tracker-2487b",
    storageBucket: "pantry-tracker-2487b.appspot.com",
    messagingSenderId: "582800484731",
    appId: "1:582800484731:web:e4d15ff7ea3d72128775de",
    measurementId: "G-X0MQ394569"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };