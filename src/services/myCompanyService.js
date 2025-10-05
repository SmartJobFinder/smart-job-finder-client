import api from '@/lib/api';
import { USER_API, COMPANY_API } from '@/constants/apiCompanyConstants';

// Service để kiểm tra user có công ty hay không
export const checkUserHasCompany = async () => {
    try {
        const response = await api.get(USER_API.CHECK_HAS_COMPANY);
        return response.data;
    } catch (error) {
        console.error('Error checking user company:', error);
        throw error;
    }
};

// Service để lấy chi tiết công ty
export const getCompanyDetail = async (companyId) => {
    try {
        const response = await api.get(COMPANY_API.GET_COMPANY_DETAIL(companyId));
        return response.data;
    } catch (error) {
        console.error('Error fetching company detail:', error);
        throw error;
    }
}; 