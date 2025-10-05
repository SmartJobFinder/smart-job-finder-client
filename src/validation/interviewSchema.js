import * as yup from "yup";

export const interviewSchema = yup.object({
    jobId: yup
        .number()
        .typeError("jobId không hợp lệ")
        .required("jobId là bắt buộc"),
    companyId: yup
        .number()
        .typeError("companyId không hợp lệ")
        .required("companyId là bắt buộc"),
    candidateId: yup
        .number()
        .typeError("candidateId không hợp lệ")
        .required("candidateId là bắt buộc"),
    // server nhận LocalDateTime -> FE dùng input datetime-local -> gửi ISO (yyyy-MM-ddTHH:mm)
    scheduledAt: yup
        .string()
        .required("Thời gian phỏng vấn là bắt buộc")
        .test("future", "Thời gian phải ở tương lai", (v) => {
            if (!v) return false;
            const d = new Date(v);
            return d.getTime() > Date.now();
        }),
    durationMinutes: yup
        .number()
        .typeError("Thời lượng không hợp lệ")
        .min(15, "Tối thiểu 15 phút")
        .required("Thời lượng là bắt buộc"),
});
