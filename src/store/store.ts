import { configureStore } from '@reduxjs/toolkit';
import { authApi, geoApi } from './api/';

export const store = configureStore({
	reducer: {
		[authApi.reducerPath]: authApi.reducer,
		[geoApi.reducerPath]: geoApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(authApi.middleware).concat(geoApi.middleware),
});
