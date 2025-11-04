import api from "@/lib/api";

/**
 * Service để lấy thông tin candidate profile theo userId
 * @param {number|string} userId - ID của user
 * @returns {Promise} - Promise chứa thông tin candidate profile
 */
export const getCandidateProfileByUserId = async (userId) => {
    try {
        const response = await api.get(`/candidate/profile/user/${userId}`);
        return response.data;
    } catch (error) {
        console.error(
            `Failed to fetch candidate profile for user ${userId}:`,
            error
        );
        throw error;
    }
};

/**
 * Batch fetch multiple candidate profiles
 * @param {Array<number|string>} userIds - Array of user IDs
 * @returns {Promise<Map>} - Map of userId -> profile data
 */
export const batchGetCandidateProfiles = async (userIds) => {
    try {
        const results = await Promise.all(
            userIds.map(async (userId) => {
                try {
                    const profile = await getCandidateProfileByUserId(userId);
                    return { userId, profile, error: null };
                } catch (error) {
                    return { userId, profile: null, error };
                }
            })
        );

        const profileMap = new Map();
        results.forEach(({ userId, profile }) => {
            if (profile) {
                profileMap.set(userId, profile);
            }
        });

        return profileMap;
    } catch (error) {
        console.error("Failed to batch fetch candidate profiles:", error);
        throw error;
    }
};
