import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getEnvVariables } from '../../helpers/getEnvVariables';
const { VITE_URL } = getEnvVariables();

export const ordersApi = createApi({
	reducerPath: 'ordersApi',
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
		getOrders: builder.query({
			query: ({ page = 1, limit = 10, status = 'PENDING', search = '' }) => {
				const params: Record<string, any> = {
					page,
					limit,
					search,
				};
				if (status !== null && status !== undefined) params.status = status;
				return {
					url: 'api/v2/shop/orders',
					params,
					headers: {
						'Content-Type': 'application/json',
						Authorization: localStorage.getItem('tokenShop')!,
					},
				};
			},
			keepUnusedDataFor: 0,
		}),
	}),
});
export const { useGetOrdersQuery } = ordersApi;
