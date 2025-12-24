import { jobs } from "./data/jobs";
import { companies } from "./data/companies";
import { users } from "./data/users";
import { categories } from "./data/categories";
import { cities, wards } from "./data/locations";

// Hàm trợ giúp
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

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
    const user = users.find(u => u.email === credentials.email);
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
    const job = jobs.find(job => job.id === Number(id));
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
    const company = companies.find(company => company.id === Number(id));
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
    return { data: categories.filter(category => !category.parent) };
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
// import { jobs } from "./data/jobs";
// import { companies } from "./data/companies";
// import { users } from "./data/users";
// import { categories } from "./data/categories";
// import { cities, wards } from "./data/locations";
// import { applications } from "./data/applications";
// import { savedJobs } from "./data/savedJobs";
// import { followedCompanies } from "./data/followedCompanies";
// import { interviews } from "./data/interviews";
// import { cvTemplates } from "./data/cvTemplates";
// import { combinedProfile } from "./data/combinedProfile";
// import { settings } from "./data/settings";

// // Helper functions
// const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// const paginate = (array, page = 0, size = 10) => {
//     const startIndex = page * size;
//     const endIndex = startIndex + size;
//     const items = array.slice(startIndex, endIndex);

//     return {
//         content: items,
//         pageable: { pageNumber: page, pageSize: size },
//         totalElements: array.length,
//         totalPages: Math.ceil(array.length / size),
//         first: page === 0,
//         last: endIndex >= array.length,
//         number: page,
//         size: size,
//         numberOfElements: items.length,
//     };
// };

// // Mock API service
// const mockApi = {
//     // Authentication endpoints
//     async login(credentials) {
//         await delay(500);
//         const user = users.find((u) => u.email === credentials.email);
//         if (!user || credentials.password !== "password") {
//             throw new Error("Thông tin đăng nhập không hợp lệ");
//         }
//         return { data: user };
//     },

//     async register(userData) {
//         await delay(700);
//         const newUser = {
//             id: users.length + 1,
//             email: userData.email,
//             name: userData.name,
//             role: userData.role || "CANDIDATE",
//             avatar: null,
//             isActive: true,
//         };
//         return {
//             data: {
//                 message:
//                     "Đăng ký thành công. Vui lòng kiểm tra email để kích hoạt tài khoản.",
//             },
//         };
//     },

//     async me() {
//         await delay(300);
//         return { data: users[0] };
//     },

//     async logout() {
//         await delay(200);
//         return { data: { message: "Đăng xuất thành công" } };
//     },

//     // Job endpoints
//     async getJobs(params = {}) {
//         await delay(600);
//         let filteredJobs = [...jobs];

//         // Filter jobs by search params
//         if (params.title) {
//             const searchTerm = params.title.toLowerCase();
//             filteredJobs = filteredJobs.filter((job) =>
//                 job.title.toLowerCase().includes(searchTerm)
//             );
//         }

//         if (params.location) {
//             const location = params.location.toLowerCase();
//             filteredJobs = filteredJobs.filter((job) =>
//                 job.location.toLowerCase().includes(location)
//             );
//         }

//         if (params.categoryIds) {
//             const categoryIds = Array.isArray(params.categoryIds)
//                 ? params.categoryIds
//                 : params.categoryIds.split(",").map((id) => parseInt(id));

//             filteredJobs = filteredJobs.filter((job) => {
//                 const jobCategories = categories
//                     .filter((cat) => job.category_names.includes(cat.name))
//                     .map((cat) => cat.id);
//                 return categoryIds.some((id) => jobCategories.includes(id));
//             });
//         }

//         const page = params.page || 0;
//         const size = params.size || 10;

//         return { data: paginate(filteredJobs, page, size) };
//     },

//     async getJobById(id) {
//         await delay(500);
//         const job = jobs.find((job) => job.id === Number(id));
//         if (!job) {
//             throw new Error("Không tìm thấy công việc");
//         }
//         return { data: job };
//     },

//     async getRelatedJobs(id) {
//         await delay(600);
//         const job = jobs.find((job) => job.id === Number(id));
//         if (!job) {
//             throw new Error("Không tìm thấy công việc");
//         }

//         // Filter jobs by same category or company
//         const relatedJobs = jobs
//             .filter(
//                 (j) =>
//                     j.id !== job.id &&
//                     (j.company.company_id === job.company.company_id ||
//                         j.category_names.some((cat) =>
//                             job.category_names.includes(cat)
//                         ))
//             )
//             .slice(0, 5);

//         return { data: relatedJobs };
//     },

//     // Company endpoints
//     async getCompanies(params = {}) {
//         await delay(600);
//         let filteredCompanies = [...companies];

//         // Filter companies by search params
//         if (params.name || params.company) {
//             const searchTerm = (params.name || params.company).toLowerCase();
//             filteredCompanies = filteredCompanies.filter(
//                 (company) =>
//                     company.name.toLowerCase().includes(searchTerm) ||
//                     (company.companyName &&
//                         company.companyName
//                             .toLowerCase()
//                             .includes(searchTerm)) ||
//                     (company.company_name &&
//                         company.company_name.toLowerCase().includes(searchTerm))
//             );
//         }

//         if (params.location) {
//             const location = params.location.toLowerCase();
//             filteredCompanies = filteredCompanies.filter((company) =>
//                 company.location.toLowerCase().includes(location)
//             );
//         }

//         if (params.industry) {
//             const industry = params.industry.toLowerCase();
//             filteredCompanies = filteredCompanies.filter((company) =>
//                 company.industry.toLowerCase().includes(industry)
//             );
//         }

//         if (params.categoryIds) {
//             const categoryIds = Array.isArray(params.categoryIds)
//                 ? params.categoryIds
//                 : params.categoryIds.split(",").map((id) => parseInt(id));

//             filteredCompanies = filteredCompanies.filter(
//                 (company) =>
//                     company.categoryIds &&
//                     company.categoryIds.some((id) => categoryIds.includes(id))
//             );
//         }

//         const page = params.page || 0;
//         const size = params.size || 10;

//         return { data: paginate(filteredCompanies, page, size) };
//     },

//     async getCompanyById(id) {
//         await delay(500);
//         const company = companies.find((company) => company.id === Number(id));
//         if (!company) {
//             throw new Error("Không tìm thấy công ty");
//         }
//         return { data: company };
//     },

//     async getCompanyJobs(companyId, params = {}) {
//         await delay(600);
//         const companyJobs = jobs.filter(
//             (job) => job.company.company_id === Number(companyId)
//         );

//         const page = params.page || 0;
//         const size = params.size || 10;

//         return { data: paginate(companyJobs, page, size) };
//     },

//     // Category endpoints
//     async getCategories() {
//         await delay(400);
//         return { data: categories };
//     },

//     async getRootCategories() {
//         await delay(400);
//         return { data: categories.filter((category) => !category.parent) };
//     },

//     // Location endpoints
//     async getCities() {
//         await delay(300);
//         return {
//             data: cities || [
//                 "Hà Nội",
//                 "Hồ Chí Minh",
//                 "Đà Nẵng",
//                 "Hải Phòng",
//                 "Cần Thơ",
//             ],
//         };
//     },

//     async getWards(cityName) {
//         await delay(300);
//         return { data: wards?.[cityName] || [] };
//     },

//     // Application endpoints
//     async getApplicationsByUser(params = {}) {
//         await delay(500);
//         const page = params.page || 0;
//         const size = params.size || 10;
//         return { data: paginate(applications, page, size) };
//     },

//     async createApplication(formData) {
//         await delay(800);
//         const newApplication = {
//             id: applications.length + 1,
//             ...formData,
//             status: "PENDING",
//             createdAt: new Date().toISOString(),
//             updatedAt: new Date().toISOString(),
//         };
//         return { data: newApplication };
//     },

//     async getApplicationById(id) {
//         await delay(500);
//         const application = applications.find((app) => app.id === Number(id));
//         if (!application) {
//             throw new Error("Không tìm thấy hồ sơ ứng tuyển");
//         }
//         return { data: application };
//     },

//     async updateApplication(id, updateData) {
//         await delay(600);
//         const application = applications.find((app) => app.id === Number(id));
//         if (!application) {
//             throw new Error("Không tìm thấy hồ sơ ứng tuyển");
//         }
//         const updatedApplication = {
//             ...application,
//             ...updateData,
//             updatedAt: new Date().toISOString(),
//         };
//         return { data: updatedApplication };
//     },

//     // Saved jobs endpoints
//     async getSavedJobs() {
//         await delay(500);
//         return { data: savedJobs };
//     },

//     async saveJob(jobId) {
//         await delay(400);
//         const newSavedJob = {
//             id: savedJobs.length + 1,
//             userId: 1,
//             jobId: Number(jobId),
//             savedAt: new Date().toISOString(),
//             job: jobs.find((job) => job.id === Number(jobId)),
//         };
//         return { data: newSavedJob };
//     },

//     async unsaveJob(jobId) {
//         await delay(400);
//         return { data: { message: "Đã bỏ lưu công việc" } };
//     },

//     async getSaveStatus(jobId) {
//         await delay(300);
//         const isSaved = savedJobs.some((sj) => sj.jobId === Number(jobId));
//         return { data: { saved: isSaved } };
//     },

//     // Followed companies endpoints
//     async getFollowedCompanies() {
//         await delay(500);
//         return { data: followedCompanies };
//     },

//     async followCompany(companyId) {
//         await delay(400);
//         const newFollow = {
//             id: followedCompanies.length + 1,
//             userId: 1,
//             companyId: Number(companyId),
//             followedAt: new Date().toISOString(),
//             company: companies.find(
//                 (company) => company.id === Number(companyId)
//             ),
//         };
//         return { data: newFollow };
//     },

//     async unfollowCompany(companyId) {
//         await delay(400);
//         return { data: { message: "Đã bỏ theo dõi công ty" } };
//     },

//     async getFollowStatus(companyId) {
//         await delay(300);
//         const isFollowed = followedCompanies.some(
//             (fc) => fc.companyId === Number(companyId)
//         );
//         return { data: { followed: isFollowed } };
//     },

//     async getFollowCount(companyId) {
//         await delay(300);
//         return {
//             data: { totalFollowers: Math.floor(Math.random() * 1000) + 50 },
//         };
//     },

//     // Interview endpoints
//     async getInterviewsForCandidate(params = {}) {
//         await delay(500);
//         const page = params.page || 0;
//         const size = params.size || 10;
//         return { data: paginate(interviews, page, size) };
//     },

//     async getInterviewById(id) {
//         await delay(400);
//         const interview = interviews.find((i) => i.id === Number(id));
//         if (!interview) {
//             throw new Error("Không tìm thấy lịch phỏng vấn");
//         }
//         return { data: interview };
//     },

//     async updateInterviewStatus(id, status) {
//         await delay(600);
//         const interview = interviews.find((i) => i.id === Number(id));
//         if (!interview) {
//             throw new Error("Không tìm thấy lịch phỏng vấn");
//         }
//         const updatedInterview = {
//             ...interview,
//             status,
//             updatedAt: new Date().toISOString(),
//         };
//         return { data: updatedInterview };
//     },

//     // CV template endpoints
//     async getAllTemplates() {
//         await delay(600);
//         return { data: cvTemplates };
//     },

//     async getTemplateById(id) {
//         await delay(400);
//         const template = cvTemplates.find((t) => t.id === Number(id));
//         if (!template) {
//             throw new Error("Không tìm thấy mẫu CV");
//         }
//         return { data: template };
//     },

//     // Profile endpoints
//     async getCombinedProfile() {
//         await delay(700);
//         return { data: combinedProfile };
//     },

//     async updateProfileSection(section, data) {
//         await delay(600);
//         const updatedProfile = {
//             ...combinedProfile,
//             [section]: Array.isArray(combinedProfile[section])
//                 ? [
//                       ...combinedProfile[section],
//                       { id: combinedProfile[section].length + 1, ...data },
//                   ]
//                 : { ...combinedProfile[section], ...data },
//         };
//         return { data: updatedProfile[section] };
//     },

//     async deleteProfileItem(section, id) {
//         await delay(500);
//         if (!Array.isArray(combinedProfile[section])) {
//             throw new Error("Không thể xóa mục từ phần không phải mảng");
//         }
//         const updatedItems = combinedProfile[section].filter(
//             (item) => item.id !== Number(id)
//         );
//         return { data: { message: "Đã xóa thành công" } };
//     },

//     // Settings endpoints
//     async getUserSettings() {
//         await delay(400);
//         return { data: settings };
//     },

//     async updateUserSettings(newSettings) {
//         await delay(600);
//         const updatedSettings = {
//             ...settings,
//             ...newSettings,
//         };
//         return { data: updatedSettings };
//     },

//     // Industries (for company search)
//     async getIndustries() {
//         await delay(400);
//         const industries = [
//             ...new Set(companies.map((company) => company.industry)),
//         ];
//         return { data: industries };
//     },

//     // Locations (for search)
//     async getLocations() {
//         await delay(400);
//         const locations = [
//             ...new Set(companies.map((company) => company.location)),
//         ];
//         return { data: locations };
//     },

//     // Company sizes (for filters)
//     async getCompanySizes() {
//         await delay(300);
//         return {
//             data: ["1-10", "11-50", "51-100", "101-500", "501-1000", "1000+"],
//         };
//     },
// };

// export default mockApi;
