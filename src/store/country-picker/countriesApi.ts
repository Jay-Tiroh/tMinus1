import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Country = {
  code: string;
  dialCode: string;
  flag: string;
  name: string;
};

export const countriesApi = createApi({
  reducerPath: "countriesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://restcountries.com/v3.1/" }),
  endpoints: (builder) => ({
    getCountries: builder.query<Country[], void>({
      query: () => "all?fields=name,cca2,idd,flag",
      transformResponse: (response: any[]) => {
        return response
          .map((item) => {
            const root = item.idd?.root || "";
            const suffix =
              item.idd?.suffixes?.length === 1 ? item.idd.suffixes[0] : "";
            return {
              code: item.cca2,
              dialCode: `${root}${suffix}`,
              flag: item.flag,
              name: item.name.common,
            };
          })
          .filter((c) => c.name && c.flag)
          .sort((a, b) => a.name.localeCompare(b.name));
      },
    }),
  }),
});

export const { useGetCountriesQuery } = countriesApi;
