import { createApi } from "@reduxjs/toolkit/query/react";
import api from "@/lib/api";

const axiosBaseQuery =
    () =>
    async ({ url, method = "GET", data, headers }, { signal }) => {
        try {
            const config = {
                url,
                method,
                data,
                signal,
                headers: {
                    "Content-Type": "application/json",
                    ...headers,
                },
            };
            const result = await api(config);
            return { data: result.data };
        } catch (axiosError) {
            return {
                error: {
                    status: axiosError.response?.status,
                    data: axiosError.response?.data || axiosError.message,
                },
            };
        }
    };

export const locationApi = createApi({
    reducerPath: "locationApi",
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        getCities: builder.query({
            query: () => ({ url: "/city", method: "GET" }),
            transformResponse: (data) => {
                const names = (Array.isArray(data) ? data : [])
                    .map((item) => {
                        if (typeof item === "string") return item;
                        return item?.city_name || item?.name || null;
                    })
                    .filter(Boolean);
                return names;
            },
        }),
        searchCities: builder.query({
            query: (keyword) => ({
                url: `/city/search?keyword=${encodeURIComponent(keyword)}`,
                method: "GET",
            }),
            transformResponse: (data) => {
                const names = (Array.isArray(data) ? data : [])
                    .map((item) => {
                        if (typeof item === "string") return item;
                        return item?.city_name || item?.name || null;
                    })
                    .filter(Boolean);
                return names;
            },
        }),
    }),
});

export const { useGetCitiesQuery, useLazySearchCitiesQuery } = locationApi;
