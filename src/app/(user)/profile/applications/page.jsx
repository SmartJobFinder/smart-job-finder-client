"use client";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    useGetApplicationsQuery,
    useAddApplicationMutation,
    useUpdateApplicationMutation,
    useDeleteApplicationMutation,
} from "@/services/applicationService";
import { getApplicationSectionData } from "@/app/(user)/profile/applications/components/applicationData";
import SectionCard from "@/app/(user)/components/SectionCard";
import GenericModal from "@/app/(user)/components/GenericModal";
import { applicationSectionConfigs } from "@/app/(user)/profile/applications/components/applicationSectionConfigs";
import {
    setApplications,
    setFormData,
    selectApplications,
    selectFormData,
} from "@/features/application/applicationSlice";
import LoadingScreen from "@/components/ui/loadingScreen";

export default function ApplicationPage() {
    const dispatch = useDispatch();
    const applications = useSelector(selectApplications);
    const formData = useSelector(selectFormData);
    const {
        data: apiData,
        isLoading,
        error,
        isSuccess,
    } = useGetApplicationsQuery();
    const [addApplication] = useAddApplicationMutation();
    const [updateApplication] = useUpdateApplicationMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef(null);
    const [tempCv, setTempCv] = useState(null);

    useEffect(() => {
        if (isSuccess && apiData) {
            console.log("Applications from API:", apiData);
            // Chỉ lấy application đầu tiên (nếu có) vì chỉ cho phép 1 application
            dispatch(setApplications(apiData.length > 0 ? [apiData[0]] : []));
        }
    }, [apiData, isSuccess, dispatch]);

    const handleAdd = () => {
        dispatch(setFormData({ fullname: "", phoneNumber: "", email: "" }));
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const handleEdit = () => {
        dispatch(setFormData(applications[0]));
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleSave = async (newData) => {
        try {
            const applicationData = {
                ...newData,
                cv: tempCv || formData?.cv || "No CV uploaded",
                status: false,
            };
            if (isEditing && applications[0]?.id) {
                const applicationId = applications[0].id;
                await updateApplication({
                    id: applicationId,
                    data: applicationData,
                });
            } else {
                await addApplication(applicationData);
            }
            setTempCv(null);
            dispatch(setFormData(null));
            setIsModalOpen(false);
            setIsEditing(false);
        } catch (error) {
            console.error("Save error:", error);
            toast.error("Failed to save application");
        }
    };

    const handleCloseModal = () => {
        setTempCv(null);
        dispatch(setFormData(null));
        setIsModalOpen(false);
        setIsEditing(false);
    };

    const handleCvUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.includes("pdf")) {
                toast.error("Please select a PDF file!");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size must not exceed 5MB!");
                return;
            }
            const tempCvUrl = URL.createObjectURL(file);
            setTempCv(tempCvUrl);
            console.log("Temporary CV URL:", tempCvUrl);
        }
    };

    const handleCvClick = () => {
        fileInputRef.current?.click();
    };

    if (isLoading) {
        return (
            <LoadingScreen message="Loading..." />
        );
    }

    if (error) {
        console.error("API error details:", JSON.stringify(error, null, 2));
        return (
            <div className="py-10 text-center text-red-600">
                Error:{" "}
                {error?.data?.message ||
                    error?.error ||
                    error?.message ||
                    "Unable to load data"}
            </div>
        );
    }

    if (!isLoading && !error && !applications) {
        return (
            <div className="py-10 text-center text-gray-600">
                No application data available
            </div>
        );
    }

    const applicationSectionData = getApplicationSectionData(
        applications || []
    );

    return (
        <div className="flex flex-col w-full min-h-screen gap-8 p-4 lg:flex-row lg:items-start lg:p-6 bg-gray-50">
            <div className="flex-1 w-full xl:max-w-[78%]">
                <div className="grid grid-cols-1 gap-6">
                    {applicationSectionData.map((section) => {
                        const sectionData = applications || [];
                        const hasContent = sectionData.length > 0;

                        let content = null;
                        if (hasContent && section.renderComponent) {
                            const Component = section.renderComponent;
                            content = (
                                <Component
                                    data={sectionData}
                                    onEdit={handleEdit}
                                />
                            );
                        }

                        return (
                            <SectionCard
                                key={section.id}
                                id={section.id}
                                title={section.title}
                                description={section.description}
                                imageSrc={section.imageSrc}
                                imageAlt={section.imageAlt}
                                content={content}
                                data={sectionData}
                                onAdd={hasContent ? undefined : handleAdd} // Chỉ hiển thị nút Add nếu chưa có application
                                className="transition-shadow bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md"
                            />
                        );
                    })}
                </div>
                <div className="p-4 mt-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <h3 className="mb-2 font-medium text-gray-700 text-md">
                        CV Upload
                    </h3>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="application/pdf"
                        onChange={handleCvUpload}
                        className="hidden"
                    />
                    <button
                        onClick={handleCvClick}
                        className="px-4 py-2 text-sm text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Upload CV (PDF)
                    </button>
                    {tempCv && (
                        <p className="mt-2 text-sm text-gray-600">
                            Temporary CV:{" "}
                            <a
                                href={tempCv}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                                View CV
                            </a>
                        </p>
                    )}
                </div>
            </div>
            {isModalOpen && (
                <GenericModal
                    sectionId="applications"
                    sectionTitle="Application"
                    config={applicationSectionConfigs.applications}
                    validationSchema={
                        applicationSectionConfigs.applications.validationSchema
                    }
                    initialData={formData || {}}
                    onSave={handleSave}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}