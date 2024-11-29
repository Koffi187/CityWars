import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyADqqPABCHWgBRVuHr7E54w7WJTM2StCl4",
  authDomain: "citywars-c2cab.firebaseapp.com",
  projectId: "citywars-c2cab",
  storageBucket: "citywars-c2cab.firebasestorage.app",
  messagingSenderId: "564672788573",
  appId: "1:564672788573:web:074fa1fe520ddf9f5835b4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);