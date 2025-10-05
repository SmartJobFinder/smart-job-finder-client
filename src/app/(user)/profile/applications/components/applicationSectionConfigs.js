import * as yup from "yup";

export const applicationSectionConfigs = {
    applications: {
        fields: [
            {
                key: "fullname",
                label: "Full Name",
                type: "text",
                placeholder: "Your full name",
            },
            {
                key: "phoneNumber",
                label: "Phone Number",
                type: "tel",
                placeholder: "Your phone number",
            },
            {
                key: "email",
                label: "Email",
                type: "email",
                placeholder: "Your email address",
            },
        ],
        validationSchema: yup.object().shape({
            fullname: yup
                .string()
                .required("Full name is required")
                .max(100, "Maximum 100 characters"),
            phoneNumber: yup
                .string()
                .matches(
                    /^\d{10,11}$/,
                    "Phone must contain only numbers and be 10-11 digits"
                )
                .required("Phone number is required"),
            email: yup
                .string()
                .email("Invalid email format")
                .required("Email is required"),
        }),
    },
};
