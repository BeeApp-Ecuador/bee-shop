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
			query: ({ page = 1, limit = 10, buyStatus = 'DELIVERY', search = '' }) => {
				const params: Record<string, any> = {
					page,
					limit,
					// search,
				};
				if (buyStatus !== null && buyStatus !== undefined) params.buyStatus = buyStatus;
				return {
					url: 'api/v2/shop/order',
					params,
					headers: {
						'Content-Type': 'application/json',
						Authorization: localStorage.getItem('tokenShop')!,
					},
				};
			},
			keepUnusedDataFor: 0,
		}),
		changeStatus: builder.mutation({
			query: ({ orderId, body }: { orderId: string; status: string }) => {
				return {
					url: `api/v2/shop/order/status/${orderId}`,
					method: 'PUT',
					body: body,
					headers: {
						'Content-Type': 'application/json',
						Authorization: localStorage.getItem('tokenShop')!,
					},
				};
			},
		}),
	}),
});
export const { useGetOrdersQuery, useChangeStatusMutation } = ordersApi;
