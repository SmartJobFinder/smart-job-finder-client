import * as yup from "yup";

const applicationSchema = yup.object().shape({
    fullName: yup.string().required("Please enter your full name"),
    email: yup
        .string()
        .required("Please enter your email")
        .email("Invalid email address"),
    phoneNumber: yup
        .string()
        .required("Please enter your phone number")
        .matches(/^[0-9]+$/, "Phone number must contain only digits")
        .min(10, "Phone number must be at least 10 digits")
        .max(11, "Phone number cannot exceed 11 digits"),

    cvFile: yup
        .mixed()
        .when(
            ["$isReapply", "$keepCurrentCV"],
            ([isReapply, keepCurrentCV], schema) => {
                if (isReapply && keepCurrentCV) {
                    return schema.nullable(true).notRequired();
                }
                return schema
                    .required("Please upload your CV")
                    .test("fileType", "Only PDF files are allowed", (value) => {
                        if (!value) return false;
                        return value.type === "application/pdf";
                    });
            }
        ),
});

export default applicationSchema;