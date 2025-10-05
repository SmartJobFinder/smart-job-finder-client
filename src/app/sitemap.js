export default async function sitemap() {
  const site = 'https://jobhuntly.io.vn';

  return [
    { url: `${site}/`, changefreq: 'daily', priority: 1.0 },
    { url: `${site}/search`, changefreq: 'hourly', priority: 0.9 },
    { url: `${site}/company/company-search`, changefreq: 'daily', priority: 0.7 }
  ];
}