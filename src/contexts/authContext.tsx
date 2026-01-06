import React, { createContext, FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { getUserDataWithUsername, IUserProps } from '../common/data/userDummyData';
import { ShopType } from '../type/shop-type';

export interface IAuthContextProps {
	user: ShopType;
	setUser?: React.Dispatch<React.SetStateAction<ShopType>>;
	userData: Partial<IUserProps>;
	token: string | null;
	setToken?: React.Dispatch<React.SetStateAction<string | null>>;
	fcmToken?: string | null;
	setFcmToken?: React.Dispatch<React.SetStateAction<string | null>>;
}

const AuthContext = createContext<IAuthContextProps>({} as IAuthContextProps);

interface IAuthContextProviderProps {
	children: ReactNode;
}

export const AuthContextProvider: FC<IAuthContextProviderProps> = ({ children }) => {
	const [shop, setShop] = useState<ShopType>(() => {
		const saved = localStorage.getItem('facit_authUsername');
		return saved ? (JSON.parse(saved) as ShopType) : ({} as ShopType);
	});
	const [token, setToken] = useState<string | null>(() => {
		const savedToken = localStorage.getItem('tokenShop');
		return savedToken ? savedToken : null;
	});
	const [fcmToken, setFcmToken] = useState<string | null>(() => {
		const savedFcmToken = localStorage.getItem('fcmTokenShop');
		return savedFcmToken ? savedFcmToken : null;
	});

	const [userData, setUserData] = useState<Partial<IUserProps>>({});

	// 🔹 Guarda el valor en localStorage cuando cambia
	useEffect(() => {
		localStorage.setItem('facit_authUsername', JSON.stringify(shop));
		localStorage.setItem('tokenShop', token ?? '');
		localStorage.setItem('fcmTokenShop', fcmToken ?? '');
	}, [shop, token, fcmToken]);

	// 🔹 Actualiza los datos del usuario cuando cambia shop
	useEffect(() => {
		if (shop) {
			setUserData(getUserDataWithUsername(shop.email));
		} else {
			setUserData({});
		}
	}, [shop]);

	const value = useMemo(
		() => ({
			user: shop,
			setUser: setShop,
			token,
			setToken,
			userData,
			fcmToken,
			setFcmToken,
		}),
		[shop, token, userData, fcmToken],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
