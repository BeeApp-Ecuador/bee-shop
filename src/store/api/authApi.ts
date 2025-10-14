import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getEnvVariables } from '../../helpers/getEnvVariables';
const { VITE_URL } = getEnvVariables();

export const authApi = createApi({
	reducerPath: 'authApi',
	baseQuery: fetchBaseQuery({ baseUrl: VITE_URL }),
	endpoints: (builder) => ({
		checkEmail: builder.query({
			query: (params) => ({
				url: `api/v2/shop/exist`,
				method: 'GET',
				params,
			}),
		}),

		login: builder.mutation({
			query: (body) => ({
				url: 'auth/login',
				method: 'POST',
				body,
			}),
		}),

		register: builder.mutation({
			query: (body) => ({
				url: 'api/v2/shop',
				method: 'POST',
				body,
			}),
		}),
		sendEmailVerification: builder.mutation({
			query: (body) => ({
				url: 'api/v2/messages/validate/email',
				method: 'POST',
				body,
			}),
		}),
	}),
});

export const {
	useLazyCheckEmailQuery,
	useLoginMutation,
	useRegisterMutation,
	useSendEmailVerificationMutation,
} = authApi;
