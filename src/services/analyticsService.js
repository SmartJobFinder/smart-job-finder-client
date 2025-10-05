import api from "@/lib/api";

export async function getRecruiterKpi(companyId) {
    const { data } = await api.get(`/analytics/kpi`, {
        params: { companyId },
        withCredentials: true,
    });
    return data;
}

export async function getRecruiterTrend(companyId, from, to) {
    const { data } = await api.get(`/analytics/trend`, {
        params: { companyId, from, to },
        withCredentials: true,
    });
    return data;
} 