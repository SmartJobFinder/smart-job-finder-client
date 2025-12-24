export const applications = [
  {
    id: 1,
    userId: 1,
    jobId: 4,
    status: "PENDING",
    createdAt: "2023-10-15T08:30:00Z",
    updatedAt: "2023-10-15T08:30:00Z",
    cvUrl: "https://example.com/cv1.pdf",
    coverLetter:
      "Tôi mong muốn được làm việc tại công ty của bạn vì tôi rất ấn tượng với các chiến dịch marketing sáng tạo mà BrandBoost đã thực hiện trong năm qua. Với 4 năm kinh nghiệm trong lĩnh vực marketing, tôi tin rằng mình có thể đóng góp giá trị lớn cho đội ngũ của quý công ty.",
    job: {
      id: 4,
      title: "Marketing Manager",
      company: {
        company_id: 4,
        company_name: "BrandBoost",
        logo: "https://res.cloudinary.com/drheg5d7j/image/upload/v1711298793/company-logos/brandboost_logo_xcuviy.jpg",
        avatar:
          "https://res.cloudinary.com/drheg5d7j/image/upload/v1711298793/company-logos/brandboost_logo_xcuviy.jpg",
      },
      location: "Hồ Chí Minh",
      salary_min: 2000,
      salary_max: 3500,
      currency: "USD",
      work_type: "Toàn thời gian",
    },
  },
  {
    id: 2,
    userId: 1,
    jobId: 5,
    status: "REVIEWING",
    createdAt: "2023-10-10T09:15:00Z",
    updatedAt: "2023-10-12T14:20:00Z",
    cvUrl: "https://example.com/cv2.pdf",
    coverLetter:
      "Với kinh nghiệm 5 năm trong lĩnh vực DevOps, tôi đã thành công xây dựng và triển khai hệ thống CI/CD cho nhiều dự án quy mô lớn. Tôi thông thạo các công nghệ container hóa và Infrastructure as Code, đồng thời có kinh nghiệm tối ưu hóa hiệu suất cho các ứng dụng cloud-native.",
    job: {
      id: 5,
      title: "DevOps Engineer",
      company: {
        company_id: 1,
        company_name: "TechVision",
        logo: "https://res.cloudinary.com/drheg5d7j/image/upload/v1711298793/company-logos/techvision_logo_pvco7d.jpg",
        avatar:
          "https://res.cloudinary.com/drheg5d7j/image/upload/v1711298793/company-logos/techvision_logo_pvco7d.jpg",
      },
      location: "Hà Nội",
      salary_min: 1800,
      salary_max: 3200,
      currency: "USD",
      work_type: "Toàn thời gian",
    },
  },
  {
    id: 3,
    userId: 1,
    jobId: 8,
    status: "ACCEPTED",
    createdAt: "2023-09-20T10:00:00Z",
    updatedAt: "2023-10-05T11:30:00Z",
    cvUrl: "https://example.com/cv3.pdf",
    coverLetter:
      "Tôi rất ấn tượng với các dự án thiết kế từ DesignHub và mong muốn được trở thành một phần trong đội ngũ sáng tạo của công ty. Portfolio của tôi đã được đính kèm, thể hiện kinh nghiệm thiết kế sản phẩm cho các ứng dụng di động và web trong 6 năm qua.",
    job: {
      id: 8,
      title: "Product Designer",
      company: {
        company_id: 2,
        company_name: "DesignHub",
        logo: "https://res.cloudinary.com/drheg5d7j/image/upload/v1711298793/company-logos/designhub_logo_wmz3uk.jpg",
        avatar:
          "https://res.cloudinary.com/drheg5d7j/image/upload/v1711298793/company-logos/designhub_logo_wmz3uk.jpg",
      },
      location: "Đà Nẵng",
      salary_min: 1500,
      salary_max: 2800,
      currency: "USD",
      work_type: "Toàn thời gian",
    },
  },
  {
    id: 4,
    userId: 1,
    jobId: 1,
    status: "REJECTED",
    createdAt: "2023-09-15T14:20:00Z",
    updatedAt: "2023-09-25T09:45:00Z",
    cvUrl: "https://example.com/cv4.pdf",
    coverLetter:
      "Tôi đã theo dõi TechVision trong thời gian dài và rất ấn tượng với các sản phẩm công nghệ của công ty. Với 3 năm kinh nghiệm làm Frontend Developer với React và Next.js, tôi tự tin có thể đóng góp vào các dự án của quý công ty.",
    job: {
      id: 1,
      title: "Frontend Developer",
      company: {
        company_id: 1,
        company_name: "TechVision",
        logo: "https://res.cloudinary.com/drheg5d7j/image/upload/v1711298793/company-logos/techvision_logo_pvco7d.jpg",
        avatar:
          "https://res.cloudinary.com/drheg5d7j/image/upload/v1711298793/company-logos/techvision_logo_pvco7d.jpg",
      },
      location: "Hồ Chí Minh",
      salary_min: 1500,
      salary_max: 3000,
      currency: "USD",
      work_type: "Toàn thời gian",
    },
  },
  {
    id: 5,
    userId: 1,
    jobId: 11,
    status: "PENDING",
    createdAt: "2023-10-18T11:00:00Z",
    updatedAt: "2023-10-18T11:00:00Z",
    cvUrl: "https://example.com/cv5.pdf",
    coverLetter:
      "Tôi rất hứng thú với vị trí Giảng viên Công nghệ Web tại EduTech Vietnam. Với 5 năm kinh nghiệm phát triển web và 2 năm giảng dạy tại các khóa học online, tôi tin rằng mình phù hợp với yêu cầu của vị trí này. Tôi đặc biệt yêu thích việc chia sẻ kiến thức và giúp đỡ người mới bắt đầu trong lĩnh vực công nghệ.",
    job: {
      id: 11,
      title: "Giảng viên Công nghệ Web",
      company: {
        company_id: 6,
        company_name: "EduTech Vietnam",
        logo: "https://res.cloudinary.com/drheg5d7j/image/upload/v1711298793/company-logos/edutech_logo_fmoabf.jpg",
        avatar:
          "https://res.cloudinary.com/drheg5d7j/image/upload/v1711298793/company-logos/edutech_logo_fmoabf.jpg",
      },
      location: "Hồ Chí Minh",
      salary_min: 1200,
      salary_max: 2500,
      currency: "USD",
      work_type: "Toàn thời gian",
    },
  },
];
