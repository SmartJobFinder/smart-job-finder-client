/** @type {import('next').NextConfig} */
const stripTrailingSlash = (u) => (u ? u.replace(/\/+$/, "") : u);
const nextConfig = {
  output: "standalone",
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_WS_ENDPOINT: process.env.NEXT_PUBLIC_WS_ENDPOINT,   // e.g. /ws
    NEXT_PUBLIC_SUB_DEST: process.env.NEXT_PUBLIC_SUB_DEST,         // e.g. /user/queue/noti
  },
  async rewrites() {
    // Chỉ proxy ở DEV
    if (process.env.NODE_ENV !== "development") return [];

    // Target có thể đọc từ env, fallback về IP dev
      const rawTarget =
          process.env.NEXT_PUBLIC_API_PROXY_TARGET || "http://localhost:8080";

      const target = stripTrailingSlash(rawTarget);

    return [
      {
        source: "/api/:path*",
        destination: `${target}/api/:path*`,
      },
      // SockJS / WebSocket (info, xhr_streaming, websocket, ...)
      {
        source: "/ws",
        destination: `${target}/ws`,
      },
      {
        source: "/ws/:path*",
        destination: `${target}/ws/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
