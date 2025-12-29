"use client";

import CompanyGuard from "@/components/recruiter/CompanyGuard";
import { t } from "@/i18n/i18n";

export default function AnalyticsPage() {
  return (
    <CompanyGuard>
      <div className="p-4">
        <h1 className="text-xl font-semibold mb-4">{t`Analytics`}</h1>
        <p>{t`Analytics content here...`}</p>
      </div>
    </CompanyGuard>
  );
}
