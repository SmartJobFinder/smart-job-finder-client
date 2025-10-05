"use client";

import CompanyGuard from "@/components/recruiter/CompanyGuard";
import RecruiterJobsList from "@/components/recruiter/RecruiterJobsList";

export default function ActiveJobsPage() {
    return (
        <CompanyGuard>
            <div className="p-4">
                <h1 className="text-xl font-semibold mb-4">Active Jobs</h1>
                <RecruiterJobsList tab="active" />
            </div>
        </CompanyGuard>
    );
} 