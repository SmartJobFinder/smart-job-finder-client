import * as yup from "yup";

const reportSchema = yup.object().shape({
    reportType: yup.string().required("Vui lòng chọn loại báo cáo"),

    description: yup.string().required("Vui lòng nhập nội dung báo cáo"),

    confirm: yup
        .boolean()
        .oneOf([true], "Bạn cần xác nhận nội dung báo cáo là chính xác"),
});

export default reportSchema;
