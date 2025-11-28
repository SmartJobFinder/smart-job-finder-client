# Cấu Trúc Thư Mục & Hoạt Động File - Smart Job Finder Client

## 📁 Cấu Trúc Thư Mục Tổng Quan

```
smart-job-finder-client/
├── 📂 src/                    # Source code chính
│   ├── 📂 app/                # Next.js App Router (Pages & Routing)
│   ├── 📂 components/         # React Components
│   ├── 📂 features/           # Redux Features (Slices)
│   ├── 📂 services/           # API Services (RTK Query & Axios)
│   ├── 📂 store/              # Redux Store Configuration
│   ├── 📂 lib/                # Utilities & Core Configs
│   ├── 📂 hooks/              # Custom React Hooks
│   ├── 📂 constants/          # Constants & Enums
│   ├── 📂 validation/         # Form Validation Schemas
│   ├── 📂 i18n/               # Internationalization
│   ├── 📂 layout/             # Layout Components
│   ├── 📂 mock/               # Mock Data
│   ├── 📂 styles/             # Global Styles
│   ├── 📂 utils/              # Utility Functions
│   └── 📄 middleware.js       # Next.js Middleware (Auth & Routing)
├── 📂 public/                 # Static Assets (images, fonts, etc.)
├── 📂 docs/                   # Documentation
├── 📄 package.json            # Dependencies
├── 📄 next.config.mjs         # Next.js Configuration
├── 📄 tailwind.config.js      # Tailwind CSS Configuration
└── 📄 .env.local              # Environment Variables (gitignored)
```

## 📂 Chi Tiết Từng Thư Mục

### 1. `src/app/` - Next.js App Router

Quản lý routing và pages của ứng dụng.

```
app/
├── 📂 (auth)/                 # Auth pages group
│   ├── login/
│   │   └── page.jsx           # /login
│   ├── register/
│   │   └── page.jsx           # /register
│   └── forgot-password/
│       └── page.jsx           # /forgot-password
│
├── 📂 (user)/                 # User pages group
│   ├── profile/
│   │   └── page.jsx           # /profile
│   ├── dashboard/
│   │   └── page.jsx           # /dashboard
│   ├── saved-jobs/
│   │   └── page.jsx           # /saved-jobs
│   ├── applications/
│   │   └── page.jsx           # /applications
│   └── settings/
│       └── page.jsx           # /settings
│
├── 📂 recruiter/              # Recruiter pages
│   ├── dashboard/
│   │   └── page.jsx           # /recruiter/dashboard
│   ├── create-job/
│   │   └── page.jsx           # /recruiter/create-job
│   ├── manage-jobs/
│   │   └── page.jsx           # /recruiter/manage-jobs
│   └── company-profile/
│       └── page.jsx           # /recruiter/company-profile
│
├── 📂 company/                # Company pages
│   ├── company-search/
│   │   └── page.jsx           # /company/company-search
│   └── company-detail/
│       └── [id]/
│           └── page.jsx       # /company/company-detail/[id]
│
├── 📂 job-detail/             # Job detail pages
│   └── [id]/
│       └── page.jsx           # /job-detail/[id]
│
├── 📂 search/                 # Job search
│   └── page.jsx               # /search
│
├── 📂 activate/               # Account activation
│   └── page.jsx               # /activate?token=xxx
│
├── 📄 layout.jsx              # Root layout (HTML wrapper)
├── 📄 page.jsx                # Home page (/)
├── 📄 ClientRootLayout.jsx    # Client-side root layout
├── 📄 robots.js               # SEO robots.txt
└── 📄 sitemap.js              # SEO sitemap
```

**Hoạt động:**
- **Route Groups** `(auth)`, `(user)`: Nhóm routes mà không ảnh hưởng URL
- **Dynamic Routes** `[id]`: Route động, ví dụ `/job-detail/123`
- **layout.jsx**: Shared layout cho tất cả pages
- **page.jsx**: Actual page component

### 2. `src/components/` - React Components

Chứa tất cả UI components.

```
components/
├── 📂 ui/                     # Radix UI Components (shadcn/ui)
│   ├── button.jsx
│   ├── input.jsx
│   ├── dialog.jsx
│   ├── dropdown-menu.jsx
│   ├── select.jsx
│   ├── checkbox.jsx
│   ├── radio-group.jsx
│   ├── slider.jsx
│   ├── switch.jsx
│   ├── tabs.jsx
│   ├── alert-dialog.jsx
│   ├── avatar.jsx
│   ├── label.jsx
│   └── popover.jsx
│
├── 📂 auth/                   # Auth-related components
│   ├── LoginForm.jsx
│   ├── RegisterForm.jsx
│   ├── ForgotPasswordForm.jsx
│   ├── SocialLogin.jsx
│   └── ProtectedRoute.jsx
│
├── 📂 home/                   # Home page components
│   ├── HeroSection.jsx
│   ├── FeaturedJobs.jsx
│   ├── PopularCategories.jsx
│   ├── TopCompanies.jsx
│   └── Testimonials.jsx
│
├── 📂 layout/                 # Layout components
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── Sidebar.jsx
│   ├── Navbar.jsx
│   └── MobileMenu.jsx
│
├── 📂 recruiter/              # Recruiter components
│   ├── JobForm.jsx
│   ├── ApplicationList.jsx
│   └── CompanyProfileForm.jsx
│
├── 📂 common/                 # Common/shared components
│   ├── JobCard.jsx
│   ├── CompanyCard.jsx
│   ├── SearchBar.jsx
│   ├── FilterPanel.jsx
│   ├── Pagination.jsx
│   ├── LoadingSpinner.jsx
│   └── ErrorMessage.jsx
│
├── 📂 providers/              # Context providers
│   └── ReduxProvider.jsx
│
├── 📄 AppInitializer.jsx      # App initialization logic
└── 📄 PageWrapper.jsx         # Page wrapper component
```

**Hoạt động:**
- **ui/**: Reusable UI primitives từ Radix UI
- **auth/**: Components liên quan authentication
- **home/**: Components cho trang chủ
- **layout/**: Header, Footer, Navigation
- **common/**: Shared components dùng nhiều nơi

### 3. `src/services/` - API Services

Quản lý tất cả API calls.

```
services/
├── 📄 authService.js          # Authentication APIs
│   ├── login()
│   ├── register()
│   ├── logout()
│   ├── me()
│   ├── activate()
│   ├── forgotPassword()
│   └── resetPassword()
│
├── 📄 jobService.js           # Job APIs (RTK Query)
│   ├── useGetJobsQuery
│   ├── useGetJobByIdQuery
│   ├── useSearchJobsMutation
│   └── useSearchJobsWithStatusMutation
│
├── 📄 applicationService.js   # Application APIs (RTK Query)
│   ├── useCreateApplicationMutation
│   ├── useGetApplicationsByUserQuery
│   ├── useReapplyApplicationMutation
│   ├── useGetApplyStatusQuery
│   └── useUpdateApplicationStatusMutation
│
├── 📄 companyService.js       # Company APIs
│   ├── getMyCompany()
│   ├── createCompany()
│   └── updateCompany()
│
├── 📄 profileService.js       # Profile APIs (RTK Query)
├── 📄 savedJobService.js      # Saved Jobs APIs (RTK Query)
├── 📄 savedCompaniesService.js # Saved Companies APIs (RTK Query)
├── 📄 followCompanyService.js # Follow Company APIs (RTK Query)
├── 📄 interviewService.js     # Interview APIs (RTK Query)
├── 📄 cvTemplateService.js    # CV Template APIs (RTK Query)
├── 📄 cvMatchingService.js    # CV Matching APIs
├── 📄 locationService.js      # Location APIs (RTK Query)
├── 📄 categoryService.js      # Category APIs
├── 📄 filterService.js        # Filter APIs (RTK Query)
├── 📄 analyticsService.js     # Analytics APIs
├── 📄 aiService.js            # AI APIs
├── 📄 aiInterviewCoachService.js # AI Interview Coach
└── 📄 mockBaseQuery.js        # Mock API for development
```

**Hoạt động:**
- **RTK Query Services**: Tự động caching, refetching, loading states
- **Plain Axios Services**: One-time API calls
- Mỗi service export hooks hoặc functions để sử dụng trong components

### 4. `src/features/` - Redux Features

Redux slices cho state management.

```
features/
├── 📂 auth/
│   ├── authSlice.js           # Auth state (user, isAuthenticated)
│   └── loginPromptSlice.js    # Login prompt modal state
│
├── 📂 profile/
│   ├── profileSlice.js        # User profile state
│   └── personalDetailSlice.js # Personal details state
│
├── 📂 application/
│   └── applicationSlice.js    # Application state
│
├── 📂 savedCompanies/
│   └── savedCompaniesSlice.js # Saved companies state
│
└── 📂 templateCv/
    └── cvTemplateSlice.js     # CV template state
```

**Hoạt động:**
- Mỗi slice quản lý một phần state của app
- Export actions và selectors
- Được kết hợp trong `store/index.js`

### 5. `src/store/` - Redux Store

```
store/
├── 📄 index.js                # Store configuration
│   ├── configureStore()
│   ├── Combine reducers
│   └── Add middlewares
│
├── 📂 auth/
│   └── authStore.js           # Auth-specific store logic
│
├── 📂 slices/
│   └── toastSlices.js         # Toast notification slice
│
├── 📂 zustand/
│   └── useNotificationStore.js # Zustand store for notifications
│
├── 📄 hooks.js                # Typed Redux hooks
├── 📄 jobSearchStore.js       # Job search store (Zustand)
└── 📄 useJobStore.js          # Job store hook
```

**Hoạt động:**
- **index.js**: Main store configuration
- Kết hợp Redux Toolkit + Zustand
- Export typed hooks: `useAppDispatch`, `useAppSelector`

### 6. `src/lib/` - Core Libraries

```
lib/
├── 📄 api.js                  # Axios instance với interceptors
│   ├── Auto refresh token
│   ├── Error handling
│   └── Request/response interceptors
│
├── 📄 config.js               # API configuration
│   ├── BASE_URL
│   └── TIMEOUT
│
├── 📄 jobsApi.js              # Jobs API helpers
├── 📄 seo.js                  # SEO utilities
└── 📄 utils.js                # General utilities
```

**Hoạt động:**
- **api.js**: Core Axios instance, tất cả API calls đi qua đây
- **config.js**: Centralized configuration
- **utils.js**: Helper functions

### 7. `src/hooks/` - Custom Hooks

```
hooks/
├── 📄 useAuth.js              # Authentication hook
├── 📄 useDebounce.js          # Debounce hook
├── 📄 useLocalStorage.js      # LocalStorage hook
├── 📄 useMediaQuery.js        # Responsive hook
├── 📄 usePagination.js        # Pagination hook
└── 📄 useToast.js             # Toast notification hook
```

**Hoạt động:**
- Reusable logic cho components
- Tách business logic ra khỏi UI

### 8. `src/validation/` - Form Validation

```
validation/
├── 📄 authValidation.js       # Login, Register schemas
├── 📄 jobValidation.js        # Job creation schemas
├── 📄 profileValidation.js    # Profile update schemas
├── 📄 companyValidation.js    # Company schemas
└── 📄 applicationValidation.js # Application schemas
```

**Hoạt động:**
- Yup schemas cho form validation
- Sử dụng với React Hook Form

### 9. `src/middleware.js` - Next.js Middleware

**Chức năng:**
1. **Route Protection**: Kiểm tra authentication
2. **Role-based Access**: Kiểm tra quyền truy cập
3. **Redirect Logic**: Chuyển hướng user

**Flow:**
```
Request → Middleware
    ↓
Check if public route?
    ├─ Yes → Allow
    └─ No → Check authentication
        ├─ Not authenticated → Redirect to /login
        └─ Authenticated → Check role
            ├─ Recruiter route + Not recruiter → Redirect to /
            └─ Valid → Allow
```

**Code:**
```javascript
export function middleware(req) {
    const { pathname } = req.nextUrl;
    
    // Skip static files
    if (pathname.startsWith("/api") || 
        pathname.startsWith("/_next")) {
        return NextResponse.next();
    }
    
    // Public routes
    if (publicRoutes.some(r => r.test(pathname))) {
        return NextResponse.next();
    }
    
    // Check authentication
    const token = req.cookies.get("AT")?.value;
    if (!token) {
        return NextResponse.redirect("/login");
    }
    
    // Check role for recruiter routes
    if (recruiterOnly.some(r => r.test(pathname))) {
        const role = getRoleFromJwt(token);
        if (role !== "RECRUITER") {
            return NextResponse.redirect("/");
        }
    }
    
    return NextResponse.next();
}
```

## 🔄 Data Flow

### 1. User Login Flow

```
LoginPage.jsx
    ↓
authService.login(credentials)
    ↓
POST /auth/login
    ↓
Server sets cookie: AT=<token>
    ↓
dispatch(setUser(user))
    ↓
Redux Store updated
    ↓
Redirect to /dashboard
```

### 2. Fetch Jobs Flow (RTK Query)

```
JobListPage.jsx
    ↓
useGetJobsQuery({ page: 0, size: 20 })
    ↓
RTK Query checks cache
    ├─ Cache hit → Return cached data
    └─ Cache miss → Fetch from API
        ↓
    GET /job/all?page=0&size=20
        ↓
    Response cached
        ↓
    Component re-renders with data
```

### 3. Apply Job Flow

```
ApplyButton.jsx
    ↓
useCreateApplicationMutation()
    ↓
createApplication(formData)
    ↓
POST /application
    ↓
Success
    ↓
Invalidate cache tags: ["Applications", "ApplicationStatus"]
    ↓
Auto refetch related queries
    ↓
UI updates automatically
```

### 4. Protected Route Flow

```
User navigates to /profile
    ↓
Middleware intercepts
    ↓
Check cookie "AT"
    ├─ No token → Redirect to /login?redirect=/profile
    └─ Has token → Decode JWT
        ├─ Invalid/expired → Redirect to /login
        └─ Valid → Allow access
            ↓
        Page renders
            ↓
        useAuth() hook checks Redux state
            ├─ No user → Call authService.me()
            └─ Has user → Render page
```

## 📝 File Naming Conventions

### Components
- **PascalCase**: `JobCard.jsx`, `LoginForm.jsx`
- **Descriptive**: Tên file = tên component

### Services
- **camelCase**: `authService.js`, `jobService.js`
- **Suffix**: `Service.js` hoặc `Api.js`

### Hooks
- **camelCase**: `useAuth.js`, `useDebounce.js`
- **Prefix**: `use` (React convention)

### Utilities
- **camelCase**: `formatDate.js`, `validateEmail.js`
- **Descriptive**: Tên file = tên function chính

### Validation
- **camelCase**: `authValidation.js`
- **Suffix**: `Validation.js`

## 🎯 Import Paths

Dự án sử dụng **absolute imports** với alias `@`:

```javascript
// ❌ Relative imports (avoid)
import JobCard from "../../../components/common/JobCard";

// ✅ Absolute imports (preferred)
import JobCard from "@/components/common/JobCard";
import { useAuth } from "@/hooks/useAuth";
import authService from "@/services/authService";
import { API_CONFIG } from "@/lib/config";
```

**Configuration** (`jsconfig.json`):
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 🔍 Tìm File Nhanh

### Theo Chức Năng

| Chức năng | File location |
|-----------|---------------|
| **Login page** | `src/app/(auth)/login/page.jsx` |
| **Job list** | `src/app/(user)/jobs/page.jsx` |
| **Job detail** | `src/app/job-detail/[id]/page.jsx` |
| **Auth logic** | `src/services/authService.js` |
| **Job API** | `src/services/jobService.js` |
| **Redux store** | `src/store/index.js` |
| **API config** | `src/lib/api.js`, `src/lib/config.js` |
| **Middleware** | `src/middleware.js` |
| **Form validation** | `src/validation/` |

### Theo Component

| Component | File location |
|-----------|---------------|
| **Button** | `src/components/ui/button.jsx` |
| **JobCard** | `src/components/common/JobCard.jsx` |
| **Header** | `src/components/layout/Header.jsx` |
| **LoginForm** | `src/components/auth/LoginForm.jsx` |

## 📚 Tài Liệu Liên Quan

- [Project Structure Overview](./project-structure-overview.md)
- [API Usage Guide](./api-usage-guide.md)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Redux Toolkit](https://redux-toolkit.js.org/)
