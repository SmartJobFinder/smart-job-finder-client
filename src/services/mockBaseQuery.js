import { jobs } from "@/mock/data/jobs";
import { companies } from "@/mock/data/companies";
import { categories } from "@/mock/data/categories";
import { applications } from "@/mock/data/applications";
import { savedJobs } from "@/mock/data/savedJobs";
import { followedCompanies } from "@/mock/data/followedCompanies";
import { interviews } from "@/mock/data/interviews";
import { cvTemplates } from "@/mock/data/cvTemplates";
import { combinedProfile } from "@/mock/data/combinedProfile";
import { settings } from "@/mock/data/settings";
import { users } from "@/mock/data/users";

// Mock implementation of axiosBaseQuery
const mockBaseQuery =
    () =>
    async ({ url, method = "GET", params = {}, data }) => {
        // Simulate API latency
        await new Promise((resolve) => setTimeout(resolve, 500));

        console.log(`[Mock RTK Query] ${method} ${url}`, { params, data });

        // Handle different endpoints
        if (url === "/job" || url === "/jobs") {
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

        if (url.match(/\/job\/\d+$/)) {
            const id = Number(url.split("/").pop());
            const job = jobs.find((j) => j.id === id);

            if (!job) {
                return {
                    error: { status: 404, data: { message: "Job not found" } },
                };
            }

            return { data: job };
        }

        if (url === "/companies" || url === "/company") {
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

        if (url.match(/\/companies\/\d+$/) || url.match(/\/company\/\d+$/)) {
            const id = Number(url.split("/").pop());
            const company = companies.find((c) => c.id === id);

            if (!company) {
                return {
                    error: {
                        status: 404,
                        data: { message: "Company not found" },
                    },
                };
            }

            return { data: company };
        }

        if (url === "/categories" || url === "/category") {
            return { data: categories };
        }

        if (url === "/application" || url === "/applications") {
            return { data: applications };
        }

        if (url.includes("/application/by-user")) {
            const page = params.page || 0;
            const size = params.size || 10;
            const start = page * size;
            const end = start + size;
            const content = applications.slice(start, end);

            return {
                data: {
                    content,
                    totalPages: Math.ceil(applications.length / size),
                    totalElements: applications.length,
                    size: size,
                    number: page,
                    first: page === 0,
                    last: end >= applications.length,
                },
            };
        }

        if (url === "/saved-jobs" || url.includes("/saved-jobs")) {
            return { data: savedJobs };
        }

        if (
            url.includes("/follows/companies") ||
            url.includes("/follows/by-user")
        ) {
            return { data: followedCompanies };
        }

        if (url.includes("/follows/status")) {
            const companyId = Number(params.company_id || url.split("/").pop());
            const isFollowed = followedCompanies.some(
                (fc) => fc.companyId === companyId
            );
            return { data: { followed: isFollowed } };
        }

        if (url.includes("/follows/count")) {
            return {
                data: { totalFollowers: Math.floor(Math.random() * 1000) + 50 },
            };
        }

        if (url.includes("/interviews/candidate")) {
            const page = params.page || 0;
            const size = params.size || 10;
            const start = page * size;
            const end = start + size;
            const content = interviews.slice(start, end);

            return {
                data: {
                    content,
                    totalPages: Math.ceil(interviews.length / size),
                    totalElements: interviews.length,
                    size: size,
                    number: page,
                    first: page === 0,
                    last: end >= interviews.length,
                },
            };
        }

        if (url.includes("/cv-template")) {
            return { data: cvTemplates };
        }

        if (url.includes("/profile/combined")) {
            return { data: combinedProfile };
        }

        if (url.includes("/settings")) {
            return { data: settings };
        }

        if (url.includes("/auth/me")) {
            return { data: users[0] };
        }

        // Default: Return empty data
        console.warn(`[Mock RTK Query] Unhandled endpoint: ${url}`);
        return { data: {} };
    };

export default mockBaseQuery;
