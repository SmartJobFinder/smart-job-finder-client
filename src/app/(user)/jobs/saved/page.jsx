"use client";
import { useGetSavedJobsByUserQuery } from "@/services/savedJobService";
import SaveJobItem from "../component/SaveJobItem";
import LoadingScreen from "@/components/ui/loadingScreen";
export default function SavedPage() {
    const { data: jobs, isLoading } = useGetSavedJobsByUserQuery();

    if (isLoading)  return <LoadingScreen message="Loading ..." />;
    if (!jobs?.length)
        return <div className="p-4 bg-green-50">You have no saved jobs !</div>;

    return (
        <div className="space-y-3">
            {jobs.map((job) => (
                <SaveJobItem key={job.jobId} job={job} />
            ))}
        </div>
    );
}
