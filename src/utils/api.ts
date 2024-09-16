import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface IValutes {
  value: string;
  previousValue: string;
  date: string;
  index: number;
}

const APIURL = import.meta.env.VITE_API_URL;

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: APIURL,
  }),
  reducerPath: 'api',
  tagTypes: ['Valutes'],
  endpoints: (build) => ({
    // Получение валют за указанный промежуток времени
    getValutes: build.query<
      IValutes[],
      { charCode: string; startDate: string; endDate: string }
    >({
      query: ({ charCode, startDate, endDate }) => ({
        url: `/currencies`,
        params: {
          charcode: charCode,
          startdate: startDate,
          enddate: endDate,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ index }) => ({
                type: 'Valutes' as const,
                id: index,
              })),
              { type: 'Valutes', id: 'LIST' },
            ]
          : [{ type: 'Valutes', id: 'LIST' }],
    }),

    // Получение данных по валютам за все годы
    getValutesAllYears: build.query<IValutes[], void>({
      query: () => ({
        url: '/currenciesallyears',
      }),
      providesTags: (result) =>
        result
          ? result.map(({ index }) => ({ type: 'Valutes', id: index }))
          : [{ type: 'Valutes', id: 'ALL_YEARS' }],
    }),
  }),
});

export const { useGetValutesQuery, useGetValutesAllYearsQuery } = api;
