import api from "@/lib/api";

/**
 * Call CV Matching API
 * @param {string} jdText - Job description as text
 * @param {string} cvText - CV/Profile as text
 * @returns {Promise<{similarity_score: number, match_level: string}>}
 */
export const checkCVMatching = async (jdText, cvText) => {
    try {
        const response = await api.post("/ai/cv-matching", {
            jd_text: jdText,
            cv_text: cvText,
        });

        return {
            similarityScore: response.data.similarity_score,
            matchLevel: response.data.match_level,
        };
    } catch (error) {
        console.error("CV Matching API Error:", error);

        // Log thêm để debug
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);

        throw new Error(
            error.response?.data?.message ||
                error.response?.data?.error ||
                "Failed to check CV matching"
        );
    }
};
