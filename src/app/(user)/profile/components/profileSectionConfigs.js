import * as yup from "yup";

export const profileSectionConfigs = {
    aboutMe: {
        fields: [
            {
                key: "text",
                label: "Description",
                type: "textarea",
                placeholder: "Introduce your strengths and years of experience",
            },
        ],
        validationSchema: yup.object().shape({
            text: yup.string().max(500, "Maximum 500 characters").nullable(),
        }),
    },
    personalDetail: {
        fields: [
            {
                key: "fullName",
                label: "Full Name",
                type: "text",
                placeholder: "Your full name",
            },
            {
                key: "title",
                label: "Title",
                type: "text",
                placeholder: "Your job title",
            },
            {
                key: "email",
                label: "Email",
                type: "email",
                placeholder: "Your email address",
            },
            {
                key: "dateOfBirth",
                label: "Date of Birth",
                type: "date",
                placeholder: "DD/MM/YYYY",
            },
            {
                key: "phone",
                label: "Phone",
                type: "tel",
                placeholder: "Your phone number",
            },
            {
                key: "gender",
                label: "Gender",
                type: "select",
                options: ["Male", "Female", "Other"],
            },
            {
                key: "personalLink",
                label: "Personal Link",
                type: "url",
                placeholder: "Your portfolio/website",
            },
            {
                key: "avatar",
                label: "Avatar",
                type: "file",
                accept: "image/*",
            },
        ],
        validationSchema: yup.object().shape({
            fullName: yup
                .string()
                .max(500, "Maximum 500 characters")
                .nullable(),
            title: yup.string().max(500, "Maximum 500 characters").nullable(),
            email: yup.string().email("Invalid email format").nullable(),
            dateOfBirth: yup
                .date()
                .typeError("Invalid date format")
                .min(new Date(1900, 0, 1), "Date must be after 1900")
                .max(new Date(), "Date cannot be in the future")
                .nullable(),
            phone: yup
                .string()
                .matches(
                    /^\d{10,11}$/,
                    "Phone must contain only numbers and be 10-11 digits"
                )
                .nullable(),
            gender: yup
                .string()
                .oneOf(["Male", "Female", "Other"], "Invalid gender")
                .nullable(),
            personalLink: yup.string().url("Invalid URL").nullable(),
            avatar: yup
                .mixed()
                .test("fileType", "Unsupported File Format", (value) => {
                    if (
                        !value ||
                        (value.length !== undefined && value.length === 0)
                    ) {
                        return true;
                    }
                    if (typeof value === "string") {
                        return true;
                    }
                    const file = value[0] || value;
                    return ["image/jpeg", "image/png", "image/jpg"].includes(
                        file.type
                    );
                })
                .test(
                    "fileSize",
                    "File size must be less than 5MB",
                    (value) => {
                        if (
                            !value ||
                            (value.length !== undefined && value.length === 0)
                        ) {
                            return true;
                        }
                        if (typeof value === "string") {
                            return true;
                        }
                        const file = value[0] || value;
                        return file.size <= 5 * 1024 * 1024;
                    }
                )
                .nullable(),
        }),
    },
    candidateSkills: {
        fields: [
            {
                key: "skillName",
                label: "Skill Name",
                type: "text",
                placeholder: "e.g., React",
            },
            {
                key: "levelName",
                label: "Level",
                type: "select",
                options: [
                    "Beginner",
                    "Fresher",
                    "Intermediate",
                    "Advanced",
                    "Expert",
                ],
            },
            {
                key: "categoryName",
                label: "Category",
                type: "text",
                placeholder: "e.g., Software Development",
            },
        ],
        validationSchema: yup.object().shape({
            skillName: yup
                .string()
                .max(500, "Maximum 500 characters")
                .nullable(),
            levelName: yup
                .string()
                .oneOf(
                    [
                        "Beginner",
                        "Fresher",
                        "Intermediate",
                        "Advanced",
                        "Expert",
                    ],
                    "Invalid level"
                )
                .nullable(),
            categoryName: yup
                .string()
                .max(500, "Maximum 500 characters")
                .nullable(),
        }),
    },
    candidateSkills: {
        fields: [],
        validationSchema: yup.object().shape({
            skillId: yup.string().required("Skill is required"),
            levelId: yup.string().required("Level is required"),
        }),
    },
    softSkills: {
        fields: [
            {
                key: "name",
                label: "Soft Skill",
                type: "text",
                placeholder: "Enter soft skill (e.g., Communication)",
            },
            {
                key: "description",
                label: "Description",
                type: "textarea",
                placeholder: "Describe your proficiency in this skill",
            },
            {
                key: "level",
                label: "Proficiency Level",
                type: "select",
                options: [
                    { value: "High", label: "High" },
                    { value: "Medium", label: "Medium" },
                    { value: "Low", label: "Low" },
                ],
            },
        ],
        validationSchema: yup.object({
            name: yup.string().required("Soft skill name is required"),
            description: yup.string().required("Description is required"),
            level: yup.string().required("Proficiency level is required"),
        }),
    },
    education: {
        fields: [
            {
                key: "schoolName",
                label: "School",
                type: "text",
                placeholder: "University/school name",
            },
            {
                key: "degree",
                label: "Degree",
                type: "text",
                placeholder: "e.g., Bachelor",
            },
            {
                key: "majors",
                label: "Major",
                type: "text",
                placeholder: "Your major/field of study",
            },
            {
                key: "startDate",
                label: "Start Date",
                type: "date",
                placeholder: "DD/MM/YYYY",
                required: true,
            },
            {
                key: "endDate",
                label: "End Date",
                type: "date",
                placeholder: "DD/MM/YYYY or leave blank for ongoing",
                required: false,
            },
        ],
        validationSchema: yup.object().shape({
            schoolName: yup
                .string()
                .max(500, "Maximum 500 characters")
                .nullable(),
            degree: yup.string().max(500, "Maximum 500 characters").nullable(),
            majors: yup.string().max(500, "Maximum 500 characters").nullable(),
            startDate: yup
                .date()
                .typeError("Invalid start date format")
                .min(new Date(1900, 0, 1), "Start date must be after 1900")
                .max(new Date(), "Start date cannot be in the future")
                .required("Start date is required"),
            isOngoing: yup.boolean(),
            endDate: yup
                .date()
                .typeError("Invalid end date format")
                .min(yup.ref("startDate"), "End date must be after start date")
                .max(new Date(), "End date cannot be in the future")
                .when("isOngoing", {
                    is: false,
                    then: (schema) =>
                        schema.required("End date is required if not ongoing"),
                    otherwise: (schema) => schema.nullable(),
                }),
        }),
    },
    workExperience: {
        fields: [
            {
                key: "position",
                label: "Position",
                type: "text",
                placeholder: "Job title",
            },
            {
                key: "companyName",
                label: "Company",
                type: "text",
                placeholder: "Company name",
            },
            {
                key: "startDate",
                label: "Start Date",
                type: "date",
                placeholder: "DD/MM/YYYY",
                required: true,
            },
            {
                key: "endDate",
                label: "End Date",
                type: "date",
                placeholder: "DD/MM/YYYY or leave blank for ongoing",
                required: false,
            },
            {
                key: "description",
                label: "Description",
                type: "textarea",
                placeholder: "Job description",
            },
        ],
        validationSchema: yup.object().shape({
            position: yup
                .string()
                .max(500, "Maximum 500 characters")
                .nullable(),
            companyName: yup
                .string()
                .max(500, "Maximum 500 characters")
                .nullable(),
            startDate: yup
                .date()
                .typeError("Invalid start date format")
                .min(new Date(1900, 0, 1), "Start date must be after 1900")
                .max(new Date(), "Start date cannot be in the future")
                .required("Start date is required"),
            isOngoing: yup.boolean(),
            endDate: yup
                .date()
                .typeError("Invalid end date format")
                .min(yup.ref("startDate"), "End date must be after start date")
                .max(new Date(), "End date cannot be in the future")
                .when("isOngoing", {
                    is: false,
                    then: (schema) =>
                        schema.required("End date is required if not ongoing"),
                    otherwise: (schema) => schema.nullable(),
                }),
            description: yup
                .string()
                .max(500, "Maximum 500 characters")
                .nullable(),
        }),
    },
    certificates: {
        fields: [
            {
                key: "cerName",
                label: "Certificate Name",
                type: "text",
                placeholder: "Certificate title",
            },
            {
                key: "issuer",
                label: "Issuer",
                type: "text",
                placeholder: "Issuing organization",
            },
            {
                key: "date",
                label: "Issue Date",
                type: "date",
                placeholder: "DD/MM/YYYY",
            },
            {
                key: "description",
                label: "Description",
                type: "textarea",
                placeholder: "Certificate description",
            },
        ],
        validationSchema: yup.object().shape({
            cerName: yup.string().max(500, "Maximum 500 characters").nullable(),
            issuer: yup.string().max(500, "Maximum 500 characters").nullable(),
            date: yup
                .date()
                .typeError("Invalid date format")
                .min(new Date(1900, 0, 1), "Date must be after 1900")
                .max(new Date(), "Date cannot be in the future")
                .nullable(),
            description: yup
                .string()
                .max(500, "Maximum 500 characters")
                .nullable(),
        }),
    },
    awards: {
        fields: [
            {
                key: "name",
                label: "Award Name",
                type: "text",
                placeholder: "Enter award name (e.g., Best Developer Award)",
            },
            {
                key: "issuer",
                label: "Issuer",
                type: "text",
                placeholder: "Enter the organization that issued the award",
            },
            {
                key: "date",
                label: "Issue Date",
                type: "date",
                placeholder: "DD/MM/YYYY",
            },
            {
                key: "description",
                label: "Description",
                type: "textarea",
                placeholder: "Describe the award or achievement",
            },
        ],
        validationSchema: yup.object({
            name: yup.string().required("Award name is required"),
            issuer: yup.string().max(500, "Maximum 500 characters").nullable(),
            date: yup
                .date()
                .typeError("Invalid date format")
                .min(new Date(1900, 0, 1), "Date must be after 1900")
                .max(new Date(), "Date cannot be in the future")
                .required("Date received is required"),
            description: yup.string().required("Description is required"),
        }),
    },
};
