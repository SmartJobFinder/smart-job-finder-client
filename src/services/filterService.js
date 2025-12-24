import { createApi } from "@reduxjs/toolkit/query/react";
import api from "@/lib/api";

// axios base query
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

export const filterApi = createApi({
  reducerPath: "filterApi",
  baseQuery: axiosBaseQuery(),
  endpoints: builder => ({
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
      query: name => ({
        url: `/skill/by-category?name=${encodeURIComponent(name)}`,
        method: "GET",
      }),
    }),
    // Thêm endpoint mới để lấy tất cả skills
    getAllSkills: builder.query({
      query: ({ page = 0, size = 10000, sort = "id,asc" } = {}) => {
        // Build query string
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("size", size.toString());
        params.append("sort", sort);

        return {
          url: `/skill?${params.toString()}`,
          method: "GET",
        };
      },
      transformResponse: response => {
        // Handle both paginated and unpaged responses
        if (Array.isArray(response)) {
          return response;
        }
        return response?.content || [];
      },
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetLevelsQuery,
  useGetWorkTypesQuery,
  useLazyGetSkillsByCategoryQuery,
  useGetAllSkillsQuery, // Thêm dòng này
} = filterApi;
