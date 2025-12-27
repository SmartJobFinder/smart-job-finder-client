const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";
const PROXY_TARGET = process.env.NEXT_PUBLIC_API_PROXY_TARGET || "";

const isAbsolute = /^https?:\/\//i.test(BASE);

const normalizedProxy = PROXY_TARGET.replace(/\/$/, "");
const normalizedBase = BASE.startsWith("/") ? BASE : `/${BASE}`;

// Check if running in browser (client-side)
const isBrowser = typeof window !== "undefined";

const ABSOLUTE_BASE = isAbsolute
  ? BASE
  : normalizedProxy && !isBrowser
    ? `${normalizedProxy}${normalizedBase}` // Server-side: use full URL
    : normalizedBase; // Client-side: use relative URL for Next.js rewrites

export const API_CONFIG = {
  BASE_URL: ABSOLUTE_BASE,
  TIMEOUT: Number(process.env.NEXT_PUBLIC_API_TIMEOUT || 360000),
};

if (!API_CONFIG.BASE_URL) {
  console.warn("API base URL is not defined correctly!");
}
