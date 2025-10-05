import { createApi } from "@reduxjs/toolkit/query/react";
import api from "@/lib/api";

const axiosBaseQuery =
    () =>
    async (
        { url, method = "GET", data, headers, responseType },
        { signal }
    ) => {
        try {
            const config = {
                url: `/save-job${url || ""}`,
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

export const savedJobApi = createApi({
    reducerPath: "savedJobApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["SavedJobStatus", "SavedJobList"],
    endpoints: (builder) => ({
        getStatus: builder.query({
            query: (jobId) => ({
                url: `/status?job_id=${jobId}`,
                method: "GET",
            }),
            providesTags: (result, error, jobId) =>
                result ? [{ type: "SavedJobStatus", id: jobId }] : [],
        }),

        // Save
        saveJob: builder.mutation({
            query: ({ jobId }) => ({
                url: "/create",
                method: "POST",
                data: { job_id: jobId },
            }),
            invalidatesTags: (result, error, { jobId }) => [
                { type: "SavedJobStatus", id: jobId },
                { type: "SavedJobList" },
            ],
        }),

        // Unsave
        unsaveJob: builder.mutation({
            query: (jobId) => ({
                url: `?job_id=${jobId}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, jobId) => [
                { type: "SavedJobStatus", id: jobId },
                { type: "SavedJobList" },
            ],
        }),

        // Optional: Get all saved jobs by current user
        getSavedJobsByUser: builder.query({
            query: () => ({
                url: "/by-user",
                method: "GET",
            }),
            providesTags: ["SavedJobStatus", "SavedJobList"],
        }),
    }),
});

export const {
    useGetStatusQuery,
    useLazyGetStatusQuery, 
    useSaveJobMutation,
    useUnsaveJobMutation,
    useGetSavedJobsByUserQuery,
} = savedJobApi;