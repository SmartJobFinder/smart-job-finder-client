import { jobs } from "./data/jobs";
import { companies } from "./data/companies";
import { users } from "./data/users";
import { categories } from "./data/categories";
import { cities, wards } from "./data/locations";

// Hàm trợ giúp
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const paginate = (array, page = 0, size = 10) => {
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const items = array.slice(startIndex, endIndex);

    return {
        content: items,
        pageable: { pageNumber: page, pageSize: size },
        totalElements: array.length,
        totalPages: Math.ceil(array.length / size),
        first: page === 0,
        last: endIndex >= array.length,
        number: page,
        size: size,
        numberOfElements: items.length,
    };
};

// Dịch vụ API giả
const mockApi = {
    // Endpoints xác thực
    async login(credentials) {
        await delay(500);
        const user = users.find((u) => u.email === credentials.email);
        if (!user || credentials.password !== "password") {
            throw new Error("Thông tin đăng nhập không hợp lệ");
        }
        return { data: user };
    },

    async register(userData) {
        await delay(700);
        const newUser = {
            id: users.length + 1,
            email: userData.email,
            name: userData.name,
            role: userData.role || "CANDIDATE",
            avatar: null,
            isActive: true,
        };
        return {
            data: {
                message:
                    "Đăng ký thành công. Vui lòng kiểm tra email để kích hoạt tài khoản.",
            },
        };
    },

    async me() {
        await delay(300);
        return { data: users[0] };
    },

    async logout() {
        await delay(200);
        return { data: { message: "Đăng xuất thành công" } };
    },

    // Endpoints công việc
    async getJobs(params = {}) {
        await delay(600);
        const page = params.page || 0;
        const size = params.size || 10;
        return { data: paginate(jobs, page, size) };
    },

    async getJobById(id) {
        await delay(500);
        const job = jobs.find((job) => job.id === Number(id));
        if (!job) {
            throw new Error("Không tìm thấy công việc");
        }
        return { data: job };
    },

    // Endpoints công ty
    async getCompanies(params = {}) {
        await delay(600);
        const page = params.page || 0;
        const size = params.size || 10;
        return { data: paginate(companies, page, size) };
    },

    async getCompanyById(id) {
        await delay(500);
        const company = companies.find((company) => company.id === Number(id));
        if (!company) {
            throw new Error("Không tìm thấy công ty");
        }
        return { data: company };
    },

    // Endpoints danh mục
    async getCategories() {
        await delay(400);
        return { data: categories };
    },

    async getRootCategories() {
        await delay(400);
        return { data: categories.filter((category) => !category.parent) };
    },

    // Endpoints địa điểm
    async getCities() {
        await delay(300);
        return { data: cities };
    },

    async getWards(cityName) {
        await delay(300);
        return { data: wards[cityName] || [] };
    },
};

export default mockApi;
