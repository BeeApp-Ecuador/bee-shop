import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// import { getEnvVariables } from "../../helpers/getEnvVariables";
// const { REACT_APP_URL } = getEnvVariables();


//lazy query is use in button click
//normal query is use in component load

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({ baseUrl: "https://getbeeapp.com" }),
    endpoints: (builder) => ({

        checkEmail: builder.query({
            query: (params) => ({
                url: `/api/v2/shop/exist`,
                method: "GET",
                params,
            }),
        }),

        login: builder.mutation({
            query: (body) => ({
                url: "/auth/login",
                method: "POST",
                body,
            }),
        }),

        register: builder.mutation({
            query: (body) => ({
                url: "/auth/register",
                method: "POST",
                body,
            }),
        }),
    }),
});

export const { useLazyCheckEmailQuery, useLoginMutation, useRegisterMutation } = authApi;