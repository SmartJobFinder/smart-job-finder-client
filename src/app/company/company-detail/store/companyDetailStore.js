"use client";

import { create } from "zustand";
import { COMPANY_API, JOB_API } from "@/constants/apiCompanyConstants";
import api from "@/lib/api";

const useCompanyDetailStore = create((set, get) => ({
    company: null,
    relatedCompanies: [],
    jobs: [],
    isLoading: false,
    error: null,

    // Lấy chi tiết công ty theo ID
    fetchCompanyDetail: async (companyId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(COMPANY_API.GET_COMPANY_DETAIL(companyId));

            set({ company: response.data, isLoading: false });

            // Sau khi tải công ty thành công, tải các việc làm và công ty liên quan
            get().fetchRelatedCompanies();
            get().fetchCompanyJobs(companyId);
        } catch (error) {
            console.error("Error fetching company detail:", error);
            set({ 
                error: error.response?.data?.message || error.message || "Không thể tải thông tin công ty", 
                isLoading: false 
            });
        }
    },

    // Lấy danh sách công việc của công ty
    fetchCompanyJobs: async (companyId) => {
        try {
            const response = await api.get(JOB_API.GET_JOBS_BY_COMPANY(companyId));

            // Trích xuất dữ liệu công việc từ response
            const jobs = response.data?.content || response.data || [];
            
            set({ jobs });
        } catch (error) {
            console.error("Error fetching company jobs:", error);
            // Không set error cho jobs vì đây không phải thông tin chính
        }
    },

    // Lấy danh sách công ty cùng lĩnh vực
    fetchRelatedCompanies: async () => {
        try {
            const response = await api.get(`${COMPANY_API.GET_ALL_COMPANIES}?unpaged=true`);
            const company = get().company;

            if (company && response.data) {
                // Lọc ra các công ty cùng ngành nghề, trừ công ty hiện tại
                const allCompanies = response.data.content || response.data;
                const related = allCompanies
                    .filter((item) => {
                        // Kiểm tra cùng ngành nghề
                        const hasCommonCategory = item.parentCategories && 
                            company.parentCategories &&
                            item.parentCategories.some(category => 
                                company.parentCategories.includes(category)
                            );
                        
                        // Kiểm tra cùng danh mục con
                        const hasCommonSubCategory = item.categories && 
                            company.categories &&
                            item.categories.some(category => 
                                company.categories.includes(category)
                            );

                        return (hasCommonCategory || hasCommonSubCategory) && 
                               item.id !== company.id;
                    })
                    .slice(0, 6);

                set({ relatedCompanies: related });
            }
        } catch (error) {
            console.error("Error fetching related companies:", error);
        }
    },

    // Theo dõi/hủy theo dõi công ty
    toggleFollowCompany: async () => {
        const company = get().company;
        if (!company) return;

        try {
            // TODO: Implement follow/unfollow API call
            const updatedCompany = {
                ...company,
                isFollowing: !company.isFollowing,
                followersCount: company.isFollowing 
                    ? company.followersCount - 1 
                    : company.followersCount + 1
            };
            
            set({ company: updatedCompany });

            console.log(
                `${updatedCompany.isFollowing ? "Đã theo dõi" : "Đã hủy theo dõi"} công ty: ${company.companyName}`
            );
        } catch (error) {
            console.error("Error toggling follow:", error);
        }
    },

    // Reset store
    reset: () => {
        set({
            company: null,
            relatedCompanies: [],
            jobs: [],
            isLoading: false,
            error: null,
        });
    },
}));

export default useCompanyDetailStore;