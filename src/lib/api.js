// import axios from "axios";
// import {API_CONFIG} from "./config";

// let reduxStore = null;
// const skipRefreshPaths = ["/auth/login", "/auth/register"];

// export function attachStore(store) {
//     reduxStore = store;
// }

// const isDev = process.env.NODE_ENV === "development";

// const api = axios.create({
//     baseURL: API_CONFIG.BASE_URL,
//     timeout: API_CONFIG.TIMEOUT,
//     withCredentials: true,
// });

// // lấy AT mới
// let refreshPromise = null;

// api.interceptors.response.use(
//     (res) => res,
//     async (error) => {
//         const {response, config} = error || {};
//         if (!response) throw error;

//         const isRefreshCall = config?.url?.includes("/auth/refresh");
//         const shouldSkip = skipRefreshPaths.some((p) => config?.url?.includes(p));

//         if (response.status !== 401 || config?._retry || isRefreshCall || shouldSkip) {
//             throw error;
//         }

//         config._retry = true;

//         try {
//             refreshPromise =
//                 refreshPromise ||
//                 axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, null, {
//                     withCredentials: true,
//                 });

//             await refreshPromise;
//         } catch (e) {
//             refreshPromise = null;
//             throw e;
//         }

//         refreshPromise = null;
//         config.withCredentials = true;
//         return api(config);
//     }
// );

// export default api;

import mockApi from "@/mock/api";

// Tạo một hàm làm wrapper cho API object
const apiFunction = (method, url, data, config) => {
    console.log(`[API Function] ${method} ${url}`);

    if (method === "get") {
        return api.get(url, config);
    } else if (method === "post") {
        return api.post(url, data, config);
    } else if (method === "put") {
        return api.put(url, data, config);
    } else if (method === "delete") {
        return api.delete(url, config);
    }

    throw new Error(`Phương thức không được hỗ trợ: ${method}`);
};

// Object API gốc
const api = {
    get: (url, config = {}) => {
        console.log(`[API giả] GET ${url}`);

        if (url.includes("/job") || url === "/jobs") {
            return mockApi.getJobs(config.params || {});
        }

        if (url.match(/\/job\/\d+$/)) {
            const id = url.split("/").pop();
            return mockApi.getJobById(id);
        }

        // Các URL khác
        if (url.match(/\/companies\/\d+$/)) {
            const id = url.split("/").pop();
            return mockApi.getCompanyById(id);
        }
        if (url === "/category" || url === "/category/") {
            return mockApi.getCategories();
        }
        if (url === "/category/roots") {
            return mockApi.getRootCategories();
        }
        if (url === "/city" || url === "/city/") {
            return mockApi.getCities();
        }
        if (url.includes("/wards")) {
            const cityName = new URLSearchParams(url.split("?")[1]).get(
                "cityName"
            );
            return mockApi.getWards(cityName);
        }
        if (url.includes("/auth/me")) {
            return mockApi.me();
        }

        // Mặc định
        return Promise.resolve({ data: [] });
    },

    post: (url, data, config = {}) => {
        console.log(`[API giả] POST ${url}`, data);

        if (url.includes("/auth/login")) {
            return mockApi.login(data);
        }
        if (url.includes("/auth/register")) {
            return mockApi.register(data);
        }
        if (url.includes("/auth/logout")) {
            return mockApi.logout();
        }

        // Mặc định
        return Promise.resolve({
            data: { success: true, message: "Thao tác hoàn tất thành công" },
        });
    },

    put: (url, data, config = {}) => {
        console.log(`[API giả] PUT ${url}`, data);
        return Promise.resolve({
            data: { success: true, message: "Cập nhật hoàn tất thành công" },
        });
    },

    delete: (url, config = {}) => {
        console.log(`[API giả] DELETE ${url}`);
        return Promise.resolve({
            data: { success: true, message: "Xóa hoàn tất thành công" },
        });
    },

    create: (config) => {
        // Trả về hàm có thể gọi trực tiếp nhưng cũng có các thuộc tính của api
        const func = (method, url, data, config) =>
            apiFunction(method, url, data, config);
        func.get = api.get;
        func.post = api.post;
        func.put = api.put;
        func.delete = api.delete;
        func.create = api.create;
        func.interceptors = api.interceptors;
        return func;
    },
};

// Giữ cấu trúc interceptors
api.interceptors = {
    request: {
        use: (fulfilled, rejected) => {},
    },
    response: {
        use: (fulfilled, rejected) => {},
    },
};

// Mặc định export một hàm với các thuộc tính của api object
const exportedApi = (method, url, data, config) =>
    apiFunction(method, url, data, config);
exportedApi.get = api.get;
exportedApi.post = api.post;
exportedApi.put = api.put;
exportedApi.delete = api.delete;
exportedApi.create = api.create;
exportedApi.interceptors = api.interceptors;

export default exportedApi;
export const attachStore = () => {};
