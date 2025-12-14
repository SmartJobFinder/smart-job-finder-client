"use client";

import React, { useEffect, useMemo, useState } from "react";
import ApplicationDetailModal from "@/app/recruiter/applicants/all/components/ApplicationDetailModal";
import {
    useGetApplicationsByCompanyQuery,
    useGetApplicationsByJobQuery,
} from "@/services/applicationService";

export default function InterviewApplicationModal({ open, onOpenChange, ctx }) {
    // ctx = { companyId, jobId, userId, jobTitle, candidateName, candidateEmail }
    const companyId = ctx?.companyId;
    const jobId = ctx?.jobId;
    const userId = ctx?.userId;

    // Ưu tiên lấy từ by-company để đồng bộ với trang All Applications
    const { data: companyData } = useGetApplicationsByCompanyQuery(
        { companyId, page: 0, size: 100 },
        { skip: !open || !companyId }
    );

    // Fallback: by-job nếu vì lý do nào đó companyData không chứa application
    const { data: jobData } = useGetApplicationsByJobQuery(
        { jobId, page: 0, size: 100 },
        { skip: !open || !jobId }
    );

    const application = useMemo(() => {
        if (!userId) return null;

        const pickLatest = (list) => {
            if (!list || list.length === 0) return null;
            return list.reduce((latest, cur) => {
                const latestTime = latest?.createdAt
                    ? new Date(latest.createdAt).getTime()
                    : 0;
                const curTime = cur?.createdAt
                    ? new Date(cur.createdAt).getTime()
                    : 0;
                return curTime > latestTime ? cur : latest;
            });
        };

        // 1) Dùng dữ liệu từ by-company (giống All Applications)
        if (companyData?.content?.length) {
            const list = companyData.content.filter(
                (x) =>
                    String(x.userId) === String(userId) &&
                    String(x.jobId) === String(jobId)
            );
            const latest = pickLatest(list);
            if (latest) return latest;
        }

        // 2) Fallback: by-job nếu không tìm thấy trong by-company
        if (jobData?.content?.length) {
            const list = jobData.content.filter(
                (x) => String(x.userId) === String(userId)
            );
            const latest = pickLatest(list);
            if (latest) return latest;
        }

        return null;
    }, [companyData, jobData, userId, jobId]);

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
