import api from "@/lib/api";

const reportService = {
    async create(payload) {
        const { data } = await api.post("/report", payload);
        return data;
    },
};

export default reportService;
