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
                url: `/application${url || ""}`,
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

export const applicationApi = createApi({
    reducerPath: "applicationApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["Applications", "ApplicationStatus"],
    endpoints: (builder) => ({
        // [POST] create application
        createApplication: builder.mutation({
            query: (formData) => ({
                url: "",
                method: "POST",
                data: formData,
            }),
            invalidatesTags: (result, error, { jobId }) => [
                "Applications",
                { type: "ApplicationStatus", id: jobId },
            ],
        }),

        // [GET] get applications by user
        getApplicationsByUser: builder.query({
            query: ({ page = 0, size = 10 }) => ({
                url: `/by-user?page=${page}&size=${size}`,
                method: "GET",
            }),
            providesTags: ["Applications"],
        }),

        // [POST] reapply for a job
        reapplyApplication: builder.mutation({
            query: ({ jobId, formData }) => ({
                url: `/${jobId}/reapply`,
                method: "POST",
                data: formData,
            }),
            invalidatesTags: (result, error, { jobId }) => [
                "Applications",
                { type: "ApplicationStatus", id: jobId },
            ],
        }),

        // [GET] check apply status for a job
        getApplyStatus: builder.query({
            query: (jobId) => ({
                url: `/status?job_id=${jobId}`,
                method: "GET",
            }),
            providesTags: (result, error, jobId) =>
                result ? [{ type: "ApplicationStatus", id: jobId }] : [],
        }),

        // [GET] get application detail by jobId (user’s own application)
        getApplicationDetailByJob: builder.query({
            query: (jobId) => ({
                url: `/detail/${jobId}`,
                method: "GET",
            }),
            providesTags: (result, error, jobId) =>
                result ? [{ type: "ApplicationStatus", id: jobId }] : [],
        }),

        // [GET] get all applications by job (admin/recruiter use-case)
        getApplicationsByJob: builder.query({
            query: ({ jobId, page = 0, size = 10 }) => ({
                url: `/by-job/${jobId}?page=${page}&size=${size}`,
                method: "GET",
            }),
            providesTags: ["Applications"],
        }),

        // [GET] get applications by company (admin or owner recruiter)
        getApplicationsByCompany: builder.query({
            query: ({ companyId, page = 0, size = 10 }) => ({
                url: `/by-company/${companyId}?page=${page}&size=${size}`,
                method: "GET",
            }),
            providesTags: ["Applications"],
        }),

        // [PATCH] update application status by staff/recruiter
        updateApplicationStatus: builder.mutation({
            query: ({ applicationId, status }) => ({
                url: `/status`,
                method: "PATCH",
                data: { applicationId, status },
            }),
            invalidatesTags: ["Applications"],
        }),
    }),
});

export const {
    useCreateApplicationMutation,
    useGetApplicationsByUserQuery,
    useReapplyApplicationMutation,
    useGetApplyStatusQuery,
    useLazyGetApplyStatusQuery,
    useGetApplicationDetailByJobQuery,
    useGetApplicationsByJobQuery,
    useGetApplicationsByCompanyQuery,
    useUpdateApplicationStatusMutation,
} = applicationApi;
