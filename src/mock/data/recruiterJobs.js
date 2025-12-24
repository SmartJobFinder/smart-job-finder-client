export const recruiterJobs = [
  {
    id: 101,
    title: "Senior Frontend Developer",
    status: "ACTIVE",
    location: "Ho Chi Minh City",
    date_post: "2023-08-15",
    expired_date: "2023-09-15",
    applicants_count: 12,
    views_count: 156,
    salary_min: 1500,
    salary_max: 2500,
    salary_currency: "USD",
    category_names: ["Frontend Development", "JavaScript"],
    work_type_names: ["Full-time"],
    level_names: ["Senior"],
    description:
      "Chúng tôi đang tìm kiếm một Senior Frontend Developer có kinh nghiệm để tham gia vào team phát triển sản phẩm số.",
    requirements:
      "- 5+ năm kinh nghiệm với React, Next.js, và TypeScript\n- Hiểu biết sâu về Redux, RESTful APIs, và testing\n- Khả năng tối ưu hiệu suất trang web",
    benefits:
      "- Lương cạnh tranh từ 1500-2500 USD\n- Giờ làm việc linh hoạt\n- Bảo hiểm sức khỏe toàn diện",
    featured: true,
  },
  {
    id: 102,
    title: "Backend Node.js Developer",
    status: "ACTIVE",
    location: "Ha Noi",
    date_post: "2023-08-17",
    expired_date: "2023-09-17",
    applicants_count: 8,
    views_count: 98,
    salary_min: 1300,
    salary_max: 2200,
    salary_currency: "USD",
    category_names: ["Backend Development", "Node.js"],
    work_type_names: ["Full-time"],
    level_names: ["Mid-level"],
    description:
      "Phát triển và duy trì các API RESTful và microservices sử dụng Node.js và Express.",
    requirements:
      "- 3+ năm kinh nghiệm với Node.js và Express\n- Hiểu biết về MongoDB, PostgreSQL\n- Kinh nghiệm với Docker và CI/CD",
    benefits:
      "- Lương cạnh tranh\n- Chế độ làm việc từ xa 2 ngày/tuần\n- Phòng gym miễn phí",
    featured: false,
  },
  {
    id: 103,
    title: "UI/UX Designer",
    status: "DRAFT",
    location: "Ho Chi Minh City",
    date_post: null,
    expired_date: null,
    applicants_count: 0,
    views_count: 0,
    salary_min: 1200,
    salary_max: 1800,
    salary_currency: "USD",
    category_names: ["Design", "UI/UX"],
    work_type_names: ["Full-time"],
    level_names: ["Mid-level"],
    description:
      "Thiết kế giao diện người dùng trực quan và hiệu quả cho các sản phẩm của chúng tôi.",
    requirements:
      "- Thành thạo Figma, Adobe XD\n- Portfolio bắt buộc\n- Kinh nghiệm thiết kế cho mobile và web",
    benefits:
      "- Môi trường làm việc sáng tạo\n- Cơ hội thăng tiến\n- Được đào tạo chuyên sâu",
    featured: false,
  },
  {
    id: 104,
    title: "DevOps Engineer",
    status: "EXPIRED",
    location: "Da Nang",
    date_post: "2023-07-01",
    expired_date: "2023-08-01",
    applicants_count: 5,
    views_count: 67,
    salary_min: 1800,
    salary_max: 2800,
    salary_currency: "USD",
    category_names: ["DevOps", "Cloud"],
    work_type_names: ["Full-time"],
    level_names: ["Senior"],
    description:
      "Quản lý hệ thống CI/CD và đảm bảo tính sẵn sàng cao của các dịch vụ trên AWS.",
    requirements:
      "- 4+ năm kinh nghiệm với AWS\n- Thành thạo Docker, Kubernetes\n- Kinh nghiệm với Jenkins, GitLab CI",
    benefits:
      "- Lương cạnh tranh\n- Làm việc từ xa toàn thời gian\n- Chế độ đãi ngộ tốt",
    featured: true,
  },
  {
    id: 105,
    title: "React Native Developer",
    status: "ACTIVE",
    location: "Remote",
    date_post: "2023-08-10",
    expired_date: "2023-09-10",
    applicants_count: 15,
    views_count: 203,
    salary_min: 1400,
    salary_max: 2300,
    salary_currency: "USD",
    category_names: ["Mobile Development", "React Native"],
    work_type_names: ["Full-time"],
    level_names: ["Mid-level", "Senior"],
    description:
      "Phát triển ứng dụng di động đa nền tảng sử dụng React Native.",
    requirements:
      "- 3+ năm kinh nghiệm với React Native\n- Kinh nghiệm với Redux, React Navigation\n- Hiểu biết về native modules",
    benefits:
      "- Môi trường làm việc quốc tế\n- Cơ hội làm việc với công nghệ mới\n- Chế độ nghỉ phép hợp lý",
    featured: false,
  },
  {
    id: 106,
    title: "Data Scientist",
    status: "DRAFT",
    location: "Ha Noi",
    date_post: null,
    expired_date: null,
    applicants_count: 0,
    views_count: 0,
    salary_min: 2000,
    salary_max: 3000,
    salary_currency: "USD",
    category_names: ["Data Science", "Machine Learning"],
    work_type_names: ["Full-time"],
    level_names: ["Senior"],
    description:
      "Phân tích dữ liệu và xây dựng các mô hình machine learning để giải quyết các bài toán kinh doanh.",
    requirements:
      "- Bằng Thạc sĩ/Tiến sĩ về Khoa học Máy tính hoặc tương đương\n- Kinh nghiệm với Python, TensorFlow, PyTorch\n- Hiểu biết về xử lý ngôn ngữ tự nhiên",
    benefits:
      "- Lương cạnh tranh\n- Môi trường làm việc chuyên nghiệp\n- Cơ hội nghiên cứu và phát triển",
    featured: false,
  },
];

// Helper function to filter jobs by status
export const getJobsByStatus = status => {
  if (status === "all") return recruiterJobs;
  return recruiterJobs.filter(
    job => job.status.toLowerCase() === status.toLowerCase()
  );
};

export const getActiveJobs = () => getJobsByStatus("ACTIVE");
export const getDraftJobs = () => getJobsByStatus("DRAFT");
export const getExpiredJobs = () => getJobsByStatus("EXPIRED");
