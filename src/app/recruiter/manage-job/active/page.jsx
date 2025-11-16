"use client";

import CompanyGuard from "@/components/recruiter/CompanyGuard";
import RecruiterJobsList from "@/components/recruiter/RecruiterJobsList";
import { t } from "@/i18n/i18n";

export default function ActiveJobsPage() {
    return (
        <CompanyGuard>
            <div className="p-4">
                <h1 className="text-xl font-semibold mb-4">{t`Active Jobs`}</h1>
                <RecruiterJobsList tab="active" />
            </div>
        </CompanyGuard>
    );
}
