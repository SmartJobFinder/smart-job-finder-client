import { jobs } from "@/mock/data/jobs";
import { companies } from "@/mock/data/companies";
import { categories } from "@/mock/data/categories";

// Triển khai giả của axiosBaseQuery
const mockBaseQuery =
    () =>
    async ({ url, method = "GET", params = {} }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));

        console.log(`[Mock RTK Query] ${method} ${url}`, params);

        // Xử lý các endpoints khác nhau
        if (url === "/job" || url === "/job/") {
            // Lấy tất cả công việc với phân trang
            const page = params.page || 0;
            const size = params.size || 10;
            const start = page * size;
            const end = start + size;
            const content = jobs.slice(start, end);

            return {
                data: {
                    content,
                    totalPages: Math.ceil(jobs.length / size),
                    totalElements: jobs.length,
                    size: size,
                    number: page,
                    first: page === 0,
                    last: end >= jobs.length,
                },
            };
        }

        if (url.includes("/job/search") || url.includes("/job/search-lite")) {
            // Lọc công việc theo các tham số tìm kiếm
            let filtered = [...jobs];

            if (params.keyword) {
                const keyword = params.keyword.toLowerCase();
                filtered = filtered.filter(
                    (job) =>
                        job.title.toLowerCase().includes(keyword) ||
                        job.description.toLowerCase().includes(keyword)
                );
            }

            if (params.location) {
                filtered = filtered.filter((job) =>
                    job.location
                        .toLowerCase()
                        .includes(params.location.toLowerCase())
                );
            }

            if (params.categoryId) {
                const categoryIds = Array.isArray(params.categoryId)
                    ? params.categoryId.map(Number)
                    : [Number(params.categoryId)];

                filtered = filtered.filter((job) => {
                    const jobCategoryNames = job.category_names || [];
                    const matchingCategories = categories.filter(
                        (cat) =>
                            categoryIds.includes(cat.id) &&
                            jobCategoryNames.includes(cat.name)
                    );
                    return matchingCategories.length > 0;
                });
            }

            const page = params.page || 0;
            const size = params.size || 10;
            const start = page * size;
            const end = start + size;
            const content = filtered.slice(start, end);

            return {
                data: {
                    content,
                    totalPages: Math.ceil(filtered.length / size),
                    totalElements: filtered.length,
                    size: size,
                    number: page,
                    first: page === 0,
                    last: end >= filtered.length,
                },
            };
        }

        if (url.match(/\/job\/\d+$/)) {
            // Lấy công việc theo ID
            const id = parseInt(url.split("/").pop());
            const job = jobs.find((j) => j.id === id);

            if (job) {
                return { data: job };
            } else {
                return {
                    error: { status: 404, data: "Không tìm thấy công việc" },
                };
            }
        }

        // Các endpoints khác
        if (url === "/company" || url === "/company/") {
            const page = params.page || 0;
            const size = params.size || 10;
            const start = page * size;
            const end = start + size;
            const content = companies.slice(start, end);

            return {
                data: {
                    content,
                    totalPages: Math.ceil(companies.length / size),
                    totalElements: companies.length,
                    size: size,
                    number: page,
                    first: page === 0,
                    last: end >= companies.length,
                },
            };
        }

        // Mặc định trả về
        return { data: [] };
    };

export default mockBaseQuery;
