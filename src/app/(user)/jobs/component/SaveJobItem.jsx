"use client";
import { useRouter } from "next/navigation";
import {
    useSaveJobMutation,
    useUnsaveJobMutation,
    useGetStatusQuery,
} from "@/services/savedJobService";
import { format } from "date-fns";
import { Bookmark, BookmarkCheck, Building2 } from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";
import Image from "next/image";

export default function SaveJobItem({ job }) {
    const router = useRouter();
    const [saveJob] = useSaveJobMutation();
    const [unsaveJob] = useUnsaveJobMutation();
    const { data: status } = useGetStatusQuery(job.jobId);

    const handleToggleSave = async (e) => {
        e.stopPropagation();
        try {
            if (status?.saved) {
                await unsaveJob(job.jobId).unwrap();
                toast.success("Đã bỏ lưu công việc");
            } else {
                await saveJob({ jobId: job.jobId }).unwrap();
                toast.success("Đã lưu công việc");
            }
        } catch (err) {
            console.error("Toggle save job error:", err);
            toast.error("Có lỗi xảy ra khi lưu công việc");
        }
    };

    const formattedDate = job.createdAt
        ? format(new Date(job.createdAt), "dd/MM/yyyy")
        : "";

    return (
        <div
            onClick={() => router.push(`/job-detail/${job.jobId}`)}
            className="flex flex-col items-stretch w-full mb-4 overflow-hidden bg-white border border-gray-200 shadow-sm cursor-pointer md:flex-row rounded-xl hover:shadow-md hover:border-blue-300"
        >
            <div className="relative flex-shrink-0 w-full h-48 md:w-32 md:h-auto">
                <Image
                    fill
                    src={job.companyAvatar}
                    alt={job.companyName}
                    className="object-inherit"
                />
            </div>

            <div className="flex flex-col justify-between flex-1 p-4 sm:flex-row sm:items-center">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-700">
                        {job.titleJob}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-600">
                        <Building2 className="w-4 h-4 text-gray-500" />
                        <Link
                            href={`/company/company-detail/${job.companyId}`}
                            className="underline underline-offset-2 hover:text-blue-700"
                        >
                            {job.companyName}
                        </Link>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {job.skill_job.map((skill) => (
                            <span
                                key={skill}
                                className="px-2 py-1 text-xs text-blue-700 border border-blue-200 rounded-full bg-blue-50"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2 mt-4 sm:mt-0">
                    <p className="text-sm font-medium text-green-600 sm:text-base">
                        {job.salaryDisplay}
                    </p>
                    <p className="text-xs text-gray-500">
                        Saved on {formattedDate}
                    </p>
                    <button
                        onClick={handleToggleSave}
                        className="p-2 transition-colors duration-200 rounded-full hover:bg-blue-50"
                    >
                        {status?.saved ? (
                            <BookmarkCheck
                                size={22}
                                className="text-blue-700 fill-blue-700"
                            />
                        ) : (
                            <Bookmark size={22} className="text-blue-700" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
