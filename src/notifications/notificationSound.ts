// audioManager.ts
let audio: HTMLAudioElement | null = null;
let audioUnlocked = false;
let listenerAttached = false;

export const initAudioUnlock = () => {
	if (listenerAttached) return;

	const unlock = async () => {
		if (audioUnlocked) return;

		try {
			audio = new Audio('/shop/sounds/new-order.wav');
			audio.preload = 'auto';
			audio.volume = 0.2;

			await audio.play();
			audio.pause();
			audio.currentTime = 0;

			audioUnlocked = true;
			console.log('🔓 Audio desbloqueado');

			document.removeEventListener('pointerdown', unlock);
			document.removeEventListener('keydown', unlock);
		} catch (e) {
			console.warn('❌ No se pudo desbloquear el audio', e);
		}
	};

	document.addEventListener('pointerdown', unlock);
	document.addEventListener('keydown', unlock);

	listenerAttached = true;
	console.log('🎧 Listener global de audio registrado');
};

export const playOrderSound = () => {
	if (!audioUnlocked || !audio) {
		console.warn('🔇 Audio bloqueado');
		return;
	}

	audio.currentTime = 0;
	audio.play();
};
