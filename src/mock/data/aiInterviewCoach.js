// src/mock/data/aiInterviewCoach.js

// Mock questions based on skill
export const mockQuestionsBySkill = {
  React:
    "How do you optimize React component performance? Can you explain the difference between useMemo and useCallback?",
  JavaScript:
    "Explain the difference between var, let, and const. How does the event loop work in JavaScript?",
  TypeScript:
    "What are the main benefits of using TypeScript over JavaScript? How do you handle type safety in complex applications?",
  "Node.js":
    "How do you handle asynchronous operations in Node.js? Explain the difference between callbacks, promises, and async/await.",
  Python:
    "Explain the difference between lists and tuples in Python. How do you handle memory management in large Python applications?",
  Java: "Explain the concept of polymorphism in Java. How do you handle exceptions in your Java applications?",
  SQL: "How do you optimize a slow SQL query? Explain the difference between INNER JOIN and LEFT JOIN.",
  MongoDB:
    "How do you design a schema for a MongoDB database? Explain the difference between embedded and referenced documents.",
  Docker:
    "Explain the difference between Docker images and containers. How do you optimize Docker image size?",
  AWS: "How do you design a scalable architecture on AWS? Explain the difference between EC2 and Lambda.",
  Git: "Explain Git branching strategies. How do you resolve merge conflicts?",
  Agile:
    "How do you handle changing requirements in an Agile project? Explain the difference between Scrum and Kanban.",
};

// Mock questions based on job (có thể mở rộng thêm)
export const mockQuestionsByJob = {
  // Generic questions cho các job types
  default:
    "Tell me about your experience with this role and why you're interested in this position. What specific skills do you bring that would make you successful in this role?",
};

// Helper function để generate question dựa trên job title
export function getQuestionForJob(jobTitle) {
  if (!jobTitle) return mockQuestionsByJob.default;

  const title = jobTitle.toLowerCase();

  if (
    title.includes("frontend") ||
    title.includes("react") ||
    title.includes("ui")
  ) {
    return "As a Frontend Developer, how do you ensure your React components are performant and maintainable? Walk me through your approach to state management and component architecture.";
  }
  if (title.includes("backend") || title.includes("server")) {
    return "How do you handle database migrations in a production environment? Explain your approach to API design and error handling.";
  }
  if (title.includes("full stack") || title.includes("fullstack")) {
    return "Explain how you would architect a full-stack application from scratch. How do you ensure consistency between frontend and backend?";
  }
  if (title.includes("devops") || title.includes("sre")) {
    return "Describe your experience with CI/CD pipelines. How do you ensure zero-downtime deployments and handle rollbacks?";
  }
  if (title.includes("product manager") || title.includes("pm")) {
    return "How do you prioritize features when building a new product? Walk me through your product development process.";
  }
  if (title.includes("data") || title.includes("analyst")) {
    return "Explain how you would build a machine learning model to predict user behavior. What metrics would you use to evaluate the model?";
  }
  if (title.includes("mobile")) {
    return "How do you handle different screen sizes and device capabilities in mobile development? What's your approach to cross-platform development?";
  }

  return mockQuestionsByJob.default;
}

// Mock evaluation responses
export const mockEvaluation = {
  score: 8.5,
  feedback:
    "Your answer demonstrates strong technical knowledge and clear communication. You provided specific examples and explained your thought process well. However, you could improve by providing more concrete metrics or results from your past experiences. Consider structuring your answers using the STAR method (Situation, Task, Action, Result) for better clarity.",
  suggestions: [
    "Use the STAR method to structure your answers",
    "Include specific metrics and quantifiable results",
    "Show enthusiasm and passion for the role",
    "Ask thoughtful questions at the end",
  ],
};

// Mock audio analysis
export const mockAudioAnalysis = {
  pace: 145, // words per minute
  emotion: "confident",
  confidence: 0.82,
};

// Mock transcript
export const mockTranscript =
  "I have been working with React for the past three years, primarily focusing on building responsive user interfaces. I use useMemo to memoize expensive calculations and useCallback to memoize functions that are passed as props to child components. This helps prevent unnecessary re-renders and improves application performance.";

// Mock audio URLs (placeholder URLs for demo)
export const mockAudioUrls = {
  question: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Placeholder audio URL
  feedback: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3", // Placeholder audio URL
};
