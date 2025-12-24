export const jobsInsights = {
  applicationStats: {
    total: 5,
    pending: 2,
    reviewing: 1,
    accepted: 1,
    rejected: 1,
    interviewScheduled: 2,
  },
  savedJobsStats: {
    total: 4,
    newMatchingSince: 3,
    expiringWithin7Days: 1,
    savedJobIds: [1, 3, 5, 7],
  },
  recommendedJobs: [
    {
      id: 7,
      title: "Senior Frontend Developer",
      companyName: "TechVision",
      matchScore: 92,
      reasons: ["Skills match", "Preferred location", "Salary range match"],
    },
    {
      id: 10,
      title: "UI/UX Developer",
      companyName: "DesignHub",
      matchScore: 87,
      reasons: ["Skills match", "Company you follow"],
    },
    {
      id: 12,
      title: "React Developer",
      companyName: "DataCraft",
      matchScore: 85,
      reasons: ["Skills match", "Industry interest"],
    },
  ],
  searchHistory: [
    {
      query: "frontend developer",
      date: "2023-10-18T10:30:00Z",
      resultsCount: 24,
    },
    {
      query: "react javascript",
      date: "2023-10-15T14:15:00Z",
      resultsCount: 37,
    },
    {
      query: "remote developer",
      date: "2023-10-12T09:45:00Z",
      resultsCount: 42,
    },
  ],
};
