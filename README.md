# Smart Job Finder Client (Next.js)

Ứng dụng web người dùng cho hệ thống Smart Job Finder, xây dựng bằng **Next.js App Router**. Hỗ trợ tìm kiếm việc làm, quản lý hồ sơ, dashboard nhà tuyển dụng, thông báo realtime và các tính năng AI (gợi ý việc làm, matching CV).

## 📦 Tech stack

- Next.js 15 (App Router) + React 19
- Tailwind CSS 4, Radix UI, shadcn components
- Redux Toolkit + RTK Query, Zustand
- Axios, WebSocket (STOMP), Jitsi SDK
- i18n với `ttag`

## 🚀 Bắt đầu nhanh

```bash
git clone https://github.com/Group-3-KTC/job-find-user-app.git
cd job-find-user-app
npm install
npm run dev   # http://localhost:3000
```

### Biến môi trường tối thiểu (`.env.local`)

```bash
NEXT_PUBLIC_API_PROXY_TARGET=http://localhost:8080   # backend gốc khi dev
NEXT_PUBLIC_API_BASE_URL=/api/v1
NEXT_PUBLIC_WS_ENDPOINT=/ws
NEXT_PUBLIC_SUB_DEST=/user/queue/noti
```

### Scripts

- `npm run dev` — chạy dev server
- `npm run build` — build production
- `npm start` — chạy production build
- `npm run lint` — ESLint

## 🗂️ Cấu trúc chính

```
src/
  app/          # App Router pages/layouts
  components/   # UI & shared components
  features/     # Redux slices/features
  services/     # RTK Query & axios services
  store/        # Redux store cấu hình
  hooks/, lib/, utils/, constants/, validation/
public/         # Static assets & i18n JSON
```

## 🔑 Chức năng nổi bật

- Tìm kiếm & lọc việc làm, xem chi tiết, ứng tuyển, lưu việc.
- Hồ sơ người dùng: thông tin cá nhân, CV templates, CV matching.
- Công ty: xem thông tin, theo dõi, lưu công ty.
- Recruiter dashboard: tạo/quản lý tin tuyển dụng, ứng viên, analytics.
- Phỏng vấn: lịch, video interview (Jitsi), AI interview coach.
- Thông báo realtime qua WebSocket + toast.

## 🔐 Bảo mật & quyền truy cập

- JWT lưu trong HTTP-only cookie, tự refresh khi 401.
- Middleware bảo vệ route: yêu cầu đăng nhập, phân quyền recruiter.
- Rewrites dev proxy `/api` và `/ws` trỏ tới backend (config qua env).

## 🧭 Tài liệu thêm

- `docs/setup.md` – hướng dẫn cài đặt nhanh
- `docs/project-structure-overview.md` – kiến trúc & luồng dữ liệu
- `docs/api-usage-guide.md` – (nếu cần) mô tả các service API

## 👥 Team

- **[Võ Nhật Hào](https://github.com/nhathao512)**
- **[Pham Văn Phúc](https://github.com/pkucpkam)**
