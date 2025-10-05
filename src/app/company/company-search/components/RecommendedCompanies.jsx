"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Building, Briefcase, MapPin, Users } from "lucide-react";
import useCompanySearchStore from "../store/companySearchStore";
import { getImageUrl } from "@/lib/utils";

const RecommendedCompanies = () => {
    const { getRecommendedCompanies } = useCompanySearchStore();
    const recommendedCompanies = getRecommendedCompanies();

    if (recommendedCompanies.length === 0) return null;

    return (
        <section id="RecommendedCompanies" className="mt-12">
            <div className="mb-6">
                <h2 className="flex items-center text-2xl font-bold text-gray-800">
                    <Building className="mr-2 h-6 w-6 text-[#0A66C2]" />
                    Recommended companies
                </h2>
                <p className="mt-1 text-gray-600">
                    Based on your profile, interests, and recent activity
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {recommendedCompanies.map((company) => (
                    <Link
                        key={company.id}
                        href={`/company/company-detail/${company.id}`}
                        className="relative p-6 transition-shadow bg-white border rounded-lg hover:shadow-lg"
                    >
                        {/* Job count */}
                        <div className="absolute top-6 right-6 text-[#0A66C2] font-medium flex items-center">
                            <Briefcase className="w-4 h-4 mr-1" />
                            {company.jobsCount || 0} jobs
                        </div>

                        {/* Logo & company name */}
                        <div className="mb-4">
                            <div className="flex items-center justify-center w-16 h-16 mb-4 bg-gray-100 rounded-lg">
                                <Image
                                    src={getImageUrl(company.avatar)}
                                    alt={company.companyName}
                                    width={50}
                                    height={50}
                                    className="object-contain"
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800">
                                {company.companyName}
                            </h3>

                            <div className="flex items-center mt-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4 mr-1" />
                                {company.locationCity},{" "}
                                {company.locationCountry}
                            </div>

                            <div className="flex items-center mt-1 text-sm text-gray-600">
                                <Users className="w-4 h-4 mr-1" />
                                {company.quantityEmployee}+ employees
                            </div>
                        </div>

                        {/* Description */}
                        <p className="mb-4 text-sm text-gray-600 line-clamp-3">
                            {company.description}
                        </p>

                        {/* Category tags */}
                        <div className="flex flex-wrap gap-2 mt-auto">
                            {company.categories &&
                                company.categories.map((category, index) => (
                                    <span
                                        key={index}
                                        className="inline-block px-3 py-1 text-xs text-blue-600 border border-blue-100 rounded-full bg-blue-50"
                                    >
                                        {category}
                                    </span>
                                ))}
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default RecommendedCompanies;
