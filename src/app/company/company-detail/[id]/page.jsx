"use client";

import React, { use } from "react";
import dynamic from "next/dynamic";

// Import động các components
const CompanyDetailContent = dynamic(
    () => import("../pages/CompanyDetailContent"),
    {
        ssr: false,
    },
);

const CompanyDetailPage = ({ params }) => {
    const unwrappedParams = use(params);
    return <CompanyDetailContent companyId={unwrappedParams.id} />;
};

export default CompanyDetailPage;
