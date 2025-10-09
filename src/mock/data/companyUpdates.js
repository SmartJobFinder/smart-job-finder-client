export const companyUpdates = {
    updates: [
        {
            companyId: 1,
            companyName: "TechVision",
            updateType: "job_posting",
            content: "TechVision posted 3 new jobs matching your skills",
            date: "2023-10-19T14:30:00Z",
            relatedJobIds: [1, 5, 9],
        },
        {
            companyId: 2,
            companyName: "DesignHub",
            updateType: "company_news",
            content:
                "DesignHub won the Best UI/UX Design Studio award for 2023",
            date: "2023-10-15T09:20:00Z",
        },
        {
            companyId: 4,
            companyName: "BrandBoost",
            updateType: "hiring_event",
            content:
                "BrandBoost is hosting a virtual recruitment event next week",
            date: "2023-10-18T11:45:00Z",
            eventDetails: {
                title: "Digital Marketing Careers: Virtual Recruitment Day",
                date: "2023-10-25T13:00:00Z",
                registrationUrl: "https://example.com/brandboost-event",
            },
        },
        {
            companyId: 6,
            companyName: "EduTech Vietnam",
            updateType: "job_posting",
            content:
                "EduTech Vietnam is looking for educational content creators",
            date: "2023-10-17T16:10:00Z",
            relatedJobIds: [11],
        },
    ],
    recommendedCompaniesToFollow: [
        {
            id: 3,
            name: "DataCraft",
            reason: "Matches your interest in data analysis",
            jobsCount: 5,
        },
        {
            id: 5,
            name: "FinTech Solutions",
            reason: "Growing company in your area",
            jobsCount: 7,
        },
    ],
};
