import React, { createContext, FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { getUserDataWithUsername, IUserProps } from '../common/data/userDummyData';
import { ShopType } from '../type/shop-type';

export interface IAuthContextProps {
	user: ShopType;
	setUser?: React.Dispatch<React.SetStateAction<ShopType>>;
	userData: Partial<IUserProps>;
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

	const [userData, setUserData] = useState<Partial<IUserProps>>({});

	// 🔹 Guarda el valor en localStorage cuando cambia
	useEffect(() => {
		localStorage.setItem('facit_authUsername', JSON.stringify(shop));
	}, [shop]);

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
			userData,
		}),
		[shop, userData],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
