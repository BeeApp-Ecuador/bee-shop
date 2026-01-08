import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

const connect = (url: string, queryParams?: any) => {
	if (socket) return socket;

	socket = io(url, {
		query: queryParams,
		transports: ['websocket'],
		reconnection: true,
	});

	socket.on('connect', () => {
		console.log('Socket conectado:', socket?.id);
	});

	socket.on('disconnect', () => {
		console.log('Socket desconectado');
	});

	socket.on('order', (data) => {
		console.log('Nueva orden:', data);
		// Aquí NO reproduces sonido todavía
	});

	return socket;
};

const disconnect = () => {
	socket?.disconnect();
	socket = null;
};

const getSocket = () => socket;

export default {
	connect,
	disconnect,
	getSocket,
};
