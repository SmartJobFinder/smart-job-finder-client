import api from '@/lib/api';

// Service để lấy tất cả categories
export const getAllCategories = async () => {
    try {
        const response = await api.get('/category');
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

// Service để lấy root categories
export const getRootCategories = async () => {
    try {
        const response = await api.get('/category/roots');
        return response.data;
    } catch (error) {
        console.error('Error fetching root categories:', error);
        throw error;
    }
};

// Service để lấy children categories
export const getChildrenCategories = async (parentName) => {
    try {
        const response = await api.get(`/category/children?parent_name=${encodeURIComponent(parentName)}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching children categories:', error);
        throw error;
    }
}; 