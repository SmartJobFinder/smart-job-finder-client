import * as yup from "yup";
import { t } from "@/i18n/i18n";

const reportSchema = yup.object().shape({
    reportType: yup.string().required(t`Vui lòng chọn loại báo cáo`),

    description: yup.string().required(t`Vui lòng nhập nội dung báo cáo`),

    confirm: yup
        .boolean()
        .oneOf([true], t`Bạn cần xác nhận nội dung báo cáo là chính xác`),
});

export default reportSchema;
