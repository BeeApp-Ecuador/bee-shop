import { configureStore } from '@reduxjs/toolkit';
import { authApi, categoryApi, geoApi, profileApi } from './api/';

export const store = configureStore({
	reducer: {
		[authApi.reducerPath]: authApi.reducer,
		[geoApi.reducerPath]: geoApi.reducer,
		[profileApi.reducerPath]: profileApi.reducer,
		[categoryApi.reducerPath]: categoryApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(authApi.middleware)
			.concat(geoApi.middleware)
			.concat(profileApi.middleware)
			.concat(categoryApi.middleware),
});
