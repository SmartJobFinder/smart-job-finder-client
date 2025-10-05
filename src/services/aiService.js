import api from "@/lib/api";

export async function getJobMatchScore({
    jobId,
    resumeFileId,
    useFileApi = false,
}) {
    const { data } = await api.post("/ai/match", {
        jobId,
        resumeFileId: resumeFileId || null,
        resumeText: null, // để backend tự lấy khi không có file
        useFileApi,
    });
    return data; // { score, reasons }
}

export async function uploadAndGetMatchScore({ jobId, file, useFileApi = false }) {
  const form = new FormData();
  form.append("jobId", jobId);
  form.append("file", file);
  form.append("useFileApi", String(useFileApi));
  const { data } = await api.post("/ai/match/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data; // { score, reasons }
}
