import { configureStore } from '@reduxjs/toolkit';
import { authApi, categoryApi, geoApi, ordersApi, productsApi, profileApi } from './api/';

export const store = configureStore({
	reducer: {
		[authApi.reducerPath]: authApi.reducer,
		[geoApi.reducerPath]: geoApi.reducer,
		[profileApi.reducerPath]: profileApi.reducer,
		[categoryApi.reducerPath]: categoryApi.reducer,
		[productsApi.reducerPath]: productsApi.reducer,
		[ordersApi.reducerPath]: ordersApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(authApi.middleware)
			.concat(geoApi.middleware)
			.concat(profileApi.middleware)
			.concat(categoryApi.middleware)
			.concat(productsApi.middleware)
			.concat(ordersApi.middleware),
});
