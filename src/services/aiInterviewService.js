import { createApi } from "@reduxjs/toolkit/query/react";
import api from "@/lib/api";

const axiosBaseQuery =
  (basePath = "") =>
  async ({ url, method = "GET", data, headers, responseType }, { signal }) => {
    try {
      const config = {
        url: `${basePath}${url || ""}`,
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

export const aiInterviewApi = createApi({
  reducerPath: "aiInterviewApi",
  baseQuery: axiosBaseQuery("/ai-interview"),
  tagTypes: ["InterviewHistory"],
  endpoints: builder => ({
    startInterview: builder.mutation({
      query: jobId => ({
        url: `/start?jobId=${encodeURIComponent(jobId)}`,
        method: "POST",
      }),
      invalidatesTags: ["InterviewHistory"],
    }),

    answerInterview: builder.mutation({
      query: formData => ({
        url: `/answer`,
        method: "POST",
        data: formData,
      }),
      invalidatesTags: ["InterviewHistory"],
    }),

    getInterviewHistory: builder.query({
      query: ({ jobId, limit = 10 }) => ({
        url: `/history${jobId ? `?jobId=${encodeURIComponent(jobId)}&limit=${limit}` : `?limit=${limit}`}`,
        method: "GET",
      }),
      providesTags: ["InterviewHistory"],
    }),

    getInterviewSessionDetail: builder.query({
      query: sessionId => ({
        url: `/history/${encodeURIComponent(sessionId)}`,
        method: "GET",
      }),
    }),

    getAnswerResult: builder.query({
      query: ({ jobId, sessionId, aiJobId }) => ({
        url: `/answer/result?jobId=${jobId}&sessionId=${sessionId}&aiJobId=${aiJobId}`,
        method: "GET",
      }),
      // Disable cache - always fetch fresh data for polling
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useStartInterviewMutation,
  useAnswerInterviewMutation,
  useGetInterviewHistoryQuery,
  useGetInterviewSessionDetailQuery,
  useLazyGetInterviewSessionDetailQuery,
  useGetAnswerResultQuery,
  useLazyGetAnswerResultQuery,
} = aiInterviewApi;
