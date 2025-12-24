export const cvData = {
  generatedCVs: [
    {
      id: 1,
      name: "Software Developer CV",
      templateId: 1,
      createdAt: "2023-09-20T14:30:00Z",
      downloads: 2,
      lastDownloaded: "2023-09-25T09:15:00Z",
    },
    {
      id: 2,
      name: "Frontend Specialist CV",
      templateId: 3,
      createdAt: "2023-10-05T16:45:00Z",
      downloads: 1,
      lastDownloaded: "2023-10-05T17:00:00Z",
    },
  ],
  recommendedTemplates: [2, 5], // Template IDs that would work well with user's profile
  cvStats: {
    totalDownloads: 3,
    lastGenerated: "2023-10-05T16:45:00Z",
    employerViews: 4,
    completionScore: 85,
  },
  feedbackHistory: [
    {
      date: "2023-09-26T11:20:00Z",
      source: "AI Assistant",
      content:
        "Consider adding more quantifiable achievements to your work experience section.",
    },
    {
      date: "2023-10-06T09:30:00Z",
      source: "Peer Review",
      content:
        "The layout is clean and professional. Your skills section stands out well.",
    },
  ],
};
