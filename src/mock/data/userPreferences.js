export const userPreferences = {
  subscriptions: {
    jobAlerts: {
      enabled: true,
      frequency: "daily",
      keywords: ["frontend", "react", "javascript"],
      locations: ["Ho Chi Minh City", "Remote"],
    },
    companyUpdates: {
      enabled: true,
      companies: [1, 2, 4, 6], // IDs of followed companies
    },
    newsletter: {
      enabled: false,
      topics: [],
    },
  },
  savedSearches: [
    {
      id: 1,
      name: "Frontend Remote Jobs",
      criteria: {
        keywords: ["frontend", "react"],
        location: "Remote",
        jobType: "Full-time",
      },
      alertEnabled: true,
      alertFrequency: "weekly",
      createdAt: "2023-10-10T08:30:00Z",
    },
    {
      id: 2,
      name: "Local Developer Jobs",
      criteria: {
        keywords: ["developer", "javascript"],
        location: "Ho Chi Minh City",
        jobType: "Any",
      },
      alertEnabled: false,
      createdAt: "2023-09-25T14:20:00Z",
    },
  ],
  activityLog: [
    {
      action: "profile_update",
      section: "skills",
      timestamp: "2023-10-18T09:45:00Z",
    },
    {
      action: "settings_change",
      section: "notifications",
      timestamp: "2023-10-15T16:30:00Z",
    },
    {
      action: "password_change",
      timestamp: "2023-09-30T11:20:00Z",
    },
    {
      action: "login",
      device: "Chrome on Windows",
      location: "Ho Chi Minh City, Vietnam",
      timestamp: "2023-10-19T08:15:00Z",
    },
  ],
};
