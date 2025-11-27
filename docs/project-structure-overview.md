# Tổng Quan Dự Án Smart Job Finder Client

## 📋 Thông Tin Cơ Bản

**Tên dự án:** smart-job-finder-client  
**Framework:** Next.js 15.4.2  
**React Version:** 19.1.0  
**Ngôn ngữ:** JavaScript  
**Package Manager:** npm  

## 🏗️ Kiến Trúc Dự Án

Dự án sử dụng **Next.js App Router** với cấu trúc thư mục như sau:

```
smart-job-finder-client/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── features/         # Redux features/slices
│   ├── services/         # API services (RTK Query)
│   ├── store/            # Redux store configuration
│   ├── lib/              # Utilities & configurations
│   ├── hooks/            # Custom React hooks
│   ├── constants/        # Constants & enums
│   ├── validation/       # Form validation schemas
│   ├── i18n/             # Internationalization
│   ├── layout/           # Layout components
│   ├── mock/             # Mock data
│   └── middleware.js     # Next.js middleware
├── public/               # Static assets
└── docs/                 # Documentation
```

## 🔧 Công Nghệ Sử Dụng

### Core Technologies
- **Next.js 15.4.2** - React framework với App Router
- **React 19.1.0** - UI library
- **Redux Toolkit 2.8.2** - State management
- **RTK Query** - Data fetching & caching
- **Axios 1.11.0** - HTTP client
- **Zustand 5.0.6** - Lightweight state management

### UI & Styling
- **Tailwind CSS 4.1.11** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **Lucide React** - Icon library
- **Class Variance Authority** - Component variants

### Form & Validation
- **React Hook Form 7.60.0** - Form management
- **Yup 1.6.1** - Schema validation
- **@hookform/resolvers** - Form validation resolvers

### Rich Text Editors
- **BlockNote** - Block-based editor
- **Jodit React** - WYSIWYG editor
- **TinyMCE** - Rich text editor

### Other Libraries
- **date-fns** - Date utilities
- **jose** - JWT handling
- **js-cookie** - Cookie management
- **react-toastify** - Toast notifications
- **recharts** - Charts & data visualization
- **@stomp/stompjs** - WebSocket (STOMP protocol)
- **@jitsi/react-sdk** - Video conferencing

## 🌐 Cấu Hình API

### API Configuration (`src/lib/config.js`)

```javascript
const PROXY_TARGET = process.env.NEXT_PUBLIC_API_PROXY_TARGET || "";
const BASE_PATH = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/v1";

export const API_CONFIG = {
    BASE_URL: ABSOLUTE_BASE,
    TIMEOUT: 60000, // 60 seconds
};
```

### Environment Variables
```bash
NEXT_PUBLIC_API_PROXY_TARGET=http://localhost:8082
NEXT_PUBLIC_API_BASE_URL=/api/v1
NEXT_PUBLIC_WS_ENDPOINT=/ws
NEXT_PUBLIC_SUB_DEST=/user/queue/noti
```

### API Client (`src/lib/api.js`)

Dự án sử dụng **Axios** với các tính năng:

1. **Base Configuration:**
   - Base URL: Từ `API_CONFIG.BASE_URL`
   - Timeout: 60 seconds
   - Credentials: `withCredentials: true` (gửi cookies)

2. **Auto Refresh Token:**
   - Tự động refresh access token khi nhận 401 Unauthorized
   - Sử dụng refresh token từ HTTP-only cookies
   - Retry request sau khi refresh thành công

3. **Interceptors:**
   ```javascript
   // Response interceptor xử lý 401 errors
   api.interceptors.response.use(
       (res) => res,
       async (error) => {
           // Auto refresh logic
           if (response.status === 401 && !config._retry) {
               await axios.post('/auth/refresh', null, {
                   withCredentials: true,
               });
               return api(config); // Retry request
           }
           throw error;
       }
   );
   ```

## 📡 Services Layer

Dự án sử dụng **RTK Query** và **Axios** cho API calls:

### RTK Query Services

#### 1. Job Service (`src/services/jobService.js`)
```javascript
export const jobApi = createApi({
    reducerPath: "jobApi",
    baseQuery: axiosBaseQuery("/job"),
    endpoints: (builder) => ({
        getJobs: builder.query({...}),
        getJobById: builder.query({...}),
        searchJobs: builder.mutation({...}),
        searchJobsWithStatus: builder.mutation({...}),
    }),
});

// Exported hooks
useGetJobsQuery
useGetJobByIdQuery
useSearchJobsMutation
useSearchJobsWithStatusMutation
```

#### 2. Application Service (`src/services/applicationService.js`)
```javascript
export const applicationApi = createApi({
    reducerPath: "applicationApi",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["Applications", "ApplicationStatus"],
    endpoints: (builder) => ({
        createApplication: builder.mutation({...}),
        getApplicationsByUser: builder.query({...}),
        reapplyApplication: builder.mutation({...}),
        getApplyStatus: builder.query({...}),
        updateApplicationStatus: builder.mutation({...}),
    }),
});
```

#### 3. Auth Service (`src/services/authService.js`)
```javascript
const authService = {
    login(credentials),           // POST /auth/login
    register(payload),            // POST /auth/register
    me(),                         // GET /auth/me
    logout(),                     // POST /auth/logout
    activate(token),              // GET/POST /auth/activate
    resendActivation(email),      // POST /auth/resendActivation
    forgotPassword(email),        // POST /auth/password/forgot
    resetPassword({token, newPassword}), // POST /auth/password/resetPassword
    refresh(),                    // POST /auth/refresh
    sendSetPasswordLink(email),   // POST /auth/password/set-link
    setPassword({token, newPassword}), // POST /auth/password/set
};
```

#### 4. Company Service (`src/services/companyService.js`)
```javascript
export const getMyCompany = async () => {...}
export const createCompany = async (companyData, avatarFile, coverFile) => {...}
export const updateCompany = async (companyId, companyData) => {...}
```

### Các Services Khác
- `profileService.js` - User profile management
- `savedJobService.js` - Saved jobs
- `savedCompaniesService.js` - Saved companies
- `followCompanyService.js` - Follow companies
- `interviewService.js` - Interview management
- `cvTemplateService.js` - CV templates
- `cvMatchingService.js` - CV matching
- `locationService.js` - Cities & locations
- `categoryService.js` - Job categories
- `filterService.js` - Search filters
- `analyticsService.js` - Analytics
- `aiService.js` - AI features
- `aiInterviewCoachService.js` - AI interview coaching

## 🗂️ Redux Store

### Store Configuration (`src/store/index.js`)

```javascript
export const store = configureStore({
    reducer: {
        // Regular slices
        auth: authReducer,
        profile: profileReducer,
        personalDetail: personalDetailReducer,
        application: applicationReducer,
        cvTemplate: cvTemplateReducer,
        loginPrompt: loginPromptReducer,
        toast: toastSlice,
        
        // RTK Query APIs
        [jobApi.reducerPath]: jobApi.reducer,
        [profileApi.reducerPath]: profileApi.reducer,
        [applicationApi.reducerPath]: applicationApi.reducer,
        [savedCompaniesApi.reducerPath]: savedCompaniesApi.reducer,
        [savedJobApi.reducerPath]: savedJobApi.reducer,
        [cvTemplateApi.reducerPath]: cvTemplateApi.reducer,
        [locationApi.reducerPath]: locationApi.reducer,
        [filterApi.reducerPath]: filterApi.reducer,
        [followCompanyApi.reducerPath]: followCompanyApi.reducer,
        [interviewApi.reducerPath]: interviewApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({...})
            .concat(
                jobApi.middleware,
                profileApi.middleware,
                applicationApi.middleware,
                // ... other middlewares
            ),
});
```

### Features (Redux Slices)
- `auth/authSlice` - Authentication state
- `profile/profileSlice` - User profile
- `profile/personalDetailSlice` - Personal details
- `application/applicationSlice` - Job applications
- `templateCv/cvTemplateSlice` - CV templates
- `auth/loginPromptSlice` - Login prompt modal

## 🛣️ Routing & Middleware

### Next.js Middleware (`src/middleware.js`)

#### Protected Routes
```javascript
const protectedPrefixes = [
    /^\/profile/,
    /^\/dashboard/,
    /^\/job-invitation/,
    /^\/notifications/,
    /^\/saved-jobs/,
    /^\/companyFollows/,
    /^\/managecV/,
    /^\/interviews(\/|$)/,
    /^\/jobs(\/|$)/,
    /^\/applications/,
    /^\/settings/,
    /^\/recruiter(\/.*)?$/, // Toàn bộ khu recruiter
];
```

#### Recruiter-Only Routes
```javascript
const recruiterOnly = [
    /^\/recruiter(\/.*)?$/,
    /^\/recruiter-dashboard/,
    /^\/recruiter\/create-job/,
    /^\/company-profile/,
    /^\/manage-jobs/,
];
```

#### Public Routes
```javascript
const publicRoutes = [
    /^\/$/,                    // Home
    /^\/login$/,
    /^\/register$/,
    /^\/about$/,
    /^\/contact$/,
    /^\/forgot-password$/,
    /^\/search$/,
    /^\/company\/company-search$/,
    /^\/company\/company-detail\/[^/]+$/,
    /^\/job-detail\/[^/]+$/,
];
```

#### Authentication Logic
1. Kiểm tra cookie `AT` (Access Token)
2. Nếu không có token → redirect đến `/login?redirect=<current_path>`
3. Decode JWT để lấy role
4. Kiểm tra quyền truy cập:
   - Recruiter routes → chỉ cho RECRUITER role
   - Protected routes → cần login
   - Public routes → không cần login

### App Router Structure

```
src/app/
├── (auth)/              # Auth pages (login, register)
├── (user)/              # User pages
├── recruiter/           # Recruiter dashboard & features
├── company/             # Company pages
├── job-detail/          # Job detail pages
├── search/              # Job search
├── activate/            # Account activation
├── layout.jsx           # Root layout
└── page.jsx             # Home page
```

## 🎨 Components

### Component Structure
```
src/components/
├── ui/                  # Radix UI components (shadcn/ui)
│   ├── button.jsx
│   ├── input.jsx
│   ├── dialog.jsx
│   ├── dropdown-menu.jsx
│   └── ...
├── auth/                # Auth-related components
├── home/                # Home page components
├── layout/              # Layout components
├── recruiter/           # Recruiter components
├── common/              # Common/shared components
├── providers/           # Context providers
├── AppInitializer.jsx   # App initialization
└── PageWrapper.jsx      # Page wrapper
```

## 🔐 Authentication Flow

### 1. Login Flow
```javascript
// 1. User submits credentials
const credentials = { email, password };

// 2. Call login API
const { user } = await authService.login(credentials);

// 3. Server sets HTTP-only cookie with access token
// Cookie: AT=<access_token>; HttpOnly; Secure; SameSite=Strict

// 4. Dispatch to Redux store
dispatch(setUser(user));

// 5. Redirect to dashboard or previous page
```

### 2. Auto Refresh Token
```javascript
// When API returns 401:
// 1. Call refresh endpoint
await api.post('/auth/refresh', null, { withCredentials: true });

// 2. Server sets new access token in cookie
// 3. Retry original request
return api(originalConfig);
```

### 3. Logout Flow
```javascript
// 1. Call logout API
await authService.logout();

// 2. Server clears cookies
// 3. Clear Redux state
dispatch(clearUser());

// 4. Redirect to login
router.push('/login');
```

## 📝 Form Handling

### React Hook Form + Yup
```javascript
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
});

const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
});
```

## 🌍 Internationalization

Dự án sử dụng **ttag** cho i18n:
```javascript
import { t } from 'ttag';

const message = t`Welcome to JobFind`;
```

## 🔌 WebSocket (STOMP)

### Configuration
```javascript
import { Client } from '@stomp/stompjs';

const client = new Client({
    brokerURL: `ws://localhost:8082${process.env.NEXT_PUBLIC_WS_ENDPOINT}`,
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
});

client.onConnect = () => {
    client.subscribe(process.env.NEXT_PUBLIC_SUB_DEST, (message) => {
        // Handle notification
    });
};
```

## 🚀 Development & Build

### Scripts
```bash
# Development
npm run dev          # Start dev server at http://localhost:3000

# Production
npm run build        # Build for production
npm start            # Start production server

# Linting
npm run lint         # Run ESLint
```

### Next.js Configuration

#### Rewrites (Development Proxy)
```javascript
// next.config.mjs
async rewrites() {
    if (process.env.NODE_ENV !== "development") return [];
    
    const target = process.env.NEXT_PUBLIC_API_PROXY_TARGET || "http://localhost:8080";
    
    return [
        {
            source: "/api/:path*",
            destination: `${target}/api/:path*`,
        },
        {
            source: "/ws/:path*",
            destination: `${target}/ws/:path*`,
        },
    ];
}
```

## 📦 Key Features

### 1. Job Search & Application
- Tìm kiếm công việc với filters
- Xem chi tiết công việc
- Apply công việc với CV
- Lưu công việc yêu thích
- Theo dõi trạng thái ứng tuyển

### 2. User Profile
- Quản lý thông tin cá nhân
- Upload & quản lý CV
- CV templates
- CV matching với jobs

### 3. Company Features
- Xem thông tin công ty
- Theo dõi công ty
- Lưu công ty yêu thích

### 4. Recruiter Dashboard
- Đăng tin tuyển dụng
- Quản lý công việc
- Xem & quản lý ứng viên
- Company profile management
- Analytics & reports

### 5. Interview Management
- Lịch phỏng vấn
- Video interview (Jitsi)
- AI Interview Coach

### 6. Notifications
- Real-time notifications (WebSocket)
- Toast notifications
- Email notifications

### 7. AI Features
- CV matching
- Interview coaching
- Job recommendations

## 🔒 Security

### 1. Authentication
- JWT-based authentication
- HTTP-only cookies cho access token
- Auto refresh token mechanism
- Role-based access control (RBAC)

### 2. Middleware Protection
- Route protection
- Role verification
- Redirect to login for unauthorized access

### 3. CSRF Protection
- SameSite cookies
- Credentials included in requests

## 📊 Data Flow

### Typical API Call Flow

```
Component
    ↓
RTK Query Hook (useGetJobsQuery)
    ↓
RTK Query Middleware
    ↓
axiosBaseQuery
    ↓
Axios Instance (api.js)
    ↓
Axios Interceptors
    ↓
HTTP Request → Backend API
    ↓
Response
    ↓
Axios Interceptors (handle 401)
    ↓
RTK Query Cache
    ↓
Component Re-render
```

## 🎯 Best Practices

### 1. API Calls
- Sử dụng RTK Query cho data fetching & caching
- Sử dụng plain Axios cho one-time calls
- Luôn handle errors
- Sử dụng TypeScript types (nếu có)

### 2. State Management
- Redux cho global state
- Zustand cho lightweight state
- React Hook Form cho form state
- RTK Query cho server state

### 3. Component Organization
- Tách UI components vào `components/ui`
- Feature-specific components vào `components/<feature>`
- Reusable components vào `components/common`

### 4. Code Splitting
- Dynamic imports cho heavy components
- Lazy loading cho routes
- Optimize bundle size

## 📚 Tài Liệu Tham Khảo

- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- [React Hook Form](https://react-hook-form.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)

## 🐛 Debugging

### Common Issues

1. **401 Unauthorized:**
   - Kiểm tra cookie `AT`
   - Kiểm tra refresh token endpoint
   - Xem console logs

2. **CORS Errors:**
   - Kiểm tra `withCredentials: true`
   - Kiểm tra backend CORS config

3. **WebSocket Connection:**
   - Kiểm tra WS endpoint
   - Kiểm tra network tab
   - Verify STOMP configuration

## 🔄 Update History

- **v0.1.0** - Initial version
- Next.js 15.4.2
- React 19.1.0
- Redux Toolkit 2.8.2
