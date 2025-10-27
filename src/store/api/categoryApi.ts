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
			query: ({ page = 1, limit = 10, status = true }) => ({
				url: 'api/v2/shop/product/categories',
				params: { page, limit, status },
				headers: {
					'Content-Type': 'application/json',
					Authorization: localStorage.getItem('token')!,
				},
			}),
		}),
		createCategory: builder.mutation({
			query: (category) => ({
				url: 'api/v2/shop/product/category',
				method: 'POST',
				body: category,
				headers: {
					'Content-Type': 'application/json',
					Authorization: localStorage.getItem('token')!,
				},
			}),
		}),
		changeStatusCategory: builder.mutation({
			query: (categoryId) => ({
				url: `api/v2/shop/product/category/${categoryId}`,
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: localStorage.getItem('token')!,
				},
			}),
		}),
	}),
});
export const { useGetCategoriesQuery, useCreateCategoryMutation, useChangeStatusCategoryMutation } =
	categoryApi;
