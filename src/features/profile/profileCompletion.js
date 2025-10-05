export function calculateProfileCompletion(normalizedProfileData) {
    if (!normalizedProfileData) return { percent: 0, missingSections: [] };

    const sections = [
        { id: "personalDetail", weight: 20 },
        { id: "aboutMe", weight: 10 },
        { id: "workExperience", weight: 20 },
        { id: "education", weight: 15 },
        { id: "candidateSkills", weight: 15 },
        { id: "softSkills", weight: 5 },
        { id: "certificates", weight: 5 },
        { id: "awards", weight: 5 },
    ];

    let totalWeight = 0;
    let earnedWeight = 0;
    let missingSections = [];

    sections.forEach(({ id, weight }) => {
        totalWeight += weight;

        const sectionData = normalizedProfileData[id];
        let hasContent = false;

        if (id === "aboutMe") {
            hasContent = !!sectionData?.text?.trim();
        } else if (id === "personalDetail") {
            hasContent =
                sectionData &&
                (sectionData.fullName ||
                    sectionData.email ||
                    sectionData.phone ||
                    sectionData.dateOfBirth);
        } else if (Array.isArray(sectionData)) {
            hasContent = sectionData.length > 0;
        } else {
            hasContent = sectionData && Object.keys(sectionData).length > 0;
        }

        if (hasContent) {
            earnedWeight += weight;
        } else {
            missingSections.push(id);
        }
    });

    const percent = Math.round((earnedWeight / totalWeight) * 100);

    return { percent, missingSections };
}
