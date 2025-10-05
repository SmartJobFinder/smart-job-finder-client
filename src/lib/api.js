import axios from "axios";
import {API_CONFIG} from "./config";

let reduxStore = null;
const skipRefreshPaths = ["/auth/login", "/auth/register"];

export function attachStore(store) {
    reduxStore = store;
}

const isDev = process.env.NODE_ENV === "development";


const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    withCredentials: true,
});

// lấy AT mới
let refreshPromise = null;

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const {response, config} = error || {};
        if (!response) throw error;

        const isRefreshCall = config?.url?.includes("/auth/refresh");
        const shouldSkip = skipRefreshPaths.some((p) => config?.url?.includes(p));

        if (response.status !== 401 || config?._retry || isRefreshCall || shouldSkip) {
            throw error;
        }

        config._retry = true;

        try {
            refreshPromise =
                refreshPromise ||
                axios.post(`${API_CONFIG.BASE_URL}/auth/refresh`, null, {
                    withCredentials: true,
                });

            await refreshPromise;
        } catch (e) {
            refreshPromise = null;
            throw e;
        }

        refreshPromise = null;
        config.withCredentials = true;
        return api(config);
    }
);

export default api;
