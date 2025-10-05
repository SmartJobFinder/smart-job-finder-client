import * as yup from "yup";

export const candidateRegisterSchema = yup.object().shape({
    fullName: yup
        .string()
        .required("Full name is required")
        .min(2, "Full name must be at least 2 characters")
        .max(50, "Full name cannot exceed 50 characters"),
    email: yup
        .string()
        .required("Email is required")
        .email("Invalid email address"),
    phone: yup
        .string()
        .required("Phone number is required")
        .matches(/^[0-9]+$/, "Phone number must only contain digits")
        .min(10, "Phone number must have at least 10 digits")
        .max(11, "Phone number cannot exceed 11 digits"),
    password: yup
        .string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        ),
    confirmPassword: yup
        .string()
        .required("Confirm password is required")
        .oneOf([yup.ref("password")], "Passwords do not match"),
    terms: yup.boolean().oneOf([true], "You must accept the terms of use"),
});

// Schema for recruiter registration
export const recruiterRegisterSchema = yup.object().shape({
    fullName: yup
        .string()
        .required("Full name is required")
        .min(2, "Full name must be at least 2 characters")
        .max(50, "Full name cannot exceed 50 characters"),
    email: yup
        .string()
        .required("Email is required")
        .email("Invalid email address"),
    phone: yup
        .string()
        .required("Phone number is required")
        .matches(/^[0-9]+$/, "Phone number must only contain digits")
        .min(10, "Phone number must have at least 10 digits")
        .max(11, "Phone number cannot exceed 11 digits"),
    password: yup
        .string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`])/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        ),
    confirmPassword: yup
        .string()
        .required("Confirm password is required")
        .oneOf([yup.ref("password")], "Passwords do not match"),
    terms: yup.boolean().oneOf([true], "You must accept the terms of use"),
});