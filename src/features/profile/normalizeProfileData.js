export function normalizeProfileData(raw) {
    if (!raw) return null;

    return {
        personalDetail: {
            id: raw.id,
            fullName: raw.fullName,
            title: raw.title,
            email: raw.email,
            dateOfBirth: raw.dateOfBirth,
            phone: raw.phone,
            gender: raw.gender,
            personalLink: raw.personalLink,
            avatar: raw.avatar,
        },
        aboutMe: { text: raw.aboutMe || "" },
        candidateSkills: raw.candidateSkills || [],
        education: raw.education || [],
        workExperience: raw.workExperience || [],
        softSkills: raw.softSkills || [],
        certificates: raw.certificates || [],
        awards: raw.awards || [],
    };
}
