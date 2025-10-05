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
                    .map((c) => (typeof c === "string" ? c : c?.city_name))
                    .filter(Boolean);
                return Array.from(new Set(names)).sort((a, b) =>
                    a.localeCompare(b, "vi")
                );
            },
        }),
    }),
});

export const { useGetCitiesQuery } = locationApi;
