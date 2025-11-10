/**
 * Convert job detail object to a single text string for CV matching
 */
export const convertJobToText = (job) => {
    if (!job) return "";

    const parts = [];

    // Title
    if (job.title) {
        parts.push(`Job Title: ${job.title}`);
    }

    // Company
    if (job.companyName) {
        parts.push(`Company: ${job.companyName}`);
    }

    // Location
    if (job.location) {
        parts.push(`Location: ${job.location}`);
    }

    // Salary
    if (job.salaryDisplay) {
        parts.push(`Salary: ${job.salaryDisplay}`);
    }

    // Category
    if (job.category && job.category.length > 0) {
        parts.push(
            `Categories: ${
                Array.isArray(job.category)
                    ? job.category.join(", ")
                    : job.category
            }`
        );
    }

    // Level
    if (job.level && job.level.length > 0) {
        parts.push(
            `Level: ${
                Array.isArray(job.level) ? job.level.join(", ") : job.level
            }`
        );
    }

    // Work Type
    if (job.workType && job.workType.length > 0) {
        parts.push(
            `Work Type: ${
                Array.isArray(job.workType)
                    ? job.workType.join(", ")
                    : job.workType
            }`
        );
    }

    // Skills
    if (job.skill && job.skill.length > 0) {
        parts.push(
            `Required Skills: ${
                Array.isArray(job.skill) ? job.skill.join(", ") : job.skill
            }`
        );
    }

    // Description
    if (job.description) {
        parts.push(`Job Description: ${job.description}`);
    }

    // Requirements
    if (job.requirements) {
        parts.push(`Requirements: ${job.requirements}`);
    }

    // Benefits
    if (job.benefits) {
        parts.push(`Benefits: ${job.benefits}`);
    }

    return parts.join("\n\n");
};
