import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getEnvVariables } from '../../helpers/getEnvVariables';
const { VITE_URL } = getEnvVariables();

export const categoryApi = createApi({
	reducerPath: 'categoryApi',
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
		getCategories: builder.query({
			query: ({ page = 1, limit = 10, status = true, name = '' }) => {
				const params: Record<string, any> = {
					page,
					limit,
					name,
				};

				if (status !== null && status !== undefined) params.status = status;

				return {
					url: 'api/v2/shop/product/categories',
					params,
					headers: {
						'Content-Type': 'application/json',
						Authorization: localStorage.getItem('tokenShop')!,
					},
				};
			},
		}),

		createCategory: builder.mutation({
			query: (category) => ({
				url: 'api/v2/shop/product/category',
				method: 'POST',
				body: category,
				headers: {
					'Content-Type': 'application/json',
					Authorization: localStorage.getItem('tokenShop')!,
				},
			}),
		}),
		changeStatusCategory: builder.mutation({
			query: (categoryId) => ({
				url: `api/v2/shop/product/category/${categoryId}`,
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: localStorage.getItem('tokenShop')!,
				},
			}),
		}),
		updateCategory: builder.mutation({
			query: ({ categoryId, category }) => ({
				url: `api/v2/shop/product/category/${categoryId}`,
				method: 'PUT',
				body: category,
				headers: {
					'Content-Type': 'application/json',
					Authorization: localStorage.getItem('tokenShop')!,
				},
			}),
		}),
	}),
});
export const {
	useGetCategoriesQuery,
	useCreateCategoryMutation,
	useChangeStatusCategoryMutation,
	useUpdateCategoryMutation,
} = categoryApi;
