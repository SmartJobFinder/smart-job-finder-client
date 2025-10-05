import { createApi } from "@reduxjs/toolkit/query/react";
import api from "@/lib/api";

const axiosBaseQuery =
    () =>
    async ({ url, method = "GET", data, headers, responseType }, { signal }) => {
        try {
            const config = {
                url: `/cv-templates${url || ""}`, 
                method,
                data,
                signal,
                responseType: responseType || "json",
                headers: { ...headers },
            };

            if (data instanceof FormData) {
                delete config.headers?.["Content-Type"];
            } else {
                config.headers = {
                    "Content-Type": "application/json",
                    ...headers,
                };
            }

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

export const cvTemplateApi = createApi({
    reducerPath: "cvTemplateApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["CvTemplates", "CvPreview"],
    refetchOnFocus: true,
    refetchOnReconnect: true,
    endpoints: (builder) => ({
        getAllTemplates: builder.query({
            query: () => ({
                url: "",
                method: "GET",
            }),
            providesTags: ["CvTemplates"],
        }),

        getPreview: builder.query({
            query: (templateId) => ({
                url: `/${templateId}/preview`,
                method: "GET",
                headers: { Accept: "text/html" },
            }),
            providesTags: ["CvPreview"],
        }),

        downloadTemplate: builder.mutation({
            query: (templateId) => ({
                url: `/${templateId}/download`,
                method: "GET",
                responseType: "blob",
                headers: { Accept: "application/pdf" },
            }),
            keepUnusedDataFor: 0,
        }),
    }),
});

export const {
    useGetAllTemplatesQuery,
    useGetPreviewQuery,
    useDownloadTemplateMutation,
} = cvTemplateApi;
