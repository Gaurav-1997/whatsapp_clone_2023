import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDj5cqigU4uaAhM1-RH7N-N_WRii2FIdhU",
  authDomain: "whatsapp-clone-45894.firebaseapp.com",
  projectId: "whatsapp-clone-45894",
  storageBucket: "whatsapp-clone-45894.appspot.com",
  messagingSenderId: "642176514080",
  appId: "1:642176514080:web:8b6e86f6194457657b6445",
  measurementId: "G-8498FELSM1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
// const analytics = getAnalytics(app);