"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useJobSearchStore } from "@/store/jobSearchStore";
import { useSearchJobsWithStatusMutation } from "@/services/jobService";
import JobCardItem from "./JobCardItem";
import { toast } from "react-toastify";
import { showLoginPrompt } from "@/features/auth/loginPromptSlice";
import { useDispatch, useSelector } from "react-redux";
import Pagination from "@/components/ui/pagination";
import LoadingScreen from "@/components/ui/loadingScreen";
import { selectIsLoggedIn } from "@/features/auth/authSelectors";

export default function CardJob() {
    const [list, setList] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    const router = useRouter();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(selectIsLoggedIn);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);

    const { searchTerm, filters } = useJobSearchStore();
    const debounceRef = useRef(null);

    const [searchJobsWithStatus, { isLoading, error }] =
        useSearchJobsWithStatusMutation();

    const payload = useMemo(() => {
        const {
            keyword = "",
            province = "",
            companyName = "",
        } = searchTerm || {};

        // Don't send cityName to backend - we'll filter client-side
        // Backend cityName filter doesn't match location strings like "Hải Phòng"
        // When filtering by location, fetch all jobs (large size) to ensure we get all matches
        const hasLocationFilter = province && province.trim() !== "";
        const fetchSize = hasLocationFilter ? 1000 : pageSize; // Fetch all when location filter is active

        return {
            keyword: keyword || undefined,
            companyName: companyName || undefined,
            // cityName: removed - filter client-side instead
            categoryNames: filters?.categories?.length
                ? filters.categories
                : undefined,
            skillNames: filters?.skills?.length ? filters.skills : undefined,
            levelNames: filters?.levels?.length ? filters.levels : undefined,
            workTypeNames: filters?.workTypes?.length
                ? filters.workTypes
                : undefined,
            wardNames: undefined,
            matchAllCategories: false,
            matchAllSkills: false,
            matchAllLevels: false,
            matchAllWorkTypes: false,
            matchAllWards: false,
            salaryMin: undefined,
            salaryMax: undefined,
            postedFrom: undefined,
            postedTo: undefined,
            page: hasLocationFilter ? 0 : currentPage - 1, // Always page 0 when location filter
            size: fetchSize,
            sort: "id,desc",
        };
    }, [searchTerm, filters, currentPage, pageSize]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filters, pageSize]);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            try {
                const res = await searchJobsWithStatus(payload).unwrap();

                // ✅ DEBUG LOG
                console.log("========== SEARCH API RESPONSE ==========");
                console.log("Total items from API:", res?.items?.length);
                console.log("Total elements from API:", res?.totalElements);
                console.log("Payload:", payload);
                console.log("SearchTerm province:", searchTerm?.province);
                console.log("First item:", res?.items?.[0]);
                console.log("First job scam data:", {
                    trustLabel: res?.items?.[0]?.job?.trustLabel,
                    scamScore: res?.items?.[0]?.job?.scamScore,
                });
                console.log("========================================");

                const items = res?.items || [];
                console.log("Items array length:", items.length);

                // Debug: Check for items without job data
                const itemsWithoutJob = items.filter((it) => !it.job);
                if (itemsWithoutJob.length > 0) {
                    console.warn(
                        "⚠️ Items without job data:",
                        itemsWithoutJob.length
                    );
                    console.warn("Items without job:", itemsWithoutJob);
                }

                // Debug: Log all job locations before filtering
                console.log("========== ALL JOBS FROM API ==========");
                items.forEach((it, index) => {
                    if (it.job) {
                        console.log(`Job ${index + 1} (ID: ${it.job.id}):`, {
                            title: it.job.title,
                            location: it.job.location,
                            expired_date:
                                it.job.expired_date || it.job.expiredDate,
                            date_post: it.job.date_post || it.job.datePost,
                        });
                    }
                });
                console.log("=======================================");

                let normalized = items
                    .filter((it) => it.job) // Filter out items without job data
                    .map((it) => {
                        const j = it.job || {};
                        return {
                            ...j, // Spread all original fields first
                            id: j.id,
                            title: j.title || "",
                            avatar: j.company?.avatar || "",
                            companyName: j.company?.company_name || "",
                            workType: j.work_type_names || [],
                            level: j.level_names || [],
                            category: j.category_names || [],
                            skill: j.skill_names || [],
                            city: j.wards || [],
                            salaryDisplay: j.salaryDisplay,
                            liked: !!it.saved,
                            applied: !!it.applied,

                            // ✅ SCAM DETECTION FIELDS
                            trustLabel: j.trustLabel || j.trust_label || null,
                            scamScore: j.scamScore || j.scam_score || null,
                            scamCheckedAt:
                                j.scamCheckedAt || j.scam_checked_at || null,

                            // ✅ Company object
                            company: {
                                company_name: j.company?.company_name,
                                avatar: j.company?.avatar,
                                company_id: j.company?.company_id,
                                isProCompany: j.company?.isProCompany,
                            },

                            // ✅ Date & status fields
                            date_post: j.date_post || j.datePost,
                            expired_date: j.expired_date || j.expiredDate,
                            status: j.status || j.job_status || it.status,

                            // ✅ Array fields
                            work_type_names: j.work_type_names || [],
                            skill_names: j.skill_names || [],
                            location: j.location,
                        };
                    });

                // Lọc lại chỉ giữ job active (không DRAFT, không hết hạn).
                // Job INACTIVE vẫn hiển thị như mobile, nhưng sẽ bị chặn apply ở trang chi tiết.
                const today = new Date();
                normalized = normalized.filter((job) => {
                    const isDraft =
                        typeof job.status === "string" &&
                        job.status.toLowerCase() === "draft";

                    if (isDraft) return false;

                    if (!job.expired_date) return true; // không có expired_date thì giữ
                    const [d, m, y] = String(job.expired_date)
                        .split("-")
                        .map(Number);
                    const expiredDate = new Date(y, m - 1, d);
                    return expiredDate >= today;
                });

                // Apply client-side location filter if specified
                // Backend cityName filter doesn't work correctly with location strings
                // So we fetch all jobs and filter client-side by location string
                const selectedProvince = searchTerm?.province || "";
                const hasLocationFilter =
                    selectedProvince && selectedProvince.trim() !== "";

                if (hasLocationFilter) {
                    const selectedLocation = selectedProvince
                        .trim()
                        .toLowerCase();

                    // Debug: Log before filtering
                    console.log("========== LOCATION FILTER DEBUG ==========");
                    console.log("Selected province:", selectedProvince);
                    console.log(
                        "Selected location (lowercase):",
                        selectedLocation
                    );
                    console.log("Total jobs before filter:", normalized.length);

                    const beforeFilter = normalized.length;
                    normalized = normalized.filter((job) => {
                        const jobLocation = (job.location || "").toLowerCase();
                        const matches = jobLocation.includes(selectedLocation);

                        // Debug: Log jobs that don't match
                        if (!matches) {
                            console.log(
                                `Job ${job.id} filtered out:`,
                                job.location,
                                "does not contain",
                                selectedProvince
                            );
                        }

                        // Check if job location contains the selected city name
                        // Handle cases like "12, Nguyen Thi Suong Street, Ba Đình, Hà Nội" for "Hà Nội"
                        return matches;
                    });

                    console.log("Total jobs after filter:", normalized.length);
                    console.log(
                        `Filtered out: ${beforeFilter - normalized.length} jobs`
                    );
                    console.log("===========================================");
                }

                // ✅ DEBUG NORMALIZED DATA
                console.log("========== NORMALIZED DATA ==========");
                console.log("First normalized job:", normalized[0]);
                console.log(
                    "Trust labels:",
                    normalized.map((j) => ({
                        id: j.id,
                        trustLabel: j.trustLabel,
                    }))
                );
                console.log("====================================");

                // Update totalElements and totalPages after client-side filtering
                // Only recalculate if location filter is applied (client-side filtering)
                if (hasLocationFilter) {
                    // Client-side location filter was applied, recalculate totals
                    const filteredCount = normalized.length;
                    const itemsPerPage = pageSize;
                    const recalculatedTotalPages = Math.ceil(
                        filteredCount / itemsPerPage
                    );

                    setList(normalized);
                    setTotalPages(recalculatedTotalPages);
                    setTotalElements(filteredCount);
                } else {
                    // No client-side filter, use API pagination as-is
                    setList(normalized);
                    setTotalPages(res.totalPages || 1);
                    setTotalElements(res.totalElements || 0);
                }
            } catch (e) {
                console.error("Search error:", e);
            }
        }, 300);
        return () => clearTimeout(debounceRef.current);
    }, [payload, searchJobsWithStatus]);

    const handleToast = (msg, type) => {
        if (type === "success") toast.success(msg);
        if (type === "neutral") toast.info(msg);
        if (type === "error") toast.error(msg);
    };

    return (
        <div className="w-full max-w-[1000px] bg-white p-6 rounded-xl shadow-md space-y-6 mx-auto min-h-[500px]">
            {error ? (
                <p className="text-center text-red-500">
                    Error loading jobs:{" "}
                    {error?.data?.message || "Unable to load job list"}
                </p>
            ) : isLoading ? (
                <LoadingScreen message="Loading job..." />
            ) : totalElements === 0 ? (
                <p className="text-center text-gray-500">
                    No matching jobs found
                </p>
            ) : (
                list.map((job) => (
                    <JobCardItem
                        key={job.id}
                        job={job}
                        onNeedLogin={() => dispatch(showLoginPrompt())}
                        onToast={handleToast}
                    />
                ))
            )}

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
}
