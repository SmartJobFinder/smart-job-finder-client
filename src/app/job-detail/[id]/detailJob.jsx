"use client";

import React, {useCallback, useEffect, useMemo, useRef, useState,} from "react";
import {Bookmark, BookmarkCheck, Briefcase, Layers, MapPin, MessageSquareWarning,} from "lucide-react";
import {Button} from "@/components/ui/button";
import RelatedJobs from "./relatedJobs";
import ApplicationModal from "./applicationJob";
import ReportModal from "@/components/ui/report";
import {useRouter} from "next/navigation";
import {useDispatch, useSelector} from "react-redux";

import {selectIsLoggedIn} from "@/features/auth/authSelectors";
import {showLoginPrompt} from "@/features/auth/loginPromptSlice";
import {toast} from "react-toastify";

import Pill from "./_components/Pill";
import Section from "./_components/Section";
import CompanyCard from "./_components/CompanyCard";
import GeneralCard from "./_components/GeneralCard";
import SkillsChips from "./_components/SkillsChips";

import {formatList} from "./_utils/formatters";
import {mapJobToView} from "./_utils/jobMapper";
import {t} from "@/i18n/i18n";

import {useGetStatusQuery, useSaveJobMutation, useUnsaveJobMutation,} from "@/services/savedJobService";

import {useGetApplyStatusQuery, useLazyGetApplyStatusQuery,} from "@/services/applicationService";

import ApplicationDetail from "./_components/ApplicationDetail";
import ParseInfoJob from "@/components/common/ParseInfoJob";

import AiMatchModal from "./AiMatchModal";

export default function DetailJob({job}) {
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const router = useRouter();
    const dispatch = useDispatch();
    const dj = useMemo(() => mapJobToView(job), [job]);
    const djId = dj?.id;

    const [showApplyModal, setShowApplyModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showAiMatch, setShowAiMatch] = useState(false);

    const {data: status, isFetching} = useGetStatusQuery(djId, {
        skip: !djId || !isLoggedIn,
    });
    const liked = status?.saved ?? false;
    const [saveJob, {isLoading: savingSave}] = useSaveJobMutation();
    const [unsaveJob, {isLoading: savingUnsave}] = useUnsaveJobMutation();
    const saving = savingSave || savingUnsave || isFetching;

    const {data: applyStatus, isLoading: isLoadingApply} =
        useGetApplyStatusQuery(djId, {
            skip: !djId || !isLoggedIn,
        });

    const applied = applyStatus?.applied ?? false;
    const attemptCount = applyStatus?.attemptCount ?? 0;
    const lastUserActionAtIso = applyStatus?.lastUserActionAt ?? null;

    const MAX_REAPPLY = 2;

    const REAPPLY_INTERVAL = 30 * 60 * 1000;

    const computeRemainingFrom = useCallback((lastIso) => {
        if (!lastIso) return 0;

        const hasTz = /([zZ]|[+-]\d{2}:\d{2})$/.test(lastIso);
        const safeIso = hasTz ? lastIso : `${lastIso}Z`;

        const last = new Date(safeIso);
        if (isNaN(last.getTime())) return 0;

        const nextAllowed = last.getTime() + REAPPLY_INTERVAL;
        return Math.max(0, nextAllowed - Date.now());
    }, []);

    const [remainingMs, setRemainingMs] = useState(0);
    const firstReapplyClickRef = useRef(false);

    const [fetchStatus, {isFetching: refreshingStatus}] =
        useLazyGetApplyStatusQuery();

    useEffect(() => {
        setRemainingMs(computeRemainingFrom(lastUserActionAtIso));
    }, [lastUserActionAtIso, computeRemainingFrom]);

    const guardOr = useCallback(
        (action) => {
            if (!isLoggedIn) {
                dispatch(showLoginPrompt());
                setShowApplyModal(false);
                setShowReportModal(false);
                setShowDetailModal(false);
                return;
            }
            action?.();
        },
        [dispatch, isLoggedIn]
    );

    const isExpired = useMemo(() => {
        if (!dj?.expiredDate) return false;
        const [day, month, year] = dj.expiredDate.split("-").map(Number);
        const expiredDate = new Date(year, month - 1, day);
        return expiredDate < new Date();
    }, [dj?.expiredDate]);

    const handleSave = useCallback(
        () =>
            guardOr(async () => {
                try {
                    if (!djId) return;
                    if (!liked) {
                        await saveJob({jobId: djId}).unwrap();
                        toast.success(t`Job saved successfully`);
                    } else {
                        await unsaveJob(djId).unwrap();
                        toast.success(t`Job unsaved`);
                    }
                } catch (err) {
                    console.error("Toggle save error", err);
                    toast.error("Error while saving/unsaving job");
                }
            }),
        [djId, liked, saveJob, unsaveJob, guardOr]
    );

    const handleApply = useCallback(
        () =>
            guardOr(() => {
                setShowReportModal(false);
                setShowDetailModal(false);
                setShowApplyModal(true);
            }),
        [guardOr]
    );

    const handleShowDetail = useCallback(
        () =>
            guardOr(() => {
                setShowApplyModal(false);
                setShowReportModal(false);
                setShowDetailModal(true);
            }),
        [guardOr]
    );

    const handleFlagClick = useCallback(
        () =>
            guardOr(() => {
                setShowApplyModal(false);
                setShowDetailModal(false);
                setShowReportModal(true);
            }),
        [guardOr]
    );

    const handleReapply = useCallback(
        async () =>
            guardOr(async () => {
                if (attemptCount >= MAX_REAPPLY) {
                    toast.error(
                        t`You have reached the re-application limit (2 times).`
                    );
                    return;
                }

                let latest;
                try {
                    latest = await fetchStatus(djId).unwrap();
                } catch (e) {
                    console.error("Fetch status failed:", e);
                    toast.error(
                        "Failed to refresh application status. Please try again."
                    );
                    return;
                }

                const appliedNow = latest?.applied ?? false;
                const attempts = latest?.attemptCount ?? 0;
                const lastIso = latest?.lastUserActionAt ?? null;

                if (!appliedNow) {
                    toast.error("You haven't applied this job yet.");
                    return;
                }

                const remain = computeRemainingFrom(lastIso);
                if (remain > 0) {
                    const elapsed = REAPPLY_INTERVAL - remain;
                    toast.info(
                        t`You re-applied 30 minutes ago. Please wait to try again.`
                    );
                    return;
                }

                // qua cooldown => mở modal reapply
                setShowReportModal(false);
                setShowDetailModal(false);
                setShowApplyModal(true);
            }),
        [guardOr, attemptCount, fetchStatus, djId, computeRemainingFrom]
    );

    // điều kiện disable nút Re-apply (NEW/CHANGED)
    const reachedLimit = attemptCount >= MAX_REAPPLY; // đủ 2 lần → disable vĩnh viễn
    const canReapplyNow =
        applied && !isExpired && !reachedLimit && remainingMs === 0;

    const handleOpenAiMatch = useCallback(
        () =>
            guardOr(() => {
                setShowAiMatch(true);
            }),
        [guardOr]
    );

    return (
        <div className="w-full px-4 py-10 bg-gray-100 md:px-10">
            <div className="flex flex-col-reverse w-full gap-6 md:flex-row">
                <div className="w-full md:w-[78%] flex flex-col gap-6">
                    <div className="p-6 space-y-4 bg-white shadow-lg rounded-xl">
                        <h1 className="text-3xl font-bold text-gray-800">
                            {dj.title}
                        </h1>

                        <div className="flex flex-wrap gap-2 text-sm">
                            <Pill
                                icon={MapPin}
                                className="text-blue-800 bg-blue-100"
                            >
                                {formatList(dj.workType)}
                            </Pill>
                            <Pill
                                icon={Layers}
                                className="text-purple-800 bg-purple-100"
                            >
                                {formatList(dj.category)}
                            </Pill>
                            <Pill
                                icon={Briefcase}
                                className="text-yellow-800 bg-yellow-100"
                            >
                                {formatList(dj.level)}
                            </Pill>
                        </div>

                        <div className="grid items-center grid-cols-1 md:grid-cols-10 gap-2 mt-4">
                            <div className="col-span-8">
                                {isLoadingApply ? (
                                    <p>Loading...</p>
                                ) : !applied ? (
                                    <Button
                                        disabled={isExpired}
                                        className={`w-full text-white ${
                                            isExpired
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-blue-600 hover:bg-blue-700"
                                        }`}
                                        onClick={handleApply}
                                    >
                                        Apply
                                    </Button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button
                                            disabled={
                                                isExpired ||
                                                reachedLimit ||
                                                refreshingStatus
                                            } // disable khi hết hạn, đạt limit 2 lần, hoặc đang refetch
                                            className={`flex-1 text-white ${
                                                isExpired || reachedLimit
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-green-600 hover:bg-green-700"
                                            }`}
                                            onClick={handleReapply}
                                            title={
                                                reachedLimit
                                                    ? t`You have reached the re-application limit (2 times).`
                                                    : remainingMs > 0
                                                        ? `You can re-apply in 30 minutes`
                                                        : t`Re-apply`
                                            }
                                        >
                                            {reachedLimit
                                                ? "Re-apply (Limit reached)"
                                                : remainingMs > 0
                                                    ? `Re-apply in 30 minutes please`
                                                    : "Re-Applications"}
                                        </Button>

                                        <Button
                                            className="flex-1 font-medium text-blue-600 bg-white border-2 border-blue-600 hover:bg-blue-600 hover:text-white"
                                            onClick={handleShowDetail}
                                        >
                                            {t`View Details`}
                                        </Button>
                                    </div>
                                )}

                                {showApplyModal && (
                                    <ApplicationModal
                                        onClose={() => setShowApplyModal(false)}
                                        jobId={dj.id}
                                        jobTitle={dj.title}
                                        isReapply={applied}
                                    />
                                )}
                            </div>

                            <div className="relative flex items-center justify-center col-span-1">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className={`group inline-flex items-center justify-center rounded-full px-3 py-2 transition-all border w-full md:w-auto ${
                                        liked
                                            ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                                            : "bg-white border-blue-200 hover:bg-blue-50"
                                    } ${
                                        saving
                                            ? "opacity-60 cursor-not-allowed"
                                            : ""
                                    }`}
                                    aria-label={
                                        liked ? "Unsave job" : "Save job"
                                    }
                                    title={liked ? "Unsave" : "Save job"}
                                >
                                    {liked ? (
                                        <BookmarkCheck className="w-5 h-5 text-blue-600"/>
                                    ) : (
                                        <Bookmark className="w-5 h-5 text-blue-600"/>
                                    )}
                                    <span className="ml-2 text-xs font-medium text-blue-700">
                                        {liked ? "Saved" : "Save"}
                                    </span>
                                </button>
                            </div>

                            <div className="flex justify-center col-span-1">
                                <button
                                    onClick={handleFlagClick}
                                    className="group inline-flex items-center justify-center rounded-full px-3 py-2 transition-all border w-full md:w-auto bg-white border-red-200 hover:bg-red-50"
                                    aria-label="Report job"
                                    title="Report this job"
                                >
                                    <MessageSquareWarning className="w-5 h-5 text-red-600"/>
                                    <span className="ml-2 text-xs font-medium text-red-700">
                                        Report
                                    </span>
                                </button>
                            </div>

                            <ReportModal
                                open={showReportModal}
                                onClose={() => setShowReportModal(false)}
                                type={0}
                                contentId={dj.id}
                            />
                        </div>

                        {applied && showDetailModal && (
                            <ApplicationDetail jobId={dj.id}/>
                        )}
                    </div>

                    <ParseInfoJob
                        description={dj.description}
                        requirements={dj.requirements}
                        benefits={dj.benefits}
                        descriptionTitle={t`Job Description`}
                        requirementsTitle={t`Requirements`}
                        benefitsTitle={t`Benefits`}
                        contentClassName="text-[17px] md:text-[18px] leading-7"
                    />

                    <Section icon={MapPin} title={t`Work Location`}>
                        {dj.location ? (
                            <p>- {dj.location}</p>
                        ) : (
                            <p>Location not specified</p>
                        )}
                    </Section>
                </div>

                <div className="w-full md:w-[22%] flex flex-col gap-4">
                    <CompanyCard
                        avatar={dj.avatar}
                        companyName={dj.companyName}
                        companyId={dj.companyId}
                        isProCompany={dj.isProCompany}
                    />
                    <GeneralCard
                        salary={dj.salaryDisplay}
                        postDate={dj.datePost}
                        expiredDate={dj.expiredDate}
                    />
                    <SkillsChips
                        skills={Array.isArray(dj.skill) ? dj.skill : []}
                    />
                    <button
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 hover:from-indigo-500 hover:via-blue-600 hover:to-cyan-500 text-white transition transform hover:scale-[1.01] shadow-lg hover:shadow-2xl ring-2 ring-white/20 flex items-center gap-3 disabled:opacity-50 group relative overflow-hidden"
                        onClick={handleOpenAiMatch}
                        title={isLoggedIn ? "Check suitability with AI" : "Please log in to use AI"}
                    >
                        <span
                            className="pointer-events-none absolute inset-0 rounded-xl animate-pulse bg-cyan-400/0 group-hover:bg-cyan-400/0"/>
                        <span className="pointer-events-none absolute inset-0 opacity-70">
                            <span className="shine"/>
                        </span>
                        <img
                            src="https://img.icons8.com/ios/50/ai-robot--v7.png"
                            alt="AI"
                            className="w-10 h-10 transition-transform duration-200 group-hover:scale-110 drop-shadow-[0_2px_6px_rgba(59,130,246,0.6)]"
                        />
                        <span className="font-semibold tracking-wide">
                            Are you suitable?
                        </span>
                        <span
                            className="ml-1 text-xs font-bold bg-white/20 text-white px-2 py-0.5 rounded-full border border-white/30">
                            AI
                        </span>
                    </button>
                    <style jsx>{`
                        .shine {
                            position: absolute;
                            inset: -2px;
                            pointer-events: none;
                            background: repeating-linear-gradient(
                                120deg,
                                rgba(255, 255, 255, 0) 0px,
                                rgba(255, 255, 255, 0) 40px,
                                rgba(255, 255, 255, 0.28) 60px,
                                rgba(255, 255, 255, 0) 80px
                            );
                            background-size: 200% 200%;
                            animation: banner-shine 5.6s linear infinite;
                        }

                        @keyframes banner-shine {
                            0% {
                                background-position: 0% 0%;
                            }
                            100% {
                                background-position: 200% 0%;
                            }
                        }
                    `}</style>
                </div>
            </div>

            <RelatedJobs category={dj.category} skill={dj.skill}/>
            {showAiMatch && (
                <AiMatchModal
                    jobId={djId}
                    defaultResumeFileId={null} // Assuming no default resume file for now
                    onClose={() => setShowAiMatch(false)}
                />
            )}
        </div>
    );
}

