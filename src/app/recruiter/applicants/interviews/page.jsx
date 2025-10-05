"use client";

import React, { useEffect, useMemo, useState } from "react";
import { getMyCompany } from "@/services/companyService";
import {
    useGetInterviewsByCompanyQuery,
    useUpdateInterviewStatusMutation,
} from "@/services/interviewService";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import InterviewApplicationModal from "./components/InterviewApplicationModal";
import { useRouter } from "next/navigation";

function formatDT(s) {
    if (!s) return "—";
    const d = new Date(s);
    return d.toLocaleString();
}
function StatusPill({ status }) {
    const base = "px-2.5 py-1 rounded-full text-xs border ";
    switch (status) {
        case "PENDING":
            return (
                <span
                    className={
                        base + "text-amber-700 border-amber-300 bg-amber-50"
                    }
                >
                    PENDING
                </span>
            );
        case "ACCEPTED":
            return (
                <span
                    className={
                        base + "text-blue-700 border-blue-300 bg-blue-50"
                    }
                >
                    ACCEPTED
                </span>
            );
        case "DECLINED":
            return (
                <span
                    className={
                        base + "text-gray-700 border-gray-300 bg-gray-50"
                    }
                >
                    DECLINED
                </span>
            );
        case "COMPLETED":
            return (
                <span
                    className={
                        base +
                        "text-emerald-700 border-emerald-300 bg-emerald-50"
                    }
                >
                    COMPLETED
                </span>
            );
        case "CANCELLED":
            return (
                <span
                    className={base + "text-red-700 border-red-300 bg-red-50"}
                >
                    CANCELLED
                </span>
            );
        default:
            return (
                <span
                    className={
                        base + "text-gray-700 border-gray-300 bg-gray-50"
                    }
                >
                    {status || "—"}
                </span>
            );
    }
}

export default function RecruiterInterviewsPage() {
    const router = useRouter();
    const [companyId, setCompanyId] = useState(null);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(20);

    // fetch companyId
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const res = await getMyCompany();
                const cid =
                    res?.id ||
                    res?.company_id ||
                    res?.companyId ||
                    res?.company?.id;
                if (mounted) setCompanyId(cid || null);
            } catch {
                if (mounted) setCompanyId(null);
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    const canQuery = useMemo(() => !!companyId, [companyId]);
    const { data, isLoading, refetch } = useGetInterviewsByCompanyQuery(
        { companyId, page, size, sort: "scheduledAt,desc" },
        { skip: !canQuery }
    );

    const [updateStatus, { isLoading: updating }] =
        useUpdateInterviewStatusMutation();

    // Application modal
    const [appModal, setAppModal] = useState(null); // { jobId, userId, jobTitle, candidateName, candidateEmail }

    const onChangeStatus = async (row, newStatus) => {
        try {
            await updateStatus({
                interviewId: row.interviewId,
                status: newStatus,
            }).unwrap();
            toast.success(`Interview marked ${newStatus}`);
            refetch();
        } catch (e) {
            toast.error(e?.data?.message || "Failed to update status");
        }
    };

    return (
        <div className="p-6">
            <div className="mb-4">
                <h1 className="text-xl font-semibold">My Interviews</h1>
            </div>

            <div className="bg-white border rounded-xl">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <h3 className="text-lg font-semibold">
                        Total: {data?.totalElements ?? 0}
                    </h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left">
                                    Scheduled
                                </th>
                                <th className="px-6 py-3 text-left">Job</th>
                                <th className="px-6 py-3 text-left">
                                    Candidate
                                </th>
                                <th className="px-6 py-3 text-left">Email</th>
                                <th className="px-6 py-3 text-left">
                                    Duration
                                </th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading || !canQuery ? (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-6 text-center text-gray-500"
                                    >
                                        Loading...
                                    </td>
                                </tr>
                            ) : (
                                (data?.content || []).map((row) => (
                                    <tr
                                        key={row.interviewId}
                                        className="border-t hover:bg-gray-50"
                                    >
                                        <td className="px-6 py-3">
                                            {formatDT(row.scheduledAt)}
                                        </td>
                                        <td className="px-6 py-3">
                                            {row.jobTitle ||
                                                `Job #${row.jobId}`}
                                        </td>
                                        <td className="px-6 py-3">
                                            {row.candidateName ||
                                                `User #${row.candidateId}`}
                                        </td>
                                        <td className="px-6 py-3 break-all">
                                            {row.candidateEmail || "—"}
                                        </td>
                                        <td className="px-6 py-3">
                                            {row.durationMinutes} min
                                        </td>
                                        <td className="px-6 py-3">
                                            <StatusPill status={row.status} />
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex flex-wrap gap-2">
                                                {row.meetingUrl && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            router.push(
                                                                `/recruiter/applicants/interviews/${row.interviewId}/join`
                                                            )
                                                        }
                                                    >
                                                        Open meeting
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        setAppModal({
                                                            jobId: row.jobId,
                                                            userId: row.candidateId,
                                                            jobTitle:
                                                                row.jobTitle,
                                                            candidateName:
                                                                row.candidateName,
                                                            candidateEmail:
                                                                row.candidateEmail,
                                                        })
                                                    }
                                                >
                                                    Application
                                                </Button>

                                                {/* Recruiter can only set COMPLETED or CANCELLED (the BE enforces this) */}
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    disabled={
                                                        updating ||
                                                        row.status ===
                                                            "COMPLETED"
                                                    }
                                                    onClick={() =>
                                                        onChangeStatus(
                                                            row,
                                                            "COMPLETED"
                                                        )
                                                    }
                                                >
                                                    Mark completed
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    disabled={
                                                        updating ||
                                                        row.status ===
                                                            "CANCELLED"
                                                    }
                                                    onClick={() =>
                                                        onChangeStatus(
                                                            row,
                                                            "CANCELLED"
                                                        )
                                                    }
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}

                            {!isLoading &&
                                (data?.content?.length ?? 0) === 0 && (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-6 py-6 text-center text-gray-500"
                                        >
                                            No interviews
                                        </td>
                                    </tr>
                                )}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between px-4 py-3 border-t">
                    <span className="text-sm text-gray-600">
                        Page size:
                        <select
                            className="px-2 py-1 ml-2 border rounded-md"
                            value={size}
                            onChange={(e) => {
                                setSize(parseInt(e.target.value, 10));
                                setPage(0);
                            }}
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                    </span>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page <= 0}
                            onClick={() => setPage(page - 1)}
                        >
                            {"<"}
                        </Button>
                        <div className="flex items-center justify-center text-white bg-blue-600 rounded-md w-9 h-9">
                            {(page ?? 0) + 1}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page + 1 >= (data?.totalPages ?? 1)}
                            onClick={() => setPage(page + 1)}
                        >
                            {">"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Application detail modal (resolved from jobId + userId) */}
            <InterviewApplicationModal
                open={!!appModal}
                onOpenChange={(v) => !v && setAppModal(null)}
                ctx={appModal}
            />
        </div>
    );
}
