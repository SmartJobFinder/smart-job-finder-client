import api from "@/lib/api";

export async function getCurrentUser() {
    const { data } = await api.get("/users/me", {
        withCredentials: true,
        headers: { "Cache-Control": "no-store" },
    });
    return data;
}

// import { recruiterUser } from "@/mock/data/recruiterProfile";

// export const getCurrentUser = async () => {
//     // Simulate API call with delay
//     await new Promise((resolve) => setTimeout(resolve, 600));

//     // Return mock data
//     return recruiterUser;
// };

// export const updateUserProfile = async (userData) => {
//     // Simulate API call with delay
//     await new Promise((resolve) => setTimeout(resolve, 800));

//     // Return updated mock data
//     return {
//         ...recruiterUser,
//         ...userData,
//     };
// };
