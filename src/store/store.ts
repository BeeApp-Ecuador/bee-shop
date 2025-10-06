import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/auth.Api";


export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApi.middleware),
});