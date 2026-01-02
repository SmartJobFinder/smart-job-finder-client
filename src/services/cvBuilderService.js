import api from "@/lib/api";

export const generateCvWithAI = async (jobId, language = "en") => {
  try {
    if (!jobId) throw new Error("jobId is required");

    const payload = { jobId, language };
    // Use the standard api with extended timeout for this request
    const response = await api.post("/cv-builder", payload, {
      timeout: 300000, // 5 minutes
    });
    return response.data;
  } catch (error) {
    console.error("Error generating CV with AI:", error);
    throw error;
  }
};

export const generateCvWithAIGet = async (jobId, language = "en") => {
  try {
    if (!jobId) throw new Error("jobId is required");

    const response = await api.get("/cv-builder", {
      params: { jobId, language },
      timeout: 300000, // 5 minutes
    });
    return response.data;
  } catch (error) {
    console.error("Error generating CV with AI (GET):", error);
    throw error;
  }
};
