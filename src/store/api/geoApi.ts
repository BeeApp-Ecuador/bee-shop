import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getEnvVariables } from '../../helpers/getEnvVariables';
const { VITE_URL } = getEnvVariables();

export const geoApi = createApi({
	reducerPath: 'geoApi',
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
	endpoints: (builder) => {
		return {
			getCountries: builder.query({
				query: () => ({
					url: `api/v2/country`,
				}),
			}),
			getStates: builder.query({
				query: (countryId) => ({
					url: `api/v2/province/${countryId}`,
				}),
			}),
			getCities: builder.query({
				query: (stateId) => ({
					url: `api/v2/canton/${stateId}`,
				}),
			}),
		};
	},
});

export const { useGetCountriesQuery, useLazyGetStatesQuery, useLazyGetCitiesQuery } = geoApi;
