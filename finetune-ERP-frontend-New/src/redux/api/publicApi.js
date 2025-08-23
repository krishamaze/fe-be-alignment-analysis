import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import END_POINTS from '../../utils/Endpoints';

export const publicApi = createApi({
  reducerPath: 'publicApi',
  baseQuery: fetchBaseQuery({ baseUrl: END_POINTS.API_BASE_URL }),
  endpoints: (builder) => ({
    getBrands: builder.query({ query: () => '/brands/' }),
    getStores: builder.query({ query: () => '/stores/' }),
    getSpares: builder.query({ query: () => '/spares/' }),
  }),
});

export const { useGetBrandsQuery, useGetStoresQuery, useGetSparesQuery } =
  publicApi;
