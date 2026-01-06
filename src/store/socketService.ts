// socketService.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

const connect = (url: string, queryParams?: any) => {
	console.log(url);
	console.log(queryParams);
	socket = io(url, { query: queryParams, transports: ['websocket'], reconnection: true });

	socket.on('connect', () => {
		console.log('Socket conectado');
	});

	socket.on('disconnect', () => {
		console.log('Socket desconectado');
	});
};

const disconnect = () => {
	if (socket) {
		socket.disconnect();
		socket = null;
	}
};

const on = (event: string, callback: (data: any) => void) => {
	if (socket) {
		socket.on(event, callback);
	}
};

const off = (event: string) => {
	if (socket) {
		socket.off(event);
	}
};

const emit = (event: string, data: any) => {
	if (socket) {
		socket.emit(event, data);
	}
};

const getSocket = () => socket;

// Asigna el objeto a una variable antes de exportarlo
const socketService = {
	connect,
	disconnect,
	on,
	off,
	emit,
	getSocket,
};

export default socketService;
