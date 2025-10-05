"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
    MapPin,
    Building,
    Users,
    Briefcase,
    Star,
    Calendar,
    FileText,
    Crown,
} from "lucide-react";
import { getImageUrl } from "@/lib/utils";

const ResultItem = ({ company }) => {
    const formatCompanySize = (size) => {
        const numSize = parseInt(size, 10);

        if (numSize <= 10) return "1-10 employees";
        if (numSize <= 50) return "11-50 employees";
        if (numSize <= 200) return "51-200 employees";
        if (numSize <= 500) return "201-500 employees";
        return "500+ employees";
    };

    return (
        <div className={`bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow ${
            company?.proCompany 
                ? "border-blue-500 shadow-blue-200/60" 
                : "border-gray-100"
        }`}>
            <div className="flex items-start">
                {/* Logo */}
                <div className="relative w-20 h-20 flex-shrink-0 mr-4 overflow-hidden rounded-md bg-white border">
                    {company?.proCompany && (
                        <div className="absolute top-1 left-1 z-10 flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold text-white bg-gradient-to-r from-blue-600 to-sky-500 shadow">
                            <Crown size={12} className="text-white" />
                            VIP
                        </div>
                    )}
                    <Link href={`/company/company-detail/${company.id}`}>
                        <Image
                            src={getImageUrl(company.avatar)}
                            alt={company.companyName || "Company logo"}
                            fill
                            className="object-contain p-1"
                            sizes="80px"
                        />
                    </Link>
                </div>

                {/* Thông tin công ty */}
                <div className="flex-1">
                    <div className="flex flex-wrap justify-between mb-2">
                        <h3 className="text-lg font-semibold text-[#0A66C2] hover:underline flex items-center">
                            <Link
                                href={`/company/company-detail/${company.id}`}
                            >
                                {company.companyName}
                            </Link>
                            {company.proCompany && (
                                <span className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200">
                                    <Crown size={12} className="text-blue-600" />
                                    VIP COMPANY
                                </span>
                            )}
                        </h3>

                        <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full flex items-center">
                                <Briefcase className="mr-1 h-3.5 w-3.5" />
                                {company.jobsCount || 0} jobs
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                        {company.locationCity && (
                            <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                                {company.locationCity},{" "}
                                {company.locationCountry}
                            </div>
                        )}

                        {/* {company.categories &&
                            company.categories.length > 0 && (
                                <div className="flex items-center">
                                    <Building className="h-4 w-4 mr-1 text-gray-400" />
                                    {company.categories[0]}
                                    {company.categories.length > 1
                                        ? ` +${company.categories.length - 1}`
                                        : ""}
                                </div>
                            )} */}

                        {company.quantityEmployee && (
                            <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1 text-gray-400" />
                                {formatCompanySize(company.quantityEmployee)}
                            </div>
                        )}

                        {company.foundedYear && (
                            <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                Founded in {company.foundedYear}
                            </div>
                        )}
                    </div>

                    <div className="text-sm text-gray-600 line-clamp-2 flex items-start gap-2">
                        <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span>{company.description}</span>
                    </div>

                    {company.parentCategories &&
                        company.parentCategories.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-2">
                                {company.parentCategories.map(
                                    (category, index) => (
                                        <span
                                            key={`parent-${index}`}
                                            className="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-full"
                                        >
                                            {category}
                                        </span>
                                    )
                                )}
                            </div>
                        )}

                    {/* Hiển thị danh mục con */}
                    {company.categories && company.categories.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-2">
                            {company.categories.map((sub, idx) => (
                                <span
                                    key={`sub-${idx}`}
                                    className="px-2 py-1 text-xs bg-purple-50 text-purple-600 rounded-full"
                                >
                                    {sub}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResultItem;
