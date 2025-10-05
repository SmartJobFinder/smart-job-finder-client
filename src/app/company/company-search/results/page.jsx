"use client";

import React from "react";
import dynamic from "next/dynamic";

const ResultPageContent = dynamic(() => import("../pages/ResultPageContent"));

export default function SearchResultsPage() {
    return <ResultPageContent />;
}
