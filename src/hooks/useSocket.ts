import { useContext, useEffect } from 'react';
import AuthContext from '../contexts/authContext';
import { getEnvVariables } from '../helpers/getEnvVariables';
import socketService from '../store/socketService';

export const useSocket = () => {
	const { user: shop, token } = useContext(AuthContext);
	const { VITE_URL } = getEnvVariables();

	useEffect(() => {
		if (shop?._id && token) {
			socketService.connect(`${VITE_URL}shop-user`, {
				token,
			});
		}

		return () => {
			if (!shop?._id) {
				socketService.disconnect();
			}
		};
	}, [shop?._id, token, VITE_URL]);

	return socketService;
};
