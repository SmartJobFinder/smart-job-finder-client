export const settings = {
  account: {
    name: "Võ Nhật Hào",
    email: "vo.nhat.hao@example.com",
    phoneNumber: "0901234567",
    currentPassword: "password",
    twoFactorEnabled: false,
  },
  notifications: {
    email: {
      jobAlerts: true,
      applicationUpdates: true,
      interviews: true,
      messages: true,
      marketing: false,
    },
    inApp: {
      jobAlerts: true,
      applicationUpdates: true,
      interviews: true,
      messages: true,
      marketing: false,
    },
  },
  privacy: {
    profileVisibility: "public",
    resumeVisibility: "registered_recruiters",
    contactInfoVisibility: "connections_only",
    activityVisibility: "connections_only",
    allowSearchEngineIndexing: true,
  },
  jobPreferences: {
    desiredJobTitles: [
      "Frontend Developer",
      "React Developer",
      "JavaScript Developer",
    ],
    desiredLocations: ["Ho Chi Minh City", "Remote"],
    desiredSalary: {
      min: 1500,
      max: 3000,
      currency: "USD",
      period: "monthly",
    },
    employmentTypes: ["Full-time", "Contract"],
    remotePreference: "hybrid",
    availableFrom: "2023-12-01",
  },
  language: "vi",
  theme: "light",
};
