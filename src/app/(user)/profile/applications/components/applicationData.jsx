import ApplicationSection from "./sectionRendered/ApplicationSection";
import Applications from "@/assets/images/applications.png"

export const getApplicationSectionData = (applicationData) => [
    {
        id: "applications",
        title: "Applications",
        description: "Manage your job applications",
        imageSrc: Applications,
        imageAlt: "Applications",
        renderComponent: ApplicationSection,
        content:
            applicationData && applicationData.length > 0 ? (
                <ApplicationSection data={applicationData} />
            ) : null,
    },
];
