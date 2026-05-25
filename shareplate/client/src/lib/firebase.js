import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDemoSharePlate123',
  authDomain: 'shareplate-ai.firebaseapp.com',
  projectId: 'shareplate-ai',
  storageBucket: 'shareplate-ai.appspot.com',
  messagingSenderId: '123456789',
  appId: '1:123456789:web:abc123def456',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
export default app;
