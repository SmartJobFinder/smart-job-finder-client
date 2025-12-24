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

// import { recruiterKpi, recruiterTrend } from "@/mock/data/recruiterDashboard";

// export const getRecruiterKpi = async (companyId) => {
//     // Return mock data
//     return recruiterKpi;
// };

// export const getRecruiterTrend = async (companyId, fromDate, toDate) => {
//     // Return mock data
//     return recruiterTrend;
// };
