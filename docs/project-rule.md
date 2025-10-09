# Project Rule – JobFind User Site

## ✅ Quy tắc viết mã

- Luôn chia code theo module feature bên trong `features/(user)`.
- Component tái sử dụng đặt trong `components/common`.
- Component UI dùng từ `@/components/ui` theo chuẩn shadcn/ui.
- Viết đầy đủ `type` cho props/component.
- Tránh sửa trực tiếp `layout.tsx`, `page.tsx` cấp root trừ khi cần thiết.

## ✅ Quy định commit

- Format:

  - \[Feature] Add ProfilePage UI
  - \[Fix] Handle null error in JobCard

## ✅ Cách thêm tính năng mới

1. Tạo thư mục trong `features/(user)/`, theo dạng camelCase.
2. Thêm các thư mục con nếu cần: `components`, `pages`, `services`, `store`, `mock`.
3. Tạo route mới bằng cách thêm file vào `app/(user)/` theo cấu trúc App Router.
4. Nếu chưa có API thật, mock dữ liệu tạm thời trong `mock/`.

## 👥 Đóng góp

- Làm việc theo **module/domain** rõ ràng.
- Mỗi tính năng nên có đủ:

  - `pages/`, `components/`, `services/`, `store/`, `mock/` nếu cần.

- Ưu tiên tái sử dụng:

  - `components/common` cho shared UI.
  - `components/ui` cho button, input... từ shadcn.

## 📌 Ghi chú

- Luôn mock API trước khi có dữ liệu thật.
- Luôn cập nhật `README.md` khi thêm module mới.
- Routes sử dụng theo cấu trúc App Router (`app/(user)/...`).

## 🎨 Tailwind Design Rules

- Ưu tiên viết theo utility-first của Tailwind.
- Tránh viết CSS riêng nếu không cần thiết.
- Không override màu mặc định của Tailwind.
- Nếu cần thêm màu: mở rộng `tailwind.config.ts` thay vì sửa trực tiếp.

## 🧼 Code Conventions

- Trang mới: Tạo folder trong `features/(user)/`, thêm route trong `app/(user)/`.
- Tên file:

  - Component: PascalCase (JobCard.tsx)
  - Hình ảnh: kebab-case (avatar-default.png)

- Import:

  - Dùng alias `@/` thay vì đường dẫn tương đối.
  - Ví dụ: `import { Button } from "@/components/ui/button"`.

- Quản lý asset:

  - Import vào `assets/index.ts` để dễ quản lý.
  - Sử dụng từ alias thay vì hardcode path.

- Tên folder:

  - Dùng camelCase cho module: ví dụ `jobList`, `profile`, `appliedJobs`.
