import api from "@/lib/api";

export async function getCurrentUser() {
    const { data } = await api.get("/users/me", {
        withCredentials: true,
        headers: { "Cache-Control": "no-store" },
    });
    return data;
} 