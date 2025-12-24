export default function robots() {
  const site = "https://jobfind.io.vn";
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // Safety: block internal API proxies if any
      {
        userAgent: "*",
        disallow: ["/api", "/recruiter", "/activate", "/demo-jodit"],
      },
    ],
    sitemap: `${site}/sitemap.xml`,
  };
}
