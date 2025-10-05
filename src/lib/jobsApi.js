import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const jobsApi = createApi({
  reducerPath: 'jobsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://687076977ca4d06b34b6dc20.mockapi.io/api/v1/' }),
  endpoints: (builder) => ({
    getJobs: builder.query({
      query: () => 'jobs',
    }),
    getJobById: builder.query({
      query: (id) => `jobs/${id}`,
    }),
  }),
});

export const { useGetJobsQuery, useGetJobByIdQuery } = jobsApi;