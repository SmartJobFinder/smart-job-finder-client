export const recruiterUser = {
    id: 1001,
    fullName: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+84 912 345 678",
    status: "ACTIVE",
    isActive: true,
    roleName: "RECRUITER",
    createdAt: "2022-05-15T10:30:00Z",
    lastLogin: "2023-10-20T14:45:22Z",
    avatar: "https://i.pravatar.cc/150?u=1001",
    jobTitle: "Senior Recruiter",
    company: {
        id: 101,
        name: "TechVision JSC",
    },
};

export const recruiterCompany = {
    id: 101,
    company_name: "TechVision JSC",
    description:
        "TechVision is a leading technology company specializing in innovative software solutions for businesses across various industries. Our team of experts is dedicated to delivering high-quality products that help companies achieve their digital transformation goals.",
    email: "hr@techvision.com",
    phoneNumber: "+84 28 1234 5678",
    website: "https://techvision.example.com",
    address: "123 Le Loi Street, District 1",
    locationCity: "Ho Chi Minh City",
    locationCountry: "Vietnam",
    foundedYear: 2015,
    quantityEmployee: 180,
    status: "active",
    proCompany: true,
    facebookUrl: "https://facebook.com/techvision",
    twitterUrl: "https://twitter.com/techvision",
    linkedinUrl: "https://linkedin.com/company/techvision",
    mapEmbedUrl:
        "https://maps.google.com/maps?q=123+Le+Loi+Street,+District+1,+Ho+Chi+Minh+City&output=embed",
    categoryIds: [2, 5, 8],
    categories: [
        { id: 2, name: "Software Development" },
        { id: 5, name: "Web Development" },
        { id: 8, name: "Mobile Development" },
    ],
    avatar: "https://random.imagecdn.app/500/500?company=101",
    avatarCover: "https://random.imagecdn.app/1200/300?company=101",
    jobCount: 12,
    followCount: 245,
};

export const companyMetrics = {
    jobViews: 3240,
    totalApplicants: 254,
    hiringRate: 7.8,
    averageResponseTime: "1.5 days",
    activeJobsCount: 12,
};
