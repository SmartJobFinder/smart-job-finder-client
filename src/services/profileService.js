import { createApi } from "@reduxjs/toolkit/query/react";
import api from "@/lib/api";

const axiosBaseQuery =
    () =>
    async ({ url, method = "GET", body, headers }, { signal }) => {
        try {
            const config = {
                url: `/candidate/profile${url}`,
                method,
                data: body,
                signal,
                headers: { ...headers },
            };
            if (body instanceof FormData) {
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

export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: [
        "combinedProfile",
        "personalDetail",
        "profile",
        "education",
        "workExperience",
        "awards",
        "certificates",
        "candidateSkills",
        "softSkills",
    ],
    endpoints: (builder) => ({
        getCombinedProfile: builder.query({
            query: () => ({ url: "/combined" }),
            providesTags: ["combinedProfile"],
            keepUnusedDataFor: 60,
        }),

        getProfile: builder.query({
            query: () => ({ url: "" }),
            providesTags: ["profile"],
        }),
        updateProfile: builder.mutation({
            query: (body) => ({ url: "", method: "PUT", body }),
            invalidatesTags: ["profile", "combinedProfile"],
        }),

        getSectionItems: builder.query({
            query: (section) => ({ url: `/${section}` }),
            providesTags: (result, error, section) => [section],
        }),
        addSectionItem: builder.mutation({
            query: ({ section, data }) => ({
                url: `/${section}`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (r, e, { section }) => [section],
        }),
        // updateSectionItem: builder.mutation({
        //     query: ({ section, itemId, data }) => ({
        //         url: `/${section}/${itemId}`,
        //         method: "PUT",
        //         body: data,
        //     }),
        //     invalidatesTags: (r, e, { section }) => [section],
        // }),
        updateSectionItem: builder.mutation({
            query: ({ section, itemId, data }) => {
                const profileSections = ["personalDetail", "aboutMe"];

                if (profileSections.includes(section)) {
                    return {
                        url: "",
                        method: "PUT",
                        body: data, 
                    };
                }

                return {
                    url: `/${section}/${itemId}`,
                    method: "PUT",
                    body: data,
                };
            },
            invalidatesTags: (r, e, { section }) => [
                section,
                "combinedProfile",
            ],
        }),

        deleteSectionItem: builder.mutation({
            query: ({ section, itemId }) => ({
                url: `/${section}/${itemId}`,
                method: "DELETE",
            }),
            invalidatesTags: (r, e, { section }) => [section],
        }),
    }),
});

export const {
    useGetCombinedProfileQuery,
    useGetProfileQuery,
    useUpdateProfileMutation,
    useGetSectionItemsQuery,
    useLazyGetSectionItemsQuery,
    useAddSectionItemMutation,
    useUpdateSectionItemMutation,
    useDeleteSectionItemMutation,
} = profileApi;