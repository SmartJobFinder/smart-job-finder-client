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
  endpoints: (builder) => ({
    startInterview: builder.mutation({
      query: (jobId) => ({
        url: `/start?jobId=${encodeURIComponent(jobId)}`,
        method: "POST",
      }),
    }),

    answerInterview: builder.mutation({
      query: (formData) => ({
        url: `/answer`,
        method: "POST",
        data: formData,
      }),
    }),
  }),
});

export const { useStartInterviewMutation, useAnswerInterviewMutation } =
  aiInterviewApi;
