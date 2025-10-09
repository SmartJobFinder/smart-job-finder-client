export const dashboardOverview = {
    recentActivities: [
        {
            id: 1,
            type: "application",
            jobTitle: "Frontend Developer",
            companyName: "TechVision",
            date: "2023-10-18T11:00:00Z",
            status: "PENDING",
        },
        {
            id: 2,
            type: "interview",
            jobTitle: "Product Designer",
            companyName: "DesignHub",
            date: "2023-10-20T14:30:00Z",
            status: "COMPLETED",
        },
        {
            id: 3,
            type: "jobSave",
            jobTitle: "UX Designer",
            companyName: "DesignHub",
            date: "2023-10-17T09:40:00Z",
        },
        {
            id: 4,
            type: "companyFollow",
            companyName: "BrandBoost",
            date: "2023-10-15T14:45:00Z",
        },
    ],
    stats: {
        appliedJobs: 5,
        savedJobs: 4,
        upcomingInterviews: 2,
        followedCompanies: 4,
        profileViews: 28,
        profileCompletion: 75,
    },
    recommendations: {
        jobsMatchingSkills: [1, 2, 5, 8], // IDs from jobs.js
        suggestedCompanies: [1, 3, 6], // IDs from companies.js
        suggestedSkills: ["TypeScript", "AWS", "React Native", "GraphQL"],
    },
};
