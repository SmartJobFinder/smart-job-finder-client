import api from "@/lib/api";

export async function listSavedCvs() {
  const { data } = await api.get("/save-cv/by-user");
  return data;
}

export async function getSavedCvDetail(id) {
  const { data } = await api.get(`/save-cv/${id}`);
  return data;
}

export async function createSavedCv(payload) {
  const { data } = await api.post("/save-cv", payload);
  return data;
}

export async function updateSavedCv(id, payload) {
  const { data } = await api.put(`/save-cv/${id}`, payload);
  return data;
}

export async function deleteSavedCv(id) {
  await api.delete(`/save-cv/${id}`);
}
