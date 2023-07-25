import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCVsONeVSRyT157Pzt9TT1lwUy8KTTbH30",
  authDomain: "annnexe-app.firebaseapp.com",
  projectId: "annnexe-app",
  storageBucket: "annnexe-app.appspot.com",
  messagingSenderId: "692989691682",
  appId: "1:692989691682:web:12df529877709f57edc77b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage};