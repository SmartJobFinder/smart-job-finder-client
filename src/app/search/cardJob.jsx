"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {useJobSearchStore} from "@/store/jobSearchStore";
import {useSearchJobsWithStatusMutation} from "@/services/jobService";
import JobCardItem from "./JobCardItem";
import {toast} from "react-toastify";
import {showLoginPrompt} from "@/features/auth/loginPromptSlice";
import {useDispatch, useSelector} from "react-redux";
import Pagination from "@/components/ui/pagination";
import LoadingScreen from "@/components/ui/loadingScreen";
import {selectIsLoggedIn} from "@/features/auth/authSelectors";

export default function CardJob() {
    const [list, setList] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [totalElements, setTotalElements] = useState(0);

    const router = useRouter();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(selectIsLoggedIn);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(8);

    const {searchTerm, filters} = useJobSearchStore();
    const debounceRef = useRef(null);

    const [searchJobsWithStatus, {isLoading, error}] = useSearchJobsWithStatusMutation();

    const payload = useMemo(() => {
        const {keyword = "", province = "", companyName = ""} = searchTerm || {};
        return {
            keyword: keyword || undefined,
            companyName: companyName || undefined,
            cityName: province || undefined,
            categoryNames: filters?.categories?.length ? filters.categories : undefined,
            skillNames: filters?.skills?.length ? filters.skills : undefined,
            levelNames: filters?.levels?.length ? filters.levels : undefined,
            workTypeNames: filters?.workTypes?.length ? filters.workTypes : undefined,
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
                        ...j,
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
                    Error loading jobs: {error?.data?.message || "Unable to load job list"}
                </p>
            ) : isLoading ? (
                <LoadingScreen message="Loading job..."/>
            ) : totalElements === 0 ? (
                <p className="text-center text-gray-500">No matching jobs found</p>
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
