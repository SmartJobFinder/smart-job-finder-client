import api from "@/lib/api";

/**
 * Format job data thành text để gửi đến AI
 */
const formatJobDataToText = (formData) => {
    const parts = [];

    // Job Title
    if (formData.jobTitle) {
        parts.push(`Job Title: ${formData.jobTitle}`);
    }

    // Categories
    if (formData.categories && formData.categories.length > 0) {
        const categories = Array.isArray(formData.categories)
            ? formData.categories.join(", ")
            : formData.categories;
        parts.push(`Categories: ${categories}`);
    }

    // Location
    if (formData.city || formData.address) {
        const location = [formData.address, formData.city]
            .filter(Boolean)
            .join(", ");
        parts.push(`Location: ${location}`);
    }

    // Work Type
    if (formData.workType && formData.workType.length > 0) {
        const workTypes = Array.isArray(formData.workType)
            ? formData.workType.join(", ")
            : formData.workType;
        parts.push(`Work Type: ${workTypes}`);
    }

    // Salary
    if (formData.salaryMin || formData.salaryMax) {
        const salaryType = formData.salaryType === 0 ? "monthly" : "negotiable";
        const salaryText =
            formData.salaryMin && formData.salaryMax
                ? `${formData.salaryMin.toLocaleString()} - ${formData.salaryMax.toLocaleString()} VND (${salaryType})`
                : "Negotiable";
        parts.push(`Salary: ${salaryText}`);
    }

    // Job Description (remove HTML tags)
    if (formData.jobDescription) {
        const cleanDesc = formData.jobDescription
            .replace(/<[^>]*>/g, "")
            .trim();
        if (cleanDesc) {
            parts.push(`Job Description: ${cleanDesc}`);
        }
    }

    // Requirements (remove HTML tags)
    if (formData.requirements) {
        const cleanReq = formData.requirements.replace(/<[^>]*>/g, "").trim();
        if (cleanReq) {
            parts.push(`Requirements: ${cleanReq}`);
        }
    }

    // Benefits
    if (formData.benefits) {
        let benefitsText = "";

        if (typeof formData.benefits === "string") {
            benefitsText = formData.benefits.replace(/<[^>]*>/g, "").trim();
        } else if (Array.isArray(formData.benefits)) {
            benefitsText = formData.benefits
                .map((benefit) => {
                    const title = benefit.title || "";
                    const desc = benefit.description
                        ? benefit.description.replace(/<[^>]*>/g, "").trim()
                        : "";
                    return `${title}${desc ? ": " + desc : ""}`;
                })
                .filter(Boolean)
                .join("; ");
        }

        if (benefitsText) {
            parts.push(`Benefits: ${benefitsText}`);
        }
    }

    // Skills
    if (formData.skill && formData.skill.length > 0) {
        const skills = Array.isArray(formData.skill)
            ? formData.skill.join(", ")
            : formData.skill;
        parts.push(`Skills Required: ${skills}`);
    }

    // Level
    if (formData.level && formData.level.length > 0) {
        const levels = Array.isArray(formData.level)
            ? formData.level.join(", ")
            : formData.level;
        parts.push(`Experience Level: ${levels}`);
    }

    return parts.join("\n\n");
};

/**
 * Gọi Spring Boot backend để detect scam
 */
const detectScamJob = async (formData) => {
    try {
        const text = formatJobDataToText(formData);

        console.log("Sending to Spring Boot AI service:", text);

        // ✅ GỌI QUA SPRING BOOT BACKEND
        const response = await api.post("/ai/predict-scam", {
            text: text,
        });

        // Parse response từ Spring Boot
        // Response format: { legit_prob: 0.996, scam_prob: 0.004, label: "legit" }
        const data =
            typeof response.data === "string"
                ? JSON.parse(response.data)
                : response.data;

        return {
            isScam: data.label === "scam",
            scamProb: data.scam_prob || 0,
            legitProb: data.legit_prob || 1,
            label: data.label || "legit",
            confidencePercent: Math.round(
                (data.label === "scam" ? data.scam_prob : data.legit_prob) * 100
            ),
        };
    } catch (error) {
        console.error("Error calling Spring Boot AI service:", error);
        return {
            isScam: false,
            scamProb: 0,
            legitProb: 0,
            label: "error",
            confidencePercent: 0,
            error:
                error.response?.data?.message ||
                error.message ||
                "Unable to connect to AI service",
        };
    }
};

/**
 * Job validation CHỈ DÙNG AI scam detection
 */
export const validateJobPosting = async (formData) => {
    const issues = [];
    const suggestions = [];
    let score = 100;

    try {
        const aiResult = await detectScamJob(formData);

        console.log("AI Scam Detection Result:", aiResult);

        if (aiResult.error) {
            return {
                score: 0,
                status: "error",
                issues: [
                    "Unable to validate job posting. Please try again.",
                    `Error details: ${aiResult.error}`,
                ],
                suggestions: [
                    "Check your internet connection and try again.",
                    "Ensure Spring Boot backend is running",
                    "Ensure AI service (Python) is running on port 8000",
                ],
            };
        }

        // Tính score dựa trên AI result
        score = Math.round(aiResult.legitProb * 100);

        // Phân loại dựa trên scam probability
        if (aiResult.isScam) {
            const confidencePercent = (aiResult.scamProb * 100).toFixed(1);

            if (aiResult.scamProb > 0.7) {
                issues.push(
                    `AI detected high probability of scam (${confidencePercent}% confidence)`
                );
                issues.push(
                    "This job posting contains characteristics commonly associated with fraudulent job listings"
                );
                suggestions.push(
                    "Review all job details carefully for misleading or unrealistic information"
                );
                suggestions.push(
                    "Ensure salary ranges are realistic for the position level"
                );
                suggestions.push(
                    "Remove any requests for upfront payments or personal financial information"
                );
                suggestions.push(
                    "Provide clear and detailed job responsibilities and requirements"
                );
            } else if (aiResult.scamProb > 0.5) {
                issues.push(
                    `AI detected potential issues (${confidencePercent}% scam probability)`
                );
                issues.push(
                    "Some aspects of this job posting may raise concerns"
                );
                suggestions.push("Review job content for clarity and accuracy");
                suggestions.push(
                    "Ensure all job details are realistic and transparent"
                );
                suggestions.push(
                    "Verify that benefits and compensation are clearly stated"
                );
            } else if (aiResult.scamProb > 0.3) {
                suggestions.push(
                    `AI flagged minor concerns (${confidencePercent}% scam probability)`
                );
                suggestions.push(
                    "Consider reviewing job description for completeness"
                );
                suggestions.push(
                    "Ensure all information is accurate and professional"
                );
            }
        } else {
            const legitPercent = (aiResult.legitProb * 100).toFixed(1);

            if (aiResult.legitProb > 0.9) {
                suggestions.push(
                    `AI verified this as a legitimate job posting (${legitPercent}% confidence)`
                );
            } else if (aiResult.legitProb > 0.7) {
                suggestions.push(
                    "Job posting looks good. Consider adding more details to improve clarity"
                );
            } else {
                suggestions.push(
                    "Consider adding more detailed information about job responsibilities"
                );
                suggestions.push(
                    "Ensure all requirements and benefits are clearly stated"
                );
            }
        }

        score = Math.max(0, Math.min(100, score));

        let status;
        if (score >= 80) {
            status = "safe";
        } else if (score >= 50) {
            status = "warning";
        } else {
            status = "danger";
        }

        return {
            score,
            status,
            issues: issues.length > 0 ? issues : null,
            suggestions: suggestions.length > 0 ? suggestions : null,
            aiDetails: {
                scamProbability: aiResult.scamProb,
                legitProbability: aiResult.legitProb,
                label: aiResult.label,
            },
        };
    } catch (error) {
        console.error("AI validation error:", error);

        return {
            score: 0,
            status: "error",
            issues: [
                "Unable to validate job posting at this time",
                error.message || "AI service is temporarily unavailable",
            ],
            suggestions: [
                "Please try again later",
                "Ensure Spring Boot backend is running",
                "Ensure AI Python service is running on port 8000",
                "Contact support if the problem persists",
            ],
        };
    }
};
