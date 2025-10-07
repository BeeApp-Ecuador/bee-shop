import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getEnvVariables } from '../../helpers/getEnvVariables';
const { VITE_URL } = getEnvVariables();

export const geoApi = createApi({
	reducerPath: 'geoApi',
	baseQuery: fetchBaseQuery({ baseUrl: VITE_URL }),
	endpoints: (builder) => ({
		getCountries: builder.query({
			query: () => ({
				url: `api/v2/countries`,
			}),
		}),
	}),
});

export const { useGetCountriesQuery } = geoApi;
