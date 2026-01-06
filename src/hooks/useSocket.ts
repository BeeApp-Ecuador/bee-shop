import { useContext, useEffect } from 'react';
import socketService from '../store/socketService';
import AuthContext from '../contexts/authContext';
import { getEnvVariables } from '../helpers/getEnvVariables';

export const useSocket = () => {
	const { user: shop, token } = useContext(AuthContext);
	const { VITE_URL } = getEnvVariables();

	useEffect(() => {
		// Solo conectar si hay usuario loggeado
		if (shop && shop._id) {
			console.log('Conectando socket para usuario:', shop.email);

			if (!socketService.getSocket()) {
				socketService.connect(`${VITE_URL}shop-user`, {
					token: token,
				});
			}
		}

		// Cleanup: desconectar solo si ya no hay usuario
		return () => {
			if (!shop || !shop._id) {
				socketService.disconnect();
				console.log('Socket desconectado');
			}
		};
	}, [shop, token, VITE_URL]);

	return socketService;
};
