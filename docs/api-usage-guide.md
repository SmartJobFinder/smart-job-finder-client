# Hướng Dẫn Gọi API - Smart Job Finder Client

## 📌 Tổng Quan

Dự án sử dụng 2 cách chính để gọi API:
1. **RTK Query** - Cho data fetching, caching, và real-time updates
2. **Axios** - Cho one-time API calls

## 🔧 Cấu Hình API

### Base Configuration

File: `src/lib/api.js`

```javascript
import axios from "axios";
import { API_CONFIG } from "./config";

const api = axios.create({
    baseURL: API_CONFIG.BASE_URL,  // /api/v1
    timeout: 60000,                 // 60 seconds
    withCredentials: true,          // Gửi cookies
});
```

### Environment Variables

```bash
# .env.local
NEXT_PUBLIC_API_PROXY_TARGET=http://localhost:8082
NEXT_PUBLIC_API_BASE_URL=/api/v1
```

### Auto Refresh Token

API client tự động refresh access token khi nhận 401:

```javascript
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        if (response.status === 401 && !config._retry) {
            // Refresh token
            await axios.post('/auth/refresh', null, {
                withCredentials: true,
            });
            
            // Retry request
            config._retry = true;
            return api(config);
        }
        throw error;
    }
);
```

## 📡 Cách 1: Sử Dụng RTK Query (Recommended)

### Khi Nào Dùng RTK Query?
✅ Cần caching data  
✅ Cần auto-refetch  
✅ Cần loading/error states tự động  
✅ Data được sử dụng ở nhiều components  
✅ Cần invalidate cache sau mutations  

### Ví Dụ 1: Query (GET)

#### Định nghĩa Service

File: `src/services/jobService.js`

```javascript
import { createApi } from "@reduxjs/toolkit/query/react";
import api from "@/lib/api";

const axiosBaseQuery = (basePath = "") => 
    async ({ url, method = "GET", data, headers }, { signal }) => {
        try {
            const config = {
                url: `${basePath}${url || ""}`,
                method,
                data,
                signal,
                headers: {
                    "Content-Type": "application/json",
                    ...headers,
                },
            };
            
            const result = await api(config);
            return { data: result.data };
        } catch (axiosError) {
            return {
                error: {
                    status: axiosError.response?.status,
                    data: axiosError.response?.data || axiosError.message,
                },
            };
        }
    };

export const jobApi = createApi({
    reducerPath: "jobApi",
    baseQuery: axiosBaseQuery("/job"),
    endpoints: (builder) => ({
        // GET /job/{id}
        getJobById: builder.query({
            query: (id) => ({
                url: `/${id}`,
                method: "GET",
            }),
        }),
        
        // GET /job/all?page=0&size=10
        getJobs: builder.query({
            query: ({ page = 0, size = 10, sort = "id,asc" } = {}) => {
                const params = new URLSearchParams();
                params.append("page", page.toString());
                params.append("size", size.toString());
                params.append("sort", sort);
                
                return {
                    url: `/all?${params.toString()}`,
                    method: "GET",
                };
            },
            transformResponse: (response) => ({
                jobs: response.content || [],
                totalPages: response.totalPages,
                totalElements: response.totalElements,
            }),
        }),
    }),
});

export const { 
    useGetJobByIdQuery, 
    useGetJobsQuery 
} = jobApi;
```

#### Sử Dụng Trong Component

```javascript
import { useGetJobByIdQuery, useGetJobsQuery } from "@/services/jobService";

function JobDetailPage({ jobId }) {
    // Query single job
    const { 
        data: job, 
        isLoading, 
        isError, 
        error 
    } = useGetJobByIdQuery(jobId);
    
    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error.message}</div>;
    
    return <div>{job.title}</div>;
}

function JobListPage() {
    // Query with pagination
    const { data, isLoading } = useGetJobsQuery({
        page: 0,
        size: 20,
        sort: "id,desc"
    });
    
    if (isLoading) return <div>Loading...</div>;
    
    return (
        <div>
            {data.jobs.map(job => (
                <JobCard key={job.id} job={job} />
            ))}
            <Pagination total={data.totalPages} />
        </div>
    );
}
```

### Ví Dụ 2: Mutation (POST/PUT/DELETE)

#### Định nghĩa Service

```javascript
export const jobApi = createApi({
    reducerPath: "jobApi",
    baseQuery: axiosBaseQuery("/job"),
    tagTypes: ["Jobs"],
    endpoints: (builder) => ({
        // POST /job/search-lite
        searchJobs: builder.mutation({
            query: (body) => {
                const page = body.page ?? 0;
                const size = body.size ?? 10;
                const sort = body.sort ?? "id,desc";
                
                const filterBody = { ...body };
                delete filterBody.page;
                delete filterBody.size;
                delete filterBody.sort;
                
                return {
                    url: `/search-lite?page=${page}&size=${size}&sort=${sort}`,
                    method: "POST",
                    data: filterBody,
                };
            },
            transformResponse: (res) => ({
                jobs: res?.content || [],
                totalPages: res?.totalPages ?? 1,
                totalElements: res?.totalElements ?? 0,
            }),
        }),
    }),
});

export const { useSearchJobsMutation } = jobApi;
```

#### Sử Dụng Trong Component

```javascript
import { useSearchJobsMutation } from "@/services/jobService";

function JobSearchPage() {
    const [searchJobs, { data, isLoading, isError }] = useSearchJobsMutation();
    
    const handleSearch = async (filters) => {
        try {
            const result = await searchJobs({
                keyword: filters.keyword,
                location: filters.location,
                categoryIds: filters.categories,
                page: 0,
                size: 20,
            }).unwrap();
            
            console.log("Search results:", result);
        } catch (error) {
            console.error("Search failed:", error);
        }
    };
    
    return (
        <div>
            <SearchForm onSubmit={handleSearch} />
            {isLoading && <div>Searching...</div>}
            {data && (
                <div>
                    Found {data.totalElements} jobs
                    {data.jobs.map(job => <JobCard key={job.id} job={job} />)}
                </div>
            )}
        </div>
    );
}
```

### Ví Dụ 3: Application Service với Cache Invalidation

```javascript
export const applicationApi = createApi({
    reducerPath: "applicationApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["Applications", "ApplicationStatus"],
    endpoints: (builder) => ({
        // POST /application
        createApplication: builder.mutation({
            query: (formData) => ({
                url: "/application",
                method: "POST",
                data: formData,
            }),
            // Invalidate cache sau khi apply
            invalidatesTags: (result, error, { jobId }) => [
                "Applications",
                { type: "ApplicationStatus", id: jobId },
            ],
        }),
        
        // GET /application/status?job_id={jobId}
        getApplyStatus: builder.query({
            query: (jobId) => ({
                url: `/application/status?job_id=${jobId}`,
                method: "GET",
            }),
            providesTags: (result, error, jobId) => [
                { type: "ApplicationStatus", id: jobId }
            ],
        }),
    }),
});
```

#### Sử Dụng

```javascript
import { 
    useCreateApplicationMutation, 
    useGetApplyStatusQuery 
} from "@/services/applicationService";

function ApplyButton({ jobId }) {
    const { data: applyStatus } = useGetApplyStatusQuery(jobId);
    const [createApplication, { isLoading }] = useCreateApplicationMutation();
    
    const handleApply = async () => {
        const formData = new FormData();
        formData.append("jobId", jobId);
        formData.append("cvFile", cvFile);
        formData.append("coverLetter", coverLetter);
        
        try {
            await createApplication(formData).unwrap();
            toast.success("Applied successfully!");
            // Cache sẽ tự động invalidate và refetch applyStatus
        } catch (error) {
            toast.error("Failed to apply");
        }
    };
    
    if (applyStatus?.applied) {
        return <div>Already applied</div>;
    }
    
    return (
        <button onClick={handleApply} disabled={isLoading}>
            {isLoading ? "Applying..." : "Apply Now"}
        </button>
    );
}
```

## 📡 Cách 2: Sử Dụng Axios Trực Tiếp

### Khi Nào Dùng Axios?
✅ One-time API calls  
✅ Không cần caching  
✅ Authentication endpoints  
✅ File uploads  
✅ Simple CRUD operations  

### Ví Dụ 1: Auth Service

File: `src/services/authService.js`

```javascript
import api from "@/lib/api";

const authService = {
    // POST /auth/login
    async login(credentials) {
        const { data } = await api.post("/auth/login", credentials);
        return {
            user: data,
            message: "Login successful",
        };
    },
    
    // POST /auth/register
    async register(payload) {
        const { data } = await api.post("/auth/register", payload);
        return data;
    },
    
    // GET /auth/me
    async me() {
        const { data } = await api.get("/auth/me");
        return { user: data };
    },
    
    // POST /auth/logout
    async logout() {
        try {
            await api.post("/auth/logout");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    },
    
    // POST /auth/password/forgot
    async forgotPassword(email) {
        await api.post("/auth/password/forgot", { email });
        return { 
            message: "If the email exists, we have sent you a password reset link." 
        };
    },
    
    // POST /auth/password/resetPassword
    async resetPassword({ token, newPassword }) {
        await api.post("/auth/password/resetPassword", { token, newPassword });
        return { 
            message: "Your password has been updated. You can now log in." 
        };
    },
};

export default authService;
```

### Ví Dụ 2: Sử Dụng Auth Service

```javascript
import authService from "@/services/authService";
import { useDispatch } from "react-redux";
import { setUser } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";

function LoginPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    const handleLogin = async (credentials) => {
        setLoading(true);
        try {
            const { user } = await authService.login(credentials);
            
            // Save to Redux
            dispatch(setUser(user));
            
            // Redirect
            router.push("/dashboard");
            
            toast.success("Login successful!");
        } catch (error) {
            const message = error.response?.data?.message || "Login failed";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit(handleLogin)}>
            <input {...register("email")} />
            <input {...register("password")} type="password" />
            <button type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
            </button>
        </form>
    );
}
```

### Ví Dụ 3: Company Service với File Upload

File: `src/services/companyService.js`

```javascript
import api from "@/lib/api";

export const createCompany = async (
    companyData,
    avatarFile = null,
    coverFile = null
) => {
    try {
        const formData = new FormData();
        
        // Add text data
        Object.keys(companyData).forEach((key) => {
            if (companyData[key] !== null && 
                companyData[key] !== undefined && 
                companyData[key] !== "") {
                if (key === "categoryIds" && Array.isArray(companyData[key])) {
                    formData.append("categoryIds", companyData[key].join(","));
                } else {
                    formData.append(key, companyData[key]);
                }
            }
        });
        
        // Add files
        if (avatarFile) {
            formData.append("avatarFile", avatarFile);
        }
        if (coverFile) {
            formData.append("avatarCoverFile", coverFile);
        }
        
        // POST with FormData
        const response = await api.post("/companies/add", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            timeout: 120000, // 2 minutes for upload
        });
        
        return response.data;
    } catch (error) {
        console.error("Error creating company:", error);
        throw error;
    }
};

export const getMyCompany = async () => {
    const response = await api.get("/companies/my-company");
    return response.data;
};

export const updateCompany = async (companyId, companyData) => {
    const response = await api.put(`/companies/${companyId}`, companyData);
    return response.data;
};
```

### Ví Dụ 4: Sử Dụng Company Service

```javascript
import { createCompany, getMyCompany } from "@/services/companyService";

function CreateCompanyPage() {
    const [loading, setLoading] = useState(false);
    const [avatarFile, setAvatarFile] = useState(null);
    const [coverFile, setCoverFile] = useState(null);
    
    const handleSubmit = async (formData) => {
        setLoading(true);
        try {
            const companyData = {
                name: formData.name,
                description: formData.description,
                address: formData.address,
                website: formData.website,
                categoryIds: formData.categories, // [1, 2, 3]
            };
            
            const result = await createCompany(
                companyData,
                avatarFile,
                coverFile
            );
            
            toast.success("Company created successfully!");
            router.push(`/company/${result.id}`);
        } catch (error) {
            toast.error("Failed to create company");
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit(handleSubmit)}>
            <input {...register("name")} />
            <textarea {...register("description")} />
            
            <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files[0])}
            />
            
            <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setCoverFile(e.target.files[0])}
            />
            
            <button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Company"}
            </button>
        </form>
    );
}
```

## 🔄 So Sánh RTK Query vs Axios

| Feature | RTK Query | Axios |
|---------|-----------|-------|
| **Caching** | ✅ Tự động | ❌ Không có |
| **Loading State** | ✅ Tự động | ⚠️ Phải tự quản lý |
| **Error Handling** | ✅ Tự động | ⚠️ Phải tự quản lý |
| **Refetching** | ✅ Tự động | ❌ Phải gọi lại |
| **Optimistic Updates** | ✅ Hỗ trợ | ❌ Không có |
| **Cache Invalidation** | ✅ Hỗ trợ | ❌ Không có |
| **Polling** | ✅ Hỗ trợ | ⚠️ Phải tự implement |
| **Prefetching** | ✅ Hỗ trợ | ❌ Không có |
| **Bundle Size** | ⚠️ Lớn hơn | ✅ Nhỏ hơn |
| **Complexity** | ⚠️ Phức tạp hơn | ✅ Đơn giản |
| **Use Case** | Data fetching | One-time calls |

## 🎯 Best Practices

### 1. Error Handling

#### RTK Query
```javascript
const { data, error, isError } = useGetJobsQuery();

if (isError) {
    const errorMessage = error?.data?.message || "Something went wrong";
    return <ErrorMessage message={errorMessage} />;
}
```

#### Axios
```javascript
try {
    const result = await authService.login(credentials);
} catch (error) {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    
    if (status === 401) {
        toast.error("Invalid credentials");
    } else if (status === 500) {
        toast.error("Server error");
    } else {
        toast.error(message || "Something went wrong");
    }
}
```

### 2. Loading States

#### RTK Query
```javascript
const { data, isLoading, isFetching } = useGetJobsQuery();

// isLoading: true lần đầu fetch
// isFetching: true mỗi khi refetch

if (isLoading) return <Spinner />;
if (isFetching) return <div>Updating... <Spinner size="sm" /></div>;
```

#### Axios
```javascript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
    setLoading(true);
    try {
        const data = await api.get("/endpoint");
        setData(data);
    } finally {
        setLoading(false);
    }
};
```

### 3. Conditional Fetching

#### RTK Query
```javascript
// Skip query nếu không có userId
const { data } = useGetUserProfileQuery(userId, {
    skip: !userId,
});

// Refetch on focus
const { data } = useGetJobsQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
});

// Polling
const { data } = useGetNotificationsQuery(undefined, {
    pollingInterval: 30000, // 30 seconds
});
```

### 4. Optimistic Updates

```javascript
const [updateJob] = useUpdateJobMutation();

const handleUpdate = async (jobId, updates) => {
    try {
        await updateJob({
            id: jobId,
            ...updates,
        }).unwrap();
    } catch (error) {
        // Rollback tự động nếu fail
        toast.error("Update failed");
    }
};
```

### 5. Prefetching

```javascript
import { useDispatch } from "react-redux";
import { jobApi } from "@/services/jobService";

function JobCard({ jobId }) {
    const dispatch = useDispatch();
    
    const handleMouseEnter = () => {
        // Prefetch job detail khi hover
        dispatch(
            jobApi.util.prefetch("getJobById", jobId, { force: false })
        );
    };
    
    return (
        <div onMouseEnter={handleMouseEnter}>
            <Link href={`/job/${jobId}`}>View Job</Link>
        </div>
    );
}
```

## 📝 Common Patterns

### Pattern 1: Search với Debounce

```javascript
import { useSearchJobsMutation } from "@/services/jobService";
import { useDebounce } from "@/hooks/useDebounce";

function JobSearch() {
    const [keyword, setKeyword] = useState("");
    const debouncedKeyword = useDebounce(keyword, 500);
    const [searchJobs, { data, isLoading }] = useSearchJobsMutation();
    
    useEffect(() => {
        if (debouncedKeyword) {
            searchJobs({ keyword: debouncedKeyword });
        }
    }, [debouncedKeyword]);
    
    return (
        <div>
            <input 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search jobs..."
            />
            {isLoading && <Spinner />}
            {data?.jobs.map(job => <JobCard key={job.id} job={job} />)}
        </div>
    );
}
```

### Pattern 2: Infinite Scroll

```javascript
function JobList() {
    const [page, setPage] = useState(0);
    const { data, isLoading, isFetching } = useGetJobsQuery({ 
        page, 
        size: 20 
    });
    
    const handleLoadMore = () => {
        if (!isFetching && page < data.totalPages - 1) {
            setPage(prev => prev + 1);
        }
    };
    
    return (
        <div>
            {data?.jobs.map(job => <JobCard key={job.id} job={job} />)}
            {isFetching && <Spinner />}
            {page < data.totalPages - 1 && (
                <button onClick={handleLoadMore}>Load More</button>
            )}
        </div>
    );
}
```

### Pattern 3: Form Submit với Validation

```javascript
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
});

function LoginForm() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    
    const [login, { isLoading }] = useLoginMutation();
    
    const onSubmit = async (data) => {
        try {
            await login(data).unwrap();
            toast.success("Login successful!");
        } catch (error) {
            toast.error(error.data?.message || "Login failed");
        }
    };
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register("email")} />
            {errors.email && <span>{errors.email.message}</span>}
            
            <input {...register("password")} type="password" />
            {errors.password && <span>{errors.password.message}</span>}
            
            <button type="submit" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
            </button>
        </form>
    );
}
```

## 🚀 Advanced Topics

### 1. Custom Base Query với Retry Logic

```javascript
const axiosBaseQueryWithRetry = (basePath = "") => 
    async (args, api, extraOptions) => {
        const maxRetries = 3;
        let retries = 0;
        
        while (retries < maxRetries) {
            try {
                const result = await axiosBaseQuery(basePath)(args, api, extraOptions);
                if (!result.error) return result;
                
                // Retry on 5xx errors
                if (result.error.status >= 500) {
                    retries++;
                    await new Promise(resolve => 
                        setTimeout(resolve, 1000 * retries)
                    );
                    continue;
                }
                
                return result;
            } catch (error) {
                if (retries === maxRetries - 1) throw error;
                retries++;
            }
        }
    };
```

### 2. Request Cancellation

```javascript
function SearchJobs() {
    const [searchJobs, { data, isLoading }] = useSearchJobsMutation();
    const abortControllerRef = useRef();
    
    const handleSearch = (keyword) => {
        // Cancel previous request
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();
        
        searchJobs(
            { keyword },
            { signal: abortControllerRef.current.signal }
        );
    };
    
    useEffect(() => {
        return () => {
            abortControllerRef.current?.abort();
        };
    }, []);
}
```

### 3. Batch Requests

```javascript
async function fetchMultipleJobs(jobIds) {
    const promises = jobIds.map(id => 
        api.get(`/job/${id}`)
    );
    
    const results = await Promise.allSettled(promises);
    
    return results.map((result, index) => ({
        id: jobIds[index],
        data: result.status === "fulfilled" ? result.value.data : null,
        error: result.status === "rejected" ? result.reason : null,
    }));
}
```

## 📚 Tài Liệu Tham Khảo

- [RTK Query Documentation](https://redux-toolkit.js.org/rtk-query/overview)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [React Hook Form](https://react-hook-form.com/)
- [Yup Validation](https://github.com/jquense/yup)
