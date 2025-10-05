"use client";

import { useState, useMemo } from "react";
import { useGetJobsQuery } from "@/services/jobService";
import LoadingScreen from "@/components/ui/loadingScreen";
import JobCardItem from "@/app/search/JobCardItem";
import { t } from "@/i18n/i18n";

export default function RelatedJobs({ category = [] }) {
    const { data, isLoading, error } = useGetJobsQuery();
    const [visibleCount, setVisibleCount] = useState(5);

    const jobsSource = useMemo(() => {
        if (Array.isArray(data)) return data;
        if (Array.isArray(data?.jobs)) return data.jobs;
        if (Array.isArray(data?.content)) return data.content;
        return [];
    }, [data]);

    const categorySet = useMemo(() => {
        if (!Array.isArray(category)) return new Set();
        return new Set(
            category.filter(Boolean).map((c) => c.trim().toLowerCase())
        );
    }, [category]);

    const relatedJobs = useMemo(() => {
        if (categorySet.size === 0) return [];
        return jobsSource.filter((job) =>
            (job.category_names || []).some(
                (cat) => cat && categorySet.has(cat.trim().toLowerCase())
            )
        );
    }, [jobsSource, categorySet]);

    const handleLoadMore = () => setVisibleCount((prev) => prev + 10);
    const handleCollapse = () => setVisibleCount(5);

    if (isLoading) return <LoadingScreen message="Loading ..." />;
    if (error) return <p className="text-red-500">Không tải được danh sách liên quan.</p>;

    const hasMore = visibleCount < relatedJobs.length;

    return (
        <div className="mt-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                {t`Similar Jobs`}
            </h2>

            {relatedJobs.length === 0 ? (
                <p className="text-gray-500">Chưa có công việc tương tự.</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {relatedJobs.slice(0, visibleCount).map((job) => (
                            <JobCardItem
                                key={job.id}
                                job={job}
                                onToast={(msg, type) =>
                                    console.log(`[${type}] ${msg}`)
                                }
                                isGrid={true}
                            />
                        ))}
                    </div>

                    <div className="flex justify-center gap-4 mt-6">
                        {hasMore ? (
                            <button
                                onClick={handleLoadMore}
                                className="px-4 py-2 text-white transition bg-blue-700 rounded hover:bg-primary/80"
                            >
                                {t`See More`}
                            </button>
                        ) : relatedJobs.length > 5 ? (
                            <button
                                onClick={handleCollapse}
                                className="px-4 py-2 text-gray-800 transition bg-blue-200 rounded hover:bg-gray-300"
                            >
                                {t`Show less`}
                            </button>
                        ) : null}
                    </div>
                </>
            )}
        </div>
    );
}