import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getEnvVariables } from '../../helpers/getEnvVariables';
const { VITE_URL } = getEnvVariables();

export const productsApi = createApi({
	reducerPath: 'productsApi',
	baseQuery: fetchBaseQuery({
		baseUrl: VITE_URL,
		responseHandler: async (response) => {
			const data = await response.json();
			return {
				...data,
				meta: {
					status: response.status,
				},
			};
		},
	}),
	endpoints: (builder) => ({
		getProducts: builder.query({
			query: ({ page = 1, limit = 10, status = true, name = '' }) => {
				const params: Record<string, any> = {
					page,
					limit,
					name,
				};
				if (status !== null && status !== undefined) params.status = status;
				return {
					url: 'api/v2/shop/products',
					params,
					headers: {
						'Content-Type': 'application/json',
						Authorization: localStorage.getItem('token')!,
					},
				};
			},
		}),
	}),
});

export const { useGetProductsQuery } = productsApi;
