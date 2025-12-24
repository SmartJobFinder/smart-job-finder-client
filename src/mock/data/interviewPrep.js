export const interviewPrep = {
  upcomingInterviews: [
    {
      interviewId: 1,
      jobId: 5,
      companyId: 1,
      status: "SCHEDULED",
      type: "TECHNICAL",
      mode: "ONLINE",
      platform: "Zoom",
      meetingLink: "https://zoom.us/j/123456789",
      dateTime: "2023-10-25T14:00:00Z",
      duration: 60, // minutes
      interviewers: [
        {
          name: "John Smith",
          position: "Senior Developer",
          avatar: "/avatars/interviewer1.jpg",
        },
      ],
      preparationMaterials: [
        {
          type: "article",
          title: "Top React Interview Questions for 2023",
          url: "https://example.com/react-interview-questions",
        },
        {
          type: "video",
          title: "How to Ace a Technical Interview",
          url: "https://example.com/tech-interview-tips",
        },
      ],
      suggestedQuestions: [
        "Can you explain your experience with React hooks?",
        "How would you optimize a slow-rendering component?",
        "Describe a challenging project and how you solved its problems.",
      ],
      companyResearch: {
        recentNews: [
          "TechVision released a new AI platform last month",
          "They're expanding their team by 30% this year",
        ],
        culture:
          "TechVision is known for its collaborative environment and focus on innovation.",
        interviewTips:
          "They typically have a technical round followed by a cultural fit interview.",
      },
    },
  ],
  pastInterviewFeedback: [
    {
      interviewId: 2,
      jobId: 3,
      companyId: 2,
      dateTime: "2023-10-10T13:00:00Z",
      feedback:
        "Strong technical skills demonstrated. Communication was clear and professional.",
      improvements: "Could provide more specific examples from past projects.",
      outcome: "POSITIVE",
    },
  ],
  commonQuestions: [
    "Tell me about yourself",
    "Why do you want to work at our company?",
    "Describe a challenging project you worked on",
    "How do you keep up with industry trends?",
    "What are your salary expectations?",
  ],
};
