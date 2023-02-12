// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAxjHShlbp4UUC-o4RWXRZfkDQgr7287fQ",
  authDomain: "car-service-85021.firebaseapp.com",
  projectId: "car-service-85021",
  storageBucket: "car-service-85021.appspot.com",
  messagingSenderId: "182001256811",
  appId: "1:182001256811:web:d040d8b938a4d02bbb642e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;