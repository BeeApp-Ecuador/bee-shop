import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { getEnvVariables } from '../../helpers/getEnvVariables';
import { ShopType } from '../../type/shop-type';
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
					params: { available: 'shop' },
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
			searchAddress: builder.query({
				query: ({ query, lat, lon }) => {
					const shopSaved = JSON.parse(
						localStorage.getItem('facit_authUsername')!,
					) as ShopType;

					return {
						url: `api/v2/photon/shop/search`,
						params: {
							q: query,
							limit: 10,
							country: shopSaved.country,
							lat,
							lon,
						},
						headers: {
							'Content-Type': 'application/json',
							Authorization: localStorage.getItem('tokenShop')!,
						},
					};
				},
			}),
		};
	},
});

export const {
	useGetCountriesQuery,
	useLazyGetStatesQuery,
	useLazyGetCitiesQuery,
	useLazySearchAddressQuery,
} = geoApi;
