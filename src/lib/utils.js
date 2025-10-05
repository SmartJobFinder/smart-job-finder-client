import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * Chuyển đổi đường dẫn ảnh để sử dụng với Next.js Image
 * @param {string} src - Đường dẫn ảnh gốc
 * @returns {string} - Đường dẫn ảnh đã được xử lý
 */
export function getImageUrl(src) {
    if (!src) return "/logo_example.png";

    // Nếu đã là URL tuyệt đối hoặc bắt đầu bằng "/", giữ nguyên
    if (
        src.startsWith("http://") ||
        src.startsWith("https://") ||
        src.startsWith("/")
    ) {
        return src;
    }

    // Thêm tiền tố URL API nếu là đường dẫn tương đối
    return `http://localhost:8080/${src}`;
}

/**
 * Format số tiền với dấu chấm phân cách hàng nghìn
 * @param {number} num - Số cần format
 * @returns {string} - Số đã format
 */
export function formatNumber(num) {
    if (!num && num !== 0) return "";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

/**
 * Format salary display
 * @param {number} salaryMin - Lương tối thiểu
 * @param {number} salaryMax - Lương tối đa
 * @param {number} salaryType - Loại lương (0: range, 1: thỏa thuận)
 * @returns {string} - Formatted salary string
 */
export function formatSalary(salaryMin, salaryMax, salaryType) {
    if (salaryType === 1) {
        return "Negotiable";
    }
    if (salaryMin && salaryMax) {
        return `${formatNumber(salaryMin)} - ${formatNumber(salaryMax)} VND`;
    }
    if (salaryMin) {
        return `From ${formatNumber(salaryMin)} VND`;
    }
    return "Not disclosed";
}
