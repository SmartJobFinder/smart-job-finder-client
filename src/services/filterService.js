import { createApi } from "@reduxjs/toolkit/query/react";
import api from "@/lib/api";

// axios base query
const axiosBaseQuery =
    () =>
    async ({ url, method = "GET", data, headers }, { signal }) => {
        try {
            const config = {
                url ,
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

export const filterApi = createApi({
    reducerPath: "filterApi",
    baseQuery: axiosBaseQuery(),
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: () => ({ url: "/category", method: "GET" }),
        }),
        getLevels: builder.query({
            query: () => ({ url: "/levels", method: "GET" }),
        }),
        getWorkTypes: builder.query({
            query: () => ({ url: "/worktypes", method: "GET" }),
        }),
        getSkillsByCategory: builder.query({
            query: (name) => ({
                url: `/skill/by-category?name=${encodeURIComponent(name)}`,
                method: "GET",
            }),
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useGetLevelsQuery,
    useGetWorkTypesQuery,
    useLazyGetSkillsByCategoryQuery,
} = filterApi;
