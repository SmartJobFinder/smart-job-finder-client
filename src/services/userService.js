import api from "@/lib/api";

// Get current user info
export async function getCurrentUser() {
    try {
        const { data } = await api.get("/users/me", {
            withCredentials: true,
            headers: { "Cache-Control": "no-store" },
        });
        return data;
    } catch (error) {
        console.error("Error getting current user:", error);
        throw error;
    }
}

// Update user profile - CHỈ GỬI fullName và phone
export async function updateUserProfile(userId, userData) {
    try {
        // Backend UserServiceImpl chỉ check null rồi mới update
        // Chỉ gửi fullName và phone, không gửi email/roleId/status (để tránh validation lỗi)
        const updatePayload = {};

        if (userData.fullName !== undefined && userData.fullName !== null) {
            updatePayload.fullName = userData.fullName.trim();
        }

        if (userData.phone !== undefined && userData.phone !== null) {
            updatePayload.phone = userData.phone.trim();
        }

        console.log("=== UPDATE USER PROFILE ===");
        console.log("User ID:", userId);
        console.log("Update Payload:", updatePayload);

        const response = await api.patch(`/users/${userId}`, updatePayload, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        console.log("Update response:", response.data);
        return response.data;
    } catch (error) {
        console.error("=== UPDATE USER ERROR ===");
        console.error("Error:", error);
        console.error("Response:", error.response?.data);

        // Parse error message
        let errorMessage = "Failed to update user profile";

        if (error.response?.data) {
            const errData = error.response.data;
            if (typeof errData === "string") {
                errorMessage = errData;
            } else if (errData.message) {
                errorMessage = errData.message;
            } else if (errData.errors) {
                // Handle validation errors object
                errorMessage = Object.entries(errData.errors)
                    .map(([field, msg]) => `${field}: ${msg}`)
                    .join(", ");
            }
        }

        throw new Error(errorMessage);
    }
}

// Update password
export async function updatePassword(passwordData) {
    try {
        const response = await api.post(
            "/users/change-password",
            passwordData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating password:", error);
        throw error;
    }
}
