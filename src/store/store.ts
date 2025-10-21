import { configureStore } from '@reduxjs/toolkit';
import { authApi, geoApi, profileApi } from './api/';

export const store = configureStore({
	reducer: {
		[authApi.reducerPath]: authApi.reducer,
		[geoApi.reducerPath]: geoApi.reducer,
		[profileApi.reducerPath]: profileApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(authApi.middleware)
			.concat(geoApi.middleware)
			.concat(profileApi.middleware),
});
