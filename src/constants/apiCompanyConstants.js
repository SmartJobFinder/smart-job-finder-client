// Constants cho API endpoints
// Sử dụng đường dẫn tương đối vì axios đã cấu hình baseURL

// User endpoints
export const USER_API = {
    CHECK_HAS_COMPANY: `/users/has-company`,
};

// Company endpoints
export const COMPANY_API = {
    GET_COMPANY_DETAIL: (id) => `/companies/${id}`,
    GET_ALL_COMPANIES: `/companies`,
    CREATE_COMPANY: `/companies/add`,
    UPDATE_COMPANY: (id) => `/companies/${id}`,
    GET_MY_COMPANY: `/companies/my-company`,
    GET_COMPANIES_BY_CATEGORIES: (categoryIds) =>
        `/companies/by-categories?categoryIds=${categoryIds}`,
    GET_COMPANIES_BY_LOCATION: (location) =>
        `/companies/by-location?location=${encodeURIComponent(
            location
        )}`,
    GET_COMPANY_BY_NAME: (name) =>
        `/companies/by-name?name=${encodeURIComponent(name)}`,
    GET_COMPANY_LOCATIONS: `/companies/locations`,
    GET_ALL_CATEGORIES: `/category`,
    SEARCH_COMPANIES: (params) => {
        const queryParams = new URLSearchParams();
        if (params.name) queryParams.append("name", params.name);
        if (params.location) queryParams.append("location", params.location);
        if (params.categoryIds && params.categoryIds.length)
            queryParams.append("categoryIds", params.categoryIds.join(","));
        return `/companies/search?${queryParams.toString()}`;
    },
};

// Job endpoints
export const JOB_API = {
    GET_JOBS_BY_COMPANY: (companyId) =>
        `/job/company/${companyId}`,
    SEARCH_JOBS_BY_COMPANY: (companyId, queryString = "") =>
        `/job/company/${companyId}/search${queryString ? `?${queryString}` : ""}`,
};
