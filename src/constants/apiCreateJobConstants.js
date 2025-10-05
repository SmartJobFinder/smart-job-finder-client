export const JOB_CREATE_API = {
    // API endpoints cho tạo job
    GET_LEVELS: '/levels',
    GET_CITIES: '/city',
    GET_WARDS: (cityName) => `/wards?cityName=${encodeURIComponent(cityName)}`,
    GET_CATEGORIES: '/category',
    GET_SKILLS_BY_CATEGORY: (categoryName) => `/skill/by-category?name=${encodeURIComponent(categoryName)}`,
    GET_WORK_TYPES: '/worktypes',
    CREATE_JOB: '/job/create'
};
