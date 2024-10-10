import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, onMessage, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'AIzaSyBB5oiIikZuS6K1fLcTkVfAbseSDABf5-E',
  authDomain: 'shelfcare-app.firebaseapp.com',
  projectId: 'shelfcare-app',
  storageBucket: 'shelfcare-app.appspot.com',
  messagingSenderId: '692637633391',
  appId: '1:692637633391:web:c65b8201a8366813d4769a',
  measurementId: 'G-C68VV0CHGH'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);
export { getToken, onMessage };
