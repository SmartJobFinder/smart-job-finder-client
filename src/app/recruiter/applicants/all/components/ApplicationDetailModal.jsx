"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Mail,
    Phone,
    Calendar,
    FileText,
    Building2,
    User2,
} from "lucide-react";
import { useUpdateApplicationStatusMutation } from "@/services/applicationService";
import { toast } from "react-toastify";
import Image from "next/image";
import api from "@/lib/api";
import { getCandidateProfileByUserId } from "@/services/candidateService";
import { t } from "@/i18n/i18n";

export default function ApplicationDetailModal({
    open,
    onOpenChange,
    application,
    jobName,
}) {
    const [candidateProfile, setCandidateProfile] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [imageError, setImageError] = useState(false);

    const appliedAt = useMemo(
        () =>
            application ? new Date(application.createdAt).toLocaleString() : "",
        [application]
    );

    const [selectedStatus, setSelectedStatus] = useState("APPLIED");
    const [currentStatus, setCurrentStatus] = useState("APPLIED");
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [updateStatus, { isLoading: updating }] =
        useUpdateApplicationStatusMutation();

    // Fetch candidate profile khi có userId
    useEffect(() => {
        const fetchCandidateProfile = async () => {
            if (!application?.userId) return;

            setLoadingProfile(true);
            setImageError(false);

            try {
                const profile = await getCandidateProfileByUserId(
                    application.userId
                );
                setCandidateProfile(profile);
            } catch (error) {
                console.error("Failed to fetch candidate profile:", error);
                setImageError(true);
            } finally {
                setLoadingProfile(false);
            }
        };

        fetchCandidateProfile();
    }, [application?.userId]);

    useEffect(() => {
        const s = application?.status || "APPLIED";
        setSelectedStatus(s);
        setCurrentStatus(s);
    }, [application]);

    const handleConfirm = async () => {
        if (!application?.id || !selectedStatus) return;
        try {
            await updateStatus({
                applicationId: application.id,
                status: selectedStatus,
            }).unwrap();
            setCurrentStatus(selectedStatus);
            setConfirmOpen(false);
            toast.success("Update status successfully");
        } catch (e) {
            console.error("Update status failed", e);
            toast.error("Update status failed");
        }
    };

    const handleImageError = () => {
        setImageError(true);
    };

    if (!application) return null;

    // Lấy avatar từ profile hoặc fallback
    const displayAvatar = candidateProfile?.avatar;
    const displayName =
        candidateProfile?.fullName ||
        application.candidateName ||
        application.email ||
        "Candidate";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl p-0 overflow-hidden">
                {/* Hidden title for accessibility */}
                <DialogTitle className="sr-only">
                    Application Detail
                </DialogTitle>
                {/* Header modern */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5 text-white">
                    <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-full ring-2 ring-white/30 overflow-hidden bg-white/10">
                            {loadingProfile ? (
                                <div className="flex items-center justify-center w-full h-full">
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : !imageError && displayAvatar ? (
                                <Image
                                    src={displayAvatar}
                                    alt={`${displayName} avatar`}
                                    fill
                                    className="object-cover"
                                    onError={handleImageError}
                                    unoptimized
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full bg-white/20">
                                    <User2
                                        size={24}
                                        className="text-white/60"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h3 className="text-xl font-semibold truncate">
                                    {displayName}
                                </h3>
                                <span className="px-2.5 py-1 rounded-full text-xs bg-white/15 border border-white/25">
                                    {currentStatus}
                                </span>
                            </div>
                            <p className="text-white/80 mt-0.5 flex items-center gap-2">
                                <Building2 size={16} />
                                <span className="truncate">
                                    {jobName || `Job #${application.jobId}`}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    {/* Info grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-lg border p-4 bg-gray-50">
                            <div className="flex items-center gap-2 text-gray-600 mb-2">
                                <User2 size={16} />
                                <span className="text-xs uppercase tracking-wider">
                                    {t`Full Name`}
                                </span>
                            </div>
                            <div className="font-medium">{displayName}</div>
                        </div>
                        <div className="rounded-lg border p-4 bg-gray-50">
                            <div className="flex items-center gap-2 text-gray-600 mb-2">
                                <Calendar size={16} />
                                <span className="text-xs uppercase tracking-wider">
                                    {t`Applied`}
                                </span>
                            </div>
                            <div className="font-medium">{appliedAt}</div>
                        </div>
                        <div className="rounded-lg border p-4 bg-gray-50">
                            <div className="flex items-center gap-2 text-gray-600 mb-2">
                                <Mail size={16} />
                                <span className="text-xs uppercase tracking-wider">
                                    Email
                                </span>
                            </div>
                            <div className="font-medium break-all">
                                {candidateProfile?.email ||
                                    application.email ||
                                    "—"}
                            </div>
                        </div>
                        <div className="rounded-lg border p-4 bg-gray-50">
                            <div className="flex items-center gap-2 text-gray-600 mb-2">
                                <Phone size={16} />
                                <span className="text-xs uppercase tracking-wider">
                                    {t`Phone Number`}
                                </span>
                            </div>
                            <div className="font-medium">
                                {candidateProfile?.phone ||
                                    application.phoneNumber ||
                                    "—"}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="rounded-lg border p-4">
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                            <FileText size={16} />
                            <span className="text-xs uppercase tracking-wider">
                                {t`Candidate Description`}
                            </span>
                        </div>
                        <div className="whitespace-pre-wrap leading-relaxed">
                            {application.description || "Không có mô tả"}
                        </div>
                    </div>

                    {/* Thông tin bổ sung từ profile */}
                    {candidateProfile && (
                        <div className="rounded-lg border p-4 bg-blue-50">
                            <div className="flex items-center gap-2 text-blue-700 mb-2">
                                <User2 size={16} />
                                <span className="text-xs uppercase tracking-wider font-semibold">
                                    {t`Profile Information`}
                                </span>
                            </div>
                            <div className="space-y-2 text-sm">
                                {candidateProfile.title && (
                                    <div>
                                        <span className="font-medium">
                                            {t`Title`}:{" "}
                                        </span>
                                        <span>{candidateProfile.title}</span>
                                    </div>
                                )}
                                {candidateProfile.aboutMe && (
                                    <div>
                                        <span className="font-medium">
                                            {t`About`}:{" "}
                                        </span>
                                        <span>{candidateProfile.aboutMe}</span>
                                    </div>
                                )}
                                {candidateProfile.personalLink && (
                                    <div>
                                        <span className="font-medium">
                                            {t`Website`}:{" "}
                                        </span>
                                        <a
                                            href={candidateProfile.personalLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {candidateProfile.personalLink}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Update status */}
                    <div className="rounded-lg border p-4 bg-gray-50">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <label className="text-sm font-medium text-gray-700">
                                {t`Update Status`}
                            </label>
                            <div className="flex items-center gap-3">
                                <select
                                    className="px-3 py-2 border rounded-md text-sm"
                                    value={selectedStatus}
                                    onChange={(e) =>
                                        setSelectedStatus(e.target.value)
                                    }
                                >
                                    <option value="REVIEWED">{t`REVIEWED`}</option>
                                    <option value="REJECTED">{t`REJECTED`}</option>
                                </select>
                                <Button
                                    variant="secondary"
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                    disabled={
                                        updating ||
                                        selectedStatus === currentStatus
                                    }
                                    onClick={() => setConfirmOpen(true)}
                                >
                                    {t`Update`}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                        {application.cv && (
                            <Button
                                variant="outline"
                                className="border-blue-200 text-blue-700 hover:bg-blue-50"
                                onClick={() =>
                                    window.open(application.cv, "_blank")
                                }
                            >
                                {t`View`} CV
                            </Button>
                        )}
                        {application.cvDownload && (
                            <Button
                                variant="secondary"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() =>
                                    window.open(
                                        application.cvDownload,
                                        "_blank"
                                    )
                                }
                            >
                                {t`Download`} CV
                            </Button>
                        )}
                        <div className="ml-auto">
                            <Button onClick={() => onOpenChange?.(false)}>
                                {t`Close`}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>

            {/* Confirm dialog */}
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm status update</DialogTitle>
                        <DialogDescription>
                            Set application status to <b>{selectedStatus}</b>?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setConfirmOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={handleConfirm}
                            disabled={updating}
                        >
                            {updating ? "Updating..." : "Confirm"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Dialog>
    );
}
