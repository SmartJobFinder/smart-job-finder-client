"use client";

import { create } from "zustand";
import { checkUserHasCompany, getCompanyDetail } from "@/services/myCompanyService";

const useMyCompanyStore = create((set, get) => ({
    hasCompany: false,
    companyId: null,
    companyName: null,
    company: null,
    isLoading: false,
    error: null,

    // Kiểm tra user có công ty hay không
    checkUserHasCompany: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await checkUserHasCompany();
            set({
                hasCompany: response.hasCompany,
                companyId: response.companyId,
                companyName: response.companyName,
                isLoading: false,
            });

            // Nếu có công ty, lấy chi tiết công ty
            if (response.hasCompany && response.companyId) {
                get().fetchCompanyDetail(response.companyId);
            }
        } catch (error) {
            set({ 
                error: error.message || "Failed to check company status", 
                isLoading: false 
            });
        }
    },

    // Lấy chi tiết công ty
    fetchCompanyDetail: async (companyId) => {
        set({ isLoading: true, error: null });
        try {
            const companyData = await getCompanyDetail(companyId);
            set({ 
                company: companyData, 
                isLoading: false 
            });
        } catch (error) {
            set({ 
                error: error.message || "Failed to fetch company detail", 
                isLoading: false 
            });
        }
    },

    // Reset store
    reset: () => {
        set({
            hasCompany: false,
            companyId: null,
            companyName: null,
            company: null,
            isLoading: false,
            error: null,
        });
    },
}));

export default useMyCompanyStore;