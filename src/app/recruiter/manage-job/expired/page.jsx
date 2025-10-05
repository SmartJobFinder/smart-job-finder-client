"use client";

import CompanyGuard from "@/components/recruiter/CompanyGuard";
import RecruiterJobsList from "@/components/recruiter/RecruiterJobsList";

export default function ExpiredJobsPage() {
    return (
        <CompanyGuard>
            <div className="p-4">
                <h1 className="text-xl font-semibold mb-4">Expired Jobs</h1>
                <RecruiterJobsList tab="expired" />
            </div>
        </CompanyGuard>
    );
} 