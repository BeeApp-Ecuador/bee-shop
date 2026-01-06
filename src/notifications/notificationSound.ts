let audio: HTMLAudioElement | null = null;

export const playOrderSound = () => {
	console.log('play audio');
	if (!audio) {
		audio = new Audio('/sounds/new-order.wav');
		audio.volume = 1;
	}

	audio.currentTime = 0;
	audio.play().catch(() => {
		console.warn('Autoplay bloqueado hasta interacción del usuario');
	});
};
