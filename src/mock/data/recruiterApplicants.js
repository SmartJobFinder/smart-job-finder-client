export const recruiterApplicants = [
    {
        id: 1001,
        job_id: 101,
        job_title: "Senior Frontend Developer",
        applicant_name: "Nguyen Van A",
        applicant_email: "nguyenvana@example.com",
        applicant_phone: "0901234567",
        status: "NEW",
        applied_date: "2023-08-20T08:30:00Z",
        last_updated: "2023-08-20T08:30:00Z",
        cv_url: "https://example.com/cvs/nguyenvana.pdf",
        cover_letter:
            "Tôi có 6 năm kinh nghiệm làm Frontend Developer và rất hứng thú với vị trí này.",
        experience_years: 6,
        skills: ["React", "TypeScript", "Next.js", "Redux", "GraphQL"],
        education: "Đại học Bách Khoa Hà Nội",
        has_interview: false,
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        id: 1002,
        job_id: 101,
        job_title: "Senior Frontend Developer",
        applicant_name: "Tran Thi B",
        applicant_email: "tranthib@example.com",
        applicant_phone: "0912345678",
        status: "REVIEWING",
        applied_date: "2023-08-18T10:15:00Z",
        last_updated: "2023-08-21T14:30:00Z",
        cv_url: "https://example.com/cvs/tranthib.pdf",
        cover_letter:
            "Với 5 năm kinh nghiệm phát triển web frontend, tôi tin rằng mình phù hợp với vị trí này.",
        experience_years: 5,
        skills: ["React", "JavaScript", "CSS", "Webpack", "Jest"],
        education: "Đại học FPT",
        has_interview: false,
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        id: 1003,
        job_id: 101,
        job_title: "Senior Frontend Developer",
        applicant_name: "Le Van C",
        applicant_email: "levanc@example.com",
        applicant_phone: "0923456789",
        status: "INTERVIEW_SCHEDULED",
        applied_date: "2023-08-16T09:00:00Z",
        last_updated: "2023-08-22T11:45:00Z",
        cv_url: "https://example.com/cvs/levanc.pdf",
        cover_letter:
            "Tôi đã làm việc với React và TypeScript trong 7 năm qua và muốn mang kinh nghiệm của mình đến công ty bạn.",
        experience_years: 7,
        skills: ["React", "TypeScript", "React Native", "Node.js", "AWS"],
        education: "Đại học Khoa học Tự nhiên TP.HCM",
        interview_date: "2023-08-25T14:00:00Z",
        interview_type: "ONLINE",
        interview_link: "https://meet.google.com/abc-defg-hij",
        has_interview: true,
        avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    },
    {
        id: 1004,
        job_id: 102,
        job_title: "Backend Node.js Developer",
        applicant_name: "Pham Thi D",
        applicant_email: "phamthid@example.com",
        applicant_phone: "0934567890",
        status: "NEW",
        applied_date: "2023-08-21T15:30:00Z",
        last_updated: "2023-08-21T15:30:00Z",
        cv_url: "https://example.com/cvs/phamthid.pdf",
        cover_letter:
            "Tôi có kinh nghiệm 4 năm với Node.js, Express và MongoDB. Rất mong được làm việc tại công ty.",
        experience_years: 4,
        skills: ["Node.js", "Express", "MongoDB", "Docker", "REST API"],
        education: "Đại học Công nghệ Thông tin",
        has_interview: false,
        avatar: "https://randomuser.me/api/portraits/women/56.jpg",
    },
    {
        id: 1005,
        job_id: 102,
        job_title: "Backend Node.js Developer",
        applicant_name: "Hoang Van E",
        applicant_email: "hoangvane@example.com",
        applicant_phone: "0945678901",
        status: "ACCEPTED",
        applied_date: "2023-08-19T11:20:00Z",
        last_updated: "2023-08-24T09:15:00Z",
        cv_url: "https://example.com/cvs/hoangvane.pdf",
        cover_letter:
            "Tôi rất ấn tượng với các sản phẩm của công ty và mong muốn được đóng góp vào team backend.",
        experience_years: 3,
        skills: ["Node.js", "PostgreSQL", "AWS", "Microservices", "CI/CD"],
        education: "Đại học Quốc tế RMIT",
        has_interview: true,
        interview_date: "2023-08-22T10:00:00Z",
        interview_type: "ONSITE",
        interview_location: "Tầng 5, Tòa nhà ABC, Quận 1, TP.HCM",
        avatar: "https://randomuser.me/api/portraits/men/62.jpg",
    },
    {
        id: 1006,
        job_id: 105,
        job_title: "React Native Developer",
        applicant_name: "Nguyen Thi F",
        applicant_email: "nguyenthif@example.com",
        applicant_phone: "0956789012",
        status: "REJECTED",
        applied_date: "2023-08-17T14:45:00Z",
        last_updated: "2023-08-23T16:30:00Z",
        cv_url: "https://example.com/cvs/nguyenthif.pdf",
        cover_letter:
            "Tôi có 2 năm kinh nghiệm với React Native và đã phát triển nhiều ứng dụng di động.",
        experience_years: 2,
        skills: ["React Native", "JavaScript", "Redux", "Firebase", "Git"],
        education: "Đại học Khoa học và Công nghệ Hà Nội",
        has_interview: false,
        avatar: "https://randomuser.me/api/portraits/women/33.jpg",
    },
    {
        id: 1007,
        job_id: 105,
        job_title: "React Native Developer",
        applicant_name: "Tran Van H",
        applicant_email: "tranvanh@example.com",
        applicant_phone: "0967890123",
        status: "INTERVIEW_SCHEDULED",
        applied_date: "2023-08-20T13:10:00Z",
        last_updated: "2023-08-24T11:20:00Z",
        cv_url: "https://example.com/cvs/tranvanh.pdf",
        cover_letter:
            "Tôi đã phát triển ứng dụng di động với React Native trong 4 năm qua và rất thích thú với vị trí này.",
        experience_years: 4,
        skills: ["React Native", "TypeScript", "GraphQL", "Jest", "CI/CD"],
        education: "Đại học Công nghệ - ĐHQGHN",
        has_interview: true,
        interview_date: "2023-08-26T15:30:00Z",
        interview_type: "ONLINE",
        interview_link: "https://zoom.us/j/123456789",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    },
];

// Helper functions
export const getApplicantsByStatus = (status) => {
    if (!status || status === "all") return recruiterApplicants;
    return recruiterApplicants.filter((app) => app.status === status);
};

export const getApplicantsByJobId = (jobId) => {
    if (!jobId && jobId !== 0) return [];
    return recruiterApplicants.filter((app) => app.job_id === jobId);
};

export const getInterviews = () => {
    return recruiterApplicants.filter((app) => app.has_interview);
};

export const getNewApplicants = () => getApplicantsByStatus("NEW");
export const getReviewingApplicants = () => getApplicantsByStatus("REVIEWING");
export const getInterviewScheduledApplicants = () =>
    getApplicantsByStatus("INTERVIEW_SCHEDULED");
export const getAcceptedApplicants = () => getApplicantsByStatus("ACCEPTED");
export const getRejectedApplicants = () => getApplicantsByStatus("REJECTED");
