import api from "@/lib/api";

export const generateCvWithAI = async (jobId, language = "en") => {
  try {
    if (!jobId) throw new Error("jobId is required");

    const payload = { jobId, language };
    const response = await api.post("/cv-builder", payload);
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
    });
    return response.data;
  } catch (error) {
    console.error("Error generating CV with AI (GET):", error);
    throw error;
  }
};

