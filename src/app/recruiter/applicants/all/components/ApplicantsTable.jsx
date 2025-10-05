"use client";

import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import ReportModal from "@/components/ui/report";
import { MessageSquareWarning } from "lucide-react";
import { selectIsLoggedIn } from "@/features/auth/authSelectors";
import { showLoginPrompt } from "@/features/auth/loginPromptSlice";
import { useDispatch, useSelector } from "react-redux";
export default function ApplicantsTable({
    data,
    loading,
    onSeeApplication,
    onDetails,
    jobNameMap,
    page,
    totalPages,
    onPageChange,
    pageSize = 10,
    onPageSizeChange,
    companyId, 
    onCreateInterviewClick,
}) {
    const [openReport, setOpenReport] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const dispatch = useDispatch();

    const renderStatusPill = (status) => {
        const base = "px-2.5 py-1 rounded-full text-xs border ";
        switch (status) {
            case "APPLIED":
                return (
                    <span
                        className={
                            base + "text-blue-700 border-blue-300 bg-blue-50"
                        }
                    >
                        APPLIED
                    </span>
                );
            case "REVIEWED":
                return (
                    <span
                        className={
                            base +
                            "text-emerald-700 border-emerald-300 bg-emerald-50"
                        }
                    >
                        REVIEWED
                    </span>
                );
            case "REJECTED":
                return (
                    <span
                        className={
                            base + "text-red-700 border-red-300 bg-red-50"
                        }
                    >
                        REJECTED
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
    };

    const guardOr = useCallback(
        (action) => {
            if (!isLoggedIn) {
                dispatch(showLoginPrompt());
                setOpenReport(false);
                return;
            }
            action?.();
        },
        [isLoggedIn, dispatch]
    );

    const handleReport = (userId) => {
        guardOr(() => {
            setSelectedUserId(userId);
            setOpenReport(true);
        });
    };

    const handleReportSuccess = () => {
        toast.success("Report submitted successfully");
        setOpenReport(false);
    };
    return (
        <div className="bg-white border rounded-xl">
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <h3 className="text-lg font-semibold">
                    Total Applicants : {data?.totalElements ?? 0}
                </h3>
                <div className="flex items-center gap-2">
                    <input
                        className="w-64 px-3 py-2 border rounded-md"
                        placeholder="Search Applicants"
                    />
                    <Button variant="outline" size="sm">
                        Filter
                    </Button>
                    <Button variant="secondary" size="sm">
                        Pipeline View
                    </Button>
                    <Button variant="default" size="sm">
                        Table View
                    </Button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="w-12 px-6 py-4 text-left align-middle">
                                <input type="checkbox" />
                            </th>
                            <th className="px-6 py-4 text-left align-middle">
                                Full Name
                            </th>
                            <th className="px-6 py-4 text-left align-middle">
                                Hiring Stage
                            </th>
                            <th className="px-6 py-4 text-left align-middle">
                                Applied Date
                            </th>
                            <th className="px-6 py-4 text-left align-middle">
                                Job Name
                            </th>
                            <th className="px-6 py-4 text-left align-middle">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-6 text-center text-gray-500 align-middle"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : (
                            (data?.content || []).map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-t hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 align-middle">
                                        <input type="checkbox" />
                                    </td>
                                    <td className="px-6 py-4 align-middle">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={`https://i.pravatar.cc/40?u=${item.userId}`}
                                                className="w-8 h-8 rounded-full"
                                                alt="avatar"
                                            />
                                            <div className="font-medium">
                                                {item.candidateName ||
                                                    item.email ||
                                                    "Unknown"}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 align-middle">
                                        {renderStatusPill(item.status)}
                                    </td>
                                    <td className="px-6 py-4 align-middle whitespace-nowrap">
                                        {new Date(
                                            item.createdAt
                                        ).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 align-middle">
                                        {jobNameMap?.[item.jobId] ?? "—"}
                                    </td>
                                    <td className="px-6 py-4 align-middle">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    onSeeApplication?.(item)
                                                }
                                            >
                                                See Application
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() =>
                                                    onDetails?.(item)
                                                }
                                            >
                                                Details
                                            </Button>
                                            <Button
                                                variant="default"
                                                size="sm"
                                                onClick={() =>
                                                    onCreateInterviewClick?.({
                                                        companyId,
                                                        jobId: item.jobId,
                                                        // gửi sẵn text hiển thị để tránh chờ fetch map
                                                        jobTitle:
                                                            jobNameMap?.[
                                                                item.jobId
                                                            ] ||
                                                            item.jobTitle ||
                                                            `Job #${item.jobId}`,
                                                        // lưu ý: dùng đúng candidateId của item (đừng lẫn userId nếu API có field riêng)
                                                        candidateId:
                                                            item.candidateId ??
                                                            item.userId,
                                                        candidateName:
                                                            item.candidateName ||
                                                            item.fullName ||
                                                            item.email ||
                                                            "Unknown",
                                                        candidateEmail:
                                                            item.email,
                                                    })
                                                }
                                            >
                                                Create Interview
                                            </Button>
                                            <button
                                                onClick={() =>
                                                    handleReport(item.userId)
                                                }
                                                className="p-2 text-red-600 transition bg-white border rounded hover:bg-red-50"
                                                title="Report Company"
                                            >
                                                <MessageSquareWarning className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        {!loading && (data?.content?.length ?? 0) === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-6 text-center text-gray-500 align-middle"
                                >
                                    No applicants found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span>
                        View
                        <span className="ml-1 mr-1 font-medium">
                            {data?.size ?? pageSize}
                        </span>
                        per page
                    </span>
                    <select
                        className="px-2 py-1 border rounded-md"
                        value={pageSize}
                        onChange={(e) =>
                            onPageSizeChange?.(parseInt(e.target.value, 10))
                        }
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 0}
                        onClick={() => onPageChange?.(page - 1)}
                    >
                        {"<"}
                    </Button>
                    <div className="flex items-center justify-center text-white bg-blue-600 rounded-md w-9 h-9">
                        {(page ?? 0) + 1}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page + 1 >= (totalPages ?? 1)}
                        onClick={() => onPageChange?.(page + 1)}
                    >
                        {">"}
                    </Button>
                </div>
            </div>
            <ReportModal
                open={openReport}
                onClose={() => setOpenReport(false)}
                type={1}
                contentId={selectedUserId}
                onSuccess={handleReportSuccess}
            />
        </div>
    );
}
