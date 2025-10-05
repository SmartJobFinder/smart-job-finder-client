import api from '@/lib/api';
import { JOB_CREATE_API } from '@/constants/apiCreateJobConstants';

// Service để lấy danh sách levels
export const getLevels = async () => {
    try {
        const response = await api.get(JOB_CREATE_API.GET_LEVELS);
        return response.data;
    } catch (error) {
        console.error('Error fetching levels:', error);
        throw error;
    }
};

// Service để lấy danh sách cities
export const getCities = async () => {
    try {
        const response = await api.get(JOB_CREATE_API.GET_CITIES);
        return response.data;
    } catch (error) {
        console.error('Error fetching cities:', error);
        throw error;
    }
};

// Service để lấy danh sách wards theo city
export const getWards = async (cityName) => {
    try {
        const response = await api.get(JOB_CREATE_API.GET_WARDS(cityName));
        return response.data;
    } catch (error) {
        console.error('Error fetching wards:', error);
        // Trả về mảng rỗng thay vì throw error khi không tìm thấy wards
        if (error.response?.status === 404) {
            console.warn(`Không tìm thấy phường/xã nào thuộc thành phố: ${cityName}`);
            return [];
        }
        throw error;
    }
};

// Service để lấy danh sách categories
export const getCategories = async () => {
    try {
        const response = await api.get(JOB_CREATE_API.GET_CATEGORIES);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

// Service để lấy danh sách skills theo category
export const getSkillsByCategory = async (categoryName) => {
    try {
        const response = await api.get(JOB_CREATE_API.GET_SKILLS_BY_CATEGORY(categoryName));
        return response.data;
    } catch (error) {
        console.error('Error fetching skills:', error);
        // Trả về mảng rỗng thay vì throw error khi không tìm thấy skills
        if (error.response?.status === 404) {
            console.warn(`Không tìm thấy kỹ năng nào thuộc danh mục: ${categoryName}`);
            return [];
        }
        throw error;
    }
};

// Service để lấy danh sách work types
export const getWorkTypes = async () => {
    try {
        const response = await api.get(JOB_CREATE_API.GET_WORK_TYPES);
        return response.data;
    } catch (error) {
        console.error('Error fetching work types:', error);
        throw error;
    }
};

// Service để tạo job
export const createJob = async (jobData) => {
    try {
        const response = await api.post(JOB_CREATE_API.CREATE_JOB, jobData);
        return response.data;
    } catch (error) {
        console.error('Error creating job:', error);
        throw error;
    }
};
