export const jobs = [
    {
        id: 1,
        title: "Frontend Developer",
        description:
            "Chúng tôi đang tìm kiếm một Frontend Developer có kinh nghiệm để tham gia vào team phát triển sản phẩm số. Bạn sẽ xây dựng giao diện người dùng cho các ứng dụng web hiện đại, làm việc chặt chẽ với team design và backend.",
        requirements:
            "- 3+ năm kinh nghiệm với React, Next.js, và TypeScript\n- Hiểu biết sâu về Redux, RESTful APIs, và testing\n- Khả năng tối ưu hiệu suất trang web\n- Kỹ năng làm việc nhóm và quản lý thời gian tốt",
        benefits:
            "- Lương cạnh tranh từ 1500-3000 USD\n- Giờ làm việc linh hoạt\n- Bảo hiểm sức khỏe toàn diện\n- Phòng gym miễn phí\n- 15 ngày nghỉ phép mỗi năm",
        location: "Hồ Chí Minh",
        salary_min: 1500,
        salary_max: 3000,
        currency: "USD",
        company: {
            company_id: 1,
            company_name: "TechVision",
            isProCompany: true,
            avatar: "https://tinyurl.com/48kdftcx",
        },
        category_names: ["IT", "Phát triển phần mềm"],
        level: "Senior",
        work_type: "On-site",
        created_at: "2023-06-01T09:00:00Z",
        expired_at: "2023-07-01T09:00:00Z",
        boosted: true,
        boostLevel: 2,
    },
    {
        id: 2,
        title: "UX Designer",
        description:
            "Thiết kế giao diện người dùng trực quan và hiệu quả cho các sản phẩm của chúng tôi. Nghiên cứu người dùng, tạo wireframes, prototypes và thực hiện các bài kiểm tra usability.",
        requirements:
            "- Thành thạo Figma, Adobe XD\n- Portfolio bắt buộc\n- Kinh nghiệm thiết kế cho mobile và web\n- Hiểu biết về quy trình thiết kế UX/UI",
        benefits:
            "- Làm việc từ xa 2 ngày/tuần\n- Thưởng dự án đạt mục tiêu\n- Ngân sách đào tạo hàng năm\n- Môi trường làm việc sáng tạo",
        location: "Hà Nội",
        salary_min: 1200,
        salary_max: 2500,
        currency: "USD",
        company: {
            company_id: 2,
            company_name: "DesignHub",
            isProCompany: false,
            avatar: "https://tinyurl.com/48kdftcx",
        },
        category_names: ["Thiết kế", "UI/UX"],
        level: "Mid-level",
        work_type: "On-site",
        created_at: "2023-06-05T10:00:00Z",
        expired_at: "2023-07-05T10:00:00Z",
    },
    {
        id: 3,
        title: "Data Analyst",
        description:
            "Phân tích dữ liệu kinh doanh, tạo báo cáo chi tiết và đưa ra các đề xuất chiến lược dựa trên insight từ dữ liệu.",
        requirements:
            "- Kinh nghiệm với SQL, Python\n- Thành thạo Power BI hoặc Tableau\n- Kiến thức về thống kê và phân tích dữ liệu\n- Khả năng trực quan hóa dữ liệu phức tạp",
        benefits:
            "- Lương từ 1000-2000 USD\n- Cơ hội thăng tiến nhanh\n- Chế độ làm việc linh hoạt\n- Được đào tạo về công nghệ mới",
        location: "Đà Nẵng",
        salary_min: 1000,
        salary_max: 2000,
        currency: "USD",
        company: {
            company_id: 3,
            company_name: "DataCraft",
            isProCompany: true,
            avatar: "https://tinyurl.com/48kdftcx",
        },
        category_names: ["Dữ liệu", "Phân tích"],
        level: "Junior",
        work_type: "On-site",
        created_at: "2023-06-10T08:30:00Z",
        expired_at: "2023-07-10T08:30:00Z",
        boosted: true,
        boostLevel: 1,
    },
    {
        id: 4,
        title: "Marketing Manager",
        description:
            "Phát triển và thực hiện chiến lược marketing tổng thể cho công ty. Quản lý team marketing và ngân sách, tối ưu hóa chiến dịch dựa trên dữ liệu.",
        requirements:
            "- 5+ năm kinh nghiệm marketing\n- Kinh nghiệm quản lý team\n- Hiểu biết sâu về digital marketing và analytics\n- Kỹ năng lãnh đạo và giao tiếp tốt",
        benefits:
            "- Lương thỏa thuận theo năng lực\n- Thưởng theo hiệu suất\n- Xe đưa đón\n- Chế độ nghỉ dưỡng hàng năm",
        location: "Hồ Chí Minh",
        salary_min: 2000,
        salary_max: 3500,
        currency: "USD",
        company: {
            company_id: 4,
            company_name: "BrandBoost",
            isProCompany: true,
            avatar: "https://tinyurl.com/48kdftcx",
        },
        category_names: ["Marketing", "Quản lý"],
        level: "Manager",
        work_type: "On-site",
        created_at: "2023-06-12T14:00:00Z",
        expired_at: "2023-07-12T14:00:00Z",
    },
    {
        id: 5,
        title: "DevOps Engineer",
        description:
            "Tự động hóa quy trình CI/CD, quản lý hạ tầng cloud, tối ưu hóa hiệu suất hệ thống và đảm bảo tính sẵn sàng cao của dịch vụ.",
        requirements:
            "- Kinh nghiệm với AWS/Azure\n- Thành thạo Docker, Kubernetes\n- Kinh nghiệm với Jenkins và Infrastructure as Code\n- Kỹ năng scripting với Python hoặc Bash",
        benefits:
            "- Làm việc linh hoạt hybrid\n- Lương cạnh tranh\n- Chương trình đào tạo chuyên sâu\n- Được tiếp xúc với công nghệ mới nhất",
        location: "Hà Nội",
        salary_min: 1800,
        salary_max: 3200,
        currency: "USD",
        company: {
            company_id: 1,
            company_name: "TechVision",
            isProCompany: true,
            avatar: "https://tinyurl.com/48kdftcx",
        },
        category_names: ["IT", "DevOps", "Cloud"],
        level: "Senior",
        work_type: "On-site",
        created_at: "2023-06-15T11:00:00Z",
        expired_at: "2023-07-15T11:00:00Z",
        boosted: true,
        boostLevel: 1,
    },
    {
        id: 6,
        title: "Financial Analyst",
        description:
            "Thực hiện phân tích tài chính, dự báo ngân sách và đánh giá hiệu quả đầu tư cho các dự án của công ty và khách hàng.",
        requirements:
            "- Bằng cử nhân Tài chính, Kế toán hoặc lĩnh vực liên quan\n- 3+ năm kinh nghiệm phân tích tài chính\n- Thành thạo Excel và các công cụ phân tích tài chính\n- Chứng chỉ CFA là lợi thế",
        benefits:
            "- Lương cạnh tranh theo năng lực\n- Thưởng hiệu suất hàng quý\n- Bảo hiểm sức khỏe cao cấp\n- Cơ hội thăng tiến rõ ràng",
        location: "Hà Nội",
        salary_min: 1500,
        salary_max: 2800,
        currency: "USD",
        company: {
            company_id: 5,
            company_name: "FinTech Solutions",
            isProCompany: false,
            avatar: "https://tinyurl.com/48kdftcx",
        },
        category_names: ["Tài chính", "Phân tích"],
        level: "Mid-level",
        work_type: "On-site",
        created_at: "2023-06-18T09:15:00Z",
        expired_at: "2023-07-18T09:15:00Z",
    },
    {
        id: 7,
        title: "Content Creator",
        description:
            "Sáng tạo nội dung hấp dẫn cho các kênh truyền thông của công ty bao gồm blog, mạng xã hội và email marketing.",
        requirements:
            "- Khả năng viết tiếng Việt và tiếng Anh tốt\n- Portfolio các bài viết đã thực hiện\n- Hiểu biết về SEO và content marketing\n- Kỹ năng chỉnh sửa ảnh và video cơ bản",
        benefits:
            "- Lương cạnh tranh\n- Môi trường làm việc sáng tạo\n- Thời gian làm việc linh hoạt\n- Được đào tạo kỹ năng marketing",
        location: "Hồ Chí Minh",
        salary_min: 800,
        salary_max: 1500,
        currency: "USD",
        company: {
            company_id: 4,
            company_name: "BrandBoost",
            isProCompany: true,
            avatar: "https://tinyurl.com/48kdftcx",
        },
        category_names: ["Marketing", "Nội dung"],
        level: "Junior",
        work_type: "On-site",
        created_at: "2023-06-20T13:45:00Z",
        expired_at: "2023-07-20T13:45:00Z",
    },
    {
        id: 8,
        title: "Product Designer",
        description:
            "Thiết kế sản phẩm số với trọng tâm vào trải nghiệm người dùng, tham gia vào toàn bộ quy trình từ khái niệm đến triển khai.",
        requirements:
            "- Ít nhất 4 năm kinh nghiệm thiết kế sản phẩm\n- Thành thạo các công cụ thiết kế như Figma, Sketch\n- Kinh nghiệm với Design Systems\n- Portfolio thể hiện rõ quy trình làm việc",
        benefits:
            "- Mức lương hấp dẫn\n- Làm việc với các dự án quốc tế\n- Cơ hội đào tạo nước ngoài\n- Môi trường làm việc chuyên nghiệp",
        location: "Đà Nẵng",
        salary_min: 1500,
        salary_max: 2800,
        currency: "USD",
        company: {
            company_id: 2,
            company_name: "DesignHub",
            isProCompany: false,
            avatar: "https://tinyurl.com/48kdftcx",
        },
        category_names: ["Thiết kế", "Sản phẩm"],
        level: "Senior",
        work_type: "On-site",
        created_at: "2023-06-22T15:30:00Z",
        expired_at: "2023-07-22T15:30:00Z",
    },
    {
        id: 9,
        title: "Backend Developer (Java)",
        description:
            "Phát triển và duy trì các hệ thống backend sử dụng Java Spring Boot, thiết kế API và tối ưu hóa hiệu suất cơ sở dữ liệu.",
        requirements:
            "- 3+ năm kinh nghiệm với Java và Spring Boot\n- Hiểu biết sâu về RESTful API design\n- Kinh nghiệm với cơ sở dữ liệu SQL và NoSQL\n- Kiến thức về microservices architecture",
        benefits:
            "- Lương từ 1800-3200 USD\n- Làm việc từ xa 2 ngày/tuần\n- Đóng góp BHXH đầy đủ\n- Thưởng dự án và thưởng cuối năm",
        location: "Hồ Chí Minh",
        salary_min: 1800,
        salary_max: 3200,
        currency: "USD",
        company: {
            company_id: 1,
            company_name: "TechVision",
            isProCompany: true,
            avatar: "https://tinyurl.com/48kdftcx",
        },
        category_names: ["IT", "Phát triển phần mềm", "Java"],
        level: "Senior",
        work_type: "On-site",
        created_at: "2023-06-25T10:45:00Z",
        expired_at: "2023-07-25T10:45:00Z",
        boosted: true,
        boostLevel: 2,
    },
    {
        id: 10,
        title: "Mobile Developer (Flutter)",
        description:
            "Phát triển ứng dụng di động đa nền tảng sử dụng Flutter, tích hợp API và tối ưu trải nghiệm người dùng trên cả iOS và Android.",
        requirements:
            "- 2+ năm kinh nghiệm với Flutter\n- Kinh nghiệm xuất bản ứng dụng lên App Store và Google Play\n- Hiểu biết về state management\n- Kỹ năng tối ưu hiệu suất ứng dụng",
        benefits:
            "- Lương từ 1500-2800 USD\n- Môi trường làm việc trẻ trung\n- Cơ hội học hỏi và phát triển\n- Thiết bị làm việc hiện đại",
        location: "Hà Nội",
        salary_min: 1500,
        salary_max: 2800,
        currency: "USD",
        company: {
            company_id: 3,
            company_name: "DataCraft",
            isProCompany: true,
            avatar: "https://tinyurl.com/48kdftcx",
        },
        category_names: ["IT", "Phát triển ứng dụng di động"],
        level: "Mid-level",
        work_type: "On-site",
        created_at: "2023-06-28T14:00:00Z",
        expired_at: "2023-07-28T14:00:00Z",
    },
    {
        id: 11,
        title: "Giảng viên Công nghệ Web",
        description:
            "Giảng dạy các khóa học phát triển web từ cơ bản đến nâng cao cho học viên online và offline.",
        requirements:
            "- Ít nhất 3 năm kinh nghiệm phát triển web thực tế\n- Kiến thức vững về HTML, CSS, JavaScript, React\n- Kỹ năng truyền đạt tốt\n- Tiếng Anh giao tiếp tốt",
        benefits:
            "- Mức lương cạnh tranh từ 1200-2500 USD\n- Lịch giảng dạy linh hoạt\n- Cơ hội tham gia các dự án thực tế\n- Môi trường làm việc chuyên nghiệp",
        location: "Hồ Chí Minh",
        salary_min: 1200,
        salary_max: 2500,
        currency: "USD",
        company: {
            company_id: 6,
            company_name: "EduTech Vietnam",
            isProCompany: true,
            avatar: "https://tinyurl.com/48kdftcx",
        },
        category_names: ["Giáo dục", "Công nghệ"],
        level: "Mid-level",
        work_type: "On-site",
        created_at: "2023-06-30T09:00:00Z",
        expired_at: "2023-07-30T09:00:00Z",
        boosted: true,
        boostLevel: 1,
    },
    {
        id: 12,
        title: "Quản lý khóa học trực tuyến",
        description:
            "Quản lý và phát triển các khóa học trực tuyến, làm việc với giảng viên và đảm bảo chất lượng nội dung.",
        requirements:
            "- Kinh nghiệm trong lĩnh vực giáo dục hoặc e-learning\n- Kỹ năng quản lý dự án tốt\n- Hiểu biết về quy trình phát triển nội dung\n- Kỹ năng giao tiếp và thương lượng tốt",
        benefits:
            "- Mức lương từ 1000-2000 USD\n- Làm việc từ xa 3 ngày/tuần\n- Chế độ đãi ngộ tốt\n- Cơ hội đào tạo và phát triển chuyên môn",
        location: "Hà Nội",
        salary_min: 1000,
        salary_max: 2000,
        currency: "USD",
        company: {
            company_id: 6,
            company_name: "EduTech Vietnam",
            isProCompany: true,
            avatar: "https://tinyurl.com/48kdftcx",
        },
        category_names: ["Giáo dục", "Quản lý dự án"],
        level: "Mid-level",
        work_type: "On-site",
        created_at: "2023-07-02T10:30:00Z",
        expired_at: "2023-08-02T10:30:00Z",
    },
];
