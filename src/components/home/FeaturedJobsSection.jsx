"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  MapPin,
  AlertTriangle,
  ShieldAlert,
} from "lucide-react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { selectIsLoggedIn } from "@/features/auth/authSelectors";
import { showLoginPrompt } from "@/features/auth/loginPromptSlice";
import {
  useSaveJobMutation,
  useUnsaveJobMutation,
} from "@/services/savedJobService";
import { useGetJobsWithStatusQuery } from "@/services/jobService";
import { t } from "@/i18n/i18n";

function typeColorClass(type) {
  switch ((type || "").toUpperCase()) {
    case "FULL-TIME":
    case "FULL TIME":
      return "bg-blue-100 text-blue-800";
    case "PART-TIME":
    case "PART TIME":
      return "bg-green-100 text-green-800";
    case "INTERNSHIP":
      return "bg-purple-100 text-purple-800";
    case "CONTRACT":
      return "bg-yellow-100 text-yellow-800";
    case "REMOTE":
      return "bg-teal-100 text-teal-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

function normalizeItem(item) {
  const j = item?.job || {};
  const companyName = j?.company?.company_name || "Unknown Company";
  const logo = j?.company?.avatar || "/logo-placeholder.png";
  const firstWorkType =
    Array.isArray(j?.work_type_names) && j.work_type_names.length > 0
      ? j.work_type_names[0]
      : null;

  return {
    id: j?.id,
    title: j?.title || "Untitled",
    company: companyName,
    logo,
    salary: j?.salaryDisplay || "Negotiable",
    location: j?.location || "—",
    type: firstWorkType || "OTHER",
    typeColor: typeColorClass(firstWorkType),
    boosted: !!j?.boosted,
    boostLevel: Number(j?.boostLevel) || 0,
    isProCompany: !!j?.company?.isProCompany,
    postedDate: j?.date_post || j?.datePost || null,
    // dùng cho lọc hết hạn (backend trả dd-MM-yyyy)
    expiredDate: j?.expired_date || j?.expiredDate || null,
    liked: !!item?.saved,
    applied: !!item?.applied,
    trustLabel: j?.trustLabel || j?.trust_label || null,
    scamScore: j?.scamScore || j?.scam_score || null,
    scamCheckedAt: j?.scamCheckedAt || j?.scam_checked_at || null,
    status: j?.status || j?.job_status || item?.status || null,
  };
}

function sortWithBoost(jobs) {
  return [...jobs].sort((a, b) => {
    // Ưu tiên job từ công ty VIP trước
    if (a.isProCompany !== b.isProCompany) {
      return a.isProCompany ? -1 : 1;
    }

    // Sau đó ưu tiên job mới hơn theo id giảm dần (giống mobile & backend)
    const idA = Number(a.id) || 0;
    const idB = Number(b.id) || 0;
    if (idA !== idB) {
      return idB - idA;
    }

    // Cuối cùng mới ưu tiên job được boost cao hơn (nếu có)
    if (a.boosted !== b.boosted) return a.boosted ? -1 : 1;
    if (a.boostLevel !== b.boostLevel) return b.boostLevel - a.boostLevel;
    return 0;
  });
}

const FeaturedJobsSection = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const [jobs, setJobs] = useState([]);
  const [likedMap, setLikedMap] = useState({});
  const [appliedMap, setAppliedMap] = useState({});
  const [savingMap, setSavingMap] = useState({});

  const { data, isFetching, isLoading, error } = useGetJobsWithStatusQuery({
    page: 0,
    size: 20, // lấy nhiều hơn rồi chọn 6 job mới nhất sau khi lọc
    sort: "id,desc",
  });

  useEffect(() => {
    const items = data?.items ?? [];
    if (!Array.isArray(items) || items.length === 0) {
      setJobs([]);
      setLikedMap({});
      setAppliedMap({});
      return;
    }
    // Chuẩn hóa + lọc jobs theo trạng thái: ẩn draft, cho phép inactive (nhưng vẫn lọc hết hạn)
    const raw = items.map(normalizeItem);
    const today = new Date();
    const normalized = raw.filter(job => {
      const status = (job.status || "").toLowerCase();
      const isDraft = status === "draft";
      if (isDraft) return false;

      // Nếu có expiredDate dạng dd-MM-yyyy thì kiểm tra hết hạn
      if (job.expiredDate) {
        const [d, m, y] = String(job.expiredDate).split("-").map(Number);
        const expiredDate = new Date(y, m - 1, d);
        if (expiredDate < today) return false;
      }

      return true;
    });
    // Chỉ hiển thị 6 job mới/ưu tiên nhất
    const finalList = sortWithBoost(normalized).slice(0, 6);
    setJobs(finalList);

    const lm = {};
    const am = {};
    finalList.forEach(j => {
      lm[j.id] = !!j.liked;
      am[j.id] = !!j.applied;
    });
    setLikedMap(lm);
    setAppliedMap(am);
  }, [data]);

  const [saveJob] = useSaveJobMutation();
  const [unsaveJob] = useUnsaveJobMutation();

  const guardOr = useCallback(
    action => {
      if (!isLoggedIn) {
        dispatch(showLoginPrompt());
        return;
      }
      action?.();
    },
    [dispatch, isLoggedIn]
  );

  const makeHandleSave = useCallback(
    jobId => () =>
      guardOr(async () => {
        try {
          if (!jobId) return;
          if (savingMap[jobId]) return;

          const currentlyLiked = !!likedMap[jobId];
          setSavingMap(m => ({ ...m, [jobId]: true }));

          if (!currentlyLiked) {
            await saveJob({ jobId }).unwrap();
            setLikedMap(m => ({ ...m, [jobId]: true }));
            toast.success("Job saved successfully");
          } else {
            await unsaveJob(jobId).unwrap();
            setLikedMap(m => ({ ...m, [jobId]: false }));
            toast.info("Job unsaved");
          }
        } catch (err) {
          console.error("Toggle save error", err);
          toast.error("Error while saving/unsaving job");
        } finally {
          setSavingMap(m => ({ ...m, [jobId]: false }));
        }
      }),
    [guardOr, likedMap, savingMap, saveJob, unsaveJob]
  );

  const loading = isFetching || isLoading;
  const errMsg =
    error?.data?.message ||
    (typeof error?.data === "string" ? error?.data : null) ||
    (error ? "Failed to load" : null);

  const body = useMemo(() => {
    if (loading) {
      return (
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="p-3 bg-white border border-gray-200 rounded-lg sm:p-4 lg:p-6 animate-pulse"
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="w-40 h-4 bg-gray-200 rounded" />
                <div className="w-5 h-5 bg-gray-200 rounded-full sm:w-6 sm:h-6" />
              </div>
              <div className="w-24 h-4 mb-2 bg-gray-200 rounded sm:h-5" />
              <div className="h-3 mb-3 bg-gray-200 rounded w-36 sm:mb-4" />
              <div className="flex items-center">
                <div className="w-8 h-8 mr-2 bg-gray-200 rounded-full sm:w-10 sm:h-10 sm:mr-3" />
                <div className="flex-1">
                  <div className="w-32 h-4 mb-2 bg-gray-200 rounded" />
                  <div className="w-24 h-3 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (errMsg) {
      return (
        <div className="p-3 text-xs text-red-700 border border-red-200 rounded sm:p-4 lg:p-6 sm:text-sm bg-red-50">
          Failed to load job listings. {errMsg}
        </div>
      );
    }

    if (jobs.length === 0) {
      return (
        <div className="p-3 text-xs text-gray-600 bg-white border border-gray-200 rounded sm:p-4 lg:p-6 sm:text-sm">
          No suitable jobs are currently available.
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map(job => {
          const liked = !!likedMap[job.id];
          const saving = !!savingMap[job.id];
          const applied = !!appliedMap[job.id];
          const handleSave = makeHandleSave(job.id);

          const isHighRisk = job.trustLabel === "SUSPICIOUS";
          const isWarning = job.trustLabel === "WARNING";
          const hasWarning = isHighRisk || isWarning;

          return (
            <div
              key={job.id}
              className="relative p-3 transition-shadow bg-white border border-gray-200 rounded-lg sm:p-4 lg:p-6 hover:shadow-lg overflow-hidden"
            >
              {/* SCAM ALERT STAMP WATERMARK */}
              {hasWarning && (
                <div
                  className="absolute right-12 top-3/4 -translate-y-1/2 pointer-events-none select-none"
                  style={{
                    transform: "translateY(-50%) rotate(-15deg)",
                  }}
                >
                  <div
                    className={`relative ${
                      isHighRisk ? "opacity-50" : "opacity-55"
                    }`}
                  >
                    {/* Triangle Warning Icon */}
                    <AlertTriangle
                      className={`w-24 h-24 sm:w-28 sm:h-28 ${
                        isHighRisk ? "text-red-500" : "text-amber-500"
                      }`}
                      strokeWidth={2}
                    />
                    {/* SCAM ALERT Text */}
                    <div
                      className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-center font-black text-xs sm:text-sm tracking-wider ${
                        isHighRisk ? "text-red-600" : "text-amber-600"
                      }`}
                      style={{
                        textShadow: "0 0 8px rgba(255,255,255,0.8)",
                        letterSpacing: "0.15em",
                      }}
                    >
                      {isHighRisk ? "SCAM ALERT" : "CAUTION"}
                    </div>
                  </div>
                </div>
              )}

              {/* BOOSTED Badge */}
              {job.boosted && (
                <span className="absolute top-2 sm:top-3 right-2 sm:right-3 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200 z-10">
                  BOOSTED
                </span>
              )}

              <div className="flex items-start justify-between mb-3 sm:mb-4 relative z-10">
                <div className="pr-3 sm:pr-4">
                  <h3 className="mb-2 text-sm font-semibold text-gray-900 sm:text-base line-clamp-2">
                    <Link
                      href={`/job-detail/${job.id}`}
                      className="hover:underline"
                    >
                      {job.title}
                    </Link>
                  </h3>

                  <section
                    className={`${job.typeColor} inline-block px-2 py-1 rounded-full text-xs font-semibold`}
                  >
                    {job.type}
                  </section>

                  <p className="mt-2 text-xs text-gray-600 sm:text-sm">
                    Salary: {job.salary}
                  </p>
                </div>

                <div className="relative flex items-center gap-2">
                  {applied && (
                    <span
                      className="inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-full bg-green-50 text-green-700 ring-1 ring-inset ring-green-200 whitespace-nowrap"
                      title="You have applied"
                    >
                      APPLIED
                    </span>
                  )}
                  {liked ? (
                    <BookmarkCheck
                      onClick={handleSave}
                      size={16}
                      className={`cursor-pointer hover:scale-110 transition text-blue-700 fill-blue-700 ${
                        saving ? "opacity-60 pointer-events-none" : ""
                      }`}
                      title="Unsave"
                    />
                  ) : (
                    <Bookmark
                      onClick={handleSave}
                      size={16}
                      className={`cursor-pointer hover:scale-110 transition text-gray-400 ${
                        saving ? "opacity-60 pointer-events-none" : ""
                      }`}
                      title="Save Job"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-center relative z-10">
                <div className="flex items-center justify-center w-6 h-6 mr-2 overflow-hidden bg-white rounded-full shadow-sm sm:w-8 sm:h-8 lg:w-10 lg:h-10 sm:mr-3 ring-1 ring-gray-100">
                  <img
                    src={job.logo}
                    alt={job.company}
                    className="object-contain w-full h-full"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 sm:text-base">
                    {job.company}
                  </p>
                  <div className="flex items-center text-xs text-gray-600 sm:text-sm">
                    <MapPin className="w-3 h-3 mr-1 sm:w-4 sm:h-4" />
                    {job.location &&
                      (job.location
                        .split(", ")
                        .reverse()
                        .find(
                          part =>
                            /^(Thành phố|TP\.?|Tỉnh)\b/i.test(part) ||
                            !/(phường|xã|thị trấn|thị xã|quận|huyện)/i.test(
                              part
                            )
                        ) ||
                        job.location)}
                  </div>
                </div>
              </div>

              {/* SUBTLE BOTTOM BANNER - Only for HIGH RISK */}
              {/* {isHighRisk && (
                                <div className="mt-3 p-2 bg-red-50 border-l-2 border-red-400 rounded relative z-10">
                                    <p className="text-[10px] text-red-800 leading-relaxed">
                                        <strong>High Risk:</strong> Flagged by
                                        AI. Verify carefully before applying.
                                    </p>
                                </div>
                            )} */}

              {/* MINIMAL BANNER for WARNING */}
              {isWarning && (
                <div className="mt-3 p-2 bg-amber-50 border-l-2 border-amber-400 rounded relative z-10">
                  <p className="text-[10px] text-amber-800">
                    Proceed with caution
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }, [jobs, loading, errMsg, likedMap, savingMap, appliedMap, makeHandleSave]);

  return (
    <section className="py-8 sm:py-12 lg:py-16">
      <div className="container px-2 mx-auto sm:px-4">
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl lg:text-3xl">
            {t`Featured job`}
          </h2>
          <Link
            href="/search"
            className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 sm:text-base"
          >
            {t`View All`} <ArrowRight className="w-3 h-3 ml-2 sm:w-4 sm:h-4" />
          </Link>
        </div>
        {body}
      </div>
    </section>
  );
};

export default FeaturedJobsSection;
