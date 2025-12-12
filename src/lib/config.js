const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";
const PROXY_TARGET = process.env.NEXT_PUBLIC_API_PROXY_TARGET || "";

const isAbsolute = /^https?:\/\//i.test(BASE);

const normalizedProxy = PROXY_TARGET.replace(/\/$/, "");
const normalizedBase = BASE.startsWith("/") ? BASE : `/${BASE}`;

const ABSOLUTE_BASE = isAbsolute
  ? BASE
  : normalizedProxy
    ? `${normalizedProxy}${normalizedBase}`
    : BASE;

export const API_CONFIG = {
  BASE_URL: ABSOLUTE_BASE,
  TIMEOUT: Number(process.env.NEXT_PUBLIC_API_TIMEOUT || 180000),
};

if (!API_CONFIG.BASE_URL) {
    console.warn("API base URL is not defined correctly!");
}
