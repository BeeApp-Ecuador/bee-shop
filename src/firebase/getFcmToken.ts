import { getToken } from 'firebase/messaging';
import { messaging } from '../firebase';
import { getEnvVariables } from '../helpers/getEnvVariables';
import { firebaseSwRegistration } from './firebaseSw';

const { VITE_FIREBASE_VAPID_KEY } = getEnvVariables();

export const getFcmToken = async (): Promise<string | null> => {
	console.log('entra al getfcm token');
	try {
		// Espera a que el SW esté listo
		await navigator.serviceWorker.ready;

		if (!firebaseSwRegistration) {
			console.warn('Service Worker no disponible');
			return null;
		}

		const permission = await Notification.requestPermission();
		if (permission !== 'granted') {
			console.warn('Permiso de notificaciones denegado');
			return null;
		}

		const token = await getToken(messaging, {
			vapidKey: VITE_FIREBASE_VAPID_KEY,
			serviceWorkerRegistration: firebaseSwRegistration,
		});

		if (token) {
			console.log('✅ FCM Token:', token);
			return token;
		}

		return null;
	} catch (error) {
		console.error('❌ Error obteniendo FCM token', error);
		return null;
	}
};
