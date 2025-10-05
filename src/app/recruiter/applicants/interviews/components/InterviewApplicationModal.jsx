"use client";

import React, { useEffect, useMemo, useState } from "react";
import ApplicationDetailModal from "@/app/recruiter/applicants/all/components/ApplicationDetailModal"; 
import { useGetApplicationsByJobQuery } from "@/services/applicationService";

export default function InterviewApplicationModal({ open, onOpenChange, ctx }) {
    // ctx = { jobId, userId, jobTitle, candidateName, candidateEmail }
    const jobId = ctx?.jobId;
    const userId = ctx?.userId;

    const { data, isLoading } = useGetApplicationsByJobQuery(
        { jobId, page: 0, size: 100 },
        { skip: !open || !jobId }
    );

    const application = useMemo(() => {
        if (!data?.content) return null;
        return (
            data.content.find((x) => String(x.userId) === String(userId)) ||
            null
        );
    }, [data, userId]);

    // Dự phòng nếu không có application
    const fallbackApp = useMemo(() => {
        if (application) return application;
        if (!ctx) return null;
        return {
            id: undefined,
            userId: ctx.userId,
            jobId: ctx.jobId,
            email: ctx.candidateEmail,
            candidateName: ctx.candidateName,
            status: "—",
            createdAt: undefined,
            phoneNumber: undefined,
            description: "No application found for this candidate/job.",
            cv: undefined,
            cvDownload: undefined,
        };
    }, [application, ctx]);

    return (
        <ApplicationDetailModal
            open={open}
            onOpenChange={onOpenChange}
            application={fallbackApp}
            jobName={
                ctx?.jobTitle || (ctx?.jobId ? `Job #${ctx.jobId}` : undefined)
            }
        />
    );
}
