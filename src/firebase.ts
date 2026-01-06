import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';
import { getEnvVariables } from './helpers/getEnvVariables';
const {
	VITE_FIREBASE_API_KEY,
	VITE_FIREBASE_AUTH_DOMAIN,
	VITE_FIREBASE_PROJECT_ID,
	VITE_FIREBASE_STORAGE_BUCKET,
	VITE_FIREBASE_MESSAGING_SENDER_ID,
	VITE_FIREBASE_APP_ID,
} = getEnvVariables();

const firebaseConfig = {
	apiKey: VITE_FIREBASE_API_KEY,
	authDomain: VITE_FIREBASE_AUTH_DOMAIN,
	projectId: VITE_FIREBASE_PROJECT_ID,
	storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: VITE_FIREBASE_APP_ID,
};

export const firebaseApp = initializeApp(firebaseConfig);
export const messaging = getMessaging(firebaseApp);
