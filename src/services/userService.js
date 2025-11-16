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

        let errorMessage = "Failed to update user profile";

        if (error.response?.data) {
            const errData = error.response.data;
            if (typeof errData === "string") {
                errorMessage = errData;
            } else if (errData.message) {
                errorMessage = errData.message;
            } else if (errData.errors) {
                errorMessage = Object.entries(errData.errors)
                    .map(([field, msg]) => `${field}: ${msg}`)
                    .join(", ");
            }
        }

        throw new Error(errorMessage);
    }
}

// Change password - SỬ DỤNG ENDPOINT MỚI
export async function changePassword(oldPassword, newPassword) {
    try {
        const response = await api.post(
            "/users/change-password",
            {
                oldPassword,
                newPassword,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error changing password:", error);

        let errorMessage = "Failed to change password";

        if (error.response?.data) {
            const errData = error.response.data;
            if (typeof errData === "string") {
                errorMessage = errData;
            } else if (errData.message) {
                errorMessage = errData.message;
            }
        }

        throw new Error(errorMessage);
    }
}
