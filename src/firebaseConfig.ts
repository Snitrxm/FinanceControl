import { getFirestore } from '@firebase/firestore';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.firebaseApiKey,
  authDomain: "finances-6b2b0.firebaseapp.com",
  projectId: "finances-6b2b0",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

