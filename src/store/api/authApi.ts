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
				url: 'api/v2/shop/login',
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

		verifyCode: builder.mutation({
			query: (body) => ({
				url: 'api/v2/messages/validate/code',
				method: 'POST',
				body,
			}),
		}),

		changePassword: builder.mutation({
			query: (body) => ({
				url: 'api/v2/shop/change/password',
				method: 'PUT',
				body,
				headers: {
					'Content-Type': 'application/json',
					Authorization: localStorage.getItem('tokenShop')!,
				},
			}),
		}),

		getSession: builder.query({
			query: () => ({
				url: 'api/v2/shop/authenticate',
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: localStorage.getItem('tokenShop')!,
				},
			}),
		}),

		logout: builder.mutation({
			query: () => ({
				url: 'api/v2/shop/logout',
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: localStorage.getItem('tokenShop')!,
				},
			}),
		}),
	}),
});

export const {
	useLazyCheckEmailQuery,
	useLoginMutation,
	useRegisterMutation,
	useSendEmailVerificationMutation,
	useVerifyCodeMutation,
	useChangePasswordMutation,
	useGetSessionQuery,
	useLogoutMutation,
} = authApi;
