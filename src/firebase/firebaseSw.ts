export let firebaseSwRegistration: ServiceWorkerRegistration | null = null;

export const registerFirebaseSW = async () => {
	if (!('serviceWorker' in navigator)) return;

	try {
		firebaseSwRegistration = await navigator.serviceWorker.register(
			'/shop/firebase-messaging-sw.js',
		);
		console.log('✅ Firebase SW registrado');
	} catch (err) {
		console.error('❌ SW error', err);
	}
};
