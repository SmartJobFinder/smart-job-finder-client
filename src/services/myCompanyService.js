import api from "@/lib/api";
import { USER_API, COMPANY_API } from "@/constants/apiCompanyConstants";

// Service để kiểm tra user có công ty hay không
export const checkUserHasCompany = async () => {
    try {
        const response = await api.get(USER_API.CHECK_HAS_COMPANY);
        return response.data;
    } catch (error) {
        console.error("Error checking user company:", error);
        throw error;
    }
};

// Service để lấy chi tiết công ty
export const getCompanyDetail = async (companyId) => {
    try {
        const response = await api.get(
            COMPANY_API.GET_COMPANY_DETAIL(companyId)
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching company detail:", error);
        throw error;
    }
};

// import api from "@/lib/api";
// import { USER_API, COMPANY_API } from "@/constants/apiCompanyConstants";
// import { recruiterCompany, companyMetrics } from "@/mock/data/recruiterProfile";

// // Service để kiểm tra user có công ty hay không
// export const checkUserHasCompany = async () => {
//     // Simulate API call with delay
//     await new Promise((resolve) => setTimeout(resolve, 500));

//     return {
//         hasCompany: true,
//         companyId: recruiterCompany.id,
//         companyName: recruiterCompany.company_name,
//     };
// };

// // Service để lấy chi tiết công ty
// export const getCompanyDetail = async (companyId) => {
//     // Simulate API call with delay
//     await new Promise((resolve) => setTimeout(resolve, 700));

//     // Check if the requested company ID matches our mock data
//     if (companyId == recruiterCompany.id) {
//         return recruiterCompany;
//     }

//     throw new Error("Company not found");
// };

// // Service để lấy chỉ số (metrics) của công ty
// export const getCompanyMetrics = async (companyId) => {
//     // Simulate API call with delay
//     await new Promise((resolve) => setTimeout(resolve, 600));

//     // Check if the requested company ID matches our mock data
//     if (companyId == recruiterCompany.id) {
//         return companyMetrics;
//     }

//     throw new Error("Company metrics not found");
// };
