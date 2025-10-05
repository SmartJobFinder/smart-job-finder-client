"use client";

import { create } from "zustand";

const useCompanyStore = create((set, get) => ({
    companies: [],
    industries: [],
    isLoading: false,
    error: null,
    filters: {
        companySize: [],
        industry: [],
        foundingYear: "any",
    },
    searchTerm: {
        company: "",
        location: "",
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

    // Lấy danh sách công ty
    fetchCompanies: async () => {
        set({ isLoading: true });
        try {
            const response = await fetch(
                "https://68808ec2f1dcae717b627e5b.mockapi.io/companies"
            );
            const data = await response.json();

            set({
                companies: data.map((company) => ({
                    id: company.company_id,
                    name: company.name,
                    logo: company.logo,
                    location: company.location,
                    industry: company.industry,
                    size: String(company.quantity_employee),
                    description: company.description,
                    jobCount: Number(company.job_count),
                    foundingYear: company.founding_year,
                    status: company.status,
                })),
                isLoading: false,
            });
        } catch (err) {
            set({ error: err.message, isLoading: false });
        }
    },

    // Lấy danh sách ngành nghề
    fetchIndustries: async () => {
        try {
            const response = await fetch(
                "https://68808ec2f1dcae717b627e5b.mockapi.io/industries"
            );
            const data = await response.json();

            set({
                industries: data.map((industry) => ({
                    cate_id: industry.id,
                    cate_name: industry.name,
                })),
            });
        } catch (err) {
            set({ error: err.message });
        }
    },

    // Lọc các công ty dựa trên bộ lọc và từ khóa tìm kiếm
    getFilteredCompanies: () => {
        const { companies, filters, searchTerm } = get();
        let filtered = [...companies];

        // Lọc theo tên công ty hoặc ngành
        if (searchTerm.company) {
            const keyword = searchTerm.company.toLowerCase();
            filtered = filtered.filter(
                (company) =>
                    company.name.toLowerCase().includes(keyword) ||
                    company.industry.toLowerCase().includes(keyword)
            );
        }

        // Lọc theo vị trí
        if (searchTerm.location) {
            const locationKeyword = searchTerm.location.toLowerCase();
            filtered = filtered.filter((company) =>
                company.location.toLowerCase().includes(locationKeyword)
            );
        }

        // Lọc theo ngành
        if (filters.industry.length > 0) {
            filtered = filtered.filter((company) =>
                filters.industry.includes(company.industry)
            );
        }

        // Lọc theo quy mô công ty
        if (filters.companySize.length > 0) {
            filtered = filtered.filter((company) => {
                const size = parseInt(company.size, 10);

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
                (company) => company.foundingYear === year
            );
        }

        return filtered;
    },

    // Tính toán số lượng cho bộ lọc
    getFilterCounts: () => {
        const { companies, industries } = get();

        // Đếm công ty theo ngành
        const industryCounts = {};
        industries.forEach((industry) => {
            industryCounts[industry.cate_name] = companies.filter(
                (company) => company.industry === industry.cate_name
            ).length;
        });

        // Đếm công ty theo quy mô
        const sizeCounts = {
            "1-10": companies.filter((c) => {
                const size = parseInt(c.size, 10);
                return size >= 1 && size <= 10;
            }).length,
            "11-50": companies.filter((c) => {
                const size = parseInt(c.size, 10);
                return size >= 11 && size <= 50;
            }).length,
            "51-200": companies.filter((c) => {
                const size = parseInt(c.size, 10);
                return size >= 51 && size <= 200;
            }).length,
            "201-500": companies.filter((c) => {
                const size = parseInt(c.size, 10);
                return size >= 201 && size <= 500;
            }).length,
            "501+": companies.filter((c) => {
                const size = parseInt(c.size, 10);
                return size > 500;
            }).length,
        };

        return {
            industry: industryCounts,
            companySize: sizeCounts,
        };
    },
}));

export default useCompanyStore;
