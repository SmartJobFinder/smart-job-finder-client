// src/services/interviewService.js
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
                url: `/interviews${url || ""}`, // prefix interviews
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

export const interviewApi = createApi({
    reducerPath: "interviewApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["InterviewsCompany", "InterviewsCandidate"],
    endpoints: (builder) => ({
        // [POST] tạo interview (RECRUITER/ADMIN)
        createInterview: builder.mutation({
            query: (
                payload /* { jobId, companyId, candidateId, scheduledAt, durationMinutes } */
            ) => ({
                url: "",
                method: "POST",
                data: payload,
            }),
            invalidatesTags: ["InterviewsCompany", "InterviewsCandidate"],
        }),

        // [GET] danh sách interview theo company (RECRUITER/ADMIN)
        getInterviewsByCompany: builder.query({
            query: ({
                companyId,
                page = 0,
                size = 20,
                sort = "scheduledAt,desc",
            }) => ({
                url: `/company/${companyId}?page=${page}&size=${size}&sort=${encodeURIComponent(
                    sort
                )}`,
                method: "GET",
            }),
            providesTags: ["InterviewsCompany"],
        }),

        // [GET] danh sách interview của chính candidate (CANDIDATE/ADMIN)
        getInterviewsForCandidate: builder.query({
            query: ({
                page = 0,
                size = 20,
                sort = "scheduledAt,desc",
            } = {}) => ({
                url: `/candidate?page=${page}&size=${size}&sort=${encodeURIComponent(
                    sort
                )}`,
                method: "GET",
            }),
            providesTags: ["InterviewsCandidate"],
        }),

        // [PATCH] cập nhật status (role-dependent)
        updateInterviewStatus: builder.mutation({
            query: ({ interviewId, status }) => ({
                url: `/${interviewId}/status`,
                method: "PATCH",
                data: { status },
            }),
            invalidatesTags: ["InterviewsCompany", "InterviewsCandidate"],
        }),

        // [GET] metadata cho page join/embed
        getMeta: builder.query({
            query: (interviewId) => ({
                url: `/${interviewId}/meta`,
                method: "GET",
            }),
            // không nên cache quá lâu vì có thể cập nhật status/meetingUrl
            providesTags: (result, error, id) =>
                result ? [{ type: "InterviewsCandidate", id }] : [],
        }),
    }),
});

export const {
    useCreateInterviewMutation,
    useGetInterviewsByCompanyQuery,
    useGetInterviewsForCandidateQuery,
    useUpdateInterviewStatusMutation,
    useGetMetaQuery,
} = interviewApi;
