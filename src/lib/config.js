const isDev = process.env.NODE_ENV === "development";

const PROXY_TARGET = process.env.NEXT_PUBLIC_API_PROXY_TARGET || "";
const BASE_PATH = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";

const ABSOLUTE_BASE = isDev
    ? BASE_PATH
    : `${PROXY_TARGET.replace(/\/$/, "")}${BASE_PATH.startsWith("/") ? BASE_PATH : `/${BASE_PATH}`}`;

export const API_CONFIG = {
    BASE_URL: ABSOLUTE_BASE,
    TIMEOUT: 60000,
};

if (!API_CONFIG.BASE_URL) {
    console.warn("API base URL is not defined correctly!");
}
