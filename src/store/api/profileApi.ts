import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getEnvVariables } from '../../helpers/getEnvVariables';
const { VITE_URL } = getEnvVariables();

export const profileApi = createApi({
	reducerPath: 'profileApi',
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
			query: () => ({
				url: 'categories',
			}),
		}),
	}),
});
export const { useGetCategoriesQuery } = profileApi;
