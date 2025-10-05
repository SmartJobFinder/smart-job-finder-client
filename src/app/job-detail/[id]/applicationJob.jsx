"use client";
import React, {useEffect, useRef, useState} from "react";
import {Dialog} from "@headlessui/react";
import {Download, Eye, FileText, X} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {toast} from "react-toastify";
import applicationSchema from "@/validation/applicationSchema";
import {
    useCreateApplicationMutation,
    useGetApplicationDetailByJobQuery,
    useReapplyApplicationMutation,
} from "@/services/applicationService";
import {t} from "@/i18n/i18n";

const ApplicationModal = ({
                              onClose,
                              jobTitle = "",
                              jobId,
                              isReapply = false,
                          }) => {
    const fileInputRef = useRef(null);
    const [keepCurrentCV, setKeepCurrentCV] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [createApplication] = useCreateApplicationMutation();
    const [reapplyApplication] = useReapplyApplicationMutation();
    const {data: applicationDetail, isLoading: isLoadingDetail} =
        useGetApplicationDetailByJobQuery(jobId, {skip: !isReapply});

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: {errors, isDirty},
    } = useForm({
        resolver: yupResolver(applicationSchema),
        defaultValues: {
            fullName: "",
            email: "",
            phoneNumber: "",
            cvFile: null,
            coverLetter: "",
        },
        context: {isReapply, keepCurrentCV},
    });

    const selectedFile = watch("cvFile");

    useEffect(() => {
        if (isReapply && applicationDetail) {
            setValue("fullName", applicationDetail.candidateName || "");
            setValue("email", applicationDetail.email || "");
            setValue("phoneNumber", applicationDetail.phoneNumber || "");
            setValue("coverLetter", applicationDetail.description || "");
            setKeepCurrentCV(true);
        }
    }, [isReapply, applicationDetail, setValue]);

    const handleCVSelection = (keepCurrent = false, file = null) => {
        setKeepCurrentCV(keepCurrent);
        setValue("cvFile", file, {
            shouldValidate: !keepCurrent,
            shouldDirty: true,
            shouldTouch: true,
        });
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleChooseFileClick = () => {
        fileInputRef.current?.click();
        handleCVSelection(false);
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] ?? null;
        handleCVSelection(false, file);
    };

    const handleCVAction = (actionType) => {
        const url =
            actionType === "view"
                ? applicationDetail?.cv
                : applicationDetail?.cvDownload || applicationDetail?.cv;
        if (url) window.open(url, "_blank");
    };

    const onSubmit = async (data) => {
        if (!jobId) {
            toast.error("Missing jobId. Please try again.");
            return;
        }

        if (!isReapply && !data.cvFile) {
            toast.warning(t`Please upload your CV.`);
            return;
        }

        if (isReapply && !keepCurrentCV && !data.cvFile) {
            toast.warning(t`Please upload a new CV.`);
            return;
        }

        const formData = new FormData();
        formData.append("jobId", String(jobId));
        formData.append("email", data.email);
        formData.append("phoneNumber", data.phoneNumber);
        formData.append("candidateName", data.fullName);
        if (data.coverLetter) formData.append("description", data.coverLetter);

        if (isReapply) {
            if (keepCurrentCV) {
                formData.append("keepCurrentCV", "true");
            } else if (data.cvFile) {
                formData.append("cvFile", data.cvFile);
            }
        } else {
            formData.append("cvFile", data.cvFile);
        }

        setIsSubmitting(true);
        try {
            const mutation = isReapply ? reapplyApplication : createApplication;
            const result = await mutation(
                isReapply ? {jobId, formData} : formData
            ).unwrap();
            toast.success(
                isReapply
                    ? t`Re-application submitted successfully!`
                    : t`Application submitted successfully!`
            );
            if (isReapply && result.nextReapplyAt) {
                toast.info(
                    `Next re-application available at: ${new Date(
                        result.nextReapplyAt
                    ).toLocaleString()}`
                );
            }
            reset();
            onClose();
        } catch (error) {
            toast.error(
                error?.status === 500
                    ? error?.data?.message
                    : "An error occurred. Please try again later."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isReapply && isLoadingDetail) {
        return (
            <Dialog open={true} onClose={onClose} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true"/>
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-lg p-6 bg-white shadow-xl rounded-xl">
                        <p className="text-center">
                            {t`Loading application details`}...
                        </p>
                    </Dialog.Panel>
                </div>
            </Dialog>
        );
    }

    return (
        <Dialog open={true} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true"/>
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel
                    className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto scrollbar-hide">
                    <div className="flex items-start justify-between">
                        <div>
                            <Dialog.Title className="mb-1 text-lg font-semibold text-blue-600">
                                {isReapply
                                    ? `Re-apply for ${jobTitle}`
                                    : `Apply for ${jobTitle}`}
                            </Dialog.Title>
                            {isReapply && (
                                <p className="text-sm text-gray-600">
                                    {t`Your previous information has been filled in. You can edit if needed.`}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-5 h-5"/>
                        </button>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* CV Section */}
                        <div className="p-4 space-y-4 border border-gray-300 rounded-lg">
                            <div>
                                <p className="mb-1 text-sm font-medium text-gray-700">
                                    CV:
                                </p>
                                {isReapply && applicationDetail?.cv && (
                                    <div className="p-3 mb-3 rounded-lg bg-gray-50">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FileText className="w-4 h-4 text-blue-600"/>
                                            <span className="flex-1 text-sm text-gray-700">
                                                {t`Previously Submitted CV`}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    handleCVAction("view")
                                                }
                                            >
                                                <Eye className="w-3 h-3 mr-1"/>{" "}
                                                {t`View`}
                                            </Button>
                                            {applicationDetail.cvDownload && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleCVAction(
                                                            "download"
                                                        )
                                                    }
                                                >
                                                    <Download className="w-3 h-3 mr-1"/>{" "}
                                                    {t`Download`}
                                                </Button>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                type="button"
                                                variant={
                                                    keepCurrentCV
                                                        ? "default"
                                                        : "outline"
                                                }
                                                size="sm"
                                                onClick={() =>
                                                    handleCVSelection(true)
                                                }
                                            >
                                                {t`Keep Current CV`}
                                            </Button>
                                            <Button
                                                type="button"
                                                variant={
                                                    !keepCurrentCV
                                                        ? "default"
                                                        : "outline"
                                                }
                                                size="sm"
                                                onClick={handleChooseFileClick}
                                                disabled={isSubmitting}
                                            >
                                                {t`Upload New CV`}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                                {(!isReapply || !keepCurrentCV) && (
                                    <>
                                        <Button
                                            variant="outline"
                                            type="button"
                                            onClick={handleChooseFileClick}
                                            disabled={isSubmitting}
                                        >
                                            {selectedFile
                                                ? t`Change CV`
                                                : t`Upload CV`}
                                        </Button>
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        {selectedFile && (
                                            <p className="mt-2 text-sm text-gray-700">
                                                {t`Selected File`}:{" "}
                                                <span className="font-medium">
                                                    {selectedFile.name}
                                                </span>
                                            </p>
                                        )}
                                    </>
                                )}
                                {errors.cvFile && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.cvFile.message}
                                    </p>
                                )}
                            </div>

                            {/* Input Fields */}
                            <div className="space-y-3 text-sm text-gray-800">
                                <div>
                                    <label className="block mb-1 font-medium">
                                        {t`Full Name`}:
                                    </label>
                                    <input
                                        {...register("fullName")}
                                        type="text"
                                        className="w-full p-2 text-sm border rounded-md"
                                        placeholder="Enter your full name"
                                        disabled={isSubmitting}
                                    />
                                    {errors.fullName && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.fullName.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium">
                                        Email:
                                    </label>
                                    <input
                                        {...register("email")}
                                        type="email"
                                        className="w-full p-2 text-sm border rounded-md"
                                        placeholder="Enter your email"
                                        disabled={isSubmitting}
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium">
                                        {t`Phone Number`}:
                                    </label>
                                    <input
                                        {...register("phoneNumber")}
                                        type="tel"
                                        className="w-full p-2 text-sm border rounded-md"
                                        placeholder="Enter your phone number"
                                        disabled={isSubmitting}
                                    />
                                    {errors.phoneNumber && (
                                        <p className="mt-1 text-sm text-red-500">
                                            {errors.phoneNumber.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Cover Letter */}
                        <div>
                            <label className="block mt-3 mb-1 text-sm font-medium text-gray-700">
                                {t`Cover Letter`}:
                            </label>
                            <textarea
                                {...register("coverLetter")}
                                rows={4}
                                placeholder="A well-written cover letter will help you stand out..."
                                className="w-full p-2 text-sm text-gray-800 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                disabled={isSubmitting}
                            />
                            {errors.coverLetter && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.coverLetter.message}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-2 pt-4 border-t">
                            <Button
                                variant="ghost"
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                            >
                                {t`Cancel`}
                            </Button>
                            <Button
                                type="submit"
                                className="text-white bg-blue-600 hover:bg-blue-700"
                                disabled={
                                    isSubmitting || (isReapply && !isDirty)
                                }
                            >
                                {isSubmitting
                                    ? isReapply
                                        ? t`Re-applying` + "..."
                                        : t`Submitting` + "..."
                                    : isReapply
                                        ? t`Re-apply`
                                        : t`Apply`}
                            </Button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default ApplicationModal;