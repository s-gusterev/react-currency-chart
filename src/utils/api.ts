import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface IValutes {
  value: string;
  previousValue: string;
  date: string;
  index: number;
}

const APIURL = import.meta.env.VITE_API_URL;

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: APIURL }),
  reducerPath: 'api',
  tagTypes: ['Valutes'],
  endpoints: (build) => ({
    getValutes: build.query<
      IValutes[],
      { charCode: string; startDate: string; endDate: string }
    >({
      query: ({ charCode, startDate, endDate }) => ({
        url: `/currencies?charcode=${charCode}&startdate=${startDate}&enddate=${endDate}`,
      }),
      providesTags: ['Valutes'],
    }),
    getValutesAllYears: build.query<IValutes[], void>({
      query: () => ({
        url: '/currenciesallyears',
      }),
      providesTags: ['Valutes'],
    }),
  }),
});

export const { useGetValutesQuery, useGetValutesAllYearsQuery } = api;
