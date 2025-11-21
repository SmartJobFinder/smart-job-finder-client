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
        return {
            keyword: keyword || undefined,
            companyName: companyName || undefined,
            cityName: province || undefined,
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
            page: currentPage - 1, // 0-based
            size: pageSize,
            sort: "id,desc",
        };
    }, [searchTerm, filters, currentPage, pageSize]);

    // Reset về trang 1 khi filter thay đổi
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, filters, pageSize]);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            try {
                const res = await searchJobsWithStatus(payload).unwrap();
                const items = res?.items || [];
                const normalized = items.map((it) => {
                    const j = it.job || {};
                    return {
                        ...j, // ✅ Spread all fields first
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

                        // ✅ PRESERVE SCAM FIELDS
                        trustLabel: j.trustLabel || j.trust_label || null,
                        scamScore: j.scamScore || j.scam_score || null,
                        scamCheckedAt:
                            j.scamCheckedAt || j.scam_checked_at || null,

                        // ✅ Preserve company object for JobCardItem
                        company: {
                            ...j.company,
                            company_name: j.company?.company_name,
                            avatar: j.company?.avatar,
                            company_id: j.company?.company_id,
                            isProCompany: j.company?.isProCompany,
                        },

                        // ✅ Preserve other fields JobCardItem needs
                        date_post: j.date_post || j.datePost,
                        expired_date: j.expired_date || j.expiredDate,
                        work_type_names: j.work_type_names || [],
                        skill_names: j.skill_names || [],
                        location: j.location,
                    };
                });
                setList(normalized);
                setTotalPages(res.totalPages || 1);
                setTotalElements(res.totalElements || 0);
            } catch (e) {
                console.error(e);
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
                        job={job} // ✅ TRUYỀN props đã có liked/applied
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

// "use client";

// import { useEffect, useMemo, useRef, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useJobSearchStore } from "@/store/jobSearchStore";
// import { toast } from "react-toastify";
// import { showLoginPrompt } from "@/features/auth/loginPromptSlice";
// import { useDispatch, useSelector } from "react-redux";
// import Pagination from "@/components/ui/pagination";
// import LoadingScreen from "@/components/ui/loadingScreen";
// import { selectIsLoggedIn } from "@/features/auth/authSelectors";
// import JobCardItem from "./JobCardItem";
// import { jobs as mockJobs } from "@/mock/data/jobs";

// export default function CardJob() {
//     const [list, setList] = useState([]);
//     const [totalPages, setTotalPages] = useState(1);
//     const [totalElements, setTotalElements] = useState(0);

//     const router = useRouter();
//     const dispatch = useDispatch();
//     const isLoggedIn = useSelector(selectIsLoggedIn);

//     const [currentPage, setCurrentPage] = useState(1);
//     const [pageSize, setPageSize] = useState(8);
//     const [isLoading, setIsLoading] = useState(false);

//     const { searchTerm, filters } = useJobSearchStore();
//     const debounceRef = useRef(null);

//     // Filter jobs based on search terms and filters
//     const filterJobs = (jobs, searchTerm, filters) => {
//         let result = [...jobs];

//         // Filter by keyword
//         if (searchTerm.keyword) {
//             const keyword = searchTerm.keyword.toLowerCase();
//             result = result.filter(
//                 (job) =>
//                     job.title.toLowerCase().includes(keyword) ||
//                     job.description?.toLowerCase().includes(keyword)
//             );
//         }

//         // Filter by location/province
//         if (searchTerm.province) {
//             const province = searchTerm.province.toLowerCase();
//             result = result.filter(
//                 (job) =>
//                     job.location &&
//                     job.location.toLowerCase().includes(province)
//             );
//         }

//         // Filter by company
//         if (searchTerm.companyName) {
//             const company = searchTerm.companyName.toLowerCase();
//             result = result.filter((job) =>
//                 job.company?.company_name?.toLowerCase().includes(company)
//             );
//         }

//         // Filter by categories
//         if (filters.categories && filters.categories.length > 0) {
//             result = result.filter((job) => {
//                 if (!job.category_names) return false;
//                 return job.category_names.some((cat) =>
//                     filters.categories.includes(cat)
//                 );
//             });
//         }

//         // Filter by work types
//         if (filters.workTypes && filters.workTypes.length > 0) {
//             result = result.filter((job) => {
//                 if (!job.work_type) return false;
//                 return filters.workTypes.includes(job.work_type);
//             });
//         }

//         // Filter by levels
//         if (filters.levels && filters.levels.length > 0) {
//             result = result.filter((job) => {
//                 if (!job.level) return false;
//                 return filters.levels.includes(job.level);
//             });
//         }

//         return result;
//     };

//     useEffect(() => {
//         const loadJobs = async () => {
//             setIsLoading(true);
//             try {
//                 // Simulate API delay
//                 await new Promise((resolve) => setTimeout(resolve, 500));

//                 // Filter jobs based on search terms and filters
//                 const filteredJobs = filterJobs(mockJobs, searchTerm, filters);

//                 // Calculate pagination
//                 const total = filteredJobs.length;
//                 const pages = Math.ceil(total / pageSize);

//                 // Get current page of jobs
//                 const start = (currentPage - 1) * pageSize;
//                 const end = start + pageSize;
//                 const currentPageJobs = filteredJobs.slice(start, end);

//                 setList(currentPageJobs);
//                 setTotalElements(total);
//                 setTotalPages(pages);
//             } catch (error) {
//                 console.error("Error loading jobs:", error);
//                 toast.error("Failed to load jobs");
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         if (debounceRef.current) clearTimeout(debounceRef.current);
//         debounceRef.current = setTimeout(loadJobs, 300);

//         return () => {
//             if (debounceRef.current) clearTimeout(debounceRef.current);
//         };
//     }, [searchTerm, filters, currentPage, pageSize]);

//     const handleSaveJob = (jobId) => {
//         if (!isLoggedIn) {
//             dispatch(showLoginPrompt());
//             return;
//         }

//         // Mock save job functionality
//         toast.success("Job saved successfully");
//     };

//     const handlePageChange = (page) => {
//         setCurrentPage(page);
//         window.scrollTo({ top: 0, behavior: "smooth" });
//     };

//     if (isLoading) {
//         return <LoadingScreen />;
//     }

//     return (
//         <div className="space-y-6">
//             <div className="text-sm text-gray-500">
//                 Found {totalElements} jobs matching your criteria
//             </div>

//             {list.length > 0 ? (
//                 <div className="space-y-4">
//                     {list.map((job) => (
//                         <JobCardItem
//                             key={job.id}
//                             job={job}
//                             onSave={() => handleSaveJob(job.id)}
//                         />
//                     ))}

//                     {totalPages > 1 && (
//                         <div className="flex justify-center mt-8">
//                             <Pagination
//                                 currentPage={currentPage}
//                                 totalPages={totalPages}
//                                 onPageChange={handlePageChange}
//                             />
//                         </div>
//                     )}
//                 </div>
//             ) : (
//                 <div className="bg-white p-8 rounded-lg border text-center">
//                     <h3 className="text-lg font-medium text-gray-900 mb-2">
//                         No jobs found
//                     </h3>
//                     <p className="text-gray-500">
//                         Try adjusting your search or filters to find more jobs
//                     </p>
//                 </div>
//             )}
//         </div>
//     );
// }
