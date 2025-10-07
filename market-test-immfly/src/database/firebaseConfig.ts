import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBhFgfzJH-HX5FxFaFe06NyiHkeMN6BNP8",
  authDomain: "market-test-immfly.firebaseapp.com",
  projectId: "market-test-immfly",
  storageBucket: "market-test-immfly.firebasestorage.app",
  messagingSenderId: "327169992098",
  appId: "1:327169992098:web:faac1878d825a22d233efb"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;