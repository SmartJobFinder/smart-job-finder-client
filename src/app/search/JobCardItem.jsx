"use client";

import {
    Bookmark,
    BookmarkCheck,
    Building2,
    CalendarDays,
    Clock,
    Crown,
    Eye,
    MapPin,
    AlertTriangle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
    useSaveJobMutation,
    useUnsaveJobMutation,
} from "@/services/savedJobService";
import { useDispatch, useSelector } from "react-redux";
import { showLoginPrompt } from "@/features/auth/loginPromptSlice";
import ApplicationBadge from "@/components/ui/ApplicationBadge";
import { selectIsLoggedIn } from "@/features/auth/authSelectors";
import Image from "next/image";
import { t } from "@/i18n/i18n";

export default function JobCardItem({ job, onToast, isGrid = false }) {
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const router = useRouter();
    const dispatch = useDispatch();

    const [liked, setLiked] = useState(!!job?.liked);
    const applied = !!job?.applied;

    // ✅ Scam detection flags
    const isHighRisk = job?.trustLabel === "SUSPICIOUS";
    const isWarning = job?.trustLabel === "WARNING";
    const hasWarning = isHighRisk || isWarning;

    useEffect(() => {
        setLiked(!!job?.liked);
    }, [job?.id, job?.liked]);

    // ✅ DEBUG LOG
    useEffect(() => {
        console.log("JobCard Debug:", {
            id: job?.id,
            title: job?.title,
            trustLabel: job?.trustLabel,
            isHighRisk,
            hasWarning,
        });
    }, [job]);

    const [saveJob] = useSaveJobMutation();
    const [unsaveJob] = useUnsaveJobMutation();
    const [saving, setSaving] = useState(false);

    function parseCustomDate(dateString) {
        if (!dateString) return null;
        const [day, month, year] = dateString.split("-").map(Number);
        return new Date(year, month - 1, day);
    }

    function getPostedAgo(dateString) {
        if (!dateString) return null;
        const postDate = parseCustomDate(dateString);
        if (!postDate || isNaN(postDate)) return null;

        const now = new Date();
        const diffTime = now - postDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 1) return "Posted today";
        if (diffDays === 1) return "Posted 1 day ago";
        return `Posted ${diffDays} days ago`;
    }

    function getExpiredIn(dateString) {
        if (!dateString) return null;
        const expDate = parseCustomDate(dateString);
        if (!expDate || isNaN(expDate)) return null;

        const now = new Date();
        const diffTime = expDate - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return "Expired";
        if (diffDays === 0) return "Expires today";
        if (diffDays === 1) return "Expires in 1 day";
        return `Expires in ${diffDays} days`;
    }

    const guardOr = useCallback(
        (action) => {
            if (!isLoggedIn) {
                dispatch(showLoginPrompt());
                return;
            }
            action?.();
        },
        [dispatch, isLoggedIn]
    );

    const toggleSave = useCallback(
        (e) => {
            e.stopPropagation();
            if (!job?.id || saving) return;

            guardOr(async () => {
                try {
                    setSaving(true);
                    if (!liked) {
                        setLiked(true);
                        await saveJob({ jobId: job.id }).unwrap();
                        onToast?.(t`Job saved successfully`, "success");
                    } else {
                        setLiked(false);
                        await unsaveJob(job.id).unwrap();
                        onToast?.("Job removed from saved list", "neutral");
                    }
                } catch (err) {
                    setLiked((prev) => !prev);
                    console.error("Toggle save error", err);
                    onToast?.("Something went wrong", "error");
                } finally {
                    setSaving(false);
                }
            });
        },
        [job?.id, liked, saving, saveJob, unsaveJob, onToast, guardOr]
    );

    const companyName = job?.company?.company_name || "Unknown Company";
    const avatar = job?.company?.avatar;
    const isValidUrl = (str) => {
        if (!str || typeof str !== "string" || str.trim() === "") return false;
        return (
            str.startsWith("http://") ||
            str.startsWith("https://") ||
            str.startsWith("/")
        );
    };
    const imageSrc = isValidUrl(avatar) ? avatar : undefined;
    const isProCompany = !!job?.company?.isProCompany;

    return (
        <div
            className={`${
                isGrid
                    ? "flex flex-col w-full p-4 bg-white border rounded-xl shadow-sm hover:shadow-md"
                    : "flex flex-col md:flex-row items-stretch w-full mb-4 overflow-hidden bg-white border shadow-sm rounded-xl hover:shadow-md"
            } ${
                isProCompany
                    ? "border-blue-500 shadow-blue-200/60"
                    : isHighRisk
                    ? "border-red-300"
                    : isWarning
                    ? "border-amber-300"
                    : "border-gray-200"
            } relative overflow-hidden`}
        >
            {hasWarning && (
                <div
                    className="absolute right-55 top-1/2 pointer-events-none select-none z-0"
                    style={{
                        transform: "translateY(-50%) rotate(-18deg)",
                    }}
                >
                    <div
                        className={`relative ${
                            isHighRisk ? "opacity-[0.35]" : "opacity-[0.32]"
                        }`}
                    >
                        <AlertTriangle
                            className={`w-32 h-32 ${
                                isHighRisk ? "text-red-500" : "text-amber-500"
                            }`}
                            strokeWidth={2.5}
                        />
                        <div
                            className={`absolute -bottom-4 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-center font-black text-lg md:text-xl tracking-wider ${
                                isHighRisk ? "text-red-600" : "text-amber-600"
                            }`}
                            style={{
                                textShadow: "0 0 12px rgba(255,255,255,0.9)",
                                letterSpacing: "0.25em",
                            }}
                        >
                            {isHighRisk ? "SCAM ALERT" : "CAUTION"}
                        </div>
                    </div>
                </div>
            )}

            {/* Avatar */}
            <div
                className={`relative flex-shrink-0 z-10 ${
                    isGrid
                        ? "w-full h-48 mb-3"
                        : "w-full h-40 md:w-32 md:h-auto"
                }`}
            >
                {imageSrc ? (
                    <Image
                        src={imageSrc}
                        alt={job.company?.company_name || "Company Logo"}
                        fill
                        className="bg-white object-contain p-2"
                        sizes="(max-width: 768px) 100vw, 128px"
                        priority={false}
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-400 text-xs border">
                        No Logo
                    </div>
                )}

                {isProCompany && (
                    <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-gradient-to-r from-blue-600 to-sky-500 shadow">
                        <Crown size={12} className="text-white" />
                        VIP
                    </div>
                )}
            </div>

            {/* Content */}
            <div
                className={`flex flex-col justify-between relative z-10 ${
                    isGrid
                        ? "space-y-2"
                        : "flex-1 p-4 sm:flex-row sm:items-start"
                }`}
            >
                {/* Job info */}
                <div className={`${isGrid ? "" : "flex-1 pr-4 space-y-2"}`}>
                    <h3
                        onClick={() => router.push(`/job-detail/${job.id}`)}
                        className="font-semibold text-lg text-[#0a66c2] hover:underline cursor-pointer"
                    >
                        {job.title}
                    </h3>

                    <div className="flex items-center gap-1 text-gray-600 cursor-pointer">
                        <Building2 className="w-4 h-4 text-gray-500" />
                        <span
                            onClick={() =>
                                router.push(
                                    `/company/company-detail/${job.company?.company_id}`
                                )
                            }
                            className="underline underline-offset-2 hover:text-blue-700"
                        >
                            {companyName}
                        </span>
                        {isProCompany && (
                            <span className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200">
                                <Crown size={12} className="text-blue-600" />
                                VIP COMPANY
                            </span>
                        )}
                    </div>

                    {isGrid ? (
                        job.salaryDisplay && (
                            <p className="text-sm font-medium text-green-600">
                                {job.salaryDisplay}
                            </p>
                        )
                    ) : (
                        <>
                            <div className="flex flex-col items-start gap-1 text-xs text-gray-500">
                                {job.location && (
                                    <span className="flex items-center gap-1">
                                        <MapPin size={12} />
                                        {job.location
                                            .split(", ")
                                            .find((part) =>
                                                part
                                                    .trim()
                                                    .startsWith("Thành phố")
                                            ) || job.location}
                                    </span>
                                )}

                                {job.work_type_names?.length > 0 && (
                                    <span className="flex items-center gap-1">
                                        <MapPin size={12} />
                                        {job.work_type_names.join(", ")}
                                    </span>
                                )}
                            </div>

                            {job.salaryDisplay && (
                                <div className="flex items-baseline gap-2">
                                    Salary:
                                    <p className="text-sm font-medium text-green-600">
                                        {job.salaryDisplay}
                                    </p>
                                </div>
                            )}

                            <div className="flex flex-wrap gap-2 mt-2">
                                {job.skill_names
                                    ?.slice(0, 3)
                                    .map((skill, i) => (
                                        <span
                                            key={i}
                                            className="bg-blue-50 border border-[#0a66c2] text-[#0a66c2] text-xs px-2 py-0.5 rounded-full"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                            </div>
                        </>
                    )}

                    {/* ✅ WARNING BANNER */}
                    {/* {hasWarning && !isGrid && (
                        <div
                            className={`mt-3 p-2 border-l-2 rounded ${
                                isHighRisk
                                    ? "bg-red-50 border-red-400"
                                    : "bg-amber-50 border-amber-400"
                            }`}
                        >
                            <p
                                className={`text-[10px] leading-relaxed ${
                                    isHighRisk
                                        ? "text-red-800"
                                        : "text-amber-800"
                                }`}
                            >
                                <strong>
                                    {isHighRisk ? "High Risk:" : "Caution:"}
                                </strong>{" "}
                                Flagged by AI. Verify carefully.
                            </p>
                        </div>
                    )} */}
                </div>

                {/* Right actions */}
                <div
                    className={`flex ${
                        isGrid
                            ? "items-start justify-between mt-2"
                            : "flex-col items-end justify-between h-full mt-4 sm:mt-0"
                    }`}
                >
                    <div
                        className={`flex items-center gap-3 ${
                            isGrid ? "text-xs justify-between" : "mb-4"
                        }`}
                    >
                        {job.date_post && (
                            <span className="flex items-center gap-1 leading-none">
                                <CalendarDays className="w-4 h-4 shrink-0" />
                                <span>{getPostedAgo(job.date_post)}</span>
                            </span>
                        )}
                        {job.expired_date && (
                            <span className="flex items-center gap-1 font-semibold leading-none text-red-600">
                                <Clock className="w-4 h-4 shrink-0" />
                                <span>{getExpiredIn(job.expired_date)}</span>
                            </span>
                        )}
                        <button
                            onClick={toggleSave}
                            className="flex items-center justify-center rounded-full hover:bg-blue-50 disabled:opacity-60"
                            disabled={saving}
                            title={liked ? "Unsave" : "Save Job"}
                        >
                            {liked ? (
                                <BookmarkCheck
                                    size={20}
                                    className="text-blue-700 fill-blue-700"
                                />
                            ) : (
                                <Bookmark size={20} className="text-blue-700" />
                            )}
                        </button>
                    </div>

                    {isLoggedIn && applied && (
                        <ApplicationBadge status="Applied" />
                    )}

                    {!isGrid && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/job-detail/${job.id}`);
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition bg-blue-700 rounded-md hover:bg-blue-800"
                        >
                            <Eye size={18} className="text-white" />
                            {t`See Detail`}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
