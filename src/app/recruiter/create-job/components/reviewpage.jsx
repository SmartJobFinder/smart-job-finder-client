"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

// Import custom components
import JobReviewHeader from "@/app/recruiter/create-job/components/JobReviewHeader";
import JobDetailCard from "@/app/recruiter/create-job/components/JobDetailCard";
import JobSidebar from "@/app/recruiter/create-job/components/JobSidebar";
import PublishingSettings from "@/app/recruiter/create-job/components/PublishingSettings";
import SuccessDialog from "@/app/recruiter/create-job/components/SuccessDialog";

export default function JobReviewPage({
    formData,
    onEdit,
    onSubmit,
    isLoading,
    setParentFormData,
    setParentIsLoading,
    setParentJobs,
    parentJobs,
}) {
    const [reviewData, setReviewData] = useState({
        datePost: formData.datePost || "",
        expiredDate: formData.expiredDate || "",
    });
    const [datePostError, setDatePostError] = useState("");
    const [expiredDateError, setExpiredDateError] = useState("");
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const formatDateForAPI = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const getCombinedDescription = () => {
        return [formData.jobDescription, formData.niceToHaves]
            .filter(Boolean)
            .join("\n\n");
    };

    const validateDates = () => {
        let isValid = true;
        let newDatePostError = "";
        let newExpiredDateError = "";

        if (!reviewData.datePost) {
            newDatePostError = "Please select a date posted";
            isValid = false;
        }

        if (!reviewData.expiredDate) {
            newExpiredDateError = "Please select an expired date";
            isValid = false;
        }

        if (reviewData.datePost && reviewData.expiredDate) {
            const datePost = new Date(reviewData.datePost);
            const expiredDate = new Date(reviewData.expiredDate);

            if (expiredDate <= datePost) {
                newExpiredDateError =
                    "Expired date must be after the date posted";
                isValid = false;
            }
        }

        setDatePostError(newDatePostError);
        setExpiredDateError(newExpiredDateError);

        return isValid;
    };

    const validateForm = () => {
        const errors = [];

        if (!formData.jobTitle?.trim()) {
            errors.push("Job title");
        }
        if (!formData.categories || formData.categories.length === 0) {
            errors.push("Category");
        }
        if (!formData.city) {
            errors.push("City");
        }
        if (!formData.address?.trim()) {
            errors.push("Address");
        }
        if (!formData.workType?.length) {
            errors.push("Job type");
        }
        if (!formData.jobDescription?.trim()) {
            errors.push("Job description");
        }
        if (!formData.requirements?.trim()) {
            errors.push("Requirements");
        }

        return errors;
    };

    const handleSubmit = async () => {
        const dateErrors = validateDates();
        const formErrors = validateForm();

        if (!dateErrors || formErrors.length > 0) {
            if (formErrors.length > 0) {
                toast.error(
                    `Please fill in all the fields: ${formErrors.join(", ")}`,
                    { position: "top-center" }
                );
            } else if (!dateErrors) {
                toast.error("Please fix the date fields", {
                    position: "top-center",
                });
            }
            return;
        }

        // Update parent form data with review data
        if (setParentFormData) {
            setParentFormData((prev) => ({
                ...prev,
                datePost: reviewData.datePost,
                expiredDate: reviewData.expiredDate,
            }));
        }

        // Call the parent submit function
        if (onSubmit) {
            try {
                const result = await onSubmit();
                // Only show success dialog if the submission was actually successful
                if (result !== false) {
                    setShowSuccessDialog(true);
                }
            } catch (error) {
                console.error("Error in review submit:", error);
            }
        }
    };

    const handleDatePostChange = (e) => {
        setReviewData((prev) => ({ ...prev, datePost: e.target.value }));
        if (datePostError) setDatePostError("");
        if (
            expiredDateError &&
            e.target.value &&
            reviewData.expiredDate &&
            new Date(reviewData.expiredDate) > new Date(e.target.value)
        ) {
            setExpiredDateError("");
        }
    };

    const handleExpiredDateChange = (e) => {
        setReviewData((prev) => ({ ...prev, expiredDate: e.target.value }));
        if (expiredDateError) setExpiredDateError("");
        if (
            datePostError &&
            e.target.value &&
            reviewData.datePost &&
            new Date(e.target.value) > new Date(reviewData.datePost)
        ) {
            setDatePostError("");
        }
    };

    const handleSuccess = () => {
        setShowSuccessDialog(false);
        onEdit(); // Go back to form
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Preview Job
                    </h1>
                    <p className="text-gray-600">
                        Check the information before posting
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <JobReviewHeader
                            title={formData.jobTitle}
                            company="Your company"
                            location={formData.address}
                            workType={formData.workType}
                            salaryMin={formData.salaryMin}
                            salaryMax={formData.salaryMax}
                            salaryType={formData.salaryType}
                        />

                        <JobDetailCard
                            description={getCombinedDescription()}
                            requirements={formData.requirements}
                            benefits={formData.benefits}
                            skills={formData.skill}
                            levels={formData.level}
                        />
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <JobSidebar
                            categories={formData.categories}
                            skills={formData.skill}
                            levels={formData.level}
                            workTypes={formData.workType}
                        />

                        <PublishingSettings
                            datePost={reviewData.datePost}
                            expiredDate={reviewData.expiredDate}
                            onDatePostChange={handleDatePostChange}
                            onExpiredDateChange={handleExpiredDateChange}
                            datePostError={datePostError}
                            expiredDateError={expiredDateError}
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between mt-8">
                    <Button
                        variant="outline"
                        onClick={onEdit}
                        disabled={isLoading}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to edit
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {isLoading ? "Creating..." : "Create job"}
                    </Button>
                </div>
            </div>

            {/* Success Dialog */}
            {showSuccessDialog && (
                <SuccessDialog
                    onClose={handleSuccess}
                    title="Job created successfully!"
                    message="Your job has been created and will be approved within 24 hours."
                />
            )}
        </div>
    );
}