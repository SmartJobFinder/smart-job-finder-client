import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const baseQuery = fetchBaseQuery({
    baseUrl: "https://6873a019c75558e27354be00.mockapi.io/api/v1/",
    prepareHeaders: (headers) => {
        const authToken = Cookies.get("authToken") || "";
        if (authToken) {
            headers.set("Authorization", `Bearer ${authToken}`);
        }
        return headers;
    },
});

export const savedCompaniesApi = createApi({
    reducerPath: "savedCompaniesApi",
    baseQuery,
    tagTypes: ["SavedCompanies"],
    endpoints: (builder) => ({
        getSavedCompanies: builder.query({
            query: () => "companySaved",
            providesTags: ["SavedCompanies"],
        }),
        saveCompany: builder.mutation({
            query: (companyId) => ({
                url: "companySaved",
                method: "POST",
                body: { companyId },
            }),
            invalidatesTags: ["SavedCompanies"],
        }),
        deleteSavedCompany: builder.mutation({
            query: (savedCompanyId) => ({
                url: `companySaved/${savedCompanyId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["SavedCompanies"],
        }),
    }),
});

export const {
    useGetSavedCompaniesQuery,
    useSaveCompanyMutation,
    useDeleteSavedCompanyMutation,
} = savedCompaniesApi;
