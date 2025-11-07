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
			query: ({
				page = 1,
				limit = 10,
				status = 'AVAILABLE',
				search = '',
				productCategory = '',
			}) => {
				const params: Record<string, any> = {
					page,
					limit,
					search,
				};
				if (status !== null && status !== undefined) params.status = status;
				if (productCategory !== '') params.productCategory = productCategory;
				return {
					url: 'api/v2/shop/products',
					params,
					headers: {
						'Content-Type': 'application/json',
						Authorization: localStorage.getItem('token')!,
					},
				};
			},
			keepUnusedDataFor: 0,
			// refetchOnMountOrArgChange: true,
		}),
		createProduct: builder.mutation({
			query: (product) => ({
				url: 'api/v2/shop/product',
				method: 'POST',
				body: product,
				headers: {
					Authorization: localStorage.getItem('token')!,
				},
			}),
		}),
		addOptionsToProduct: builder.mutation({
			query: ({ productId, body }: { productId: string; body: any }) => ({
				url: `api/v2/shop/product/options/${productId}`,
				method: 'PUT',
				body: body,
				headers: {
					'Content-Type': 'application/json',
					Authorization: localStorage.getItem('token')!,
				},
			}),
		}),
		deleteProduct: builder.mutation({
			query: ({ productId, body }: { productId: string; body: any }) => ({
				url: `api/v2/shop/product/${productId}`,
				method: 'DELETE',
				headers: {
					Authorization: localStorage.getItem('token')!,
				},
				body: body,
			}),
		}),
	}),
});

export const {
	useGetProductsQuery,
	useCreateProductMutation,
	useAddOptionsToProductMutation,
	useDeleteProductMutation,
} = productsApi;
