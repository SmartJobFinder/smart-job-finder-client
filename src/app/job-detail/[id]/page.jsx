export const dynamic = "force-dynamic"; 

import React from "react";
import DetailJob from "./detailJob";
import { getJobDetail } from "@/services/jobDetailService";

export default async function JobDetailPage({ params }) {
    const { id } = await params; 

    if (!id) {
        return (
            <div className="mt-10 text-center text-red-500">
                No job ID found.
            </div>
        );
    }

    try {
        const job = await getJobDetail(id);

        return (
            <div className="w-[90%] mx-auto mt-0">
                <DetailJob job={job} />
            </div>
        );
    } catch (error) {
        console.error("JobDetailPage error:", error); // Log chi tiết hơn
        return (
            <div className="mt-10 text-center text-red-500">
                Unable to load job information {error.message}.
            </div>
        );
    }
}