"use client";

import React, { useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ReportModal from "@/components/ui/report";
import { MessageSquareWarning, User2 } from "lucide-react";
import { selectIsLoggedIn } from "@/features/auth/authSelectors";
import { showLoginPrompt } from "@/features/auth/loginPromptSlice";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { toast } from "react-toastify";
import { batchGetCandidateProfiles } from "@/services/candidateService";
import { t } from "@/i18n/i18n";

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

  // Cache profiles để tránh fetch lại nhiều lần
  const [profileCache, setProfileCache] = useState(new Map());

  // Fetch profiles cho tất cả applicants
  useEffect(() => {
    const fetchProfiles = async () => {
      if (!data?.content || data.content.length === 0) return;

      // Lọc ra những userId chưa có trong cache
      const userIds = data.content
        .map(item => item.userId)
        .filter(id => id && !profileCache.has(id));

      if (userIds.length === 0) return;

      try {
        const profiles = await batchGetCandidateProfiles(userIds);
        setProfileCache(prevCache => new Map([...prevCache, ...profiles]));
      } catch (error) {
        console.error("Failed to fetch candidate profiles:", error);
      }
    };

    fetchProfiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.content]);

  const renderStatusPill = status => {
    const base = "px-2.5 py-1 rounded-full text-xs border ";
    switch (status) {
      case "APPLIED":
        return (
          <span className={base + "text-blue-700 border-blue-300 bg-blue-50"}>
            APPLIED
          </span>
        );
      case "REVIEWED":
        return (
          <span
            className={
              base + "text-emerald-700 border-emerald-300 bg-emerald-50"
            }
          >
            REVIEWED
          </span>
        );
      case "REJECTED":
        return (
          <span className={base + "text-red-700 border-red-300 bg-red-50"}>
            REJECTED
          </span>
        );
      default:
        return (
          <span className={base + "text-gray-700 border-gray-300 bg-gray-50"}>
            {status || "—"}
          </span>
        );
    }
  };

  const guardOr = useCallback(
    action => {
      if (!isLoggedIn) {
        dispatch(showLoginPrompt());
        setOpenReport(false);
        return;
      }
      action?.();
    },
    [isLoggedIn, dispatch]
  );

  const handleReport = userId => {
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
          {t`Total Applicants`} : {data?.totalElements ?? 0}
        </h3>
        <div className="flex items-center gap-2">
          <input
            className="w-64 px-3 py-2 border rounded-md"
            placeholder={t`Search Applicants`}
          />
          <Button variant="outline" size="sm">
            {t`Filters`}
          </Button>
          <Button variant="secondary" size="sm">
            {t`Pipeline View`}
          </Button>
          <Button variant="default" size="sm">
            {t`Table View`}
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
                {t`Full Name`}
              </th>
              <th className="px-6 py-4 text-left align-middle">
                {t`Hiring Stage`}
              </th>
              <th className="px-6 py-4 text-left align-middle">
                {t`Applied Date`}
              </th>
              <th className="px-6 py-4 text-left align-middle">
                {t`Job Name`}
              </th>
              <th className="px-6 py-4 text-left align-middle">{t`Action`}</th>
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
              (data?.content || []).map(item => {
                const profile = profileCache.get(item.userId);
                const avatar = profile?.avatar;

                return (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 align-middle">
                      <input type="checkbox" />
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                          {avatar ? (
                            <Image
                              src={avatar}
                              alt={`${
                                item.candidateName || "Candidate"
                              } avatar`}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full bg-gray-200">
                              <User2 size={16} className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="font-medium">
                          {profile?.fullName ||
                            item.candidateName ||
                            item.email ||
                            "Unknown"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      {renderStatusPill(item.status)}
                    </td>
                    <td className="px-6 py-4 align-middle whitespace-nowrap">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 align-middle">
                      {jobNameMap?.[item.jobId] ?? "—"}
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onSeeApplication?.(item)}
                        >
                          {t`See Application`}
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onDetails?.(item)}
                        >
                          {t`Details`}
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() =>
                            onCreateInterviewClick?.({
                              companyId,
                              jobId: item.jobId,
                              jobTitle:
                                jobNameMap?.[item.jobId] ||
                                item.jobTitle ||
                                `Job #${item.jobId}`,
                              candidateId: item.candidateId ?? item.userId,
                              candidateName:
                                profile?.fullName ||
                                item.candidateName ||
                                item.fullName ||
                                item.email ||
                                "Unknown",
                              candidateEmail: profile?.email || item.email,
                            })
                          }
                        >
                          {t`Create Interview`}
                        </Button>
                        <button
                          onClick={() => handleReport(item.userId)}
                          className="p-2 text-red-600 transition bg-white border rounded hover:bg-red-50"
                          title={t`Report Company`}
                        >
                          <MessageSquareWarning className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
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
            {t`View`}
            <span className="ml-1 mr-1 font-medium">
              {data?.size ?? pageSize}
            </span>
            {t`per page`}
          </span>
          <select
            className="px-2 py-1 border rounded-md"
            value={pageSize}
            onChange={e => onPageSizeChange?.(parseInt(e.target.value, 10))}
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
