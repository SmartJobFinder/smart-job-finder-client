"use client";

import { create } from "zustand";
import { COMPANY_API } from "@/constants/apiCompanyConstants";
import api from "@/lib/api";

const useCompanySearchStore = create((set, get) => ({
    // Data states
    allCompanies: [],
    companies: [],
    industries: [],
    locations: [],
    isLoading: false,
    error: null,

    // Pagination states
    pagination: {
        page: 0,
        size: 10,
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: false,
    },

    // Filter states
    filters: {
        companySize: [],
        categoryIds: [],
        foundingYear: "any",
    },

    // Search terms
    searchTerm: {
        company: "",
        location: "",
    },

    // Sorting
    sort: {
        field: "id",
        direction: "asc",
    },

    // Cập nhật filters
    setFilters: (newFilters) =>
        set({
            filters: { ...get().filters, ...newFilters },
        }),

    // Cập nhật searchTerm
    setSearchTerm: (newSearchTerm) =>
        set({
            searchTerm: { ...get().searchTerm, ...newSearchTerm },
        }),

    // Cập nhật pagination
    setPagination: (newPagination) =>
        set({
            pagination: { ...get().pagination, ...newPagination },
        }),

    // Cập nhật sorting
    setSort: (newSort) =>
        set({
            sort: { ...get().sort, ...newSort },
        }),

    // Lấy danh sách công ty (không phân trang)
    fetchAllCompanies: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get(
                `${COMPANY_API.GET_ALL_COMPANIES}?unpaged=true`
            );

            set({
                allCompanies: response.data,
                companies: response.data,
                isLoading: false,
                error: null,
            });
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    // Lấy danh sách công ty (có phân trang)
    fetchCompanies: async (page = 0, size = 10, sort = "id,asc") => {
        set({ isLoading: true });
        try {
            const response = await api.get(COMPANY_API.GET_ALL_COMPANIES, {
                params: { page, size, sort },
            });

            const data = response.data;

            set({
                companies: data.content || data,
                pagination: {
                    page: data.pageable?.pageNumber || page,
                    size: data.pageable?.pageSize || size,
                    totalElements: data.totalElements || 0,
                    totalPages: data.totalPages || 0,
                    first: data.first || false,
                    last: data.last || false,
                },
                isLoading: false,
                error: null,
            });
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    // Tìm kiếm công ty theo nhiều tiêu chí
    searchCompanies: async (params, page = 0, size = 10, sort = "id,asc") => {
        set({ isLoading: true });
        try {
            const searchParams = {
                ...params,
                page,
                size,
                sort,
            };

            const apiUrl = COMPANY_API.SEARCH_COMPANIES(searchParams);
            console.log("API request URL:", apiUrl);

            const response = await api.get(apiUrl);

            if (response.status === 204) {
                set({
                    companies: [],
                    pagination: {
                        page: 0,
                        size: size,
                        totalElements: 0,
                        totalPages: 0,
                        first: true,
                        last: true,
                    },
                    isLoading: false,
                    error: null,
                });
                return;
            }

            const data = response.data;

            set({
                companies: data.content || data,
                pagination: {
                    page: data.pageable?.pageNumber || page,
                    size: data.pageable?.pageSize || size,
                    totalElements: data.totalElements || 0,
                    totalPages: data.totalPages || 0,
                    first: data.first || false,
                    last: data.last || false,
                },
                isLoading: false,
                error: null,
            });
        } catch (err) {
            console.error("Search error:", err);
            set({ error: err.message, isLoading: false, companies: [] });
        }
    },

    // Lấy danh sách công ty theo danh mục
    fetchCompaniesByCategories: async (
        categoryIds,
        page = 0,
        size = 10,
        sort = "id,asc"
    ) => {
        set({ isLoading: true });
        try {
            const response = await api.get(
                COMPANY_API.GET_COMPANIES_BY_CATEGORIES(categoryIds),
                {
                    params: { page, size, sort },
                }
            );

            if (response.status === 204) {
                set({
                    companies: [],
                    pagination: {
                        page: 0,
                        size: size,
                        totalElements: 0,
                        totalPages: 0,
                        first: true,
                        last: true,
                    },
                    isLoading: false,
                    error: null,
                });
                return;
            }

            const data = response.data;

            set({
                companies: data.content || data,
                pagination: {
                    page: data.pageable?.pageNumber || page,
                    size: data.pageable?.pageSize || size,
                    totalElements: data.totalElements || 0,
                    totalPages: data.totalPages || 0,
                    first: data.first || false,
                    last: data.last || false,
                },
                isLoading: false,
                error: null,
            });
        } catch (err) {
            set({
                error: err.message,
                isLoading: false,
                companies: [],
            });
        }
    },

    // Lấy danh sách công ty theo địa điểm
    fetchCompaniesByLocation: async (
        location,
        page = 0,
        size = 10,
        sort = "id,asc"
    ) => {
        set({ isLoading: true });
        try {
            const response = await api.get(
                COMPANY_API.GET_COMPANIES_BY_LOCATION(location),
                {
                    params: { page, size, sort },
                }
            );

            const data = response.data;

            set({
                companies: data.content || data,
                pagination: {
                    page: data.pageable?.pageNumber || page,
                    size: data.pageable?.pageSize || size,
                    totalElements: data.totalElements || 0,
                    totalPages: data.totalPages || 0,
                    first: data.first || false,
                    last: data.last || false,
                },
                isLoading: false,
                error: null,
            });
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    // Lấy danh sách ngành nghề (danh mục)
    fetchIndustries: async () => {
        try {
            const response = await api.get(COMPANY_API.GET_ALL_CATEGORIES);

            const formattedCategories = response.data.map((category) => ({
                cate_id: category.id,
                cate_name: category.name,
            }));

            set({ industries: formattedCategories });
        } catch (err) {
            console.error("Error fetching industries:", err);
        }
    },

    // Lấy danh sách vị trí
    fetchLocations: async () => {
        try {
            const response = await api.get(COMPANY_API.GET_COMPANY_LOCATIONS);

            const locationNames = response.data.map(
                (location) => location.name
            );
            set({ locations: locationNames });
        } catch (err) {
            console.error("Error fetching locations:", err);
        }
    },

    // Lấy chi tiết công ty theo ID
    fetchCompanyDetail: async (id) => {
        set({ isLoading: true });
        try {
            const response = await api.get(COMPANY_API.GET_COMPANY_DETAIL(id));

            set({
                isLoading: false,
                error: null,
            });

            return response.data;
        } catch (err) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },

    // Lọc các công ty dựa trên bộ lọc và từ khóa tìm kiếm (client-side filtering)
    getFilteredCompanies: () => {
        const { companies, filters, searchTerm, industries } = get();
        let filtered = [...companies];

        // Lọc theo tên công ty
        if (searchTerm.company) {
            const keyword = searchTerm.company.toLowerCase();
            filtered = filtered.filter((company) =>
                company.companyName.toLowerCase().includes(keyword)
            );
        }

        // Lọc theo vị trí
        if (searchTerm.location) {
            const locationKeyword = searchTerm.location.toLowerCase();
            filtered = filtered.filter(
                (company) =>
                    company.locationCity &&
                    company.locationCity.toLowerCase().includes(locationKeyword)
            );
        }

        // Lọc theo danh mục
        if (filters.categoryIds.length > 0) {
            const selectedCategoryNames = industries
                .filter((ind) => filters.categoryIds.includes(ind.cate_id))
                .map((ind) => ind.cate_name);

            filtered = filtered.filter((company) => {
                const matchById =
                    company.categoryIds &&
                    company.categoryIds.some((id) =>
                        filters.categoryIds.includes(id)
                    );
                const matchByParent =
                    company.parentCategories &&
                    company.parentCategories.some((name) =>
                        selectedCategoryNames.includes(name)
                    );
                return matchById || matchByParent;
            });
        }

        // Lọc theo quy mô công ty
        if (filters.companySize.length > 0) {
            filtered = filtered.filter((company) => {
                const size = parseInt(company.quantityEmployee, 10);

                return filters.companySize.some((range) => {
                    if (range === "1-10" && size >= 1 && size <= 10)
                        return true;
                    if (range === "11-50" && size >= 11 && size <= 50)
                        return true;
                    if (range === "51-200" && size >= 51 && size <= 200)
                        return true;
                    if (range === "201-500" && size >= 201 && size <= 500)
                        return true;
                    if (range === "501+" && size > 500) return true;
                    return false;
                });
            });
        }

        // Lọc theo năm thành lập
        if (filters.foundingYear !== "any") {
            const year = parseInt(filters.foundingYear, 10);
            filtered = filtered.filter(
                (company) => company.foundedYear === year
            );
        }

        return filtered;
    },

    // Lấy các công ty được đề xuất
    getRecommendedCompanies: () => {
        const { companies } = get();
        return companies.filter((company) => company.proCompany).slice(0, 6);
    },

    // Tính toán số lượng cho bộ lọc
    getFilterCounts: () => {
        const { allCompanies, industries } = get();

        const industryCounts = {};
        industries.forEach((industry) => {
            industryCounts[industry.cate_name] = allCompanies.filter(
                (company) =>
                    (company.categories &&
                        company.categories.includes(industry.cate_name)) ||
                    (company.parentCategories &&
                        company.parentCategories.includes(industry.cate_name))
            ).length;
        });

        const sizeCounts = {
            "1-10": allCompanies.filter((c) => {
                const size = parseInt(c.quantityEmployee, 10);
                return size >= 1 && size <= 10;
            }).length,
            "11-50": allCompanies.filter((c) => {
                const size = parseInt(c.quantityEmployee, 10);
                return size >= 11 && size <= 50;
            }).length,
            "51-200": allCompanies.filter((c) => {
                const size = parseInt(c.quantityEmployee, 10);
                return size >= 51 && size <= 200;
            }).length,
            "201-500": allCompanies.filter((c) => {
                const size = parseInt(c.quantityEmployee, 10);
                return size >= 201 && size <= 500;
            }).length,
            "501+": allCompanies.filter((c) => {
                const size = parseInt(c.quantityEmployee, 10);
                return size > 500;
            }).length,
        };

        return {
            industry: industryCounts,
            companySize: sizeCounts,
        };
    },

    // Reset store
    reset: () => {
        set({
            allCompanies: [],
            companies: [],
            industries: [],
            locations: [],
            isLoading: false,
            error: null,
            pagination: {
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                first: true,
                last: false,
            },
            filters: {
                companySize: [],
                categoryIds: [],
                foundingYear: "any",
            },
            searchTerm: {
                company: "",
                location: "",
            },
            sort: {
                field: "id",
                direction: "asc",
            },
        });
    },
}));

export default useCompanySearchStore;
