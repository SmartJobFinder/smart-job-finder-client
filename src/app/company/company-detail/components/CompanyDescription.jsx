"use client";

import React, { useState } from "react";
import useCompanyDetailStore from "../store/companyDetailStore";
import { t } from "@/i18n/i18n";

const CompanyDescription = () => {
    const { company } = useCompanyDetailStore();
    const [expanded, setExpanded] = useState(false);

    if (!company) return null;

    return (
        <div className="p-6 bg-white rounded-lg shadow-xl">
            <h2 className="px-4 py-2 text-lg font-semibold text-white bg-blue-700 rounded">
                {t`Company Introduction`}
            </h2>
            
            <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-gray-50">
                        <h3 className="font-medium text-gray-700">Founded year</h3>
                        <p className="mt-1 text-blue-600">{company.foundedYear}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50">
                        <h3 className="font-medium text-gray-700">Staff size</h3>
                        <p className="mt-1 text-blue-600">{company.quantityEmployee}+ employees</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50">
                        <h3 className="font-medium text-gray-700">Jobs posted</h3>
                        <p className="mt-1 text-blue-600">{company.jobsCount || 0} jobs</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gray-50">
                        <h3 className="font-medium text-gray-700">Fields of activity</h3>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {company.categories?.map((category, index) => (
                                <span key={index} className="px-2 py-1 text-xs text-blue-600 bg-blue-100 rounded-full">
                                    {category}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="pt-4 mt-4 border-t border-gray-200">
                    <h3 className="mb-3 font-semibold">Detailed description</h3>
                    <div
                        className={`leading-relaxed text-justify ${
                            expanded ? "" : "line-clamp-6"
                        }`}
                    >
                        {company.description}
                    </div>
                    
                    {company.description && company.description.length > 300 && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="mt-4 text-sm font-medium hover:underline text-[#0A66C2]"
                        >
                            {expanded ? "Collapse" : "View more"}{" "}
                            <span className="ml-1">{expanded ? "▲" : "▼"}</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CompanyDescription;
