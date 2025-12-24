export const interviews = [
  {
    id: 1,
    candidateId: 1,
    recruiterId: 3,
    jobId: 1,
    companyId: 1,
    scheduledAt: "2023-10-25T09:00:00Z",
    status: "SCHEDULED",
    notes:
      "Hãy chuẩn bị giới thiệu về các dự án React đã thực hiện và mang theo portfolio để demo.",
    location: "Online - Google Meet",
    meetingUrl: "https://meet.google.com/abc-defg-hij",
    durationMinutes: 60,
    job: {
      id: 1,
      title: "Frontend Developer",
      company: {
        id: 1,
        name: "TechVision",
        company_name: "TechVision",
        logo: "https://res.cloudinary.com/drheg5d7j/image/upload/v1711298793/company-logos/techvision_logo_pvco7d.jpg",
        avatar:
          "https://res.cloudinary.com/drheg5d7j/image/upload/v1711298793/company-logos/techvision_logo_pvco7d.jpg",
      },
    },
    recruiter: {
      id: 3,
      name: "Phạm Thị Linh",
      avatar: "/mock-images/avatars/user2.jpg",
      email: "pham.linh@example.com",
    },
  },
  {
    id: 2,
    candidateId: 1,
    recruiterId: 4,
    jobId: 8,
    companyId: 2,
    scheduledAt: "2023-10-20T14:30:00Z",
    status: "COMPLETED",
    notes:
      "Ứng viên thể hiện tốt, đặc biệt về kỹ năng thiết kế UI/UX. Được đánh giá cao về portfolio và kinh nghiệm làm việc với design system.",
    location: "Văn phòng DesignHub - 45 Tràng Tiền, Quận Hoàn Kiếm, Hà Nội",
    durationMinutes: 90,
    job: {
      id: 8,
      title: "Product Designer",
      company: {
        id: 2,
        name: "DesignHub",
        company_name: "DesignHub",
        logo: "https://res.cloudinary.com/drheg5d7j/image/upload/v1711298793/company-logos/designhub_logo_wmz3uk.jpg",
        avatar:
          "https://res.cloudinary.com/drheg5d7j/image/upload/v1711298793/company-logos/designhub_logo_wmz3uk.jpg",
      },
    },
    recruiter: {
      id: 4,
      name: "Lê Thị Hoa",
      avatar: "/mock-images/avatars/user4.jpg",
      email: "le.hoa@example.com",
    },
  },
  {
    id: 3,
    candidateId: 1,
    recruiterId: 3,
    jobId: 5,
    companyId: 1,
    scheduledAt: "2023-11-05T10:00:00Z",
    status: "SCHEDULED",
    notes:
      "Vòng phỏng vấn kỹ thuật - tập trung vào kinh nghiệm với CI/CD và AWS. Chuẩn bị demo về cách xây dựng và triển khai pipeline CI/CD.",
    location: "Online - Microsoft Teams",
    meetingUrl: "https://teams.microsoft.com/l/meetup-join/abc123",
    durationMinutes: 60,
    job: {
      id: 5,
      title: "DevOps Engineer",
      company: {
        id: 1,
        name: "TechVision",
        company_name: "TechVision",
        logo: "https://res.cloudinary.com/drheg5d7j/image/upload/v1711298793/company-logos/techvision_logo_pvco7d.jpg",
        avatar:
          "https://res.cloudinary.com/drheg5d7j/image/upload/v1711298793/company-logos/techvision_logo_pvco7d.jpg",
      },
    },
    recruiter: {
      id: 3,
      name: "Phạm Thị Linh",
      avatar: "/mock-images/avatars/user2.jpg",
      email: "pham.linh@example.com",
    },
  },
  {
    id: 4,
    candidateId: 1,
    recruiterId: 5,
    jobId: 11,
    companyId: 6,
    scheduledAt: "2023-11-10T14:00:00Z",
    status: "SCHEDULED",
    notes:
      "Buổi phỏng vấn sẽ bao gồm phần giới thiệu về kinh nghiệm và một buổi giảng dạy thử về JavaScript cơ bản (20 phút). Chuẩn bị slide và bài giảng demo.",
    location:
      "Văn phòng EduTech Vietnam - 123 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
    durationMinutes: 90,
    job: {
      id: 11,
      title: "Giảng viên Công nghệ Web",
      company: {
        id: 6,
        name: "EduTech Vietnam",
        company_name: "EduTech Vietnam",
        logo: "https://res.cloudinary.com/drheg5d7j/image/upload/v1711298793/company-logos/edutech_logo_fmoabf.jpg",
        avatar:
          "https://res.cloudinary.com/drheg5d7j/image/upload/v1711298793/company-logos/edutech_logo_fmoabf.jpg",
      },
    },
    recruiter: {
      id: 5,
      name: "Nguyễn Minh Tuấn",
      avatar: "/mock-images/avatars/user5.jpg",
      email: "nguyen.tuan@edutech.vn",
    },
  },
];
